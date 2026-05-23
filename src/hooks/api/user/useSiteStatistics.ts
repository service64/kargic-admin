import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { SiteStatisticsDto } from './types'

export const siteStatisticsQueryKey = ['user', 'site-statistics'] as const

export function useSiteStatistics() {
  return useQuery({
    queryKey: siteStatisticsQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<SiteStatisticsDto>>(
        '/user/site-statistics',
      )
      return unwrapData(res)
    },
    staleTime: 30_000,
  })
}
