import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useAdminUsers } from '@/hooks/api/user/useAdminUsers'
import type { AdminUserListRowDto, UserStatus } from '@/hooks/api/user/types'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

function initialsFor(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
  }
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

function statusBadgeClass(status: UserStatus) {
  switch (status) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'WARNING':
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
    case 'BLOCKED':
      return 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
    case 'DELETED':
      return 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300'
    default:
      return ''
  }
}

function statusLabel(status: UserStatus) {
  switch (status) {
    case 'ACTIVE':
      return 'Active'
    case 'WARNING':
      return 'Warning'
    case 'BLOCKED':
      return 'Blocked'
    case 'DELETED':
      return 'Deleted'
    default:
      return status
  }
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function UserRow({
  user,
  onOpen,
}: {
  user: AdminUserListRowDto
  onOpen: (userId: string) => void
}) {
  return (
    <TableRow
      className="hover:bg-muted/50 cursor-pointer"
      onClick={() => onOpen(user.userId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(user.userId)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-lg">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || user.email} />
            ) : null}
            <AvatarFallback className="rounded-lg text-xs font-medium">
              {initialsFor(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name || '—'}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {user.email || '—'}
      </TableCell>
      <TableCell className="text-sm tabular-nums">{user.phone || '—'}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn('font-medium', statusBadgeClass(user.status))}
        >
          {statusLabel(user.status)}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function AllUserPage() {
  const navigate = useNavigate()
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [phoneFilter, setPhoneFilter] = useState('')
  const [page, setPage] = useState(1)

  const resetPage = () => setPage(1)

  const applyFilters = () => {
    setNameFilter(nameInput.trim())
    setEmailFilter(emailInput.trim())
    setPhoneFilter(phoneInput.trim())
    resetPage()
  }

  const clearFilters = () => {
    setNameInput('')
    setEmailInput('')
    setPhoneInput('')
    setNameFilter('')
    setEmailFilter('')
    setPhoneFilter('')
    resetPage()
  }

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminUsers({
      page,
      limit: PAGE_SIZE,
      ...(nameFilter ? { name: nameFilter } : {}),
      ...(emailFilter ? { email: emailFilter } : {}),
      ...(phoneFilter ? { phone: phoneFilter } : {}),
    })

  const users = data?.data ?? []
  const meta = data?.meta
  const hasFilters = Boolean(nameFilter || emailFilter || phoneFilter)
  const openUser = (id: string) => navigate(`/user-management/users/${id}`)

  return (
    <div className="container mx-auto space-y-6 px-4 py-4">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">All users</h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Search platform users by name, email, or phone.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Name
          </label>
          <Input
            placeholder="Filter by name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Email
          </label>
          <Input
            placeholder="Filter by email..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Phone
          </label>
          <Input
            placeholder="Filter by phone..."
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <Button
            type="button"
            className="h-10 gap-2"
            onClick={applyFilters}
          >
            <SearchIcon className="size-4" />
            Search
          </Button>
          {hasFilters ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {isLoading ? (
          <UsersTableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-12 text-center text-sm">
            {error instanceof Error ? error.message : 'Failed to load users.'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Email
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Phone
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground h-32 text-center text-sm"
                  >
                    No users match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserRow key={user.userId} user={user} onOpen={openUser} />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {meta ? (
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            Page {meta.page} of {meta.totalPage} · {meta.total} users
            {isFetching ? ' · updating…' : ''}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
