import * as React from 'react'
import { Link } from 'react-router-dom'
import { MailIcon, RefreshCcwIcon, SearchIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminContactList } from '@/hooks/api/contact/useAdminContactList'

const PAGE_SIZE = 10

export function ContactsPage() {
  const [searchInput, setSearchInput] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminContactList({
      page,
      limit: PAGE_SIZE,
      ...(searchTerm ? { searchTerm } : {}),
    })

  const rows = data?.data ?? []
  const meta = data?.meta

  const applySearch = React.useCallback(() => {
    setPage(1)
    setSearchTerm(searchInput.trim())
  }, [searchInput])

  const clearSearch = React.useCallback(() => {
    setSearchInput('')
    setSearchTerm('')
    setPage(1)
  }, [])

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
          Inbox
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Contact Messages
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          View contact submissions grouped by email. Mark messages as read
          manually from the details page.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="Search by email"
                className="pl-9"
              />
            </div>
            <Button variant="secondary" onClick={applySearch}>
              Search
            </Button>
            {searchTerm ? (
              <Button variant="ghost" onClick={clearSearch}>
                Clear
              </Button>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCcwIcon
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive py-8 text-center text-sm">
            {(error as Error)?.message ?? 'Failed to load contacts'}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center text-sm">
            No contact threads found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>New Message</TableHead>
                <TableHead className="text-right">Unread Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      to={`/contacts/${row._id}`}
                      className="inline-flex items-center gap-2 font-medium hover:underline"
                    >
                      <MailIcon className="text-muted-foreground size-4" />
                      {row.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {row.hasNewMessage ? (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <Link
                      to={`/contacts/${row._id}`}
                      className="hover:underline"
                    >
                      {row.newUnreadCount}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {meta && meta.totalPage > 1 ? (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Page {meta.page} of {meta.totalPage} ({meta.total} emails)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
