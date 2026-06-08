import { useQuery } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  AdminContactMessagesPageDto,
  AdminContactMessagesQueryParams,
} from './types'

export const adminContactMessagesQueryKey = [
  'contact',
  'admin',
  'messages',
] as const

export function useAdminContactMessages(
  contactId: string | null,
  params: AdminContactMessagesQueryParams,
) {
  return useQuery({
    queryKey: [...adminContactMessagesQueryKey, contactId, params],
    enabled: Boolean(contactId),
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<AdminContactMessagesPageDto>>(
        `/contact/admin/${contactId}/messages`,
        { params },
      )
      return unwrapData(res)
    },
    staleTime: 10_000,
  })
}
