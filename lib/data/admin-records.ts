import { cookies } from 'next/headers'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')

async function getAdminList(path: string, key: string) {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) return []
  const separator = path.includes('?') ? '&' : '?'
  const response = await fetch(`${API}${path}${separator}limit=100&offset=0`, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
  if (!response?.ok) return []
  const body = await response.json().catch(() => ({}))
  const records: any[] = Array.isArray(body[key]) ? body[key] : []
  const total = Number(body.pagination?.total ?? records.length)
  const pages = await Promise.all(Array.from({ length: Math.max(0, Math.ceil(total / 100) - 1) }, (_, index) => fetch(`${API}${path}${separator}limit=100&offset=${(index + 1) * 100}`, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }).then(async (page) => page.ok ? (await page.json())[key] ?? [] : []).catch(() => [])))
  return records.concat(...pages)
}

/**
 * Total earned from appointments marked completed, using each appointment's
 * listed service price. Cancelled, requested and confirmed bookings are excluded.
 */
export function summariseCompletedAppointments(appointments: any[]) {
  const completed = appointments.filter((a) => a.status === 'completed')
  const totalCents = completed.reduce((sum, a) => sum + Math.round(Number(a.service_price ?? 0) * 100), 0)
  return { count: completed.length, totalCents }
}

export function getAdminOrders() {
  return getAdminList('/orders', 'orders')
}

export async function getAdminDashboardSummary() {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) return null
  try {
    const response = await fetch(`${API}/reports/admin/dashboard`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export function getAdminAppointments() {
  return getAdminList('/appointments/', 'appointments')
}
