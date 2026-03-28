import * as React from 'react'
import {
  AlertCircleIcon,
  BarChart3Icon,
  ClockIcon,
  DownloadIcon,
  PlusIcon,
  ShieldCheckIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DisputeDataTable } from '@/pages/DisputePage/DisputeDataTable'

export function DisputePage() {
  const [status, setStatus] = React.useState('all')
  const [priority, setPriority] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('30')
  const [sortOrder, setSortOrder] = React.useState('newest')

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            Active repository
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Dispute Tracking
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <DownloadIcon className="size-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-emerald-800 text-white hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            <PlusIcon className="size-4" />
            Create Record
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <BarChart3Icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">1,284</p>
            <CardDescription className="text-emerald-700 dark:text-emerald-400 mt-1 text-xs font-medium">
              +12% vs LY
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertCircleIcon className="text-destructive size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">42</p>
            <CardDescription className="mt-1">
              <span className="bg-destructive/15 text-destructive inline-flex rounded-md px-2 py-0.5 text-xs font-semibold">
                Action Needed
              </span>
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved (MOM)
            </CardTitle>
            <ShieldCheckIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">892</p>
            <CardDescription className="text-emerald-700 dark:text-emerald-400 mt-1 text-xs font-medium">
              98.2% Accuracy
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <ClockIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">156</p>
            <CardDescription className="mt-1 text-xs">
              Avg 2.4 Days
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <DisputeDataTable
        toolbar={{
          status,
          onStatusChange: setStatus,
          priority,
          onPriorityChange: setPriority,
          dateRange,
          onDateRangeChange: setDateRange,
          sortOrder,
          onSortOrderChange: setSortOrder,
        }}
      />
    </div>
  )
}
