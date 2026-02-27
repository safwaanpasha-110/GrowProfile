import { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import prisma from '@/lib/prisma'
import { User, UserRole, UserStatus } from '@/lib/generated/prisma'

export interface AuthUser extends User {
  plan: {
    id: string
    name: string
    displayName: string
    maxIgAccounts: number
    maxLeads: number
    advancedFlows: boolean
  } | null
}

/**
 * Verify the Firebase ID token from the Authorization header
 * and look up (or create) the corresponding User in PostgreSQL.
 *
 * Returns the enriched user object or null if authentication fails.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const idToken = authHeader.split('Bearer ')[1]
    if (!idToken) {
      return null
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    // Look up the user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            displayName: true,
            maxIgAccounts: true,
            maxLeads: true,
            advancedFlows: true,
          },
        },
      },
    })

    if (!user) {
      return null
    }

    // Check if user is banned or suspended
    if (user.status === UserStatus.BANNED) {
      return null
    }

    return user as AuthUser
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

/**
 * Verify that the user has admin privileges
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
}

/**
 * Verify that the user is a super admin
 */
export function isSuperAdmin(user: AuthUser): boolean {
  return user.role === UserRole.SUPER_ADMIN
}

/**
 * Extract the client IP address from the request
 */
export function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null
  )
}
