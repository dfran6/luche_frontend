'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
export async function loginAdmin(formData: FormData) {
  const response = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }), cache: 'no-store' })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) return { error: result.detail || 'Sign in failed. Check your email and password.' }
  if (!['admin', 'super_admin'].includes(result.role)) return { error: 'This account does not have admin access.' }
  const jar = await cookies()
  const secure = process.env.NODE_ENV === 'production'
  jar.set('luche-admin-access', result.access_token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 })
  jar.set('luche-admin-refresh', result.refresh_token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 2 })
  redirect('/admin')
}

export async function logoutAdmin() {
  const jar = await cookies()
  const access = jar.get('luche-admin-access')?.value
  const refresh = jar.get('luche-admin-refresh')?.value
  if (access) await fetch(`${API}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }), cache: 'no-store' }).catch(() => undefined)
  jar.delete('luche-admin-access'); jar.delete('luche-admin-refresh')
  redirect('/login')
}
