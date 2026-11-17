import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/data/products'
import { CATEGORY_LABELS } from '@/lib/data/catalog-constants'
import type { ProductCategory } from '@/lib/types'
import { ShopGrid } from '@/components/shop/shop-grid'
import { Reveal } from '@/components/reveal'
import { SYDNEY_FLAT_FEE_LABEL } from '@/lib/delivery'

export const metadata: Metadata = {
  title: 'Shop Braiding Hair & Hair Care',
  description:
    'Shop premium braiding hair, extensions, hair care, tools and accessories from Luché.',
  alternates: { canonical: '/shop' },
}

const VALID = Object.keys(CATEGORY_LABELS) as ProductCategory[]

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const initialCategory =
    category && VALID.includes(category as ProductCategory)
      ? (category as ProductCategory)
      : 'all'
  const products = await getAllProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Reveal>
        <p className="text-xs uppercase tracking-luche text-accent">The shop</p>
        <h1 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
          Premium hair &amp; studio essentials
        </h1>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Salon-grade braiding hair, extensions and the care products our stylists trust.
          Delivery within Sydney is a flat {SYDNEY_FLAT_FEE_LABEL}. Outside Sydney, you pay the actual shipping cost.
        </p>
      </Reveal>

      <div className="mt-10">
        {products.length ? <ShopGrid products={products} initialCategory={initialCategory} /> : <p className="rounded-xl border border-border p-6 text-muted-foreground">Products are unavailable right now. Please try again later.</p>}
      </div>
    </div>
  )
}
