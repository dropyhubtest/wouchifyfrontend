import React, { useState, useEffect } from 'react'
import { getPublicDeals } from '../../services/api'
import { RECENT_DEALS } from '../../data/recentDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import './RecentDealsSection.css'

const DEFAULT_CARD_POSITIONS = [
  { left: 88, top: 122 },
  { left: 530, top: 122 },
  { left: 972, top: 122 },
  { left: 1414, top: 122 }
]

export const RecentDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(RECENT_DEALS)

  useEffect(() => { 
    getPublicDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.sectionPlacement === 'favourite' || d.sectionPlacement === 'both' || !d.sectionPlacement)
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
      className="recent-deals-section"
      aria-label="Recently added Deals"
      style={
        {
          '--recent-scale': sectionScale,
          height: `${482 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 482 Reference Canvas */}
      <div className="recent-deals-canvas">
        {/* Section Header with Navy Accent */}
        <div className="recent-deals__header">
          <div className="recent-deals__heading-accent" aria-hidden="true" />
          <h2 className="recent-deals__title">Recently added Deals</h2>
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals" className="recent-deals__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Deal Cards Container */}
        <div className="recent-deals__cards-container">
          {deals.slice(0, 4).map((deal, idx) => {
            const pos = DEFAULT_CARD_POSITIONS[idx] || DEFAULT_CARD_POSITIONS[0]
            const calculatedLeft = deal.left !== undefined ? deal.left : pos.left
            const calculatedTop = deal.top !== undefined ? deal.top : pos.top
            const imageSrc = deal.image || deal.imageUrl || deal.thumbnail || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'

            return (
              <a
                key={deal.id || `recent-deal-${idx}`}
                onClick={() => adminApi.trackDealClick(deal.id)}
                href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                className="recent-deals__card"
                style={{
                  left: `${calculatedLeft}px`,
                  top: `${calculatedTop}px`,
                }}
                aria-label={`View ${deal.name || deal.title || 'deal'}`}
              >
                <img
                  src={imageSrc}
                  alt={deal.alt || deal.name || deal.title || 'Deal'}
                  className="recent-deals__image"
                  width="422"
                  height="261"
                  onError={(e) => {
                    const target = e.currentTarget
                    const fallback = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
                    if (target.src !== fallback) {
                      target.src = fallback
                    }
                  }}
                />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RecentDealsSection
