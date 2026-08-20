import React from 'react'
import {
  MOBILE_TRENDING_DEALS,
  type MobileTrendingDealItem,
} from '../../data/mobileTrendingDeals'
import './MobileTrendingDeals.css'

interface MobileTrendingDealCardProps {
  deal: MobileTrendingDealItem
}

const MobileTrendingDealCard: React.FC<MobileTrendingDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.href}
      className="mobile-trending-card"
      aria-label={`View ${deal.alt}`}
    >
      <img
        src={deal.image}
        alt={deal.alt}
        className="mobile-trending-card__image"
        loading="lazy"
      />
    </a>
  )
}

export const MobileTrendingDeals: React.FC = () => {
  return (
    <section className="mobile-trending-deals" aria-label="Trending Best Sellers">
      <div className="mobile-trending-deals-heading">
        <span className="mobile-trending-deals-heading__accent" aria-hidden="true" />
        <h2>Trending Best Sellers</h2>
      </div>

      <div className="mobile-trending-deals__label-pill">
        <span className="mobile-trending__prefix">
          People Are Grabbing -
        </span>
        <span className="mobile-trending__highlight">
          Trending Deals
        </span>
      </div>

      <div className="mobile-trending-deals__row">
        <div className="mobile-trending-deals__track">
          {MOBILE_TRENDING_DEALS.map((deal) => (
            <MobileTrendingDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MobileTrendingDeals
