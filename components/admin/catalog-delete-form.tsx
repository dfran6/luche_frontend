'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { removeProductAction, removeServiceAction, type CatalogActionState } from '@/app/admin/catalog-actions'

const initialState: CatalogActionState = {}

export function CatalogDeleteForm({ id, kind }: { id: string; kind: 'product' | 'service' }) {
  const actionFn = kind === 'product' ? removeProductAction : removeServiceAction
  const [state, action, pending] = useActionState(actionFn, initialState)

  useEffect(() => {
    if (state.error) toast.error(state.error)
    if (state.message) toast.success(state.message)
  }, [state])

  return <form action={action} className="flex flex-col items-start gap-1">
    <input type="hidden" name="id" value={id} />
    <button disabled={pending} className="rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive disabled:opacity-60">{pending ? 'Deleting…' : 'Delete'}</button>
    {state.error && <p role="alert" className="max-w-60 text-xs text-destructive">{state.error}</p>}
  </form>
}
