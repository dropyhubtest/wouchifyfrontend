import React, { useState, useEffect } from 'react'
import type { DealCardItem } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import { isWishlisted, toggleWishlist } from '../../utils/wishlistManager'
import styles from './MobileDealCard.module.css'

interface MobileDealCardProps {
  deal: DealCardItem
  isLoot?: boolean
}

export const MobileDealCard: React.FC<MobileDealCardProps> = ({ deal, isLoot = false }) => {
  const [favorited, setFavorited] = useState<boolean>(() => isWishlisted(deal.id))

  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail?.targetId === String(deal.id)) {
        setFavorited(e.detail.added)
      } else {
        setFavorited(isWishlisted(deal.id))
      }
    }
    window.addEventListener('wouchify_wishlist_updated', handleSync)
    return () => window.removeEventListener('wouchify_wishlist_updated', handleSync)
  }, [deal.id])

  const handleClick = () => {
    if (isLoot) {
      adminApi.trackLootClick(deal.id);
    } else {
      adminApi.trackDealClick(deal.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const added = toggleWishlist(deal)
    setFavorited(added)
  }

  return (
    <a
      href={deal.ctaHref || '/deals'}
      className={styles.card}
      onClick={handleClick}
      aria-label={`View deal: ${deal.title} at ${deal.store}`}
    >
      {/* Top Banner Image (174px) with rounded top corners */}
      <div className={styles.bannerWrap}>
        <button
          type="button"
          className={`${styles.wishlistBtn} ${favorited ? styles.isActive : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
          title={favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={favorited ? '#E31E25' : 'none'} stroke={favorited ? '#E31E25' : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
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
