import React, { useState, useEffect } from 'react'
import {
  MOBILE_TRENDING_DEALS,
  type MobileTrendingDealItem,
} from '../../data/mobileTrendingDeals'
import { getPublicDeals } from '../../services/api'
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
  const [deals, setDeals] = useState<MobileTrendingDealItem[]>(MOBILE_TRENDING_DEALS)

  useEffect(() => {
    getPublicDeals().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.sectionPlacement === 'best_selling' || d.sectionPlacement === 'both' || d.isBestSelling)
        )
        if (filtered.length > 0) {
          const mapped: MobileTrendingDealItem[] = filtered.map((d: any, idx: number) => ({
            id: d._id || d.id || `mobile-trending-${idx}`,
            image: d.productImage || d.image || (MOBILE_TRENDING_DEALS[idx % MOBILE_TRENDING_DEALS.length]?.image),
            alt: d.title || d.name || 'Trending Deal',
            href: d.ctaHref || d.link || `/deal/${d.id}`,
            rank: idx + 1
          }))
          setDeals(mapped)
        }
      }
    }).catch(console.warn)
  }, [])

  return (
    <section className="mobile-trending-deals" aria-label="Trending Best Sellers">
      <div className="mobile-trending-deals-heading">
        <span className="mobile-recent-deals-heading__accent" aria-hidden="true" />
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
          {deals.map((deal) => (
            <MobileTrendingDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MobileTrendingDeals
