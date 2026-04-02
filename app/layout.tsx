import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

const BASE_URL = 'https://growprofile.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'GrowProfile — Instagram Auto DM & Comment Automation',
    template: '%s | GrowProfile',
  },
  description:
    'Automate Instagram DMs and comment replies using the official Meta API. Turn every comment into a customer with GrowProfile by ScorpixMedia.',
  keywords: [
    'Instagram automation',
    'Instagram auto DM',
    'Instagram comment automation',
    'Meta API automation',
    'Instagram growth tool',
    'Instagram DM campaigns',
    'ScorpixMedia',
    'GrowProfile',
  ],
  authors: [{ name: 'ScorpixMedia', url: BASE_URL }],
  creator: 'ScorpixMedia',
  publisher: 'ScorpixMedia',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'GrowProfile',
    title: 'GrowProfile — Instagram Auto DM & Comment Automation',
    description:
      'Automate Instagram DMs and comment replies using the official Meta API. Turn every comment into a customer.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GrowProfile — Instagram Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrowProfile — Instagram Auto DM & Comment Automation',
    description:
      'Automate Instagram DMs and comment replies using the official Meta API.',
    images: ['/og-image.png'],
    creator: '@ScorpixMedia',
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

