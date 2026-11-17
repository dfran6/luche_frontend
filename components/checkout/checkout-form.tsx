'use client'

import { useState, useTransition, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SparkleDivider } from '@/components/brand/sparkle'
import { MarketingConsent } from '@/components/booking/marketing-consent'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import { placeOrder } from '@/lib/store/actions'
import { whatsappOrderUrl } from '@/lib/whatsapp'
import { DELIVERY_OPTIONS, getDeliveryOption, type DeliveryMethod } from '@/lib/delivery'
import { cn } from '@/lib/utils'

type Receipt = {
  number: string
  url: string
  items: { product_name: string; variant_label?: string | null; quantity: number; unit_price: string }[]
  subtotalCents: number
  delivery: DeliveryMethod
  customer: { name: string; email: string; phone: string; address: string }
}

function deliveryAmount(method: DeliveryMethod) {
  const option = getDeliveryOption(method)
  return option.feeCents == null ? 'Actual shipping cost, confirmed on WhatsApp' : formatPrice(option.feeCents)
}

/** `header` is the page heading; it is hidden once the receipt is shown. */
export function CheckoutForm({ header }: { header?: ReactNode }) {
  const { lines, subtotal, clear } = useCart()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [delivery, setDelivery] = useState<DeliveryMethod | null>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  if (receipt) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-5 py-10 sm:px-8 sm:py-12">
        <div className="text-center">
          <SparkleDivider />
          <h2 className="mt-5 font-display text-3xl text-foreground">Order {receipt.number} received</h2>
          <p className="mt-2 text-sm text-muted-foreground">Payment not yet received</p>
        </div>

        <div className="mt-7 rounded-lg border border-border p-4 text-left">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Customer</span>
            <span className="text-right">{receipt.customer.name}</span>
          </div>
          <div className="mt-2 flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="break-all text-right">{receipt.customer.email}</span>
          </div>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Deliver to</span>
            <br />
            {receipt.customer.address}
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {receipt.items.map((item, index) => (
              <li key={`${item.product_name}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {item.quantity} × {item.product_name}
                  {item.variant_label ? ` (${item.variant_label})` : ''}
                </span>
                <span className="shrink-0">{formatPrice(Number(item.unit_price) * item.quantity * 100)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt>Subtotal</dt>
              <dd>{formatPrice(receipt.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-muted-foreground">
              <dt className="shrink-0">{getDeliveryOption(receipt.delivery).title}</dt>
              <dd className="text-right">{deliveryAmount(receipt.delivery)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-muted-foreground">
              <dt>Taxes</dt>
              <dd>Confirmed on WhatsApp</dd>
            </div>
          </dl>
        </div>

        <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
          We&apos;ll email you a copy of this receipt. Message us on WhatsApp to confirm{' '}
          {getDeliveryOption(receipt.delivery).confirmOnWhatsapp}.
        </p>
        <div className="mt-5 flex justify-center">
          <Button
            render={<a href={receipt.url} target="_blank" rel="noreferrer" />}
            size="lg"
            className="w-full rounded-full sm:w-auto sm:px-8"
          >
            Confirm on WhatsApp
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Keep order reference {receipt.number} for any questions.</p>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <>
        {header}
        <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <p className="text-muted-foreground">Your bag is empty.</p>
          <Button render={<Link href="/shop" />} size="lg" className="mt-5 rounded-full px-6">
            Shop the collection
          </Button>
        </div>
      </>
    )
  }

  const option = delivery ? getDeliveryOption(delivery) : null
  const totalBeforeTax = option?.feeCents != null ? subtotal + option.feeCents : null

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!delivery) {
      setError('Choose how you would like to receive your order.')
      return
    }
    const method = delivery
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '')
    const email = String(form.get('email') ?? '')
    const phone = String(form.get('phone') ?? '')
    const shippingAddress = delivery === 'pickup' ? undefined : {
      line1: String(form.get('address_line1') ?? ''),
      line2: String(form.get('address_line2') ?? ''),
      city: String(form.get('city') ?? ''),
      province: String(form.get('province') ?? ''),
      postalCode: String(form.get('postal_code') ?? ''),
    }
    startTransition(async () => {
      const result = await placeOrder(
        {
          name,
          email,
          phone,
          shippingAddress,
          deliveryMethod: method,
          marketingConsent: form.get('marketing_consent') === 'on',
        },
        lines.map((l) => ({
          slug: l.slug,
          combinationId: l.combinationId,
          quantity: l.quantity,
          variantLabel: l.variantLabel,
        })),
      )
      if (result.ok) {
        const url = whatsappOrderUrl(
          lines,
          result.orderNumber,
          { name, email, phone, address: shippingAddress },
          { items: result.items, subtotalCents: result.productTotalCents },
          method,
        )
        clear()
        setReceipt({
          number: result.orderNumber,
          url,
          items: result.items,
          subtotalCents: result.productTotalCents,
          delivery: method,
          customer: {
            name,
            email,
            phone,
            address: shippingAddress
              ? [shippingAddress.line1, shippingAddress.line2, shippingAddress.city, shippingAddress.province, shippingAddress.postalCode, 'Canada'].filter(Boolean).join(', ')
              : 'Local pickup — we’ll confirm the pickup time and location on WhatsApp.',
          },
        })
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <>
    {header}
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-2xl text-foreground">Contact details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required autoComplete="name" className="mt-2" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone">WhatsApp number</Label>
              <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-2" placeholder="+1 902 555 0100" />
            </div>
          </div>
        </section>

        <fieldset>
          <legend className="font-display text-2xl text-foreground">Delivery</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DELIVERY_OPTIONS.map((item) => (
              <label
                key={item.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors',
                  'hover:border-accent/70 has-checked:border-accent has-checked:bg-accent/10 has-focus-visible:ring-2 has-focus-visible:ring-ring',
                )}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={item.id}
                  required
                  checked={delivery === item.id}
                  onChange={() => {
                    setDelivery(item.id)
                    setError(null)
                  }}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <span>
                  <span className="block font-medium text-foreground">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {delivery !== 'pickup' && <section>
          <h2 className="font-display text-2xl text-foreground">Delivery address</h2>
          <p className="mt-1 text-sm text-muted-foreground">Canadian addresses only.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="address_line1">Street address</Label>
              <Input id="address_line1" name="address_line1" required autoComplete="address-line1" className="mt-2" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address_line2">Apartment, suite, etc. (optional)</Label>
              <Input id="address_line2" name="address_line2" autoComplete="address-line2" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required autoComplete="address-level2" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="province">Province or territory</Label>
              <Input id="province" name="province" required autoComplete="address-level1" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="postal_code">Postal code</Label>
              <Input id="postal_code" name="postal_code" required autoComplete="postal-code" className="mt-2" />
            </div>
          </div>
        </section>}

        <MarketingConsent />
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl text-foreground">Your order</h2>
        <ul className="mt-5 space-y-4">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                <Image src={line.image || '/placeholder.svg'} alt={line.name} fill sizes="56px" className="object-cover" />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                  {line.quantity}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight text-foreground">{line.name}</p>
                  {line.variantLabel ? <p className="mt-0.5 text-xs text-muted-foreground">{line.variantLabel}</p> : null}
                </div>
                <p className="shrink-0 text-sm text-foreground">{formatPrice(line.unitPrice * line.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-foreground">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{option?.title ?? 'Delivery'}</dt>
            <dd className="text-right text-foreground">
              {option ? (option.feeCents != null ? formatPrice(option.feeCents) : 'Actual shipping cost') : 'Choose an option'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Taxes</dt>
            <dd className="text-right text-foreground">Confirmed on WhatsApp</dd>
          </div>
          {totalBeforeTax != null ? (
            <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
              <dt className="font-medium text-foreground">Total before tax</dt>
              <dd className="font-display text-xl text-foreground">{formatPrice(totalBeforeTax)}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">All prices are in CAD.</p>

        {error ? (
          <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-6 w-full rounded-full" disabled={isPending}>
          {isPending ? 'Placing order…' : 'Place order'}
        </Button>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          Your order is saved first. You then confirm {option ? option.confirmOnWhatsapp : 'delivery, taxes and payment'} with us on WhatsApp.
        </p>
      </aside>
    </form>
    </>
  )
}
