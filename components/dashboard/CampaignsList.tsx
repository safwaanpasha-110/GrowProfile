'use client'

import Link from 'next/link'
import { Plus, Play, Pause, MoreHorizontal, MessageSquare, MousePointerClick, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const recentCampaigns = [
  {
    id: 1,
    name: 'Price Inquiry Response',
    keyword: 'price',
    status: 'Active',
    messagesCount: 892,
    clicks: 234,
    conversionRate: '26.2%',
    created: '3 days ago'
  },
  {
    id: 2,
    name: 'Product Launch Campaign',
    keyword: 'info, details',
    status: 'Active',
    messagesCount: 1247,
    clicks: 412,
    conversionRate: '33.0%',
    created: '1 week ago'
  },
  {
    id: 3,
    name: 'Link Request Handler',
    keyword: 'link',
    status: 'Paused',
    messagesCount: 708,
    clicks: 156,
    conversionRate: '22.0%',
    created: '2 weeks ago'
  }
]

export function CampaignsList() {
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Your Campaigns</h2>
          <p className="text-sm text-muted-foreground">Manage your AutoDM automation</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2 shadow-lg shadow-primary/20">
          <Link href="/dashboard/apps/autodm">
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {recentCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  campaign.status === 'Active'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                    : 'bg-gradient-to-br from-amber-500 to-orange-500'
                }`}>
                  {campaign.status === 'Active' ? (
                    <Play className="w-4 h-4 text-white" />
                  ) : (
                    <Pause className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{campaign.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">#{campaign.keyword}</span>
                    <span className="text-xs text-muted-foreground">• Created {campaign.created}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  campaign.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {campaign.status}
                </span>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">DMs Sent</p>
                </div>
                <p className="text-xl font-bold text-foreground">{campaign.messagesCount.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointerClick className="w-4 h-4 text-secondary" />
                  <p className="text-xs text-muted-foreground">Link Clicks</p>
                </div>
                <p className="text-xl font-bold text-foreground">{campaign.clicks.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="w-4 h-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
                <p className="text-xl font-bold text-foreground">{campaign.conversionRate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
          <Link href="/dashboard/apps/autodm" className="gap-2">
            View All Campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
