'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/product-card'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/data/catalog-constants'
import type { Product, ProductCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
}

export function ShopGrid({
  products,
  initialCategory = 'all',
}: {
  products: Product[]
  initialCategory?: ProductCategory | 'all'
}) {
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory)
  const [sort, setSort] = useState<SortKey>('featured')

  const filters: { key: ProductCategory | 'all'; label: string }[] = useMemo(
    () => [
      { key: 'all', label: 'All' },
      ...CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c)).map((c) => ({
        key: c,
        label: CATEGORY_LABELS[c],
      })),
    ],
    [products],
  )

  const visible = useMemo(() => {
    const list = category === 'all' ? products : products.filter((p) => p.category === category)
    const sorted = [...list]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      default:
        sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    }
    return sorted
  }, [products, category, sort])

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setCategory(f.key)}
              aria-pressed={category === f.key}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                category === f.key
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-transparent text-muted-foreground hover:border-accent hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
