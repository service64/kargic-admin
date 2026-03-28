import * as React from 'react'
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  ListFilterIcon,
  NetworkIcon,
} from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  ACTIVITY_TOTAL_EVENTS,
  type ActivityCategory,
  type ActivityLogEntry,
  type ActivityUserRole,
  ACTIVE_ADMIN_AVATARS,
  MOCK_ACTIVITY_LOGS,
} from '@/pages/user-management/activity-mock-data'

const PAGE_SIZE = 25

function categoryBadgeClass(category: ActivityCategory) {
  switch (category) {
    case 'MODIFICATION':
    case 'ACCESS LOG':
      return 'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'SECURITY ELEVATION':
      return 'border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200'
    case 'AUTOMATED TASK':
      return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
    case 'CRITICAL ALERT':
      return 'border-red-800/40 bg-red-950 text-red-50 dark:bg-red-950 dark:text-red-100'
    default:
      return ''
  }
}

function formatActivityTime(iso: string) {
  const d = new Date(iso)
  const date = d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${date} — ${time}`
}

function ActivityRow({ entry }: { entry: ActivityLogEntry }) {
  return (
    <div
      className={cn(
        'bg-background flex gap-4 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md',
        entry.critical && 'border-l-4 border-red-700 dark:border-red-600'
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          className={cn(
            'size-12 rounded-lg',
            entry.critical && 'rounded-md bg-red-100 ring-0 dark:bg-red-950/50'
          )}
        >
          <AvatarFallback
            className={cn(
              'rounded-lg text-xs font-semibold',
              entry.critical
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'bg-muted'
            )}
          >
            {entry.critical ? '!!' : entry.userInitials}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            'ring-background absolute right-0 bottom-0 size-2.5 rounded-full ring-2',
            entry.avatarStatus === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
          )}
          aria-hidden
        />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p
          className={cn(
            'text-sm leading-snug',
            entry.critical && 'text-destructive font-medium'
          )}
        >
          <span className="font-semibold text-foreground">
            {entry.userName}
          </span>
          <span className="text-muted-foreground px-1.5">•</span>
          <span className={entry.critical ? 'text-destructive' : undefined}>
            {entry.action}
          </span>
        </p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="size-3.5 shrink-0" />
            {formatActivityTime(entry.timestamp)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <NetworkIcon className="size-3.5 shrink-0" />
            IP: {entry.ip}
          </span>
        </div>
      </div>
      <div className="shrink-0 self-start">
        <Badge
          variant="outline"
          className={cn(
            'max-w-[160px] text-center text-[10px] font-bold tracking-wide whitespace-normal uppercase',
            categoryBadgeClass(entry.category)
          )}
        >
          {entry.category}
        </Badge>
      </div>
    </div>
  )
}

function matchesRoleFilter(
  role: ActivityUserRole,
  filter: 'all' | ActivityUserRole
) {
  if (filter === 'all') return true
  return role === filter
}

export function ActivityLogPage() {
  const [pageIndex, setPageIndex] = React.useState(0)
  const [roleFilter, setRoleFilter] = React.useState<
    'all' | ActivityUserRole
  >('all')

  const filteredLogs = React.useMemo(
    () =>
      MOCK_ACTIVITY_LOGS.filter((entry) =>
        matchesRoleFilter(entry.userRole, roleFilter)
      ),
    [roleFilter]
  )

  React.useEffect(() => {
    setPageIndex(0)
  }, [roleFilter])

  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const from = pageIndex * PAGE_SIZE + 1
  const to = Math.min((pageIndex + 1) * PAGE_SIZE, filteredLogs.length)

  const pageRows = React.useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [pageIndex, filteredLogs])

  const displayFrom = filteredLogs.length === 0 ? 0 : from
  const displayTo = filteredLogs.length === 0 ? 0 : to

  return (
    <div className="container mx-auto space-y-6">
      <nav
        className="text-muted-foreground flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
        aria-label="Breadcrumb"
      >
        <span className="text-emerald-700 dark:text-emerald-400">
          User management
        </span>
        <span aria-hidden className="text-muted-foreground/70">
          /
        </span>
        <span>Audit trail</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Monitor administrative actions and system modifications with full
            chronological precision.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
          <Select
            value={roleFilter}
            onValueChange={(v) =>
              setRoleFilter((v ?? 'all') as 'all' | ActivityUserRole)
            }
          >
            <SelectTrigger className="h-10 min-w-[200px] sm:min-w-[220px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="importer">Importer</SelectItem>
              <SelectItem value="exporter">Exporter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="default" className="gap-2">
            <ListFilterIcon className="size-4" />
            Refine Feed
          </Button>
          <Button
            size="default"
            className="gap-2 bg-emerald-900 text-white hover:bg-emerald-950 dark:bg-emerald-800 dark:hover:bg-emerald-900"
          >
            <DownloadIcon className="size-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Total events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">12,482</p>
            <CardDescription className="text-emerald-700 dark:text-emerald-400 mt-2 text-xs font-medium">
              +12% vs last month
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Security flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">4</p>
            <CardDescription className="text-destructive mt-2 flex items-center gap-1.5 text-xs font-medium">
              <AlertTriangleIcon className="size-3.5 shrink-0" />
              Requires immediate review
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Active admins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold tabular-nums">18</p>
            <AvatarGroup className="justify-start">
              {ACTIVE_ADMIN_AVATARS.slice(0, 4).map((initials) => (
                <Avatar key={initials} className="size-9 ring-2 ring-background">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount className="size-9 text-xs">
                +14
              </AvatarGroupCount>
            </AvatarGroup>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Uptime status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">99.98%</p>
            <CardDescription className="text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1.5 text-xs font-medium">
              <CheckCircle2Icon className="size-3.5 shrink-0" />
              Systems operational
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 space-y-4 rounded-2xl border p-4 md:p-6 dark:bg-muted/30">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <ActivityIcon className="size-4" />
          Recent activity
        </div>
        <div className="flex flex-col gap-3">
          {pageRows.length === 0 ? (
            <div className="bg-background text-muted-foreground rounded-xl border border-dashed px-6 py-14 text-center text-sm">
              No activity for this role. Choose{' '}
              <strong className="text-foreground">All roles</strong>,{' '}
              <strong className="text-foreground">Importer</strong>, or{' '}
              <strong className="text-foreground">Exporter</strong>.
            </div>
          ) : (
            pageRows.map((entry) => (
              <ActivityRow key={entry.id} entry={entry} />
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground space-y-0.5 text-sm">
            <p>
              Showing{' '}
              <span className="text-foreground font-medium tabular-nums">
                {displayFrom}-{displayTo}
              </span>{' '}
              of{' '}
              <span className="text-foreground font-medium tabular-nums">
                {filteredLogs.length.toLocaleString()}
              </span>{' '}
              events
              {roleFilter !== 'all' && (
                <span className="text-muted-foreground/80">
                  {' '}
                  ({roleFilter === 'importer' ? 'Importer' : 'Exporter'})
                </span>
              )}
            </p>
            <p className="text-muted-foreground/80 text-xs">
              Repository total{' '}
              {ACTIVITY_TOTAL_EVENTS.toLocaleString()} events
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            >
              <ArrowLeftIcon className="size-4" />
              <span className="sr-only">Previous</span>
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={num === pageIndex + 1 ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'min-w-9',
                  num === pageIndex + 1 &&
                    'bg-emerald-900 text-white hover:bg-emerald-950 dark:bg-emerald-800 dark:hover:bg-emerald-900'
                )}
                onClick={() => setPageIndex(num - 1)}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              className="size-8"
              disabled={pageIndex >= pageCount - 1}
              onClick={() =>
                setPageIndex((p) => Math.min(pageCount - 1, p + 1))
              }
            >
              <ArrowRightIcon className="size-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
