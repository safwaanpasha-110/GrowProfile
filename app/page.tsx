import type { Metadata } from 'next'
import { Navigation } from '@/components/landing/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { IntegrationsSection } from '@/components/landing/IntegrationsSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'GrowProfile — Instagram Auto DM & Comment Automation',
  description:
    'Automate Instagram DMs and comment replies using the official Meta API. Turn every Instagram comment into a customer — 100% Meta-compliant.',
  alternates: { canonical: 'https://growprofile.in' },
  openGraph: {
    url: 'https://growprofile.in',
    title: 'GrowProfile — Instagram Auto DM & Comment Automation',
    description:
      'Automate Instagram DMs and comment replies using the official Meta API. Turn every Instagram comment into a customer.',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

