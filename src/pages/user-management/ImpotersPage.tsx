import { useState } from 'react'
import { EyeIcon, SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

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
import { useAdminImporters } from '@/hooks/api/importer/useAdminImporters'
const PAGE_SIZE = 20

function ImportersTableSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function ImpotersPage() {
  const [companyNameInput, setCompanyNameInput] = useState('')
  const [importLicenseInput, setImportLicenseInput] = useState('')
  const [businessTypeInput, setBusinessTypeInput] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [companyNameFilter, setCompanyNameFilter] = useState('')
  const [importLicenseFilter, setImportLicenseFilter] = useState('')
  const [businessTypeFilter, setBusinessTypeFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [page, setPage] = useState(1)

  const resetPage = () => setPage(1)

  const applyFilters = () => {
    setCompanyNameFilter(companyNameInput.trim())
    setImportLicenseFilter(importLicenseInput.trim())
    setBusinessTypeFilter(businessTypeInput.trim())
    setCountryFilter(countryInput.trim())
    resetPage()
  }

  const clearFilters = () => {
    setCompanyNameInput('')
    setImportLicenseInput('')
    setBusinessTypeInput('')
    setCountryInput('')
    setCompanyNameFilter('')
    setImportLicenseFilter('')
    setBusinessTypeFilter('')
    setCountryFilter('')
    resetPage()
  }

  const hasFilters = Boolean(
    companyNameFilter ||
      importLicenseFilter ||
      businessTypeFilter ||
      countryFilter,
  )

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminImporters({
      page,
      limit: PAGE_SIZE,
      ...(companyNameFilter ? { companyName: companyNameFilter } : {}),
      ...(importLicenseFilter ? { importLicense: importLicenseFilter } : {}),
      ...(businessTypeFilter ? { businessType: businessTypeFilter } : {}),
      ...(countryFilter ? { country: countryFilter } : {}),
    })

  const importers = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container mx-auto space-y-6 px-4 py-4">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Importers</h1>
        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
          Registered importer companies — filter by company name, license,
          business type, or country.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Company name
          </label>
          <Input
            placeholder="Filter company..."
            value={companyNameInput}
            onChange={(e) => setCompanyNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Import license
          </label>
          <Input
            placeholder="Filter license..."
            value={importLicenseInput}
            onChange={(e) => setImportLicenseInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Business type
          </label>
          <Input
            placeholder="Filter type..."
            value={businessTypeInput}
            onChange={(e) => setBusinessTypeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Country
          </label>
          <Input
            placeholder="Filter country..."
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="h-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" className="h-10 gap-2" onClick={applyFilters}>
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

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {isLoading ? (
          <ImportersTableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-12 text-center text-sm">
            {error instanceof Error
              ? error.message
              : 'Failed to load importers.'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Company
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Import license
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Business type
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Country
                </TableHead>
                <TableHead className="text-muted-foreground w-14 text-xs font-semibold uppercase">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-32 text-center text-sm"
                  >
                    No importers match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                importers.map((row, index) => (
                  <TableRow
                    key={row.userId || `importer-${index}`}
                  >
                    <TableCell className="font-medium">
                      {row.companyName || '—'}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {row.importLicense || '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.businessType || '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.country || '—'}
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
                            aria-label={`View details for ${row.companyName}`}
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
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            Page {meta.page} of {meta.totalPage} · {meta.total} importers
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
