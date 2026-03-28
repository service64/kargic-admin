import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PartnerRow } from '@/pages/site-orders/mock-data'

const TOP_N = 10

function PartnerTableSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-full" />
      ))}
    </div>
  )
}

function PartnerTableCard({
  title,
  description,
  loading,
  rows,
  query,
  onQueryChange,
}: {
  title: string
  description: string
  loading: boolean
  rows: PartnerRow[]
  query: string
  onQueryChange: (q: string) => void
}) {
  const filtered = rows
    .filter((r) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return (
        r.company.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, TOP_N)

  return (
    <Card size="sm" className="min-w-0 gap-3">
      <CardHeader className="border-b px-4 pb-3">
        <div className="flex flex-col gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Input
            placeholder="Search name or status…"
            className="h-7 text-xs"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        {loading ? (
          <PartnerTableSkeleton />
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground px-4 py-6 text-center text-xs">
            {rows.length === 0
              ? 'No partners on record.'
              : 'No matches for this search.'}
          </p>
        ) : (
          <div className="max-h-[min(20rem,40vh)] overflow-auto rounded-b-xl">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_0_var(--border)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                    Name / Company
                  </TableHead>
                  <TableHead className="bg-card h-8 px-2 py-1.5 text-right text-xs font-medium whitespace-nowrap">
                    Orders
                  </TableHead>
                  <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                    Last order
                  </TableHead>
                  <TableHead className="bg-card h-8 px-2 py-1.5 text-xs font-medium whitespace-nowrap">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="text-xs">
                    <TableCell
                      className="max-w-40 truncate px-2 py-1.5 font-medium"
                      title={r.company}
                    >
                      {r.company}
                    </TableCell>
                    <TableCell className="px-2 py-1.5 text-right tabular-nums">
                      {r.totalOrders}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-2 py-1.5 tabular-nums">
                      {r.lastOrderDate}
                    </TableCell>
                    <TableCell className="px-2 py-1.5">
                      <Badge
                        variant={r.status === 'active' ? 'outline' : 'secondary'}
                        className="text-[10px] capitalize"
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type PartnersSectionProps = {
  loading: boolean
  importers: PartnerRow[]
  exporters: PartnerRow[]
  importerQuery: string
  exporterQuery: string
  onImporterQuery: (q: string) => void
  onExporterQuery: (q: string) => void
}

export function PartnersSection({
  loading,
  importers,
  exporters,
  importerQuery,
  exporterQuery,
  onImporterQuery,
  onExporterQuery,
}: PartnersSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PartnerTableCard
        title="Top importers"
        description={`Up to ${TOP_N} by volume · search to narrow`}
        loading={loading}
        rows={importers}
        query={importerQuery}
        onQueryChange={onImporterQuery}
      />
      <PartnerTableCard
        title="Top exporters"
        description={`Up to ${TOP_N} by volume · search to narrow`}
        loading={loading}
        rows={exporters}
        query={exporterQuery}
        onQueryChange={onExporterQuery}
      />
    </div>
  )
}
