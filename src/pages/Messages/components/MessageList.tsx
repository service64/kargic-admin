import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { CheckIcon, CheckCheckIcon, Loader2Icon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type {
  UiChatMessage,
  UiOrderPreview,
  UiProductPreview,
} from '@/pages/Messages/lib/mapApiMessage'

function formatDividerLabel(d: Date): string {
  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round(
    (startToday.getTime() - startMsg.getTime()) / (24 * 60 * 60 * 1000),
  )
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function OrderPreviewCard({
  preview,
  fallbackText,
  fromMe,
}: {
  preview: UiOrderPreview | null | undefined
  fallbackText: string
  fromMe: boolean
}) {
  const cardTone = fromMe
    ? 'border-primary-foreground/25 bg-background text-foreground'
    : 'border-border bg-background'

  if (!preview) {
    return <p className="whitespace-pre-wrap text-sm">{fallbackText || 'Order'}</p>
  }

  return (
    <div className={`space-y-2 rounded-xl border p-3 text-left text-sm ${cardTone}`}>
      <div className="flex gap-2">
        {preview.productImageUrl ? (
          <img
            src={preview.productImageUrl}
            alt=""
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="h-14 w-14 shrink-0 rounded-md bg-muted" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Order</p>
          <p className="line-clamp-2 font-semibold leading-snug">
            {preview.productName || 'Product'}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            Order ID: {preview.orderId}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Quantity</dt>
        <dd className="text-right font-medium">{preview.quantity}</dd>
        <dt className="text-muted-foreground">Unit price</dt>
        <dd className="text-right font-medium">{preview.unitPrice.toFixed(2)} USD</dd>
        <dt className="text-muted-foreground">Total</dt>
        <dd className="text-right font-semibold">{preview.totalAmount.toFixed(2)} USD</dd>
        <dt className="text-muted-foreground">Status</dt>
        <dd className="text-right font-medium">{preview.status || 'Unknown'}</dd>
      </dl>
    </div>
  )
}

function ProductPreviewCard({
  preview,
  fallbackText,
  fromMe,
}: {
  preview: UiProductPreview | null | undefined
  fallbackText: string
  fromMe: boolean
}) {
  const cardTone = fromMe
    ? 'border-primary-foreground/25 bg-background text-foreground'
    : 'border-border bg-background'

  if (!preview) {
    return <p className="whitespace-pre-wrap text-sm">{fallbackText || 'Product'}</p>
  }

  return (
    <div className={`flex gap-2 rounded-xl border p-3 text-left text-sm ${cardTone}`}>
      {preview.productImageUrl ? (
        <img
          src={preview.productImageUrl}
          alt=""
          className="h-14 w-14 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-md bg-muted" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">Product</p>
        <p className="line-clamp-2 font-semibold leading-snug">
          {preview.productName || 'Product'}
        </p>
        {preview.slug ? (
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            /products/{preview.slug}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function MessageList({
  messages,
  peerInitials,
  peerLastReadAt = null,
}: {
  messages: UiChatMessage[]
  peerInitials: string
  peerLastReadAt?: Date | null
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [])

  useLayoutEffect(() => {
    scrollToBottom()
    let cancelled = false
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return
      scrollToBottom()
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) scrollToBottom()
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [messages, scrollToBottom])

  useLayoutEffect(() => {
    const el = containerRef.current
    const content = contentRef.current
    if (!el || !content || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      scrollToBottom()
    })
    ro.observe(content)
    return () => ro.disconnect()
  }, [scrollToBottom])

  const rows = useMemo(() => {
    const out: Array<
      | { kind: 'divider'; key: string; label: string }
      | { kind: 'msg'; key: string; msg: UiChatMessage }
    > = []
    let lastDayKey = ''
    for (const msg of messages) {
      const dayKey = `${msg.createdAt.getFullYear()}-${msg.createdAt.getMonth()}-${msg.createdAt.getDate()}`
      if (dayKey !== lastDayKey) {
        lastDayKey = dayKey
        out.push({
          kind: 'divider',
          key: `d-${dayKey}`,
          label: formatDividerLabel(msg.createdAt),
        })
      }
      out.push({ kind: 'msg', key: msg.id, msg })
    }
    return out
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4"
    >
      <div ref={contentRef} className="flex min-h-full min-w-0 flex-col justify-end gap-4">
        {rows.map((row) => {
          if (row.kind === 'divider') {
            return (
              <div key={row.key} className="flex items-center gap-4 py-2">
                <div className="flex-1 border-t" />
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {row.label}
                </span>
                <div className="flex-1 border-t" />
              </div>
            )
          }

          const msg = row.msg
          const readByPeer =
            Boolean(msg.fromMe) &&
            Boolean(peerLastReadAt) &&
            peerLastReadAt!.getTime() >= msg.createdAt.getTime()

          return (
            <div
              key={row.key}
              className={`flex gap-2 ${msg.fromMe ? 'flex-row-reverse' : ''}`}
            >
              {!msg.fromMe ? (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-muted text-xs">
                    {peerInitials}
                  </AvatarFallback>
                </Avatar>
              ) : null}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.fromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {msg.type === 'image' && msg.imageUrl ? (
                  <img
                    src={msg.imageUrl}
                    alt=""
                    className="mb-2 max-h-48 w-auto max-w-full rounded-lg object-contain"
                  />
                ) : msg.type === 'image' ? (
                  <div className="mb-2 h-32 rounded-lg bg-muted-foreground/20" />
                ) : msg.type === 'order' ? (
                  <OrderPreviewCard
                    preview={msg.orderPreview}
                    fallbackText={msg.text}
                    fromMe={msg.fromMe}
                  />
                ) : msg.type === 'product' ? (
                  <ProductPreviewCard
                    preview={msg.productPreview}
                    fallbackText={msg.text}
                    fromMe={msg.fromMe}
                  />
                ) : null}

                {msg.type !== 'order' && msg.type !== 'product' && msg.text ? (
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                ) : null}

                <p
                  className={`mt-1 flex items-center justify-end gap-0.5 text-xs ${
                    msg.fromMe
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground'
                  }`}
                >
                  {formatTime(msg.createdAt)}
                  {msg.fromMe ? (
                    msg.sendStatus === 'sending' ? (
                      <Loader2Icon className="h-3 w-3 animate-spin" />
                    ) : readByPeer ? (
                      <CheckCheckIcon className="h-3 w-3" />
                    ) : (
                      <CheckIcon className="h-3 w-3" />
                    )
                  ) : null}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
