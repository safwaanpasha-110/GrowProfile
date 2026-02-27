/**
 * POST /api/dev/simulate-webhook
 *
 * Dev-only route to simulate Instagram webhook events locally.
 * Enabled ONLY when DEV_WEBHOOK_MODE=true. Returns 404 in production.
 *
 * This route forwards a simulated webhook payload to the same processing
 * pipeline as real Meta webhooks (DB storage → BullMQ → worker processing).
 * Architecture is identical to production — no refactoring needed for go-live.
 *
 * Usage:
 *   curl -X POST http://localhost:4000/api/dev/simulate-webhook \
 *     -H "Content-Type: application/json" \
 *     -d '{ "type": "comment", "igUserId": "...", "mediaId": "...", "text": "INFO", "username": "testuser" }'
 *
 * Supported event types:
 *   - comment: Simulates someone commenting on your post
 *   - message: Simulates someone sending you a DM
 */

import { NextRequest, NextResponse } from 'next/server'
import { isDevWebhookMode } from '@/lib/dev-mode'

export async function POST(request: NextRequest) {
  // ─── Gate: only available in dev webhook mode ───────
  if (!isDevWebhookMode()) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  const body = await request.json()
  const { type } = body as { type: string }

  if (!type || !['comment', 'message'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type. Use "comment" or "message".' },
      { status: 400 }
    )
  }

  let webhookPayload: Record<string, unknown>

  if (type === 'comment') {
    const {
      igUserId,
      mediaId = '17900000000000001',
      text = 'INFO',
      username = 'dev_test_user',
      commenterId = `dev_commenter_${Date.now()}`,
      commentId = `dev_comment_${Date.now()}`,
    } = body

    if (!igUserId) {
      return NextResponse.json(
        { error: 'igUserId is required (your connected IG user ID from the DB)' },
        { status: 400 }
      )
    }

    webhookPayload = {
      object: 'instagram',
      entry: [
        {
          id: igUserId,
          time: Math.floor(Date.now() / 1000),
          changes: [
            {
              field: 'comments',
              value: {
                id: commentId,
                text,
                media: { id: mediaId },
                from: {
                  id: commenterId,
                  username,
                },
              },
            },
          ],
        },
      ],
    }
  } else {
    // type === 'message'
    const {
      igUserId,
      text = 'hello',
      senderId = `dev_sender_${Date.now()}`,
      messageId = `dev_msg_${Date.now()}`,
    } = body

    if (!igUserId) {
      return NextResponse.json(
        { error: 'igUserId is required (your connected IG user ID from the DB)' },
        { status: 400 }
      )
    }

    webhookPayload = {
      object: 'instagram',
      entry: [
        {
          id: igUserId,
          time: Math.floor(Date.now() / 1000),
          messaging: [
            {
              sender: { id: senderId },
              recipient: { id: igUserId },
              timestamp: Date.now(),
              message: {
                mid: messageId,
                text,
              },
            },
          ],
        },
      ],
    }
  }

  // ─── Forward to the real webhook endpoint ───────────
  // We POST to our own webhook endpoint with the simulated payload.
  // The webhook route checks DEV_WEBHOOK_MODE and skips signature validation.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    || process.env.FRONTEND_URL
    || `http://localhost:${process.env.PORT || 4000}`

  const webhookUrl = `${baseUrl}/api/webhooks/instagram`

  console.log(`\n[DevSimulate] Sending simulated ${type} event to webhook pipeline...`)
  console.log(`[DevSimulate] igUserId: ${body.igUserId}`)
  console.log(`[DevSimulate] Payload:`, JSON.stringify(webhookPayload, null, 2))

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    })

    const result = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        {
          error: 'Webhook endpoint returned error',
          status: res.status,
          detail: result,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Simulated ${type} event sent to webhook pipeline`,
      payload: webhookPayload,
      webhookResponse: result,
    })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error(`[DevSimulate] Failed to forward to webhook:`, errMsg)
    return NextResponse.json(
      { error: 'Failed to forward to webhook endpoint', detail: errMsg },
      { status: 500 }
    )
  }
}

/**
 * GET /api/dev/simulate-webhook
 * Returns usage instructions for dev testing.
 */
export async function GET() {
  if (!isDevWebhookMode()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    message: 'Dev Webhook Simulator — POST to this endpoint to simulate Instagram events',
    devMode: true,
    examples: {
      comment: {
        method: 'POST',
        body: {
          type: 'comment',
          igUserId: '<your-ig-user-id-from-db>',
          text: 'INFO',
          mediaId: '17900000000000001',
          username: 'testuser123',
        },
      },
      message: {
        method: 'POST',
        body: {
          type: 'message',
          igUserId: '<your-ig-user-id-from-db>',
          text: 'hello',
          senderId: 'dev_sender_123',
        },
      },
    },
    notes: [
      'igUserId must match an IG account in your database',
      'The event flows through the full pipeline: webhook → DB → BullMQ → worker',
      'DMs are logged to console in dev mode (not sent to Instagram)',
      'Set DEV_WEBHOOK_MODE=false to disable this route for production',
    ],
  })
}
