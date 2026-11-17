import type { Metadata } from 'next'
import { MapPin, Clock, Mail, Phone } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = {
  title: 'Contact the Studio',
  description: 'Contact Luché Hair & Beauty Studio about appointments, orders, hair products or styling services.',
  alternates: { canonical: '/contact' },
}

const HOURS = [
  ['Tuesday – Friday', '9:00 – 19:00'],
  ['Saturday', '9:00 – 18:00'],
  ['Sunday', '11:00 – 16:00'],
  ['Monday', 'Closed'],
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Reveal className="max-w-2xl">
        <p className="text-xs uppercase tracking-luche text-accent">Get in touch</p>
        <h1 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Questions about a style, an order or a product recommendation? Send us a message.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <Reveal
          as="form"
          className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" name="name" required autoComplete="name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="c-subject">Subject</Label>
            <Input id="c-subject" name="subject" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="c-message">Message</Label>
            <Textarea id="c-message" name="message" rows={6} required className="mt-1.5" />
          </div>
          <Button type="submit" size="lg">
            Send message
          </Button>
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-muted-foreground">
                  Sydney<br />
                  Nova Scotia, Canada
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent" />
                <a href="tel:+1 9029792695" className="text-muted-foreground hover:text-foreground">
                  +1 (902) 979-2695
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
                <a
                  href="mailto:hello@luchehair.com"
                  className="text-muted-foreground hover:text-foreground"
                >
                  hello@luchehair.com
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
              <Clock className="size-5 text-accent" />
              Opening hours
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              {HOURS.map(([day, time]) => (
                <div key={day} className="flex justify-between">
                  <dt className="text-muted-foreground">{day}</dt>
                  <dd className="font-medium text-foreground">{time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
