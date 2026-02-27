import { Queue, Worker, QueueEvents } from 'bullmq'
import IORedis from 'ioredis'

// Shared Redis connection for all queues
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

let connection: IORedis | null = null

export function getRedisConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
    })
  }
  return connection
}

// ─── Queue definitions ────────────────────────────────────
export const tokenRefreshQueue = new Queue('token-refresh', {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
})

export const webhookProcessQueue = new Queue('webhook-process', {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 500 },
  },
})

export const dmSenderQueue = new Queue('dm-sender', {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 500 },
  },
})
