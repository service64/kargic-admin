import * as React from 'react'
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  ClipboardListIcon,
  DownloadIcon,
  MailIcon,
  SearchIcon,
  StoreIcon,
  XCircleIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  MOCK_SELLERS,
  PENDING_PIPELINE_TOTAL,
  type DocStage,
  type EntityType,
  type SellerRequest,
  type SellerStatus,
  type TradeRole,
} from '@/pages/seller-verification/mock-data'

const PAGE_SIZE = 10

const ENTITY_TYPES: EntityType[] = [
  'Factory',
  'Distributor',
  'Trader',
  'Warehouse',
]

function statusBadgeClass(s: SellerStatus) {
  switch (s) {
    case 'Reviewing':
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
    case 'Pending':
      return 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'Flagged':
      return 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
    default:
      return ''
  }
}

function DocStages({ stages }: { stages: [DocStage, DocStage, DocStage, DocStage] }) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((d, i) => (
        <span
          key={i}
          className="bg-background flex size-7 items-center justify-center rounded-full border shadow-sm"
        >
          {d === 'complete' && (
            <CheckCircle2Icon className="size-3.5 text-emerald-600" />
          )}
          {d === 'warning' && (
            <AlertCircleIcon className="size-3.5 text-amber-500" />
          )}
          {d === 'pending' && (
            <CircleIcon className="text-muted-foreground size-3.5" />
          )}
        </span>
      ))}
    </div>
  )
}

function DetailPanel({
  seller,
  notes,
  onNotesChange,
}: {
  seller: SellerRequest
  notes: string
  onNotesChange: (v: string) => void
}) {
  const headerBadge =
    seller.status === 'Reviewing'
      ? 'IN REVIEW'
      : seller.status.toUpperCase()

  return (
    <div className="bg-card flex flex-col gap-6 rounded-xl border p-5 shadow-sm lg:sticky lg:top-20">
      <div className="flex gap-3 border-b pb-4">
        <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-lg">
          <StoreIcon className="text-muted-foreground size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold">{seller.name}</h2>
          <p className="text-muted-foreground text-sm">{seller.displayId}</p>
          <Badge
            variant="outline"
            className={cn(
              'mt-2 text-[10px] font-bold tracking-wide',
              statusBadgeClass(seller.status)
            )}
          >
            {headerBadge}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
            Entity type
          </p>
          <p className="text-sm font-medium">{seller.entityLabel}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
            Registration date
          </p>
          <p className="text-sm">{seller.registrationDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
            Office address
          </p>
          <p className="text-sm leading-relaxed">
            {seller.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
            Verification documents
          </p>
          <Button variant="link" size="sm" className="h-auto px-0 text-xs">
            View all
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/80 space-y-1 rounded-lg border p-2">
            <div className="bg-background aspect-[4/3] rounded-md border border-dashed" />
            <p className="text-center text-[10px] font-medium">Trade license</p>
          </div>
          <div className="bg-muted/80 space-y-1 rounded-lg border p-2">
            <div className="bg-background aspect-[4/3] rounded-md border border-dashed" />
            <p className="text-center text-[10px] font-medium">Tax certificate</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-3 text-[10px] font-bold tracking-wide uppercase">
          Verification timeline
        </p>
        <ul className="relative space-y-4 border-l-2 border-emerald-200/80 pl-4 dark:border-emerald-900/50">
          {seller.timeline.map((step) => (
            <li key={step.title} className="relative">
              <span className="bg-emerald-500 ring-background absolute -left-[21px] top-1 size-2.5 rounded-full ring-4" />
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-muted-foreground text-xs">{step.at}</p>
              <p className="text-muted-foreground text-xs">{step.actor}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="review-notes"
          className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase"
        >
          Review notes
        </label>
        <Textarea
          id="review-notes"
          placeholder="Internal notes visible to admins only..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-24 resize-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
          Approve
        </Button>
        <Button
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Reject
        </Button>
        <Button variant="outline">Req info</Button>
        <Button
          variant="outline"
          className="border-amber-200 text-amber-900 hover:bg-amber-50 dark:border-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-950/30"
        >
          Flag
        </Button>
      </div>
    </div>
  )
}

export function SellerVerificationPage() {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | SellerStatus
  >('all')
  const [typeFilter, setTypeFilter] = React.useState<'all' | EntityType>('all')
  const [roleFilter, setRoleFilter] = React.useState<'all' | TradeRole>('all')
  const [pageIndex, setPageIndex] = React.useState(0)
  const [selectedId, setSelectedId] = React.useState<string | null>(
    MOCK_SELLERS[0]?.id ?? null
  )
  const [reviewNotes, setReviewNotes] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_SELLERS.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (typeFilter !== 'all' && s.entityType !== typeFilter) return false
      if (roleFilter !== 'all' && s.tradeRole !== roleFilter) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.displayId.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      )
    })
  }, [search, statusFilter, typeFilter, roleFilter])

  React.useEffect(() => {
    setPageIndex(0)
  }, [search, statusFilter, typeFilter, roleFilter])

  React.useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filtered.some((s) => s.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSlice = React.useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, pageIndex])

  const from = filtered.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1
  const to = Math.min((pageIndex + 1) * PAGE_SIZE, filtered.length)

  const selected = selectedId
    ? filtered.find((s) => s.id === selectedId) ??
      MOCK_SELLERS.find((s) => s.id === selectedId)
    : null

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Seller Verification</h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Review and manage authentication requests from merchant partners.
          </p>
        </div>
        <Button className="shrink-0 gap-2 bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
          <DownloadIcon className="size-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Total pending
            </CardTitle>
            <ClipboardListIcon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">24</p>
            <CardDescription className="text-emerald-600 dark:text-emerald-400 mt-2 text-xs font-medium">
              +12% from last week
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Approved
            </CardTitle>
            <CheckCircle2Icon className="text-emerald-600 size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">1,240</p>
            <CardDescription className="text-destructive mt-2 text-xs font-medium">
              −2% from last month
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Rejected
            </CardTitle>
            <XCircleIcon className="text-destructive size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">45</p>
            <CardDescription className="text-emerald-600 dark:text-emerald-400 mt-2 text-xs font-medium">
              +5% year over year
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
        <div className="relative min-w-0 flex-1 xl:min-w-[280px]">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search seller name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter((v ?? 'all') as 'all' | SellerStatus)
            }
          >
            <SelectTrigger className="h-11 w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(v) =>
              setTypeFilter((v ?? 'all') as 'all' | EntityType)
            }
          >
            <SelectTrigger className="h-11 w-full sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All</SelectItem>
              {ENTITY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={roleFilter}
            onValueChange={(v) =>
              setRoleFilter((v ?? 'all') as 'all' | TradeRole)
            }
          >
            <SelectTrigger className="h-11 w-full sm:w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Role: All</SelectItem>
              <SelectItem value="Importer">Importer</SelectItem>
              <SelectItem value="Exporter">Exporter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 gap-2">
            <CalendarDaysIcon className="size-4" />
            Date range
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Seller name &amp; ID
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Submission
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Docs
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right text-xs font-semibold tracking-wide uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageSlice.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground h-28 text-center text-sm"
                    >
                      No sellers match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageSlice.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.id === selectedId ? 'selected' : undefined}
                      className={cn(
                        'cursor-pointer',
                        row.id === selectedId && 'bg-muted/60'
                      )}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-semibold">{row.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {row.displayId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(row.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <DocStages stages={row.docs} />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-medium',
                            statusBadgeClass(row.status)
                          )}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-emerald-700 dark:text-emerald-400 h-auto gap-1 px-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(row.id)
                          }}
                        >
                          Review
                          <MailIcon className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{' '}
              <span className="text-foreground font-medium tabular-nums">
                {from}-{to}
              </span>{' '}
              of{' '}
              <span className="text-foreground font-medium tabular-nums">
                {filtered.length}
              </span>{' '}
              requests
              <span className="text-muted-foreground/80 hidden sm:inline">
                {' '}
                · {PENDING_PIPELINE_TOTAL} in pipeline
              </span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                className="size-8"
                disabled={pageIndex <= 0}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              >
                <ChevronLeftIcon className="size-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="size-8"
                disabled={pageIndex >= pageCount - 1}
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
              >
                <ChevronRightIcon className="size-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>

        {selected ? (
          <div className="w-full shrink-0 lg:w-[380px] xl:w-[400px]">
            <DetailPanel
              seller={selected}
              notes={reviewNotes}
              onNotesChange={setReviewNotes}
            />
          </div>
        ) : (
          <div className="text-muted-foreground flex w-full items-center justify-center rounded-xl border border-dashed p-12 text-sm lg:w-[380px]">
            Select a row to view verification details.
          </div>
        )}
      </div>
    </div>
  )
}
