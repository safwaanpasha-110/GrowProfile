import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyWebhookSignature, parseWebhookPayload } from '@/lib/webhook-utils'
import { webhookProcessQueue } from '@/lib/queues'
import { isDevWebhookMode } from '@/lib/dev-mode'

const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || ''
const META_APP_SECRET = process.env.META_APP_SECRET || ''

/**
 * GET /api/webhooks/instagram
 * Webhook verification endpoint.
 * Meta sends a GET request with hub.mode, hub.challenge, hub.verify_token
 * to verify the webhook URL during setup.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const mode = searchParams.get('hub.mode')
  const challenge = searchParams.get('hub.challenge')
  const verifyToken = searchParams.get('hub.verify_token')

  console.log('[Webhook] Verification request:', { mode, verifyToken: verifyToken?.substring(0, 8) + '...' })

  if (mode === 'subscribe' && verifyToken === WEBHOOK_VERIFY_TOKEN) {
    console.log('[Webhook] Verification successful')
    // Must return the challenge as plain text (not JSON)
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  console.warn('[Webhook] Verification failed — token mismatch')
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/**
 * POST /api/webhooks/instagram
 * Receives incoming webhook events from Instagram (comments, messages, etc.).
 * Verifies the signature, stores raw event, enqueues for processing.
 */
export async function POST(request: NextRequest) {
  // ─── Read raw body for signature verification ────────
  const rawBody = await request.text()

  // ─── Verify X-Hub-Signature-256 ─────────────────────
  // In DEV_WEBHOOK_MODE, skip signature validation (Meta won't send us webhooks
  // until published). In production, ALWAYS verify to prevent spoofed events.
  const signature = request.headers.get('x-hub-signature-256')

  if (isDevWebhookMode()) {
    console.log('[Webhook] DEV_WEBHOOK_MODE=true — skipping signature verification')
  } else if (META_APP_SECRET) {
    const isValid = verifyWebhookSignature(rawBody, signature, META_APP_SECRET)
    if (!isValid) {
      console.warn('[Webhook] Invalid signature — rejecting')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } else {
    console.error('[Webhook] PRODUCTION MODE but META_APP_SECRET is not set — rejecting')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // ─── Parse the payload ──────────────────────────────
  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Instagram always sends object: "instagram"
  if (body.object !== 'instagram') {
    return NextResponse.json({ error: 'Unknown object type' }, { status: 400 })
  }

  // ─── Parse events from the payload ──────────────────
  const events = parseWebhookPayload(body)

  console.log(`[Webhook] Received ${events.length} event(s)`)

  // ─── Store and enqueue each event ───────────────────
  // We respond 200 quickly and process asynchronously
  const storePromises = events.map(async (event) => {
    try {
      // Determine event type for DB
      const eventType = event.type === 'comment'
        ? 'comments'
        : event.type === 'message'
          ? 'messages'
          : 'messaging_reactions'

      // Try to find the IG account in our system.
      // entry.id from Meta webhooks may be a global IG User ID while we store the
      // app-scoped user ID from graph.instagram.com/me. Try multiple strategies.
      let igAccount = await prisma.instagramAccount.findUnique({
        where: { igUserId: event.igUserId },
        select: { id: true, userId: true },
      })

      // Fallback 1: match by igBusinessId (may hold the global IG User ID)
      if (!igAccount) {
        igAccount = await prisma.instagramAccount.findFirst({
          where: { igBusinessId: event.igUserId, isActive: true },
          select: { id: true, userId: true },
        })
        if (igAccount) {
          console.log(`[Webhook] Matched account via igBusinessId for entry.id=${event.igUserId}`)
        }
      }

      // Fallback 2: for comment events, match via campaign that owns the media.
      // This handles the case where the app-scoped ID stored differs from the
      // global webhook entry.id but the media ID is unambiguous.
      if (!igAccount && event.type === 'comment') {
        const campaignMatch = await prisma.campaign.findFirst({
          where: {
            status: 'ACTIVE',
            media: { some: { igMediaId: event.mediaId } },
          },
          select: { igAccount: { select: { id: true, userId: true, igUserId: true } } },
        })
        if (campaignMatch?.igAccount) {
          igAccount = campaignMatch.igAccount
          console.warn(
            `[Webhook] entry.id=${event.igUserId} not in DB — matched via media ${event.mediaId} ` +
            `→ account igUserId=${campaignMatch.igAccount.igUserId}. ` +
            `Updating igBusinessId to self-heal future lookups.`
          )
          // Self-heal: store the global webhook ID so future lookups are instant
          await prisma.instagramAccount.update({
            where: { id: campaignMatch.igAccount.id },
            data: { igBusinessId: event.igUserId },
          })
        }
      }

      // Store the raw event in the database
      const webhookEvent = await prisma.webhookEvent.create({
        data: {
          igAccountId: igAccount?.id ?? null,
          eventType,
          payload: event as unknown as import('@/lib/generated/prisma').Prisma.InputJsonValue,
          status: 'RECEIVED',
        },
      })

      // Enqueue for processing (only if we have a matching IG account)
      if (igAccount) {
        await webhookProcessQueue.add(
          `process-${webhookEvent.id}`,
          {
            webhookEventId: webhookEvent.id,
            eventType: event.type,
            igAccountId: igAccount.id,
            userId: igAccount.userId,
            event,
          },
          {
            // Dedup by comment/message ID to avoid double-processing
            jobId: event.type === 'comment'
              ? `comment-${event.commentId}`
              : event.type === 'message'
                ? `msg-${event.messageId}`
                : `reaction-${event.messageId}-${event.senderId}`,
          }
        )
      } else {
        // Mark as processed since we can't handle it
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            status: 'PROCESSED',
            error: 'No matching IG account found',
            processedAt: new Date(),
          },
        })
      }
    } catch (err) {
      console.error('[Webhook] Error storing event:', err)
    }
  })

  // Don't await — respond immediately and process in background
  // But in Next.js serverless, we need to await to complete before response
  await Promise.allSettled(storePromises)

  // Instagram expects a 200 response
  return NextResponse.json({ success: true }, { status: 200 })
}
