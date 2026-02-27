'use client'

import { TrendingUp, Users, Heart, MessageCircle } from 'lucide-react'

export default function AudiencePage() {
  const metrics = [
    {
      label: 'Total Followers',
      value: '12,847',
      change: '+892',
      icon: Users,
      color: 'from-primary to-secondary'
    },
    {
      label: 'Avg Engagement',
      value: '8.2%',
      change: '+2.1%',
      icon: Heart,
      color: 'from-secondary to-accent'
    },
    {
      label: 'Comments/Post',
      value: '43',
      change: '+12',
      icon: MessageCircle,
      color: 'from-accent to-primary'
    },
    {
      label: 'Growth Rate',
      value: '2.3%/week',
      change: '+0.5%',
      icon: TrendingUp,
      color: 'from-primary to-accent'
    }
  ]

  const demographics = [
    { label: 'Male', value: 58, color: 'bg-primary' },
    { label: 'Female', value: 42, color: 'bg-accent' }
  ]

  const topCountries = [
    { country: 'United States', percentage: 28 },
    { country: 'United Kingdom', percentage: 15 },
    { country: 'Canada', percentage: 12 },
    { country: 'Australia', percentage: 9 },
    { country: 'India', percentage: 8 },
    { country: 'Others', percentage: 28 }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Audience Insights</h1>
        <p className="text-muted-foreground">Detailed analytics about your followers and engagement</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="p-6 rounded-xl bg-card border border-border">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground mb-2">{metric.value}</p>
              <p className="text-xs text-primary font-medium">{metric.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demographics */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Gender Distribution</h2>
          <div className="space-y-4">
            {demographics.map((demo, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-foreground">{demo.label}</span>
                  <span className="font-bold text-foreground">{demo.value}%</span>
                </div>
                <div className="w-full h-3 bg-secondary/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${demo.color} rounded-full`}
                    style={{ width: `${demo.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Top Locations</h2>
          <div className="space-y-4">
            {topCountries.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-foreground">{item.country}</span>
                  <span className="font-bold text-foreground">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
