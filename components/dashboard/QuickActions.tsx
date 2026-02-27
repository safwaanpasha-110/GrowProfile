'use client'

import Link from 'next/link'
import { MessageSquare, Users, BarChart3, Gift, Instagram, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 justify-start gap-3 h-12 rounded-xl shadow-lg shadow-primary/20" size="lg">
            <Link href="/dashboard/apps/autodm">
              <MessageSquare className="w-5 h-5" />
              Create AutoDM Campaign
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl" size="lg">
            <Link href="/dashboard/growth/audience">
              <Users className="w-4 h-4" />
              View Audience
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl" size="lg">
            <Link href="/dashboard/plan/usage">
              <BarChart3 className="w-4 h-4" />
              Check Usage
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl" size="lg">
            <Link href="/dashboard/refer">
              <Gift className="w-4 h-4" />
              Earn Rewards
            </Link>
          </Button>
        </div>
      </div>

      {/* Connected Account */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Connected Account</h3>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">@yourbusiness</p>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-xs font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Info Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Current Plan</span>
        </div>
        <p className="text-2xl font-bold text-foreground mb-2">Pro Plan</p>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">DMs remaining</span>
            <span className="font-medium text-foreground">7,500 / 10,000</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        <Button asChild variant="outline" className="w-full rounded-xl border-primary/30 hover:bg-primary/5">
          <Link href="/dashboard/plan/pricing" className="gap-2">
            Upgrade Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
