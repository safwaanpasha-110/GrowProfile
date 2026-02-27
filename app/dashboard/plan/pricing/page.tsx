'use client'

import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for getting started',
      current: false,
      features: [
        'Up to 100 DM sends/month',
        '1 active campaign',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For creators serious about growth',
      current: true,
      features: [
        'Up to 10,000 DM sends/month',
        'Unlimited campaigns',
        'Advanced analytics',
        'Priority support',
        'Custom templates',
        'Smart scheduling'
      ]
    },
    {
      name: 'Agency',
      price: '$99',
      description: 'For managing multiple accounts',
      current: false,
      features: [
        'Unlimited DM sends',
        'Unlimited accounts',
        'Everything in Pro',
        'Dedicated manager',
        '24/7 support',
        'API access'
      ]
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Upgrade Your Plan</h1>
        <p className="text-muted-foreground">Choose the plan that best fits your growth goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border transition-all overflow-hidden flex flex-col ${
              plan.current
                ? 'border-primary shadow-xl md:scale-105 bg-card'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            {plan.current && (
              <div className="h-1 bg-gradient-to-r from-primary to-secondary"></div>
            )}
            <div className="p-8 flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>

              {plan.current ? (
                <Button disabled className="w-full mb-8 bg-primary/50 cursor-not-allowed">
                  Current Plan
                </Button>
              ) : (
                <Button asChild className="w-full mb-8 bg-primary hover:bg-primary/90">
                  <a href="#" className="flex items-center justify-center gap-2">
                    Upgrade <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              )}

              <div className="space-y-4">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
