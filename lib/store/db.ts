import type { Order, Appointment, OrderStatus, AppointmentStatus, Product, Service } from '@/lib/types'

/**
 * Lightweight in-memory store used to power orders and appointments in the
 * preview. It seeds a little data so the studio dashboard is immediately
 * useful. Swap this module for a real database (e.g. Neon) when going live —
 * the exported API is intentionally small.
 */

type DB = {
  orders: Order[]
  appointments: Appointment[]
  products: Product[]
  services: Service[]
}

const globalForDb = globalThis as unknown as { __lucheDb?: DB }

function seed(): DB {
  const now = Date.now()
  const day = 86_400_000
  return {
    orders: [
      {
        id: 'LUC-10432',
        customerName: 'Amara Okafor',
        email: 'amara@example.com',
        createdAt: new Date(now - day * 1).toISOString(),
        status: 'processing',
        total: 5400,
        items: [
          { productId: 'xpression-ultra-braid', name: 'X-Pression Ultra Braid 3X — Pre-Stretched 52"', quantity: 3, unitPrice: 1200, variantLabel: '1B# · 52"' },
          { productId: 'hair-growth-oil', name: 'Nourishing Hair & Scalp Oil', quantity: 1, unitPrice: 1800 },
        ],
      },
      {
        id: 'LUC-10431',
        customerName: 'Bisi Adeyemi',
        email: 'bisi@example.com',
        createdAt: new Date(now - day * 2).toISOString(),
        status: 'shipped',
        total: 3600,
        items: [
          { productId: 'prestretched-braid-black', name: 'Pre-Stretched Braiding Hair — Natural Black', quantity: 3, unitPrice: 1200, variantLabel: '1B#' },
        ],
      },
      {
        id: 'LUC-10430',
        customerName: 'Chloe Martin',
        email: 'chloe@example.com',
        createdAt: new Date(now - day * 4).toISOString(),
        status: 'fulfilled',
        total: 4200,
        items: [
          { productId: 'crochet-curl', name: 'Crochet Curl Bundle', quantity: 2, unitPrice: 1500 },
          { productId: 'satin-bonnet', name: 'Satin-Lined Bonnet', quantity: 1, unitPrice: 1200 },
        ],
      },
      {
        id: 'LUC-10429',
        customerName: 'Danielle Roy',
        email: 'danielle@example.com',
        createdAt: new Date(now - day * 6).toISOString(),
        status: 'pending',
        total: 2400,
        items: [{ productId: 'edge-brush', name: 'Edge Control Brush Set', quantity: 2, unitPrice: 1200 }],
      },
    ],
    products: [],
    services: [],
    appointments: [
      {
        id: 'APT-2051',
        customerName: 'Naomi Clarke',
        email: 'naomi@example.com',
        phone: '+1 416 555 0142',
        serviceId: 'knotless-braids',
        serviceName: 'Knotless Box Braids',
        date: new Date(now + day * 2).toISOString().slice(0, 10),
        time: '10:00',
        status: 'confirmed',
        notes: 'Waist length, medium size, natural black.',
        createdAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'APT-2050',
        customerName: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+1 647 555 0199',
        serviceId: 'silk-press',
        serviceName: 'Cornrows',
        date: new Date(now + day * 3).toISOString().slice(0, 10),
        time: '13:30',
        status: 'requested',
        createdAt: new Date(now - day * 0.5).toISOString(),
      },
      {
        id: 'APT-2049',
        customerName: 'Zara Hughes',
        email: 'zara@example.com',
        phone: '+1 416 555 0110',
        serviceId: 'boho-braids',
        serviceName: 'Boho Goddess Braids',
        date: new Date(now - day * 1).toISOString().slice(0, 10),
        time: '09:00',
        status: 'completed',
        createdAt: new Date(now - day * 5).toISOString(),
      },
    ],
  }
}

function getDb(): DB {
  if (!globalForDb.__lucheDb) {
    globalForDb.__lucheDb = seed()
  } else {
    // Preserve data from a hot-reloaded preview while backfilling fields added
    // by newer versions of the in-memory store.
    const db = globalForDb.__lucheDb as Partial<DB>
    if (!Array.isArray(db.products)) db.products = []
    if (!Array.isArray(db.services)) db.services = []
    if (!Array.isArray(db.orders)) db.orders = []
    if (!Array.isArray(db.appointments)) db.appointments = []
  }
  return globalForDb.__lucheDb
}

function genId(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`
}

export function listOrders(): Order[] {
  return [...getDb().orders].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )
}

export function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const order: Order = {
    ...input,
    id: genId('LUC'),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }
  getDb().orders.unshift(order)
  return order
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const order = getDb().orders.find((o) => o.id === id)
  if (!order) return null
  order.status = status
  return order
}

export function listAppointments(): Appointment[] {
  return [...getDb().appointments].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )
}

export function createAppointment(
  input: Omit<Appointment, 'id' | 'createdAt' | 'status'>,
): Appointment {
  const appointment: Appointment = {
    ...input,
    id: genId('APT'),
    createdAt: new Date().toISOString(),
    status: 'requested',
  }
  getDb().appointments.unshift(appointment)
  return appointment
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Appointment | null {
  const appointment = getDb().appointments.find((a) => a.id === id)
  if (!appointment) return null
  appointment.status = status
  return appointment
}

export function listProducts() { return [...getDb().products] }
export function listServices() { return [...getDb().services] }
export function reserveProductStock(reservations: { productId: string; combinationId?: string; quantity: number }[]) {
  const db = getDb()
  const aggregated = new Map<string, { productId: string; combinationId?: string; quantity: number }>()
  for (const reservation of reservations) {
    const key = `${reservation.productId}:${reservation.combinationId ?? 'simple'}`
    const current = aggregated.get(key)
    if (current) current.quantity += reservation.quantity
    else aggregated.set(key, { ...reservation })
  }
  const rows = [...aggregated.values()].map((reservation) => ({
    reservation,
    product: db.products.find((item) => item.id === reservation.productId),
  }))
  if (rows.some(({ reservation, product }) => {
    if (!product) return true
    if (reservation.combinationId) {
      return (product.combinations?.find((item) => item.id === reservation.combinationId)?.stockQuantity ?? -1) < reservation.quantity
    }
    return (product.stockQuantity ?? 0) < reservation.quantity
  })) return false
  for (const { reservation, product } of rows) {
    if (!product) continue
    if (reservation.combinationId) {
      const combination = product.combinations?.find((item) => item.id === reservation.combinationId)
      if (combination) combination.stockQuantity -= reservation.quantity
    } else {
      product.stockQuantity = (product.stockQuantity ?? 0) - reservation.quantity
    }
  }
  return true
}
export function getProductStats() {
  const db = getDb()
  const soldById = new Map<string, number>()
  for (const order of db.orders) {
    if (order.status === 'cancelled') continue
    for (const item of order.items) {
      if (item.productId) soldById.set(item.productId, (soldById.get(item.productId) ?? 0) + item.quantity)
    }
  }
  const products = db.products.map((product) => {
    const stock = product.options?.length
      ? (product.combinations ?? []).reduce((sum, combination) => sum + combination.stockQuantity, 0)
      : product.stockQuantity ?? 0
    return { stock, sold: soldById.get(product.id) ?? 0 }
  })
  return {
    available: products.reduce((sum, product) => sum + product.stock, 0),
    sold: products.reduce((sum, product) => sum + product.sold, 0),
    lowStock: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
    outOfStock: products.filter((product) => product.stock === 0).length,
  }
}
export function getServiceStats() {
  const services = getDb().services
  const appointments = getDb().appointments
  const now = Date.now()
  return {
    total: services.length,
    bookings: appointments.length,
    completed: appointments.filter((appointment) => appointment.status === 'completed').length,
    upcoming: appointments.filter((appointment) => (appointment.status === 'requested' || appointment.status === 'confirmed') && new Date(`${appointment.date}T${appointment.time || '00:00'}:00`).getTime() >= now).length,
  }
}
export function upsertProduct(product: Product) {
  const db = getDb()
  const index = db.products.findIndex((item) => item.id === product.id)
  if (index >= 0) db.products[index] = product
  else db.products.unshift(product)
  return product
}
export function deleteProduct(id: string) { getDb().products = getDb().products.filter((item) => item.id !== id) }
export function upsertService(service: Service) {
  const db = getDb()
  const index = db.services.findIndex((item) => item.id === service.id)
  if (index >= 0) db.services[index] = service
  else db.services.unshift(service)
  return service
}
export function deleteService(id: string) { getDb().services = getDb().services.filter((item) => item.id !== id) }


