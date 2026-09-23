import React, { useState, useEffect } from 'react'
import { getPublicLootDeals } from '../../services/api'
import { EXCLUSIVE_LOOT_DEALS } from '../../data/exclusiveLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import './ExclusiveLootSection.css'

export const ExclusiveLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(EXCLUSIVE_LOOT_DEALS)
  useEffect(() => { getPublicLootDeals().then(data => { if (data && data.length > 0) setDeals(data.filter(d => d.type === 'exclusive').slice(0, 5)) }) }, [])

  return (
    <section
      className="exclusive-loot-section"
      aria-label="Exclusive Loot Deals"
      style={
        {
          '--exclusive-scale': sectionScale,
          height: `${508 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 508 Reference Canvas */}
      <div className="exclusive-loot-canvas">
        {/* Section Header with Red Accent */}
        <div className="exclusive-loot__header">
          <div className="exclusive-loot__heading-accent" aria-hidden="true" />
          <h2 className="exclusive-loot__title">Exclusive Loot Deals</h2>
        </div>

        {/* Members Only Label Pill */}
        <div className="exclusive-loot__members-pill" aria-label="Members Only!!">
          Members Only!!
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals?type=exclusive" className="exclusive-loot__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Exclusive Deals Track / Container */}
        <div className="exclusive-loot__track">
          {deals.map((deal) => (
            <a onClick={() => adminApi.trackLootClick(deal.id)}
              key={deal.id}
              href={deal.ctaHref || deal.link || deal.href}
              className="exclusive-loot__card"
              aria-label={`View ${deal.title} exclusive deal`}
            >
              {/* Left Image Area */}
              <div className="exclusive-loot__media">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="exclusive-loot__product-img"
                  width="300"
                  height="296"
                />
                <div className="exclusive-loot__discount-badge" aria-label={`${deal.discount} off`}>
                  <span className="exclusive-loot__discount-val">{deal.discount}</span>
                  <span className="exclusive-loot__discount-txt">off!</span>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="exclusive-loot__details">
                <div className="exclusive-loot__store-row">
                  <img
                    src={deal.storeLogo}
                    alt={deal.storeName}
                    className="exclusive-loot__store-logo"
                  />
                </div>
                <h3 className="exclusive-loot__card-title">{deal.title}</h3>
                <div className="exclusive-loot__tag-row">
                  <span className="exclusive-loot__tag">{deal.category}</span>
                </div>
                <div className="exclusive-loot__bottom-row">
                  <div className="exclusive-loot__price-group">
                    <span className="exclusive-loot__price">₹{deal.currentPrice}</span>
                    <span className="exclusive-loot__original-price">{deal.originalPrice}</span>
                  </div>
                  <span className="exclusive-loot__grab-btn">Grab deal!!</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExclusiveLootSection
