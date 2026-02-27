import { NextRequest, NextResponse } from 'next/server'
import { withAdmin, createAuditLog } from '@/lib/api-middleware'
import { AuthUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const GET = withAdmin(async (request: NextRequest, user: AuthUser) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const planId = searchParams.get('planId') || ''
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (planId) where.planId = planId

    const [subscriptions, total, totalActive, totalCancelled, starterCount, creatorCount] = await Promise.all([
      prisma.subscription.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
          plan: { select: { id: true, name: true, displayName: true, price: true } },
        },
      }),
      prisma.subscription.count({ where }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { status: 'CANCELLED' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { name: 'STARTER' } } }),
      prisma.subscription.count({ where: { status: 'ACTIVE', plan: { name: 'CREATOR' } } }),
    ])

    return NextResponse.json({
      success: true,
      data: subscriptions,
      stats: { total, active: totalActive, cancelled: totalCancelled, starter: starterCount, creator: creatorCount },
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions', message: error.message }, { status: 500 })
  }
})

export const PATCH = withAdmin(async (request: NextRequest, adminUser: AuthUser) => {
  try {
    const { subscriptionId, status, planId } = await request.json()
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    })
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const updates: any = {}
    const details: any = { subscriptionId }

    if (status) {
      updates.status = status
      details.statusChange = { from: subscription.status, to: status }
      if (status === 'CANCELLED') updates.cancelledAt = new Date()
    }

    if (planId) {
      updates.planId = planId
      details.planChange = { from: subscription.planId, to: planId }
      await prisma.user.update({ where: { id: subscription.userId }, data: { planId } })
    }

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updates,
      include: {
        user: { select: { email: true } },
        plan: { select: { displayName: true } },
      },
    })

    await createAuditLog({
      userId: adminUser.id,
      action: 'admin.update_subscription',
      entityType: 'Subscription',
      entityId: subscriptionId,
      details,
      request,
    })

    return NextResponse.json({ success: true, message: 'Subscription updated', data: updated })
  } catch (error: any) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription', message: error.message }, { status: 500 })
  }
})
