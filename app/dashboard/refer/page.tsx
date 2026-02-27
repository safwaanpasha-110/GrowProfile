'use client'

import { Copy, Check, Users, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)

  const referralLink = 'https://growprofile.com/ref/abc123xyz'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referrals = [
    { name: 'Sarah Johnson', date: '2 days ago', status: 'Active', reward: '$29' },
    { name: 'Mike Chen', date: '1 week ago', status: 'Active', reward: '$29' },
    { name: 'Emma Wilson', date: '2 weeks ago', status: 'Active', reward: '$29' }
  ]

  const stats = [
    {
      label: 'Total Referrals',
      value: '12',
      icon: Users,
      color: 'from-primary to-secondary'
    },
    {
      label: 'Active Subscribers',
      value: '8',
      icon: TrendingUp,
      color: 'from-secondary to-accent'
    },
    {
      label: 'Lifetime Earnings',
      value: '$232',
      icon: DollarSign,
      color: 'from-accent to-primary'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Referral Program</h1>
        <p className="text-muted-foreground">Earn rewards by inviting friends to GrowProfile</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="p-6 rounded-xl bg-card border border-border">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Referral Link */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Referral Link</h2>
            <p className="text-muted-foreground mb-6">
              Share this link with friends and earn $29 for every new subscriber
            </p>
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={referralLink}
                readOnly
                className="bg-white border-border text-foreground flex-1 select-all"
              />
              <Button
                onClick={handleCopy}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* How it Works */}
          <div className="p-6 rounded-xl bg-card border border-border mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">How It Works</h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Share Your Link',
                  description: 'Copy your unique referral link and share it with friends via email, social media, or chat'
                },
                {
                  step: '2',
                  title: 'Friends Sign Up',
                  description: 'When someone uses your link to sign up, they\'ll get a 14-day free trial'
                },
                {
                  step: '3',
                  title: 'They Become Subscriber',
                  description: 'Once they upgrade to a paid plan, you\'ll earn $29 commission'
                },
                {
                  step: '4',
                  title: 'Get Paid Monthly',
                  description: 'Earnings are paid to your account monthly on the 15th'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-bold text-primary">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Referrals */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Recent Referrals</h2>
            <div className="space-y-4">
              {referrals.map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                  <div>
                    <p className="font-semibold text-foreground">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">{ref.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {ref.status}
                    </span>
                    <span className="font-bold text-primary">{ref.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-card border border-border sticky top-24">
            <h3 className="font-bold text-foreground mb-6">Program Benefits</h3>
            <ul className="space-y-3">
              {[
                'Earn $29 per referral',
                'Unlimited earning potential',
                'Monthly payouts',
                'Real-time tracking',
                'Detailed analytics',
                'No expiration date'
              ].map((benefit, idx) => (
                <li key={idx} className="flex gap-2 items-start text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full bg-primary hover:bg-primary/90 mt-6">
              View Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
