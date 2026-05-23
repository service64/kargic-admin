import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { DailyPeerAnalyticsDto } from './types'

export const dailyPeerAnalyticsQueryKey = ['chat', 'analytics', 'daily-peers'] as const

export type UseDailyPeerAnalyticsOptions = {
  /** Calendar days including today (server max 90, default 30). */
  days?: number
  /** Platform-wide when omitted. */
  userId?: string
  enabled?: boolean
}

export function useDailyPeerAnalytics(options?: UseDailyPeerAnalyticsOptions) {
  const days = options?.days ?? 30
  const userId = options?.userId

  return useQuery({
    queryKey: [...dailyPeerAnalyticsQueryKey, { days, userId }] as const,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<DailyPeerAnalyticsDto>>(
        '/chat/analytics/daily-peers',
        {
          params: {
            days,
            ...(userId ? { userId } : {}),
          },
        },
      )
      return unwrapData(res)
    },
    enabled: options?.enabled !== false,
    staleTime: 60_000,
  })
}
