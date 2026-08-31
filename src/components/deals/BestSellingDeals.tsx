import React from 'react'
import { DealCard } from './DealCard'
import { BEST_SELLING_DEAL_ITEMS } from '../../data/dealsPage'
import './BestSellingDeals.css'

export const BestSellingDeals: React.FC = () => {
  return (
    <section
      className="best-selling-deals-section"
      aria-label="Best Selling Deal Picks"
    >
      <div className="best-selling-deals-canvas">
        {/* Section Header with Red Accent */}
        <div className="best-selling-deals__header">
          <div className="best-selling-deals__heading-accent" aria-hidden="true" />
          <h2 className="best-selling-deals__title">Best Selling Deal Picks</h2>
        </div>

        {/* Top Deals subtitle pill */}
        <div className="best-selling-deals__top-deals-pill">
          Top Deals
        </div>

        {/* Featured Horizontal Cards Container */}
        <div className="best-selling-deals__cards-container">
          {BEST_SELLING_DEAL_ITEMS.map((deal) => (
            <DealCard key={deal.id} deal={deal} horizontal={true} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellingDeals
