import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import prisma from '@/lib/prisma'
import { AuthUser } from '@/lib/auth'

/**
 * GET /api/inbox
 * Returns the unified inbox data for the current user:
 *  - threads: one per unique igScopedUserId (latest activity first)
 *  - events:  recent WebhookEvents for their IG accounts
 */
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  const { searchParams } = request.nextUrl
  const igAccountId = searchParams.get('igAccountId')
  const threadUserId = searchParams.get('threadUserId') // fetch single thread
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200)

  // Resolve which IG accounts belong to this user
  const igAccounts = await prisma.instagramAccount.findMany({
    where: { userId: user.id, ...(igAccountId ? { id: igAccountId } : {}) },
    select: { id: true, igUserId: true, igUsername: true },
  })

  if (igAccounts.length === 0) {
    return NextResponse.json({ success: true, threads: [], events: [] })
  }

  const accountIds = igAccounts.map((a) => a.id)

  // ─── Thread list ────────────────────────────────────────
  // One thread per unique igScopedUserId — latest interaction first
  if (!threadUserId) {
    const rawThreads = await prisma.interaction.groupBy({
      by: ['igScopedUserId'],
      where: { igAccountId: { in: accountIds } },
      _max: { createdAt: true },
      _count: { id: true },
      orderBy: { _max: { createdAt: 'desc' } },
      take: limit,
    })

    // Enrich with latest interaction details
    const threads = await Promise.all(
      rawThreads.map(async (t) => {
        const latest = await prisma.interaction.findFirst({
          where: { igAccountId: { in: accountIds }, igScopedUserId: t.igScopedUserId },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            igUsername: true,
            type: true,
            status: true,
            commentText: true,
            metadata: true,
            createdAt: true,
            campaign: { select: { name: true } },
          },
        })
        return {
          igScopedUserId: t.igScopedUserId,
          igUsername: latest?.igUsername || t.igScopedUserId,
          interactionCount: t._count.id,
          latestAt: t._max.createdAt,
          latestType: latest?.type,
          latestStatus: latest?.status,
          latestText: latest?.commentText || null,
          campaignName: latest?.campaign?.name || null,
        }
      })
    )

    // ─── Recent webhook events ──────────────────────────
    const events = await prisma.webhookEvent.findMany({
      where: { igAccountId: { in: accountIds } },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        eventType: true,
        payload: true,
        status: true,
        processedAt: true,
        createdAt: true,
        igAccount: { select: { igUsername: true } },
      },
    })

    return NextResponse.json({ success: true, threads, events })
  }

  // ─── Single thread: all interactions for a specific user ─
  const interactions = await prisma.interaction.findMany({
    where: { igAccountId: { in: accountIds }, igScopedUserId: threadUserId },
    orderBy: { createdAt: 'asc' },
    take: 200,
    select: {
      id: true,
      igUsername: true,
      igScopedUserId: true,
      type: true,
      status: true,
      commentId: true,
      commentText: true,
      dmMessageId: true,
      metadata: true,
      followUpCount: true,
      createdAt: true,
      updatedAt: true,
      campaign: { select: { id: true, name: true, requireFollow: true } },
      igAccount: { select: { igUsername: true } },
    },
  })

  return NextResponse.json({ success: true, interactions })
})

/**
 * DELETE /api/inbox/events?igAccountId=...
 * Clears all webhook events for the user's IG account(s).
 */
export const DELETE = withAuth(async (request: NextRequest, user: AuthUser) => {
  const { searchParams } = request.nextUrl
  const igAccountId = searchParams.get('igAccountId')

  const igAccounts = await prisma.instagramAccount.findMany({
    where: { userId: user.id, ...(igAccountId ? { id: igAccountId } : {}) },
    select: { id: true },
  })

  if (igAccounts.length === 0) {
    return NextResponse.json({ success: true, deleted: 0 })
  }

  const accountIds = igAccounts.map((a) => a.id)

  const result = await prisma.webhookEvent.deleteMany({
    where: { igAccountId: { in: accountIds } },
  })

  return NextResponse.json({ success: true, deleted: result.count })
})
