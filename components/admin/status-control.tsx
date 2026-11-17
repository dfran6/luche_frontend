'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateOrderStatus, updateAppointmentStatus } from '@/app/admin/record-actions'
import type { OrderStatus, AppointmentStatus } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'fulfilled',
  'cancelled',
]

const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'requested',
  'confirmed',
  'completed',
  'cancelled',
]

export function OrderStatusControl({
  id,
  status,
  paymentStatus,
}: {
  id: string
  status: OrderStatus
  paymentStatus: string
}) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  return (
    <div>
    <Select
      value={status}
      onValueChange={(v) =>
        startTransition(async () => {
          setError('')
          const result = await updateOrderStatus(id, v as OrderStatus)
          if (result.ok) { toast.success('Order status updated.'); router.refresh() }
          else { setError(result.error); toast.error(result.error) }
        })
      }
    >
      <SelectTrigger
        className="h-8 w-[140px] text-xs capitalize"
        data-pending={pending}
        disabled={pending || status === 'fulfilled' || status === 'cancelled'}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.filter((s) => {
          const paid = ['paid', 'partially_refunded', 'refunded'].includes(paymentStatus)
          return paid ? true : s === 'pending' || s === 'cancelled'
        }).filter((s) => s !== 'cancelled' || !['paid', 'partially_refunded', 'refunded'].includes(paymentStatus)).map((s) => (
          <SelectItem key={s} value={s} className="text-xs capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p role="alert" className="mt-1 max-w-52 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function AppointmentStatusControl({
  id,
  status,
}: {
  id: string
  status: AppointmentStatus
}) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(status)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    setSelectedStatus(status)
  }, [status])

  function handleStatusChange(value: string) {
    const nextStatus = value as AppointmentStatus
    const previousStatus = selectedStatus
    setSelectedStatus(nextStatus)
    setError('')

    startTransition(async () => {
      const result = await updateAppointmentStatus(id, nextStatus)
      if (result.ok) {
        toast.success(`Appointment ${nextStatus === 'cancelled' ? 'cancelled' : 'status updated'}.`)
        router.refresh()
      } else {
        setSelectedStatus(previousStatus)
        setError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <div>
    <Select
      value={selectedStatus}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger
        className="h-8 w-[140px] text-xs capitalize"
        data-pending={pending}
        disabled={pending}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {APPOINTMENT_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p role="alert" className="mt-1 max-w-52 text-xs text-destructive">{error}</p>}
    </div>
  )
}
