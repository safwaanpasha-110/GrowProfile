import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/api-middleware'
import prisma from '@/lib/prisma'
import { AuthUser } from '@/lib/auth'

export const GET = withAdmin(async (request: NextRequest, user: AuthUser) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      newUsers30d,
      newUsers7d,
      activeSubscriptions,
      totalCampaigns,
      activeCampaigns,
      totalLeads,
      totalDmsSent,
      openAbuseFlags,
      revenueResult,
      planDistribution,
      userGrowthRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      prisma.lead.count(),
      prisma.interaction.count({ where: { type: 'DM_SENT' } }),
      prisma.abuseFlag.count({ where: { status: 'OPEN' } }),
      prisma.$queryRaw<[{ mrr: number }]>`
        SELECT COALESCE(SUM(p.price), 0) as mrr
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.status = 'ACTIVE'
      `,
      prisma.subscription.groupBy({
        by: ['planId'],
        where: { status: 'ACTIVE' },
        _count: true,
      }),
      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM users
        WHERE created_at >= ${sevenDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date
      `,
    ])

    const mrr = Number(revenueResult[0]?.mrr || 0)
    const growthRate = totalUsers > 0 ? ((newUsers7d / totalUsers) * 100).toFixed(1) : '0.0'

    const userGrowth = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const rawEntry = userGrowthRaw.find((r: any) => {
        const d = typeof r.date === 'string' ? r.date : new Date(r.date).toISOString().split('T')[0]
        return d === dateStr
      })
      userGrowth.push({ date: dateStr, users: rawEntry ? Number(rawEntry.count) : 0 })
    }

    const plans = await prisma.plan.findMany({ select: { id: true, displayName: true } })
    const planMap = new Map(plans.map(p => [p.id, p.displayName]))
    const subscriptionsByPlan = planDistribution.map(pd => ({
      plan: planMap.get(pd.planId) || 'Unknown',
      count: pd._count,
    }))

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newUsers: newUsers30d,
        activeSubscriptions,
        mrr,
        revenue: mrr,
        activeCampaigns,
        totalCampaigns,
        totalLeads,
        totalDmsSent,
        openAbuseFlags,
        growthRate: `+${growthRate}%`,
      },
      charts: { userGrowth, subscriptionsByPlan },
    })
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', message: error.message },
      { status: 500 }
    )
  }
})
