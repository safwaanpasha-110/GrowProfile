'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { SignupForm } from '@/components/auth/SignupForm'

const features = [
  'Start with 14-day free trial',
  'No credit card required',
  'Unlimited projects (Pro plan)',
  'Join 10,000+ creators'
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Features */}
          <div className="flex flex-col justify-center md:py-12">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 w-fit">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <span className="text-2xl font-bold text-slate-900">GrowProfile</span>
            </Link>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Start growing your Instagram today
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of creators who are automating their growth and getting better results
            </p>
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}
