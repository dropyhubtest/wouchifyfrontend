import React from 'react'
import { POPULAR_BRANDS_CAROUSEL } from '../../data/popularBrands'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { BrandRewardCard } from './BrandRewardCard'
import './PopularBrandsSection.css'

export const PopularBrandsSection: React.FC = () => {
  const sectionScale = useDesktopScale()

  return (
    <section
      id="popular-brands"
      className="popular-brands-section"
      aria-label="Most Popular Brands"
      style={
        {
          '--popular-scale': sectionScale,
          height: `${902 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 1022 Reference Canvas */}
      <div className="popular-brands-canvas">
        {/* Heading Container */}
        <div className="popular-brands__header">
          <div className="popular-brands__heading-accent" aria-hidden="true" />
          <h2 className="popular-brands__title">Most Popular Brands</h2>
        </div>

        {/* Carousel Viewport (Now Scrollable) */}
        <div className="popular-brands__viewport">
          {/* 2-Row x N-Column Track */}
          <div className="popular-brands__track">
            {POPULAR_BRANDS_CAROUSEL.map((brand) => (
              <BrandRewardCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularBrandsSection
