import React from 'react'
import { FLASH_LOOT_DEALS } from '../../data/flashLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './FlashLootSection.css'

export const FlashLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()

  return (
    <section
      className="flash-loot-section"
      aria-label="Flash Loot Deals"
      style={
        {
          '--flash-scale': sectionScale,
          height: `${574 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 574 Reference Canvas */}
      <div className="flash-loot-canvas">
        {/* Section Header with Red Accent */}
        <div className="flash-loot__header">
          <div className="flash-loot__heading-accent" aria-hidden="true" />
          <h2 className="flash-loot__title">Flash Loot Deals</h2>
        </div>

        {/* Urgent Deal Label Pill */}
        <div className="flash-loot__urgent-pill" aria-label="Grab Before Gone!!">
          Grab Before Gone!!
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals?type=flash" className="flash-loot__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Flash Deals Track / Container */}
        <div className="flash-loot__track">
          {FLASH_LOOT_DEALS.map((deal) => (
            <a
              key={deal.id}
              href={deal.href}
              className="flash-loot__card"
              aria-label={`View ${deal.title} flash deal`}
            >
              {/* Left Image Area */}
              <div className="flash-loot__media">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="flash-loot__product-img"
                  width="300"
                  height="297"
                />
                <div className="flash-loot__discount-badge" aria-label={`${deal.discount} off`}>
                  <span className="flash-loot__discount-val">{deal.discount}</span>
                  <span className="flash-loot__discount-txt">off!</span>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flash-loot__details">
                <div className="flash-loot__top-row">
                  <span className="flash-loot__tag">{deal.category}</span>
                  <img
                    src={deal.storeLogo}
                    alt={deal.storeName}
                    className="flash-loot__store-logo"
                  />
                </div>
                <h3 className="flash-loot__card-title">{deal.title}</h3>
                <div className="flash-loot__price-group">
                  <span className="flash-loot__price">₹{deal.currentPrice}</span>
                  <span className="flash-loot__original-price">₹{deal.originalPrice}</span>
                </div>
                <div className="flash-loot__cta-row">
                  <span className="flash-loot__grab-btn">Grab deal!!</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashLootSection
