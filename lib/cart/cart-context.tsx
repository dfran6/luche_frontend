'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine } from '@/lib/types'

const STORAGE_KEY = 'luche-cart-v1'

type AddInput = {
  productId: string
  combinationId?: string
  slug: string
  name: string
  image: string
  unitPrice: number
  quantity?: number
  variantLabel?: string
}

type CartState = { lines: CartLine[] }

type CartAction =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; input: AddInput }
  | { type: 'setQty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

const MAX_QTY = 20

function lineKey(productId: string, combinationId?: string) {
  return combinationId ? `${productId}::${combinationId}` : productId
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return { lines: action.lines }
    case 'add': {
      const { input } = action
      const key = lineKey(input.productId, input.combinationId)
      const qty = Math.min(MAX_QTY, Math.max(1, input.quantity ?? 1))
      const existing = state.lines.find((l) => l.key === key)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === key
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) }
              : l,
          ),
        }
      }
      return {
        lines: [
          ...state.lines,
          {
            key,
            productId: input.productId,
            combinationId: input.combinationId,
            slug: input.slug,
            name: input.name,
            image: input.image,
            unitPrice: input.unitPrice,
            quantity: qty,
            variantLabel: input.variantLabel,
          },
        ],
      }
    }
    case 'setQty': {
      const quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(action.quantity)))
      return {
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, quantity } : l,
        ),
      }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) }
    case 'clear':
      return { lines: [] }
    default:
      return state
  }
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (input: AddInput) => void
  setQty: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] })
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[]
        if (Array.isArray(parsed)) dispatch({ type: 'hydrate', lines: parsed })
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines))
    } catch {
      // ignore quota errors
    }
  }, [state.lines, hydrated])

  const add = useCallback((input: AddInput) => {
    dispatch({ type: 'add', input })
    setOpen(true)
  }, [])
  const setQty = useCallback((key: string, quantity: number) => {
    dispatch({ type: 'setQty', key, quantity })
  }, [])
  const remove = useCallback((key: string) => {
    dispatch({ type: 'remove', key })
  }, [])
  const clear = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.quantity, 0)
    const subtotal = state.lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0)
    return { lines: state.lines, count, subtotal, isOpen, setOpen, add, setQty, remove, clear }
  }, [state.lines, isOpen, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
