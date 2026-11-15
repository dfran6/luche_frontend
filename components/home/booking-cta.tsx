import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export function BookingCta() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-luche text-accent">Visit the studio</p>
          <h2 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
            Ready for your next transformation?
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Book an appointment with our stylists for braiding, cornrows, colour, and
            treatments — or shop premium hair to create the look at home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button render={<Link href="/booking" />} size="lg" className="rounded-full px-5 shadow-sm shadow-primary/10 hover:-translate-y-0.5 hover:shadow-md">
              Book an appointment
            </Button>
            <Button render={<Link href="/shop" />} size="lg" variant="outline" className="rounded-full border-primary/20 bg-secondary/45 px-5 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent hover:bg-secondary/70">
              Shop hair
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
