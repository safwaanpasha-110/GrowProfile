import crypto from 'crypto'

/**
 * Verify the X-Hub-Signature-256 header from Meta webhooks.
 * Meta signs webhook payloads with HMAC-SHA256 using the app secret.
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string | null,
  appSecret: string
): boolean {
  if (!signature) return false

  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(payload)
    .digest('hex')

  const expected = `sha256=${expectedSig}`

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}

// ─── Parsed webhook event types ───────────────────────────

export interface WebhookCommentEvent {
  type: 'comment'
  igUserId: string // The IG user ID that owns the media
  commentId: string
  mediaId: string
  text: string
  from: {
    id: string       // IGSID of the commenter
    username?: string
  }
  timestamp: number
}

export interface WebhookMessageEvent {
  type: 'message'
  igUserId: string // The IG user ID that received the message
  senderId: string // IGSID of the sender
  recipientId: string
  messageId: string
  text?: string
  timestamp: number
  isEcho?: boolean
}

export interface WebhookMessageReactionEvent {
  type: 'message_reaction'
  igUserId: string
  senderId: string
  reaction: string
  messageId: string
  timestamp: number
}

export interface WebhookPostbackEvent {
  type: 'postback'
  igUserId: string
  senderId: string
  /** Raw postback payload string set when the button was created */
  payload: string
  timestamp: number
}

export type ParsedWebhookEvent =
  | WebhookCommentEvent
  | WebhookMessageEvent
  | WebhookMessageReactionEvent
  | WebhookPostbackEvent

// ─── Parse Instagram webhook payload ──────────────────────

/**
 * Parse the raw Instagram webhook body into structured events.
 * Instagram sends events grouped by object type → entries → changes/messaging.
 */
export function parseWebhookPayload(body: Record<string, unknown>): ParsedWebhookEvent[] {
  const events: ParsedWebhookEvent[] = []
  const objectType = body.object as string

  if (objectType !== 'instagram') return events

  const entries = body.entry as Array<{
    id: string
    time: number
    changes?: Array<{
      field: string
      value: Record<string, unknown>
    }>
    messaging?: Array<Record<string, unknown>>
  }>

  if (!entries || !Array.isArray(entries)) return events

  for (const entry of entries) {
    const igUserId = entry.id

    // ─── Comment events (via changes) ──────────────────
    if (entry.changes) {
      for (const change of entry.changes) {
        if (change.field === 'comments') {
          const v = change.value
          events.push({
            type: 'comment',
            igUserId,
            commentId: String(v.id || ''),
            mediaId: String((v.media as Record<string, unknown>)?.id || ''),
            text: String(v.text || ''),
            from: {
              id: String((v.from as Record<string, unknown>)?.id || ''),
              username: String((v.from as Record<string, unknown>)?.username || ''),
            },
            timestamp: entry.time,
          })
        }
      }
    }

    // ─── Messaging events ──────────────────────────────
    if (entry.messaging) {
      for (const msg of entry.messaging) {
        const sender = msg.sender as Record<string, string> | undefined
        const recipient = msg.recipient as Record<string, string> | undefined
        const timestamp = Number(msg.timestamp) || entry.time

        // Regular message
        if (msg.message) {
          const message = msg.message as Record<string, unknown>
          const isEcho = Boolean(message.is_echo)
          events.push({
            type: 'message',
            igUserId,
            senderId: sender?.id || '',
            recipientId: recipient?.id || '',
            messageId: String(message.mid || ''),
            text: String(message.text || ''),
            timestamp,
            isEcho,
          })
        }

        // Reaction
        if (msg.reaction) {
          const reaction = msg.reaction as Record<string, unknown>
          events.push({
            type: 'message_reaction',
            igUserId,
            senderId: sender?.id || '',
            reaction: String(reaction.reaction || ''),
            messageId: String(reaction.mid || ''),
            timestamp,
          })
        }

        // Postback (button tap)
        if (msg.postback) {
          const postback = msg.postback as Record<string, unknown>
          events.push({
            type: 'postback',
            igUserId,
            senderId: sender?.id || '',
            payload: String(postback.payload || ''),
            timestamp,
          })
        }
      }
    }
  }

  return events
}
