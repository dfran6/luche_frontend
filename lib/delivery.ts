/**
 * Delivery rules for LUCHE orders. Keep every customer-facing delivery
 * statement sourced from here so the storefront, the checkout and the
 * WhatsApp message always say the same thing.
 *
 * Pickup details are confirmed with the customer after the order is placed.
 */
export type DeliveryMethod = 'sydney' | 'outside' | 'pickup'

/** Flat delivery fee within Sydney, in cents (CAD). */
export const SYDNEY_FLAT_FEE_CENTS = 500

/** Display form of the flat fee, e.g. "CA$5". */
export const SYDNEY_FLAT_FEE_LABEL = `CA$${SYDNEY_FLAT_FEE_CENTS / 100}`

export const DELIVERY_OPTIONS: {
  id: DeliveryMethod
  title: string
  detail: string
  /** Fee in cents, or null when it depends on the destination. */
  feeCents: number | null
  /** Line added to the WhatsApp order message. */
  whatsappLine: string
  /** What the customer should expect to confirm on WhatsApp. */
  confirmOnWhatsapp: string
}[] = [
  {
    id: 'sydney',
    title: 'Delivery within Sydney',
    detail: `Flat fee of ${SYDNEY_FLAT_FEE_LABEL}. We deliver your order ourselves.`,
    feeCents: SYDNEY_FLAT_FEE_CENTS,
    whatsappLine: `Delivery: Within Sydney (flat ${SYDNEY_FLAT_FEE_LABEL})`,
    confirmOnWhatsapp: 'taxes and payment',
  },
  {
    id: 'pickup',
    title: 'Local pickup',
    detail: 'Free pickup. We will confirm the pickup time and location on WhatsApp.',
    feeCents: 0,
    whatsappLine: 'Delivery: Local pickup (free)',
    confirmOnWhatsapp: 'the pickup time and location, taxes and payment',
  },
  {
    id: 'outside',
    title: 'Shipping outside Sydney',
    detail: 'You pay the actual shipping cost. We confirm the amount on WhatsApp.',
    feeCents: null,
    whatsappLine: 'Delivery: Outside Sydney (I will pay the actual shipping cost)',
    confirmOnWhatsapp: 'the shipping cost, taxes and payment',
  },
]

export function getDeliveryOption(id: DeliveryMethod) {
  return DELIVERY_OPTIONS.find((option) => option.id === id)!
}
