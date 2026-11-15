import { cn } from '@/lib/utils'
import type { OrderStatus, AppointmentStatus } from '@/lib/types'

const STYLES: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  requested: 'bg-muted text-muted-foreground',
  processing: 'bg-gold/15 text-gold-foreground',
  confirmed: 'bg-gold/15 text-gold-foreground',
  shipped: 'bg-accent/15 text-accent',
  fulfilled: 'bg-success/15 text-success',
  completed: 'bg-success/15 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
}

export function StatusBadge({ status }: { status: OrderStatus | AppointmentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        STYLES[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {status}
    </span>
  )
}
