'use client'

import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqCategories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          q: 'What is GrowProfile?',
          a: 'GrowProfile is an AI-powered Instagram automation platform that helps creators grow their followers through intelligent DM campaigns, audience insights, and engagement analytics.'
        },
        {
          q: 'How do I get started?',
          a: 'Simply sign up for a free account, connect your Instagram profile, and start building your first DM campaign. Our onboarding guide will walk you through each step.'
        },
        {
          q: 'Is GrowProfile safe to use?',
          a: 'Yes, we use Instagram\'s official API and follow all of Instagram\'s terms of service. Your account safety is our top priority.'
        },
        {
          q: 'Do I need any special Instagram permissions?',
          a: 'You\'ll need a connected Instagram Business or Creator account. We recommend authenticating through the Instagram login flow for security.'
        }
      ]
    },
    {
      title: 'Features & Functionality',
      faqs: [
        {
          q: 'What is AutoDM?',
          a: 'AutoDM is our flagship feature that sends automated, personalized direct messages to users who engage with your content based on triggers you set.'
        },
        {
          q: 'How does audience analytics work?',
          a: 'We track your audience demographics, growth patterns, engagement rates, and provide insights into which content types perform best.'
        },
        {
          q: 'Can I schedule campaigns in advance?',
          a: 'Yes! You can set up campaigns with custom scheduling, including specific times and dates for when messages should be sent.'
        },
        {
          q: 'What kind of triggers can I set?',
          a: 'You can trigger DMs based on: profile follows, comment mentions, post likes, story views, and more. Customize triggers based on your strategy.'
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      faqs: [
        {
          q: 'Is there a free trial?',
          a: 'Yes! All paid plans include a 14-day free trial. No credit card required to get started.'
        },
        {
          q: 'Can I switch plans anytime?',
          a: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately or at the next billing cycle, depending on your choice.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
        },
        {
          q: 'Do you offer annual billing discounts?',
          a: 'Yes, we offer 20% off annual billing compared to monthly. Contact our sales team for enterprise pricing.'
        }
      ]
    },
    {
      title: 'Account & Support',
      faqs: [
        {
          q: 'How do I change my password?',
          a: 'Go to your account settings, click "Security", and select "Change Password". Follow the prompts to update your password.'
        },
        {
          q: 'Can I manage multiple accounts?',
          a: 'Yes, depending on your plan. Starter allows 1 account, Pro allows unlimited, and Agency is designed for managing multiple brands.'
        },
        {
          q: 'What should I do if I forget my password?',
          a: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link within minutes.'
        },
        {
          q: 'How do I contact support?',
          a: 'You can reach our support team at support@growprofile.in. For general or business enquiries, email info@growprofile.in. Response times vary by plan tier.'
        }
      ]
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
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-slate-600">
            Find answers to common questions about GrowProfile, features, and how to get the most out of your account.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, cidx) => (
            <div key={cidx} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.title}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, fidx) => {
                  const itemIdx = cidx * 10 + fidx
                  const isOpen = openIdx === itemIdx
                  return (
                    <div
                      key={fidx}
                      className="border border-slate-200 rounded-lg hover:border-primary/50 transition-colors overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : itemIdx)}
                        className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-600 transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                          <p className="text-slate-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Reach out to our support team at support@growprofile.in or contact info@growprofile.in for general enquiries.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="mailto:support@growprofile.in" className="flex items-center gap-2">
              Contact Support <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
                <span className="font-bold text-slate-900">GrowProfile</span>
              </div>
              <p className="text-sm text-slate-600">Grow your Instagram with intelligent automation</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features" className="text-slate-600 hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="text-slate-600 hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="text-slate-600 hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-primary">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <p className="text-center text-sm text-slate-600">© 2024 GrowProfile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
