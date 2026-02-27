import { Instagram, MessageSquare, Zap, Send, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Instagram,
    title: 'Connect Instagram',
    description: 'Link your Instagram Business or Creator account through official Meta OAuth. Secure and verified.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    step: '02',
    icon: Zap,
    title: 'Set Up Triggers',
    description: 'Choose keywords like "price", "link", or "info" that will trigger your automated DM response.',
    color: 'from-primary to-secondary',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Create Your Message',
    description: 'Write a personalized DM template with your link, offer, or content. Add placeholders for names.',
    color: 'from-secondary to-accent',
  },
  {
    step: '04',
    icon: Send,
    title: 'Go Live',
    description: 'Activate your campaign. When someone comments with your keyword, they get your DM instantly.',
    color: 'from-accent to-primary',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
            <span className="text-sm font-semibold text-secondary">Simple Setup</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How it works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in minutes. No coding required. Just connect, configure, and convert.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Step Number */}
                <div className="absolute -top-4 left-6 text-7xl font-bold text-slate-100 group-hover:text-primary/10 transition-colors z-0">
                  {step.step}
                </div>
                
                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow (hidden on last item) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Example Result */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-primary/20">
            <div className="text-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900">Result: Automatic Lead Capture</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-slate-900">@potential_customer</p>
                  <p className="text-slate-600 mt-1">Commented on your post: <span className="text-primary font-medium">"How much is this? 💰"</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-slate-600 mb-1">Auto-sent DM:</p>
                  <p className="text-slate-900">"Hey! 👋 Thanks for your interest! Here's the pricing page you asked for: <span className="text-primary font-medium underline">yoursite.com/pricing</span>"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
