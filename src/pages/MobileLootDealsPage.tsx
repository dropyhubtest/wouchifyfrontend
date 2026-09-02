import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileQuickLinkChips } from '../components/mobile/MobileQuickLinkChips'
import { MobileBrandTiles } from '../components/mobile/MobileBrandTiles'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS } from '../data/dealsPage'
import searchIcon from '../assets/icons/search.svg'
import styles from './MobileLootDealsPage.module.css'

export const MobileLootDealsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Featured deal (single card: Xiaomi TV)
  const filteredBigDeals = useMemo(() => {
    if (!debouncedSearch) return [DEALS_CARD_ITEMS[0]]
    return DEALS_CARD_ITEMS.filter((deal) =>
      deal.title.toLowerCase().includes(debouncedSearch) ||
      deal.category.toLowerCase().includes(debouncedSearch) ||
      deal.store.toLowerCase().includes(debouncedSearch)
    ).slice(0, 1)
  }, [debouncedSearch])

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

      {/* 5. ONE Featured Deal Card (Xiaomi TV) matching Figma */}
      {filteredBigDeals.length > 0 && (
        <section
          className={styles.singleDealSection}
          aria-label="Featured Loot Deal"
        >
          <div className={styles.singleDealContainer}>
            <MobileDealCard deal={filteredBigDeals[0]} />
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
