import { WelcomeCard } from '@/components/dashboard/WelcomeCard'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { CampaignsList } from '@/components/dashboard/CampaignsList'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  return (
    <div>
      <WelcomeCard />
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CampaignsList />
        <QuickActions />
      </div>
    </div>
  )
}
