import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedHandler } from '@/lib/api-middleware'
import prisma from '@/lib/prisma'
import { decryptToken, encryptToken } from '@/lib/encryption'
import { fetchPagesForUser } from '@/lib/instagram-api'
import { AuthUser } from '@/lib/auth'

/**
 * GET /api/instagram/accounts
 * List all Instagram accounts for the authenticated user.
 */
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  const accounts = await prisma.instagramAccount.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      igUserId: true,
      igUsername: true,
      isActive: true,
      tokenExpiresAt: true,
      subscribedWebhooks: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          campaigns: true,
          interactions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Add token health status (is it expiring soon?)
  const enriched = accounts.map((acc) => ({
    ...acc,
    tokenStatus: !acc.tokenExpiresAt
      ? 'unknown'
      : acc.tokenExpiresAt < new Date()
      ? 'expired'
      : acc.tokenExpiresAt < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ? 'expiring_soon'
      : 'valid',
    campaignCount: acc._count.campaigns,
    interactionCount: acc._count.interactions,
  }))

  return NextResponse.json({ success: true, accounts: enriched })
})

/**
 * DELETE /api/instagram/accounts
 * Disconnect an Instagram account. Pauses related campaigns.
 */
export const DELETE = withAuth(async (request: NextRequest, user: AuthUser) => {
  const { accountId } = await request.json()

  if (!accountId) {
    return NextResponse.json(
      { error: 'accountId is required' },
      { status: 400 }
    )
  }

  const account = await prisma.instagramAccount.findUnique({
    where: { id: accountId },
  })

  if (!account || account.userId !== user.id) {
    return NextResponse.json(
      { error: 'Account not found' },
      { status: 404 }
    )
  }

  // Pause all campaigns tied to this account
  await prisma.campaign.updateMany({
    where: { igAccountId: accountId },
    data: { status: 'PAUSED' },
  })

  // Delete the account
  await prisma.instagramAccount.delete({
    where: { id: accountId },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'INSTAGRAM_ACCOUNT_DISCONNECTED',
      entityType: 'InstagramAccount',
      entityId: accountId,
      details: { igUsername: account.igUsername, igUserId: account.igUserId },
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  })

  return NextResponse.json({ success: true })
})

/**
 * POST /api/instagram/accounts
 * Refresh an Instagram account's long-lived token.
 * Long-lived tokens can be refreshed as long as they haven't expired yet.
 */
export const POST = withAuth(async (request: NextRequest, user: AuthUser) => {
  const { accountId, action } = await request.json()

  if (!accountId || action !== 'refresh_token') {
    return NextResponse.json(
      { error: 'accountId and action="refresh_token" required' },
      { status: 400 }
    )
  }

  const account = await prisma.instagramAccount.findUnique({
    where: { id: accountId },
  })

  if (!account || account.userId !== user.id) {
    return NextResponse.json(
      { error: 'Account not found' },
      { status: 404 }
    )
  }

  // Decrypt current token
  const currentToken = decryptToken({
    accessTokenEncrypted: account.accessTokenEncrypted,
    accessTokenIv: account.accessTokenIv,
    accessTokenTag: account.accessTokenTag,
  })

  if (!currentToken) {
    return NextResponse.json(
      { error: 'No token to refresh' },
      { status: 400 }
    )
  }

  // Check if token is already expired
  if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Token is already expired. Please reconnect the account.' },
      { status: 400 }
    )
  }

  try {
    // Refresh long-lived IG token via Instagram API
    // Note: Page Access Tokens (stored separately) do NOT expire.
    const url = new URL('https://graph.instagram.com/refresh_access_token')
    url.searchParams.set('grant_type', 'ig_refresh_token')
    url.searchParams.set('access_token', currentToken)

    const res = await fetch(url.toString())
    if (!res.ok) {
      const errBody = await res.text()
      console.error('Token refresh failed:', errBody)
      throw new Error('Failed to refresh token with Instagram')
    }

    const data = await res.json()
    const newToken = data.access_token
    const expiresIn = data.expires_in // seconds

    // Encrypt & update
    const encrypted = encryptToken(newToken)
    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        accessTokenEncrypted: encrypted.accessTokenEncrypted,
        accessTokenIv: encrypted.accessTokenIv,
        accessTokenTag: encrypted.accessTokenTag,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'INSTAGRAM_TOKEN_REFRESHED',
        entityType: 'InstagramAccount',
        entityId: accountId,
        details: {
          igUsername: account.igUsername,
          newExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        },
        ipAddress:
          request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // ── Re-derive Page Access Token from the freshly refreshed IG user token ─
    // Page tokens derived from long-lived user tokens never expire, but we
    // always keep them in sync so revocations are caught on the next refresh.
    let pageTokenRefreshed = false
    if (account.pageId) {
      try {
        const pages = await fetchPagesForUser(newToken)
        const matchedPage = pages.find((p) => p.id === account.pageId)
        if (matchedPage) {
          const encryptedPage = encryptToken(matchedPage.access_token)
          await prisma.instagramAccount.update({
            where: { id: accountId },
            data: {
              pageAccessTokenEncrypted: encryptedPage.accessTokenEncrypted,
              pageAccessTokenIv: encryptedPage.accessTokenIv,
              pageAccessTokenTag: encryptedPage.accessTokenTag,
            },
          })
          pageTokenRefreshed = true
        }
      } catch (pageErr) {
        // Non-fatal — log but don't block the IG token refresh response
        console.error('[accounts] Failed to re-derive page token:', pageErr)
      }
    }

    return NextResponse.json({
      success: true,
      tokenExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      pageTokenRefreshed,
    })
  } catch (err: any) {
    console.error('Token refresh error:', err)
    return NextResponse.json(
      { error: err.message || 'Token refresh failed' },
      { status: 500 }
    )
  }
})
