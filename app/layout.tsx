import type React from 'react'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart/cart-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/luche-logo.jpg', type: 'image/jpeg' },
    ],
  },
  title: {
    default: 'Luché — Hair & Beauty Studio',
    template: '%s · Luché',
  },
  description:
    'Luché Hair & Beauty Studio. Premium braiding hair, extensions and hair care, plus expert styling services. Shop the collection and book your appointment.',
  keywords: [
    'Luché',
    'hair and beauty studio',
    'braiding hair',
    'pre-stretched braid',
    'X-Pression',
    'hair extensions',
    'hair care',
    'salon booking',
  ],
  openGraph: {
    title: 'Luché — Hair & Beauty Studio',
    description:
      'Premium braiding hair, extensions and hair care, plus expert styling services.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#f3e9dc',
  colorScheme: 'light' as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} bg-background`}>
      <body className="min-h-dvh antialiased">
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
