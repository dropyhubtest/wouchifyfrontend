import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileQuickLinkChips } from '../components/mobile/MobileQuickLinkChips'
import { MobileBrandTiles } from '../components/mobile/MobileBrandTiles'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { MobileDealRowCard } from '../components/mobile/MobileDealRowCard'
import { DEALS_CARD_ITEMS, BEST_SELLING_DEAL_ITEMS } from '../data/dealsPage'
import searchIcon from '../assets/icons/search.svg'
import styles from './MobileDealsPage.module.css'

export const MobileDealsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // 120ms debounce to prevent layout thrashing while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Filter big deal cards
  const filteredBigDeals = useMemo(() => {
    if (!debouncedSearch) return DEALS_CARD_ITEMS
    return DEALS_CARD_ITEMS.filter((deal) =>
      deal.title.toLowerCase().includes(debouncedSearch) ||
      deal.category.toLowerCase().includes(debouncedSearch) ||
      deal.store.toLowerCase().includes(debouncedSearch)
    )
  }, [debouncedSearch])

  // Filter best selling deal rows
  const filteredBestSelling = useMemo(() => {
    if (!debouncedSearch) return BEST_SELLING_DEAL_ITEMS
    return BEST_SELLING_DEAL_ITEMS.filter((deal) =>
      deal.title.toLowerCase().includes(debouncedSearch) ||
      deal.category.toLowerCase().includes(debouncedSearch) ||
      deal.store.toLowerCase().includes(debouncedSearch)
    )
  }, [debouncedSearch])

  const hasNoResults =
    debouncedSearch &&
    filteredBigDeals.length === 0 &&
    filteredBestSelling.length === 0

  return (
    <div className={styles.mobileDealsPage}>
      {/* 1. MobileHeader (64px, #EEEFFF) */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Pill Search Bar matching Figma (media_1788241436021.png) */}
      <div className={styles.searchContainer} role="search">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search deals, stores...."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search deals, stores"
        />
        <div className={styles.searchIconWrapper} aria-hidden="true">
          <img src={searchIcon} alt="" className={styles.searchIcon} />
        </div>
      </div>

      {/* 3. Quick-Link Chips: 2 rows of peach pill chips (#FDE0D1) */}
      <MobileQuickLinkChips />

      {/* No results fallback if searching */}
      {hasNoResults ? (
        <div className={styles.noResults}>
          <p className={styles.noResultsText}>
            No deals or stores found matching "{searchInput}"
          </p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => setSearchInput('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* 4 & 5. "Deals from favourite stores" Heading (navy dot) + Brand Tiles Strip */}
          <MobileBrandTiles searchQuery={debouncedSearch} />

          {/* 6. Big Deal Cards Scroller (deal1/deal2, 2nd clipped) */}
          {filteredBigDeals.length > 0 && (
            <section
              className={styles.bigDealsSection}
              aria-label="Featured Deal Cards"
            >
              <div
                className={styles.bigDealsScroller}
                tabIndex={0}
                role="region"
                aria-label="Scrollable Featured Deals"
              >
                <div className={styles.bigDealsTrack}>
                  {filteredBigDeals.map((deal) => (
                    <MobileDealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 7 & 8. "Best Selling Deal Picks" Heading (red dot) + Best Selling Scroller */}
          {filteredBestSelling.length > 0 && (
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

              <div
                className={styles.bestSellingScroller}
                tabIndex={0}
                role="region"
                aria-label="Scrollable Best Selling Deals"
              >
                <div className={styles.bestSellingTrack}>
                  {filteredBestSelling.map((deal) => (
                    <MobileDealRowCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Bottom spacing before footer */}
      <div className={styles.bottomSpacer} />

      {/* 9. MobileFooter */}
      <MobileFooter />
    </div>
  )
}

export default MobileDealsPage
