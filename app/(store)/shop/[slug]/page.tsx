import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  getAllProducts,
  getProductBySlug,
  getProductReviews,
  getRelatedProducts,
} from '@/lib/data/products'
import { ProductDetail } from '@/components/shop/product-detail'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import { absoluteUrl } from '@/lib/seo'

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
  if (!product) return { title: 'Product Not Found' }
  const description = (product.shortDescription || product.description).slice(0, 160)
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: absoluteUrl(`/shop/${product.slug}`),
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title: product.name, description, images: [product.image] },
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

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getProductReviews(product.id),
  ])
  const availableStock = product.options?.length
    ? (product.combinations ?? []).reduce((total, combination) => total + combination.stockQuantity, 0)
    : product.stockQuantity ?? 0
  const combinationPrices = (product.combinations ?? []).map((combination) => product.price + combination.priceDelta)
  const lowPrice = combinationPrices.length ? Math.min(...combinationPrices) : product.price
  const highPrice = combinationPrices.length ? Math.max(...combinationPrices) : product.price
  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription,
    image: product.image,
    url: absoluteUrl(`/shop/${product.slug}`),
    offers: product.options?.length
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'CAD',
          lowPrice: (lowPrice / 100).toFixed(2),
          highPrice: (highPrice / 100).toFixed(2),
          offerCount: product.combinations?.length ?? 0,
          availability: availableStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: absoluteUrl(`/shop/${product.slug}`),
        }
      : {
          '@type': 'Offer',
          priceCurrency: 'CAD',
          price: (product.price / 100).toFixed(2),
          availability: availableStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: absoluteUrl(`/shop/${product.slug}`),
        },
    ...(product.reviewCount > 0 && product.rating > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount, bestRating: 5, worstRating: 1 } }
      : {}),
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData).replace(/</g, '\\u003c') }}
      />
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
        <ProductDetail product={product} reviews={reviews} />
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
