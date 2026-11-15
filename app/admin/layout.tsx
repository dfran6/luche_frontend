import type { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, CalendarCheck, Store, Package, Scissors } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logoutAdmin } from '@/app/login/actions'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/services', label: 'Services', icon: Scissors },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) redirect('/login')
  const api = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
  const response = await fetch(`${api}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }).catch(() => null)
  if (!response?.ok) redirect('/login')
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border px-6 py-6">
          <Logo />
          <p className="mt-2 text-xs uppercase tracking-wide-sm text-muted-foreground">
            Studio Admin
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Store className="size-4" />
            Back to store
          </Link>
          <form action={logoutAdmin}><button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Sign out</button></form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-4 lg:hidden">
          <Logo />
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <item.icon className="size-4" />
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
