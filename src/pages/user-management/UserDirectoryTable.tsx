import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
  ShieldEllipsisIcon,
  UserRoundXIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  type DirectoryUser,
  type DirectoryUserStatus,
} from '@/pages/user-management/user-directory-mock-data'

function formatRelativeLastActive(iso: string | null) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'Just now'
  const mins = Math.floor(sec / 60)
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function statusDotClass(s: DirectoryUserStatus) {
  switch (s) {
    case 'Active':
      return 'bg-emerald-500'
    case 'Pending':
      return 'bg-red-500'
    case 'Inactive':
      return 'bg-slate-400 dark:bg-slate-500'
    default:
      return 'bg-slate-400'
  }
}

const columns: ColumnDef<DirectoryUser>[] = [
  {
    accessorKey: 'name',
    header: 'Name & identity',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-10 rounded-lg">
          <AvatarFallback className="rounded-lg text-xs font-medium">
            {row.original.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{row.original.name}</p>
          <p className="text-muted-foreground truncate text-sm">
            {row.original.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'jobTitle',
    header: 'Role',
    cell: ({ row }) => (
      <span className="font-medium text-emerald-700 dark:text-emerald-400">
        {row.original.jobTitle}
      </span>
    ),
  },
  {
    accessorKey: 'team',
    header: 'Team',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.team}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 text-sm">
        <span
          className={cn(
            'size-2 shrink-0 rounded-full',
            statusDotClass(row.original.status)
          )}
          aria-hidden
        />
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'lastActiveAt',
    header: 'Last active',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatRelativeLastActive(row.original.lastActiveAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <div className="flex items-center justify-end gap-0.5">
        <Button variant="ghost" size="icon-sm" className="size-8" title="Edit">
          <PencilIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8"
          title="Permissions"
        >
          <ShieldEllipsisIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive size-8"
          title="Remove access"
        >
          <UserRoundXIcon className="size-4" />
        </Button>
      </div>
    ),
  },
]

export function UserDirectoryTable({ data }: { data: DirectoryUser[] }) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [data])

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const pageCount = table.getPageCount()
  const filteredTotal = data.length
  const from =
    filteredTotal === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const to = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filteredTotal
  )

  return (
    <div className="space-y-4">
      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="bg-muted/50 hover:bg-muted/50"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
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
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  No team members match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Showing{' '}
          <span className="text-foreground font-medium tabular-nums">
            {from}-{to}
          </span>{' '}
          of{' '}
          <span className="text-foreground font-medium tabular-nums">
            {filteredTotal}
          </span>{' '}
          team members
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ArrowLeftIcon className="mr-1 size-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={num === pagination.pageIndex + 1 ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'min-w-9',
                  num === pagination.pageIndex + 1 &&
                    'bg-emerald-900 text-white hover:bg-emerald-950 dark:bg-emerald-800 dark:hover:bg-emerald-900'
                )}
                onClick={() => table.setPageIndex(num - 1)}
              >
                {num}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
            <ArrowRightIcon className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
