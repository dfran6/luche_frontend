'use server'

import { revalidatePath } from 'next/cache'
import {
  updateOrderStatus,
  updateAppointmentStatus,
} from '@/lib/store/db'
import type {
  AppointmentStatus,
  CartLine,
  OrderStatus,
} from '@/lib/types'

export type CheckoutResult =
  | { ok: true; orderNumber: string; productTotalCents: number; items: { product_name: string; variant_label?: string | null; quantity: number; unit_price: string }[] }
  | { ok: false; error: string }

/**
 * Places an order. Prices are recomputed server-side from the catalog so a
 * tampered client cart cannot change what is charged.
 */
export async function placeOrder(
  customer: {
    name: string
    email: string
    phone: string
    shippingAddress: { line1: string; line2?: string; city: string; province: string; postalCode: string }
  },
  lines: Pick<CartLine, 'slug' | 'combinationId' | 'variantLabel' | 'quantity'>[],
): Promise<CheckoutResult> {
  const name = customer.name?.trim()
  const email = customer.email?.trim()
  const phone = customer.phone?.trim()
  if (!name || !email || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please complete your contact details.' }
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: 'Your cart is empty.' }
  }

  const apiBase = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
  try {
    const response = await fetch(`${apiBase}/orders/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        customer_name: name,
        email,
        phone,
        shipping_address: {
          line1: customer.shippingAddress.line1,
          line2: customer.shippingAddress.line2 || null,
          city: customer.shippingAddress.city,
          province: customer.shippingAddress.province,
          postal_code: customer.shippingAddress.postalCode,
          country: 'CA',
        },
        items: lines.map((line) => ({
          product_slug: line.slug,
          combination_id: line.combinationId || null,
          variant_label: line.variantLabel || null,
          quantity: line.quantity,
        })),
      }),
    })
    const result = await response.json()
    if (!response.ok) {
      const detail = typeof result.detail === 'string' ? result.detail : 'Could not create the order.'
      return { ok: false, error: detail }
    }
    return {
      ok: true,
      orderNumber: result.order_number,
      productTotalCents: Math.round(Number(result.product_total) * 100),
      items: Array.isArray(result.items) ? result.items : [],
    }
  } catch {
    return { ok: false, error: 'Could not reach the order service. Please try again in a moment.' }
  }
}

export type CheckoutPaymentStatus = {
  order_number?: string
  appointment_id?: string
  payment_status: string
  currency: string
  subtotal: number
  shipping: number
  tax: number
  tax_breakdown: { taxes?: { amount: number; rate?: { display_name?: string; percentage?: number } }[] }
  total: number
}

export async function getCheckoutPaymentStatus(sessionId: string): Promise<CheckoutPaymentStatus | null> {
  const apiBase = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
  try {
    const response = await fetch(`${apiBase}/checkout/session/${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function getAvailableAppointmentTimes(serviceId: string, date: string): Promise<string[]> {
  if (!serviceId || !date) return []
  const apiBase = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
  try {
    const query = new URLSearchParams({ service_id: serviceId, date })
    const response = await fetch(`${apiBase}/appointments/availability?${query}`, { cache: 'no-store' })
    if (!response.ok) return []
    const result = await response.json()
    return Array.isArray(result.available_times) ? result.available_times : []
  } catch {
    return []
  }
}

export type BookingResult =
  | { ok: true; appointmentId: string; checkoutUrl?: string }
  | { ok: false; error: string }

export async function bookAppointment(input: {
  name: string
  email: string
  phone: string
  serviceId: string
  date: string
  time: string
  notes?: string
}): Promise<BookingResult> {
  const name = input.name?.trim()
  const email = input.email?.trim()
  const phone = input.phone?.trim()

  if (!name || !email || !phone) {
    return { ok: false, error: 'Please complete your name, email and phone.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please provide a valid email address.' }
  }
  const serviceId = input.serviceId
  if (!serviceId) return { ok: false, error: 'Please choose a service.' }
  if (!input.date || !input.time) {
    return { ok: false, error: 'Please choose a date and time.' }
  }

  const apiBase = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
  try {
    const response = await fetch(`${apiBase}/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        customer_name: name,
        email,
        phone,
        service_id: serviceId,
        appointment_date: input.date,
        appointment_time: input.time,
        notes: input.notes?.trim() || null,
      }),
    })
    const result = await response.json()
    if (!response.ok) return { ok: false, error: typeof result.detail === 'string' ? result.detail : 'Could not request the appointment.' }
    return { ok: true, appointmentId: result.id }
  } catch {
    return { ok: false, error: 'Could not reach appointment booking. Please try again.' }
  }
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  updateOrderStatus(id, status)
  revalidatePath('/admin')
  revalidatePath('/admin/orders')
}

export async function setAppointmentStatus(id: string, status: AppointmentStatus) {
  updateAppointmentStatus(id, status)
  revalidatePath('/admin')
  revalidatePath('/admin/appointments')
}
