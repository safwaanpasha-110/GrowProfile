/**
 * Re-process webhook events that failed with "No matching IG account found".
 * Run AFTER backfill-business-ids.ts has been executed.
 *
 * Run: npx tsx reprocess-stuck-events.ts
 */
import 'dotenv/config'
import { PrismaClient } from './lib/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import IORedis from 'ioredis'
import { Queue } from 'bullmq'

const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

const webhookProcessQueue = new Queue('webhook-process', {
  connection: new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 500 },
  },
})

async function main() {
  const stuckEvents = await prisma.webhookEvent.findMany({
    where: {
      igAccountId: null,
      error: 'No matching IG account found',
    },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`Found ${stuckEvents.length} stuck event(s) to re-process`)

  let requeued = 0
  let stillFailed = 0

  for (const event of stuckEvents) {
    const payload = event.payload as Record<string, unknown>
    const igUserId = payload.igUserId as string | undefined
    const mediaId = payload.mediaId as string | undefined
    const eventType = event.eventType

    if (!igUserId) {
      console.log(`  [${event.id}] No igUserId in payload — skipping`)
      stillFailed++
      continue
    }

    // Attempt 1: direct igUserId match
    let igAccount = await prisma.instagramAccount.findUnique({
      where: { igUserId },
      select: { id: true, userId: true },
    })

    // Attempt 2: igBusinessId match (now populated after backfill)
    if (!igAccount) {
      igAccount = await prisma.instagramAccount.findFirst({
        where: { igBusinessId: igUserId, isActive: true },
        select: { id: true, userId: true },
      })
    }

    // Attempt 3: match via campaign media (for comment events)
    if (!igAccount && eventType === 'comments' && mediaId) {
      const campaignMatch = await prisma.campaign.findFirst({
        where: {
          status: 'ACTIVE',
          media: { some: { igMediaId: mediaId } },
        },
        select: { igAccount: { select: { id: true, userId: true, igUserId: true } } },
      })
      if (campaignMatch?.igAccount) {
        igAccount = campaignMatch.igAccount
        await prisma.instagramAccount.update({
          where: { id: campaignMatch.igAccount.id },
          data: { igBusinessId: igUserId },
        })
        console.log(`  [${event.id}] Matched via media ${mediaId} (self-healed igBusinessId)`)
      }
    }

    if (!igAccount) {
      console.log(`  [${event.id}] Still no account match for igUserId=${igUserId} — skipping`)
      stillFailed++
      continue
    }

    // Update event to point to the correct account and reset status
    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: {
        igAccountId: igAccount.id,
        status: 'RECEIVED',
        error: null,
        processedAt: null,
      },
    })

    // Re-enqueue for processing
    const commentId = payload.commentId as string | undefined
    const messageId = payload.messageId as string | undefined

    const jobId = eventType === 'comments' && commentId
      ? `comment-${commentId}`
      : eventType === 'messages' && messageId
        ? `msg-${messageId}`
        : `retry-${event.id}`

    await webhookProcessQueue.add(
      `process-${event.id}`,
      {
        webhookEventId: event.id,
        eventType: eventType === 'comments' ? 'comment' : eventType === 'messages' ? 'message' : 'reaction',
        igAccountId: igAccount.id,
        userId: igAccount.userId,
        event: payload,
      },
      { jobId },
    )

    console.log(`  ✓ [${event.id}] Re-enqueued as ${jobId}`)
    requeued++
  }

  console.log(`\nDone. Re-queued: ${requeued}, still failed: ${stillFailed}`)
  await prisma.$disconnect()
  await pool.end()
  await connection.quit()
}

main().catch(async (err) => {
  console.error('Fatal:', err)
  await prisma.$disconnect()
  await pool.end()
  await connection.quit()
  process.exit(1)
})
