/**
 * Dashboard / overview mock aggregates.
 * Replace fetch loaders here when wiring to APIs.
 */

export type DashboardSummary = {
  totalUsers: number
  activeSubscriptions: number
  openDisputes: number
  pendingSellerVerifications: number
  auditEvents24h: number
  monthlyRevenueCents: number
}

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalUsers: 186,
  activeSubscriptions: 42,
  openDisputes: 23,
  pendingSellerVerifications: 24,
  auditEvents24h: 312,
  monthlyRevenueCents: 284_500_00,
}

/** Daily buckets for the system activity chart (last 14 days). */
export type SystemActivityPoint = {
  date: string
  /** Dispute state changes, assignments, resolutions */
  disputes: number
  /** Subscription lifecycle events */
  subscriptions: number
}

export const MOCK_SYSTEM_ACTIVITY_SERIES: SystemActivityPoint[] = [
  { date: '2026-03-14', disputes: 12, subscriptions: 8 },
  { date: '2026-03-15', disputes: 18, subscriptions: 6 },
  { date: '2026-03-16', disputes: 14, subscriptions: 11 },
  { date: '2026-03-17', disputes: 22, subscriptions: 9 },
  { date: '2026-03-18', disputes: 16, subscriptions: 14 },
  { date: '2026-03-19', disputes: 25, subscriptions: 7 },
  { date: '2026-03-20', disputes: 19, subscriptions: 10 },
  { date: '2026-03-21', disputes: 11, subscriptions: 5 },
  { date: '2026-03-22', disputes: 9, subscriptions: 6 },
  { date: '2026-03-23', disputes: 21, subscriptions: 12 },
  { date: '2026-03-24', disputes: 17, subscriptions: 15 },
  { date: '2026-03-25', disputes: 24, subscriptions: 11 },
  { date: '2026-03-26', disputes: 20, subscriptions: 13 },
  { date: '2026-03-27', disputes: 15, subscriptions: 9 },
]

export type RecentActivityRow = {
  id: string
  time: string
  actor: string
  action: string
  target: string
}

export const MOCK_RECENT_ACTIVITY: RecentActivityRow[] = [
  {
    id: '1',
    time: '2026-03-27 09:42',
    actor: 'Elena Rodriguez',
    action: 'Updated dispute',
    target: '#DSP-90422',
  },
  {
    id: '2',
    time: '2026-03-27 09:18',
    actor: 'System',
    action: 'Seller doc scan',
    target: 'SV-012',
  },
  {
    id: '3',
    time: '2026-03-27 08:55',
    actor: 'James Chen',
    action: 'Role change',
    target: 'USR-02104',
  },
  {
    id: '4',
    time: '2026-03-27 08:31',
    actor: 'Priya Nair',
    action: 'Subscription renew',
    target: 'SUB-10482',
  },
  {
    id: '5',
    time: '2026-03-27 07:50',
    actor: 'Audit Bot',
    action: 'Compliance export',
    target: 'Quarterly',
  },
]

export type RecentTransactionRow = {
  id: string
  time: string
  reference: string
  type: string
  amountCents: number
  status: 'Settled' | 'Pending' | 'Failed'
}

export const MOCK_RECENT_TRANSACTIONS: RecentTransactionRow[] = [
  {
    id: 't1',
    time: '2026-03-27 08:12',
    reference: 'INV-2026-8891',
    type: 'Import duty settlement',
    amountCents: 12_400_00,
    status: 'Settled',
  },
  {
    id: 't2',
    time: '2026-03-26 16:40',
    reference: 'INV-2026-8874',
    type: 'Subscription invoice',
    amountCents: 790_00,
    status: 'Settled',
  },
  {
    id: 't3',
    time: '2026-03-26 14:02',
    reference: 'PAY-44102',
    type: 'Exporter fee',
    amountCents: 3_250_00,
    status: 'Pending',
  },
  {
    id: 't4',
    time: '2026-03-26 11:28',
    reference: 'INV-2026-8860',
    type: 'Dispute hold release',
    amountCents: 1_240_00,
    status: 'Settled',
  },
]
