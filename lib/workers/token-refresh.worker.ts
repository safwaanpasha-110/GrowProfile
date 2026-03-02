/**
 * Token Refresh Worker
 *
 * Responsibilities:
 *   1. refreshExpiringTokens()  — refresh IG user tokens expiring within 7 days,
 *                                 then re-derive the linked Page Access Token.
 *   2. validatePageTokens()     — for ALL active accounts, inspect the stored Page
 *                                 token via /debug_token; re-derive from the IG user
 *                                 token if it is invalid or has expired.
 *
 * Page Access Tokens obtained from a long-lived IG user token NEVER expire
 * (expires_at = 0 in the debug_token response), but they CAN be invalidated
 * when the user changes their password or revokes the app. This file handles both.
 *
 * Run with: bun run lib/workers/token-refresh.worker.ts
 * Or register as a repeatable BullMQ job.
 */
import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'
import { decryptToken, encryptToken } from '../encryption'
import { fetchPagesForUser } from '../instagram-api'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Helper: re-derive and store Page Access Token ───────────────────────────

async function rederivePageToken(
  accountId: string,
  pageId: string,
  igUsername: string,
  userId: string,
  igUserToken: string
): Promise<boolean> {
  try {
    const pages = await fetchPagesForUser(igUserToken)
    const matchedPage = pages.find((p) => p.id === pageId)

    if (!matchedPage) {
      console.warn(
        `[token-refresh] Page ${pageId} not found in /me/accounts for @${igUsername}`
      )
      return false
    }

    const encrypted = encryptToken(matchedPage.access_token)
    await prisma.instagramAccount.update({
      where: { id: accountId },
      data: {
        pageAccessTokenEncrypted: encrypted.accessTokenEncrypted,
        pageAccessTokenIv: encrypted.accessTokenIv,
        pageAccessTokenTag: encrypted.accessTokenTag,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PAGE_TOKEN_AUTO_REFRESHED',
        entityType: 'InstagramAccount',
        entityId: accountId,
        details: { igUsername, pageId: matchedPage.id, pageName: matchedPage.name },
        ipAddress: 'system',
        userAgent: 'token-refresh-worker',
      },
    })

    console.log(
      `[token-refresh] ✅ Page token re-derived for @${igUsername} (page ${matchedPage.id})`
    )
    return true
  } catch (err) {
    console.error(
      `[token-refresh] Failed to re-derive page token for @${igUsername}:`,
      err
    )
    return false
  }
}

// ─── Step 1: Refresh expiring IG user tokens ─────────────────────────────────

async function refreshExpiringTokens() {
  console.log('[token-refresh] Checking for expiring IG user tokens...')

  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const accounts = await prisma.instagramAccount.findMany({
    where: {
      isActive: true,
      tokenExpiresAt: {
        lte: sevenDaysFromNow,
        gt: new Date(),
      },
      accessTokenEncrypted: { not: null },
    },
  })

  console.log(`[token-refresh] Found ${accounts.length} account(s) with expiring IG tokens`)

  for (const account of accounts) {
    try {
      const currentToken = decryptToken({
        accessTokenEncrypted: account.accessTokenEncrypted,
        accessTokenIv: account.accessTokenIv,
        accessTokenTag: account.accessTokenTag,
      })

      if (!currentToken) {
        console.warn(`[token-refresh] No IG token for @${account.igUsername}, skipping`)
        continue
      }

      // ── Refresh the 60-day IG user token ──────────────────────────────────
      const refreshUrl = new URL('https://graph.instagram.com/refresh_access_token')
      refreshUrl.searchParams.set('grant_type', 'ig_refresh_token')
      refreshUrl.searchParams.set('access_token', currentToken)

      const res = await fetch(refreshUrl.toString())

      if (!res.ok) {
        const errBody = await res.text()
        console.error(`[token-refresh] IG token refresh failed for @${account.igUsername}: ${errBody}`)

        if (res.status === 401 || res.status === 403) {
          await prisma.instagramAccount.update({
            where: { id: account.id },
            data: { isActive: false },
          })
          console.warn(`[token-refresh] Marked @${account.igUsername} as inactive (IG token invalid)`)
        }
        continue
      }

      const data = await res.json()
      const newIgToken = data.access_token
      const expiresIn: number = data.expires_in

      const encrypted = encryptToken(newIgToken)
      await prisma.instagramAccount.update({
        where: { id: account.id },
        data: {
          accessTokenEncrypted: encrypted.accessTokenEncrypted,
          accessTokenIv: encrypted.accessTokenIv,
          accessTokenTag: encrypted.accessTokenTag,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      })

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
        `[token-refresh] ✅ IG token refreshed for @${account.igUsername} (expires: ${new Date(Date.now() + expiresIn * 1000).toISOString()})`
      )

      // ── Re-derive Page Access Token using the fresh IG user token ─────────
      // Page tokens from long-lived user tokens don't expire on their own, but
      // re-deriving ensures we always have the latest valid token.
      if (account.pageId) {
        await rederivePageToken(
          account.id,
          account.pageId,
          account.igUsername,
          account.userId,
          newIgToken
        )
      }
    } catch (err) {
      console.error(`[token-refresh] Error refreshing @${account.igUsername}:`, err)
    }

    await new Promise((r) => setTimeout(r, 1000))
  }
}

// ─── Step 2: Validate all Page tokens ────────────────────────────────────────
//
// Even if the IG user token is not expiring yet, the Page token can be
// invalidated (e.g. password change, app revocation). We probe the Page token
// with a cheap /me call and re-derive from the IG user token when it fails.
//
// Note: debug_token requires that the app used to inspect the token is the SAME
// app that issued it. Since Page tokens may be issued by different flows (manual
// setup, OAuth, API Explorer), we use a direct /me probe as a universal check.

async function validatePageTokens() {
  console.log('[token-refresh] Validating Page tokens for all active accounts...')

  const accounts = await prisma.instagramAccount.findMany({
    where: {
      isActive: true,
      pageId: { not: null },
      pageAccessTokenEncrypted: { not: null },
    },
  })

  console.log(`[token-refresh] Found ${accounts.length} account(s) with Page tokens`)

  for (const account of accounts) {
    try {
      const pageToken = decryptToken({
        accessTokenEncrypted: account.pageAccessTokenEncrypted,
        accessTokenIv: account.pageAccessTokenIv,
        accessTokenTag: account.pageAccessTokenTag,
      })

      if (!pageToken) {
        console.warn(`[token-refresh] Could not decrypt page token for @${account.igUsername}`)
        continue
      }

      // Probe the Page token with a cheap /me call
      const probeRes = await fetch(
        `https://graph.facebook.com/v25.0/me?fields=id,name&access_token=${encodeURIComponent(pageToken)}`
      )
      const probeData = await probeRes.json()

      const isValid = probeRes.ok && probeData.id && !probeData.error

      if (!isValid) {
        const errMsg = probeData.error?.message || `HTTP ${probeRes.status}`
        console.warn(
          `[token-refresh] Page token INVALID for @${account.igUsername} (${errMsg}) — attempting re-derivation`
        )

        // Decrypt the IG user token to re-fetch Pages
        const igToken = decryptToken({
          accessTokenEncrypted: account.accessTokenEncrypted,
          accessTokenIv: account.accessTokenIv,
          accessTokenTag: account.accessTokenTag,
        })

        if (!igToken) {
          console.error(
            `[token-refresh] No IG user token available to re-derive page token for @${account.igUsername}`
          )
          await prisma.instagramAccount.update({
            where: { id: account.id },
            data: { isActive: false },
          })
          continue
        }

        const ok = await rederivePageToken(
          account.id,
          account.pageId!,
          account.igUsername,
          account.userId,
          igToken
        )

        if (!ok) {
          await prisma.instagramAccount.update({
            where: { id: account.id },
            data: { isActive: false },
          })
          console.warn(
            `[token-refresh] Marked @${account.igUsername} as inactive (page token unrecoverable)`
          )
        }
      } else {
        // Page tokens from long-lived user tokens have no expiry clock.
        // Seeing "never expires" here is normal and expected.
        console.log(
          `[token-refresh] ✅ Page token valid for @${account.igUsername} (page: ${probeData.name})`
        )
      }
    } catch (err) {
      console.error(`[token-refresh] Page token validation error for @${account.igUsername}:`, err)
    }

    await new Promise((r) => setTimeout(r, 500))
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await refreshExpiringTokens()
  await validatePageTokens()
  console.log('[token-refresh] Done.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[token-refresh] Fatal error:', err)
    process.exit(1)
  })

