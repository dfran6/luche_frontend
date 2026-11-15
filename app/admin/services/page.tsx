import { getAdminServices, getServiceAdminStats } from '@/lib/data/services'
import { CalendarCheck, CalendarClock, Scissors, CheckCircle2 } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/format'
import { CatalogDeleteForm } from '@/components/admin/catalog-delete-form'
import { ServiceForm } from '@/components/admin/service-form'

export default async function ServicesPage() {
  const [services, stats] = await Promise.all([getAdminServices(), getServiceAdminStats()])
  const cards = [
    { label: 'Services offered', value: stats.services, icon: Scissors },
    { label: 'Total bookings', value: stats.bookings, icon: CalendarCheck },
    { label: 'Completed appointments', value: stats.completed, icon: CheckCircle2 },
    { label: 'Upcoming appointments', value: stats.upcoming, icon: CalendarClock },
  ]
  return <div className="mx-auto max-w-6xl space-y-6">
    <div><h1 className="font-serif text-3xl">Services</h1><p className="mt-1 text-sm text-muted-foreground">Manage salon services, pricing, and appointment duration.</p></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map((card) => <div key={card.label} className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide-sm text-muted-foreground">{card.label}</span><card.icon className="size-4 text-accent" /></div><p className="mt-3 font-serif text-2xl text-foreground">{card.value}</p></div>)}</div>
    <ServiceForm />
    <div className="space-y-3">{services.map((service) => <article key={service.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><img src={service.image || '/placeholder.svg'} alt="" className="size-16 shrink-0 rounded-lg border border-border bg-secondary object-cover" /><div className="min-w-0"><p className="truncate font-medium">{service.name}</p><p className="text-sm text-muted-foreground">{formatPrice(service.price)} · {formatDuration(service.durationMinutes)}</p><p className="mt-1 text-xs text-muted-foreground">{service.isActive ? 'Active' : 'Inactive'}{service.featured ? ' · Featured' : ''}</p></div></div><div className="flex gap-2"><details><summary className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm">Edit</summary><div className="mt-3 w-[min(90vw,520px)]"><ServiceForm service={service} /></div></details><CatalogDeleteForm id={service.id} kind="service" /></div></article>)}</div>
  </div>
}
