import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PanelLeftIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useChatSocket, type ChatSendPayload } from '@/hooks/useChatSocket'
import { useAuthStore } from '@/store/authStore'
import { uploadImageFile } from '@/hooks/media/useImageUpload'
import {
  chatMessageQueryKey,
  chatPeerUsersQueryKey,
  markChatThreadRead,
  useChatMessagesQuery,
  usePeerUsers,
  type ChatMessagesPage,
  type ChatPeerRow,
} from '@/hooks/api/chat/useChatMessaging'
import {
  mapApiMessageToUi,
  normalizeChatEntityId,
  type UiChatMessage,
} from '@/pages/Messages/lib/mapApiMessage'
import { ChatComposer } from '@/pages/Messages/components/ChatComposer'
import { ChatHeader } from '@/pages/Messages/components/ChatHeader'
import { ChatThreadSkeleton } from '@/pages/Messages/components/ChatThreadSkeleton'
import { ConversationSidebar } from '@/pages/Messages/components/ConversationSidebar'
import { MessageList } from '@/pages/Messages/components/MessageList'

export default function Messages() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const isAuthHydrated = useAuthStore((s) => s.isAuthHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const myUserId = user?.id ?? null

  const peerUserId = searchParams.get('peer')

  const [inputValue, setInputValue] = useState('')
  const [sendBusy, setSendBusy] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [optimisticMessages, setOptimisticMessages] = useState<UiChatMessage[]>([])
  const [peerLastReadAt, setPeerLastReadAt] = useState<Date | null>(null)
  const [peerActive, setPeerActive] = useState(false)
  const presenceHideTimerRef = useRef<number>(0)
  const peerRef = useRef<string | null>(null)

  peerRef.current = peerUserId

  const {
    data: messagesPage,
    isFetched: messagesFetchedForPeer,
    isPending: messagesPending,
  } = useChatMessagesQuery(peerUserId ?? undefined)

  const { data: peerRows = [] } = usePeerUsers()

  const activePeerRow = useMemo(
    () => peerRows.find((r) => r.peerUserId === peerUserId),
    [peerRows, peerUserId],
  )

  const peerDisplayName = useMemo(() => {
    const name = activePeerRow?.peer?.name?.trim()
    if (name) return name
    if (peerUserId) return `…${peerUserId.slice(-6)}`
    return ''
  }, [activePeerRow?.peer?.name, peerUserId])

  const peerAvatarUrl = useMemo(() => {
    const img = activePeerRow?.peer?.profileImage
    if (typeof img === 'string' && img.trim()) return img.trim()
    if (img && typeof img === 'object' && typeof img.url === 'string' && img.url.trim()) {
      return img.url.trim()
    }
    return null
  }, [activePeerRow?.peer?.profileImage])

  const peerLiveFromApi = activePeerRow?.peer?.liveActive ?? false

  const messageListPeerInitials = useMemo(() => {
    const name = activePeerRow?.peer?.name?.trim()
    if (name && name.length >= 2) return name.slice(0, 2).toUpperCase()
    if (name && name.length === 1) return (name + name).slice(0, 2).toUpperCase()
    if (peerUserId && peerUserId.length >= 2) return peerUserId.slice(-2).toUpperCase()
    return '??'
  }, [activePeerRow?.peer?.name, peerUserId])

  useEffect(() => {
    setOptimisticMessages([])
    setPeerLastReadAt(null)
    setPeerActive(false)
    setComposerError(null)
    window.clearTimeout(presenceHideTimerRef.current)
  }, [peerUserId])

  useEffect(() => {
    const rs = messagesPage?.readState
    if (!rs?.peerLastReadAt) {
      setPeerLastReadAt(null)
      return
    }
    setPeerLastReadAt(new Date(rs.peerLastReadAt))
  }, [messagesPage?.readState, peerUserId])

  const mergeIncomingMessage = useCallback(
    (raw: Record<string, unknown>) => {
      if (!myUserId) return
      const senderId = normalizeChatEntityId(raw.senderId)
      if (!senderId) return

      const threadPeer = senderId === myUserId ? peerRef.current : senderId
      if (!threadPeer) return

      queryClient.setQueryData(
        chatMessageQueryKey(threadPeer),
        (old: ChatMessagesPage | undefined): ChatMessagesPage => {
          const list = old?.data ?? []
          const id = normalizeChatEntityId(raw._id)
          if (id && list.some((m) => normalizeChatEntityId(m._id) === id)) {
            return (
              old ?? {
                data: [],
                meta: { page: 1, limit: 80, total: 0, totalPages: 0 },
                readState: {
                  myLastReadAt: null,
                  peerLastReadAt: null,
                },
              }
            )
          }

          return {
            data: [raw, ...list],
            meta: {
              page: old?.meta.page ?? 1,
              limit: old?.meta.limit ?? 80,
              total: (old?.meta.total ?? list.length) + 1,
              totalPages: old?.meta.totalPages ?? 1,
            },
            readState: old?.readState,
          }
        },
      )

      if (senderId !== myUserId && peerRef.current !== senderId) {
        queryClient.setQueryData(
          chatPeerUsersQueryKey,
          (old: ChatPeerRow[] | undefined) => {
            if (!old) return old
            return old.map((row) =>
              row.peerUserId === senderId
                ? { ...row, unreadCount: (row.unreadCount ?? 0) + 1 }
                : row,
            )
          },
        )
      }
    },
    [myUserId, queryClient],
  )

  const onReadReceipt = useCallback(
    (payload: { readerUserId: string; readAt: string }) => {
      if (!peerUserId || payload.readerUserId !== peerUserId) return
      setPeerLastReadAt(new Date(payload.readAt))
    },
    [peerUserId],
  )

  const onPresence = useCallback(
    (payload: { userId: string; active: boolean }) => {
      if (!peerUserId || payload.userId !== peerUserId || !payload.active) return
      setPeerActive(true)
      window.clearTimeout(presenceHideTimerRef.current)
      presenceHideTimerRef.current = window.setTimeout(() => {
        setPeerActive(false)
      }, 45_000)
    },
    [peerUserId],
  )

  const socketHandlers = useMemo(
    () => ({
      onMessage: mergeIncomingMessage,
      onReadReceipt,
      onPresence,
    }),
    [mergeIncomingMessage, onReadReceipt, onPresence],
  )

  const { send: socketSend, socketConnected, emitRead, emitPresencePing } =
    useChatSocket(Boolean(isAuthHydrated && isAuthenticated && myUserId), socketHandlers)

  const markThreadRead = useCallback(async () => {
    if (!peerUserId || !myUserId) return
    emitRead(peerUserId)
    try {
      await markChatThreadRead(peerUserId)
    } catch {
      // ignore REST fallback errors
    }

    queryClient.setQueryData(chatPeerUsersQueryKey, (old: ChatPeerRow[] | undefined) => {
      if (!old) return old
      return old.map((row) =>
        row.peerUserId === peerUserId ? { ...row, unreadCount: 0 } : row,
      )
    })
  }, [peerUserId, myUserId, emitRead, queryClient])

  useEffect(() => {
    if (!peerUserId || !messagesFetchedForPeer) return
    void markThreadRead()
  }, [peerUserId, messagesFetchedForPeer, markThreadRead])

  useEffect(() => {
    const onVis = () => {
      if (
        document.visibilityState === 'visible' &&
        peerUserId &&
        messagesFetchedForPeer
      ) {
        void markThreadRead()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [peerUserId, messagesFetchedForPeer, markThreadRead])

  useEffect(() => {
    if (!peerUserId || !socketConnected) return
    emitPresencePing(peerUserId)
    const t = window.setInterval(() => {
      emitPresencePing(peerUserId)
    }, 25_000)
    return () => window.clearInterval(t)
  }, [peerUserId, socketConnected, emitPresencePing])

  const sendChat = useCallback(
    async (payload: ChatSendPayload) => {
      const msg = await socketSend(payload)
      mergeIncomingMessage(msg)
      await queryClient.invalidateQueries({ queryKey: chatPeerUsersQueryKey })
      return msg
    },
    [socketSend, mergeIncomingMessage, queryClient],
  )

  const uiMessages = useMemo(() => {
    if (!myUserId) return optimisticMessages
    if (!messagesPage?.data?.length) return optimisticMessages

    const server = [...messagesPage.data]
      .reverse()
      .map((m) => mapApiMessageToUi(m as Record<string, unknown>, myUserId))
      .filter((x): x is NonNullable<typeof x> => x != null)

    return [...server, ...optimisticMessages]
  }, [messagesPage, myUserId, optimisticMessages])

  const showMessagesSkeleton = Boolean(peerUserId) && messagesPending

  const sendText = async () => {
    const text = inputValue.trim()
    if (!peerUserId || !text || !myUserId) return

    const tempId = `temp:${globalThis.crypto.randomUUID()}`
    const optimistic: UiChatMessage = {
      id: tempId,
      senderId: myUserId,
      fromMe: true,
      type: 'text',
      text,
      createdAt: new Date(),
      sendStatus: 'sending',
    }

    setComposerError(null)
    setOptimisticMessages((prev) => [...prev, optimistic])
    setInputValue('')
    setSendBusy(true)

    try {
      const msg = await socketSend({ peerUserId, type: 'text', text })
      mergeIncomingMessage(msg)
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId))
      await queryClient.invalidateQueries({ queryKey: chatPeerUsersQueryKey })
    } catch (e) {
      setOptimisticMessages((prev) => prev.filter((m) => m.id !== tempId))
      setInputValue(text)
      setComposerError(e instanceof Error ? e.message : 'Could not send message.')
    } finally {
      setSendBusy(false)
    }
  }

  const sendImageFile = async (file: File) => {
    if (!peerUserId) return
    setComposerError(null)
    setSendBusy(true)

    try {
      const media = await uploadImageFile({
        file,
        useCase: 'MESSAGE',
        alt: file.name || 'Chat image',
      })

      if (!media?._id) {
        throw new Error('Upload failed')
      }

      await sendChat({
        peerUserId,
        type: 'image',
        imageId: media._id,
      })
    } catch (e) {
      setComposerError(e instanceof Error ? e.message : 'Could not upload image.')
    } finally {
      setSendBusy(false)
    }
  }

  return (
    <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
      <div className="relative flex h-[calc(100vh-8rem)] min-h-[32rem] flex-1 flex-col overflow-hidden rounded-xl border bg-card md:flex-row">
        <div className="hidden h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden border-r bg-muted/30 md:flex lg:w-80">
          <ConversationSidebar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {!peerUserId ? (
            <div className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b bg-card/95 px-2 py-2 backdrop-blur supports-backdrop-filter:bg-card/75 md:hidden">
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="max-w-[min(12rem,72vw)] shrink-0 justify-start gap-2"
                    aria-label="Open conversation list"
                  />
                }
              >
                <PanelLeftIcon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="truncate">Messages</span>
              </SheetTrigger>
            </div>
          ) : null}

          {peerUserId ? (
            <>
              <ChatHeader
                peerName={peerDisplayName}
                peerImageUrl={peerAvatarUrl}
                peerActive={peerLiveFromApi || peerActive}
                conversationListTrigger={
                  <SheetTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="max-w-[min(11rem,48vw)] justify-start gap-2"
                        aria-label="Open conversation list"
                      />
                    }
                  >
                    <PanelLeftIcon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="truncate">
                      {peerDisplayName.trim() || 'Messages'}
                    </span>
                  </SheetTrigger>
                }
              />

              {showMessagesSkeleton ? (
                <ChatThreadSkeleton />
              ) : (
                <MessageList
                  messages={uiMessages}
                  peerInitials={messageListPeerInitials}
                  peerLastReadAt={peerLastReadAt}
                />
              )}

              <ChatComposer
                value={inputValue}
                onChange={setInputValue}
                onSendText={() => void sendText()}
                onPickImage={(file) => void sendImageFile(file)}
                disabled={!isAuthenticated}
                busy={sendBusy}
                errorMessage={composerError}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p className="text-sm">
                {location.search
                  ? 'Select a conversation from the list.'
                  : 'Pick a conversation to get started.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex w-[min(22rem,88vw)] max-w-sm flex-col gap-0 overflow-hidden border-r p-0"
      >
        <SheetTitle className="sr-only">Messages</SheetTitle>
        <ConversationSidebar inDrawer onPeerPicked={() => setMobileSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
