import { useLocation } from 'react-router-dom'
import { AlarmClockIcon, CircleXIcon } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/dispute': 'Dispute Management',
  '/subscription': 'Subscription Management',
  '/site-orders': 'Site Orders & Partners',
  '/user-management/activity': 'Activity Log',
  '/user-management/users': 'User Directory',
  '/seller-verification': 'Seller Verification',
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Demo balances — swap for API / store when wired */
const HEADER_MONEY = {
  hold: 128_400,
  delivery: 54_200,
  /** Open / in-progress orders (notional exposure) */
  runningOrders: 215_600,
  returns: 3_850,
  /** Open disputes & complaint exposure */
  runningComplaints: 18_400,
  /** Value closed as solved / settled */
  complaintsSolved: 96_200,
  totalProfit: 482_900,
} as const

/** Inbox / notifications awaiting action — swap for API / store when wired */
const HEADER_PENDING_MESSAGE_COUNT = 12

/** Payments / transfers that failed — swap for API / store when wired */
const HEADER_FAILED_TRANSACTION_COUNT = 3

type MoneyMetricKey = keyof typeof HEADER_MONEY

/**
 * Semantic tones for header money: accent border + value color.
 * Keeps light/dark pairs explicit for readable contrast.
 */
const MONEY_METRIC_TONES = {
  /** Escrow / pending settlement */
  hold: {
    border: 'border-l-amber-500 dark:border-l-amber-400',
    surface:
      'bg-amber-500/[0.07] dark:bg-amber-400/[0.10] hover:bg-amber-500/[0.10] dark:hover:bg-amber-400/[0.14]',
    value: 'text-amber-950 dark:text-amber-100',
  },
  /** In-flight payouts / delivery */
  flow: {
    border: 'border-l-sky-600 dark:border-l-sky-400',
    surface:
      'bg-sky-500/[0.07] dark:bg-sky-400/[0.10] hover:bg-sky-500/[0.10] dark:hover:bg-sky-400/[0.14]',
    value: 'text-sky-950 dark:text-sky-100',
  },
  /** Active pipeline (e.g. running order notional) */
  pipeline: {
    border: 'border-l-violet-600 dark:border-l-violet-400',
    surface:
      'bg-violet-500/[0.07] dark:bg-violet-400/[0.10] hover:bg-violet-500/[0.10] dark:hover:bg-violet-400/[0.14]',
    value: 'text-violet-950 dark:text-violet-100',
  },
  /** Refunds & chargebacks — uses theme destructive */
  risk: {
    border: 'border-l-destructive',
    surface:
      'bg-destructive/[0.08] hover:bg-destructive/[0.11] dark:bg-destructive/[0.12] dark:hover:bg-destructive/[0.16]',
    value: 'text-destructive',
  },
  /** Resolved complaints / closed disputes */
  settled: {
    border: 'border-l-teal-600 dark:border-l-teal-400',
    surface:
      'bg-teal-500/[0.07] dark:bg-teal-400/[0.10] hover:bg-teal-500/[0.10] dark:hover:bg-teal-400/[0.14]',
    value: 'text-teal-950 dark:text-teal-100',
  },
  /** Net positive P&L */
  gain: {
    border: 'border-l-emerald-600 dark:border-l-emerald-400',
    surface:
      'bg-emerald-500/[0.07] dark:bg-emerald-400/[0.10] hover:bg-emerald-500/[0.10] dark:hover:bg-emerald-400/[0.14]',
    value: 'text-emerald-950 dark:text-emerald-100',
  },
  /** Pending messages / alerts */
  notify: {
    border: 'border-l-orange-500 dark:border-l-orange-400',
    surface:
      'bg-orange-500/[0.08] dark:bg-orange-400/[0.11] hover:bg-orange-500/[0.12] dark:hover:bg-orange-400/[0.15]',
    value: 'text-orange-950 dark:text-orange-100',
  },
} as const

type MoneyMetricTone = keyof typeof MONEY_METRIC_TONES

const moneyMetrics: {
  key: MoneyMetricKey
  label: string
  tone: MoneyMetricTone
}[] = [
  { key: 'hold', label: 'Hold', tone: 'hold' },
  { key: 'delivery', label: 'Delivery', tone: 'flow' },
  { key: 'runningOrders', label: 'Running orders', tone: 'pipeline' },
  { key: 'returns', label: 'Returns', tone: 'risk' },
  { key: 'runningComplaints', label: 'Complaints open', tone: 'risk' },
  { key: 'complaintsSolved', label: 'Complaints solved', tone: 'settled' },
  { key: 'totalProfit', label: 'Total profit', tone: 'gain' },
]

export function SiteHeader() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Dashboard'
  const pendingTone = MONEY_METRIC_TONES.notify
  const failedTxTone = MONEY_METRIC_TONES.risk

  return (
    <header className="flex   shrink-0 items-center gap-2 border-b h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 shrink-0 data-vertical:self-auto"
        />
        <h1 className="min-w-0 truncate text-base font-medium">{title}</h1>
        <div
          className="ml-auto flex min-w-0 flex-wrap items-stretch justify-end gap-2"
          aria-label="Settlement summary, notifications, and failed transactions"
        >
          <div
            className={cn(
              'flex min-w-0 items-center gap-2 rounded-md border border-border/80 py-1.5 pr-2.5 pl-2 transition-colors sm:pr-3 sm:pl-2.5',
              'border-l-[3px]',
              pendingTone.border,
              pendingTone.surface
            )}
            role="status"
            aria-live="polite"
            aria-label={`${HEADER_PENDING_MESSAGE_COUNT} pending messages`}
          >
            <AlarmClockIcon
              className="text-orange-600 dark:text-orange-300 size-3.5 shrink-0 sm:size-4"
              aria-hidden
            />
            <div className="flex min-w-0 flex-col items-end text-right leading-tight">
              <span className="text-muted-foreground max-w-[9rem] truncate text-[10px] font-medium tracking-wide uppercase sm:max-w-none">
                Pending messages
              </span>
              <span
                className={cn(
                  'text-xs font-semibold tabular-nums lg:text-sm',
                  pendingTone.value
                )}
              >
                {HEADER_PENDING_MESSAGE_COUNT.toLocaleString('en-US')}
              </span>
            </div>
          </div>
          <div
            className={cn(
              'flex min-w-0 items-center gap-2 rounded-md border border-border/80 py-1.5 pr-2.5 pl-2 transition-colors sm:pr-3 sm:pl-2.5',
              'border-l-[3px]',
              failedTxTone.border,
              failedTxTone.surface
            )}
            role="status"
            aria-live="polite"
            aria-label={`${HEADER_FAILED_TRANSACTION_COUNT} failed transactions`}
          >
            <CircleXIcon
              className="size-3.5 shrink-0 text-destructive sm:size-4"
              aria-hidden
            />
            <div className="flex min-w-0 flex-col items-end text-right leading-tight">
              <span className="text-muted-foreground max-w-[9rem] truncate text-[10px] font-medium tracking-wide uppercase sm:max-w-none">
                Failed transactions
              </span>
              <span
                className={cn(
                  'text-xs font-semibold tabular-nums lg:text-sm',
                  failedTxTone.value
                )}
              >
                {HEADER_FAILED_TRANSACTION_COUNT.toLocaleString('en-US')}
              </span>
            </div>
          </div>
          {moneyMetrics.map(({ key, label, tone }) => {
            const t = MONEY_METRIC_TONES[tone]
            return (
              <div
                key={key}
                className={cn(
                  'flex min-w-[4.5rem] flex-col items-end justify-center rounded-md border border-border/80 py-1.5 pr-2.5 pl-2 text-right transition-colors sm:min-w-[5rem] sm:pr-3 sm:pl-2.5',
                  'border-l-[3px]',
                  t.border,
                  t.surface
                )}
              >
                <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  {label}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold tabular-nums lg:text-sm',
                    t.value
                  )}
                >
                  {money.format(HEADER_MONEY[key])}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </header>
  )
}
