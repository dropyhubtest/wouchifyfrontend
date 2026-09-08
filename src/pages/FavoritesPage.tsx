import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './FavoritesPage.css'

interface FavItem {
  id: number; store: string; deal: string
  discount: string; cashback: string; badge: string; href: string
}

const initialFavs: FavItem[] = [
  { id: 1, store: 'Amazon India', deal: 'Apple MacBook Air M2', discount: '18% OFF', cashback: '₹1,200 Cashback', badge: '🔥 Hot Deal', href: '/deals' },
  { id: 2, store: 'Myntra', deal: 'End of Season Sale', discount: 'Up to 70% OFF', cashback: '₹180 Cashback', badge: '⚡ Flash Sale', href: '/deals' },
  { id: 3, store: 'Flipkart', deal: 'Samsung Galaxy S24', discount: '12% OFF', cashback: '₹950 Cashback', badge: '🏆 Best Seller', href: '/deals' },
  { id: 4, store: 'Ajio', deal: 'Premium Denim Collection', discount: '50% OFF', cashback: '₹120 Cashback', badge: '✨ Trending', href: '/deals' },
]

export const FavoritesPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [favs, setFavs] = useState<FavItem[]>(initialFavs)

  const remove = (id: number) => setFavs(prev => prev.filter(f => f.id !== id))

  return (
    <main className="favs-page">
      <div className="favs-page__header-bg" />
      <div className="favs-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="favs-container">
        <div className="favs-page-header">
          <h1>💛 My Favorites</h1>
          <p>Your saved deals and wishlist items.</p>
        </div>

        {favs.length === 0 ? (
          <div className="favs-empty">
            <div className="favs-empty__icon">💛</div>
            <h2>No favorites yet</h2>
            <p>Browse deals and tap the heart icon to save your favorites!</p>
            <a href="/deals" className="favs-empty__cta">Browse Deals</a>
          </div>
        ) : (
          <div className="favs-grid">
            {favs.map(fav => (
              <div key={fav.id} className="fav-card">
                <div className="fav-card__top">
                  <span className="fav-card__badge">{fav.badge}</span>
                  <button className="fav-card__remove" onClick={() => remove(fav.id)} aria-label="Remove from favorites">💛</button>
                </div>
                <p className="fav-card__store">{fav.store}</p>
                <p className="fav-card__deal">{fav.deal}</p>
                <div className="fav-card__tags">
                  <span className="fav-card__discount">{fav.discount}</span>
                  <span className="fav-card__cashback">{fav.cashback}</span>
                </div>
                <a href={fav.href} className="fav-card__btn">Shop Now →</a>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  )
}

export default FavoritesPage
