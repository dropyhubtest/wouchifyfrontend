import React from 'react'
import {
  MOBILE_RECENT_DEALS,
  type MobileRecentDealItem,
} from '../../data/mobileRecentDeals'
import './MobileRecentDeals.css'

interface MobileRecentDealCardProps {
  deal: MobileRecentDealItem
}

const MobileRecentDealCard: React.FC<MobileRecentDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.href}
      className="mobile-recent-deal-card"
      aria-label={`View ${deal.alt}`}
    >
      <img
        src={deal.image}
        alt={deal.alt}
        className="mobile-recent-deal-card__image"
        loading="lazy"
      />
    </a>
  )
}

export const MobileRecentDeals: React.FC = () => {
  return (
    <section className="mobile-recent-deals" aria-label="Recent Deals">
      <div className="mobile-recent-deals-heading">
        <span className="mobile-recent-deals-heading__accent" aria-hidden="true" />
        <h2>Recent Deals</h2>
      </div>

      <div className="mobile-recent-deals__row">
        <div className="mobile-recent-deals__track">
          {MOBILE_RECENT_DEALS.map((deal) => (
            <MobileRecentDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MobileRecentDeals
