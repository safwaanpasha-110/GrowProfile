import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — GrowProfile',
  description:
    'Answers to common questions about GrowProfile Instagram automation — how it works, Meta compliance, pricing, and setup.',
  alternates: { canonical: 'https://growprofile.in/faq' },
  openGraph: {
    url: 'https://growprofile.in/faq',
    title: 'FAQ — GrowProfile',
    description:
      'Answers to common questions about GrowProfile Instagram automation.',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
