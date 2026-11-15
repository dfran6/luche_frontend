'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import { placeOrder } from '@/lib/store/actions'
import { whatsappOrderUrl } from '@/lib/whatsapp'

export function CheckoutForm() {
  const { lines, subtotal, clear } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [orderLink, setOrderLink] = useState<{
    number: string
    url: string
    items: { product_name: string; variant_label?: string | null; quantity: number; unit_price: string }[]
    subtotalCents: number
    customer: { name: string; email: string; phone: string; address: string }
  } | null>(null)

  if (orderLink) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-12 text-center">
      <h2 className="font-display text-2xl text-foreground">Order {orderLink.number} is ready</h2>
      <p className="mt-2 text-sm text-muted-foreground">Order receipt · Payment not yet received</p>
      <div className="mt-6 rounded-lg border border-border p-4 text-left">
        <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Customer</span><span>{orderLink.customer.name}</span></div>
        <div className="mt-2 flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Email</span><span>{orderLink.customer.email}</span></div>
        <p className="mt-2 text-sm"><span className="text-muted-foreground">Deliver to</span><br />{orderLink.customer.address}</p>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {orderLink.items.map((item, index) => <li key={`${item.product_name}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.quantity} × {item.product_name}{item.variant_label ? ` (${item.variant_label})` : ''}</span><span className="shrink-0">{formatPrice(Number(item.unit_price) * item.quantity * 100)}</span></li>)}
        </ul>
        <div className="mt-4 flex justify-between text-sm"><span>Items subtotal</span><span>{formatPrice(orderLink.subtotalCents)}</span></div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>Delivery and tax</span><span>To confirm on WhatsApp</span></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">A copy of this receipt will be sent to your email. Continue on WhatsApp to confirm availability, delivery, taxes, and payment.</p>
      <a href={orderLink.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Continue on WhatsApp</a>
      <p className="mt-4 text-xs text-muted-foreground">Keep order reference {orderLink.number} for any questions.</p>
    </div>
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-20 text-center">
        <p className="text-muted-foreground">Your bag is empty.</p>
        <Button render={<Link href="/shop" />} className="mt-5">
          Go to shop
        </Button>
      </div>
    )
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '')
    const email = String(form.get('email') ?? '')
    const phone = String(form.get('phone') ?? '')
    const shippingAddress = {
      line1: String(form.get('address_line1') ?? ''),
      line2: String(form.get('address_line2') ?? ''),
      city: String(form.get('city') ?? ''),
      province: String(form.get('province') ?? ''),
      postalCode: String(form.get('postal_code') ?? ''),
    }
    startTransition(async () => {
      const result = await placeOrder(
        { name, email, phone, shippingAddress },
        lines.map((l) => ({
          slug: l.slug,
          combinationId: l.combinationId,
          quantity: l.quantity,
          variantLabel: l.variantLabel,
        })),
      )
      if (result.ok) {
        const url = whatsappOrderUrl(lines, result.orderNumber, { name, email, phone, address: shippingAddress }, {
          items: result.items,
          subtotalCents: result.productTotalCents,
        })
        clear()
        setOrderLink({
          number: result.orderNumber,
          url,
          items: result.items,
          subtotalCents: result.productTotalCents,
          customer: {
            name,
            email,
            phone,
            address: [shippingAddress.line1, shippingAddress.line2, shippingAddress.city, shippingAddress.province, shippingAddress.postalCode, 'Canada'].filter(Boolean).join(', '),
          },
        })
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-xl text-foreground">Contact details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required autoComplete="name" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone">WhatsApp number</Label>
              <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-1.5" placeholder="+1 416 555 0100" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Canadian delivery address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="address_line1">Street address</Label><Input id="address_line1" name="address_line1" required autoComplete="address-line1" className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label htmlFor="address_line2">Apartment, suite, etc. (optional)</Label><Input id="address_line2" name="address_line2" autoComplete="address-line2" className="mt-1.5" /></div>
            <div><Label htmlFor="city">City</Label><Input id="city" name="city" required autoComplete="address-level2" className="mt-1.5" /></div>
            <div><Label htmlFor="province">Province or territory</Label><Input id="province" name="province" required autoComplete="address-level1" className="mt-1.5" /></div>
            <div><Label htmlFor="postal_code">Postal code</Label><Input id="postal_code" name="postal_code" required autoComplete="postal-code" className="mt-1.5" /></div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">Next step</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will confirm delivery cost, applicable taxes, and payment details with you on WhatsApp.
          </p>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-foreground">Your order</h2>
        <ul className="mt-5 space-y-4">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                <Image
                  src={line.image || '/placeholder.svg'}
                  alt={line.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                  {line.quantity}
                </span>
              </div>
              <div className="flex flex-1 justify-between gap-2">
                <div>
                  <p className="text-sm font-medium leading-tight text-foreground">{line.name}</p>
                  {line.variantLabel ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{line.variantLabel}</p>
                  ) : null}
                </div>
                <p className="text-sm text-foreground">
                  {formatPrice(line.unitPrice * line.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="font-medium text-foreground">Items subtotal</dt>
            <dd className="font-display text-lg text-foreground">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        {error ? (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={isPending}>
          {isPending ? 'Creating your order…' : 'Create order and continue on WhatsApp'}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Your order will be saved so our team can prepare and confirm it.
        </p>
      </aside>
    </form>
  )
}
