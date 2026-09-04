import React from 'react'
import {
  MOBILE_FLASH_DEALS,
  type MobileFlashDealItem,
} from '../../data/mobileFlashDeals'
import './MobileFlashDeals.css'

interface MobileFlashDealCardProps {
  deal: MobileFlashDealItem
}

const MobileFlashDealCard: React.FC<MobileFlashDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.href}
      className="mobile-flash-deal-card"
      aria-label={`View ${deal.title}`}
    >
      {/* Left Lamp Image with Discount Tag */}
      <div className="mobile-flash-deal-card__media">
        <img
          src={deal.image}
          alt={deal.title}
          className="mobile-flash-deal-card__img"
          loading="lazy"
        />
        <div className="mobile-flash-deal-card__badge" aria-label={`${deal.discount} off`}>
          <span className="mobile-flash-deal-card__badge-val">{deal.discount}</span>
          <span className="mobile-flash-deal-card__badge-txt">off!</span>
        </div>
      </div>

      {/* Right Details Panel */}
      <div className="mobile-flash-deal-card__details">
        {/* Top Row: Electronics Pill on Left, Amazon Logo on Right */}
        <div className="mobile-flash-deal-card__top">
          <span className="mobile-flash-deal-card__tag">{deal.category}</span>
          <img
            src={deal.storeLogo}
            alt={deal.storeName}
            className="mobile-flash-deal-card__store-img"
          />
        </div>

        {/* Product Title (Full name displayed) */}
        <h3 className="mobile-flash-deal-card__title">{deal.title}</h3>

        {/* Price Row (Positioned directly under title) */}
        <div className="mobile-flash-deal-card__price-group">
          <span className="mobile-flash-deal-card__price">₹{deal.currentPrice}</span>
          <span className="mobile-flash-deal-card__original-price">₹{deal.originalPrice}</span>
        </div>

        {/* Grab Deal Button at Bottom Right */}
        <div className="mobile-flash-deal-card__cta-row">
          <span className="mobile-flash-deal-card__cta">Grab deal!!</span>
        </div>
      </div>
    </a>
  )
}

export const MobileFlashDeals: React.FC = () => {
  return (
    <section className="mobile-flash-deals" aria-label="Flash Deals">
      <div className="mobile-flash-deals__content">
        <div className="mobile-flash-deals__heading-row">
          <span className="mobile-flash-deals__accent" aria-hidden="true" />
          <h2 className="mobile-flash-deals__heading">Flash Deals</h2>
        </div>

        {MOBILE_FLASH_DEALS.map((deal) => (
          <MobileFlashDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

export default MobileFlashDeals
