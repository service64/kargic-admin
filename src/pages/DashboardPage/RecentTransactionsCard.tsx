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
import { MOCK_RECENT_TRANSACTIONS } from '@/pages/DashboardPage/overview-mock-data'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

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

export function RecentTransactionsCard() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-[2px]"
        aria-hidden={false}
        role="status"
      >
        <p className="border-border bg-card text-foreground rounded-lg border px-4 py-2 text-sm font-medium shadow-sm">
          Coming soon
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="border-b px-3 py-2">
          <CardTitle className="text-sm font-medium">Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="pointer-events-none p-0 select-none opacity-60">
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
                  <TableCell className="font-mono text-xs">{row.reference}</TableCell>
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
                        txStatusClass(row.status),
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
  )
}
