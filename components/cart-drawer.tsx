'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { DeliveryPolicy } from '@/components/delivery-policy'

export function CartDrawer() {
  const { lines, isOpen, setOpen, subtotal, count, setQty, remove } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-dvh w-full min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-2xl font-normal">
            Your Bag {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-xl">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover premium braiding hair and care essentials.
              </p>
            </div>
            <Button render={<Link href="/shop" />} size="lg" className="rounded-full px-6" onClick={() => setOpen(false)}>
              Shop the collection
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ul className="divide-y divide-border px-6">
                {lines.map((line) => (
                  <li key={line.key} className="flex gap-4 py-5">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={line.image || '/placeholder.svg'}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/shop/${line.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-pretty text-sm font-medium leading-snug hover:text-accent"
                        >
                          {line.name}
                        </Link>
                        <button
                          onClick={() => remove(line.key)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${line.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      {line.variantLabel && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{line.variantLabel}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => setQty(line.key, line.quantity - 1)}
                            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                            disabled={line.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                          <button
                            onClick={() => setQty(line.key, line.quantity + 1)}
                            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(line.unitPrice * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="mt-0 shrink-0 border-t border-border bg-popover px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl">{formatPrice(subtotal)}</span>
              </div>
              <DeliveryPolicy className="mb-3" />
              <Button
                render={<Link href="/checkout" />}
                size="lg"
                className="w-full rounded-full"
                onClick={() => setOpen(false)}
              >
                Checkout
              </Button>
              <Button
                variant="ghost"
                className="h-10 w-full"
                onClick={() => setOpen(false)}
              >
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
