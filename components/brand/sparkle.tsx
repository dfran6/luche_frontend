import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The four-point star from the LUCHÉ logo. Fills with currentColor.
 */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="-1 -1 2 2" aria-hidden="true" className={cn('size-4 shrink-0 fill-current', className)}>
      <path d="M0 -1C0.09 -0.3 0.3 -0.09 1 0C0.3 0.09 0.09 0.3 0 1C-0.09 0.3 -0.3 0.09 -1 0C-0.3 -0.09 -0.09 -0.3 0 -1Z" />
    </svg>
  )
}

/**
 * The logo's rule-and-star divider: hairline, sparkle, hairline.
 * Pass children to set a short line of text in place of the sparkle.
 */
export function SparkleDivider({
  className,
  align = 'center',
  children,
}: {
  className?: string
  align?: 'center' | 'start'
  children?: ReactNode
}) {
  return (
    <div
      role="presentation"
      className={cn(
        'flex items-center gap-3 text-accent',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      {align === 'center' ? <span className="h-px w-12 bg-current opacity-60 sm:w-20" /> : null}
      {children ?? <Sparkle className="size-3.5" />}
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
    </div>
  )
}
