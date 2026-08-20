import React from 'react'
import { EXCLUSIVE_LOOT_DEALS } from '../../data/exclusiveLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './ExclusiveLootSection.css'

export const ExclusiveLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()

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
          {EXCLUSIVE_LOOT_DEALS.map((deal) => (
            <a
              key={deal.id}
              href={deal.href}
              className="exclusive-loot__card"
              aria-label={`View ${deal.title} exclusive deal`}
            >
              <img
                src={deal.image}
                alt={deal.alt}
                className="exclusive-loot__image"
                width="684"
                height="296"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExclusiveLootSection
