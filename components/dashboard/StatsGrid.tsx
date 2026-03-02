'use client'

import { BarChart3, MessageSquare, TrendingUp, Users, ArrowUpRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'

interface DashboardStats {
  activeCampaigns: number
  totalCampaigns: number
  totalInteractions: number
  dmsSent: number
  totalLeads: number
  interactionsThisWeek: number
}

export function StatsGrid() {
  const { authFetch, user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await authFetch('/api/dashboard/stats')
        const data = await res.json()
        if (data.success) setStats(data.stats)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [authFetch])

  const statItems = [
    {
      label: 'Active Campaigns',
      value: stats?.activeCampaigns ?? 0,
      icon: MessageSquare,
      color: 'from-primary to-secondary',
      sub: `${stats?.totalCampaigns ?? 0} total`
    },
    {
      label: 'DMs Sent',
      value: stats?.dmsSent ?? 0,
      icon: BarChart3,
      color: 'from-secondary to-accent',
      sub: `${stats?.interactionsThisWeek ?? 0} this week`
    },
    {
      label: 'Total Interactions',
      value: stats?.totalInteractions ?? 0,
      icon: Users,
      color: 'from-accent to-primary',
      sub: 'comments detected'
    },
    {
      label: 'Leads Captured',
      value: stats?.totalLeads ?? 0,
      icon: TrendingUp,
      color: 'from-primary to-accent',
      sub: 'unique users'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-muted mb-4" />
            <div className="h-4 w-24 bg-muted rounded mb-2" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
