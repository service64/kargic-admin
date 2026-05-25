import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminReportDetailsDto } from './types'

export const adminReportDetailsQueryKey = ['report', 'admin', 'details'] as const

export function useAdminReportDetails(userId: string | null, enabled = true) {
  return useQuery({
    queryKey: [...adminReportDetailsQueryKey, userId],
    enabled: enabled && Boolean(userId),
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminReportDetailsDto>>(
        `/report/admin/${userId}`
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
