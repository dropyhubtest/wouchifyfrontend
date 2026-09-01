import React from 'react'
import type { DealCardItem } from '../../data/dealsPage'
import styles from './MobileDealRowCard.module.css'

interface MobileDealRowCardProps {
  deal: DealCardItem
}

export const MobileDealRowCard: React.FC<MobileDealRowCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.ctaHref || '/deals'}
      className={styles.horizontalCardPair}
      aria-label={`View deal: ${deal.title} at ${deal.store}`}
    >
      {/* 1. Left Banner Image (220px x 168px with rounded left corners) */}
      <div className={styles.bannerContainer}>
        <img
          src={deal.productImage}
          alt={deal.title}
          className={styles.bannerImage}
          loading="lazy"
        />
        <div className={styles.bannerOverlay} aria-hidden="true" />
      </div>

      {/* 2. Right Description Card (148px x 168px with rounded right corners) */}
      <div className={styles.descriptionCard}>
        {/* Store Row: Logo + verified store on left, • Deal tag on right */}
        <div className={styles.storeRow}>
          <div className={styles.storeLeft}>
            {deal.storeLogo ? (
              <img
                src={deal.storeLogo}
                alt={deal.store}
                className={styles.storeLogo}
              />
            ) : (
              <span className={styles.storeName}>{deal.store.toLowerCase()}</span>
            )}
            <span className={styles.verifiedBadge}>
              <span className={styles.verifiedDot} /> verified store
            </span>
          </div>

          <span className={styles.dealTag}>
            <span className={styles.dealDot} /> Deal
          </span>
        </div>

        {/* Navy Category Ribbon (Attached flush to left edge) */}
        <div className={styles.categoryRibbon}>
          {deal.category.toUpperCase()}
        </div>

        {/* Product Title */}
        <h3 className={styles.productTitle}>
          {deal.title}
        </h3>

        {/* Price Row (37998 bold + 62999 strikethrough with red line) */}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>{deal.price}</span>
          <span className={styles.originalPrice}>{deal.originalPrice}</span>
        </div>

        {/* Red GRAB DEAL Pill Button */}
        <div className={styles.grabDealBtn} aria-hidden="true">
          {deal.ctaText || 'GRAB DEAL'}
        </div>
      </div>
    </a>
  )
}

export default MobileDealRowCard
