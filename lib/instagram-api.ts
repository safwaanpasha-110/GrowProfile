/**
 * Instagram Graph API helper functions.
 * Handles DM sending, follower checking, comment replies, and webhook subscriptions.
 */

const IG_API_VERSION = 'v25.0'
const IG_API_BASE = `https://graph.facebook.com/${IG_API_VERSION}`

// IG Business Login messaging uses graph.instagram.com (NOT graph.facebook.com).
// The instagram_business_manage_messages scope only works at this endpoint.
const IG_MESSAGING_VERSION = 'v25.0'
const IG_MESSAGING_BASE = `https://graph.instagram.com/${IG_MESSAGING_VERSION}`

// ─── Types ────────────────────────────────────────────────

export interface IgSendMessageResult {
  recipient_id: string
  message_id: string
}

export interface IgCommentReplyResult {
  id: string
}

export interface IgFollowerCheckResult {
  is_following: boolean
}

// ─── Send DM via Instagram Messaging API ──────────────────

/**
 * Send a DM (text) to a user via the IG Messaging API.
 * Uses: POST /{ig-user-id}/messages at graph.instagram.com
 * Requires: instagram_business_manage_messages scope (IG Business Login)
 *
 * IMPORTANT: Use the IG User Token from OAuth (NOT the Page Access Token).
 * Page Access Tokens do NOT have messaging capability at this endpoint.
 *
 * @param igUserId - The IG user ID from IG Business Login OAuth (not igBusinessId)
 * @param recipientId - The IGSID of the recipient (comment.from.id)
 * @param messageText - The text message to send
 * @param accessToken - The IG User Token (from instagram_business_manage_messages OAuth)
 */
export async function sendInstagramDM(
  igUserId: string,
  recipientId: string,
  messageText: string,
  accessToken: string
): Promise<IgSendMessageResult> {
  const url = `${IG_MESSAGING_BASE}/${igUserId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: messageText },
      access_token: accessToken,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG DM send failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ─── Reply to a comment ────────────────────────────────────

/**
 * Post a public reply to a comment on an IG media.
 * Uses: POST /{comment-id}/replies at graph.instagram.com
 * Requires: instagram_business_manage_comments scope (IG Business Login)
 *
 * @param commentId - The comment to reply to
 * @param message - The reply text
 * @param accessToken - IG User Token (from Instagram Business Login)
 */
export async function replyToComment(
  commentId: string,
  message: string,
  accessToken: string
): Promise<IgCommentReplyResult> {
  // Must use graph.instagram.com with the IG User Token — the FB graph endpoint
  // requires a Page Access Token which IG Business Login does not provide.
  const url = `${IG_MESSAGING_BASE}/${commentId}/replies`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      access_token: accessToken,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG comment reply failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ─── Send private reply to a comment ───────────────────────

/**
 * Send a private DM reply to a comment via the Instagram Messaging API.
 * Uses: POST /{ig-user-id}/messages with recipient.comment_id at graph.instagram.com
 * Requires: instagram_business_manage_messages scope (IG Business Login)
 *
 * This is the correct endpoint for Instagram Login for Business.
 * The old graph.facebook.com/{comment-id}/private_replies endpoint requires a
 * Facebook Page Access Token which is NOT available with IG Business Login.
 *
 * @param igUserId - The IG user ID of the business account sending the DM
 * @param commentId - The comment ID to privately reply to
 * @param messageText - The DM text
 * @param accessToken - The IG User Token (from Instagram Business Login)
 */
export async function sendPrivateReply(
  igUserId: string,
  commentId: string,
  messageText: string,
  accessToken: string
): Promise<IgSendMessageResult> {
  const url = `${IG_MESSAGING_BASE}/${igUserId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { comment_id: commentId },
      message: { text: messageText },
      access_token: accessToken,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG private reply failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ─── Check if user follows the account ─────────────────────

/**
 * Check whether a given IGSID follows the business account.
 *
 * Instagram does not expose a direct per-user "is_following" endpoint.
 * We attempt the `GET /{ig-user-id}/followers?user_id={igsid}` shorthand
 * (works on many accounts with instagram_manage_insights permission).
 * If the API is unavailable we fall back to `false` so the follow-gate
 * loop continues until Instagram eventually honours the request.
 *
 * @param igUserId    - App-scoped IG user ID of the business account
 * @param targetIgsid - IGSID of the person we want to check
 * @param accessToken - IG User Token with instagram_manage_insights scope
 */
export async function checkFollowStatus(
  igUserId: string,
  targetIgsid: string,
  accessToken: string
): Promise<boolean> {
  try {
    // Attempt the user_id filter shorthand — returns the user in `data` if they follow
    const url =
      `${IG_MESSAGING_BASE}/${igUserId}/followers` +
      `?user_id=${encodeURIComponent(targetIgsid)}&fields=id&access_token=${encodeURIComponent(accessToken)}`

    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.data) && data.data.length > 0) return true
      // API responded but user not in result → not following
      return false
    }
  } catch {
    // Network or parse error — treat as unknown
  }
  // Default: cannot confirm, keep gating
  return false
}

// ─── Send interactive button message ────────────────────────

export interface InteractiveButton {
  type: 'web_url' | 'postback'
  title: string
  /** Required when type === 'web_url' */
  url?: string
  /** Required when type === 'postback' */
  payload?: string
}

/**
 * Send a button-template interactive message via the Instagram Messaging API.
 *
 * Supports:
 *  - web_url buttons  → open a URL
 *  - postback buttons → fire a postback event back to the webhook when tapped
 *
 * @param igUserId   - The business account's IG user ID (for API path)
 * @param recipient  - Either `{ id: igsid }` or `{ comment_id: commentId }`
 * @param text       - The message body shown above the buttons (max 640 chars)
 * @param buttons    - 1–3 button configs
 * @param accessToken
 */
export async function sendInteractiveMessage(
  igUserId: string,
  recipient: { id?: string; comment_id?: string },
  text: string,
  buttons: InteractiveButton[],
  accessToken: string
): Promise<IgSendMessageResult> {
  if (buttons.length === 0 || buttons.length > 3) {
    throw new Error('sendInteractiveMessage: buttons array must have 1–3 items')
  }

  const url = `${IG_MESSAGING_BASE}/${igUserId}/messages`

  const body: Record<string, unknown> = {
    recipient,
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons: buttons.map((btn) => {
            if (btn.type === 'web_url') {
              return { type: 'web_url', url: btn.url!, title: btn.title }
            }
            return { type: 'postback', title: btn.title, payload: btn.payload! }
          }),
        },
      },
    },
    access_token: accessToken,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG interactive message failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ─── Fetch comment details ─────────────────────────────────

export interface IgCommentDetails {
  id: string
  text: string
  from: { id: string; username: string }
  media: { id: string }
  timestamp: string
}

/**
 * Fetch details of a specific comment.
 */
export async function fetchCommentDetails(
  commentId: string,
  accessToken: string
): Promise<IgCommentDetails> {
  const url = `${IG_API_BASE}/${commentId}?fields=id,text,from,media,timestamp&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG comment fetch failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ─── Fetch comments on a media post ────────────────────────

export interface IgComment {
  id: string
  text: string
  from: { id: string; username: string }
  timestamp: string
}

export type CommentApiMode = 'facebook' | 'instagram'

/**
 * Fetch all comments on a media post.
 * Uses: GET /{media-id}/comments
 * Handles pagination automatically.
 *
 * @param mediaId - The IG media ID
 * @param accessToken - Page/IG access token
 * @param limit - Max comments to fetch (default 100)
 */
export async function fetchMediaComments(
  mediaId: string,
  accessToken: string,
  limit: number = 100,
  mode: CommentApiMode = 'facebook'
): Promise<IgComment[]> {
  const allComments: IgComment[] = []
  let url: string | null = mode === 'instagram'
    ? `https://graph.instagram.com/${IG_MESSAGING_VERSION}/${mediaId}/comments?fields=id,text,username,timestamp,from&limit=50&access_token=${accessToken}`
    : `${IG_API_BASE}/${mediaId}/comments?fields=id,text,from,timestamp&limit=50&access_token=${accessToken}`

  const MAX_PAGES = 10
  let pageCount = 0

  while (url && allComments.length < limit && pageCount < MAX_PAGES) {
    pageCount++
    const res: Response = await fetch(url)
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`IG comments fetch failed (${res.status}): ${err}`)
    }

    const data: any = await res.json()
    if (data.data) {
      const normalized = (data.data as Array<Record<string, unknown>>).map((comment) => {
        const from = (comment.from as Record<string, unknown> | undefined) || undefined
        const username = String(from?.username || comment.username || '')
        const fallbackId = username ? `username:${username}` : `comment:${String(comment.id || '')}`

        return {
          id: String(comment.id || ''),
          text: String(comment.text || ''),
          timestamp: String(comment.timestamp || ''),
          from: {
            id: String(from?.id || fallbackId),
            username,
          },
        } satisfies IgComment
      })

      allComments.push(...normalized)
    }

    // Follow pagination cursor (but stop at MAX_PAGES)
    url = (data.paging?.next && pageCount < MAX_PAGES) ? data.paging.next : null
  }

  return allComments.slice(0, limit)
}

// ─── Subscribe to webhooks ─────────────────────────────────

/**
 * Subscribe an Instagram account to user-level webhook events.
 * Uses graph.instagram.com which accepts the IG User Token from Business Login.
 *
 * This MUST be called per-user after OAuth so Meta sends webhooks
 * where entry.id matches the user's igUserId (app-scoped ID).
 * Without this, Meta sends webhooks with the global IG User ID which
 * may not match the app-scoped ID we store.
 */
export async function subscribeToWebhooks(
  igUserId: string,
  accessToken: string,
  subscribedFields: string = 'comments,messages'
): Promise<boolean> {
  // Must use graph.instagram.com — graph.facebook.com rejects IG User Tokens
  const url = `${IG_MESSAGING_BASE}/${igUserId}/subscribed_apps`

  const body = new URLSearchParams({
    subscribed_fields: subscribedFields,
    access_token: accessToken,
  })

  const res = await fetch(url, {
    method: 'POST',
    body,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`Webhook subscription failed for ${igUserId}:`, err)
    return false
  }

  const data = await res.json()
  return data.success === true
}

// ─── Unsubscribe from webhooks ─────────────────────────────

export async function unsubscribeFromWebhooks(
  igUserId: string,
  accessToken: string
): Promise<boolean> {
  const url = `${IG_MESSAGING_BASE}/${igUserId}/subscribed_apps`

  const res = await fetch(url, {
    method: 'DELETE',
    body: new URLSearchParams({ access_token: accessToken }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`Webhook unsubscription failed for ${igUserId}:`, err)
    return false
  }

  return true
}

// ─── Token Debug & Page Token Helpers ────────────────────────

export interface TokenDebugData {
  app_id: string
  type: string
  application: string
  /** Unix timestamp. 0 means "never expires". */
  expires_at: number
  /** Unix timestamp for data access expiry. */
  data_access_expires_at: number
  is_valid: boolean
  scopes: string[]
  user_id?: string
}

/**
 * Inspect a token using the Graph API's /debug_token endpoint.
 * Returns validity, expiry timestamp (0 = never), scopes, etc.
 *
 * @param inputToken  - The token to inspect
 * @param appId       - Facebook App ID
 * @param appSecret   - Facebook App Secret
 */
export async function debugToken(
  inputToken: string,
  appId: string,
  appSecret: string
): Promise<TokenDebugData> {
  const appToken = `${appId}|${appSecret}`
  const url = `${IG_API_BASE}/debug_token?input_token=${encodeURIComponent(inputToken)}&access_token=${encodeURIComponent(appToken)}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`debug_token failed (${res.status}): ${err}`)
  }

  const json = await res.json()
  if (json.error) throw new Error(`debug_token error: ${JSON.stringify(json.error)}`)
  return json.data as TokenDebugData
}

export interface FacebookPage {
  id: string
  name: string
  access_token: string
}

/**
 * Fetch the Facebook Pages the given user manages, including their Page Access Tokens.
 * Requires a long-lived User token or IG User token.
 * The returned Page tokens are non-expiring when derived from a long-lived user token.
 *
 * @param userToken - Long-lived IG or Facebook User access token
 */
export async function fetchPagesForUser(userToken: string): Promise<FacebookPage[]> {
  const url = `${IG_API_BASE}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userToken)}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`fetch /me/accounts failed (${res.status}): ${err}`)
  }

  const json = await res.json()
  if (json.error) throw new Error(`/me/accounts error: ${JSON.stringify(json.error)}`)
  return (json.data || []) as FacebookPage[]
}

// ─── Rate limiting helper ──────────────────────────────────

/**
 * Instagram API rate limits:
 * - Messaging: 250 messages per user per 24 hours
 * - Comments: Platform limits apply
 *
 * This helper tracks and enforces rate limits via Redis.
 */
export const RATE_LIMITS = {
  DM_PER_HOUR: 40,       // Conservative: 40 DMs per IG account per hour
  DM_PER_DAY: 200,       // Conservative: 200 DMs per IG account per day
  COMMENT_REPLY_PER_HOUR: 30,
  API_CALLS_PER_HOUR: 200,
}

/**
 * Build a rate limit key for Redis.
 */
export function rateLimitKey(
  igAccountId: string,
  action: 'dm' | 'comment_reply' | 'api_call',
  window: 'hour' | 'day'
): string {
  const now = new Date()
  const windowKey = window === 'hour'
    ? `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}-${now.getUTCHours()}`
    : `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`
  return `ratelimit:${igAccountId}:${action}:${window}:${windowKey}`
}
