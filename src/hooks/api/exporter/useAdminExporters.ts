import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminExportersPageDto, AdminExportersQueryParams } from './types'

export const adminExportersQueryKey = ['exporter-profile', 'admin'] as const

export function useAdminExporters(params: AdminExportersQueryParams) {
  return useQuery({
    queryKey: [...adminExportersQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminExportersPageDto>>(
        '/exporter-profile/admin',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
