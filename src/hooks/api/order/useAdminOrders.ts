import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { AdminOrdersPageDto, AdminOrdersQueryParams } from './types'

export const adminOrdersQueryKey = ['order', 'admin'] as const

export function useAdminOrders(params: AdminOrdersQueryParams) {
  return useQuery({
    queryKey: [...adminOrdersQueryKey, params],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminOrdersPageDto>>(
        '/order/admin',
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 15_000,
  })
}
