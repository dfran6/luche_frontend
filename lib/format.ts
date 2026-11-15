/**
 * Format a price given in cents to a CAD currency string.
 * Built manually (not via Intl) so the output is identical on the server and
 * the client — Node and browser ICU data can disagree on the CAD symbol
 * (e.g. "CA$" vs "$"), which triggers React hydration mismatches.
 */
export function formatPrice(cents: number) {
  const value = cents / 100
  const negative = value < 0
  const [whole, fraction] = Math.abs(value).toFixed(2).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${negative ? '-' : ''}$${grouped}.${fraction}`
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
