'use client'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="user">
      <div className="bg-background text-foreground min-h-screen">
        <Sidebar />
        <Header />
        <main className="ml-64 pt-[73px] min-h-screen bg-muted/30">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
