import { useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { usePeerUsers, type ChatPeerRow } from '@/hooks/api/chat/useChatMessaging'

function peerRoleLabel(row: ChatPeerRow): string {
  const role = row.peer?.activeRole
  if (role === 'EXPORTER') return 'Exporter'
  if (role === 'IMPORTER') return 'Importer'
  if (role === 'ADMIN') return 'Admin'
  return ''
}

function peerAvatarSrc(row: ChatPeerRow): string | null {
  const img = row.peer?.profileImage
  if (typeof img === 'string' && img.trim()) return img.trim()
  if (img && typeof img === 'object' && typeof img.url === 'string' && img.url.trim()) {
    return img.url.trim()
  }
  return null
}

function conversationSortTime(row: ChatPeerRow): number {
  if (!row.lastMessageAt) return 0
  const t = new Date(row.lastMessageAt).getTime()
  return Number.isNaN(t) ? 0 : t
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 rounded-lg border p-3">
          <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ConversationSidebar({
  inDrawer = false,
  onPeerPicked,
}: {
  inDrawer?: boolean
  onPeerPicked?: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const selectedPeerId = searchParams.get('peer')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: peerRows = [], isPending } = usePeerUsers()

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return [...peerRows]
      .sort((a, b) => conversationSortTime(b) - conversationSortTime(a))
      .filter((row) => {
        if (!q) return true
        const name = (row.peer?.name ?? '').toLowerCase()
        const role = peerRoleLabel(row).toLowerCase()
        const email = (row.peer?.email ?? '').toLowerCase()
        return name.includes(q) || role.includes(q) || email.includes(q)
      })
  }, [peerRows, searchQuery])

  const selectPeer = (peerUserId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('peer', peerUserId)
    navigate(`${location.pathname}?${params.toString()}`)
    onPeerPicked?.()
  }

  return (
    <aside
      className={
        inDrawer
          ? 'flex h-full w-full flex-1 flex-col overflow-hidden bg-muted/30'
          : 'flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/30'
      }
    >
      <div className="border-b p-3">
        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPending && peerRows.length === 0 ? (
          <SidebarSkeleton />
        ) : rows.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet.
          </p>
        ) : (
          rows.map((row) => {
            const title = row.peer?.name?.trim() || `…${row.peerUserId.slice(-6)}`
            const subtitle = peerRoleLabel(row)
            const avatarSrc = peerAvatarSrc(row)

            return (
              <button
                key={row.peerUserId}
                type="button"
                onClick={() => selectPeer(row.peerUserId)}
                className={`flex w-full items-center gap-3 border-b p-3 text-left transition-colors hover:bg-muted/50 ${
                  selectedPeerId === row.peerUserId ? 'bg-primary/10' : ''
                }`}
              >
                <div className="relative h-11 w-11 shrink-0">
                  <Avatar className="h-11 w-11">
                    {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
                    <AvatarFallback className="bg-primary/20 text-sm font-medium text-primary">
                      {title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {row.peer?.liveActive ? (
                    <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-muted/40" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {subtitle || row.peer?.email || 'Direct chat'}
                  </p>
                </div>

                {(row.unreadCount ?? 0) > 0 ? (
                  <span className="ml-1 shrink-0 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-semibold text-destructive-foreground ring-2 ring-background">
                    {(row.unreadCount ?? 0) > 99 ? '99+' : row.unreadCount}
                  </span>
                ) : null}
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
