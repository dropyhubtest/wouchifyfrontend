import React, { useState, useEffect } from 'react'
import {
  MOBILE_RECENT_DEALS,
  type MobileRecentDealItem,
} from '../../data/mobileRecentDeals'
import { getPublicDeals } from '../../services/api'
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
  const [deals, setDeals] = useState<MobileRecentDealItem[]>(MOBILE_RECENT_DEALS)

  useEffect(() => {
    getPublicDeals().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.sectionPlacement === 'favourite' || d.sectionPlacement === 'both' || !d.sectionPlacement)
        )
        if (filtered.length > 0) {
          const mapped: MobileRecentDealItem[] = filtered.map((d: any, idx: number) => ({
            id: d._id || d.id || `mobile-recent-${idx}`,
            image: d.productImage || d.image || (MOBILE_RECENT_DEALS[idx % MOBILE_RECENT_DEALS.length]?.image),
            alt: d.title || d.name || 'Recent Deal',
            href: d.ctaHref || d.link || `/deal/${d.id}`
          }))
          setDeals(mapped)
        }
      }
    }).catch(console.warn)
  }, [])

  return (
    <section className="mobile-recent-deals" aria-label="Recent Deals">
      <div className="mobile-recent-deals-heading">
        <span className="mobile-recent-deals-heading__accent" aria-hidden="true" />
        <h2>Recent Deals</h2>
      </div>

      <div className="mobile-recent-deals__row">
        <div className="mobile-recent-deals__track">
          {deals.map((deal) => (
            <MobileRecentDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MobileRecentDeals
