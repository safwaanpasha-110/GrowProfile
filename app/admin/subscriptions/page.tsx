'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

interface Subscription {
  id: string
  userId: string
  userEmail: string
  plan: string
  status: string
  createdAt: string
  updatedAt: string
}

interface SubscriptionStats {
  total: number
  active: number
  trial: number
  starter: number
  pro: number
  enterprise: number
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<SubscriptionStats>({
    total: 0,
    active: 0,
    trial: 0,
    starter: 0,
    pro: 0,
    enterprise: 0,
  })
  const [loading, setLoading] = useState(true)
  const { authFetch } = useAuth()

  useEffect(() => {
    fetchSubscriptions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSubscriptions = async () => {
    try {
      const response = await authFetch('/api/admin/subscriptions')
      const data = await response.json()
      setSubscriptions(data.subscriptions || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanPrice = (plan: string) => {
    const prices: any = {
      trial: 'Free',
      starter: '$29/mo',
      pro: '$79/mo',
      enterprise: '$299/mo',
    }
    return prices[plan] || 'N/A'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscriptions</h1>
        <p className="text-slate-600">Monitor and manage user subscriptions and billing.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.active}</div>
            <p className="text-sm text-slate-600 mt-2">Total: {stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Starter Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.starter}</div>
            <p className="text-sm text-slate-600 mt-2">${stats.starter * 29} MRR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pro Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.pro}</div>
            <p className="text-sm text-slate-600 mt-2">${stats.pro * 79} MRR</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No subscriptions yet. Users will appear here when they subscribe to a plan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600">{sub.userEmail || sub.userId}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-900 capitalize">{sub.plan}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{getPlanPrice(sub.plan)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-primary hover:text-primary/90 font-medium text-sm">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
