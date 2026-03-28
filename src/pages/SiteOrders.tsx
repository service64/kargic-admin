import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { OrdersSection } from '@/pages/site-orders/OrdersSection'
import type { StatusFilter } from '@/pages/site-orders/OrdersSection'
import { PartnersSection } from '@/pages/site-orders/PartnersSection'
import {
  MOCK_EXPORTERS,
  MOCK_IMPORTERS,
  MOCK_ORDERS,
  MOCK_SITE_STATS,
} from '@/pages/site-orders/mock-data'

const LOAD_MS = 680

export function SiteOrders() {
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [importerQuery, setImporterQuery] = useState('')
  const [exporterQuery, setExporterQuery] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), LOAD_MS)
    return () => window.clearTimeout(t)
  }, [])

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (dateFilter) {
        const day = o.updatedAt.slice(0, 10)
        if (day !== dateFilter) return false
      }
      return true
    })
  }, [statusFilter, dateFilter])

  return (
    <div className="space-y-4 px-4 py-4">
      <h1 className="text-foreground text-lg font-semibold tracking-tight">
        Site Orders & Partners
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm" className="py-3">
          <CardContent className="px-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Orders running
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {MOCK_SITE_STATS.ordersRunning}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="py-3">
          <CardContent className="px-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Total importers
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {MOCK_SITE_STATS.totalImporters}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="py-3">
          <CardContent className="px-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Total exporters
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {MOCK_SITE_STATS.totalExporters}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="py-3">
          <CardContent className="px-4">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Completed orders
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {MOCK_SITE_STATS.ordersCompleted}
            </p>
          </CardContent>
        </Card>
      </div>

      <OrdersSection
        loading={loading}
        orders={filteredOrders}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
      />

      <PartnersSection
        loading={loading}
        importers={MOCK_IMPORTERS}
        exporters={MOCK_EXPORTERS}
        importerQuery={importerQuery}
        exporterQuery={exporterQuery}
        onImporterQuery={setImporterQuery}
        onExporterQuery={setExporterQuery}
      />
    </div>
  )
}
