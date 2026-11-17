import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkle } from '@/components/brand/sparkle'
import { HeroMedallion } from '@/components/home/hero-medallion'
import { SYDNEY_FLAT_FEE_LABEL } from '@/lib/delivery'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      {/* Stationery frame: a hairline border broken by the logo's star. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-0 border border-accent/35 sm:inset-5">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-secondary px-3 text-accent">
          <Sparkle className="size-4" />
        </span>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-8 py-14 sm:px-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-20 lg:py-20">
        <HeroMedallion className="lg:order-last" />

        <div className="text-center lg:text-left">
          <h1 className="text-balance font-display text-[clamp(3.1rem,9.5vw,6.25rem)] font-medium leading-[0.98] tracking-[-0.015em] text-primary">
            Your crown,
            <br />
            perfected.
          </h1>
          <p className="mx-auto mt-6 max-w-[36ch] text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg lg:mx-0">
            Premium braiding hair, hair care essentials, accessories and styling tools, plus expert styling in the studio.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              render={<Link href="/shop" />}
              size="lg"
              className="h-12 rounded-full bg-primary px-8 text-[0.95rem] tracking-[0.03em] hover:bg-accent hover:text-accent-foreground"
            >
              Shop the collection
            </Button>
            <Button
              render={<Link href="/booking" />}
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-accent/60 bg-transparent px-8 text-[0.95rem] tracking-[0.03em] text-primary hover:border-accent hover:bg-accent/10"
            >
              Book an appointment
            </Button>
          </div>

          <p className="mx-auto mt-9 flex max-w-sm items-center justify-center gap-2.5 border-t border-accent/30 pt-5 text-sm text-muted-foreground lg:mx-0 lg:justify-start">
            <Sparkle className="size-3 text-accent" />
            Delivery within Sydney: flat {SYDNEY_FLAT_FEE_LABEL}
          </p>
        </div>
      </div>
    </section>
  )
}
