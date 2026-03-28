import {
  CalendarClockIcon,
  CreditCardIcon,
  LayersIcon,
  WalletIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export type SubscriptionOverview = {
  activeCount: number
  currentPlan: string
  monthlyCost: number
  nextBillingDate: string
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function SubscriptionOverviewCards({
  overview,
  loading,
}: {
  overview: SubscriptionOverview
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-4 rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      title: 'Active Subscriptions',
      value: String(overview.activeCount),
      hint: 'Across all workspaces',
      icon: LayersIcon,
    },
    {
      title: 'Current Plan',
      value: overview.currentPlan,
      hint: 'Primary billing profile',
      icon: CreditCardIcon,
    },
    {
      title: 'Monthly Cost',
      value: money.format(overview.monthlyCost),
      hint: 'Normalized MRR estimate',
      icon: WalletIcon,
    },
    {
      title: 'Next Billing Date',
      value: overview.nextBillingDate,
      hint: 'Earliest upcoming charge',
      icon: CalendarClockIcon,
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <Card
          key={item.title}
          className="border shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="text-muted-foreground size-4 shrink-0" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              {item.value}
            </p>
            <CardDescription className="mt-1.5 text-xs leading-relaxed">
              {item.hint}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
