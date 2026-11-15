'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Star, Check, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart/cart-context'
import { formatPrice } from '@/lib/format'
import { CATEGORY_LABELS } from '@/lib/data/catalog-constants'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const firstCombination = product.combinations?.find((combination) => combination.stockQuantity > 0) ?? product.combinations?.[0]
    if (firstCombination) return firstCombination.selections
    return Object.fromEntries((product.options ?? []).map((option) => [option.id ?? option.name, option.variants[0]?.id ?? '']))
  })

  const selectedCombination = useMemo(() => product.combinations?.find((combination) =>
    (product.options ?? []).every((option) => combination.selections[option.id ?? option.name] === selected[option.id ?? option.name]),
  ), [product, selected])
  const { unitPrice, variantLabel, canAdd, selectedStock } = useMemo(() => {
    const labels = (product.options ?? []).map((option) => option.variants.find((value) => value.id === selected[option.id ?? option.name])?.label).filter(Boolean)
    const selectedStock = product.options?.length ? selectedCombination?.stockQuantity ?? 0 : product.stockQuantity ?? 0
    const unitPrice = product.price + (selectedCombination?.priceDelta ?? 0)
    return {
      unitPrice,
      variantLabel: labels.length ? labels.join(' · ') : undefined,
      selectedStock,
      canAdd: selectedStock > 0 && quantity <= selectedStock,
    }
  }, [product, selected, selectedCombination, quantity])
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
          priority
        />
        {product.compareAtPrice ? (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wide-sm text-accent-foreground">
            Save {formatPrice(product.compareAtPrice - product.price)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-luche text-accent">
          {product.brand ? `${product.brand} · ` : ''}
          {CATEGORY_LABELS[product.category]}
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl text-foreground sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1 text-gold" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn('size-4', i < Math.round(product.rating) && 'fill-current')}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-3xl text-foreground">{formatPrice(unitPrice)}</span>
          {product.compareAtPrice ? (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {product.options?.map((opt) => (
          <div key={opt.name} className="mt-7">
            <h2 className="text-sm font-medium text-foreground">{opt.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {opt.variants.map((variant) => {
                const isSelected = selected[opt.id ?? opt.name] === variant.id
                const valueAvailable = (product.combinations ?? []).some((combination) =>
                  combination.stockQuantity > 0 && combination.selections[opt.id ?? opt.name] === variant.id &&
                  (product.options ?? []).every((otherOption) => (otherOption.id ?? otherOption.name) === (opt.id ?? opt.name) || !selected[otherOption.id ?? otherOption.name] || combination.selections[otherOption.id ?? otherOption.name] === selected[otherOption.id ?? otherOption.name]),
                )
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!valueAvailable}
                    onClick={() => { setSelected((s) => ({ ...s, [opt.id ?? opt.name]: variant.id })); setQuantity(1) }}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm transition-colors',
                      isSelected
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border text-foreground hover:border-accent',
                      !valueAvailable && 'cursor-not-allowed opacity-40 line-through',
                    )}
                  >
                    {variant.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid size-11 place-items-center text-foreground transition-colors hover:text-accent"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(20, selectedStock, q + 1))}
              disabled={quantity >= selectedStock}
              className="grid size-11 place-items-center text-foreground transition-colors hover:text-accent"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <Button
            size="lg"
            className="flex-1 min-w-48"
            disabled={!canAdd}
            onClick={() =>
              add({
                productId: product.id,
                combinationId: selectedCombination?.id,
                slug: product.slug,
                name: product.name,
                image: product.image,
                unitPrice,
                quantity,
                variantLabel,
              })
            }
          >
            <ShoppingBag className="size-4" />
            {canAdd ? 'Add to bag' : selectedStock === 0 ? 'Out of stock' : 'Not enough stock'}
          </Button>
        </div>

        <ul className="mt-9 space-y-2 border-t border-border pt-7">
          {product.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}



