"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useDailyPeerAnalytics } from '@/hooks/api/chat/useDailyPeerAnalytics'
import { mapDailyPeerAnalyticsToChartPoints } from '@/hooks/api/chat/types'

const chartConfig = {
  activePeers: {
    label: 'Active chat peers',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function SystemActivityOverviewChart() {
  const { data, isLoading, isError, error } = useDailyPeerAnalytics({ days: 30 })
  const chartData = data ? mapDailyPeerAnalyticsToChartPoints(data) : []
  const todayCount = data?.today.uniquePeerCount ?? 0
  const timezone = data?.timezone ?? 'Asia/Dhaka'

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Chat activity overview
        </CardTitle>
        <CardDescription className="text-xs">
          Unique active peers per day (last {data?.days ?? 30} days,{' '}
          {timezone}). Today:{' '}
          <span className="text-foreground font-medium tabular-nums">
            {isLoading ? '…' : todayCount.toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="aspect-auto h-[220px] w-full rounded-md" />
        ) : isError ? (
          <p className="text-destructive flex h-[220px] items-center justify-center px-4 text-center text-sm">
            {error instanceof Error
              ? error.message
              : 'Could not load chat activity.'}
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-muted-foreground flex h-[220px] items-center justify-center text-sm">
            No chat activity in this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[220px] w-full"
          >
            <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fillActivePeers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-activePeers)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-activePeers)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value) => {
                  const d = new Date(value + 'T12:00:00')
                  return d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(String(value) + 'T12:00:00').toLocaleDateString(
                        'en-US',
                        { weekday: 'short', month: 'short', day: 'numeric' },
                      )
                    }
                    indicator="dot"
                  />
                }
              />
              <ChartLegend
                verticalAlign="bottom"
                content={<ChartLegendContent />}
              />
              <Area
                dataKey="activePeers"
                name="activePeers"
                type="monotone"
                fill="url(#fillActivePeers)"
                stroke="var(--color-activePeers)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
