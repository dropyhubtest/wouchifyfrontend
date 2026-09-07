import React, { useEffect, useState } from 'react'
import { TRENDING_DEALS, type TrendingDealItem } from '../../data/trendingDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { fetchDeals } from '../../utils/api'
import './TrendingDealsSection.css'

export const TrendingDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [displayDeals, setDisplayDeals] = useState<TrendingDealItem[]>(TRENDING_DEALS)

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const { data } = await fetchDeals()
        // If we have live data, map it to the positional format required by the UI
        if (data && data.length > 0) {
          const mappedDeals = data.slice(0, 2).map((deal: any, index: number) => {
            // Use the same coordinates as the hardcoded layout
            const layout = index === 0 ? TRENDING_DEALS[0] : TRENDING_DEALS[1]
            return {
              id: deal._id,
              rank: index + 1,
              name: deal.title,
              // Fallback to the brand's logo or a placeholder if no banner image exists
              image: deal.brand?.logoUrl || layout.image,
              href: `/deals/${deal._id}`,
              alt: deal.title,
              left: layout.left,
              top: layout.top,
              badgeLeft: layout.badgeLeft,
              badgeTop: layout.badgeTop,
            }
          })
          
          // Fill in with hardcoded if there's less than 2
          if (mappedDeals.length < 2) {
             mappedDeals.push(TRENDING_DEALS[1])
          }
          setDisplayDeals(mappedDeals)
        }
      } catch (error) {
        console.error('Error fetching trending deals:', error)
      }
    }

    loadDeals()
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
          {displayDeals.map((deal) => (
            <React.Fragment key={deal.id}>
              {/* Product Card */}
              <a
                href={deal.href}
                className="trending-deals__card"
                style={{
                  left: `${deal.left}px`,
                  top: `${deal.top}px`,
                  // Add a subtle background color in case the logo is transparent
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
                aria-label={`View #${deal.rank} ${deal.name}`}
              >
                <img
                  src={deal.image}
                  alt={deal.alt}
                  className="trending-deals__image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: deal.image.includes('clearbit') ? 'contain' : 'cover',
                    padding: deal.image.includes('clearbit') ? '2rem' : '0'
                  }}
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
