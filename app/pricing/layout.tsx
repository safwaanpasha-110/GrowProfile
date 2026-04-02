import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — GrowProfile',
  description:
    'Simple, transparent pricing for Instagram automation. Start free, upgrade when you grow. No hidden fees.',
  alternates: { canonical: 'https://growprofile.in/pricing' },
  openGraph: {
    url: 'https://growprofile.in/pricing',
    title: 'Pricing — GrowProfile',
    description:
      'Simple, transparent pricing for Instagram automation. Start free, upgrade when you grow.',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
