import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth, isAdmin, getClientIp, AuthUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AuthenticatedHandler = (
  request: NextRequest,
  user: AuthUser,
  context?: any
) => Promise<NextResponse>

// ─────────────────────────────────────────────
// Middleware wrappers
// ─────────────────────────────────────────────

/**
 * Wraps an API handler to require authentication.
 * The handler receives the authenticated user as the second argument.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Valid authentication is required' },
        { status: 401 }
      )
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Suspended', message: 'Your account has been suspended. Contact support.' },
        { status: 403 }
      )
    }

    return handler(request, user, context)
  }
}

/**
 * Wraps an API handler to require admin role.
 */
export function withAdmin(handler: AuthenticatedHandler) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Valid authentication is required' },
        { status: 401 }
      )
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access is required' },
        { status: 403 }
      )
    }

    return handler(request, user, context)
  }
}

// ─────────────────────────────────────────────
// Audit logging helper
// ─────────────────────────────────────────────

interface AuditLogParams {
  userId?: string | null
  action: string
  entityType?: string
  entityId?: string
  details?: Record<string, any>
  request?: NextRequest
}

/**
 * Create an audit log entry.
 * Can be called from any API handler or server action.
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        entityType: params.entityType || null,
        entityId: params.entityId || null,
        details: params.details || {},
        ipAddress: params.request ? getClientIp(params.request) : null,
        userAgent: params.request?.headers.get('user-agent') || null,
      },
    })
  } catch (error) {
    // Audit logging should never break the main flow
    console.error('Failed to create audit log:', error)
  }
}

// ─────────────────────────────────────────────
// Response helpers
// ─────────────────────────────────────────────

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function paginatedResponse(
  data: any[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
