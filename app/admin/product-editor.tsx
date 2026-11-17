'use client'

import { useActionState, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Product, ProductCombination } from '@/lib/types'
import { saveProductAction, type CatalogActionState } from './catalog-actions'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const input = 'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-base md:text-sm'
const initialActionState: CatalogActionState = {}
type OptionDraft = { id: string; name: string; variants: { id: string; label: string; externalId?: string }[] }
type CombinationDraft = ProductCombination & { key: string; label: string }

/** Shows the product's saved image, and a live preview of any new file picked. */
function ProductImageField({ current }: { current?: string }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const hasCurrent = Boolean(current) && current !== '/placeholder.svg'
  const src = preview ?? (hasCurrent && !failed ? current : null)
  const caption = preview
    ? 'New image. It replaces the current one when you save.'
    : src
      ? 'Current image'
      : failed
        ? 'The current image could not be loaded.'
        : 'No image yet.'

  return (
    <div className="sm:col-span-2">
      <span className="text-sm">Product image</span>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid size-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={preview ? 'Preview of the selected image' : 'Current product image'}
              className="size-full object-cover"
              onError={() => (preview ? setPreview(null) : setFailed(true))}
            />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <p className="text-muted-foreground">{caption}</p>
          <input
            className={input}
            name="imageFile"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label="Choose a product image"
            onChange={(event) => {
              const file = event.target.files?.[0]
              setPreview(file ? URL.createObjectURL(file) : null)
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP. Maximum 5 MB per image.</p>
        </div>
      </div>
    </div>
  )
}

function keyFor(selections: Record<string, string>) {
  return Object.entries(selections).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}=${value}`).join('|')
}

function makeOptions(options: Product['options'] = []): OptionDraft[] {
  return options.map((option) => ({ id: option.id ?? crypto.randomUUID(), name: option.name, variants: option.variants.map(({ id, label, externalId }) => ({ id, label, externalId })) }))
}

export function ProductEditor({ product, trigger }: { product?: Product; trigger: ReactNode }) {
  const [hasVariants, setHasVariants] = useState(Boolean(product?.options?.length))
  const [options, setOptions] = useState<OptionDraft[]>(() => makeOptions(product?.options))
  const [open, setOpen] = useState(false)
  const [actionState, formAction, pending] = useActionState(saveProductAction, initialActionState)
  const [inventory, setInventory] = useState<Record<string, { id: string; stockQuantity: number; priceDelta: number; sku?: string; image?: string }>>(() => {
    const initial: Record<string, { id: string; stockQuantity: number; priceDelta: number; sku?: string; image?: string }> = {}
    for (const combination of product?.combinations ?? []) {
      initial[keyFor(combination.selections)] = { id: combination.id, stockQuantity: combination.stockQuantity, priceDelta: combination.priceDelta, sku: combination.sku, image: combination.image }
    }
    return initial
  })

  const combinations = useMemo<CombinationDraft[]>(() => {
    if (!hasVariants || options.length === 0 || options.some((option) => !option.name.trim() || option.variants.length === 0)) return []
    const result: CombinationDraft[] = []
    const walk = (index: number, selections: Record<string, string>, labels: string[]) => {
      if (index === options.length) {
        const key = keyFor(selections)
        const saved = inventory[key]
        result.push({ id: saved?.id ?? `draft:${key}`, key, selections: { ...selections }, label: labels.join(' · '), stockQuantity: saved?.stockQuantity ?? 0, priceDelta: saved?.priceDelta ?? 0, sku: saved?.sku, image: saved?.image })
        return
      }
      const option = options[index]
      for (const value of option.variants) {
        if (!value.label.trim()) return
        walk(index + 1, { ...selections, [option.id]: value.id }, [...labels, value.label])
      }
    }
    walk(0, {}, [])
    return result
  }, [hasVariants, options, inventory])

  function addOption() {
    setOptions((current) => [...current, { id: crypto.randomUUID(), name: '', variants: [{ id: crypto.randomUUID(), label: '' }] }])
  }
  function updateOption(optionId: string, update: (option: OptionDraft) => OptionDraft) {
    setOptions((current) => current.map((option) => option.id === optionId ? update(option) : option))
  }
  function updateCombination(combination: CombinationDraft, patch: Partial<CombinationDraft>) {
    setInventory((current) => ({ ...current, [combination.key]: { ...current[combination.key], id: combination.id, stockQuantity: combination.stockQuantity, priceDelta: combination.priceDelta, sku: combination.sku, image: combination.image, ...patch } }))
  }

  useEffect(() => {
    if (actionState.error) toast.error(actionState.error)
    if (actionState.message) {
      toast.success(actionState.message)
      setOpen(false)
    }
  }, [actionState])

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger render={<button type="button" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary" />}>{trigger}</DialogTrigger>
    <DialogContent className="max-h-[92dvh] w-[min(96vw,760px)] max-w-none overflow-y-auto p-0 sm:max-w-[760px]">
      <form action={formAction}>
        <div className="space-y-6 p-4 sm:p-6">
          <DialogHeader><DialogTitle>{product ? 'Edit product' : 'Add product'}</DialogTitle><DialogDescription>Set product details and manage inventory for each sellable combination.</DialogDescription></DialogHeader>
          {actionState.error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{actionState.error}</p>}
          <input type="hidden" name="id" value={product?.id || ''} />
          <input type="hidden" name="catalogData" value={JSON.stringify({ options: options.map(({ id, name, variants }) => ({ id, name: name.trim(), variants: variants.map(({ id, label, externalId }) => ({ id, label: label.trim(), externalId })) })), combinations: combinations.map(({ id, key, selections, stockQuantity, priceDelta, sku, image }) => ({ id: id.startsWith('draft:') ? undefined : id, key, selections, stockQuantity, priceDelta, sku, image })) })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">Name<input className={input} name="name" required defaultValue={product?.name} /></label>
            <label className="text-sm">Slug<input className={input} name="slug" required defaultValue={product?.slug} /></label>
            <label className="text-sm">Price (CAD)<input className={input} name="price" type="number" step="0.01" min="0" required defaultValue={product ? product.price / 100 : ''} /></label>
            <label className="text-sm">Category<select className={input} name="category" defaultValue={product?.category || 'braiding-hair'}><option value="braiding-hair">Braiding Hair</option><option value="extensions">Extensions</option><option value="hair-care">Hair Care</option><option value="accessories">Accessories</option><option value="tools">Styling Tools</option></select></label>
            <ProductImageField current={product?.image} />
            <label className="text-sm sm:col-span-2">Description<textarea className={input} name="description" rows={3} defaultValue={product?.shortDescription} /></label>
            <label className="text-sm sm:col-span-2">Product details <span className="text-muted-foreground">(one per line)</span><textarea className={input} name="details" rows={4} defaultValue={product?.details?.join('\n')} placeholder={'100% Kanekalon fibre\nPre-stretched\n48 inch length'} /></label>
            <label className="text-sm sm:col-span-2">Tags <span className="text-muted-foreground">(comma separated)</span><input className={input} name="tags" defaultValue={product?.tags?.join(', ')} placeholder="braiding, protective style" /></label>
            <div className="flex flex-wrap gap-x-6 gap-y-3 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />Studio favourite</label>
              <label className="flex items-center gap-2 text-sm"><input name="bestSeller" type="checkbox" defaultChecked={product?.bestSeller ?? false} />Best seller</label>
              <p className="text-xs text-muted-foreground sm:col-span-2">Studio favourite products appear in the home page spotlight. Keep this selected on one product at a time.</p>
            </div>
            {product && <p className="text-sm text-muted-foreground sm:col-span-2">Customer rating: {product.rating.toFixed(1)} / 5 · {product.reviewCount} reviews. Ratings and review counts are managed from customer reviews.</p>}
          </div>
          <section className="space-y-4 rounded-xl border border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-medium">Variants and inventory</h3><p className="mt-1 text-xs text-muted-foreground">Stock is tracked per complete choice, such as 1B# + 3X pack.</p></div><label className="flex min-h-10 shrink-0 items-center gap-2 text-sm"><input name="hasVariants" type="checkbox" checked={hasVariants} onChange={(event) => setHasVariants(event.target.checked)} />This product has options</label></div>
            {!hasVariants ? <label className="block max-w-xs text-sm">Quantity in stock<input className={input} name="stockQuantity" type="number" min="0" step="1" defaultValue={product?.stockQuantity ?? 0} /></label> : <div className="space-y-4">
              {options.map((option) => <fieldset key={option.id} className="space-y-3 rounded-lg bg-secondary/50 p-3 sm:p-4"><div className="flex items-end gap-3"><label className="flex-1 text-sm">Option group<input className={input} placeholder="Colour, Pack size" value={option.name} onChange={(event) => updateOption(option.id, (item) => ({ ...item, name: event.target.value }))} /></label><button type="button" className="mb-1 text-sm text-destructive" onClick={() => setOptions((current) => current.filter((item) => item.id !== option.id))}>Remove group</button></div>
                {option.variants.map((value) => <div key={value.id} className="flex items-end gap-2"><label className="flex-1 text-sm">Choice value<input className={input} placeholder="e.g. 1B# Off Black" value={value.label} onChange={(event) => updateOption(option.id, (item) => ({ ...item, variants: item.variants.map((row) => row.id === value.id ? { ...row, label: event.target.value } : row) }))} /></label><button type="button" className="mb-2 text-sm text-destructive" onClick={() => updateOption(option.id, (item) => ({ ...item, variants: item.variants.filter((row) => row.id !== value.id) }))}>Remove</button></div>)}
                <button type="button" className="text-sm font-medium text-accent hover:underline" onClick={() => updateOption(option.id, (item) => ({ ...item, variants: [...item.variants, { id: crypto.randomUUID(), label: '' }] }))}>+ Add choice value</button>
              </fieldset>)}
              <button type="button" className="w-full rounded-md border border-dashed border-border px-3 py-2 text-sm hover:bg-secondary sm:w-auto" onClick={addOption}>+ Add option group</button>
              {combinations.length ? <div className="space-y-3"><h4 className="font-medium">Sellable combinations ({combinations.length})</h4>{combinations.map((combination) => <div key={combination.key} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_7rem_8rem_10rem]"><div className="self-center text-sm font-medium sm:col-span-2">{combination.label}</div><label className="text-xs text-muted-foreground">Stock<input className={input} type="number" min="0" step="1" value={combination.stockQuantity} onChange={(event) => updateCombination(combination, { stockQuantity: Math.max(0, Number(event.target.value) || 0) })} /></label><label className="text-xs text-muted-foreground">Price change (cents)<input className={input} type="number" step="1" value={combination.priceDelta} onChange={(event) => updateCombination(combination, { priceDelta: Number(event.target.value) || 0 })} /></label><label className="text-xs text-muted-foreground">SKU<input className={input} value={combination.sku || ''} onChange={(event) => updateCombination(combination, { sku: event.target.value || undefined })} /></label><label className="text-xs text-muted-foreground sm:col-span-2">Variant image {combination.image ? <span className="block truncate text-accent">Current image saved</span> : null}<input className={input} type="file" accept="image/png,image/jpeg,image/webp" name={`variantImage:${combination.key}`} /><span className="mt-1 block">Maximum 5 MB per image.</span></label></div>)}</div> : <p className="text-sm text-muted-foreground">Add a group and at least one value to create combinations.</p>}
            </div>}
          </section>
        </div>
        <DialogFooter><DialogClose render={<button type="button" className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>} /><button type="submit" disabled={pending} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">{pending ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
}


