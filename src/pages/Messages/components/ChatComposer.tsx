import { useEffect, useRef } from 'react'
import { ImagePlusIcon, SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ChatComposer({
  value,
  onChange,
  onSendText,
  onPickImage,
  disabled,
  busy,
  errorMessage,
}: {
  value: string
  onChange: (value: string) => void
  onSendText: () => void
  onPickImage: (file: File) => void
  disabled?: boolean
  busy?: boolean
  errorMessage?: string | null
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [value])

  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t bg-card p-3">
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (f) onPickImage(f)
          }}
        />

        <Button
          variant="ghost"
          size="icon"
          type="button"
          disabled={disabled || busy}
          onClick={() => fileRef.current?.click()}
          aria-label="Attach image"
        >
          <ImagePlusIcon className="h-4 w-4" />
        </Button>

        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSendText()
            }
          }}
          placeholder="Type a message..."
          disabled={disabled || busy}
          className="min-h-9 flex-1 resize-none overflow-y-auto rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
        />

        <Button
          size="icon"
          type="button"
          className="shrink-0"
          onClick={onSendText}
          disabled={disabled || busy || !value.trim()}
          aria-label="Send message"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Admin chat supports text and image messages. Order placement is disabled here.
      </p>
    </footer>
  )
}
