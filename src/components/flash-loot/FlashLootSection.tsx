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
              <img
                src={deal.image}
                alt={deal.alt}
                className="flash-loot__image"
                width="684"
                height="297"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashLootSection
