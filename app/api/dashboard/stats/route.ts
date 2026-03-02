import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import prisma from '@/lib/prisma'
import { AuthUser } from '@/lib/auth'

/**
 * GET /api/dashboard/stats — Real-time dashboard stats for the current user
 */
export const GET = withAuth(async (_request: NextRequest, user: AuthUser) => {
  const [
    activeCampaigns,
    totalCampaigns,
    totalInteractions,
    dmsSent,
    totalLeads,
    recentInteractions,
    connectedAccounts,
  ] = await Promise.all([
    // Active campaigns
    prisma.campaign.count({
      where: { userId: user.id, status: 'ACTIVE' },
    }),
    // Total campaigns
    prisma.campaign.count({
      where: { userId: user.id },
    }),
    // Total interactions (all types)
    prisma.interaction.count({
      where: { igAccount: { userId: user.id } },
    }),
    // DMs sent (REPLIED or COMPLETED)
    prisma.interaction.count({
      where: {
        igAccount: { userId: user.id },
        status: { in: ['REPLIED', 'COMPLETED'] },
      },
    }),
    // Total leads
    prisma.lead.count({
      where: { userId: user.id },
    }),
    // Recent interactions (last 10)
    prisma.interaction.findMany({
      where: { igAccount: { userId: user.id } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        igUsername: true,
        type: true,
        status: true,
        commentText: true,
        createdAt: true,
        campaign: { select: { name: true } },
      },
    }),
    // Connected IG accounts
    prisma.instagramAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        igUserId: true,
        igUsername: true,
        isActive: true,
        tokenExpiresAt: true,
      },
    }),
  ])

  // Interactions this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const interactionsThisWeek = await prisma.interaction.count({
    where: {
      igAccount: { userId: user.id },
      createdAt: { gte: weekAgo },
      status: { in: ['REPLIED', 'COMPLETED'] },
    },
  })

  return NextResponse.json({
    success: true,
    stats: {
      activeCampaigns,
      totalCampaigns,
      totalInteractions,
      dmsSent,
      totalLeads,
      interactionsThisWeek,
    },
    recentInteractions,
    connectedAccounts,
  })
})
