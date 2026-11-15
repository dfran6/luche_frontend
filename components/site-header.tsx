'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { CartDrawer } from '@/components/cart-drawer'
import { useCart } from '@/lib/cart/cart-context'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/booking', label: 'Book' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-md'
          : 'border-transparent bg-background/0',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center lg:flex-none">
          <Logo />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-foreground/80 hover:bg-secondary/70 hover:text-accent"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground/80 hover:bg-secondary/70 hover:text-accent"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border px-6 py-5">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-3 py-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-3 font-display text-xl transition-colors',
                      pathname.startsWith(item.href)
                        ? 'text-accent'
                        : 'text-foreground hover:text-accent',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm uppercase tracking-wide-sm transition-colors',
                pathname.startsWith(item.href)
                  ? 'text-accent'
                  : 'text-foreground/80 hover:text-accent',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 items-center justify-end gap-1 lg:flex lg:flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
      <CartDrawer />
    </header>
  )
}
