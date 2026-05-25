import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  AdminSellerVerificationPageDto,
  AdminSellerVerificationQueryParams,
} from './types'

export const adminSellerVerificationQueryKey = [
  'exporter-profile',
  'admin',
  'seller-verification',
] as const

export function useAdminSellerVerification(
  params: AdminSellerVerificationQueryParams,
) {
  return useQuery({
    queryKey: [...adminSellerVerificationQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminSellerVerificationPageDto>>(
        '/exporter-profile/admin/seller-verification',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
