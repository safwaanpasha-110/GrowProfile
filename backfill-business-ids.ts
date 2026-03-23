/**
 * Backfill igBusinessId for all Instagram accounts that have igBusinessId = null.
 *
 * The global Meta user_id (igBusinessId) is needed to match incoming webhook
 * entry.id values to our stored accounts. Accounts connected before the OAuth
 * fix never had this stored.
 *
 * Run: npx tsx backfill-business-ids.ts
 */
import 'dotenv/config'
import { PrismaClient } from './lib/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { decryptToken } from './lib/encryption.js'

const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function fetchGlobalUserId(accessToken: string): Promise<string | null> {
  const url = `https://graph.instagram.com/v25.0/me?fields=id,user_id&access_token=${accessToken}`
  const res = await fetch(url)
  const data = await res.json() as { id?: string; user_id?: number | string; error?: { message: string } }
  if (data.error) {
    console.error('  API error:', data.error.message)
    return null
  }
  // user_id is the global Meta IG User ID (matches webhook entry.id)
  return data.user_id ? String(data.user_id) : null
}

async function main() {
  const accounts = await prisma.instagramAccount.findMany({
    where: { igBusinessId: null },
    select: {
      id: true,
      igUsername: true,
      igUserId: true,
      accessTokenEncrypted: true,
      accessTokenIv: true,
      accessTokenTag: true,
    },
  })

  console.log(`Found ${accounts.length} account(s) with igBusinessId = null`)

  for (const account of accounts) {
    console.log(`\nProcessing @${account.igUsername} (igUserId=${account.igUserId})`)

    const token = decryptToken({
      accessTokenEncrypted: account.accessTokenEncrypted,
      accessTokenIv: account.accessTokenIv,
      accessTokenTag: account.accessTokenTag,
    })

    if (!token) {
      console.error('  Could not decrypt access token — skipping')
      continue
    }

    const globalUserId = await fetchGlobalUserId(token)
    if (!globalUserId) {
      console.error('  Could not fetch global user_id from Instagram API — skipping')
      continue
    }

    await prisma.instagramAccount.update({
      where: { id: account.id },
      data: { igBusinessId: globalUserId },
    })

    console.log(`  ✓ Set igBusinessId = ${globalUserId}`)
  }

  console.log('\nBackfill complete.')
  await prisma.$disconnect()
  await pool.end()
}

main().catch(async (err) => {
  console.error('Fatal error:', err)
  await prisma.$disconnect()
  await pool.end()
  process.exit(1)
})
