export type SubscriptionStatus = 'active' | 'paused' | 'canceled'

export type BillingCycle = 'Monthly' | 'Annual'

export type SubscriptionRecord = {
  id: string
  status: SubscriptionStatus
  billingCycle: BillingCycle
  nextBillingDate: string
  amountCents: number
  planName: string
}

export const MOCK_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'SUB-10482',
    status: 'active',
    billingCycle: 'Monthly',
    nextBillingDate: '2026-04-12',
    amountCents: 79_00,
    planName: 'Pro',
  },
  {
    id: 'SUB-10471',
    status: 'active',
    billingCycle: 'Annual',
    nextBillingDate: '2026-11-03',
    amountCents: 790_00,
    planName: 'Business',
  },
  {
    id: 'SUB-10398',
    status: 'paused',
    billingCycle: 'Monthly',
    nextBillingDate: '2026-04-01',
    amountCents: 29_00,
    planName: 'Starter',
  },
  {
    id: 'SUB-10244',
    status: 'active',
    billingCycle: 'Monthly',
    nextBillingDate: '2026-04-28',
    amountCents: 149_00,
    planName: 'Business',
  },
  {
    id: 'SUB-10102',
    status: 'canceled',
    billingCycle: 'Monthly',
    nextBillingDate: '—',
    amountCents: 0,
    planName: 'Starter',
  },
  {
    id: 'SUB-10081',
    status: 'active',
    billingCycle: 'Monthly',
    nextBillingDate: '2026-04-05',
    amountCents: 79_00,
    planName: 'Pro',
  },
]

export function computeOverview(rows: SubscriptionRecord[]) {
  const active = rows.filter((r) => r.status === 'active')
  const activeCount = active.length
  const primaryPlan =
    active.find((r) => r.planName === 'Business')?.planName ??
    active[0]?.planName ??
    '—'
  const monthlyCostCents = active.reduce((sum, r) => {
    if (r.billingCycle === 'Annual') {
      return sum + Math.round(r.amountCents / 12)
    }
    return sum + r.amountCents
  }, 0)
  const upcoming = active
    .filter((r) => r.nextBillingDate !== '—')
    .map((r) => new Date(r.nextBillingDate).getTime())
  const nextBillingMs =
    upcoming.length > 0 ? Math.min(...upcoming) : undefined
  const nextBillingDate =
    nextBillingMs !== undefined
      ? new Date(nextBillingMs).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—'

  return {
    activeCount,
    currentPlan: primaryPlan,
    monthlyCost: monthlyCostCents / 100,
    nextBillingDate,
  }
}
