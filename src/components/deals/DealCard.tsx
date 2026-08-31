import React from 'react'
import type { DealCardItem } from '../../data/dealsPage'
import './DealCard.css'

interface DealCardProps {
  deal: DealCardItem
  horizontal?: boolean
}

export const DealCard: React.FC<DealCardProps> = ({ deal, horizontal = false }) => {
  if (horizontal) {
    return (
      <div className="deal-card deal-card--horizontal">
        <div className="deal-card__image-container deal-card__image-container--horizontal">
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

          <a href={deal.ctaHref} className="deal-card__grab-btn">
            {deal.ctaText}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="deal-card">
      <div className="deal-card__image-container">
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

        <a href={deal.ctaHref} className="deal-card__grab-btn">
          {deal.ctaText}
        </a>
      </div>
    </div>
  )
}

export default DealCard
