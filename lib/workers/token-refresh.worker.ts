/**
 * Token Refresh Worker
 * 
 * Checks all Instagram accounts with tokens expiring within 7 days
 * and refreshes them automatically.
 * 
 * Run with: npx tsx lib/workers/token-refresh.worker.ts
 * Or register as a repeatable job in the BullMQ queue.
 */
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'
import { decryptToken, encryptToken } from '../encryption'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function refreshExpiringTokens() {
  console.log('[token-refresh] Checking for expiring tokens...')

  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // Find accounts with tokens expiring within 7 days (but not yet expired)
  const accounts = await prisma.instagramAccount.findMany({
    where: {
      isActive: true,
      tokenExpiresAt: {
        lte: sevenDaysFromNow,
        gt: new Date(), // Not yet expired
      },
      accessTokenEncrypted: { not: null },
    },
  })

  console.log(`[token-refresh] Found ${accounts.length} account(s) needing refresh`)

  for (const account of accounts) {
    try {
      const currentToken = decryptToken({
        accessTokenEncrypted: account.accessTokenEncrypted,
        accessTokenIv: account.accessTokenIv,
        accessTokenTag: account.accessTokenTag,
      })

      if (!currentToken) {
        console.warn(`[token-refresh] No token for account ${account.id}, skipping`)
        continue
      }

      // Call Instagram API to refresh
      const url = new URL('https://graph.instagram.com/refresh_access_token')
      url.searchParams.set('grant_type', 'ig_refresh_token')
      url.searchParams.set('access_token', currentToken)

      const res = await fetch(url.toString())

      if (!res.ok) {
        const errBody = await res.text()
        console.error(
          `[token-refresh] Failed for @${account.igUsername}: ${errBody}`
        )

        // If 401/403, mark account as inactive
        if (res.status === 401 || res.status === 403) {
          await prisma.instagramAccount.update({
            where: { id: account.id },
            data: { isActive: false },
          })
          console.warn(
            `[token-refresh] Marked @${account.igUsername} as inactive (token invalid)`
          )
        }
        continue
      }

      const data = await res.json()
      const newToken = data.access_token
      const expiresIn = data.expires_in

      // Encrypt and update
      const encrypted = encryptToken(newToken)
      await prisma.instagramAccount.update({
        where: { id: account.id },
        data: {
          accessTokenEncrypted: encrypted.accessTokenEncrypted,
          accessTokenIv: encrypted.accessTokenIv,
          accessTokenTag: encrypted.accessTokenTag,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      })

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: account.userId,
          action: 'INSTAGRAM_TOKEN_AUTO_REFRESHED',
          entityType: 'InstagramAccount',
          entityId: account.id,
          details: {
            igUsername: account.igUsername,
            newExpiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
          },
          ipAddress: 'system',
          userAgent: 'token-refresh-worker',
        },
      })

      console.log(
        `[token-refresh] ✅ Refreshed @${account.igUsername} (expires: ${new Date(Date.now() + expiresIn * 1000).toISOString()})`
      )
    } catch (err) {
      console.error(
        `[token-refresh] Error refreshing @${account.igUsername}:`,
        err
      )
    }

    // Small delay between accounts to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1000))
  }

  console.log('[token-refresh] Done.')
}

// Run if invoked directly
refreshExpiringTokens()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[token-refresh] Fatal error:', err)
    process.exit(1)
  })
