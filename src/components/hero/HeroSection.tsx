import React from 'react'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import { HeroVisual } from './HeroVisual'
import { WatermarkAnimation } from './WatermarkAnimation'
import { TRUST_STATISTICS } from '../../data/heroData'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './HeroSection.css'

export const HeroSection: React.FC = () => {
  const heroScale = useDesktopScale()

  return (
    <section
      className="hero-section"
      aria-label="Hero Introduction"
      style={
        {
          '--hero-scale': heroScale,
          height: `${938 * heroScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 938 Reference Canvas */}
      <div className="hero-canvas">
        {/* Animated Main Watermark */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className="hero-watermark-main-wrap"
        />

        {/* Eyebrow */}
        <p className="hero-eyebrow">
          Your morning just got better. Welcome to Wouchify!
        </p>

        {/* Live Deals Pill */}
        <div className="hero-live-deals-pill">
          <span className="live-deals-dot" aria-hidden="true" />
          <span className="live-deals-text">Live Deals Updated Daily</span>
        </div>

        {/* Main H1 */}
        <h1 className="hero-heading">
          <span className="heading-line heading-line-1">India’s</span>
          <span className="heading-line heading-line-2">
            #1 Free Deal Discovery
          </span>
          <span className="heading-line heading-line-3">Platform</span>
        </h1>

        {/* Hero Description with exact rich text structure & Poppins weights */}
        <p className="hero-description">
          Find verified{' '}
          <span className="desc-highlight">
            coupons, loot deals, giveaways &amp; credit card rewards
          </span>{' '}
          from
          <br />
          500+ top brands.
        </p>

        {/* Deal Chips */}
        <div className="hero-deal-chip hero-deal-chip-1">Instant Deals</div>
        <div className="hero-deal-chip hero-deal-chip-2">Instant Deals</div>

        {/* Primary CTA */}
        <button
          type="button"
          className="hero-primary-cta"
          aria-label="Explore Deals Now"
        >
          Explore Deals Now!!
        </button>

        {/* Hero Visual Container & Person Animations */}
        <HeroVisual />

        {/* Callout: Exclusive Deals Pill */}
        <div className="hero-exclusive-pill">Exclusive Deals!</div>

        {/* Callout: White Information Card */}
        <div className="hero-info-card">
          <h2 className="info-card-heading">
            Discover the Best Deals in India
          </h2>
          <p className="info-card-body">
            Handpicked coupons, loot deals and cashback offers updated every day.
          </p>
        </div>

        {/* Animated Secondary Watermark (behind Grab Deal CTA) */}
        <WatermarkAnimation
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          className="hero-watermark-secondary-wrap"
        />

        {/* Callout: Grab Deal CTA */}
        <button
          type="button"
          className="hero-grab-deal-cta"
          aria-label="Grab Deal now"
        >
          Grab Deal now!!
        </button>

        {/* Trust Statistics List */}
        <ul className="hero-trust-stats-list" aria-label="Trust Statistics">
          {TRUST_STATISTICS.map((stat) => (
            <li key={stat.id} className={`trust-stat-item stat-${stat.id}`}>
              <span
                className="stat-value"
                style={{ left: `${stat.valueLeft}px`, top: `${stat.valueTop}px` }}
              >
                {stat.value}
              </span>
              <span
                className="stat-label"
                style={{ left: `${stat.labelLeft}px`, top: `${stat.labelTop}px` }}
              >
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HeroSection
