import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { io, type Socket } from 'socket.io-client'

import { getStoredAccessToken } from '@/hooks/adminApi'
import { getSocketBaseUrl } from '@/lib/socketBaseUrl'

export type ChatSendPayload =
  | { peerUserId: string; type: 'text'; text: string }
  | { peerUserId: string; type: 'image'; imageId: string }
  | { peerUserId: string; type: 'order'; orderId: string }
  | { peerUserId: string; type: 'product'; productId: string }

export type ChatSocketHandlers = {
  onMessage: (message: Record<string, unknown>) => void
  onReadReceipt?: (payload: { readerUserId: string; readAt: string }) => void
  onPresence?: (payload: { userId: string; active: boolean; ts?: number }) => void
}

type AckResponse =
  | { ok: true; message: Record<string, unknown> }
  | { ok: false; error: string }

function waitForSocketConnect(socket: Socket, timeoutMs: number): Promise<void> {
  if (socket.connected) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let settled = false
    const cleanup = () => {
      window.clearTimeout(timer)
      socket.off('connect', onConnect)
      socket.off('connect_error', onConnectError)
    }
    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      cleanup()
      fn()
    }
    const timer = window.setTimeout(() => {
      finish(() =>
        reject(
          new Error(
            'Chat connection timeout. Check API/socket URL configuration.',
          ),
        ),
      )
    }, timeoutMs)
    const onConnect = () => finish(() => resolve())
    const onConnectError = (err: Error & { message?: string }) => {
      const msg =
        typeof err?.message === 'string' && err.message.length > 0
          ? err.message
          : 'connection refused'
      finish(() => reject(new Error(`Chat socket: ${msg}`)))
    }
    socket.once('connect', onConnect)
    socket.once('connect_error', onConnectError)
  })
}

export function useChatSocket(enabled: boolean, handlers: ChatSocketHandlers) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const socketRef = useRef<Socket | null>(null)
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    const accessToken = getStoredAccessToken()

    if (!enabled || !accessToken) {
      startTransition(() => setSocketConnected(false))
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    const socket = io(getSocketBaseUrl(), {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    const onMessage = (payload: { message?: Record<string, unknown> }) => {
      if (payload?.message && typeof payload.message === 'object') {
        handlersRef.current.onMessage(payload.message)
      }
    }

    const onRead = (payload: { readerUserId?: string; readAt?: string }) => {
      const readerUserId =
        typeof payload?.readerUserId === 'string' ? payload.readerUserId : ''
      const readAt = typeof payload?.readAt === 'string' ? payload.readAt : ''
      if (!readerUserId || !readAt) return
      handlersRef.current.onReadReceipt?.({ readerUserId, readAt })
    }

    const onPresence = (payload: {
      userId?: string
      active?: boolean
      ts?: number
    }) => {
      const userId = typeof payload?.userId === 'string' ? payload.userId : ''
      if (!userId) return
      handlersRef.current.onPresence?.({
        userId,
        active: payload.active === true,
        ts: typeof payload.ts === 'number' ? payload.ts : undefined,
      })
    }

    const onConnect = () => setSocketConnected(true)
    const onDisconnect = () => setSocketConnected(false)

    socket.on('chat:message', onMessage)
    socket.on('chat:read', onRead)
    socket.on('chat:presence', onPresence)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    startTransition(() => {
      if (socket.connected) setSocketConnected(true)
    })

    return () => {
      startTransition(() => setSocketConnected(false))
      socket.off('chat:message', onMessage)
      socket.off('chat:read', onRead)
      socket.off('chat:presence', onPresence)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
      socketRef.current = null
    }
  }, [enabled])

  const send = useCallback((payload: ChatSendPayload) => {
    const socket = socketRef.current
    if (!socket) {
      return Promise.reject(new Error('Chat not ready'))
    }

    return waitForSocketConnect(socket, 12_000).then(
      () =>
        new Promise<Record<string, unknown>>((resolve, reject) => {
          socket.emit('chat:send', payload, (ack: AckResponse | undefined) => {
            if (ack && ack.ok === true && ack.message) {
              resolve(ack.message)
              return
            }
            const err =
              ack && 'error' in ack && typeof ack.error === 'string'
                ? ack.error
                : 'Send failed'
            reject(new Error(err))
          })
        }),
    )
  }, [])

  const emitRead = useCallback((peerUserId: string) => {
    socketRef.current?.emit('chat:read', { peerUserId })
  }, [])

  const emitPresencePing = useCallback((peerUserId: string) => {
    socketRef.current?.emit('chat:presence:ping', { peerUserId })
  }, [])

  return { send, socketConnected, emitRead, emitPresencePing }
}
