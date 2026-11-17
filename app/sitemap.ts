import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/data/products'
import { absoluteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/shop', '/services', '/about', '/contact', '/booking']
  const products = await getAllProducts()

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : path === '/shop' || path === '/services' ? 0.8 : 0.6,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/shop/${product.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
