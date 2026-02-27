import { Sparkles, ArrowRight, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function WelcomeCard() {
  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white/80">Welcome back!</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to grow your audience?</h1>
          <p className="text-white/80 max-w-lg">Your AutoDM campaigns are performing great. Create a new campaign or check your analytics.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
            <Link href="/dashboard/apps/autodm" className="gap-2">
              <Instagram className="w-4 h-4" />
              New Campaign
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/dashboard/growth/insights" className="gap-2">
              View Insights <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
