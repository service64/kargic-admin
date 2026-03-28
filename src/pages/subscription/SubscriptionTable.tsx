import { MoreHorizontalIcon, SearchIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'
import {
  type SubscriptionRecord,
  type SubscriptionStatus,
} from '@/pages/subscription/mock-data'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function statusBadgeClass(status: SubscriptionStatus) {
  switch (status) {
    case 'active':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'paused':
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
    case 'canceled':
      return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
    default:
      return ''
  }
}

function formatStatusLabel(status: SubscriptionStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatBillingDate(value: string) {
  if (value === '—') return '—'
  return new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SubscriptionTable({
  rows,
  loading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  rows: SubscriptionRecord[]
  loading: boolean
  search: string
  onSearchChange: (v: string) => void
  statusFilter: string
  onStatusFilterChange: (v: string) => void
}) {
  const showEmpty = !loading && rows.length === 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search subscriptions…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background h-10 pl-9"
            disabled={loading}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusFilterChange(v ?? 'all')}
          disabled={loading}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground w-[140px] text-xs font-semibold tracking-wide uppercase">
                Subscription ID
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Billing cycle
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Next billing
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Amount
              </TableHead>
              <TableHead className="text-muted-foreground text-right text-xs font-semibold tracking-wide uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto size-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : showEmpty ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 p-0">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
                    <p className="text-foreground text-base font-medium">
                      No subscriptions found
                    </p>
                    <p className="text-muted-foreground max-w-sm text-sm">
                      Try adjusting your search or status filter, or create a
                      new subscription from the header.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-md font-medium capitalize',
                        statusBadgeClass(row.status)
                      )}
                    >
                      {formatStatusLabel(row.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.billingCycle}</TableCell>
                  <TableCell className="text-sm">
                    {formatBillingDate(row.nextBillingDate)}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {row.status === 'canceled' && row.amountCents === 0
                      ? '—'
                      : money.format(row.amountCents / 100)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8"
                          />
                        }
                      >
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Upgrade / Downgrade</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
