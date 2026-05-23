import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminImportersPageDto, AdminImportersQueryParams } from './types'

export const adminImportersQueryKey = ['importer-profile', 'admin'] as const

export function useAdminImporters(params: AdminImportersQueryParams) {
  return useQuery({
    queryKey: [...adminImportersQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminImportersPageDto>>(
        '/importer-profile/admin',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
