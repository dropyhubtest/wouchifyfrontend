import React, { useState, useEffect, useMemo } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import accountCircleIcon from '../assets/profile/account_circle.png'
import ordersIcon from '../assets/profile/orders.png'
import favoriteIcon from '../assets/profile/favorite.png'
import walletIcon from '../assets/profile/wallet.png'
import notificationsIcon from '../assets/profile/notifications.png'
import referIcon from '../assets/profile/refer.png'
import styles from './MobileWishlistPage.module.css'

const NAV_PILLS = [
  { id: 'profile', label: 'My Profile', href: '/profile', icon: accountCircleIcon, active: false },
  { id: 'orders', label: 'My Orders', href: '/orders', icon: ordersIcon, active: false },
  { id: 'wishlist', label: 'Wishlist', href: '/favorites', icon: favoriteIcon, active: true },
  { id: 'wallet', label: 'My Wallet', href: '/wallet', icon: walletIcon, active: false },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: notificationsIcon, active: false },
  { id: 'refer', label: 'Refer & Earn', href: '/refer', icon: referIcon, active: false },
]

export const MobileWishlistPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredWishlist = useMemo(() => {
    if (!searchQuery.trim()) return wishlistItems
    const q = searchQuery.toLowerCase().trim()
    return wishlistItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.store.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [wishlistItems, searchQuery])

  return (
    <div className={styles.mobileWishlistPage}>
      {/* 1. Mobile Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Top Breadcrumb link */}
      <div className={styles.topNavWrap}>
        <a href="/" className={styles.breadcrumbLink} aria-label="Back to Home">
          <span className={styles.chevron}>&lt;&lt;</span>{' '}
          <span className={styles.breadcrumbTitle}>Home</span>
        </a>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchBarWrap}>
        <input
          type="text"
          placeholder="Search products...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search products in wishlist"
        />
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1F2937"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* 4. 2x3 Navigation Pills Grid */}
      <nav className={styles.pillsGrid} aria-label="Account Navigation">
        {NAV_PILLS.map((pill) => (
          <a
            key={pill.id}
            href={pill.href}
            className={`${styles.pillLink} ${pill.active ? styles.pillActive : styles.pillRed}`}
          >
            <img src={pill.icon} alt="" className={styles.pillIcon} />
            <span className={styles.pillText}>{pill.label}</span>
          </a>
        ))}
      </nav>

      {/* 5. Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIndicator} aria-hidden="true" />
        <h2 className={styles.sectionTitle}>Products in Wishlist</h2>
      </div>

      {/* 6. Wishlist Cards Horizontal Scrollable Rail */}
      <section className={styles.cardsSection} aria-label="Saved Wishlist Deals">
        {filteredWishlist.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❤️</div>
            <h3 className={styles.emptyTitle}>
              {searchQuery.trim() ? 'No matching products found' : 'Your wishlist is empty'}
            </h3>
            <p className={styles.emptyDesc}>
              {searchQuery.trim()
                ? 'Try a different search term.'
                : 'Discover trending deals and save your favourites here!'}
            </p>
            {!searchQuery.trim() && (
              <a href="/deals" className={styles.emptyCta}>
                Explore Deals
              </a>
            )}
          </div>
        ) : (
          <div className={styles.cardsRail}>
            {filteredWishlist.map((deal) => {
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

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileWishlistPage