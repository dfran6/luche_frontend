'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import { getCheckoutPaymentStatus, type CheckoutPaymentStatus } from '@/lib/store/actions'

export function BookingSuccess({ sessionId }: { sessionId: string | null }) {
  const [result, setResult] = useState<CheckoutPaymentStatus | null>(null)
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  function check() {
    if (!sessionId) return setError(true)
    setError(false)
    startTransition(async () => {
      const payment = await getCheckoutPaymentStatus(sessionId)
      if (!payment) return setError(true)
      setResult(payment)
    })
  }

  useEffect(() => {
    check()
    // Reconcile payment status with the backend for this Checkout Session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const paid = result?.payment_status === 'paid'
  const failed = ['failed', 'expired'].includes(result?.payment_status ?? '')

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-10">
      <h1 className="font-display text-3xl text-foreground">
        {paid ? 'Appointment payment received' : failed ? 'Booking was not completed' : 'Checking your payment'}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {paid ? 'Your appointment is booked. A receipt will be sent to your email.' : failed ? 'The payment was not completed. Please return to booking and try again.' : 'Stripe is confirming your appointment payment.'}
      </p>
      {paid && result ? <dl className="mx-auto mt-6 max-w-xs space-y-2 text-sm"><div className="flex justify-between"><dt>Service</dt><dd>{formatPrice(result.subtotal)}</dd></div><div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(result.tax)}</dd></div><div className="flex justify-between border-t border-border pt-2 font-medium"><dt>Total paid</dt><dd>{formatPrice(result.total)}</dd></div></dl> : null}
      {error ? <p className="mt-4 text-sm text-destructive">Could not retrieve payment status. Try again shortly.</p> : null}
      <div className="mt-8 flex justify-center gap-3">
        {!paid ? <Button onClick={check} disabled={pending}>{pending ? 'Checking...' : 'Check payment status'}</Button> : null}
        <Button render={<Link href="/book" />} variant={paid ? 'default' : 'outline'}>Back to booking</Button>
      </div>
    </div>
  )
}
