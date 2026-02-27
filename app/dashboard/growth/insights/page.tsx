'use client'

import { TrendingUp, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InsightsPage() {
  const weekData = [
    { day: 'Mon', followers: 120, engagement: 8.2 },
    { day: 'Tue', followers: 145, engagement: 9.1 },
    { day: 'Wed', followers: 98, engagement: 7.5 },
    { day: 'Thu', followers: 167, engagement: 10.2 },
    { day: 'Fri', followers: 189, engagement: 11.5 },
    { day: 'Sat', followers: 203, engagement: 12.8 },
    { day: 'Sun', followers: 168, engagement: 10.1 }
  ]

  const maxFollowers = Math.max(...weekData.map(d => d.followers))

  const bestPosts = [
    { title: 'Product Launch Announcement', likes: 1247, comments: 89, saves: 234, engagement: '14.2%' },
    { title: 'Behind the Scenes', likes: 892, comments: 45, saves: 156, engagement: '11.8%' },
    { title: 'Tips & Tricks', likes: 756, comments: 38, saves: 142, engagement: '10.2%' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Performance Insights</h1>
        <p className="text-muted-foreground">Track your growth trends and identify what resonates with your audience</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-8">
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          This Week
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Options
        </Button>
      </div>

      {/* Growth Chart */}
      <div className="p-6 rounded-xl bg-card border border-border mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Follower Growth This Week</h2>
        <div className="flex items-end justify-between h-64 gap-2 px-4">
          {weekData.map((data, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg hover:opacity-80 transition-opacity" style={{
                height: `${(data.followers / maxFollowers) * 220}px`,
                cursor: 'pointer'
              }} title={`${data.followers} followers`}></div>
              <span className="text-xs font-medium text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Posts */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Top Performing Posts</h2>
        <div className="space-y-4">
          {bestPosts.map((post, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{post.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <TrendingUp className="w-4 h-4" />
                  {post.engagement}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Likes</p>
                  <p className="text-2xl font-bold text-foreground">{post.likes}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Comments</p>
                  <p className="text-2xl font-bold text-foreground">{post.comments}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Saves</p>
                  <p className="text-2xl font-bold text-foreground">{post.saves}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
