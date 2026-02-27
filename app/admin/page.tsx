'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

interface AdminStats {
  totalUsers: number
  newUsers: number
  activeSubscriptions: number
  revenue: number
  activeCampaigns: number
  growthRate: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsers: 0,
    activeSubscriptions: 0,
    revenue: 0,
    activeCampaigns: 0,
    growthRate: '+0%',
  })
  const [loading, setLoading] = useState(true)
  const { authFetch } = useAuth()

  useEffect(() => {
    fetchStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStats = async () => {
    try {
      const response = await authFetch('/api/admin/stats')
      const data = await response.json()
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Users',
      value: (stats?.totalUsers ?? 0).toString(),
      change: `${stats?.newUsers ?? 0} new this month`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Subscriptions',
      value: (stats?.activeSubscriptions ?? 0).toString(),
      change: 'Paying customers',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats?.revenue ?? 0}`,
      change: 'From subscriptions',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Growth Rate',
      value: stats?.growthRate ?? '+0%',
      change: 'Weekly growth',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your platform overview.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-600">Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.label}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-900 font-medium">
                      {stats.totalUsers} total users registered
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {stats.newUsers} joined in the last 30 days
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-900 font-medium">
                      {stats.activeSubscriptions} active subscriptions
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Generating ${stats.revenue} monthly revenue
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-900 font-medium">Platform growth: {stats.growthRate}</p>
                    <p className="text-sm text-slate-600 mt-1">Weekly user growth rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
                  Send Announcement
                </button>
                <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                  View Reports
                </button>
                <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                  Manage Plans
                </button>
                <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                  View Logs
                </button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
