'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/[0.03]' 
        : 'bg-white/60 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo-20260320-v2.png"
                alt="ScorpixMedia Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">GrowProfile</span>
              <span className="text-[10px] text-slate-500 -mt-1">by ScorpixMedia</span>
            </div>
          </Link>
          <div className="hidden gap-8 md:flex">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'FAQ', href: '/faq' },
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="text-slate-700 hover:text-primary hover:bg-primary/5 transition-all duration-300">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
