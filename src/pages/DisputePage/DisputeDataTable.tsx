import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import { MoreVerticalIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  type DisputePriority,
  type DisputeRow,
  type DisputeStatus,
  DISPUTE_MOCK_ROWS,
  DISPUTE_TOTAL_COUNT,
} from '@/pages/DisputePage/dispute-data'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function statusBadgeClass(status: DisputeStatus) {
  switch (status) {
    case 'IN REVIEW':
      return 'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-200'
    case 'RESOLVED':
      return 'border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-200'
    case 'OPEN':
      return 'border-sky-200 bg-sky-100 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/50 dark:text-sky-200'
    case 'DENIED':
      return 'border-red-200 bg-red-100 text-red-900 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200'
    default:
      return ''
  }
}

function priorityDotClass(priority: DisputePriority) {
  switch (priority) {
    case 'Critical':
      return 'bg-red-500'
    case 'High':
      return 'bg-orange-500'
    case 'Medium':
      return 'bg-emerald-500'
    case 'Low':
      return 'bg-slate-400'
    default:
      return 'bg-slate-400'
  }
}

function matchesDateRange(openedAt: string, range: string) {
  if (range === 'all') return true
  const days = range === '30' ? 30 : 90
  const start = new Date()
  start.setDate(start.getDate() - days)
  return new Date(openedAt) >= start
}

const columns: ColumnDef<DisputeRow>[] = [
  {
    accessorKey: 'id',
    header: 'DISPUTE ID',
    cell: ({ row }) => (
      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
        #{row.original.id}
      </span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'CUSTOMER',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar size="sm" className="size-9">
          <AvatarFallback className="bg-muted text-xs font-medium">
            {row.original.customerInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">
            {row.original.customerName}
          </p>
          <p className="text-muted-foreground text-xs">
            ID: {row.original.customerId}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'REASON',
    cell: ({ row }) => (
      <span className="text-foreground/90 max-w-[220px] truncate">
        {row.original.reason}
      </span>
    ),
  },
  {
    accessorKey: 'amountCents',
    header: 'AMOUNT',
    cell: ({ row }) => money.format(row.original.amountCents / 100),
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          'rounded-md border font-semibold uppercase',
          statusBadgeClass(row.original.status)
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'PRIORITY',
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <span
          className={cn(
            'size-2 shrink-0 rounded-full',
            priorityDotClass(row.original.priority)
          )}
          aria-hidden
        />
        {row.original.priority}
      </span>
    ),
  },
  {
    accessorKey: 'assigneeName',
    header: 'ASSIGNED TO',
    cell: ({ row }) => {
      const name = row.original.assigneeName
      if (!name) {
        return (
          <span className="text-muted-foreground text-sm italic">
            Unassigned
          </span>
        )
      }
      return (
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-7">
            <AvatarFallback className="text-[10px]">
              {row.original.assigneeInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{name}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" className="size-8" />}
        >
          <MoreVerticalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Assign</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Escalate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    accessorKey: 'openedAt',
    id: 'openedAt',
    header: 'Opened',
    sortingFn: (rowA, rowB) =>
      new Date(rowA.original.openedAt).getTime() -
      new Date(rowB.original.openedAt).getTime(),
    enableHiding: true,
  },
]

export type DisputeTableToolbarProps = {
  status: string
  onStatusChange: (v: string) => void
  priority: string
  onPriorityChange: (v: string) => void
  dateRange: string
  onDateRangeChange: (v: string) => void
  sortOrder: string
  onSortOrderChange: (v: string) => void
}

export function DisputeDataTable({
  toolbar,
}: {
  toolbar: DisputeTableToolbarProps
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'openedAt', desc: true },
  ])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const filtered = React.useMemo(() => {
    return DISPUTE_MOCK_ROWS.filter((row) => {
      if (
        toolbar.status !== 'all' &&
        row.status !== (toolbar.status as DisputeStatus)
      ) {
        return false
      }
      if (
        toolbar.priority !== 'all' &&
        row.priority !== (toolbar.priority as DisputePriority)
      ) {
        return false
      }
      if (!matchesDateRange(row.openedAt, toolbar.dateRange)) {
        return false
      }
      return true
    })
  }, [toolbar.status, toolbar.priority, toolbar.dateRange])

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [toolbar.status, toolbar.priority, toolbar.dateRange])

  React.useEffect(() => {
    const desc = toolbar.sortOrder === 'newest'
    setSorting([{ id: 'openedAt', desc }])
  }, [toolbar.sortOrder])

  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility: { openedAt: false },
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const pageCount = table.getPageCount()
  const currentPage = pagination.pageIndex + 1
  const from =
    filtered.length === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const to = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filtered.length
  )

  return (
    <div className="space-y-4">
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
          <span>Filters:</span>
          <Select
            value={toolbar.status}
            onValueChange={(v) => toolbar.onStatusChange(v ?? 'all')}
          >
            <SelectTrigger size="sm" className="min-w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN REVIEW">In review</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="DENIED">Denied</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={toolbar.priority}
            onValueChange={(v) => toolbar.onPriorityChange(v ?? 'all')}
          >
            <SelectTrigger size="sm" className="min-w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={toolbar.dateRange}
            onValueChange={(v) => toolbar.onDateRangeChange(v ?? '30')}
          >
            <SelectTrigger size="sm" className="min-w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Date range: Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-semibold tracking-wide">
            SORT BY
          </span>
          <Select
            value={toolbar.sortOrder}
            onValueChange={(v) => toolbar.onSortOrderChange(v ?? 'newest')}
          >
            <SelectTrigger size="sm" className="min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground bg-muted/30 text-xs font-semibold tracking-wide uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No disputes match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Showing{' '}
            <span className="text-foreground font-medium">
              {from}-{to}
            </span>{' '}
            of{' '}
            <span className="text-foreground font-medium">
              {DISPUTE_TOTAL_COUNT.toLocaleString()}
            </span>{' '}
            results
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    className={
                      pageNum === currentPage
                        ? 'bg-emerald-800 text-white hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-800'
                        : ''
                    }
                    onClick={() => table.setPageIndex(pageNum - 1)}
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
