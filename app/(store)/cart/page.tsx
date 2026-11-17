import type { Metadata } from 'next'
import { CartView } from '@/components/cart/cart-view'

export const metadata: Metadata = {
  title: 'Your Shopping Bag',
  description: 'Review the items in your Luché shopping bag.',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-4xl text-foreground sm:text-5xl">Your bag</h1>
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  )
}
