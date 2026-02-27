'use client'

import { BarChart3, MessageSquare, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function StatsGrid() {
  const stats = [
    {
      label: 'Active Campaigns',
      value: '3',
      icon: MessageSquare,
      color: 'from-primary to-secondary',
      trend: '+2',
      trendLabel: 'this month',
      trendUp: true
    },
    {
      label: 'DMs Sent',
      value: '2,847',
      icon: BarChart3,
      color: 'from-secondary to-accent',
      trend: '+892',
      trendLabel: 'this week',
      trendUp: true
    },
    {
      label: 'Link Clicks',
      value: '1,293',
      icon: Users,
      color: 'from-accent to-primary',
      trend: '+36%',
      trendLabel: 'vs last month',
      trendUp: true
    },
    {
      label: 'Conversion Rate',
      value: '8.2%',
      icon: TrendingUp,
      color: 'from-primary to-accent',
      trend: '+2.1%',
      trendLabel: 'improvement',
      trendUp: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.trendUp 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.trendLabel}</p>
          </div>
        )
      })}
    </div>
  )
}
