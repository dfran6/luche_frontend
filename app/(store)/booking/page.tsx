import type { Metadata } from 'next'
import type { Service } from '@/lib/types'
import { BookingForm } from '@/components/booking/booking-form'
import { Reveal } from '@/components/reveal'
import { getAllServices } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Book an Appointment — Luché',
  description: 'Request an appointment at Luché Hair & Beauty Studio.',
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  const services: Service[] = await getAllServices()
  const initialServiceId = services.find((item) => item.id === service || item.slug === service)?.id

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Reveal className="max-w-2xl">
        <p className="text-xs uppercase tracking-luche text-accent">Appointments</p>
        <h1 className="mt-3 text-balance font-display text-4xl text-foreground sm:text-5xl">
          Book your visit
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Select a service and time, then send your request to us on WhatsApp so we can confirm the details.
        </p>
      </Reveal>

      <div className="mt-10">
        {services.length ? <BookingForm services={services} initialServiceId={initialServiceId} /> : <p className="rounded-xl border border-border p-6 text-muted-foreground">Services are unavailable right now. Please try again later.</p>}
      </div>
    </div>
  )
}
