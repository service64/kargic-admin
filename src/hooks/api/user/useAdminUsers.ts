import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminUsersPageDto, AdminUsersQueryParams } from './types'

export const adminUsersQueryKey = ['user', 'admin'] as const

export function useAdminUsers(params: AdminUsersQueryParams) {
  return useQuery({
    queryKey: [...adminUsersQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminUsersPageDto>>(
        '/user/admin',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
