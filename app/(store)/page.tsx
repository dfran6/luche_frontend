import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Spotlight } from '@/components/home/spotlight'
import { ServicesTeaser } from '@/components/home/services-teaser'
import { Testimonials } from '@/components/home/testimonials'
import { BookingCta } from '@/components/home/booking-cta'

export const metadata: Metadata = {
  title: 'Luché — Hair & Beauty Studio',
  description:
    'Premium braiding hair, hair care and accessories, plus a full-service hair and beauty studio. Shop online or book your next appointment with Luché.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <Spotlight />
      <ServicesTeaser />
      <Testimonials />
      <BookingCta />
    </>
  )
}
