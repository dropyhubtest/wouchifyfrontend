import React, { useState } from 'react'
import arrowLeftCircle from '../../assets/brands/arrow-left-circle.svg'
import arrowRightCircle from '../../assets/brands/arrow-right-circle.svg'
import { POPULAR_BRANDS_CAROUSEL } from '../../data/popularBrands'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { BrandRewardCard } from './BrandRewardCard'
import './PopularBrandsSection.css'

const COLUMN_STEP_PX = 380 // 300px card width + 80px column gap
const TOTAL_COLUMNS = Math.ceil(POPULAR_BRANDS_CAROUSEL.length / 2) // 12 columns
const VISIBLE_COLUMNS = 4
const MAX_STEP = Math.max(0, TOTAL_COLUMNS - VISIBLE_COLUMNS) // 8 steps

const getInitialStep = (): number => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    if (stepParam) {
      const parsed = parseInt(stepParam, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= MAX_STEP) {
        return parsed
      }
    }
  }
  return 0
}

export const PopularBrandsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [currentStep, setCurrentStep] = useState<number>(getInitialStep)

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(MAX_STEP, prev + 1))
  }

  const isLeftVisible = currentStep > 0
  const isRightVisible = currentStep < MAX_STEP

  return (
    <section
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

        {/* Carousel Viewport */}
        <div className="popular-brands__viewport">
          {/* 2-Row x 12-Column Track */}
          <div
            className="popular-brands__track"
            style={{
              transform: `translateX(-${currentStep * COLUMN_STEP_PX}px)`,
            }}
          >
            {POPULAR_BRANDS_CAROUSEL.map((brand) => (
              <BrandRewardCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* Navigation Arrows (76 x 76 px) */}
        {isLeftVisible && (
          <button
            type="button"
            className="popular-brands__arrow popular-brands__arrow--left"
            onClick={handlePrev}
            aria-label="Previous brands"
          >
            <img
              src={arrowLeftCircle}
              alt=""
              width="76"
              height="76"
              aria-hidden="true"
            />
          </button>
        )}

        {isRightVisible && (
          <button
            type="button"
            className="popular-brands__arrow popular-brands__arrow--right"
            onClick={handleNext}
            aria-label="Next brands"
          >
            <img
              src={arrowRightCircle}
              alt=""
              width="76"
              height="76"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  )
}

export default PopularBrandsSection
