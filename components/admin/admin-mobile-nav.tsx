'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, CalendarCheck, Package, Scissors, Store, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
]

/** Scrollable, labelled navigation for the admin on small screens. */
export function AdminMobileNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {NAV.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
              active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground/80 hover:bg-muted',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
      <Link
        href="/"
        className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm text-muted-foreground hover:bg-muted"
      >
        <Store className="size-4" />
        Store
      </Link>
    </nav>
  )
}
