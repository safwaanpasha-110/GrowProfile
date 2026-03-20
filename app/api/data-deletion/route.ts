import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/data-deletion
// Meta requires this endpoint to process data deletion requests.
// Accepts { userId?, email, signedRequest? } and schedules/performs deletion.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { userId, email, signedRequest } = body as {
      userId?: string
      email?: string
      signedRequest?: string
    }

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Either userId or email is required' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: userId
        ? { id: userId }
        : { email: String(email).toLowerCase().trim() },
      select: { id: true, email: true, status: true },
    })

    if (!user) {
      // Return success even if user not found — Meta requires a confirmation URL
      return NextResponse.json({
        url: `https://growprofile.in/data-deletion`,
        confirmation_code: `NOT_FOUND_${Date.now()}`,
      })
    }

    // Delete all user data in correct dependency order
    await prisma.$transaction([
      // Remove interactions first (references campaigns + ig accounts)
      prisma.interaction.deleteMany({ where: { campaign: { userId: user.id } } }),
      // Remove campaign media
      prisma.campaignMedia.deleteMany({ where: { campaign: { userId: user.id } } }),
      // Remove campaigns
      prisma.campaign.deleteMany({ where: { userId: user.id } }),
      // Remove leads
      prisma.lead.deleteMany({ where: { userId: user.id } }),
      // Remove instagram accounts (tokens)
      prisma.instagramAccount.deleteMany({ where: { userId: user.id } }),
      // Remove payments
      prisma.payment.deleteMany({ where: { userId: user.id } }),
      // Remove subscriptions
      prisma.subscription.deleteMany({ where: { userId: user.id } }),
      // Remove referrals
      prisma.referral.deleteMany({
        where: { OR: [{ referrerId: user.id }, { referredId: user.id }] },
      }),
      // Remove audit logs
      prisma.auditLog.deleteMany({ where: { userId: user.id } }),
      // Remove abuse flags
      prisma.abuseFlag.deleteMany({ where: { userId: user.id } }),
      // Finally delete the user
      prisma.user.delete({ where: { id: user.id } }),
    ])

    const confirmationCode = `GP_DEL_${user.id}_${Date.now()}`

    return NextResponse.json({
      url: `https://growprofile.in/data-deletion`,
      confirmation_code: confirmationCode,
    })
  } catch (err) {
    console.error('[data-deletion] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET for Meta's callback URL verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'GrowProfile Data Deletion endpoint. Send a POST request with { email } to request data deletion.',
    contact: 'support@growprofile.in',
  })
}
