import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { getProductBySlug } from '@/lib/data/products'
import { formatPrice } from '@/lib/format'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export async function Spotlight() {
  const product = await getProductBySlug('xpression-pre-stretched-ultra-braid-52')
  if (!product) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-center gap-10 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-16">
        <Reveal className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl bg-primary-foreground/10">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 80vw, 40vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs uppercase tracking-luche text-gold">Studio favourite</p>
          <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
            {product.description}
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-primary-foreground/90">
                <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-primary-foreground/60 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <Button render={<Link href={`/shop/${product.slug}`} />} size="lg" variant="secondary" className="rounded-full px-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md">
              Shop now
              <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
