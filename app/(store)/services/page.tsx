import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { getAllServices } from '@/lib/data/services'
import { formatPrice, formatDuration } from '@/lib/format'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Services — Luché Hair & Beauty Studio',
  description:
    'Braiding, weaves, cornrows, treatments and wig installs at Luché Hair & Beauty Studio. Book your appointment today.',
}

export default async function ServicesPage() {
  const services = await getAllServices()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Reveal className="max-w-2xl">
        <p className="text-xs uppercase tracking-luche text-accent">The studio</p>
        <h1 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
          Studio services
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          From protective braiding to a flawless cornrows, our stylists craft looks that are
          healthy, long-lasting and unmistakably you. Prices are starting points and confirmed at
          consultation.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal
            key={service.id}
            as="article"
            delay={i * 80}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <Image
                src={service.image || '/placeholder.svg'}
                alt={service.name}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl text-foreground">{service.name}</h2>
                <span className="whitespace-nowrap font-display text-lg text-accent">
                  {formatPrice(service.price)}+
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-wide-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {formatDuration(service.durationMinutes)}
              </p>
              <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {service.shortDescription}
              </p>
              <ul className="mt-4 space-y-1.5">
                {service.includes.map((item) => (
                  <li key={item} className="text-sm text-foreground/80">
                    · {item}
                  </li>
                ))}
              </ul>
              <Button
                render={<Link href={`/booking?service=${service.id}`} />}
                variant="outline"
                className="mt-6 w-full"
              >
                Book this service
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
