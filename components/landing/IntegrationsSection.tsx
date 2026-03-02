'use client'

import { Shield, CheckCircle2, Lock, Eye, FileCheck, Instagram } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const compliancePoints = [
  {
    icon: Shield,
    title: 'Official Meta APIs Only',
    description: 'Built exclusively on Instagram Graph API and Messenger Platform. No third-party hacks or unofficial methods.',
  },
  {
    icon: Lock,
    title: 'Secure OAuth Authentication',
    description: 'Industry-standard Facebook Login for Business. Your credentials are never stored on our servers.',
  },
  {
    icon: Eye,
    title: 'User-Initiated Only',
    description: 'AutoDM only responds to users who interact first (comment, message, mention). No cold outreach ever.',
  },
  {
    icon: FileCheck,
    title: 'Policy Compliant',
    description: 'Designed to meet Meta Platform Terms and Developer Policies. Regular compliance audits.',
  },
]

export function IntegrationsSection() {
  return (
    <section id="compliance" className="py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:60px_60px] opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,white_70%)]"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <ScrollReveal direction="left" distance={60}>
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border border-green-200 rounded-full mb-6 shimmer-border">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Meta Approved Platform</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                100% Compliant.{' '}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Zero Risk.</span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                GrowProfile is built the right way — using only official Meta APIs. 
                Your Instagram account stays safe, and your automation is always within platform guidelines.
              </p>

              <div className="space-y-6">
                {compliancePoints.map((point, idx) => (
                  <ScrollReveal key={idx} delay={idx * 100} direction="left" distance={40}>
                    <div className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        <point.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-green-600 transition-colors duration-300">{point.title}</h3>
                        <p className="text-slate-600">{point.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Visual */}
          <ScrollReveal direction="right" distance={60} delay={200}>
            <div className="relative">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl rounded-full animate-morph"></div>
              
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/80 tilt-card overflow-hidden">
                {/* Shimmer top border */}
                <div className="shimmer-border rounded-3xl"></div>
                
                {/* Meta Partnership Badge */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-900 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span className="text-white font-semibold">Meta Business Partner</span>
                  </div>
                </div>

                {/* API Icons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="group/card p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200/80 text-center hover:shadow-xl hover:border-pink-300 hover:-translate-y-1 transition-all duration-300">
                    <Instagram className="w-10 h-10 mx-auto mb-3 text-pink-500 group-hover/card:scale-110 transition-transform duration-300" />
                    <p className="font-semibold text-slate-900">Instagram Graph API</p>
                    <p className="text-xs text-slate-500 mt-1">Official integration</p>
                  </div>
                  <div className="group/card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 text-center hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto mb-3 text-blue-500 group-hover/card:scale-110 transition-transform duration-300" fill="currentColor">
                      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.34.24.57l-.27 1.79c-.05.35.31.59.63.44l2-.91c.17-.08.36-.08.53-.03.9.26 1.86.39 2.86.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2z"/>
                    </svg>
                    <p className="font-semibold text-slate-900">Messenger Platform</p>
                    <p className="text-xs text-slate-500 mt-1">Direct messaging</p>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 hover:shadow-md transition-all duration-300 cursor-default">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:shadow-md transition-all duration-300 cursor-default">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">OAuth 2.0</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 hover:shadow-md transition-all duration-300 cursor-default">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">GDPR Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
