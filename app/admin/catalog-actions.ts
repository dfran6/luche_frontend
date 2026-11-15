'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API = (process.env.BACKEND_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '')
async function request(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get('luche-admin-access')?.value
  if (!token) throw new Error('Please sign in with an admin account.')
  let response: Response
  try {
    response = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, ...init.headers }, cache: 'no-store' })
  } catch {
    throw new Error('Could not reach the backend. Please try again.')
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail = body?.detail
    if (typeof detail === 'string') throw new Error(detail)
    if (Array.isArray(detail)) {
      const messages = detail.map((issue: any) => typeof issue?.msg === 'string' ? issue.msg : null).filter(Boolean)
      if (messages.length) throw new Error(messages.join(' '))
    }
    throw new Error(`Request failed (${response.status}).`)
  }
  return response.status === 204 ? null : response.json()
}
function fileField(data: FormData) {
  const file = data.get('imageFile')
  return file instanceof File && file.size ? file : undefined
}
function revalidateCatalog() {
  for (const path of ['/admin/products', '/admin/services', '/shop', '/services', '/booking', '/']) revalidatePath(path)
}

export type CatalogActionState = { error?: string; message?: string }

function actionError(error: unknown): CatalogActionState {
  return { error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' }
}

export async function saveProduct(formData: FormData) {
  const id = String(formData.get('id') || '')
  const catalog = JSON.parse(String(formData.get('catalogData') || '{}'))
  const hasVariants = formData.get('hasVariants') === 'on'
  const options = hasVariants ? (catalog.options ?? []).map((option: any, index: number) => ({
    name: String(option.name).trim(), position: index + 1,
    values: (option.variants ?? []).map((value: any, valueIndex: number) => ({ label: String(value.label).trim(), external_id: value.externalId ?? (id ? undefined : String(value.id)), position: valueIndex + 1 })),
  })) : []
  const variants = hasVariants ? (catalog.combinations ?? []).map((combo: any) => ({
    sku: combo.sku || undefined, price_delta: Number(combo.priceDelta || 0) / 100, stock_quantity: Number(combo.stockQuantity), is_active: true,
    selections: Object.fromEntries(options.map((option: any, index: number) => {
      const selectedId = String(combo.selections[catalog.options[index].id])
      const selected = catalog.options[index].variants.find((value: any) => String(value.id) === selectedId)
      return [option.name, String(selected?.label ?? selectedId)]
    })),
  })) : []
  if (hasVariants && (!options.length || options.some((option: any) => !option.values.length) || !variants.length)) throw new Error('Add at least one option group, a value for each group, and inventory for every combination.')
  const description = String(formData.get('description') || '')
  const details = String(formData.get('details') || '').split('\n').map((value) => value.trim()).filter(Boolean)
  const tags = String(formData.get('tags') || '').split(',').map((value) => value.trim()).filter(Boolean)
  const body: any = {
    name: String(formData.get('name') || '').trim(), slug: String(formData.get('slug') || '').trim(),
    category: String(formData.get('category') || 'braiding-hair'), price: Number(formData.get('price')),
    short_description: description, description, details, tags,
    featured: formData.get('featured') === 'on', best_seller: formData.get('bestSeller') === 'on',
    ...(hasVariants ? { option_groups: options, variants } : { stock_quantity: Number(formData.get('stockQuantity') || 0) }),
  }
  if (!body.name || !body.slug || !Number.isFinite(body.price)) throw new Error('Enter a name, slug, and valid price.')
  const file = fileField(formData)
  if (id) {
    const patch: any = { name: body.name, slug: body.slug, category: body.category, price: body.price, short_description: description, description, details, tags, featured: body.featured, best_seller: body.best_seller, option_groups: options, variants, ...(!hasVariants ? { stock_quantity: body.stock_quantity } : {}) }
    await request(`/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (file) { const upload = new FormData(); upload.set('file', file); await request(`/products/${id}/image`, { method: 'POST', body: upload }) }
  } else {
    const multipart = new FormData(); multipart.set('data', JSON.stringify(body)); if (file) multipart.set('file', file)
    await request('/products/', { method: 'POST', body: multipart })
  }
  revalidateCatalog()
}

export async function removeProduct(formData: FormData) {
  await request(`/products/${String(formData.get('id'))}`, { method: 'DELETE' }); revalidateCatalog()
}

export async function saveService(formData: FormData) {
  const id = String(formData.get('id') || '')
  const description = String(formData.get('description') || '')
  const includes = String(formData.get('includes') || '').split('\n').map((value) => value.trim()).filter(Boolean)
  const body = {
    name: String(formData.get('name') || '').trim(), slug: String(formData.get('slug') || '').trim(),
    category: String(formData.get('category') || 'braids'), price: Number(formData.get('price')),
    duration_minutes: Number(formData.get('duration') || 60), short_description: description, description,
    includes, is_active: formData.get('isActive') === 'on', featured: formData.get('featured') === 'on',
  }
  if (!body.name || !body.slug || !Number.isFinite(body.price)) throw new Error('Enter a name, slug, and valid price.')
  const file = fileField(formData)
  if (id) {
    await request(`/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (file) { const upload = new FormData(); upload.set('file', file); await request(`/services/${id}/image`, { method: 'POST', body: upload }) }
  } else {
    const multipart = new FormData(); multipart.set('data', JSON.stringify(body)); if (file) multipart.set('file', file)
    await request('/services/', { method: 'POST', body: multipart })
  }
  revalidateCatalog()
}

export async function removeService(formData: FormData) {
  await request(`/services/${String(formData.get('id'))}`, { method: 'DELETE' }); revalidateCatalog()
}

export async function saveProductAction(_previous: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  try { await saveProduct(formData); return { message: 'Product saved.' } }
  catch (error) { return actionError(error) }
}

export async function saveServiceAction(_previous: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  try { await saveService(formData); return { message: 'Service saved.' } }
  catch (error) { return actionError(error) }
}

export async function removeProductAction(_previous: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  try { await removeProduct(formData); return { message: 'Product deleted.' } }
  catch (error) { return actionError(error) }
}

export async function removeServiceAction(_previous: CatalogActionState, formData: FormData): Promise<CatalogActionState> {
  try { await removeService(formData); return { message: 'Service deleted.' } }
  catch (error) { return actionError(error) }
}
