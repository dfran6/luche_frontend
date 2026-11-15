'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Service } from '@/lib/types'
import { saveServiceAction, type CatalogActionState } from '@/app/admin/catalog-actions'

const initialState: CatalogActionState = {}
const input = 'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm'

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action, pending] = useActionState(saveServiceAction, initialState)

  useEffect(() => {
    if (state.error) toast.error(state.error)
    if (state.message) toast.success(state.message)
  }, [state])

  return <form action={action} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
    <input type="hidden" name="id" value={service?.id || ''} />
    <label className="text-sm">Name<input className={input} name="name" required defaultValue={service?.name} /></label>
    <label className="text-sm">Slug<input className={input} name="slug" required defaultValue={service?.slug} /></label>
    <label className="text-sm">Price (CAD)<input className={input} name="price" type="number" step="0.01" min="0" required defaultValue={service ? service.price / 100 : ''} /></label>
    <label className="text-sm">Duration (minutes)<input className={input} name="duration" type="number" min="1" required defaultValue={service?.durationMinutes || 60} /></label>
    <label className="text-sm">Category<select className={input} name="category" defaultValue={service?.category || 'braids'}><option value="braids">Braids</option><option value="weaves">Weaves</option><option value="natural">Natural</option><option value="treatments">Treatments</option><option value="beauty">Beauty</option></select></label>
    <label className="text-sm">Image file<input className={input} name="imageFile" type="file" accept="image/png,image/jpeg,image/webp" /></label>
    <label className="text-sm sm:col-span-2">Description<textarea className={input} name="description" rows={2} defaultValue={service?.shortDescription} /></label>
    <label className="text-sm sm:col-span-2">What’s included <span className="text-muted-foreground">(one per line)</span><textarea className={input} name="includes" rows={3} defaultValue={service?.includes.join('\n')} placeholder={'Consultation\nWash and conditioning'} /></label>
    <div className="flex gap-6 sm:col-span-2"><label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={service?.featured ?? false} />Featured</label><label className="flex items-center gap-2 text-sm"><input name="isActive" type="checkbox" defaultChecked={service?.isActive ?? true} />Active and bookable</label></div>
    {state.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{state.error}</p>}
    <button disabled={pending} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60 sm:col-span-2">{pending ? 'Saving…' : service ? 'Save service' : 'Add service'}</button>
  </form>
}
