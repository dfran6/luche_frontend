'use client'

import { useTransition } from 'react'
import { setAppointmentStatus } from '@/lib/store/actions'
import type { AppointmentStatus } from '@/lib/types'

const OPTIONS: AppointmentStatus[] = ['requested', 'confirmed', 'completed', 'cancelled']

export function AppointmentStatusSelect({
  id,
  status,
}: {
  id: string
  status: AppointmentStatus
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      aria-label={`Update status for appointment ${id}`}
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as AppointmentStatus
        startTransition(() => setAppointmentStatus(id, next))
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
