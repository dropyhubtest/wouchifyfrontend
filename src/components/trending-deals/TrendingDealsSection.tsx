import React from 'react'
import { TRENDING_DEALS } from '../../data/trendingDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './TrendingDealsSection.css'

export const TrendingDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()

  return (
    <section
      className="trending-deals-section"
      aria-label="Trending Best Sellers"
      style={
        {
          '--trending-scale': sectionScale,
          height: `${507 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 507 Reference Canvas */}
      <div className="trending-deals-canvas">
        {/* Section Header with Navy Accent Circle */}
        <div className="trending-deals__header">
          <div className="trending-deals__heading-accent" aria-hidden="true" />
          <h2 className="trending-deals__title">Trending Best Sellers</h2>
        </div>

        {/* Trending Subtitle Pill */}
        <div className="trending-deals__label-pill" aria-hidden="true" />
        <span className="trending-deals__label-text">
          People Are Grabbing - Trending Deals
        </span>

        {/* Ranked Deal Cards Container */}
        <div className="trending-deals__cards-container">
          {TRENDING_DEALS.map((deal) => (
            <React.Fragment key={deal.id}>
              {/* Product Card */}
              <a
                href={deal.href}
                className="trending-deals__card"
                style={{
                  left: `${deal.left}px`,
                  top: `${deal.top}px`,
                }}
                aria-label={`View #${deal.rank} ${deal.name}`}
              >
                <img
                  src={deal.image}
                  alt={deal.alt}
                  className="trending-deals__image"
                  width="398"
                  height="237"
                />
              </a>

              {/* Rank Badge */}
              <div
                className="trending-deals__rank-badge"
                style={{
                  left: `${deal.badgeLeft}px`,
                  top: `${deal.badgeTop}px`,
                }}
                aria-hidden="true"
              >
                #{deal.rank}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingDealsSection
