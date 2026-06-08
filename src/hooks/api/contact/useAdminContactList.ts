import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  AdminContactListPageDto,
  AdminContactListQueryParams,
} from './types'

export const adminContactListQueryKey = ['contact', 'admin', 'list'] as const

export function useAdminContactList(params: AdminContactListQueryParams) {
  return useQuery({
    queryKey: [...adminContactListQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminContactListPageDto>>(
        '/contact/admin',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
