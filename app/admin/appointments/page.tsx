import { getAdminAppointments } from '@/lib/data/admin-records'
import { formatDate, formatPrice, formatDuration } from '@/lib/format'
import { AppointmentStatusControl } from '@/components/admin/status-control'
import { MarkAppointmentPaid } from '@/components/admin/mark-appointment-paid'

export const metadata = { title: 'Appointments · Luché Studio Admin' }
function money(value: unknown) { return formatPrice(Math.round(Number(value ?? 0) * 100)) }

export default async function AdminAppointmentsPage() {
  const appointments = await getAdminAppointments()
  return <div className="mx-auto max-w-5xl space-y-8">
    <div><h1 className="font-serif text-3xl text-foreground">Appointments</h1><p className="mt-1 text-sm text-muted-foreground">{appointments.length} recent booking{appointments.length === 1 ? '' : 's'} · confirm requests with customers on WhatsApp.</p></div>
    {appointments.length === 0 ? <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">No appointments found, or the backend could not be reached.</p> : <div className="space-y-4">{appointments.map((appointment: any) => <article key={appointment.id} className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-medium text-foreground">{appointment.customer_name}</h2><span className="text-xs text-muted-foreground">{appointment.id}</span></div><p className="text-xs text-muted-foreground">{appointment.email} · {appointment.phone}</p><p className="mt-1 text-xs capitalize text-muted-foreground">Payment: {String(appointment.payment_status).replaceAll('_', ' ')}</p></div><div className="flex flex-wrap items-center gap-2"><MarkAppointmentPaid id={appointment.id} paymentStatus={appointment.payment_status} /><AppointmentStatusControl id={appointment.id} status={appointment.status} /></div></div>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-4 text-sm"><div><span className="text-xs uppercase tracking-wide-sm text-muted-foreground">Service</span><p className="text-foreground">{appointment.service_name} · {money(appointment.service_price)}</p></div><div><span className="text-xs uppercase tracking-wide-sm text-muted-foreground">Date &amp; time</span><p className="text-foreground">{formatDate(appointment.appointment_date)} at {appointment.appointment_time}</p></div><div><span className="text-xs uppercase tracking-wide-sm text-muted-foreground">Duration</span><p className="text-foreground">{formatDuration(appointment.duration_minutes)}</p></div></div>
      {appointment.notes ? <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{appointment.notes}</p> : null}
    </article>)}</div>}
  </div>
}
