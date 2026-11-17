'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { updateOrderTotals } from '@/app/admin/record-actions'
import { SYDNEY_FLAT_FEE_CENTS, SYDNEY_FLAT_FEE_LABEL } from '@/lib/delivery'

export function OrderTotalsForm({ id, deliveryFee, taxTotal, paymentStatus, deliveryMethod }: {
  id: string
  deliveryFee: number
  taxTotal: number
  paymentStatus: string
  deliveryMethod?: string
}) {
  const router = useRouter()
  const [delivery, setDelivery] = useState(String(deliveryFee))
  const [tax, setTax] = useState(String(taxTotal))
  const [pending, startTransition] = useTransition()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const deliveryValue = deliveryMethod === 'pickup' ? 0 : Number(delivery)
    const taxValue = Number(tax)
    if (!Number.isFinite(deliveryValue) || deliveryValue < 0 || !Number.isFinite(taxValue) || taxValue < 0) {
      toast.error('Enter valid non-negative delivery and tax amounts.')
      return
    }
    startTransition(async () => {
      const result = await updateOrderTotals(id, deliveryValue, taxValue)
      if (result.ok) { toast.success('Order totals updated.'); router.refresh() }
      else toast.error(result.error)
    })
  }

  if (paymentStatus !== 'unpaid') return null
  return <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
    <label className="grid gap-1 text-xs text-muted-foreground">Delivery (CAD)<input type="number" min="0" step="0.01" value={deliveryMethod === 'pickup' ? '0.00' : delivery} disabled={deliveryMethod === 'pickup'} onChange={(event) => setDelivery(event.target.value)} className="w-32 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground disabled:opacity-60" /></label>
    <label className="grid gap-1 text-xs text-muted-foreground">Tax total (CAD)<input type="number" min="0" step="0.01" value={tax} onChange={(event) => setTax(event.target.value)} className="w-32 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground" /></label>
    <Button size="sm" type="button" variant="ghost" onClick={() => setDelivery((SYDNEY_FLAT_FEE_CENTS / 100).toFixed(2))}>Use Sydney fee ({SYDNEY_FLAT_FEE_LABEL})</Button>
    <Button size="sm" type="submit" variant="outline" disabled={pending}>{pending ? 'Saving…' : 'Save delivery and tax'}</Button>
    <p className="w-full text-xs text-muted-foreground">Delivery within Sydney is a flat {SYDNEY_FLAT_FEE_LABEL}. Outside Sydney, enter the actual shipping cost. Add tax once confirmed with the customer.</p>
  </form>
}
