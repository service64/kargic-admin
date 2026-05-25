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

export type ChatReadStateDto = {
  myLastReadAt: string | null
  peerLastReadAt: string | null
}

export type ChatMessagesPage = {
  data: Record<string, unknown>[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  readState?: ChatReadStateDto
}

export type ChatPeerProfile = {
  id: string
  name: string
  email: string
  phone: string
  activeRole: 'EXPORTER' | 'IMPORTER' | 'ADMIN'
  profileImage:
    | string
    | {
        url?: string
      }
    | null
  lastApiActivityAt?: string | null
  liveActive?: boolean
}

export type ChatPeerRow = {
  peerUserId: string
  conversationId: string
  lastMessageAt: string | null
  peer: ChatPeerProfile | null
  unreadCount?: number
}

export type ChatListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
