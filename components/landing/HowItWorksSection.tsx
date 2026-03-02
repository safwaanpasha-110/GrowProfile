'use client'

import { Instagram, MessageSquare, Zap, Send, CheckCircle2 } from 'lucide-react'
import { ScrollReveal, AnimatedCounter } from './ScrollReveal'

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
    <section id="how-it-works" className="py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-primary/[0.04] rounded-full blur-3xl animate-morph"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/[0.04] rounded-full blur-3xl animate-morph" style={{ animationDelay: '-4s' }}></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/10 border border-secondary/20 rounded-full mb-6 shimmer-border">
              <span className="text-sm font-semibold text-secondary">Simple Setup</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              How it <span className="anim-gradient-text">works</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes. No coding required. Just connect, configure, and convert.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative">
          {/* Animated Connection Line */}
          <div className="absolute top-24 left-[12.5%] right-[12.5%] h-[2px] hidden lg:block overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-pink-500 via-primary to-accent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} direction="up" scale>
                <div className="relative group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 text-7xl font-bold text-slate-100 group-hover:text-primary/10 transition-colors duration-500 z-0 select-none">
                    {step.step}
                  </div>
                  
                  <div className="relative bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 z-10 tilt-card overflow-hidden">
                    {/* Top accent line on hover */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                    
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="relative text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                    <p className="relative text-slate-600 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -right-4 z-20">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-md group-hover:border-primary/40 group-hover:shadow-lg transition-all duration-300">
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Example Result */}
        <ScrollReveal delay={200} direction="up">
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="glass-card bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="shimmer-border rounded-3xl"></div>
              
              <div className="relative text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="w-9 h-9 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Result: Automatic Lead Capture</h3>
                <p className="text-slate-500 mt-1">This happens in under <span className="text-primary font-semibold">3 seconds</span></p>
              </div>
              
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200/80">
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0 animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-slate-900">@potential_customer</p>
                    <p className="text-slate-600 mt-1">Commented on your post: <span className="text-primary font-medium">&quot;How much is this? 💰&quot;</span></p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
                    <p className="text-sm text-slate-500 mb-1">⚡ Auto-sent DM:</p>
                    <p className="text-slate-900">&quot;Hey! 👋 Thanks for your interest! Here&apos;s the pricing page you asked for: <span className="text-primary font-medium underline">yoursite.com/pricing</span>&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
