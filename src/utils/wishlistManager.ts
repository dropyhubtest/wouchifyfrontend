import type { DealCardItem } from '../data/dealsPage'

const WISHLIST_STORAGE_KEY = 'wouchify_wishlist'
const WISHLIST_EVENT = 'wouchify_wishlist_updated'

export const getWishlist = (): DealCardItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('Failed to read wishlist from localStorage:', err)
  }
  return []
}

export const getWishlistCount = (): number => {
  return getWishlist().length
}

export const isWishlisted = (id: string | number): boolean => {
  const current = getWishlist()
  return current.some((item) => String(item.id) === String(id))
}

export const toggleWishlist = (item: DealCardItem): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const current = getWishlist()
    const targetId = String(item.id)
    const exists = current.some((d) => String(d.id) === targetId)

    let updated: DealCardItem[]
    let added = false

    if (exists) {
      updated = current.filter((d) => String(d.id) !== targetId)
      added = false
    } else {
      updated = [item, ...current]
      added = true
    }

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(
      new CustomEvent(WISHLIST_EVENT, {
        detail: {
          items: updated,
          count: updated.length,
          targetId,
          added
        }
      })
    )
    return added
  } catch (err) {
    console.warn('Failed to update wishlist:', err)
    return false
  }
}

export const removeFromWishlist = (id: string | number): void => {
  if (typeof window === 'undefined') return
  try {
    const current = getWishlist()
    const targetId = String(id)
    const updated = current.filter((d) => String(d.id) !== targetId)
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(
      new CustomEvent(WISHLIST_EVENT, {
        detail: {
          items: updated,
          count: updated.length,
          targetId,
          added: false
        }
      })
    )
  } catch (err) {
    console.warn('Failed to remove from wishlist:', err)
  }
}
