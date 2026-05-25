import { EyeIcon, RefreshCcwIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  AdminReportSummaryMetaDto,
  AdminReportSummaryRowDto,
} from "@/hooks/api/report/types"

function initialsFor(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

function formatDateTime(value?: string) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

function TableSkeleton() {
  return (
    <div className="space-y-2 py-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export type DisputeTableToolbarProps = {
  searchInput: string
  onSearchInputChange: (value: string) => void
  onApplySearch: () => void
  onClearSearch: () => void
  hasFilters: boolean
  dateRange: "30" | "90" | "all"
  onDateRangeChange: (value: "30" | "90" | "all") => void
  sortOrder: "newest" | "oldest"
  onSortOrderChange: (value: "newest" | "oldest") => void
  isFetching: boolean
  onRefresh: () => void
}

type DisputeDataTableProps = {
  toolbar: DisputeTableToolbarProps
  rows: AdminReportSummaryRowDto[]
  meta?: AdminReportSummaryMetaDto
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onPageChange: (page: number) => void
  onOpenDetails: (userId: string) => void
}

function ReportRow({
  row,
  onOpenDetails,
}: {
  row: AdminReportSummaryRowDto
  onOpenDetails: (userId: string) => void
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-lg">
            <AvatarFallback className="rounded-lg text-xs font-medium">
              {initialsFor(row.name, row.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name || "—"}</p>
            <p className="text-muted-foreground truncate text-xs">{row.email || "—"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">{row.companyName || "—"}</TableCell>
      <TableCell className="text-sm tabular-nums">{row.totalReports}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDateTime(row.lastReportedAt)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8"
          title="View report details"
          onClick={() => onOpenDetails(row.userId)}
        >
          <EyeIcon className="size-4" />
          <span className="sr-only">View report details</span>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function DisputeDataTable({
  toolbar,
  rows,
  meta,
  isLoading,
  isError,
  errorMessage,
  onPageChange,
  onOpenDetails,
}: DisputeDataTableProps) {
  const from =
    !meta || meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1
  const to = !meta ? 0 : Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="space-y-4">
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_180px_160px]">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Search by user id, email, name, or company
            </label>
            <div className="relative">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={toolbar.searchInput}
                onChange={(e) => toolbar.onSearchInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && toolbar.onApplySearch()}
                placeholder="Search users..."
                className="h-10 pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Date range
            </label>
            <Select
              value={toolbar.dateRange}
              onValueChange={(v) =>
                toolbar.onDateRangeChange((v as "30" | "90" | "all") ?? "30")
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Sort by date
            </label>
            <Select
              value={toolbar.sortOrder}
              onValueChange={(v) =>
                toolbar.onSortOrderChange((v as "newest" | "oldest") ?? "newest")
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-10 gap-2" onClick={toolbar.onApplySearch}>
            <SearchIcon className="size-4" />
            Search
          </Button>
          {toolbar.hasFilters ? (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={toolbar.onClearSearch}
            >
              Clear
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2"
            onClick={toolbar.onRefresh}
            disabled={toolbar.isFetching}
          >
            <RefreshCcwIcon className={toolbar.isFetching ? "size-4 animate-spin" : "size-4"} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <p className="text-destructive px-4 py-12 text-center text-sm">
            {errorMessage || "Failed to load reported users."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  User
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Company
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Total reports
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-semibold uppercase">
                  Last reported
                </TableHead>
                <TableHead className="text-muted-foreground w-14 text-xs font-semibold uppercase">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-32 text-center text-sm"
                  >
                    No reported users match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <ReportRow
                    key={row.userId}
                    row={row}
                    onOpenDetails={onOpenDetails}
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
            Showing {from}-{to} of {meta.total} reported users
            {toolbar.isFetching ? " · updating..." : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage || toolbar.isFetching}
              onClick={() => onPageChange(meta.page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {meta.page} of {meta.totalPage}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage || toolbar.isFetching}
              onClick={() => onPageChange(meta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
