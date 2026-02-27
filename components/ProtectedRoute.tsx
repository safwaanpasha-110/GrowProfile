'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'user' | 'admin'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  // Role check: 'admin' requires ADMIN or SUPER_ADMIN role
  if (requiredRole === 'admin' && !isAdmin) {
    router.push('/dashboard')
    return null
  }

  // 'user' role: admins accessing user routes should be redirected to admin
  if (requiredRole === 'user' && isAdmin) {
    router.push('/admin')
    return null
  }

  return <>{children}</>
}
