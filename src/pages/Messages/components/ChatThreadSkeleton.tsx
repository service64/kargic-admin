import { Skeleton } from '@/components/ui/skeleton'

export function ChatThreadSkeleton() {
  const rows = [
    { align: 'start' as const, w: 'w-[58%]' },
    { align: 'end' as const, w: 'w-[42%]' },
    { align: 'start' as const, w: 'w-[72%]' },
    { align: 'end' as const, w: 'w-[48%]' },
    { align: 'start' as const, w: 'w-[64%]' },
    { align: 'end' as const, w: 'w-[52%]' },
  ]

  return (
    <div
      className="min-h-0 flex-1 overflow-hidden p-4"
      aria-busy="true"
      aria-label="Loading messages"
    >
      <div className="flex min-h-full min-w-0 flex-col justify-end gap-4">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex gap-2 ${row.align === 'end' ? 'flex-row-reverse' : ''}`}
          >
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton
              className={`h-14 max-w-[75%] shrink-0 rounded-2xl ${row.w}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
