import Link from 'next/link'
import { Camera, Music2, X, MessageCircle, Mail, MapPin } from 'lucide-react'
import { Logo } from '@/components/logo'
import { whatsappServiceUrl } from '@/lib/whatsapp'

const SHOP_LINKS = [
  { href: '/shop?category=braiding-hair', label: 'Braiding Hair' },
  { href: '/shop?category=extensions', label: 'Extensions' },
  { href: '/shop?category=hair-care', label: 'Hair Care' },
  { href: '/shop?category=accessories', label: 'Accessories' },
]

const STUDIO_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book an Appointment' },
  { href: '/about', label: 'Our Story' },
  { href: '/login', label: 'Studio Login' },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo className="text-primary-foreground" />
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Premium braiding hair, extensions and expert styling — a warm, luxe studio experience
            for every crown.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappServiceUrl('Hello LUCHE, I have a question.')}
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
              className="group flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/80 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary"
            >
              <MessageCircle className="size-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href="instagram/luche.hair"
              aria-label="Instagram"
              className="group flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/80 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary"
            >
              <Camera className="size-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href="x/luche.hair"
              aria-label="X"
              className="group flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/80 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary"
            >
              <X className="size-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href="tt/luchehair"
              aria-label="TikTok"
              className="group flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/80 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-primary"
            >
              <Music2 className="size-4 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wide-sm text-primary-foreground/60">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary-foreground/85 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wide-sm text-primary-foreground/60">Studio</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {STUDIO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary-foreground/85 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wide-sm text-primary-foreground/60">Visit</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>128 Studio Lane, Toronto, ON</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href="mailto:hello@luche.studio" className="hover:text-gold">
                hello@luche.studio
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Tue–Sat · 9am – 6pm
          </p>
        </div>
      </div>

      <div className="overflow-hidden border-y border-primary-foreground/15 py-8">
        <p className="whitespace-nowrap text-center font-display text-[clamp(2.75rem,9vw,8rem)] font-bold uppercase leading-none tracking-[-0.06em] text-primary-foreground/10">
          Your crown · Your hair · Your glow
        </p>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Luché Hair & Beauty Studio. All rights reserved.</p>
          <p className="tracking-wide-sm uppercase">Hair & Beauty Studio</p>
        </div>
      </div>
    </footer>
  )
}
