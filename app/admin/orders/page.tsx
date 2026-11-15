import { getAdminOrders } from '@/lib/data/admin-records'
import { formatPrice, formatDate } from '@/lib/format'
import { OrderStatusControl } from '@/components/admin/status-control'
import { MarkOrderPaid } from '@/components/admin/mark-order-paid'
import { OrderTotalsForm } from '@/components/admin/order-totals-form'

export const metadata = { title: 'Orders · Luché Studio Admin' }

function money(value: unknown) { return formatPrice(Math.round(Number(value ?? 0) * 100)) }
function shippingAddress(value: any) {
  if (!value?.line1) return 'Delivery address not provided'
  return [value.line1, value.line2, value.city, value.province, value.postal_code, value.country].filter(Boolean).join(', ')
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()
  return <div className="mx-auto max-w-5xl space-y-8">
    <div><h1 className="font-serif text-3xl text-foreground">Orders</h1><p className="mt-1 text-sm text-muted-foreground">{orders.length} recent order{orders.length === 1 ? '' : 's'} · confirm WhatsApp payments and update fulfilment.</p></div>
    {orders.length === 0 ? <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">No orders found, or the backend could not be reached.</p> : <div className="space-y-4">{orders.map((order: any) => <article key={order.id} className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-medium text-foreground">{order.customer_name}</h2><span className="text-xs text-muted-foreground">{order.order_number}</span></div><p className="text-xs text-muted-foreground">{order.email} · {formatDate(order.created_at)} · {order.phone}</p><p className="mt-1 text-xs text-muted-foreground">{shippingAddress(order.shipping_address)}</p><p className="mt-1 text-xs capitalize text-muted-foreground">Payment: {String(order.payment_status).replaceAll('_', ' ')}</p></div>
        <div className="flex flex-wrap items-center gap-3"><span className="font-serif text-lg text-foreground">{money(order.grand_total)}</span><MarkOrderPaid id={order.id} paymentStatus={order.payment_status} /><OrderStatusControl id={order.id} status={order.status} paymentStatus={order.payment_status} /></div>
      </div>
      <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm">{(order.items ?? []).map((item: any, index: number) => <li key={item.id ?? index} className="flex justify-between gap-4 text-muted-foreground"><span>{item.quantity} × {item.product_name}{item.variant_label ? <span className="text-xs"> ({item.variant_label})</span> : null}</span><span className="shrink-0 text-foreground">{money(Number(item.unit_price) * item.quantity)}</span></li>)}</ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground"><span>Items {money(order.product_total)} · Delivery {money(order.delivery_fee)} · Tax {money(order.tax_total)}</span><span>Confirm payment with the customer before marking paid.</span></div>
      <OrderTotalsForm id={order.id} deliveryFee={Number(order.delivery_fee ?? 0)} taxTotal={Number(order.tax_total ?? 0)} paymentStatus={order.payment_status} />
    </article>)}</div>}
  </div>
}
