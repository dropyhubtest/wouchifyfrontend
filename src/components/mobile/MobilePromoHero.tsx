import React, { useState, useRef } from 'react'
import { mobilePromos } from '../../data/mobilePromos'
import './MobilePromoHero.css'

export const MobilePromoHero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollerRef.current) return
    const { scrollLeft, clientWidth } = scrollerRef.current
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < mobilePromos.length) {
        setActiveIndex(newIndex)
      }
    }
  }

  const scrollToIndex = (index: number) => {
    if (!scrollerRef.current) return
    const cardWidth = scrollerRef.current.clientWidth
    scrollerRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    })
    setActiveIndex(index)
  }

  if (!mobilePromos.length) return null

  return (
    <section className="mobile-promo-hero" aria-label="Featured Mobile Promotions">
      {/* Scrollable Promo Track */}
      <div
        ref={scrollerRef}
        className="mobile-promo-scroller"
        onScroll={handleScroll}
        tabIndex={0}
        role="region"
        aria-label="Promotional banner carousel"
      >
        <div className="mobile-promo-track">
          {mobilePromos.map((promo, idx) => (
            <a
              key={promo.id}
              href={promo.href}
              className="mobile-promo-banner"
              aria-label={promo.alt}
              tabIndex={idx === activeIndex ? 0 : -1}
            >
              <img
                src={promo.image}
                alt={promo.alt}
                className="mobile-promo-banner__img"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Dynamic Navigation Dots */}
      <div className="mobile-promo-dots" role="tablist" aria-label="Slide indicators">
        {mobilePromos.map((promo, index) => (
          <button
            key={promo.id}
            type="button"
            className={`mobile-promo-dot ${index === activeIndex ? 'mobile-promo-dot--active' : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to slide ${index + 1}: ${promo.name}`}
            aria-selected={index === activeIndex}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}

export default MobilePromoHero
