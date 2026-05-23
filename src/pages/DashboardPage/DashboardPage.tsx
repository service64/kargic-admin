import { Link } from 'react-router-dom'

import { RecentTransactionsCard } from '@/pages/DashboardPage/RecentTransactionsCard'
import { SiteStatisticsCards } from '@/pages/DashboardPage/SiteStatisticsCards'
import { SystemActivityOverviewChart } from '@/pages/DashboardPage/SystemActivityOverviewChart'

export function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        <SiteStatisticsCards />

        <SystemActivityOverviewChart />

        <RecentTransactionsCard />

        <p className="text-muted-foreground text-center text-[11px]">
          <Link to="/dispute" className="text-primary hover:underline">
            Disputes
          </Link>
          {' · '}
          <Link to="/subscription" className="text-primary hover:underline">
            Subscriptions
          </Link>
          {' · '}
          <Link
            to="/user-management/users"
            className="text-primary hover:underline"
          >
            Users
          </Link>
          {' · '}
          <Link
            to="/seller-verification"
            className="text-primary hover:underline"
          >
            Seller verification
          </Link>
        </p>
      </div>
    </div>
  )
}
