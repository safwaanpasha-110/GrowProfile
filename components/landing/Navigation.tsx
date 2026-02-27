import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="ScorpixMedia Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">GrowProfile</span>
              <span className="text-[10px] text-slate-500 -mt-1">by ScorpixMedia</span>
            </div>
          </Link>
          <div className="hidden gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative group">
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/faq" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="text-slate-700 hover:text-primary hover:bg-primary/5">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
