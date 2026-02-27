'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How do I set up my first AutoDM campaign?',
      a: 'Go to Apps > AutoDM, select the posts you want to monitor, configure your message template, and set triggers. Click "Start Campaign" to activate it.'
    },
    {
      q: 'What are the limits on DM sends?',
      a: 'Limits depend on your plan: Starter has 100/month, Pro has 10,000/month, and Agency has unlimited. You can monitor your usage in Plan & Usage.'
    },
    {
      q: 'Can I personalize messages for each user?',
      a: 'Yes! Use {name} in your message template to include the username. Pro and Agency plans support more advanced personalization options.'
    },
    {
      q: 'How accurate are the audience insights?',
      a: 'Our insights are based on publicly available Instagram data and real engagement metrics. Data updates daily for accurate tracking.'
    },
    {
      q: 'What happens if I exceed my plan limits?',
      a: 'You\'ll receive a notification when you\'re approaching your limit. You can upgrade to a higher plan or wait for your monthly reset.'
    },
    {
      q: 'Is there a limit on how many campaigns I can create?',
      a: 'It depends on your plan. Starter allows 1 active campaign, Pro allows unlimited, and Agency allows unlimited with dedicated support.'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about using GrowProfile</p>
      </div>

      <div className="max-w-3xl space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="border border-border rounded-lg hover:border-primary/50 transition-colors overflow-hidden bg-card"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left hover:bg-secondary/20 transition-colors flex items-center justify-between"
              >
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 py-4 border-t border-border bg-secondary/10">
                  <p className="text-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
