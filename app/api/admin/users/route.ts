import { NextRequest, NextResponse } from 'next/server'
import { withAdmin, createAuditLog } from '@/lib/api-middleware'
import { AuthUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { adminAuth } from '@/lib/firebase-admin'

export const GET = withAdmin(async (request: NextRequest, user: AuthUser) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) where.role = role
    if (status) where.status = status

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: { select: { name: true, displayName: true } },
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
            select: { id: true, status: true, currentPeriodEnd: true },
          },
          _count: {
            select: { instagramAccounts: true, campaigns: true, leads: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users.map(u => ({
        id: u.id,
        firebaseUid: u.firebaseUid,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        status: u.status,
        plan: u.plan,
        subscription: u.subscriptions[0] || null,
        stats: u._count,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    )
  }
})

export const DELETE = withAdmin(async (request: NextRequest, adminUser: AuthUser) => {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser.role === 'SUPER_ADMIN' && adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot delete a super admin' }, { status: 403 })
    }

    try {
      await adminAuth.deleteUser(targetUser.firebaseUid)
    } catch (err: any) {
      console.warn('Firebase user deletion warning:', err.message)
    }

    await prisma.user.delete({ where: { id: userId } })

    await createAuditLog({
      userId: adminUser.id,
      action: 'admin.delete_user',
      entityType: 'User',
      entityId: userId,
      details: { deletedEmail: targetUser.email },
      request,
    })

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', message: error.message },
      { status: 500 }
    )
  }
})

export const PATCH = withAdmin(async (request: NextRequest, adminUser: AuthUser) => {
  try {
    const { userId, status, role } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updates: any = {}
    const details: any = {}

    if (status) {
      updates.status = status
      details.statusChange = { from: targetUser.status, to: status }
      if (status === 'SUSPENDED' || status === 'BANNED') {
        try { await adminAuth.updateUser(targetUser.firebaseUid, { disabled: true }) }
        catch (err: any) { console.warn('Firebase update warning:', err.message) }
      } else if (status === 'ACTIVE') {
        try { await adminAuth.updateUser(targetUser.firebaseUid, { disabled: false }) }
        catch (err: any) { console.warn('Firebase update warning:', err.message) }
      }
    }

    if (role) {
      if (adminUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only super admins can change roles' }, { status: 403 })
      }
      updates.role = role
      details.roleChange = { from: targetUser.role, to: role }
    }

    const updatedUser = await prisma.user.update({ where: { id: userId }, data: updates })

    await createAuditLog({
      userId: adminUser.id,
      action: 'admin.update_user',
      entityType: 'User',
      entityId: userId,
      details,
      request,
    })

    return NextResponse.json({ success: true, message: 'User updated successfully', data: updatedUser })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user', message: error.message },
      { status: 500 }
    )
  }
})
