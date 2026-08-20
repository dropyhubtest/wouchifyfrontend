import React from 'react'
import { RECENT_DEALS } from '../../data/recentDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './RecentDealsSection.css'

export const RecentDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()

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
          {RECENT_DEALS.map((deal) => (
            <a
              key={deal.id}
              href={deal.href}
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
