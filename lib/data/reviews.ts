import { cookies } from 'next/headers'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')

export type PendingProductReview = {
  id: string
  product_id: string
  customer_name: string
  email: string
  rating: number
  comment?: string | null
  created_at: string
  is_approved: boolean
}

export async function getAdminProductReviews(): Promise<PendingProductReview[]> {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) return []
  try {
    const response = await fetch(`${API}/products/reviews/all`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return []
    const reviews = await response.json()
    return Array.isArray(reviews) ? reviews : []
  } catch {
    return []
  }
}
