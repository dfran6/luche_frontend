import type React from 'react'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart/cart-context'
import { absoluteUrl, SITE_URL } from '@/lib/seo'
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
  metadataBase: new URL(SITE_URL),
  applicationName: 'Luché Hair & Beauty Studio',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/luche-logo.jpg', type: 'image/jpeg' },
    ],
  },
  title: {
    default: 'Luché Hair & Beauty Studio | Braiding Hair & Styling',
    template: '%s | Luché',
  },
  description:
    'Shop premium braiding hair, extensions and hair care, or book a protective style with Luché Hair & Beauty Studio.',
  keywords: [
    'Luché',
    'hair and beauty studio',
    'braiding hair',
    'pre-stretched braiding hair',
    'X-Pression',
    'hair extensions',
    'hair care',
    'protective hairstyles',
    'braiding salon',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Luché Hair & Beauty Studio | Braiding Hair & Styling',
    description: 'Shop premium braiding hair and hair care, or book your next studio style.',
    type: 'website',
    siteName: 'Luché Hair & Beauty Studio',
    locale: 'en_CA',
    url: absoluteUrl('/'),
    images: [{ url: '/luche-logo.jpg', alt: 'Luché Hair & Beauty Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luché Hair & Beauty Studio',
    description: 'Premium braiding hair, hair care and protective styling.',
    images: ['/luche-logo.jpg'],
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
    <html lang="en-CA" className={`${cormorant.variable} ${jost.variable} bg-background`}>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}/#organization`,
                  name: 'Luché Hair & Beauty Studio',
                  url: SITE_URL,
                  logo: absoluteUrl('/luche-logo.jpg'),
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  name: 'Luché Hair & Beauty Studio',
                  url: SITE_URL,
                  inLanguage: 'en-CA',
                  publisher: { '@id': `${SITE_URL}/#organization` },
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
