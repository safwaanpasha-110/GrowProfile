import { MessageSquare, BarChart3, Zap, Shield, Link2, Clock } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Comment-Triggered AutoDM',
    description: 'Automatically detect keywords in comments and send personalized DMs with your link or offer instantly.',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Zap,
    title: 'Keyword Triggers',
    description: 'Set up smart triggers like "price", "info", or "link" to activate automated responses on specific comments.',
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Link2,
    title: 'Link Delivery',
    description: 'Deliver product links, signup forms, or exclusive content directly to interested users via DM.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track DMs sent, link clicks, and conversion rates with a beautiful dashboard and insights.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Clock,
    title: 'Smart Timing',
    description: 'Configure delays and daily limits to make your automation feel natural and human-like.',
    gradient: 'from-secondary to-primary',
  },
  {
    icon: Shield,
    title: '100% Meta Compliant',
    description: 'Built on official Meta APIs only. No bots, no scraping, no risk to your account.',
    gradient: 'from-accent to-secondary',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-semibold text-primary">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">automate growth</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            One platform to manage your Instagram AutoDM campaigns. Simple to set up, powerful to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-2xl border border-slate-200 bg-white hover:border-transparent hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
