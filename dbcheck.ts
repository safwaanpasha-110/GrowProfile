import 'dotenv/config'
import { PrismaClient } from './lib/generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)
async function main() {
  // Which account owns global ID 17841466812255720?
  const accs = await prisma.instagramAccount.findMany({
    select: { id: true, igUserId: true, igBusinessId: true, igUsername: true, isActive: true }
  })
  console.log('ACCOUNTS:', JSON.stringify(accs, null, 2))

  // Does media 18010447874259732 exist in any campaign?
  const media = await prisma.campaignMedia.findMany({
    where: { igMediaId: '18010447874259732' },
    select: { id: true, igMediaId: true, campaign: { select: { id: true, name: true, status: true, igAccountId: true } } }
  })
  console.log('MEDIA MATCH:', JSON.stringify(media, null, 2))

  await prisma.$disconnect()
}
main().catch(console.error)

