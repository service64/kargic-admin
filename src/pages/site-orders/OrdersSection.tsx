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
import type { OrderStatus, SiteOrder } from '@/pages/site-orders/mock-data'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
})

type StatusFilter = 'all' | OrderStatus

function statusBadgeProps(status: OrderStatus) {
  switch (status) {
    case 'running':
      return { variant: 'default' as const, label: 'Running' }
    case 'completed':
      return { variant: 'secondary' as const, label: 'Completed' }
    case 'delayed':
      return { variant: 'destructive' as const, label: 'Delayed' }
  }
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

type OrdersSectionProps = {
  loading: boolean
  orders: SiteOrder[]
  statusFilter: StatusFilter
  onStatusFilter: (v: StatusFilter) => void
  dateFilter: string
  onDateFilter: (v: string) => void
}

export function OrdersSection({
  loading,
  orders,
  statusFilter,
  onStatusFilter,
  dateFilter,
  onDateFilter,
}: OrdersSectionProps) {
  return (
    <Card size="sm" className="gap-3">
      <CardHeader className="border-b px-4 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Running and recent orders · filter by status or date
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                onStatusFilter((v ?? 'all') as StatusFilter)
              }
            >
              <SelectTrigger size="sm" className="min-w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="h-7 w-44 text-xs md:w-40"
              value={dateFilter}
              onChange={(e) => onDateFilter(e.target.value)}
            />
            {dateFilter ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onDateFilter('')}
              >
                Clear date
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        {loading ? (
          <OrdersTableSkeleton />
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            No orders match the current filters.
          </p>
        ) : (
          <div className="max-h-[min(28rem,55vh)] overflow-auto rounded-b-xl">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_0_var(--border)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                    Order ID
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
                    Date / Time
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
                    <TableRow key={row.id} className="text-xs">
                      <TableCell className="px-2 py-1.5 font-medium tabular-nums">
                        {row.id}
                      </TableCell>
                      <TableCell
                        className="max-w-40 truncate px-2 py-1.5"
                        title={row.importerName}
                      >
                        {row.importerName}
                      </TableCell>
                      <TableCell
                        className="max-w-40 truncate px-2 py-1.5"
                        title={row.exporterName}
                      >
                        {row.exporterName}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">
                        <Badge variant={b.variant} className="text-[10px]">
                          {b.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-2 py-1.5 tabular-nums">
                        {dateTime.format(new Date(row.updatedAt))}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-right tabular-nums">
                        {money.format(row.amountCents / 100)}
                      </TableCell>
                      <TableCell className="px-2 py-1.5 text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
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
        )}
      </CardContent>
    </Card>
  )
}

export type { StatusFilter }
