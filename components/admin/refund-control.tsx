'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { refundAppointment, refundOrder } from '@/app/admin/record-actions'

export function RefundControl({ id, kind }: { id: string; kind: 'order' | 'appointment' }) {
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  return <div className="flex flex-col items-start gap-1">
    <button type="button" disabled={pending} onClick={() => {
      if (!window.confirm('Issue a full refund for the remaining paid amount?')) return
      startTransition(async () => {
        setError('')
        const result = kind === 'order' ? await refundOrder(id) : await refundAppointment(id)
        if (result.ok) { toast.success('Refund request submitted.'); router.refresh() }
        else { setError(result.error); toast.error(result.error) }
      })
    }} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50">
      {pending ? 'Refunding…' : 'Refund remaining balance'}
    </button>
    {error && <p role="alert" className="max-w-60 text-xs text-destructive">{error}</p>}
  </div>
}
