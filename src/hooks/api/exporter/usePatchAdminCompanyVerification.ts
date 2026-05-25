import { useMutation, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { adminUserDetailsQueryKey } from '@/hooks/api/user/useAdminUserDetails'
import type { AdminCompanyVerificationDto } from '@/hooks/api/user/types'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import { adminExportersQueryKey } from './useAdminExporters'
import { adminSellerVerificationQueryKey } from './useAdminSellerVerification'
import type { PatchAdminCompanyVerificationBody } from './types'

export function usePatchAdminCompanyVerification(userId: string | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (body: PatchAdminCompanyVerificationBody) => {
      if (!userId) {
        throw new Error('User id is required')
      }
      const res = await adminApi.patch<ApiEnvelope<AdminCompanyVerificationDto>>(
        `/exporter-profile/verification/admin/${userId}`,
        body,
      )
      return unwrapData(res)
    },
    onSuccess: () => {
      if (userId) {
        qc.invalidateQueries({ queryKey: [...adminUserDetailsQueryKey, userId] })
      }
      qc.invalidateQueries({ queryKey: adminExportersQueryKey })
      qc.invalidateQueries({ queryKey: adminSellerVerificationQueryKey })
    },
  })
}
