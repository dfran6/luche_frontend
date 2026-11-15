'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import type { Product } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/data/catalog-constants'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/lib/cart/cart-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const hasOptions = (product.options?.length ?? 0) > 0

  function handleQuickAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      variantLabel: product.options?.[0]?.variants.find((v) => v.inStock)?.label,
    })
    toast.success('Added to bag', { description: product.name })
  }

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
        <Link href={`/shop/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide-sm text-primary-foreground">
              Best seller
            </span>
          )}
          {product.compareAtPrice && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide-sm text-gold-foreground">
              Sale
            </span>
          )}
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {hasOptions ? (
            <Button render={<Link href={`/shop/${product.slug}`} />} className="w-full rounded-full" size="sm">
              <ShoppingBag className="size-4" />
              Choose options
            </Button>
          ) : (
            <Button className="w-full rounded-full" size="sm" onClick={handleQuickAdd}>
              <ShoppingBag className="size-4" />
              Add to bag
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-wide-sm text-muted-foreground">
          {product.brand ?? CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1 text-pretty font-display text-lg leading-snug text-foreground">
          <Link href={`/shop/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span>{product.rating.toFixed(1)}</span>
          <span aria-hidden>·</span>
          <span>{product.reviewCount} reviews</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
