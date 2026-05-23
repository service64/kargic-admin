import { useMemo, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminOrders } from '@/hooks/api/order/useAdminOrders'
import type { OrderStatus } from '@/hooks/api/order/types'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const PAGE_SIZE = 20

type StatusFilter = 'all' | OrderStatus
type PriceSort = 'default' | 'asc' | 'desc'

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'awaiting_exporter_approval', label: 'Awaiting approval' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'received', label: 'Received' },
  { value: 'cheking', label: 'Checking' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
]

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const STATUS_BADGE: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  awaiting_exporter_approval: {
    variant: 'outline',
    label: 'Awaiting approval',
  },
  confirmed: { variant: 'default', label: 'Confirmed' },
  processing: { variant: 'default', label: 'Processing' },
  shipped: { variant: 'secondary', label: 'Shipped' },
  received: { variant: 'secondary', label: 'Received' },
  cheking: { variant: 'outline', label: 'Checking' },
  checking: { variant: 'outline', label: 'Checking' },
  completed: { variant: 'secondary', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  returned: { variant: 'destructive', label: 'Returned' },
}

function formatUnknownStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function statusBadgeProps(status: string | undefined | null) {
  if (!status || typeof status !== 'string') {
    return { variant: 'outline' as const, label: 'Unknown' }
  }
  const key = status.trim().toLowerCase()
  return (
    STATUS_BADGE[key] ?? {
      variant: 'outline' as const,
      label: formatUnknownStatus(status),
    }
  )
}

function formatOrderId(id: string) {
  if (id.length <= 10) return id
  return `…${id.slice(-8)}`
}

function sortOrdersByPrice<T extends { totalPrice: number }>(
  rows: T[],
  priceSort: PriceSort,
): T[] {
  if (priceSort === 'default') return rows
  const sorted = [...rows]
  if (priceSort === 'asc') {
    sorted.sort((a, b) => a.totalPrice - b.totalPrice)
  } else {
    sorted.sort((a, b) => b.totalPrice - a.totalPrice)
  }
  return sorted
}

function OrdersTableSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  )
}

export function OrdersSection() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [priceSort, setPriceSort] = useState<PriceSort>('default')
  const [page, setPage] = useState(1)

  const resetPage = () => setPage(1)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminOrders({
      page,
      limit: PAGE_SIZE,
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(dateFilter ? { orderDate: dateFilter } : {}),
    })

  const orders = useMemo(
    () => sortOrdersByPrice(data?.data ?? [], priceSort),
    [data?.data, priceSort],
  )
  const meta = data?.meta

  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="border-b px-4 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Newest orders first · filter by status or date · price sort on page
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter((v ?? 'all') as StatusFilter)
                resetPage()
              }}
            >
              <SelectTrigger size="sm" className="min-w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priceSort}
              onValueChange={(v) => {
                setPriceSort((v ?? 'default') as PriceSort)
                resetPage()
              }}
            >
              <SelectTrigger size="sm" className="min-w-[140px]">
                <SelectValue placeholder="Price sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Newest first</SelectItem>
                <SelectItem value="asc">Price: low → high</SelectItem>
                <SelectItem value="desc">Price: high → low</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="h-7 w-44 text-xs md:w-40"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                resetPage()
              }}
            />
            {dateFilter ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setDateFilter('')
                  resetPage()
                }}
              >
                Clear date
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        {isLoading ? (
          <OrdersTableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-8 text-center text-sm">
            {error instanceof Error ? error.message : 'Failed to load orders.'}
          </p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            No orders match the current filters.
          </p>
        ) : (
          <>
            <div className="max-h-[min(28rem,55vh)] overflow-auto rounded-b-xl">
              <table className="w-full caption-bottom text-sm">
                <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_0_var(--border)]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Order ID
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Product
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Importer
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Exporter
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                      Created
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-right text-xs font-medium whitespace-nowrap">
                      Amount
                    </TableHead>
                    <TableHead className="bg-card h-8 px-2 py-1.5 text-right text-xs font-medium whitespace-nowrap">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((row) => {
                    const b = statusBadgeProps(row.status)
                    return (
                      <TableRow key={row.orderId} className="text-xs">
                        <TableCell
                          className="px-2 py-1.5 font-medium tabular-nums"
                          title={row.orderId}
                        >
                          {formatOrderId(row.orderId)}
                        </TableCell>
                        <TableCell
                          className="max-w-36 truncate px-2 py-1.5"
                          title={row.productName}
                        >
                          {row.productName || '—'}
                        </TableCell>
                        <TableCell
                          className="max-w-32 truncate px-2 py-1.5"
                          title={row.importerName}
                        >
                          {row.importerName || '—'}
                        </TableCell>
                        <TableCell
                          className="max-w-32 truncate px-2 py-1.5"
                          title={row.exporterName}
                        >
                          {row.exporterName || '—'}
                        </TableCell>
                        <TableCell className="px-2 py-1.5">
                          <Badge variant={b.variant} className="text-[10px]">
                            {b.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground px-2 py-1.5 tabular-nums">
                          {row.orderCreatedAt
                            ? dateTime.format(new Date(row.orderCreatedAt))
                            : '—'}
                        </TableCell>
                        <TableCell className="px-2 py-1.5 text-right tabular-nums">
                          {money.format(row.totalPrice)}
                        </TableCell>
                        <TableCell className="px-2 py-1.5 text-right">
                          <div className="flex flex-wrap justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              disabled
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              disabled
                            >
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </table>
            </div>
            {meta ? (
              <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs">
                <span>
                  Page {meta.page} of {meta.totalPage} · {meta.total} orders
                  {isFetching ? ' · updating…' : ''}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={!meta.hasPrevPage || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={!meta.hasNextPage || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}
