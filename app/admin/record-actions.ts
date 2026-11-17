'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { AppointmentStatus, OrderStatus } from '@/lib/types'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')

async function adminRequest(path: string, method: string, body?: unknown) {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) return { ok: false as const, error: 'Your admin session has expired. Please sign in again.' }
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  }).catch(() => null)
  if (!response) return { ok: false as const, error: 'Could not reach the backend. Try again.' }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    return { ok: false as const, error: typeof payload.detail === 'string' ? payload.detail : `Request failed (${response.status}).` }
  }
  return { ok: true as const }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const result = await adminRequest(`/orders/${id}/status`, 'PATCH', { status })
  if (result.ok) { revalidatePath('/admin/orders'); revalidatePath('/admin') }
  return result
}

export async function markOrderPaid(id: string) {
  const result = await adminRequest(`/orders/${id}/mark-paid`, 'POST')
  if (result.ok) { revalidatePath('/admin/orders'); revalidatePath('/admin') }
  return result
}

export async function updateOrderTotals(id: string, deliveryFee: number, taxTotal: number) {
  const result = await adminRequest(`/orders/${id}/totals`, 'PATCH', {
    delivery_fee: deliveryFee.toFixed(2),
    tax_total: taxTotal.toFixed(2),
    tax_breakdown: {},
  })
  if (result.ok) { revalidatePath('/admin/orders'); revalidatePath('/admin') }
  return result
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const result = await adminRequest(`/appointments/${id}/status`, 'PATCH', { status })
  if (result.ok) {
    revalidatePath('/admin/appointments')
    revalidatePath('/admin/services')
    revalidatePath('/admin')
  }
  return result
}

export async function markAppointmentPaid(id: string) {
  const result = await adminRequest(`/appointments/${id}/mark-paid`, 'POST')
  if (result.ok) { revalidatePath('/admin/appointments'); revalidatePath('/admin') }
  return result
}

export async function refundOrder(id: string) {
  const result = await adminRequest(`/payments/orders/${id}/refund`, 'POST', {})
  if (result.ok) { revalidatePath('/admin/orders'); revalidatePath('/admin') }
  return result
}

export async function refundAppointment(id: string) {
  const result = await adminRequest(`/payments/appointments/${id}/refund`, 'POST', {})
  if (result.ok) { revalidatePath('/admin/appointments'); revalidatePath('/admin') }
  return result
}

export async function approveProductReview(id: string) {
  const result = await adminRequest(`/products/reviews/${id}`, 'PATCH', { is_approved: true })
  if (result.ok) {
    revalidatePath('/admin/reviews')
    revalidatePath('/admin/products')
    revalidatePath('/shop/[slug]', 'page')
  }
  return result
}

export async function deleteProductReview(id: string) {
  const result = await adminRequest(`/products/reviews/${id}`, 'DELETE')
  if (result.ok) {
    revalidatePath('/admin/reviews')
    revalidatePath('/admin/products')
  }
  return result
}
