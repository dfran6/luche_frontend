import type { CartLine } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { getDeliveryOption, type DeliveryMethod } from '@/lib/delivery'

const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

export function whatsappOrderUrl(
  lines: CartLine[],
  orderNumber?: string,
  customer?: { name: string; phone: string; email: string; address?: { line1: string; line2?: string; city: string; province: string; postalCode: string } },
  verified?: { items: { product_name: string; variant_label?: string | null; quantity: number; unit_price: string }[]; subtotalCents: number },
  deliveryMethod?: DeliveryMethod,
) {
  const items = verified
    ? verified.items.map((item) => `• ${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ''} × ${item.quantity} — ${formatPrice(Number(item.unit_price) * item.quantity * 100)}`)
    : lines.map((line) => `• ${line.name}${line.variantLabel ? ` (${line.variantLabel})` : ''} × ${line.quantity} — ${formatPrice(line.unitPrice * line.quantity)}`)
  const subtotal = verified?.subtotalCents ?? lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const address = customer?.address ? `\nDelivery address: ${customer.address.line1}${customer.address.line2 ? `, ${customer.address.line2}` : ''}, ${customer.address.city}, ${customer.address.province}, ${customer.address.postalCode}, Canada` : ''
  const delivery = deliveryMethod ? getDeliveryOption(deliveryMethod) : null
  const deliveryLine = delivery ? `\n${delivery.whatsappLine}` : ''
  const ask = delivery ? `Please confirm ${delivery.confirmOnWhatsapp}.` : 'Please confirm delivery, taxes and payment.'
  const message = `Hello LUCHE, I would like to confirm this order${orderNumber ? ` (${orderNumber})` : ''}:\n${items.join('\n')}\n\nSubtotal: ${formatPrice(subtotal)}${deliveryLine}${customer ? `\nName: ${customer.name}\nPhone: ${customer.phone}\nEmail: ${customer.email}${address}` : ''}\n${ask}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function whatsappServiceUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
