import { useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useAdminExporters } from '@/hooks/api/exporter/useAdminExporters'
import type { AdminExporterListRowDto } from '@/hooks/api/exporter/types'

const PAGE_SIZE = 20

function ExportersTableSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function ExporterRow({ row }: { row: AdminExporterListRowDto }) {
  const initials = row.companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-lg">
            {row.logo ? (
              <AvatarImage src={row.logo} alt={row.companyName} />
            ) : null}
            <AvatarFallback className="rounded-lg text-xs font-medium">
              {initials || 'EX'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.companyName || '—'}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm tabular-nums">
        {row.verifyCompanyPercent}%
      </TableCell>
    </TableRow>
  )
}

export function UserDirectoryPage() {
  const [companyNameInput, setCompanyNameInput] = useState('')
  const [companyNameFilter, setCompanyNameFilter] = useState('')
  const [page, setPage] = useState(1)

  const resetPage = () => setPage(1)

  const applyFilters = () => {
    setCompanyNameFilter(companyNameInput.trim())
    resetPage()
  }

  const clearFilters = () => {
    setCompanyNameInput('')
    setCompanyNameFilter('')
    resetPage()
  }

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminExporters({
      page,
      limit: PAGE_SIZE,
      ...(companyNameFilter ? { companyName: companyNameFilter } : {}),
    })

  const exporters = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container mx-auto space-y-6 px-4 py-4">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Exporters</h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Registered exporter companies — filter by company name.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1 space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Company name
          </label>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Filter by company name..."
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="bg-background h-11 pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11 gap-2" onClick={applyFilters}>
            <SearchIcon className="size-4" />
            Search
          </Button>
          {companyNameFilter ? (
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {isLoading ? (
          <ExportersTableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-12 text-center text-sm">
            {error instanceof Error
              ? error.message
              : 'Failed to load exporters.'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Company
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Verification
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exporters.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground h-32 text-center text-sm"
                  >
                    No exporters match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                exporters.map((row) => (
                  <ExporterRow
                    key={row.userId || row.companyName}
                    row={row}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {meta ? (
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            Page {meta.page} of {meta.totalPage} · {meta.total} exporters
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
