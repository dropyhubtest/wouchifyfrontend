import React, { useState } from 'react'
import arrowLeftCircle from '../../assets/brands/arrow-left-circle.svg'
import arrowRightCircle from '../../assets/brands/arrow-right-circle.svg'
import { TOP_STORES } from '../../data/topStores'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './TopStoresSection.css'

const TILE_STEP_PX = 452 // 398px tile width + 54px gap
const VISIBLE_TILES = 4
const MAX_STEP = Math.max(0, TOP_STORES.length - VISIBLE_TILES)

const getInitialStoreStep = (): number => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('storeStep')
    if (stepParam) {
      const parsed = parseInt(stepParam, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= MAX_STEP) {
        return parsed
      }
    }
  }
  return 0
}

export const TopStoresSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [currentStep, setCurrentStep] = useState<number>(getInitialStoreStep)

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
      className="top-stores-section"
      aria-label="Shop by top Stores"
      style={
        {
          '--stores-scale': sectionScale,
          height: `${493 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 493 Reference Canvas */}
      <div className="top-stores-canvas">
        {/* Section Header with Red Accent */}
        <div className="top-stores__header">
          <div className="top-stores__heading-accent" aria-hidden="true" />
          <h2 className="top-stores__title">Shop by top Stores</h2>
        </div>

        {/* Go to Stores CTA */}
        <a href="/stores" className="top-stores__cta">
          Go to Stores&gt;&gt;
        </a>

        {/* Promo Carousel Viewport */}
        <div className="top-stores__viewport">
          <div
            className="top-stores__track"
            style={{
              transform: `translateX(-${currentStep * TILE_STEP_PX}px)`,
            }}
          >
            {TOP_STORES.map((store) => (
              <a
                key={store.id}
                href={store.href}
                className="top-stores__tile"
                aria-label={`Shop on ${store.name}`}
              >
                <img
                  src={store.image}
                  alt={store.alt}
                  className="top-stores__image"
                  width="398"
                  height="237"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (46 x 46 px) */}
        {isLeftVisible && (
          <button
            type="button"
            className="top-stores__arrow top-stores__arrow--left"
            onClick={handlePrev}
            aria-label="Previous stores"
          >
            <img
              src={arrowLeftCircle}
              alt=""
              width="46"
              height="46"
              aria-hidden="true"
            />
          </button>
        )}

        {isRightVisible && (
          <button
            type="button"
            className="top-stores__arrow top-stores__arrow--right"
            onClick={handleNext}
            aria-label="Next stores"
          >
            <img
              src={arrowRightCircle}
              alt=""
              width="46"
              height="46"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </section>
  )
}

export default TopStoresSection
