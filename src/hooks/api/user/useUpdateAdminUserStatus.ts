import { useMutation, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { adminUsersQueryKey } from '@/hooks/api/user/useAdminUsers'
import { adminUserDetailsQueryKey } from '@/hooks/api/user/useAdminUserDetails'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  UpdateAdminUserStatusBody,
  UpdateAdminUserStatusResult,
} from './types'

export function useUpdateAdminUserStatus(userId: string | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateAdminUserStatusBody) => {
      if (!userId) throw new Error('User id is required')
      const res = await adminApi.patch<ApiEnvelope<UpdateAdminUserStatusResult>>(
        `/user/admin/${userId}/status`,
        body,
      )
      return unwrapData(res)
    },
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: [...adminUserDetailsQueryKey, userId] })
      }
      qc.invalidateQueries({ queryKey: adminUsersQueryKey })
    },
  })
}
