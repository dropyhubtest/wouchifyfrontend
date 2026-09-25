import React, { useState, useEffect } from 'react'
import type { DealCardItem } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import { isWishlisted, toggleWishlist } from '../../utils/wishlistManager'
import './DealCard.css'

interface DealCardProps {
  deal: DealCardItem
  horizontal?: boolean
  isLoot?: boolean
}

export const DealCard: React.FC<DealCardProps> = ({ deal, horizontal = false, isLoot = false }) => {
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

  const handleClick = (_e?: React.MouseEvent) => {
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

  if (horizontal) {
    return (
      <div className="deal-card deal-card--horizontal" onClick={handleClick}>
        <div className="deal-card__image-container deal-card__image-container--horizontal">
          <button
            type="button"
            className={`deal-card__wishlist-btn ${favorited ? 'is-active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
            title={favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? '#E31E25' : 'none'} stroke={favorited ? '#E31E25' : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
          <img
            src={deal.productImage}
            alt={deal.title}
            className="deal-card__image"
            loading="lazy"
          />
        </div>

        <div className="deal-card__content deal-card__content--horizontal">
          <div className="deal-card__store-row">
            <div className="deal-card__store-left">
              <img src={deal.storeLogo} alt={deal.store} className="deal-card__store-logo" />
              <span className="deal-card__verified-badge">
                <span className="deal-card__verified-dot" /> verified store
              </span>
            </div>
            <span className="deal-card__deal-tag">
              <span className="deal-card__deal-dot" /> Deal
            </span>
          </div>

          <span className="deal-card__category">{deal.category}</span>
          <h3 className="deal-card__title" title={deal.title}>{deal.title}</h3>

          <div className="deal-card__price-row">
            <span className="deal-card__price">{deal.price}</span>
            {deal.originalPrice && (
              <span className="deal-card__original-price">{deal.originalPrice}</span>
            )}
          </div>

          <a href={deal.ctaHref} className="deal-card__grab-btn" onClick={handleClick}>
            {deal.ctaText}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="deal-card" onClick={handleClick}>
      <div className="deal-card__image-container">
        <button
          type="button"
          className={`deal-card__wishlist-btn ${favorited ? 'is-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
          title={favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? '#E31E25' : 'none'} stroke={favorited ? '#E31E25' : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        <img
          src={deal.productImage}
          alt={deal.title}
          className="deal-card__image"
          loading="lazy"
        />
      </div>

      <div className="deal-card__content">
        <div className="deal-card__store-row">
          <div className="deal-card__store-left">
            <img src={deal.storeLogo} alt={deal.store} className="deal-card__store-logo" />
            <span className="deal-card__verified-badge">
              <span className="deal-card__verified-dot" /> verified store
            </span>
          </div>
          <span className="deal-card__deal-tag">
            <span className="deal-card__deal-dot" /> Deal
          </span>
        </div>

        <span className="deal-card__category">{deal.category}</span>
        <h3 className="deal-card__title" title={deal.title}>{deal.title}</h3>

        <div className="deal-card__price-row">
          <span className="deal-card__price">{deal.price}</span>
          {deal.originalPrice && (
            <span className="deal-card__original-price">{deal.originalPrice}</span>
          )}
        </div>

        <a href={deal.ctaHref} className="deal-card__grab-btn" onClick={handleClick}>
          {deal.ctaText}
        </a>
      </div>
    </div>
  )
}

export default DealCard
