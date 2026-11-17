import type { Product, ProductCategory } from '@/lib/types'
export { CATEGORY_LABELS, CATEGORY_ORDER } from './catalog-constants'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
type ApiProduct = Record<string, any>

function hostedImage(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : undefined
  } catch {
    // Product photos should come from the backend's hosted storage (R2), not
    // paths into the frontend's public folder.
    return undefined
  }
}

export type ProductReview = {
  id: string
  customer_name: string
  rating: number
  comment?: string | null
  created_at: string
}

function mapProduct(row: ApiProduct): Product {
  const options = (row.option_groups ?? []).map((group: ApiProduct) => ({
    id: group.id,
    name: group.name,
    variants: (group.values ?? []).map((value: ApiProduct) => ({ id: value.external_id || value.id, externalId: value.external_id || undefined, label: value.label })),
  }))
  const valueLookup = new Map<string, string>()
  for (const group of row.option_groups ?? []) for (const value of group.values ?? []) valueLookup.set(value.id, value.external_id || value.id)
  const combinations = (row.variants ?? []).map((variant: ApiProduct) => ({
    id: variant.id,
    selections: Object.fromEntries(Object.entries(variant.selections ?? {}).map(([key, value]) => [key, valueLookup.get(String(value)) || String(value)])),
    stockQuantity: variant.stock_quantity ?? 0,
    priceDelta: Math.round(Number(variant.price_delta ?? 0) * 100),
    image: hostedImage(variant.image),
    sku: variant.sku,
  }))
  return {
    id: row.id, slug: row.slug, name: row.name, brand: row.brand, category: row.category,
    price: Math.round(Number(row.price ?? 0) * 100), compareAtPrice: row.compare_at_price == null ? undefined : Math.round(Number(row.compare_at_price) * 100),
    image: hostedImage(row.image) || '/placeholder.svg', shortDescription: row.short_description || '', description: row.description || '',
    details: row.details ?? [], options, combinations, stockQuantity: row.stock_quantity ?? undefined,
    rating: Number(row.rating ?? 0), reviewCount: row.review_count ?? 0, featured: row.featured, bestSeller: row.best_seller, tags: row.tags ?? [],
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API}/products/?limit=100`, { next: { revalidate: 30 } })
    if (!response.ok) return []
    const body = await response.json()
    return (body.products ?? []).map(mapProduct)
  } catch { return [] }
}
export async function getAdminProducts(): Promise<Product[]> {
  try {
    const jar = await (await import('next/headers')).cookies()
    const access = jar.get('luche-admin-access')?.value
    const response = await fetch(`${API}/products/?limit=100`, { cache: 'no-store', headers: access ? { Authorization: `Bearer ${access}` } : {} })
    if (!response.ok) return []
    return ((await response.json()).products ?? []).map(mapProduct)
  } catch { return [] }
}
export async function getProductAdminStats() {
  try {
    const jar = await (await import('next/headers')).cookies()
    const access = jar.get('luche-admin-access')?.value
    const response = await fetch(`${API}/products/admin/stats`, { cache: 'no-store', headers: access ? { Authorization: `Bearer ${access}` } : {} })
    return response.ok ? await response.json() : { available: 0, sold: 0, low_stock: 0, out_of_stock: 0 }
  } catch { return { available: 0, sold: 0, low_stock: 0, out_of_stock: 0 } }
}
export async function getProductBySlug(slug: string) { return (await getAllProducts()).find((p) => p.slug === slug) }
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    // Keep product detail pages compatible with static generation/ISR. A
    // no-store review request makes Next switch this route to dynamic at
    // runtime after it has already been generated as static.
    const response = await fetch(`${API}/products/${encodeURIComponent(productId)}/reviews`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    const reviews = await response.json()
    return Array.isArray(reviews) ? reviews : []
  } catch { return [] }
}
export async function getProductsByCategory(category: ProductCategory) { return (await getAllProducts()).filter((p) => p.category === category) }
export async function getFeaturedProducts() { return (await getAllProducts()).filter((p) => p.featured) }
export async function getBestSellers() { return (await getAllProducts()).filter((p) => p.bestSeller) }
export async function getStudioFavourite() { return (await getFeaturedProducts())[0] }
export async function getRelatedProducts(product: Product, limit = 4) {
  const catalog = await getAllProducts()
  return catalog.filter((p) => p.id !== product.id && p.category === product.category).concat(catalog.filter((p) => p.id !== product.id && p.category !== product.category)).slice(0, limit)
}
