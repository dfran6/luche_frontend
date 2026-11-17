import { getAdminProducts, getProductAdminStats } from '@/lib/data/products'
import { Boxes, CircleAlert, PackageCheck, PackageX } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { CatalogDeleteForm } from '@/components/admin/catalog-delete-form'
import { ProductEditor } from '../product-editor'

export default async function ProductsPage() {
  const [products, stats] = await Promise.all([getAdminProducts(), getProductAdminStats()])
  const cards = [
    { label: 'Units available', value: stats.available, icon: Boxes },
    { label: 'Units sold', value: stats.sold, icon: PackageCheck },
    { label: 'Low stock products', value: stats.low_stock, icon: CircleAlert },
    { label: 'Out of stock products', value: stats.out_of_stock, icon: PackageX },
  ]
  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-serif text-3xl">Products &amp; inventory</h1><p className="mt-1 text-sm text-muted-foreground">Manage products, variants, and available stock.</p></div><ProductEditor trigger="Add product" /></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map((card) => <div key={card.label} className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wide-sm text-muted-foreground">{card.label}</span><card.icon className="size-4 text-accent" /></div><p className="mt-3 font-serif text-2xl text-foreground">{card.value}</p></div>)}</div>
    <div className="space-y-3">{products.map((product) => <article key={product.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><img src={product.image || '/placeholder.svg'} alt="" className="size-16 shrink-0 rounded-lg border border-border bg-secondary object-cover" /><div className="min-w-0"><p className="truncate font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{formatPrice(product.price)} · {product.category}</p><p className="mt-1 text-xs text-muted-foreground">{product.options?.length ? `${product.options.length} option group${product.options.length === 1 ? '' : 's'}` : `${product.stockQuantity ?? 0} in stock · no variants`}</p><p className="mt-1 text-xs text-muted-foreground">★ {product.rating.toFixed(1)} · {product.reviewCount} reviews{product.featured ? ' · Studio favourite' : ''}{product.bestSeller ? ' · Best seller' : ''}</p></div></div><div className="flex shrink-0 gap-2"><ProductEditor product={product} trigger="Edit product" /><CatalogDeleteForm id={product.id} kind="product" /></div></article>)}</div>
  </div>
}
