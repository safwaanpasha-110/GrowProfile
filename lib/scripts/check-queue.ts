import 'dotenv/config'
import IORedis from 'ioredis'
import { Queue } from 'bullmq'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
const q = new Queue('dm-sender', { connection: new IORedis(REDIS_URL, { maxRetriesPerRequest: null }) })

async function main() {
  console.log('=== REDIS CONNECTIVITY ===')
  const pong = await redis.ping()
  console.log(`  PING: ${pong}`)

  console.log('\n=== QUEUE COUNTS ===')
  const counts = await q.getJobCounts('waiting', 'active', 'delayed', 'failed', 'completed')
  console.log(`  waiting:   ${counts.waiting}`)
  console.log(`  active:    ${counts.active}`)
  console.log(`  delayed:   ${counts.delayed}`)
  console.log(`  failed:    ${counts.failed}`)
  console.log(`  completed: ${counts.completed}`)

  console.log('\n=== FAILED JOBS (last 5) ===')
  const failed = await q.getFailed(0, 4)
  if (failed.length === 0) console.log('  None')
  for (const j of failed) {
    console.log(`  Job ${j.id}: ${j.failedReason?.substring(0, 120)}`)
    console.log(`    Data: recipientId=${j.data.recipientId} campaign=${j.data.campaignId?.substring(0,8)}`)
  }

  console.log('\n=== COMPLETED JOBS (last 5) ===')
  const completed = await q.getCompleted(0, 4)
  if (completed.length === 0) console.log('  None')
  for (const j of completed) {
    console.log(`  Job ${j.id}: recipientId=${j.data.recipientId}`)
  }

  console.log('\n=== WORKERS ===')
  const workers = await q.getWorkers()
  console.log(`  Active workers: ${workers.length}`)
  workers.forEach(w => console.log(`    ${w.id} (age: ${w.age}ms)`))
}
main().catch(e => console.error('FATAL:', e)).finally(async () => { await q.close(); redis.disconnect() })
