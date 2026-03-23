import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

/**
 * POST /api/instagram/deauthorize
 *
 * Meta calls this endpoint when a user removes your app from their Instagram
 * ("Revoke App Access" in their IG/FB settings, or you remove the app).
 *
 * Meta sends a signed_request as application/x-www-form-urlencoded body.
 * We must:
 *   1. Verify the HMAC-SHA256 signature using INSTAGRAM_APP_SECRET
 *   2. Decode the payload to extract the Instagram user_id
 *   3. Nullify their token and mark account as disconnected
 *   4. Pause all active campaigns for that account
 *   5. Return 200 OK
 *
 * Dashboard: Instagram Login for Business > Settings > Deauthorize Callback URL
 */

function parseSignedRequest(signedRequest: string, appSecret: string): Record<string, unknown> | null {
  const parts = signedRequest.split('.')
  if (parts.length !== 2) return null

  const [encodedSig, encodedPayload] = parts

  // Re-pad and decode base64url → base64
  const toBase64 = (s: string) => s.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((s.length % 4) || 4)

  const sig = Buffer.from(toBase64(encodedSig), 'base64')
  const payload = Buffer.from(toBase64(encodedPayload), 'base64').toString('utf-8')

  // Verify HMAC-SHA256 signature
  const expectedSig = crypto
    .createHmac('sha256', appSecret)
    .update(encodedPayload)
    .digest()

  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    console.error('[deauthorize] Signature mismatch — request rejected')
    return null
  }

  try {
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.INSTAGRAM_APP_SECRET
  if (!appSecret) {
    console.error('[deauthorize] INSTAGRAM_APP_SECRET is not configured')
    return new NextResponse(null, { status: 500 })
  }

  // Meta sends application/x-www-form-urlencoded
  let signedRequest: string | null = null
  try {
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      signedRequest = formData.get('signed_request') as string | null
    } else {
      // Fallback: try JSON body
      const body = await request.json().catch(() => ({}))
      signedRequest = body.signed_request ?? null
    }
  } catch {
    console.error('[deauthorize] Failed to parse request body')
    return new NextResponse(null, { status: 400 })
  }

  if (!signedRequest) {
    console.warn('[deauthorize] Missing signed_request in body')
    return new NextResponse(null, { status: 400 })
  }

  const decoded = parseSignedRequest(signedRequest, appSecret)
  if (!decoded) {
    console.error('[deauthorize] Invalid signed_request — signature verification failed')
    return new NextResponse(null, { status: 403 })
  }

  // Instagram user_id is the ig_user_id stored in our instagram_accounts table
  const igUserId = String(decoded.user_id ?? '')
  if (!igUserId) {
    console.warn('[deauthorize] signed_request missing user_id')
    return new NextResponse(null, { status: 400 })
  }

  console.log(`[deauthorize] Received deauth for IG user ${igUserId}`)

  try {
    // Find the Instagram account by ig_user_id
    const igAccount = await prisma.instagramAccount.findUnique({
      where: { igUserId },
      select: { id: true, igUsername: true, userId: true },
    })

    if (!igAccount) {
      // Already gone — Meta still wants a 200
      console.warn(`[deauthorize] No account found for ig_user_id ${igUserId}`)
      return new NextResponse(null, { status: 200 })
    }

    // 1. Nullify tokens and mark account as inactive
    await prisma.instagramAccount.update({
      where: { igUserId },
      data: {
        accessTokenEncrypted: null,
        accessTokenIv: null,
        accessTokenTag: null,
        tokenExpiresAt: null,
        pageAccessTokenEncrypted: null,
        pageAccessTokenIv: null,
        pageAccessTokenTag: null,
        subscribedWebhooks: false,
        isActive: false,
        updatedAt: new Date(),
      },
    })

    // 2. Pause all active campaigns on this account
    await prisma.campaign.updateMany({
      where: {
        igAccountId: igAccount.id,
        status: 'ACTIVE',
      },
      data: { status: 'PAUSED' },
    })

    // 3. Audit log
    await prisma.auditLog.create({
      data: {
        userId: igAccount.userId,
        action: 'INSTAGRAM_DEAUTHORIZED',
        entityType: 'InstagramAccount',
        entityId: igAccount.id,
        details: {
          igUserId,
          igUsername: igAccount.igUsername,
          source: 'meta_deauthorize_callback',
        },
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || 'meta',
        userAgent: request.headers.get('user-agent') || 'Meta-webhook',
      },
    })

    console.log(`[deauthorize] ✅ Disconnected @${igAccount.igUsername} (ig_user_id: ${igUserId})`)
  } catch (err) {
    console.error('[deauthorize] DB error:', err)
    // Still return 200 to Meta — internal errors should not cause Meta to retry spam
    return new NextResponse(null, { status: 200 })
  }

  return new NextResponse(null, { status: 200 })
}
