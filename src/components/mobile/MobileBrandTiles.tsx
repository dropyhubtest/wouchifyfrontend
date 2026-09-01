import React, { useMemo } from 'react'
import { DEALS_FAVOURITE_STORES } from '../../data/dealsPage'
import type { DealsFavouriteStoreItem } from '../../data/dealsPage'
import styles from './MobileBrandTiles.module.css'

interface MobileBrandTilesProps {
  searchQuery?: string
}

export const MobileBrandTiles: React.FC<MobileBrandTilesProps> = ({ searchQuery = '' }) => {
  const filteredStores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return DEALS_FAVOURITE_STORES
    return DEALS_FAVOURITE_STORES.filter((store) =>
      store.name.toLowerCase().includes(q) ||
      store.discountBadge.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Split into 2 rows matching the mobile home page 2-row layout
  const row1Stores = useMemo(() => {
    return filteredStores.filter((_, idx) => idx % 2 === 0)
  }, [filteredStores])

  const row2Stores = useMemo(() => {
    return filteredStores.filter((_, idx) => idx % 2 === 1)
  }, [filteredStores])

  const renderBrandCard = (store: DealsFavouriteStoreItem) => {
    const parts = store.discountBadge.split(' ')
    const percentage = parts[0] || '80%'
    const offText = parts[1] || 'off'

    const cardStyle: React.CSSProperties = store.cardBg
      ? { backgroundColor: store.cardBg }
      : {}

    const logoStyle: React.CSSProperties = store.logoScale
      ? { transform: `scale(${store.logoScale})` }
      : {}

    return (
      <a
        key={store.id}
        href={store.href}
        className={styles.brandCard}
        aria-label={`View ${store.name} offers`}
        style={cardStyle}
      >
        <img
          src={store.logo}
          alt={`${store.name} logo`}
          className={styles.brandCardLogo}
          style={logoStyle}
          loading="lazy"
        />
        <div className={styles.discountBadge} aria-hidden="true">
          <span className={styles.discountPercentage}>{percentage}</span>
          <span className={styles.discountOff}>{offText}</span>
        </div>
      </a>
    )
  }

  return (
    <section className={styles.brandTilesSection} aria-label="Deals from favourite stores">
      {/* Section Heading with Navy Clipped Dot Accent */}
      <div className={styles.headingRow}>
        <div className={styles.navyAccentDot} aria-hidden="true" />
        <h2 className={styles.headingTitle}>Deals from favourite stores</h2>
      </div>

      {/* Row 1 Scroller */}
      <div className={styles.rowScroller} tabIndex={0} role="region" aria-label="Favourite Stores Row 1">
        <div className={styles.track}>
          {row1Stores.map(renderBrandCard)}
        </div>
      </div>

      {/* Row 2 Scroller */}
      {row2Stores.length > 0 && (
        <div className={styles.rowScroller} tabIndex={0} role="region" aria-label="Favourite Stores Row 2">
          <div className={styles.track}>
            {row2Stores.map(renderBrandCard)}
          </div>
        </div>
      )}
    </section>
  )
}

export default MobileBrandTiles
