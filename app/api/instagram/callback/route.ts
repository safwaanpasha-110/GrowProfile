import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { encryptToken } from '@/lib/encryption'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

/**
 * Exchange short-lived token for a long-lived token (60 days).
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
 */
async function fetchIgProfile(
  accessToken: string
): Promise<{ id: string; username: string }> {
  const url = `https://graph.instagram.com/v21.0/me?fields=user_id,username&access_token=${accessToken}`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`IG profile fetch failed: ${err}`)
  }
  const data = await res.json()
  return { id: data.user_id || data.id, username: data.username }
}

/**
 * GET /api/instagram/callback
 * Instagram redirects here after user authorizes the app.
 * Exchanges code for token, stores IG account, redirects to dashboard.
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
    // Optionally check timestamp freshness (e.g., < 10 min)
    if (Date.now() - stateData.ts > 10 * 60 * 1000) {
      throw new Error('State expired')
    }
  } catch {
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set('ig_error', 'Invalid or expired state')
    return NextResponse.redirect(redirectUrl.toString())
  }

  try {
    // ─── Exchange code for short-lived token ─────────────
    const tokenRes = await fetch(
      'https://api.instagram.com/oauth/access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.META_APP_ID!,  // Facebook App ID
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

    // ─── Exchange for long-lived token (60 days) ─────────
    const longLived = await exchangeForLongLivedToken(shortLivedToken)
    const accessToken = longLived.access_token
    const expiresIn = longLived.expires_in // seconds (≈ 5184000 = 60 days)

    // ─── Fetch IG profile ────────────────────────────────
    const igProfile = await fetchIgProfile(accessToken)
    const igUserId = igProfile.id || igUserIdFromToken
    const igUsername = igProfile.username

    // ─── Verify user exists and check plan limits ────────
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

    if (!alreadyConnected && existingCount >= maxAccounts) {
      const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
      redirectUrl.searchParams.set(
        'ig_error',
        `Your ${user.plan?.displayName || 'Starter'} plan allows up to ${maxAccounts} Instagram account(s). Upgrade to connect more.`
      )
      return NextResponse.redirect(redirectUrl.toString())
    }

    // ─── Encrypt & store token ────────────────────────────
    const encrypted = encryptToken(accessToken)
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000)

    const igAccount = await prisma.instagramAccount.upsert({
      where: { igUserId },
      update: {
        igUsername,
        accessTokenEncrypted: encrypted.accessTokenEncrypted,
        accessTokenIv: encrypted.accessTokenIv,
        accessTokenTag: encrypted.accessTokenTag,
        tokenExpiresAt,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        igUserId,
        igUsername,
        accessTokenEncrypted: encrypted.accessTokenEncrypted,
        accessTokenIv: encrypted.accessTokenIv,
        accessTokenTag: encrypted.accessTokenTag,
        tokenExpiresAt,
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
        details: { igUsername, igUserId },
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // ─── Redirect to dashboard with success ───────────────
    const redirectUrl = new URL('/dashboard/account', FRONTEND_URL)
    redirectUrl.searchParams.set('ig_connected', igUsername)
    return NextResponse.redirect(redirectUrl.toString())
  } catch (err: any) {
    console.error('Instagram callback error:', err)

    // Log the failure
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
