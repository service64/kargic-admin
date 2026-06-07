import { useMutation, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import { adminContactListQueryKey } from './useAdminContactList'
import { adminContactMessagesQueryKey } from './useAdminContactMessages'
import type {
  MarkContactMessagesReadBody,
  MarkContactMessagesReadResultDto,
} from './types'

export function useMarkContactMessagesRead(contactId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (body: MarkContactMessagesReadBody) => {
      const res = await adminApi.patch<
        ApiEnvelope<MarkContactMessagesReadResultDto>
      >(`/contact/admin/${contactId}/messages/read`, body)
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminContactListQueryKey })
      qc.invalidateQueries({ queryKey: adminContactMessagesQueryKey })
    },
  })
}
