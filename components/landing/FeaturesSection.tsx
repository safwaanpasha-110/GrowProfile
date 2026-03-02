'use client'

import { MessageSquare, BarChart3, Zap, Shield, Link2, Clock } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const features = [
  {
    icon: MessageSquare,
    title: 'Comment-Triggered AutoDM',
    description: 'Automatically detect keywords in comments and send personalized DMs with your link or offer instantly.',
    gradient: 'from-primary to-secondary',
    shadow: 'shadow-primary/20',
  },
  {
    icon: Zap,
    title: 'Keyword Triggers',
    description: 'Set up smart triggers like "price", "info", or "link" to activate automated responses on specific comments.',
    gradient: 'from-secondary to-accent',
    shadow: 'shadow-secondary/20',
  },
  {
    icon: Link2,
    title: 'Link Delivery',
    description: 'Deliver product links, signup forms, or exclusive content directly to interested users via DM.',
    gradient: 'from-accent to-primary',
    shadow: 'shadow-accent/20',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track DMs sent, link clicks, and conversion rates with a beautiful dashboard and insights.',
    gradient: 'from-primary to-accent',
    shadow: 'shadow-primary/20',
  },
  {
    icon: Clock,
    title: 'Smart Timing',
    description: 'Configure delays and daily limits to make your automation feel natural and human-like.',
    gradient: 'from-secondary to-primary',
    shadow: 'shadow-secondary/20',
  },
  {
    icon: Shield,
    title: '100% Meta Compliant',
    description: 'Built on official Meta APIs only. No bots, no scraping, no risk to your account.',
    gradient: 'from-accent to-secondary',
    shadow: 'shadow-accent/20',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(270_84%_55%_/_0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(210_100%_50%_/_0.03)_0%,transparent_50%)]"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-6 shimmer-border">
              <span className="text-sm font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Everything you need to{' '}
              <span className="anim-gradient-text">automate growth</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              One platform to manage your Instagram AutoDM campaigns. Simple to set up, powerful to scale.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <ScrollReveal key={idx} delay={idx * 100} direction="up" scale>
              <div className="group p-8 rounded-2xl border border-slate-200/80 bg-white hover:border-transparent hover:shadow-2xl transition-all duration-500 relative overflow-hidden tilt-card h-full">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-secondary/[0.03] to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg ${feature.shadow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Bottom corner decoration */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-[0.07] blur-2xl transition-opacity duration-500`}></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
