'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import { DeliveryPolicy } from '@/components/delivery-policy'

export function CartView() {
  const { lines, subtotal, setQty, remove } = useCart()

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-7 text-accent" />
        </div>
        <h2 className="mt-6 font-display text-2xl text-foreground">Your bag is empty</h2>
        <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
          Discover premium braiding hair, care and accessories curated by our stylists.
        </p>
        <Button render={<Link href="/shop" />} size="lg" className="mt-6 rounded-full px-6">
          Shop the collection
        </Button>
      </div>
    )
  }


  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-border border-y border-border">
        {lines.map((line) => (
          <li key={line.key} className="flex gap-4 py-6">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
              <Image
                src={line.image || '/placeholder.svg'}
                alt={line.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <Link
                    href={`/shop/${line.slug}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {line.name}
                  </Link>
                  {line.variantLabel ? (
                    <p className="mt-1 text-sm text-muted-foreground">{line.variantLabel}</p>
                  ) : null}
                </div>
                <p className="font-medium text-foreground">
                  {formatPrice(line.unitPrice * line.quantity)}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty(line.key, line.quantity - 1)}
                    className="grid size-9 place-items-center text-foreground transition-colors hover:text-accent"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty(line.key, line.quantity + 1)}
                    className="grid size-9 place-items-center text-foreground transition-colors hover:text-accent"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(line.key)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-foreground">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-baseline justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-display text-xl text-foreground">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <DeliveryPolicy className="mt-4 border-t border-border pt-4" />
        <Button render={<Link href="/checkout" />} size="lg" className="mt-6 w-full rounded-full">
          Checkout
        </Button>
        <Button render={<Link href="/shop" />} variant="ghost" className="mt-2 h-10 w-full">
          Continue shopping
        </Button>
      </aside>
    </div>
  )
}
