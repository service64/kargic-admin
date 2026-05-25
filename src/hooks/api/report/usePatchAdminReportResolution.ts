import { useMutation, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import { adminReportDetailsQueryKey } from './useAdminReportDetails'
import { adminReportSummaryQueryKey } from './useAdminReportSummary'
import type {
  AdminReportDetailRowDto,
  UpdateAdminReportResolutionBody,
} from './types'

export function usePatchAdminReportResolution(userId: string | null) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      reportId,
      body,
    }: {
      reportId: string
      body: UpdateAdminReportResolutionBody
    }) => {
      const res = await adminApi.patch<ApiEnvelope<AdminReportDetailRowDto>>(
        `/report/admin/${reportId}/resolve`,
        body
      )
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminReportSummaryQueryKey })
      if (userId) {
        qc.invalidateQueries({ queryKey: [...adminReportDetailsQueryKey, userId] })
      }
    },
  })
}
