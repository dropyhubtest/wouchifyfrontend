import React, { useState, useEffect } from 'react'
import { getPublicDeals } from '../../services/api'
import { TRENDING_DEALS } from '../../data/trendingDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import './TrendingDealsSection.css'

const DEFAULT_TRENDING_POSITIONS = [
  { left: 115, top: 180, badgeLeft: 55, badgeTop: 145 },
  { left: 557, top: 180, badgeLeft: 497, badgeTop: 145 },
  { left: 999, top: 180, badgeLeft: 939, badgeTop: 145 },
  { left: 1441, top: 180, badgeLeft: 1381, badgeTop: 145 }
]

export const TrendingDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(TRENDING_DEALS)

  useEffect(() => { 
    getPublicDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.sectionPlacement === 'best_selling' || d.sectionPlacement === 'both' || d.isBestSelling)
        )
        if (filtered.length > 0) {
          // Take top 4 deals to maintain exact 1-row reference canvas layout
          setDeals(filtered.slice(0, 4))
        }
      } 
    }).catch(console.warn)
  }, [])

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
          {deals.slice(0, 4).map((deal, idx) => {
            const pos = DEFAULT_TRENDING_POSITIONS[idx] || DEFAULT_TRENDING_POSITIONS[0]
            const rank = deal.rank || (idx + 1)
            const calculatedLeft = deal.left !== undefined ? deal.left : pos.left
            const calculatedTop = deal.top !== undefined ? deal.top : pos.top
            const badgeLeft = deal.badgeLeft !== undefined ? deal.badgeLeft : pos.badgeLeft
            const badgeTop = deal.badgeTop !== undefined ? deal.badgeTop : pos.badgeTop
            const imageSrc = deal.image || deal.imageUrl || deal.thumbnail || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'

            return (
              <React.Fragment key={deal.id || `trending-deal-${idx}`}>
                {/* Product Card */}
                <a
                  onClick={() => adminApi.trackDealClick(deal.id)}
                  href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                  className="trending-deals__card"
                  style={{
                    left: `${calculatedLeft}px`,
                    top: `${calculatedTop}px`,
                  }}
                  aria-label={`View #${rank} ${deal.name || deal.title || 'deal'}`}
                >
                  <img
                    src={imageSrc}
                    alt={deal.alt || deal.name || deal.title || 'Trending Deal'}
                    className="trending-deals__image"
                    width="422"
                    height="261"
                    onError={(e) => {
                      const target = e.currentTarget
                      const fallback = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
                      if (target.src !== fallback) {
                        target.src = fallback
                      }
                    }}
                  />
                </a>

                {/* Rank Badge */}
                <div
                  className="trending-deals__rank-badge"
                  style={{
                    left: `${badgeLeft}px`,
                    top: `${badgeTop}px`,
                  }}
                  aria-hidden="true"
                >
                  #{rank}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrendingDealsSection
