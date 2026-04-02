import Link from 'next/link'
import { ReactNode } from 'react'
import Image from 'next/image'
import { CheckCircle2, Shield, Zap } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

const features = [
  { icon: Zap, text: 'Automated DM campaigns' },
  { icon: CheckCircle2, text: '100% Meta compliant' },
  { icon: Shield, text: 'Secure OAuth integration' },
]

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/15 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo-20260320-v4.png"
              alt="ScorpixMedia Logo"
              width={48}
              height={48}
              className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">GrowProfile</span>
              <span className="text-xs text-white/70">by ScorpixMedia</span>
            </div>
          </Link>
          
          {/* Content */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Turn Instagram comments into{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">customers</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Set up automated DM campaigns that respond to comments with your links and offers. Meta-compliant and secure.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right - Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image
                  src="/images/logo-20260320-v4.png"
                alt="ScorpixMedia Logo"
                width={48}
                height={48}
                className="rounded-xl shadow-lg"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-slate-900">GrowProfile</span>
                <span className="text-xs text-slate-500">by ScorpixMedia</span>
              </div>
            </Link>
          </div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-600">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
