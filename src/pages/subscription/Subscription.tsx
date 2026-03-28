import * as React from 'react'

import { Button } from '@/components/ui/button'
import { computeOverview, MOCK_SUBSCRIPTIONS } from '@/pages/subscription/mock-data'
import { SubscriptionOverviewCards } from '@/pages/subscription/SubscriptionOverviewCards'
import { SubscriptionTable } from '@/pages/subscription/SubscriptionTable'
import { SparklesIcon } from 'lucide-react'

const LOADING_MS = 900

export default function Subscription() {
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), LOADING_MS)
    return () => window.clearTimeout(t)
  }, [])

  const overview = React.useMemo(
    () => computeOverview(MOCK_SUBSCRIPTIONS),
    []
  )

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_SUBSCRIPTIONS.filter((row) => {
      if (
        statusFilter !== 'all' &&
        row.status !== statusFilter
      ) {
        return false
      }
      if (!q) return true
      return (
        row.id.toLowerCase().includes(q) ||
        row.planName.toLowerCase().includes(q)
      )
    })
  }, [search, statusFilter])

  return (
    <div className="container mx-auto space-y-6 px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Subscription Management
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed md:text-base">
            Monitor plans, billing cycles, and renewal dates in one place.
            Filter and search to find subscriptions quickly.
          </p>
        </div>
        <Button
          className="shrink-0 gap-2 bg-emerald-800 text-white hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          size="default"
        >
          <SparklesIcon className="size-4" />
          Upgrade Plan
        </Button>
      </div>

      <SubscriptionOverviewCards overview={overview} loading={loading} />

      <SubscriptionTable
        rows={filteredRows}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  )
}
