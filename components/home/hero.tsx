import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-secondary">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 z-0 flex size-[23rem] items-center justify-center rounded-full border border-accent/15 sm:hidden">
        <div className="flex size-[18rem] items-center justify-center rounded-full border border-accent/15">
          <span className="-mt-4 font-display text-[15rem] leading-none text-primary/[0.035]">L</span>
        </div>
        <span className="absolute left-10 top-12 size-2 rounded-full bg-accent/40" />
      </div>
      <div className="absolute inset-y-0 right-0 z-0 hidden w-1/2 sm:block lg:w-[56%]">
        <Image
          src="/editorial/hero-matched.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 50vw, 56vw"
          aria-hidden="true"
          className="hero-image object-cover object-[42%_center] lg:object-[72%_center]"
        />
      </div>
      <div className="absolute inset-y-0 left-0 z-[1] hidden w-[58%] bg-gradient-to-r from-secondary via-secondary/95 to-secondary/0 sm:block lg:w-[62%]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-secondary/45 to-transparent lg:hidden" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-10">
        <div className="order-1 w-full -translate-y-3 sm:w-[58%] lg:order-1 lg:w-auto lg:-translate-y-6">
          <p className="reveal is-visible flex items-center gap-3 text-xs uppercase tracking-luche text-accent">
            <span className="h-px w-8 bg-accent" />
            Hair & Beauty Studio
          </p>
          <h1 className="mt-5 max-w-none text-balance font-display text-[clamp(3.25rem,12vw,4rem)] font-medium leading-[1.02] text-primary drop-shadow-[0_1px_8px_rgba(255,255,255,0.18)] sm:max-w-[11ch] sm:text-6xl lg:mt-6 lg:text-7xl lg:text-foreground">
            Your crown,
            <br />
            perfected.
          </h1>
          <p className="mt-5 max-w-none text-pretty text-base font-normal leading-relaxed text-primary/85 drop-shadow-[0_1px_6px_rgba(255,255,255,0.16)] sm:max-w-[24ch] sm:text-lg lg:mt-6 lg:text-foreground/75">
            Premium braiding hair, hair care essentials, accessories and styling tools — everything you
            need for healthy, beautiful hair.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/shop" />}
              size="lg"
              className="rounded-full px-5 shadow-sm shadow-primary/10 hover:-translate-y-0.5 hover:shadow-md"
            >
              Shop the collection
              <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
            </Button>
            <Button
              render={<Link href="/booking" />}
              size="lg"
              variant="outline"
              className="rounded-full border-primary/20 bg-secondary/45 px-5 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent hover:bg-secondary/70"
            >
              Book an appointment
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <dt className="font-display text-3xl text-foreground">100%</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide-sm text-muted-foreground">
                Premium Kanekalon
              </dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-foreground">6k+</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide-sm text-muted-foreground">
                Crowns styled
              </dd>
            </div>
            <div>
              <dt className="font-display text-3xl text-foreground">4.9</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide-sm text-muted-foreground">
                Average rating
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </section>
  )
}
