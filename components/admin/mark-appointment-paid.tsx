'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { markAppointmentPaid } from '@/app/admin/record-actions'

export function MarkAppointmentPaid({ id, paymentStatus }: { id: string; paymentStatus: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  if (paymentStatus !== 'unpaid') return null

  return <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(async () => {
    const result = await markAppointmentPaid(id)
    if (result.ok) { toast.success('Appointment payment marked as received.'); router.refresh() }
    else toast.error(result.error)
  })}>{pending ? 'Saving…' : 'Mark paid'}</Button>
}
