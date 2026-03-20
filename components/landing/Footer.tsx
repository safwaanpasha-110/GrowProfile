'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ScrollReveal } from './ScrollReveal'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <Image
                  src="/images/logo-20260320.png"
                  alt="ScorpixMedia Logo"
                  width={40}
                  height={40}
                  className="rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold group-hover:text-primary transition-colors duration-300">GrowProfile</span>
                  <span className="text-xs text-slate-400">by ScorpixMedia</span>
                </div>
              </Link>
              <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                The official Meta-compliant AutoDM platform for Instagram. Turn comments into customers automatically.
              </p>
            </div>
            
            {/* Product */}
            <div>
              <p className="font-semibold text-white mb-4">Product</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'How it Works', href: '#how-it-works' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors duration-300 underline-grow inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <p className="font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors duration-300 underline-grow inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2026 ScorpixMedia. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Built with official Meta APIs</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span>100% Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
