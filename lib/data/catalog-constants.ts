import type { ProductCategory } from '@/lib/types'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'braiding-hair': 'Braiding Hair', extensions: 'Extensions', 'hair-care': 'Hair Care', accessories: 'Accessories', tools: 'Styling Tools',
}
export const CATEGORY_ORDER: ProductCategory[] = ['braiding-hair', 'extensions', 'hair-care', 'accessories', 'tools']
