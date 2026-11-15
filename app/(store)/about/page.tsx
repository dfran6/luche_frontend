import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About — Luché Hair & Beauty Studio',
  description:
    'Luché is a hair and beauty studio and premium hair shop dedicated to healthy, beautiful, long-lasting styles.',
}

const VALUES = [
  {
    title: 'Premium fibre',
    body: 'We stock only soft, tangle-resistant braiding hair and extensions our stylists trust on their own clients.',
  },
  {
    title: 'Healthy styling',
    body: 'Gentle, scalp-first techniques and aftercare that protect your natural hair between styles.',
  },
  {
    title: 'Made personal',
    body: 'Every install is tailored — length, size, colour and finish chosen with you at consultation.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <Reveal>
          <p className="text-xs uppercase tracking-luche text-accent">Our story</p>
          <h1 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
            Beauty, crafted with care
          </h1>
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              Luché began with a simple belief: great hair should feel as good as it looks. What
              started as a passion for protective styling grew into a full hair and beauty studio —
              and a shop for the premium hair and care products we swear by.
            </p>
            <p>
              Today we braid, press, install and advise for a community that trusts us with their
              crowns. Whether you visit the studio or shop online, you get the same standard: quality
              fibre, careful hands and honest guidance.
            </p>
          </div>
          <Button render={<Link href="/booking" />} className="mt-8">
            Book an appointment
          </Button>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary">
            <Image
              src="/editorial/about.png"
              alt="Luché stylist at work in the studio"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal
                key={value.title}
                as="article"
                delay={i * 100}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <span className="font-display text-3xl text-accent">0{i + 1}</span>
                <h2 className="mt-4 font-display text-xl text-foreground">{value.title}</h2>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
