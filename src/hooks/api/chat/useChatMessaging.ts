import { useQuery, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  ChatMessagesPage,
  ChatPeerRow,
  ChatListMeta,
} from './types'

export type { ChatMessagesPage, ChatPeerRow } from './types'

type PaginatedEnvelope<T> = ApiEnvelope<{
  data: T[]
  meta: ChatListMeta
}>

export const chatMessageQueryKey = (peerUserId: string) =>
  ['chatMessages', peerUserId] as const

export const chatPeerUsersQueryKey = ['chat', 'peers'] as const

export function useChatMessagesQuery(peerUserId: string | undefined) {
  const id = peerUserId?.trim()

  return useQuery({
    queryKey: chatMessageQueryKey(id ?? ''),
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<ChatMessagesPage>>(
        `/chat/with/${id}/messages`,
        { params: { page: 1, limit: 80 } },
      )

      return (
        unwrapData(res) ?? {
          data: [] as Record<string, unknown>[],
          meta: { page: 1, limit: 80, total: 0, totalPages: 0 },
          readState: {
            myLastReadAt: null,
            peerLastReadAt: null,
          },
        }
      )
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  })
}

export function useInvalidateChatMessages() {
  const qc = useQueryClient()
  return (peerUserId: string) =>
    qc.invalidateQueries({ queryKey: chatMessageQueryKey(peerUserId) })
}

export async function markChatThreadRead(peerUserId: string): Promise<void> {
  await adminApi.post(`/chat/with/${peerUserId}/read`)
}

export function usePeerUsers() {
  return useQuery({
    queryKey: chatPeerUsersQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<PaginatedEnvelope<ChatPeerRow>>('/chat/peers')
      const payload = unwrapData(res)
      const rows = payload?.data ?? []

      return rows.map((row) => ({
        ...row,
        unreadCount: row.unreadCount ?? 0,
        lastMessageAt: row.lastMessageAt ?? null,
        peer: row.peer
          ? {
              ...row.peer,
              profileImage: row.peer.profileImage ?? null,
              liveActive: row.peer.liveActive ?? false,
            }
          : null,
      }))
    },
    staleTime: 30_000,
    refetchInterval: 45_000,
    refetchOnWindowFocus: true,
  })
}
