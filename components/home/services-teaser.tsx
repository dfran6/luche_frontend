import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getAllServices } from '@/lib/data/services'
import { formatPrice, formatDuration } from '@/lib/format'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export async function ServicesTeaser() {
  const featured = (await getAllServices()).slice(0, 3)

  return (
    <section className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/editorial/services.png"
              alt="Stylist creating knotless braids in the studio"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            {/*
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/editorial/services.png"
            >
              <source src="/videos/services.mp4" type="video/mp4" />
            </video>
            */}
          </Reveal>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-luche text-accent">In the studio</p>
            <h2 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
              Styling services
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              From knotless braids to a nourishing cornrows, our stylists craft protective styles
              that look effortless and last. Book online in a couple of taps.
            </p>

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {featured.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 80}>
                  <Link
                    href={`/booking?service=${s.id}`}
                    className="group flex items-center justify-between gap-4 py-5 transition-colors"
                  >
                    <div>
                      <h3 className="font-display text-xl text-foreground group-hover:text-accent">
                        {s.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDuration(s.durationMinutes)} · from {formatPrice(s.price)}
                      </p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                  </Link>
                </Reveal>
              ))}
              {featured.length === 0 && <li className="py-5 text-sm text-muted-foreground">Service listings are being updated.</li>}
            </ul>

            <div className="mt-8">
              <Button render={<Link href="/services" />} size="lg" className="rounded-full px-5 shadow-sm shadow-primary/10 hover:-translate-y-0.5 hover:shadow-md">
                View all services
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
