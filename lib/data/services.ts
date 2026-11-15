import type { Service } from '@/lib/types'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
function mapService(row: Record<string, any>): Service {
  return { id: row.id, slug: row.slug, name: row.name, category: row.category, price: Math.round(Number(row.price ?? 0) * 100), durationMinutes: row.duration_minutes ?? 0, image: row.image || '/placeholder.svg', shortDescription: row.short_description || '', description: row.description || '', includes: row.includes ?? [], featured: Boolean(row.featured), isActive: row.is_active !== false }
}
export async function getAllServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API}/services?limit=100`, { next: { revalidate: 30 } })
    if (!response.ok) return []
    const body = await response.json()
    return (body.services ?? []).map(mapService)
  } catch { return [] }
}
export async function getAdminServices(): Promise<Service[]> {
  try {
    const jar = await (await import('next/headers')).cookies()
    const access = jar.get('luche-admin-access')?.value
    const response = await fetch(`${API}/services?limit=100`, { cache: 'no-store', headers: access ? { Authorization: `Bearer ${access}` } : {} })
    if (!response.ok) return []
    return ((await response.json()).services ?? []).map(mapService)
  } catch { return [] }
}
export async function getServiceAdminStats() {
  try {
    const jar = await (await import('next/headers')).cookies()
    const access = jar.get('luche-admin-access')?.value
    const response = await fetch(`${API}/services/admin/stats`, { cache: 'no-store', headers: access ? { Authorization: `Bearer ${access}` } : {} })
    return response.ok ? await response.json() : { services: 0, bookings: 0, completed: 0, upcoming: 0 }
  } catch { return { services: 0, bookings: 0, completed: 0, upcoming: 0 } }
}
export async function getServiceBySlug(slug: string) { return (await getAllServices()).find((s) => s.slug === slug) }
export async function getServiceById(id: string) { return (await getAllServices()).find((s) => s.id === id) }
