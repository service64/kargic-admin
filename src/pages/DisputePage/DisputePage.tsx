import * as React from 'react'
import {
  AlertCircleIcon,
  BarChart3Icon,
  ClockIcon,
  ShieldCheckIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAdminReportSummary } from '@/hooks/api/report/useAdminReportSummary'
import { DisputeDataTable } from '@/pages/DisputePage/DisputeDataTable'
import { ReportDetailsDialog } from '@/pages/DisputePage/ReportDetailsDialog'

const PAGE_SIZE = 10

export function DisputePage() {
  const [searchInput, setSearchInput] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [dateRange, setDateRange] = React.useState<'30' | '90' | 'all'>('30')
  const [sortOrder, setSortOrder] = React.useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = React.useState(1)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminReportSummary({
      page,
      limit: PAGE_SIZE,
      sort: sortOrder,
      dateRange,
      ...(searchTerm ? { searchTerm } : {}),
    })

  const rows = data?.data ?? []
  const meta = data?.meta
  const overview = data?.overview

  const applyFilters = React.useCallback(() => {
    setPage(1)
    setSearchTerm(searchInput.trim())
  }, [searchInput])

  const clearFilters = React.useCallback(() => {
    setSearchInput('')
    setSearchTerm('')
    setDateRange('30')
    setSortOrder('newest')
    setPage(1)
  }, [])

  const openDetails = React.useCallback((userId: string) => {
    setSelectedUserId(userId)
    setDetailsOpen(true)
  }, [])

  React.useEffect(() => {
    setPage(1)
  }, [dateRange, sortOrder])

  const hasFilters = Boolean(searchTerm || dateRange !== '30' || sortOrder !== 'newest')

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
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Monitor users who received reports, search by user id or email,
            sort by report date, and resolve individual reports from the details dialog.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Users</CardTitle>
            <BarChart3Icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {overview?.totalReportedUsers ?? 0}
            </p>
            <CardDescription className="mt-1 text-xs font-medium">
              Unique users with reports
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertCircleIcon className="text-destructive size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {overview?.totalUnresolvedReports ?? 0}
            </p>
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
              Resolved Reports
            </CardTitle>
            <ShieldCheckIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {overview?.totalResolvedReports ?? 0}
            </p>
            <CardDescription className="text-emerald-700 dark:text-emerald-400 mt-1 text-xs font-medium">
              Updated by admins
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <ClockIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {overview?.totalReports ?? 0}
            </p>
            <CardDescription className="mt-1 text-xs">
              Across all matching users
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <DisputeDataTable
        toolbar={{
          searchInput,
          onSearchInputChange: setSearchInput,
          onApplySearch: applyFilters,
          onClearSearch: clearFilters,
          hasFilters,
          dateRange,
          onDateRangeChange: setDateRange,
          sortOrder,
          onSortOrderChange: setSortOrder,
          isFetching,
          onRefresh: () => void refetch(),
        }}
        rows={rows}
        meta={meta}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        onPageChange={setPage}
        onOpenDetails={openDetails}
      />

      <ReportDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        userId={selectedUserId}
      />
    </div>
  )
}
