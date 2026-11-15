'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import { getCheckoutPaymentStatus, type CheckoutPaymentStatus } from '@/lib/store/actions'

export function CheckoutSuccess({ sessionId }: { sessionId: string | null }) {
  const { clear } = useCart()
  const [result, setResult] = useState<CheckoutPaymentStatus | null>(null)
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()

  function checkPayment() {
    if (!sessionId) {
      setError(true)
      return
    }
    setError(false)
    startTransition(async () => {
      const status = await getCheckoutPaymentStatus(sessionId)
      if (!status) {
        setError(true)
        return
      }
      setResult(status)
      if (status.payment_status === 'paid') clear()
    })
  }

  useEffect(() => {
    checkPayment()
    // Read and reconcile this Stripe Checkout Session once on return.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const paid = result?.payment_status === 'paid'
  const failed = result?.payment_status === 'failed' || result?.payment_status === 'expired'

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-10">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent/15">
        {paid ? <CheckCircle2 className="size-8 text-accent" /> : failed ? <XCircle className="size-8 text-destructive" /> : <Clock3 className="size-8 text-accent" />}
      </div>
      <h1 className="mt-6 font-display text-3xl text-foreground">
        {paid ? 'Payment received' : failed ? 'Checkout was not completed' : 'Checking your payment'}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {paid
          ? `Order ${result.order_number} is confirmed. A receipt will be sent to your email.`
          : failed
            ? 'Your payment was not completed. Your bag is still saved so you can try again.'
            : 'Stripe is confirming your payment. This page checks the current status with the payment provider.'}
      </p>

      {paid && result ? (
        <dl className="mx-auto mt-8 max-w-sm space-y-2 border-y border-border py-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd>{formatPrice(result.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{formatPrice(result.shipping)}</dd></div>
          {result.tax_breakdown.taxes?.length ? result.tax_breakdown.taxes.map((tax, index) => (
            <div className="flex justify-between" key={`${tax.rate?.display_name ?? 'tax'}-${index}`}>
              <dt className="text-muted-foreground">{tax.rate?.display_name ?? 'Sales tax'}{tax.rate?.percentage != null ? ` (${tax.rate.percentage}%)` : ''}</dt>
              <dd>{formatPrice(tax.amount)}</dd>
            </div>
          )) : <div className="flex justify-between"><dt className="text-muted-foreground">Applicable sales tax</dt><dd>{formatPrice(result.tax)}</dd></div>}
          <div className="flex justify-between pt-2 font-medium"><dt>Total paid</dt><dd>{formatPrice(result.total)}</dd></div>
        </dl>
      ) : null}

      {error ? <p className="mt-5 text-sm text-destructive">We couldn&apos;t retrieve the payment status. You can check again shortly.</p> : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!paid ? <Button onClick={checkPayment} disabled={isPending}>{isPending ? 'Checking...' : 'Check payment status'}</Button> : null}
        <Button render={<Link href="/shop" />} variant={paid ? 'default' : 'outline'}>Continue shopping</Button>
      </div>
    </div>
  )
}
