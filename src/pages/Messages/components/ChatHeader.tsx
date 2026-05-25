import type { ReactNode } from 'react'
import { InfoIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function ChatHeader({
  peerName,
  peerImageUrl,
  peerActive = false,
  conversationListTrigger,
}: {
  peerName: string
  peerImageUrl?: string | null
  peerActive?: boolean
  conversationListTrigger?: ReactNode
}) {
  const displayName = peerName.trim() || '…'
  const initials = displayName.slice(0, 2).toUpperCase()
  const showImage =
    typeof peerImageUrl === 'string' && peerImageUrl.trim().length > 0

  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b bg-card/95 p-2 backdrop-blur supports-backdrop-filter:bg-card/80 sm:p-3 md:static md:z-0 md:bg-transparent md:backdrop-blur-none">
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        {conversationListTrigger ? (
          <div className="shrink-0 md:hidden">{conversationListTrigger}</div>
        ) : null}

        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 shrink-0">
            {showImage ? <AvatarImage src={peerImageUrl!.trim()} alt="" /> : null}
            <AvatarFallback className="bg-primary/20 text-sm font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          {peerActive ? (
            <span
              className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
              aria-label="Active in chat"
              title="Active in chat"
            />
          ) : null}
        </div>

        <div
          className={cn(
            'min-w-0',
            conversationListTrigger ? 'hidden md:block' : null,
          )}
        >
          <p className="truncate font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">Admin direct chat</p>
        </div>
      </div>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Chat info"
            />
          }
        >
          <InfoIcon className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent align="end" side="bottom" sideOffset={8} className="w-80">
          <PopoverHeader>
            <PopoverTitle>Admin chat guidelines</PopoverTitle>
            <PopoverDescription>
              Admins can review and respond in chat. Order placement is not available
              from this panel.
            </PopoverDescription>
          </PopoverHeader>
          <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            <li>Use this panel for direct admin messaging with users.</li>
            <li>Images can be shared in chat when needed.</li>
            <li>Orders can be viewed in messages, but not created here.</li>
          </ul>
        </PopoverContent>
      </Popover>
    </header>
  )
}
