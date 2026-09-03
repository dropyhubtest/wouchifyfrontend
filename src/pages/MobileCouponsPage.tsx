import React, { useState, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileQuickLinkChips } from '../components/mobile/MobileQuickLinkChips'
import { MobileBrandTiles } from '../components/mobile/MobileBrandTiles'
import { MobileCouponCard } from '../components/mobile/MobileCouponCard'
import searchIcon from '../assets/icons/search.svg'
import styles from './MobileCouponsPage.module.css'

export const MobileCouponsPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // 120ms debounce to prevent layout thrashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  return (
    <div className={styles.mobileCouponsPage}>
      {/* 1. MobileHeader (64px, #EEEFFF) */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Pill Search Bar */}
      <div className={styles.searchContainer} role="search">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search coupons, stores...."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search coupons, stores"
        />
        <div className={styles.searchIconWrapper} aria-hidden="true">
          <img src={searchIcon} alt="" className={styles.searchIcon} />
        </div>
      </div>

      {/* 3. Quick-Link Chips: 2 rows of pill chips */}
      <MobileQuickLinkChips />

      {/* 4. "Coupons from favourite stores" Section with Brand Tiles */}
      <MobileBrandTiles
        title="Coupons from favourite stores"
        searchQuery={debouncedSearch}
      />

      {/* 5. "Available Coupons" Section with Big Red Ticket Card */}
      <section className={styles.availableCouponsSection} aria-label="Available Coupons">
        <div className={styles.headingRow}>
          <div className={styles.redAccentDot} aria-hidden="true" />
          <h2 className={styles.headingTitle}>Available Coupons</h2>
        </div>

        <div className={styles.couponCardWrapper}>
          <MobileCouponCard />
        </div>
      </section>

      {/* 6. Mobile Global Footer with smaller dotted line */}
      <MobileFooter />
    </div>
  )
}

export default MobileCouponsPage
