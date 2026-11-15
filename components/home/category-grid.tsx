import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const CATEGORIES = [
  {
    label: 'Braiding Hair',
    href: '/shop?category=braiding-hair',
    image: '/categories/braiding.png',
    span: 'lg:col-span-2 lg:row-span-2',
    aspect: 'aspect-square lg:aspect-auto lg:h-full',
  },
  {
    label: 'Hair Care',
    href: '/shop?category=hair-care',
    image: '/categories/haircare.png',
    span: '',
    aspect: 'aspect-square',
  },
  {
    label: 'Accessories',
    href: '/shop?category=accessories',
    image: '/categories/accessories.png',
    span: '',
    aspect: 'aspect-square',
  },
  {
    label: 'Styling Tools',
    href: '/shop?category=tools',
    image: '/categories/tools.png',
    span: 'lg:col-span-2',
    aspect: 'aspect-[2/1] sm:aspect-[3/1] lg:aspect-[2/1]',
  },
]

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-luche text-accent">Explore</p>
          <h2 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
            Shop by category
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 items-center gap-1 text-sm uppercase tracking-wide-sm text-foreground/80 transition-colors hover:text-accent sm:flex"
        >
          View all
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <Reveal
            key={cat.label}
            as="article"
            delay={i * 80}
            className={`group relative overflow-hidden rounded-xl ${cat.span}`}
          >
            <Link href={cat.href} className={`block ${cat.aspect} relative`}>
              <Image
                src={cat.image || '/placeholder.svg'}
                alt={cat.label}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-5">
                <h3 className="min-w-0 max-w-[calc(100%-2.75rem)] font-display text-lg leading-tight text-primary-foreground sm:text-2xl">{cat.label}</h3>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/90 text-foreground transition-transform duration-300 group-hover:rotate-45 sm:size-9">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
