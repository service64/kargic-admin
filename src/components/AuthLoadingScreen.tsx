import { Loader2Icon } from 'lucide-react'

/** Shown while auth state is not yet rehydrated from storage (e.g. SSR handoff). */
export function AuthLoadingScreen() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2Icon
        className="size-8 animate-spin text-muted-foreground"
        aria-hidden
      />
      <span className="sr-only">Loading session…</span>
    </div>
  )
}
