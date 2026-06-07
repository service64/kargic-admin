import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, CheckIcon, RefreshCcwIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminContactMessages } from '@/hooks/api/contact/useAdminContactMessages'
import { useMarkContactMessagesRead } from '@/hooks/api/contact/useMarkContactMessagesRead'
import type { AdminContactMessageDto } from '@/hooks/api/contact/types'

const PAGE_SIZE = 10

function formatDateTime(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function MessageDetailRow({
  message,
  onMarkRead,
  isMarkingRead,
}: {
  message: AdminContactMessageDto
  onMarkRead: (messageId: string) => void
  isMarkingRead: boolean
}) {
  return (
    <TableRow className={message.isRead ? undefined : 'bg-emerald-50/60 dark:bg-emerald-950/20'}>
      <TableCell className="align-top whitespace-nowrap">
        {formatDateTime(message.createdAt)}
      </TableCell>
      <TableCell className="align-top">
        <div className="space-y-1">
          <p className="font-medium">{message.name}</p>
          <p className="text-muted-foreground text-xs">{message.phone}</p>
          <p className="text-muted-foreground text-xs">{message.userType}</p>
        </div>
      </TableCell>
      <TableCell className="align-top max-w-xl">
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
      </TableCell>
      <TableCell className="align-top text-right">
        <div className="flex flex-col items-end gap-2">
          {message.isRead ? (
            <Badge variant="secondary">Read</Badge>
          ) : (
            <Badge className="bg-amber-500 hover:bg-amber-500">Unread</Badge>
          )}
          {!message.isRead ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isMarkingRead}
              onClick={() => onMarkRead(message._id)}
            >
              <CheckIcon className="size-3.5" />
              Mark as read
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const contactId = id ?? null
  const [page, setPage] = React.useState(1)

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAdminContactMessages(contactId, { page, limit: PAGE_SIZE })

  const { mutate: markMessagesRead, isPending: isMarkingRead } =
    useMarkContactMessagesRead(contactId ?? '')

  React.useEffect(() => {
    setPage(1)
  }, [contactId])

  const unreadOnPage = React.useMemo(
    () => data?.data.filter((msg) => !msg.isRead) ?? [],
    [data?.data],
  )

  const handleMarkRead = React.useCallback(
    (messageId: string) => {
      markMessagesRead({ messageIds: [messageId] })
    },
    [markMessagesRead],
  )

  const handleMarkAllOnPageRead = React.useCallback(() => {
    const unreadIds = unreadOnPage.map((msg) => msg._id)
    if (unreadIds.length === 0) return
    markMessagesRead({ messageIds: unreadIds })
  }, [markMessagesRead, unreadOnPage])

  const meta = data?.meta

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-3 -ml-2" render={<Link to="/contacts" />}>
            <ArrowLeftIcon className="size-4" />
            Back to contacts
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {data?.email ?? 'Contact details'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {data
              ? `${data.newUnreadCount} unread · ${data.hasNewMessage ? 'Has new messages' : 'All caught up'}`
              : 'Loading thread…'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadOnPage.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={isMarkingRead}
              onClick={handleMarkAllOnPageRead}
            >
              <CheckIcon className="size-4" />
              Mark page as read ({unreadOnPage.length})
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCcwIcon
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-destructive p-8 text-center text-sm">
            {(error as Error)?.message ?? 'Failed to load messages'}
          </p>
        ) : !data?.data?.length ? (
          <p className="text-muted-foreground p-12 text-center text-sm">
            No messages in this thread.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((message) => (
                <MessageDetailRow
                  key={message._id}
                  message={message}
                  onMarkRead={handleMarkRead}
                  isMarkingRead={isMarkingRead}
                />
              ))}
            </TableBody>
          </Table>
        )}

        {meta && meta.totalPage > 1 ? (
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-muted-foreground text-sm">
              Page {meta.page} of {meta.totalPage} ({meta.total} messages)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
