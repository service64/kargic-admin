export type DailyPeerStatsDayRow = {
  date: string
  uniquePeerCount: number
}

export type DailyPeerAnalyticsDto = {
  timezone: string
  userId?: string
  today: DailyPeerStatsDayRow
  days: number
  series: DailyPeerStatsDayRow[]
}

/** Chart row for {@link SystemActivityOverviewChart}. */
export type SystemActivityChartPoint = {
  date: string
  activePeers: number
}

export function mapDailyPeerAnalyticsToChartPoints(
  dto: DailyPeerAnalyticsDto,
): SystemActivityChartPoint[] {
  return dto.series.map((row) => ({
    date: row.date,
    activePeers: row.uniquePeerCount,
  }))
}
