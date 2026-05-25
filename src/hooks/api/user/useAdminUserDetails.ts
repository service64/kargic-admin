import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminUserDetailsDto } from './types'

export const adminUserDetailsQueryKey = ['user', 'admin', 'details'] as const

export function useAdminUserDetails(userId: string | undefined) {
  return useQuery({
    queryKey: [...adminUserDetailsQueryKey, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminUserDetailsDto>>(
        `/user/admin/${userId}/details`,
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}

