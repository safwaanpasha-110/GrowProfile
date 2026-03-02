'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal, AnimatedCounter } from './ScrollReveal'

export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Animated Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl animate-morph"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '-4s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-white/30 rounded-full animate-bounce-gentle" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-white/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-[20%] w-2 h-2 bg-white/25 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 right-[25%] w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
        <ScrollReveal direction="up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-8 hover:bg-white/30 transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-semibold text-white">14-Day Free Trial • No Credit Card</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Start converting comments
            <br />into customers today
          </h2>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={200}>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join <span className="font-bold text-white"><AnimatedCounter end={2500} duration={2000} />+</span> creators already using GrowProfile to automate Instagram engagement.
          </p>
        </ScrollReveal>

        {/* Features */}
        <ScrollReveal direction="up" delay={300}>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {['Unlimited campaigns', 'Real-time analytics', 'Priority support'].map((feature, idx) => (
              <div key={feature} className="flex items-center gap-2 text-white hover:scale-105 transition-transform duration-300">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={400} scale>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 shadow-2xl shadow-black/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 group">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
