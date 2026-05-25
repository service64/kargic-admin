import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  AdminReportSummaryPageDto,
  AdminReportSummaryQueryParams,
} from './types'

export const adminReportSummaryQueryKey = ['report', 'admin', 'summary'] as const

export function useAdminReportSummary(params: AdminReportSummaryQueryParams) {
  return useQuery({
    queryKey: [...adminReportSummaryQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminReportSummaryPageDto>>(
        '/report/admin/summary',
        { params }
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
