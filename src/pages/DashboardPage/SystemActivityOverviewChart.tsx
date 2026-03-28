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
import type { SystemActivityPoint } from '@/pages/DashboardPage/overview-mock-data'

const chartConfig = {
  disputes: {
    label: 'Dispute activity',
    color: 'var(--chart-1)',
  },
  subscriptions: {
    label: 'Subscription events',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function SystemActivityOverviewChart({
  data,
}: {
  data: SystemActivityPoint[]
}) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          System Activity Overview
        </CardTitle>
        <CardDescription className="text-xs">
          Operational volume by day (mock)—dispute workflows vs subscription
          lifecycle.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillDisputes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-disputes)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-disputes)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient
                id="fillSubscriptions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-subscriptions)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-subscriptions)"
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
                      { weekday: 'short', month: 'short', day: 'numeric' }
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
              dataKey="disputes"
              name="disputes"
              type="monotone"
              fill="url(#fillDisputes)"
              stroke="var(--color-disputes)"
              strokeWidth={1.5}
            />
            <Area
              dataKey="subscriptions"
              name="subscriptions"
              type="monotone"
              fill="url(#fillSubscriptions)"
              stroke="var(--color-subscriptions)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
