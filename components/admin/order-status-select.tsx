'use client'

import { useTransition } from 'react'
import { setOrderStatus } from '@/lib/store/actions'
import type { OrderStatus } from '@/lib/types'

const OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'fulfilled', 'cancelled']

export function OrderStatusSelect({
  id,
  status,
}: {
  id: string
  status: OrderStatus
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      aria-label={`Update status for order ${id}`}
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus
        startTransition(() => setOrderStatus(id, next))
      }}
      className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium capitalize text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
    >
      {OPTIONS.map((option) => (
        <option key={option} value={option} className="capitalize">
          {option}
        </option>
      ))}
    </select>
  )
}
