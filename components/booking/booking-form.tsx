'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { bookAppointment, getAvailableAppointmentTimes } from '@/lib/store/actions'
import { formatPrice, formatDuration } from '@/lib/format'
import type { Service } from '@/lib/types'
import { whatsappServiceUrl } from '@/lib/whatsapp'

export function BookingForm({
  services,
  initialServiceId,
}: {
  services: Service[]
  initialServiceId?: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{
    id: string; name: string; email: string; service: string; date: string; time: string; price: number
  } | null>(null)
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [times, setTimes] = useState<string[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [serviceId, setServiceId] = useState(
    initialServiceId && services.some((s) => s.id === initialServiceId)
      ? initialServiceId
      : services[0]?.id,
  )

  const selected = services.find((s) => s.id === serviceId)
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  useEffect(() => {
    let active = true
    if (!serviceId || !date) {
      setTimes([])
      setTime('')
      return () => { active = false }
    }
    setTime('')
    setLoadingTimes(true)
    getAvailableAppointmentTimes(serviceId, date).then((available) => {
      if (active) setTimes(available)
    }).finally(() => {
      if (active) setLoadingTimes(false)
    })
    return () => { active = false }
  }, [serviceId, date])

  if (receipt) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-10">
      <div className="text-center"><p className="text-xs uppercase tracking-widest text-muted-foreground">LUCHE · Appointment receipt</p><h2 className="mt-2 font-display text-2xl">Request received</h2><p className="mt-2 text-sm text-muted-foreground">Reference {receipt.id}</p></div>
      <dl className="mt-7 space-y-3 border-y border-border py-5 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Customer</dt><dd>{receipt.name}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd>{receipt.email}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Service</dt><dd>{receipt.service}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Requested time</dt><dd>{receipt.date} at {receipt.time}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Listed price</dt><dd>{formatPrice(receipt.price)}</dd></div>
      </dl>
      <p className="mt-4 text-center text-sm text-muted-foreground">This is a request, not a confirmed appointment. We&apos;ll email this receipt. Confirm availability and final pricing with us on WhatsApp.</p>
      {whatsappLink ? <div className="text-center"><a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Continue on WhatsApp</a></div> : null}
    </div>
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await bookAppointment({
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        serviceId: String(form.get('serviceId') ?? ''),
        date: String(form.get('date') ?? ''),
        time: String(form.get('time') ?? ''),
        notes: String(form.get('notes') ?? ''),
      })
      if (result.ok) {
        const message = `Hello LUCHE, I requested an appointment.\nReference: ${result.appointmentId}\nService: ${selected?.name ?? ''}\nDate: ${String(form.get('date') ?? '')}\nTime: ${String(form.get('time') ?? '')}\nName: ${String(form.get('name') ?? '')}\nPhone: ${String(form.get('phone') ?? '')}\nEmail: ${String(form.get('email') ?? '')}\nNotes: ${String(form.get('notes') ?? '')}`
        setWhatsappLink(whatsappServiceUrl(message))
        setReceipt({
          id: result.appointmentId,
          name: String(form.get('name') ?? ''),
          email: String(form.get('email') ?? ''),
          service: selected?.name ?? 'Service',
          date: String(form.get('date') ?? ''),
          time: String(form.get('time') ?? ''),
          price: selected?.price ?? 0,
        })
      } else setError(result.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <Label htmlFor="serviceId">Service</Label>
          <select
            id="serviceId"
            name="serviceId"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — from {formatPrice(s.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-1.5" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="date">Preferred date</Label>
            <Input id="date" name="date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="time">Preferred time</Label>
            <select
              id="time"
              name="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={loadingTimes || !times.length}
              className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>
                Select a time
              </option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">{loadingTimes ? 'Loading available times...' : date && !times.length ? 'No times available for this date.' : 'Choose a date to see available times.'}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Desired length, size, colour or any questions…"
            className="mt-1.5"
          />
        </div>

        {error ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Sending request…' : 'Request appointment on WhatsApp'}
        </Button>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-foreground">Booking summary</h2>
        {selected ? (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="text-right font-medium text-foreground">{selected.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">From</span>
              <span className="font-medium text-foreground">{formatPrice(selected.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">
                {formatDuration(selected.durationMinutes)}
              </span>
            </div>
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              We&apos;ll confirm the appointment and final price with you on WhatsApp.
            </p>
          </div>
        ) : null}
      </aside>
    </form>
  )
}
