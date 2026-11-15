import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout/checkout-form'

export const metadata: Metadata = {
  title: 'Order details — Luché',
  description: 'Confirm your order details and continue to WhatsApp.',
}

export default function CheckoutPage() {
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <h1 className="font-display text-4xl text-foreground sm:text-5xl">Order details</h1>
    <p className="mt-3 text-sm text-muted-foreground">Add your contact details to save your order and continue in WhatsApp.</p>
    <div className="mt-10"><CheckoutForm /></div>
  </div>
}
