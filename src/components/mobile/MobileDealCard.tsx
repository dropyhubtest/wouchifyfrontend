import React from 'react'
import type { DealCardItem } from '../../data/dealsPage'
import styles from './MobileDealCard.module.css'

interface MobileDealCardProps {
  deal: DealCardItem
}

export const MobileDealCard: React.FC<MobileDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.ctaHref || '/deals'}
      className={styles.card}
      aria-label={`View deal: ${deal.title} at ${deal.store}`}
    >
      {/* Top Banner Image (174px) with rounded top corners */}
      <div className={styles.bannerWrap}>
        <img
          src={deal.productImage}
          alt={deal.title}
          className={styles.bannerImage}
          loading="lazy"
        />
        <div className={styles.bannerInnerShadow} aria-hidden="true" />
      </div>

      {/* Description Card (Separate card below banner with top-inner & outer drop shadow) */}
      <div className={styles.descriptionCard}>
        {/* Store Row: Store logo + verified store pill on left, • Deal tag on right */}
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

        {/* 2-line Product Title */}
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

export default MobileDealCard
