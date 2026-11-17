import Link from 'next/link'
import { ShoppingBag, CalendarCheck, DollarSign, Clock } from 'lucide-react'
import { getAdminDashboardSummary } from '@/lib/data/admin-records'
import { formatPrice, formatDate } from '@/lib/format'
import { StatusBadge } from '@/components/admin/status-badge'

export const metadata = { title: 'Dashboard · Luché Studio Admin' }

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardSummary()
  const statsData = dashboard?.stats ?? {}
  const orders = dashboard?.recent_orders ?? []
  const appointments = dashboard?.upcoming_appointments ?? []

  const earnings = [
    { label: 'Order revenue', value: formatPrice(Math.round(Number(statsData.order_revenue ?? 0) * 100)), hint: 'Paid orders, after refunds', icon: DollarSign },
    {
      label: 'Appointment revenue',
      value: formatPrice(Math.round(Number(statsData.appointment_revenue ?? 0) * 100)),
      hint: `${statsData.completed_appointments ?? 0} completed appointment${Number(statsData.completed_appointments ?? 0) === 1 ? '' : 's'}`,
      icon: CalendarCheck,
    },
  ]
  const stats = [
    { label: 'Total orders', value: String(statsData.total_orders ?? 0), icon: ShoppingBag },
    { label: 'Open orders', value: String(statsData.open_orders ?? 0), icon: Clock },
    { label: 'Upcoming bookings', value: String(statsData.upcoming_appointments ?? 0), icon: CalendarCheck },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of your studio&apos;s orders and bookings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {earnings.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 shrink-0 text-accent" />
            </div>
            <p className="mt-3 break-words font-serif text-3xl lining-nums text-foreground sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs leading-snug text-muted-foreground">{s.label}</span>
              <s.icon className="hidden size-4 shrink-0 text-accent sm:block" />
            </div>
            <p className="mt-auto pt-2 font-serif text-2xl lining-nums text-foreground">{s.value}</p>
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
              <li key={o.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {o.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.order_number} · {formatDate(o.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
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
