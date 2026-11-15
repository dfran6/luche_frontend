import Link from 'next/link'
import { ShoppingBag, CalendarCheck, DollarSign, Clock } from 'lucide-react'
import { getAdminOrders, getAdminAppointments } from '@/lib/data/admin-records'
import { formatPrice, formatDate } from '@/lib/format'
import { StatusBadge } from '@/components/admin/status-badge'

export const metadata = { title: 'Dashboard · Luché Studio Admin' }

export default async function AdminDashboardPage() {
  const [orders, appointments] = await Promise.all([getAdminOrders(), getAdminAppointments()])

  const revenue = orders
    .filter((o: any) => ['paid', 'partially_refunded', 'refunded'].includes(o.payment_status))
    .reduce((sum: number, o: any) => sum + Math.round(Math.max(0, Number(o.grand_total || 0) - Number(o.amount_refunded || 0)) * 100), 0)
  const openOrders = orders.filter(
    (o: any) => o.status === 'pending' || o.status === 'processing',
  ).length
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = appointments.filter(
    (a: any) => (a.status === 'requested' || a.status === 'confirmed') && a.appointment_date >= today,
  ).length

  const stats = [
    { label: 'Revenue', value: formatPrice(revenue), icon: DollarSign },
    { label: 'Total orders', value: String(orders.length), icon: ShoppingBag },
    { label: 'Open orders', value: String(openOrders), icon: Clock },
    { label: 'Upcoming bookings', value: String(upcoming), icon: CalendarCheck },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of your studio&apos;s orders and bookings.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide-sm text-muted-foreground">
                {s.label}
              </span>
              <s.icon className="size-4 text-accent" />
            </div>
            <p className="mt-3 font-serif text-2xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-medium text-foreground">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {orders.slice(0, 5).map((o: any) => (
              <li key={o.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {o.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.order_number} · {formatDate(o.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{formatPrice(Math.round(Number(o.grand_total || 0) * 100))}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-medium text-foreground">Upcoming appointments</h2>
            <Link href="/admin/appointments" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {appointments.filter((a: any) => a.status === 'requested' || a.status === 'confirmed').slice(0, 5).map((a: any) => (
              <li key={a.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {a.customer_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.service_name} · {formatDate(a.appointment_date)} at {a.appointment_time}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
