import { cn } from '@/lib/utils'
import { SYDNEY_FLAT_FEE_LABEL } from '@/lib/delivery'

/** Short, consistent statement of how orders are delivered. */
export function DeliveryPolicy({ className }: { className?: string }) {
  return (
    <ul className={cn('space-y-1.5 text-xs leading-relaxed text-muted-foreground', className)}>
      <li>
        <span className="font-medium text-foreground">Within Sydney:</span> flat {SYDNEY_FLAT_FEE_LABEL} delivery.
      </li>
      <li>
        <span className="font-medium text-foreground">Outside Sydney:</span> you pay the actual shipping cost.
      </li>
      <li>Taxes are confirmed on WhatsApp.</li>
    </ul>
  )
}
