import React, { useState, useEffect } from 'react'
import { getPublicDeals } from '../../services/api'
import { RECENT_DEALS } from '../../data/recentDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import './RecentDealsSection.css'

export const RecentDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(RECENT_DEALS)
  useEffect(() => { getPublicDeals().then(data => { if (data && data.length > 0) setDeals(data.slice(0, 6)) }) }, [])

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
          {deals.map((deal) => (
            <a
              key={deal.id}
              onClick={() => adminApi.trackDealClick(deal.id)}
              href={deal.ctaHref || deal.link || deal.href}
              className="recent-deals__card"
              style={{
                left: `${deal.left}px`,
                top: `${deal.top}px`,
              }}
              aria-label={`View ${deal.name} deal`}
            >
              <img
                src={deal.image}
                alt={deal.alt}
                className="recent-deals__image"
                width="422"
                height="261"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentDealsSection
