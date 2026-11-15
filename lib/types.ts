export type ProductCategory =
  | 'braiding-hair'
  | 'extensions'
  | 'hair-care'
  | 'accessories'
  | 'tools'

export type ProductVariant = {
  id: string
  externalId?: string
  /** A selectable value such as colour "1B#" or length "52\"". */
  label: string
  /** Seed-data compatibility only; database inventory lives on combinations. */
  stockQuantity?: number
  inStock?: boolean
  priceDelta?: number
}

export type ProductCombination = {
  id: string
  /** Maps option group names to selected option value IDs. */
  selections: Record<string, string>
  /** Inventory is tracked per concrete combination. */
  stockQuantity: number
  /** Price adjustment in cents for this combination. */
  priceDelta: number
  sku?: string
}

export type Product = {
  id: string
  slug: string
  name: string
  brand?: string
  category: ProductCategory
  /** price in cents (CAD) */
  price: number
  /** Used for simple products without option variants. */
  stockQuantity?: number
  compareAtPrice?: number
  image: string
  shortDescription: string
  description: string
  details: string[]
  /** grouped by axis name, e.g. { Colour: [...], Length: [...] } */
  options?: { id?: string; name: string; variants: ProductVariant[] }[]
  combinations?: ProductCombination[]
  rating: number
  reviewCount: number
  featured?: boolean
  bestSeller?: boolean
  tags?: string[]
}

export type Service = {
  id: string
  slug: string
  name: string
  category: 'braids' | 'weaves' | 'natural' | 'treatments' | 'beauty'
  /** price in cents (CAD) */
  price: number
  /** duration in minutes */
  durationMinutes: number
  image: string
  shortDescription: string
  description: string
  includes: string[]
  featured?: boolean
  isActive?: boolean
}

export type CartLine = {
  key: string
  productId: string
  combinationId?: string
  slug: string
  name: string
  image: string
  /** unit price in cents */
  unitPrice: number
  quantity: number
  variantLabel?: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'fulfilled' | 'cancelled'

export type Order = {
  id: string
  customerName: string
  email: string
  createdAt: string
  status: OrderStatus
  /** total in cents */
  total: number
  phone?: string
  shippingAddress?: {
    address: string
    city: string
    postal: string
  }
  items: { productId?: string; combinationId?: string; name: string; quantity: number; unitPrice: number; variantLabel?: string }[]
}

export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled'

export type Appointment = {
  id: string
  customerName: string
  email: string
  phone: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
}
