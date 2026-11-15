import { Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const TESTIMONIALS = [
  {
    quote:
      'The X-Pression braiding hair from Luché is the softest I have used — my knotless braids lasted almost two months and still looked fresh.',
    name: 'Amara O.',
    detail: 'Knotless braids',
  },
  {
    quote:
      'Booking was so easy and the studio is gorgeous. My Cornrows was flawless and the scalp oil they recommended is now a staple.',
    name: 'Priya S.',
    detail: 'Cornrows client',
  },
  {
    quote:
      'Fast shipping, beautiful packaging and the colour match was perfect. Luché is my go-to for hair now.',
    name: 'Chloe M.',
    detail: 'Online order',
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="text-center">
        <p className="text-xs uppercase tracking-luche text-accent">Kind words</p>
        <h2 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
          Loved by our community
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.name}
            as="article"
            delay={i * 100}
            className="flex flex-col rounded-xl border border-border bg-card p-7"
          >
            <div className="flex gap-0.5 text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground/90">
              “{t.quote}”
            </blockquote>
            <footer className="mt-6 border-t border-border pt-4">
              <p className="font-display text-lg text-foreground">{t.name}</p>
              <p className="text-xs uppercase tracking-wide-sm text-muted-foreground">{t.detail}</p>
            </footer>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
