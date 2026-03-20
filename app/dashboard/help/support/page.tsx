'use client'

import { Mail, MessageSquare, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SupportPage() {
  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@growprofile.in'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team in real-time',
      action: 'Start Chat',
      href: '#'
    }
  ]

  const commonIssues = [
    {
      title: 'Campaign not sending DMs',
      description: 'Troubleshoot why your automation isn\'t triggering'
    },
    {
      title: 'Account connection issues',
      description: 'Fix Instagram authentication and reconnection problems'
    },
    {
      title: 'Analytics not updating',
      description: 'Resolve data refresh and tracking issues'
    },
    {
      title: 'Payment and billing problems',
      description: 'Handle subscription and payment-related questions'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Support & Help</h1>
        <p className="text-muted-foreground">Get support from our team whenever you need it</p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {supportChannels.map((channel, idx) => {
          const Icon = channel.icon
          return (
            <div key={idx} className="p-6 rounded-xl bg-card border border-border">
              <Icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">{channel.title}</h3>
              <p className="text-muted-foreground mb-6">{channel.description}</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href={channel.href} target="_blank" rel="noopener noreferrer">
                  {channel.action}
                </a>
              </Button>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <Input placeholder="How can we help?" className="border-border bg-background text-foreground" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none resize-none h-32"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none">
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Submit Support Ticket
            </Button>
          </form>
        </div>

        {/* Common Issues */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Help</h2>
          <div className="space-y-4">
            {commonIssues.map((issue, idx) => (
              <button
                key={idx}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/20 transition-all"
              >
                <h3 className="font-semibold text-foreground mb-1">{issue.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {issue.description}
                  <ExternalLink className="w-3 h-3" />
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Time Info */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <h3 className="font-bold text-foreground mb-2">Support Response Times</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Starter</p>
            <p className="font-bold text-foreground">24-48 hours</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pro</p>
            <p className="font-bold text-foreground">4-12 hours</p>
          </div>
          <div>
            <p className="text-muted-foreground">Agency</p>
            <p className="font-bold text-foreground">1-2 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
