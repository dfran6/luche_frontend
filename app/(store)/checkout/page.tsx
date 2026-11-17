import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { SparkleDivider } from '@/components/brand/sparkle'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Place your order, then confirm delivery, taxes and payment with Luché on WhatsApp.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <CheckoutForm
        header={
          <div className="mb-10">
            <h1 className="text-balance font-display text-4xl text-foreground sm:text-5xl">Checkout</h1>
            <SparkleDivider align="start" className="mt-4" />
            <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
              Enter your details to place the order. You&apos;ll then confirm delivery, taxes and payment with us on WhatsApp.
            </p>
          </div>
        }
      />
    </div>
  )
}
