import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getBestSellers } from '@/lib/data/products'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export async function FeaturedProducts() {
  const products = (await getBestSellers()).slice(0, 4)

  return (
    <section className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-luche text-accent">Loved by our clients</p>
            <h2 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
              Best sellers
            </h2>
          </div>
          <Button render={<Link href="/shop" />} variant="outline" className="hidden rounded-full border-primary/20 px-5 hover:-translate-y-0.5 hover:border-accent sm:inline-flex">
            Shop all
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Button render={<Link href="/shop" />} variant="outline" className="w-full rounded-full border-primary/20 px-5 hover:border-accent">
            Shop all products
          </Button>
        </div>
      </div>
    </section>
  )
}
