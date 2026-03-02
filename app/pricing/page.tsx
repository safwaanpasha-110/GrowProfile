'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
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
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$29',
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
      highlighted: true
    },
    {
      name: 'Agency',
      price: '$99',
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
      highlighted: false
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <span className="text-xl font-bold text-slate-900">GrowProfile</span>
            </Link>
            <div className="flex gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Simple, transparent <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">pricing</span>
          </h1>
          <p className="text-xl text-slate-600 mb-4">
            Choose the perfect plan for your Instagram growth goals
          </p>
          <p className="text-sm text-slate-600">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${
                plan.highlighted
                  ? 'border-primary shadow-2xl md:scale-105 bg-white'
                  : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="h-1 bg-gradient-to-r from-primary to-secondary"></div>
              )}
              <div className="p-8 flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600 ml-2">{plan.period}</span>
                </div>

                <Button
                  asChild
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-6 hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start growing today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start automating your Instagram engagement and turn every comment into a personalized DM.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100">
            <Link href="/signup" className="flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <span className="font-bold text-slate-900">GrowProfile</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/#features" className="text-slate-600 hover:text-primary">Features</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-primary">Pricing</Link>
              <Link href="/faq" className="text-slate-600 hover:text-primary">FAQ</Link>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-center text-sm text-slate-600">© 2026 GrowProfile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
