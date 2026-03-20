'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
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
      name: 'Free',
      introPrice: null,
      price: 0,
      period: '/month',
      description: 'Try GrowProfile at no cost, forever',
      cta: 'Get Started Free',
      ctaHref: '/auth/signup',
      features: [
        'Up to 50 DM sends per month',
        '1 active campaign',
        'Basic analytics dashboard',
        'Comment keyword triggers',
        'Single DM template',
        'Community support',
        'No credit card required'
      ],
      highlighted: false,
      isEnterprise: false,
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      name: 'Pro',
      introPrice: 2.99,
      price: 5,
      period: '/month after',
      description: 'For creators serious about growth',
      cta: 'Start for $2.99',
      ctaHref: '/auth/signup',
      features: [
        'Up to 10,000 DM sends per month',
        'Unlimited active campaigns',
        'Advanced analytics & conversion tracking',
        'AI-powered audience insights',
        'Priority email & chat support',
        'Custom DM templates library',
        'Smart scheduling & delay controls',
        'Growth tracking dashboard',
        'A/B testing for DM messages',
        'Export reports (CSV/PDF)'
      ],
      highlighted: true,
      isEnterprise: false,
      gradient: 'from-primary to-secondary',
    },
    {
      name: 'Enterprise',
      introPrice: null,
      price: -1,
      period: '',
      description: 'Custom solutions for agencies & high-volume brands',
      cta: "Let's have a call",
      ctaHref: 'mailto:hello@scorpixmedia.com?subject=Enterprise Plan Enquiry',
      features: [
        'Unlimited DM sends per month',
        'Unlimited accounts & campaigns',
        'Everything in Pro included',
        'Multi-account management portal',
        'Dedicated success manager',
        '24/7 priority phone & chat support',
        'Full API access & webhooks',
        'Custom integrations (Zapier, HubSpot, Slack)',
        'White-label & custom branding',
        'Advanced team collaboration',
        'SLA guarantee (99.9% uptime)',
        'Custom onboarding & training session'
      ],
      highlighted: false,
      isEnterprise: true,
      gradient: 'from-accent to-primary',
    }
  ]

  const faqs = [
    {
      question: 'How does the Pro plan introductory pricing work?',
      answer: 'Your first month on Pro is just $2.99 — after that it renews at $5/month. No hidden fees, cancel anytime.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, cancel anytime from your account settings. Your access remains active until the end of your current billing period.'
    },
    {
      question: 'Is there a free plan?',
      answer: 'Yes! The Free plan lets you send up to 50 DMs per month with 1 active campaign — no credit card required, forever free.'
    },
    {
      question: 'What does the Enterprise plan include?',
      answer: 'Enterprise is fully custom — unlimited accounts, white-labelling, API access, a dedicated success manager, and a direct line to our team. Book a call and we will tailor a plan to your needs.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards via Stripe. Enterprise customers can also pay via bank transfer or invoice.'
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
                src="/images/logo-20260320-v2.png"
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
                <Link href="/auth/signup">Get Started Free</Link>
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
              Start free, scale when ready. No tricks, no lock-ins.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <span className="text-sm text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Free plan forever</span>
              <span className="text-sm text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Pro from $2.99 first month</span>
              <span className="text-sm text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Cancel anytime</span>
            </div>
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
                  
                  <div className="mb-1">
                    {plan.price === -1 ? (
                      <div className="text-4xl font-bold text-slate-900">Custom</div>
                    ) : plan.introPrice ? (
                      <>
                        <div className="flex items-end gap-2">
                          <span className="text-slate-400 text-3xl font-bold">$</span>
                          <span className="text-5xl font-bold text-slate-900">{plan.introPrice}</span>
                          <span className="text-slate-500 mb-1">first month</span>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          then <span className="font-semibold text-slate-600">${plan.price}/mo</span> after
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400 text-3xl font-bold">$</span>
                        <span className="text-5xl font-bold text-slate-900">0</span>
                        <span className="text-slate-500 ml-2">/month</span>
                      </>
                    )}
                  </div>

                  <div className="mb-8 mt-6">
                    <Button
                      asChild
                      className={`w-full transition-all duration-300 hover:-translate-y-0.5 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-xl'
                          : plan.isEnterprise
                          ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl border-0'
                          : 'border-slate-300 hover:bg-slate-50 hover:border-primary/30'
                      }`}
                      variant={plan.highlighted || plan.isEnterprise ? 'default' : 'outline'}
                    >
                      <Link href={plan.ctaHref}>{plan.cta}</Link>
                    </Button>
                  </div>

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
              Start for free, grow at your pace
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Free forever. Pro from just $2.99 your first month, then $5/mo. No contracts, cancel anytime.
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
                src="/images/logo-20260320-v2.png"
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
