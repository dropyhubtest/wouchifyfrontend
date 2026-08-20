import React, { useState } from 'react'
import { FEATURED_CREDIT_CARDS } from '../../data/featuredCreditCards'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './FeaturedCreditCardsSection.css'

const DOT_LEFT_POSITIONS = [695, 783, 871, 959, 1047]

export const FeaturedCreditCardsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const currentCard =
    FEATURED_CREDIT_CARDS[activeIndex] || FEATURED_CREDIT_CARDS[0]

  return (
    <section
      className="featured-credit-cards-section"
      aria-label="Top Featured Credit Cards"
      style={
        {
          '--credit-cards-scale': sectionScale,
          height: `${624 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 624 Reference Canvas */}
      <div className="featured-credit-cards-canvas">
        {/* Section Heading with Dark Accent */}
        <div className="featured-credit-cards__heading-accent" aria-hidden="true" />
        <h2 className="featured-credit-cards__title">Top Featured Credit Cards</h2>

        {/* Navy Sub-Pill and Text */}
        <div className="featured-credit-cards__pill" aria-hidden="true" />
        <p className="featured-credit-cards__pill-text">
          Check the exclusive offers now!!
        </p>

        {/* Active Credit Card Data Content */}
        <img
          src={currentCard.bankMark}
          alt={`${currentCard.bank} logo mark`}
          className="featured-credit-cards__bank-mark"
          width="273"
          height="273"
        />

        <h3 className="featured-credit-cards__bank-heading">
          {currentCard.heading}
        </h3>

        <p className="featured-credit-cards__offer-description">
          {currentCard.description}
        </p>

        {/* Clickable Credit Card Anchor */}
        <a
          href={currentCard.href}
          aria-label={`View ${currentCard.heading} credit card offer`}
          className="featured-credit-cards__card-link"
        >
          <img
            src={currentCard.cardImage}
            alt={`${currentCard.heading} credit card`}
            className="featured-credit-cards__card-image"
            width="613"
            height="561"
          />
        </a>

        {/* Pagination Dots (5 total matching Figma) */}
        {DOT_LEFT_POSITIONS.map((leftPos, index) => {
          const isActive = index === activeIndex
          const hasDataForIndex = index < FEATURED_CREDIT_CARDS.length
          return (
            <button
              key={index}
              type="button"
              className={`featured-credit-cards__dot ${
                isActive ? 'featured-credit-cards__dot--active' : ''
              }`}
              style={{ left: `${leftPos}px` }}
              aria-label={`Go to credit card slide ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => {
                if (hasDataForIndex) {
                  setActiveIndex(index)
                }
              }}
            />
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedCreditCardsSection
