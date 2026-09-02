import { cn } from '@/lib/utils'

type LoadingDotsProps = {
  label?: string
  className?: string
}

export function LoadingDots({ label = '잠시만 기다려주세요', className }: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center gap-2.5 text-base text-ink-soft', className)}>
      <span className="flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-teal" />
      </span>
      {label}
    </div>
  )
}
