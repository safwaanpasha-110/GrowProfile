import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import prisma from '@/lib/prisma'
import { AuthUser } from '@/lib/auth'

/**
 * GET /api/campaigns — List all campaigns for the current user
 * Query: ?igAccountId=xxx&status=ACTIVE&limit=50
 */
export const GET = withAuth(async (request: NextRequest, user: AuthUser) => {
  const { searchParams } = request.nextUrl
  const igAccountId = searchParams.get('igAccountId')
  const status = searchParams.get('status')
  const limit = Math.min(Number(searchParams.get('limit') || 50), 100)

  const where: Record<string, unknown> = { userId: user.id }
  if (igAccountId) where.igAccountId = igAccountId
  if (status) where.status = status

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      media: true,
      igAccount: {
        select: { igUsername: true, igUserId: true },
      },
      _count: {
        select: { interactions: true, leads: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ success: true, campaigns })
})

/**
 * POST /api/campaigns — Create a new campaign
 */
export const POST = withAuth(async (request: NextRequest, user: AuthUser) => {
  const body = await request.json()

  const {
    igAccountId,
    name,
    type = 'COMMENT_DM',
    triggerKeywords = [],
    replyMessage,
    dmMessages = [],
    requireFollow = false,
    followUpEnabled = false,
    followUpDelayMinutes = 60,
    maxFollowUps = 2,
    mediaIds = [], // Array of IG media objects: { igMediaId, mediaUrl, mediaType, caption, permalink }
    status = 'DRAFT',
  } = body

  if (!igAccountId || !name || triggerKeywords.length === 0) {
    return NextResponse.json(
      { error: 'igAccountId, name, and at least one triggerKeyword are required' },
      { status: 400 }
    )
  }

  if (dmMessages.length === 0) {
    return NextResponse.json(
      { error: 'At least one DM message is required' },
      { status: 400 }
    )
  }

  // Verify account belongs to user
  const account = await prisma.instagramAccount.findFirst({
    where: { id: igAccountId, userId: user.id },
  })

  if (!account) {
    return NextResponse.json({ error: 'Instagram account not found' }, { status: 404 })
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId: user.id,
      igAccountId,
      name,
      type,
      status,
      triggerKeywords,
      replyMessage: replyMessage || null,
      dmMessages,
      requireFollow,
      followUpEnabled,
      followUpDelayMinutes,
      maxFollowUps,
      media: mediaIds.length > 0
        ? {
            create: mediaIds.map((m: { igMediaId: string; mediaUrl?: string; mediaType?: string; caption?: string; permalink?: string }) => ({
              igAccountId,
              igMediaId: m.igMediaId,
              mediaUrl: m.mediaUrl || null,
              mediaType: m.mediaType || null,
              caption: m.caption || null,
              permalink: m.permalink || null,
            })),
          }
        : undefined,
    },
    include: {
      media: true,
      _count: { select: { interactions: true, leads: true } },
    },
  })

  return NextResponse.json({ success: true, campaign }, { status: 201 })
})
