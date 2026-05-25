import * as React from 'react'
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DownloadIcon,
  EyeIcon,
  SearchIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminSellerVerification } from '@/hooks/api/exporter/useAdminSellerVerification'
import type {
  AdminSellerVerificationRowDto,
  SellerVerificationStatus,
} from '@/hooks/api/exporter/types'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

function statusBadgeClass(s: SellerVerificationStatus) {
  switch (s) {
    case 'Reviewing':
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
    case 'Verified':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'Flagged':
      return 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
    default:
      return ''
  }
}

function DocStages({
  stages,
}: {
  stages: AdminSellerVerificationRowDto['docs']
}) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((d, i) => (
        <span
          key={i}
          className="bg-background flex size-7 items-center justify-center rounded-full border shadow-sm"
          title={d}
        >
          {d === 'complete' && (
            <CheckCircle2Icon className="size-3.5 text-emerald-600" />
          )}
          {d === 'warning' && (
            <AlertCircleIcon className="size-3.5 text-amber-500" />
          )}
          {d === 'pending' && (
            <CircleIcon className="text-muted-foreground size-3.5" />
          )}
        </span>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function SellerVerificationPage() {
  const [searchInput, setSearchInput] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | SellerVerificationStatus
  >('all')
  const [page, setPage] = React.useState(1)

  const debouncedSearch = useDebouncedValue(searchInput, 400)

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminSellerVerification({
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    })

  const rows = data?.data ?? []
  const meta = data?.meta
  const pipelineTotal = data?.pipelineTotal ?? 0

  const from =
    meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0

  return (
    <div className="container mx-auto space-y-6 px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Seller Verification
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Review exporter company verification submissions.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <DownloadIcon className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1 space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Search
          </label>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Company name or slug..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:w-48">
          <label className="text-muted-foreground text-xs font-medium">
            Status
          </label>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as 'all' | SellerVerificationStatus)
            }
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-12 text-center text-sm">
            {error instanceof Error
              ? error.message
              : 'Failed to load seller verification queue.'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Seller name &amp; ID
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Submission
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Docs
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground w-14 text-right text-xs font-semibold tracking-wide uppercase">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-28 text-center text-sm"
                  >
                    No sellers match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.userId}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">
                          {row.companyName || '—'}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {row.displayId}
                          <span className="text-muted-foreground/70 ml-2 tabular-nums">
                            · {row.verifyCompanyPercent}%
                          </span>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {new Date(row.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <DocStages stages={row.docs} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-medium',
                          statusBadgeClass(row.status),
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-8"
                        title="View user details"
                        render={
                          <Link
                            to={`/user-management/users/${row.userId}`}
                            aria-label={`View ${row.companyName}`}
                          />
                        }
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {meta ? (
        <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing{' '}
            <span className="text-foreground font-medium tabular-nums">
              {from}-{to}
            </span>{' '}
            of{' '}
            <span className="text-foreground font-medium tabular-nums">
              {meta.total}
            </span>{' '}
            requests
            <span className="text-muted-foreground/80 hidden sm:inline">
              {' '}
              · {pipelineTotal} in pipeline
            </span>
            {isFetching ? ' · updating…' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Previous
            </Button>
            <span className="text-foreground tabular-nums">
              {meta.page} / {meta.totalPage}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRightIcon className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
