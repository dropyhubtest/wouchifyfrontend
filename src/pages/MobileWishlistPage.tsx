import React, { useState, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import styles from './MobileWishlistPage.module.css'

export const MobileWishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<DealCardItem[]>(() => {
    try {
      const saved = localStorage.getItem('wouchify_wishlist')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return DEALS_CARD_ITEMS
  })

  const [removingIds, setRemovingIds] = useState<string[]>([])

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setRemovingIds((prev) => [...prev, id])
    setTimeout(() => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id))
      setRemovingIds((prev) => prev.filter((itemId) => itemId !== id))
    }, 280)
  }

  useEffect(() => {
    try {
      localStorage.setItem('wouchify_wishlist', JSON.stringify(wishlistItems))
    } catch {
      // ignore
    }
  }, [wishlistItems])

  return (
    <div className={styles.mobileWishlistPage}>
      {/* 1. Mobile Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Top Title & Decorative Watermark Section */}
      <section className={styles.topSection} aria-label="Wishlist Navigation">
        <div className={styles.breadcrumbWrap}>
          <a href="/" className={styles.breadcrumbLink} aria-label="Back to Home">
            <span className={styles.chevron}>&lt;&lt;</span>{' '}
            <span className={styles.pageTitle}>Home</span>
          </a>
        </div>

        {/* Faint W Watermark on Top Right */}
        <div className={styles.watermarkWrap} aria-hidden="true">
          <img
            src={watermarkMain}
            alt=""
            className={styles.watermarkImg}
          />
        </div>
      </section>

      {/* 3. Wishlist Cards Horizontal Scrollable Rail */}
      <section className={styles.cardsSection} aria-label="Saved Wishlist Deals">
        {wishlistItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❤️</div>
            <h3 className={styles.emptyTitle}>Your wishlist is empty</h3>
            <p className={styles.emptyDesc}>
              Discover trending deals and save your favourites here!
            </p>
            <a href="/deals" className={styles.emptyCta}>
              Explore Deals
            </a>
          </div>
        ) : (
          <div className={styles.cardsRail}>
            {wishlistItems.map((deal) => {
              const isRemoving = removingIds.includes(deal.id)
              return (
                <div
                  key={deal.id}
                  className={`${styles.cardItem} ${isRemoving ? styles.isRemoving : ''}`}
                >
                  <button
                    type="button"
                    className={`${styles.heartBtn} ${isRemoving ? styles.isUnfavorited : ''}`}
                    onClick={(e) => handleRemoveItem(deal.id, e)}
                    aria-label={`Remove ${deal.title} from wishlist`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isRemoving ? 'none' : '#E31E25'}
                      stroke="#E31E25"
                      strokeWidth="2"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <MobileDealCard deal={deal} />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 4. Dashed Red Divider Line */}
      <div className={styles.dashedDivider} aria-hidden="true" />

      {/* 5. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileWishlistPage