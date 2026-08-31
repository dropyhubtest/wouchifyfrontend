import { SUBCATEGORIES_DATA } from './subcategoriesData'
import { STORES_DIRECTORY_DATA } from './storesDirectoryData'
import { BRANDS_DIRECTORY_DATA } from './brandsDirectoryData'
import { BANKS_DIRECTORY_DATA } from './banksDirectoryData'
import { FESTIVALS_DIRECTORY_DATA } from './festivalsDirectoryData'
import { TRAVELLING_DIRECTORY_DATA } from './travellingDirectoryData'
import { CITIES_DEALS_DIRECTORY_DATA } from './citiesDealsDirectoryData'

export type DirectoryEntityType =
  | 'stores'
  | 'brands'
  | 'banks'
  | 'festivals'
  | 'travelling'
  | 'cities-deals'
  | 'categories'

export interface UnifiedDirectoryItem {
  id: string
  name: string
  slug: string
  logo: string
  href: string
  letter: string
  type: DirectoryEntityType
}

// Priority mapping for deduplication: stores > brands > banks > festivals > travelling > cities-deals > categories
const TYPE_PRIORITY: Record<DirectoryEntityType, number> = {
  stores: 1,
  brands: 2,
  banks: 3,
  festivals: 4,
  travelling: 5,
  'cities-deals': 6,
  categories: 7,
}

/**
 * Builds the complete unified directory by combining the 7 datasets with priority deduplication.
 */
export function buildUnifiedDirectory(): UnifiedDirectoryItem[] {
  const allItems: UnifiedDirectoryItem[] = []

  // 1. Stores (61 items)
  STORES_DIRECTORY_DATA.forEach((s) => {
    allItems.push({
      id: `store-${s.id}`,
      name: s.name,
      slug: s.slug,
      logo: s.logo,
      href: s.destinationHref || `/stores#${s.slug}`,
      letter: (s.letter || s.name.charAt(0)).toUpperCase(),
      type: 'stores',
    })
  })

  // 2. Brands (88 items)
  BRANDS_DIRECTORY_DATA.forEach((b) => {
    allItems.push({
      id: `brand-${b.id}`,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      href: b.destinationHref || `/categories/brands#${b.slug}`,
      letter: (b.letter || b.name.charAt(0)).toUpperCase(),
      type: 'brands',
    })
  })

  // 3. Banks (9 items)
  BANKS_DIRECTORY_DATA.forEach((bk) => {
    allItems.push({
      id: `bank-${bk.id}`,
      name: bk.name,
      slug: bk.slug,
      logo: bk.logo,
      href: bk.destinationHref || `/categories/banks#${bk.slug}`,
      letter: (bk.letter || bk.name.charAt(0)).toUpperCase(),
      type: 'banks',
    })
  })

  // 4. Festivals (29 items)
  FESTIVALS_DIRECTORY_DATA.forEach((f) => {
    allItems.push({
      id: `festival-${f.id}`,
      name: f.name,
      slug: f.slug,
      logo: f.image,
      href: f.destinationHref || `/categories/festivals#${f.slug}`,
      letter: (f.letter || f.name.charAt(0)).toUpperCase(),
      type: 'festivals',
    })
  })

  // 5. Travelling (43 items)
  TRAVELLING_DIRECTORY_DATA.forEach((t) => {
    allItems.push({
      id: `travelling-${t.id}`,
      name: t.name,
      slug: t.slug,
      logo: t.logo,
      href: t.destinationHref || `/categories/travelling#${t.slug}`,
      letter: (t.letter || t.name.charAt(0)).toUpperCase(),
      type: 'travelling',
    })
  })

  // 6. Cities Deals (7 items)
  CITIES_DEALS_DIRECTORY_DATA.forEach((c) => {
    allItems.push({
      id: `city-${c.id}`,
      name: c.name,
      slug: c.slug,
      logo: c.image,
      href: c.destinationHref || `/categories/cities-deals#${c.slug}`,
      letter: (c.letter || c.name.charAt(0)).toUpperCase(),
      type: 'cities-deals',
    })
  })

  // 7. Categories / Subcategories (114 items)
  SUBCATEGORIES_DATA.forEach((sc) => {
    allItems.push({
      id: `cat-${sc.id}`,
      name: sc.name,
      slug: sc.slug,
      logo: sc.image,
      href: `/categories/${sc.slug}`,
      letter: (sc.letter || sc.name.charAt(0)).toUpperCase(),
      type: 'categories',
    })
  })

  // Deduplicate by case-insensitive name keeping highest priority entity
  const dedupedMap = new Map<string, UnifiedDirectoryItem>()

  allItems.forEach((item) => {
    const key = item.name.trim().toLowerCase()
    const existing = dedupedMap.get(key)
    if (!existing) {
      dedupedMap.set(key, item)
    } else {
      const existingPri = TYPE_PRIORITY[existing.type] || 99
      const currentPri = TYPE_PRIORITY[item.type] || 99
      if (currentPri < existingPri) {
        dedupedMap.set(key, item)
      }
    }
  })

  const merged = Array.from(dedupedMap.values())

  // Sort alphabetically case-insensitive
  merged.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

  return merged
}

export const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export interface LetterGroup {
  letter: string
  items: UnifiedDirectoryItem[]
  rows: number
}

/**
 * Groups directory items by all 26 alphabet letters (A-Z).
 */
export function groupDirectoryByAlphabet(
  items: UnifiedDirectoryItem[]
): LetterGroup[] {
  return ALPHABET_LETTERS.map((letter) => {
    const matching = items.filter((item) => {
      const firstChar = (item.letter || item.name.charAt(0)).toUpperCase()
      return firstChar === letter
    })
    return {
      letter,
      items: matching,
      rows: Math.ceil(matching.length / 3),
    }
  })
}
