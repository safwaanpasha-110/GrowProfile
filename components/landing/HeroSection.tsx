'use client'

import Link from 'next/link'
import { ArrowRight, MessageSquare, Users, TrendingUp, Sparkles, Instagram, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal, AnimatedCounter } from './ScrollReveal'
import { useEffect, useState } from 'react'

const TYPING_WORDS = ['Customers', 'Revenue', 'Leads', 'Growth']

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex]
    const speed = isDeleting ? 50 : 80

    if (!isDeleting && displayed === word) {
      const pause = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(pause)
    }

    if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length)
      return
    }

    const timer = setTimeout(() => {
      setDisplayed(
        isDeleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1)
      )
    }, speed)

    return () => clearTimeout(timer)
  }, [displayed, isDeleting, wordIndex])

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-primary/25 to-secondary/15 rounded-full blur-3xl animate-morph animate-pulse-glow"></div>
        <div className="absolute bottom-10 left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-secondary/20 to-accent/15 rounded-full blur-3xl animate-morph animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,#8883_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse,_hsl(270_84%_55%_/_0.06)_0%,transparent_70%)]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <ScrollReveal delay={100} direction="up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full mb-8 shadow-lg shadow-primary/5 shimmer-border">
                <Sparkles className="w-4 h-4 text-primary animate-bounce-gentle" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Meta-Compliant AutoDM Platform</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.08] tracking-tight">
                Turn Comments Into{' '}
                <span className="relative inline-block min-w-[200px]">
                  <span className="anim-gradient-text">{displayed}</span>
                  <span className="inline-block w-[3px] h-[0.85em] bg-primary/70 ml-1 animate-pulse align-baseline"></span>
                  <svg className="absolute -bottom-2 left-0 w-full animate-draw-line" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 2 150 2 198 8" stroke="url(#heroGrad)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(270, 84%, 55%)" />
                        <stop offset="50%" stopColor="hsl(210, 100%, 50%)" />
                        <stop offset="100%" stopColor="hsl(336, 100%, 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={350} direction="up">
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                Automatically send personalized DMs to users who comment on your Instagram posts.
                <span className="font-medium text-slate-900"> Official Meta API. 100% compliant.</span>
              </p>
            </ScrollReveal>

            <ScrollReveal delay={500} direction="up">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 group relative overflow-hidden">
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 border-slate-300 hover:bg-slate-50 hover:border-primary/50 group">
                  <Link href="#how-it-works" className="flex items-center gap-2">
                    See How It Works
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={650} direction="up">
              <div className="flex items-center gap-8 pt-4 border-t border-slate-200/60">
                <div>
                  <p className="text-2xl font-bold text-slate-900"><AnimatedCounter end={50} suffix="K+" /></p>
                  <p className="text-xs text-slate-500">DMs Automated</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900"><AnimatedCounter end={98} suffix="%" /></p>
                  <p className="text-xs text-slate-500">Delivery Rate</p>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900"><AnimatedCounter end={4} suffix=".9★" /></p>
                  <p className="text-xs text-slate-500">User Rating</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Dashboard Preview */}
          <ScrollReveal delay={300} direction="right" distance={60}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 blur-3xl rounded-3xl animate-pulse-glow"></div>

              <div className="relative z-10 glass-card rounded-3xl p-8 shadow-2xl border border-white/50 tilt-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">@yourbusiness</p>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Connected
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-bounce-gentle">
                    Campaign Active
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: MessageSquare, label: 'DMs Sent Today', desc: 'Auto-responding to comments', value: 247, gradient: 'from-primary to-secondary', bg: 'from-primary/5 to-primary/10', border: 'border-primary/20' },
                    { icon: Users, label: 'Link Clicks', desc: 'From automated DMs', value: 89, gradient: 'from-secondary to-accent', bg: 'from-secondary/5 to-secondary/10', border: 'border-secondary/20' },
                    { icon: TrendingUp, label: 'Conversion Rate', desc: 'Comments to customers', value: 36, gradient: 'from-accent to-primary', bg: 'from-accent/5 to-accent/10', border: 'border-accent/20', suffix: '%' },
                  ].map((stat, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${stat.bg} rounded-xl border ${stat.border} magnetic-hover cursor-default`}>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600">{stat.label}</p>
                        <p className="font-bold text-slate-900 text-sm">{stat.desc}</p>
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-slate-50/80 rounded-xl border border-slate-200/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer"></div>
                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Latest trigger:
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs">👤</div>
                    <div className="flex-1">
                      <p className="text-sm"><span className="font-semibold">@customer</span> commented: <span className="text-primary font-medium">&quot;Price?&quot;</span></p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Send className="w-2 h-2 text-white" />
                        </div>
                        <p className="text-xs text-green-600 font-medium">DM sent automatically with pricing link</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-gentle">
        <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
