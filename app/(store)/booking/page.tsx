import type { Metadata } from 'next'
import type { Service } from '@/lib/types'
import { BookingForm } from '@/components/booking/booking-form'
import { SparkleDivider } from '@/components/brand/sparkle'
import { getAllServices } from '@/lib/data/services'

export const metadata: Metadata = {
  title: 'Book an Appointment — Luché',
  description: 'Request an appointment at Luché Hair & Beauty Studio.',
}

function Header() {
  return (
    <div className="mb-10 max-w-2xl">
      <h1 className="text-balance font-display text-4xl text-foreground sm:text-5xl">Book an appointment</h1>
      <SparkleDivider align="start" className="mt-4" />
      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
        Choose a service, date and time. We&apos;ll confirm your appointment and the final price on WhatsApp.
      </p>
    </div>
  )
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
      {services.length ? (
        <BookingForm services={services} initialServiceId={initialServiceId} header={<Header />} />
      ) : (
        <>
          <Header />
          <p className="rounded-xl border border-border p-6 text-muted-foreground">Services are unavailable right now. Please try again later.</p>
        </>
      )}
    </div>
  )
}
