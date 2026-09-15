import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileQuickLinkChips } from '../components/mobile/MobileQuickLinkChips'
import { MobileBrandTiles } from '../components/mobile/MobileBrandTiles'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { getStoreLogo, type DealCardItem } from '../data/dealsPage'
import flashLootLamp from '../assets/flash-loot/flash-loot-lamp.png'
import exclusiveLootLamp from '../assets/exclusive-loot/exclusive-loot-lamp.png'
import deal1 from '../assets/deals/deal1.png'
import { adminApi } from '../services/adminApi'
import searchIcon from '../assets/icons/search.svg'
import styles from './MobileLootDealsPage.module.css'

const normalizeLootToCard = (loot: any, idx: number): DealCardItem => {
  const store = loot.storeName || loot.store || 'Amazon'
  let prodImg = loot.image || loot.productImage
  if (!prodImg) {
    prodImg = idx === 0 ? flashLootLamp : idx === 1 ? exclusiveLootLamp : deal1
  }
  return {
    id: String(loot._id || loot.id || `loot-${idx}`),
    title: loot.title || loot.name || 'Special Promotional Deal',
    category: (loot.category || 'Electronics').toUpperCase(),
    store: store,
    storeLogo: loot.storeLogo || getStoreLogo(store),
    productImage: prodImg,
    price: String(loot.currentPrice || loot.price || '179').replace(/[^0-9.]/g, ''),
    originalPrice: loot.originalPrice ? String(loot.originalPrice).replace(/[^0-9.]/g, '') : undefined,
    discountPercentage: loot.discount || loot.discountLabel || '80% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: loot.href || loot.link || `/stores#${store.toLowerCase().replace(/\s+/g, '-')}`,
    dealTag: loot.badge || 'Loot Deal',
    status: loot.status || 'active',
    rating: loot.rating || '4.8'
  }
}

export const MobileLootDealsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [lootList, setLootList] = useState<DealCardItem[]>(() => {
    try {
      const cached = localStorage.getItem('wouchify_loot_deals')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((l: any, idx: number) => normalizeLootToCard(l, idx))
        }
      }
    } catch {}
    return [
      {
        id: 'loot-flash-lamp',
        title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
        category: 'ELECTRONICS & GADGETS',
        store: 'Amazon',
        storeLogo: getStoreLogo('Amazon'),
        productImage: flashLootLamp,
        price: '179',
        originalPrice: '1899',
        discountPercentage: '91% OFF',
        ctaText: 'GRAB DEAL',
        ctaHref: 'https://amazon.in',
        dealTag: 'Loot Deal',
        status: 'active'
      }
    ]
  })

  useEffect(() => {
    let isMounted = true
    const fetchLoot = async () => {
      try {
        const res = await adminApi.getLootDeals()
        if (!isMounted) return
        if (Array.isArray(res) && res.length > 0) {
          const normalized = res
            .filter((l: any) => l.status === 'active' || l.status === 'Approved')
            .map((l: any, idx: number) => normalizeLootToCard(l, idx))
          setLootList(normalized)
        }
      } catch {}
    }

    fetchLoot()

    const handleSync = () => { fetchLoot() }
    window.addEventListener('wouchify_loot_deals_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      isMounted = false
      window.removeEventListener('wouchify_loot_deals_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filteredBigDeals = useMemo(() => {
    if (!debouncedSearch) return lootList
    return lootList.filter((deal) =>
      deal.title.toLowerCase().includes(debouncedSearch) ||
      deal.category.toLowerCase().includes(debouncedSearch) ||
      deal.store.toLowerCase().includes(debouncedSearch)
    )
  }, [debouncedSearch, lootList])

  return (
    <div className={styles.mobileLootDealsPage}>
      {/* 1. MobileHeader */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Pill Search Bar with "Search loot deals, stores...." placeholder */}
      <div className={styles.searchContainer} role="search">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search loot deals, stores...."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search loot deals, stores"
        />
        <div className={styles.searchIconWrapper} aria-hidden="true">
          <img src={searchIcon} alt="" className={styles.searchIcon} />
        </div>
      </div>

      {/* 3. Reused Quick-Link Chips (2 rows: Products, Stores, Brands, Festivals / Cities, Travel, Trending) */}
      <MobileQuickLinkChips />

      {/* 4. Reused "Deals from favourite stores" with 2-row Brand Tiles Scroller */}
      <MobileBrandTiles searchQuery={debouncedSearch} />

      {/* 5. Featured Loot Deal Cards matching Executive Panel */}
      {filteredBigDeals.length > 0 && (
        <section
          className={styles.singleDealSection}
          aria-label="Featured Loot Deals"
        >
          <div className={styles.singleDealContainer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBigDeals.map((deal) => (
              <MobileDealCard key={deal.id} deal={deal} isLoot={true} />
            ))}
          </div>
        </section>
      )}

      {/* 6. "Best Selling Deal Picks" Section with Centered Empty State */}
      <section
        className={styles.bestSellingSection}
        aria-label="Best Selling Deal Picks"
      >
        <div className={styles.bestSellingHeadingRow}>
          <div className={styles.redAccentDot} aria-hidden="true" />
          <h2 className={styles.bestSellingTitle}>
            Best Selling Deal Picks
          </h2>
        </div>

        {/* Empty State matching Figma */}
        <div className={styles.emptyStateContainer} role="status" aria-live="polite">
          <h3 className={styles.emptyStateTitle}>No loot deals found</h3>
          <p className={styles.emptyStateSubtitle}>Try adjusting your filters</p>
        </div>
      </section>

      {/* Bottom spacer before footer */}
      <div className={styles.bottomSpacer} />

      {/* 7. Reused MobileFooter */}
      <MobileFooter />
    </div>
  )
}

export default MobileLootDealsPage
