import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { encryptToken } from '@/lib/encryption'
import { subscribeToWebhooks } from '@/lib/instagram-api'

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://growprofile.in'
const GRAPH_BASE = 'https://graph.facebook.com/v25.0'

/**
 * Exchange short-lived IG token for a long-lived IG token (60 days).
 */
async function exchangeForLongLivedToken(shortToken: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
}> {
  const url = new URL('https://graph.instagram.com/access_token')
  url.searchParams.set('grant_type', 'ig_exchange_token')
  url.searchParams.set('client_secret', process.env.INSTAGRAM_APP_SECRET!)
  url.searchParams.set('access_token', shortToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Long-lived token exchange failed: ${err}`)
  }
  return res.json()
}

/**
 * Fetch the Instagram user profile.
 * Returns both the app-scoped `id` (for API calls) and the global `user_id`
 * (which Meta uses as entry.id in webhook payloads).
 */
async function fetchIgProfile(
  accessToken: string
): Promise<{ id: string; userId: string; username: string }> {
  const url = `https://graph.instagram.com/v25.0/me?fields=id,user_id,username&access_token=${accessToken}`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG profile fetch failed: ${err}`)
  }
  const data = await res.json()
  return { id: data.id, userId: String(data.user_id || data.id), username: data.username }
}

/**
 * GET /api/instagram/callback
 * Instagram redirects here after user authorizes the app.
 * Flow:
 *   1. Exchange code for short-lived IG token
 *   2. Exchange for long-lived IG token
 *   3. Fetch IG profile (gets the IG Business ID directly)
 *   4. Store everything: IG token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')
  const errorDescription = searchParams.get('error_description')

  // ─── Handle denial / error ─────────────────────────────
  if (error) {
    console.error('Instagram auth denied:', { error, errorReason, errorDescription })
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set('ig_error', errorDescription || error)
    return NextResponse.redirect(redirectUrl.toString())
  }

  if (!code || !stateParam) {
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set('ig_error', 'Missing authorization code')
    return NextResponse.redirect(redirectUrl.toString())
  }

  // ─── Decode state to get userId ────────────────────────
  let userId: string
  try {
    const stateData = JSON.parse(
      Buffer.from(stateParam, 'base64url').toString()
    )
    userId = stateData.userId
    if (Date.now() - stateData.ts > 10 * 60 * 1000) {
      throw new Error('State expired')
    }
  } catch {
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set('ig_error', 'Invalid or expired state')
    return NextResponse.redirect(redirectUrl.toString())
  }

  try {
    // ─── Step 1: Exchange code for short-lived IG token ───
    const tokenRes = await fetch(
      'https://api.instagram.com/oauth/access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.META_APP_ID!,
          client_secret: process.env.INSTAGRAM_APP_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
          code,
        }),
      }
    )

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text()
      console.error('Token exchange failed:', errBody)
      throw new Error('Failed to exchange authorization code')
    }

    const tokenData = await tokenRes.json()
    const shortLivedToken: string = tokenData.access_token
    const igUserIdFromToken: string = String(tokenData.user_id)

    // ─── Step 2: Exchange for long-lived IG token (60 days)
    const longLived = await exchangeForLongLivedToken(shortLivedToken)
    const igAccessToken = longLived.access_token
    const expiresIn = longLived.expires_in

    // ─── Step 3: Fetch IG profile (gets the IG Business ID directly)
    const igProfile = await fetchIgProfile(igAccessToken)
    const igUserId = igProfile.id || igUserIdFromToken  // App-scoped ID — used for API calls
    const igUsername = igProfile.username
    // Global user_id — this is what Meta sends as entry.id in webhook payloads
    const igBusinessId = igProfile.userId || igProfile.id

    // ─── Step 4: Verify user exists and check plan limits ─
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true, instagramAccounts: true },
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    const maxAccounts = user.plan?.maxIgAccounts ?? 1
    const existingCount = user.instagramAccounts.length
    const alreadyConnected = user.instagramAccounts.find(
      (a) => a.igUserId === igUserId
    )

    // ─── Block: IG account already connected to a DIFFERENT user ───
    if (!alreadyConnected) {
      const takenByOther = await prisma.instagramAccount.findFirst({
        where: { igUserId, userId: { not: userId } },
      })
      if (takenByOther) {
        const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
        redirectUrl.searchParams.set(
          'ig_error',
          `@${igUsername} is already connected to another GrowProfile account. Disconnect it from that account first.`
        )
        return NextResponse.redirect(redirectUrl.toString())
      }
    }

    if (!alreadyConnected && existingCount >= maxAccounts) {
      const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
      redirectUrl.searchParams.set(
        'ig_error',
        `Your ${user.plan?.displayName || 'Starter'} plan allows up to ${maxAccounts} Instagram account(s). Upgrade to connect more.`
      )
      return NextResponse.redirect(redirectUrl.toString())
    }

    // ─── Step 5: Encrypt & store IG token ────
    const encryptedIgToken = encryptToken(igAccessToken)
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000)

    const igAccount = await prisma.instagramAccount.upsert({
      where: { igUserId },
      update: {
        igUsername,
        accessTokenEncrypted: encryptedIgToken.accessTokenEncrypted,
        accessTokenIv: encryptedIgToken.accessTokenIv,
        accessTokenTag: encryptedIgToken.accessTokenTag,
        tokenExpiresAt,
        igBusinessId: igBusinessId || undefined,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        igUserId,
        igUsername,
        accessTokenEncrypted: encryptedIgToken.accessTokenEncrypted,
        accessTokenIv: encryptedIgToken.accessTokenIv,
        accessTokenTag: encryptedIgToken.accessTokenTag,
        tokenExpiresAt,
        igBusinessId,
        isActive: true,
      },
    })

    // ─── Audit log ────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'INSTAGRAM_ACCOUNT_CONNECTED',
        entityType: 'InstagramAccount',
        entityId: igAccount.id,
        details: {
          igUsername,
          igUserId,
          igBusinessId,
        },
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    console.log(
      `[IG Callback] ✅ Stored IG account @${igUsername} (app-scoped: ${igUserId}, global/webhook: ${igBusinessId}) for user ${userId}`
    )

    // ─── Step 7: Subscribe to webhooks (comments + messages) ─
    // Use igBusinessId (global user_id) as the path param — this is the ID
    // Meta sends as entry.id in webhooks. Using the app-scoped igUserId here
    // causes the subscription to be ignored or mapped to the wrong ID.
    try {
      const subscribeAsId = igBusinessId || igUserId
      const subscribed = await subscribeToWebhooks(subscribeAsId, igAccessToken)
      if (subscribed) {
        await prisma.instagramAccount.update({
          where: { id: igAccount.id },
          data: { subscribedWebhooks: true },
        })
        console.log(`[IG Callback] ✅ Webhook subscription active for @${igUsername}`)
      } else {
        console.warn(`[IG Callback] ⚠️ Webhook subscription failed for @${igUsername} — will need manual setup`)
      }
    } catch (webhookErr) {
      // Non-fatal — the account is still connected
      console.error('[IG Callback] Webhook subscription error (non-fatal):', webhookErr)
    }

    // ─── Redirect to dashboard with success ───────────────
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    if (alreadyConnected) {
      // Same user reconnecting — token refreshed
      redirectUrl.searchParams.set('ig_already_connected', igUsername)
    } else {
      redirectUrl.searchParams.set('ig_connected', igUsername)
    }
    return NextResponse.redirect(redirectUrl.toString())
  } catch (err: any) {
    console.error('Instagram callback error:', err)

    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'INSTAGRAM_AUTH_FAILED',
          entityType: 'InstagramAccount',
          details: { error: err.message || String(err) },
          ipAddress:
            request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      })
    } catch {
      // ignore logging errors
    }

    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set(
      'ig_error',
      err.message || 'Failed to connect Instagram'
    )
    return NextResponse.redirect(redirectUrl.toString())
  }
}
