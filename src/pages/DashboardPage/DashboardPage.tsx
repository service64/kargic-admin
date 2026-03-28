import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  ScrollTextIcon,
  UsersRoundIcon,
  WalletIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  MOCK_DASHBOARD_SUMMARY,
  MOCK_RECENT_ACTIVITY,
  MOCK_RECENT_TRANSACTIONS,
  MOCK_SYSTEM_ACTIVITY_SERIES,
} from '@/pages/DashboardPage/overview-mock-data'
import { SystemActivityOverviewChart } from '@/pages/DashboardPage/SystemActivityOverviewChart'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pt-3 pb-1">
        <CardTitle className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {label}
        </CardTitle>
        <Icon className="text-muted-foreground size-3.5 shrink-0" />
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <p className="text-lg font-semibold tabular-nums">{value}</p>
        {hint ? (
          <p className="text-muted-foreground mt-0.5 text-[11px] leading-tight">
            {hint}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function txStatusClass(s: string) {
  switch (s) {
    case 'Settled':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200'
    case 'Pending':
      return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200'
    case 'Failed':
      return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200'
    default:
      return ''
  }
}

export function DashboardPage() {
  const s = MOCK_DASHBOARD_SUMMARY

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Operations overview
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Cross-module status for users, billing, disputes, and compliance. All
            figures below are mock data until APIs are connected.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total users"
            value={s.totalUsers.toLocaleString()}
            hint="Directory"
            icon={UsersRoundIcon}
          />
          <StatCard
            label="Active subs"
            value={s.activeSubscriptions.toLocaleString()}
            hint="Billing"
            icon={CreditCardIcon}
          />
          <StatCard
            label="Open disputes"
            value={s.openDisputes.toLocaleString()}
            hint="Needs attention"
            icon={AlertTriangleIcon}
          />
          <StatCard
            label="Seller queue"
            value={s.pendingSellerVerifications.toLocaleString()}
            hint="Verification"
            icon={BadgeCheckIcon}
          />
          <StatCard
            label="Audits (24h)"
            value={s.auditEvents24h.toLocaleString()}
            hint="Activity log"
            icon={ScrollTextIcon}
          />
          <StatCard
            label="Revenue (MTD)"
            value={money.format(s.monthlyRevenueCents / 100)}
            hint="Recognized"
            icon={WalletIcon}
          />
        </div>

        <SystemActivityOverviewChart data={MOCK_SYSTEM_ACTIVITY_SERIES} />

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader className="border-b px-3 py-2">
              <CardTitle className="text-sm font-medium">
                Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Time
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Actor
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Action
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Target
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RECENT_ACTIVITY.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {row.time}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-sm">
                        {row.actor}
                      </TableCell>
                      <TableCell className="text-sm">{row.action}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <Link
                          to="/user-management/activity"
                          className="text-primary hover:underline"
                        >
                          {row.target}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="border-b px-3 py-2">
              <CardTitle className="text-sm font-medium">
                Recent transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Time
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Reference
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-right text-[10px] font-semibold uppercase">
                      Amount
                    </TableHead>
                    <TableHead className="text-muted-foreground h-8 text-[10px] font-semibold uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_RECENT_TRANSACTIONS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {row.time}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.reference}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-sm">
                        {row.type}
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {money.format(row.amountCents / 100)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-medium',
                            txStatusClass(row.status)
                          )}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground text-center text-[11px]">
          <Link to="/dispute" className="text-primary hover:underline">
            Disputes
          </Link>
          {' · '}
          <Link to="/subscription" className="text-primary hover:underline">
            Subscriptions
          </Link>
          {' · '}
          <Link
            to="/user-management/users"
            className="text-primary hover:underline"
          >
            Users
          </Link>
          {' · '}
          <Link
            to="/seller-verification"
            className="text-primary hover:underline"
          >
            Seller verification
          </Link>
        </p>
      </div>
    </div>
  )
}
