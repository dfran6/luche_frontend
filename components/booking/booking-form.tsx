'use client'

import { useEffect, useState, useTransition, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SparkleDivider } from '@/components/brand/sparkle'
import { MarketingConsent } from '@/components/booking/marketing-consent'
import { bookAppointment, getAvailableAppointmentTimes } from '@/lib/store/actions'
import { formatPrice, formatDuration } from '@/lib/format'
import type { Service } from '@/lib/types'
import { whatsappServiceUrl } from '@/lib/whatsapp'

export function BookingForm({
  services,
  initialServiceId,
  header,
}: {
  services: Service[]
  initialServiceId?: string
  /** The page heading; hidden once the receipt is shown. */
  header?: ReactNode
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
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-5 py-10 sm:px-8 sm:py-12">
        <div className="text-center">
          <SparkleDivider />
          <h2 className="mt-5 font-display text-3xl text-foreground">Request received</h2>
          <p className="mt-2 text-sm text-muted-foreground">Reference {receipt.id}</p>
        </div>
        <dl className="mt-7 space-y-3 border-y border-border py-5 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Customer</dt><dd className="text-right">{receipt.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd className="break-all text-right">{receipt.email}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Service</dt><dd className="text-right">{receipt.service}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Requested time</dt><dd className="text-right">{receipt.date} at {receipt.time}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Starting price</dt><dd>{formatPrice(receipt.price)}</dd></div>
        </dl>
        <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
          This is a request, not a confirmed appointment. We&apos;ll email you a copy of this receipt. Message us on WhatsApp to confirm availability and the final price.
        </p>
        {whatsappLink ? (
          <div className="mt-5 flex justify-center">
            <Button render={<a href={whatsappLink} target="_blank" rel="noreferrer" />} size="lg" className="w-full rounded-full sm:w-auto sm:px-8">
              Confirm on WhatsApp
            </Button>
          </div>
        ) : null}
      </div>
    )
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
        marketingConsent: form.get('marketing_consent') === 'on',
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
    <>
    {header}
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
      <div className="space-y-6">
        <div>
          <Label htmlFor="serviceId">Service</Label>
          <select
            id="serviceId"
            name="serviceId"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring md:h-10 md:text-sm"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (from {formatPrice(s.price)})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-2" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="date">Preferred date</Label>
            <Input id="date" name="date" type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-2" />
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
              className="mt-2 h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 md:h-10 md:text-sm"
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
            <p className="mt-2 text-xs text-muted-foreground">{loadingTimes ? 'Loading available times…' : date && !times.length ? 'No times available on this date. Try another day.' : 'Pick a date to see available times.'}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Desired length, size, colour or any questions…"
            className="mt-2"
          />
        </div>

        <MarketingConsent />

        {error ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto sm:px-8" disabled={isPending}>
          {isPending ? 'Sending request…' : 'Request appointment'}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your request is saved first. You then confirm the appointment with us on WhatsApp.
        </p>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl text-foreground">Booking summary</h2>
        {selected ? (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="text-right font-medium text-foreground">{selected.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Starting price</span>
              <span className="font-medium text-foreground">{formatPrice(selected.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">
                {formatDuration(selected.durationMinutes)}
              </span>
            </div>
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              We&apos;ll confirm your appointment and the final price on WhatsApp.
            </p>
          </div>
        ) : null}
      </aside>
    </form>
    </>
  )
}
