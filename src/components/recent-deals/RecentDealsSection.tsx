import React, { useEffect, useState } from 'react'
import { RECENT_DEALS, type RecentDealItem } from '../../data/recentDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { fetchDeals } from '../../utils/api'
import './RecentDealsSection.css'

export const RecentDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [displayDeals, setDisplayDeals] = useState<RecentDealItem[]>(RECENT_DEALS)

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const { data } = await fetchDeals()
        // Map the live data to the positional layout
        if (data && data.length > 0) {
          const mappedDeals = data.slice(0, 2).map((deal: any, index: number) => {
            const layout = index === 0 ? RECENT_DEALS[0] : RECENT_DEALS[1]
            return {
              id: deal._id,
              name: deal.title,
              // Fallback to brand logo or placeholder
              image: deal.brand?.logoUrl || layout.image,
              href: `/deals/${deal._id}`,
              alt: deal.title,
              left: layout.left,
              top: layout.top,
              width: layout.width,
              height: layout.height
            }
          })

          // Fill with dummy data if less than 2 deals
          if (mappedDeals.length < 2) {
             mappedDeals.push(RECENT_DEALS[1])
          }
          setDisplayDeals(mappedDeals)
        }
      } catch (error) {
        console.error('Error fetching recent deals:', error)
      }
    }
    loadDeals()
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
          {displayDeals.map((deal) => (
            <a
              key={deal.id}
              href={deal.href}
              className="recent-deals__card"
              style={{
                left: `${deal.left}px`,
                top: `${deal.top}px`,
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              aria-label={`View ${deal.name} deal`}
            >
              <img
                src={deal.image}
                alt={deal.alt}
                className="recent-deals__image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: deal.image.includes('clearbit') ? 'contain' : 'cover',
                  padding: deal.image.includes('clearbit') ? '2rem' : '0'
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentDealsSection
