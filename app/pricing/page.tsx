'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal, AnimatedCounter } from '@/components/landing/ScrollReveal'
import { useState, useEffect } from 'react'

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const plans = [
    {
      name: 'Starter',
      price: 0,
      period: '/month',
      description: 'Perfect for getting started with automation',
      cta: 'Start Free',
      features: [
        'Up to 100 DM sends per month',
        '1 active campaign',
        'Basic analytics',
        'Manual audience insights',
        'Email support',
        '7-day free trial'
      ],
      highlighted: false,
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      name: 'Pro',
      price: 29,
      period: '/month',
      description: 'For creators serious about growth',
      cta: 'Start Free Trial',
      features: [
        'Up to 10,000 DM sends per month',
        'Unlimited active campaigns',
        'Advanced analytics & reporting',
        'AI-powered audience insights',
        'Priority email support',
        '14-day free trial',
        'Custom DM templates',
        'Smart scheduling',
        'Growth tracking dashboard'
      ],
      highlighted: true,
      gradient: 'from-primary to-secondary',
    },
    {
      name: 'Agency',
      price: 99,
      period: '/month',
      description: 'For managing multiple accounts',
      cta: 'Contact Sales',
      features: [
        'Unlimited DM sends',
        'Unlimited accounts',
        'Everything in Pro',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom integrations',
        'API access',
        'White-label options',
        'SLA guarantee'
      ],
      highlighted: false,
      gradient: 'from-accent to-primary',
    }
  ]

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will be active until the end of your billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans include a 14-day free trial. No credit card required to get started.'
    },
    {
      question: 'Do you offer annual billing discounts?',
      answer: 'Yes, we offer 20% off when you choose annual billing. Contact us for details.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/[0.03]'
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="ScorpixMedia Logo"
                width={36}
                height={36}
                className="rounded-xl shadow-md group-hover:scale-105 transition-all duration-300"
              />
              <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">GrowProfile</span>
            </Link>
            <div className="flex gap-3">
              <Button variant="ghost" asChild className="text-slate-700 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(270_84%_55%_/_0.04)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(210_100%_50%_/_0.04)_0%,transparent_50%)]"></div>
        
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-6 shimmer-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Simple Pricing</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Simple, transparent{' '}
              <span className="anim-gradient-text">pricing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-4">
              Choose the perfect plan for your Instagram growth goals
            </p>
            <p className="text-sm text-slate-500">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <ScrollReveal key={idx} delay={idx * 120} direction="up" scale>
              <div
                className={`rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col tilt-card group ${
                  plan.highlighted
                    ? 'border-primary/30 shadow-2xl md:scale-105 bg-white relative'
                    : 'border-slate-200/80 bg-white hover:border-primary/30 hover:shadow-xl'
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute -top-px -left-px -right-px h-[3px] bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </>
                )}
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                  <p className="text-sm text-slate-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900">
                      {plan.price === 0 ? '$0' : <><span className="text-slate-400 text-3xl">$</span><AnimatedCounter end={plan.price} duration={1500} /></>}
                    </span>
                    <span className="text-slate-500 ml-2">{plan.period}</span>
                  </div>

                  <Button
                    asChild
                    className={`w-full mb-8 transition-all duration-300 hover:-translate-y-0.5 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-xl'
                        : 'border-slate-300 hover:bg-slate-50 hover:border-primary/30'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    <Link href="/auth/signup">{plan.cta}</Link>
                  </Button>

                  <div className="space-y-4">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex gap-3 items-start group/item">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(270_84%_55%_/_0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-3xl mx-auto relative">
          <ScrollReveal direction="up">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-4 tracking-tight">
              Frequently Asked <span className="anim-gradient-text">Questions</span>
            </h2>
            <p className="text-center text-slate-500 mb-12">Everything you need to know about our pricing</p>
          </ScrollReveal>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 80} direction="up">
                <div className="border border-slate-200/80 rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white group">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x" style={{ backgroundSize: '200% 100%' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl animate-morph"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '-4s' }}></div>
        
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center relative px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Start growing today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start automating your Instagram engagement and turn every comment into a personalized DM.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 group">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-200/80">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="ScorpixMedia Logo"
                width={28}
                height={28}
                className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">GrowProfile</span>
            </Link>
            <div className="flex gap-6 text-sm">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'FAQ', href: '/faq' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-slate-600 hover:text-primary transition-colors duration-300 underline-grow inline-block">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <p className="text-center text-sm text-slate-500">&copy; 2026 GrowProfile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
