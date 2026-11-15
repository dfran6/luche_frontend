import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/data/products'
import { ProductDetail } from '@/components/shop/product-detail'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found — Luché' }
  return {
    title: `${product.name} — Luché`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8">
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-display text-3xl text-foreground">You may also like</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
