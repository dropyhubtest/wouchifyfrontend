import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { DealCard } from '../components/deals/DealCard'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import wishlistHeroBg from '../assets/wishlist/wishlist_hero.png'
import './FavoritesPage.css'

export const FavoritesPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
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

  useEffect(() => {
    try {
      localStorage.setItem('wouchify_wishlist', JSON.stringify(wishlistItems))
    } catch {
      // ignore
    }
  }, [wishlistItems])

  const handleRemoveItem = (id: string) => {
    // Animate heart removal first, then transition card out
    setRemovingIds((prev) => [...prev, id])
    setTimeout(() => {
      setWishlistItems((prev) => prev.filter((item) => item.id !== id))
      setRemovingIds((prev) => prev.filter((itemId) => itemId !== id))
    }, 280)
  }

  const scrollToContent = () => {
    const el = document.getElementById('wishlist-content')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 520, behavior: 'smooth' })
    }
  }

  return (
    <div className="wishlist-page">
      {/* 1. Header Navigation */}
      {isMobile ? <MobileHeader /> : <Navbar />}

      {/* 2. Hero Section matching Figma */}
      <section className="wishlist-hero" aria-label="Wishlist Banner">
        <div className="wishlist-hero__bg-wrap" aria-hidden="true">
          <img
            src={wishlistHeroBg}
            alt=""
            className="wishlist-hero__bg-img"
          />
          <div className="wishlist-hero__overlay" />
        </div>

        <div className="wishlist-hero__content">
          <h1 className="wishlist-hero__title">Wishlist</h1>
          <h2 className="wishlist-hero__subtitle">List for all your Shopping Needs</h2>
          <p className="wishlist-hero__desc">
            Add your Deals to wishlist and comeback anytime to grab the best offers
          </p>
          <button
            type="button"
            className="wishlist-hero__cta"
            onClick={scrollToContent}
          >
            Browse items&gt;&gt;
          </button>
        </div>
      </section>

      {/* 3. Wishlist Content Section */}
      <main id="wishlist-content" className="wishlist-main">
        <div className="wishlist-main__container">
          {/* Left Column: Sidebar Navigation Attached Flush to Screen Edge */}
          <ProfileSidebar activeTab="wishlist" showQuickAccess={false} />

          {/* Right Column: Wishlist Cards Grid or Empty State */}
          <section className="wishlist-content" aria-label="Wishlist Deals">
            {wishlistItems.length === 0 ? (
              <div className="wishlist-empty">
                <div className="wishlist-empty__icon">❤️</div>
                <h3 className="wishlist-empty__title">Your wishlist is empty</h3>
                <p className="wishlist-empty__desc">
                  Explore our best deals and discounts and save items to your wishlist!
                </p>
                <a href="/deals" className="wishlist-empty__btn">
                  Explore Deals
                </a>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlistItems.map((deal) => {
                  const isRemoving = removingIds.includes(deal.id)
                  return (
                    <div
                      key={deal.id}
                      className={`wishlist-card-wrapper ${isRemoving ? 'is-removing' : ''}`}
                    >
                      <button
                        type="button"
                        className={`wishlist-heart-btn ${isRemoving ? 'is-unfavorited' : ''}`}
                        onClick={() => handleRemoveItem(deal.id)}
                        aria-label={`Remove ${deal.title} from wishlist`}
                        title="Remove from wishlist"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={isRemoving ? 'none' : '#E31E25'}
                          stroke="#E31E25"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                      <DealCard deal={deal} />
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 4. Footer */}
      {isMobile ? <MobileFooter /> : <FooterSection />}
    </div>
  )
}

export default FavoritesPage
