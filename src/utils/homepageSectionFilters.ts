/**
 * Homepage Section Placement & Filtering Engine
 * Handles precise multi-section storefront filtering for all entities on the Wouchify Homepage.
 */

export interface BaseEntity {
  id?: string | number
  _id?: string | number
  name?: string
  title?: string
  status?: string
  submissionStatus?: string
  showOnHome?: boolean
  sectionPlacement?: string
  [key: string]: any
}

/**
 * Filter 1: Recently Added Deals (Homepage Section)
 * Target Placements: 'recent_deals', 'favourite', 'recently_added', 'both'
 */
export function filterRecentlyAddedDeals<T extends BaseEntity>(deals: T[]): T[] {
  if (!Array.isArray(deals)) return []
  return deals.filter((d) => {
    if (d.showOnHome === false) return false
    if (d.sectionPlacement === 'none') return false
    const placement = (d.sectionPlacement || '').toLowerCase()
    return (
      placement === 'recent_deals' ||
      placement === 'favourite' ||
      placement === 'recently_added' ||
      placement === 'both' ||
      (!d.sectionPlacement && !d.isBestSelling)
    )
  })
}

/**
 * Filter 2: Trending Best Sellers (Homepage Section)
 * Target Placements: 'trending_deals', 'best_selling', 'trending', 'both'
 */
export function filterTrendingDeals<T extends BaseEntity>(deals: T[]): T[] {
  if (!Array.isArray(deals)) return []
  return deals.filter((d) => {
    if (d.showOnHome === false) return false
    if (d.sectionPlacement === 'none') return false
    const placement = (d.sectionPlacement || '').toLowerCase()
    return (
      placement === 'trending_deals' ||
      placement === 'best_selling' ||
      placement === 'trending' ||
      placement === 'both' ||
      Boolean(d.isBestSelling)
    )
  })
}

/**
 * Filter 3: Flash Loot Deals (Homepage Section)
 * Target Placements: 'flash_loot', 'flash', 'both'
 */
export function filterFlashLootDeals<T extends BaseEntity>(lootDeals: T[]): T[] {
  if (!Array.isArray(lootDeals)) return []
  return lootDeals.filter((d) => {
    if (d.showOnHome === false) return false
    if (d.sectionPlacement === 'none') return false
    const placement = (d.sectionPlacement || '').toLowerCase()
    const lootType = (d.lootType || d.dealType || d.type || '').toLowerCase()
    return (
      placement === 'flash_loot' ||
      placement === 'flash' ||
      placement === 'both' ||
      placement === 'favourite' ||
      lootType === 'flash' ||
      Boolean(d.isFlash) ||
      (!d.sectionPlacement && !d.isExclusive && lootType !== 'exclusive') ||
      (placement !== 'exclusive_loot' && placement !== 'exclusive' && !d.isExclusive && lootType !== 'exclusive')
    )
  })
}

/**
 * Filter 4: Exclusive Loot Deals (Homepage Section)
 * Target Placements: 'exclusive_loot', 'exclusive', 'both'
 */
export function filterExclusiveLootDeals<T extends BaseEntity>(lootDeals: T[]): T[] {
  if (!Array.isArray(lootDeals)) return []
  return lootDeals.filter((d) => {
    if (d.showOnHome === false) return false
    if (d.sectionPlacement === 'none') return false
    const placement = (d.sectionPlacement || '').toLowerCase()
    const lootType = (d.lootType || d.dealType || d.type || '').toLowerCase()
    return (
      placement === 'exclusive_loot' ||
      placement === 'exclusive' ||
      placement === 'both' ||
      placement === 'favourite' ||
      lootType === 'exclusive' ||
      lootType === 'glitch' ||
      lootType === 'steal' ||
      lootType === 'under99' ||
      lootType === 'under199' ||
      lootType === 'freebie' ||
      Boolean(d.isExclusive)
    )
  })
}

/**
 * Filter 5: Most Popular Brands (Homepage Section)
 */
export function filterPopularBrands<T extends BaseEntity>(brands: T[]): T[] {
  if (!Array.isArray(brands)) return []
  return brands.filter((b) => b.showOnHome !== false && b.sectionPlacement !== 'none')
}

/**
 * Filter 6: Shop by Top Stores (Homepage Section)
 */
export function filterTopStores<T extends BaseEntity>(stores: T[]): T[] {
  if (!Array.isArray(stores)) return []
  return stores.filter((s) => s.showOnHome !== false && s.sectionPlacement !== 'none')
}

/**
 * Filter 7: Homepage Advertisements & Banners
 */
export function filterHomepageAdvertisements<T extends BaseEntity>(ads: T[]): T[] {
  if (!Array.isArray(ads)) return []
  return ads.filter((ad) => {
    if (ad.status && ad.status !== 'active') return false
    const placement = (ad.placement || ad.position || ad.type || '').toLowerCase()
    return (
      placement === 'homepage-banner-1713x685' ||
      placement === 'homepage_banner' ||
      placement === 'homepage' ||
      placement === 'home' ||
      !ad.placement
    )
  })
}

/**
 * Filter 8: Featured Credit Cards (Homepage Section)
 */
export function filterFeaturedCreditCards<T extends BaseEntity>(cards: T[]): T[] {
  if (!Array.isArray(cards)) return []
  return cards.filter((c) => c.showOnHome !== false && c.sectionPlacement !== 'none')
}
