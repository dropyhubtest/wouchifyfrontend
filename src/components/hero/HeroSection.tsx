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

const AnimatedStatValue: React.FC<{ targetValueString: string, style?: React.CSSProperties }> = ({ targetValueString, style }) => {
  const [currentValue, setCurrentValue] = React.useState(0)
  
  const match = targetValueString.match(/^(\d+)(.*)$/)
  const targetNumber = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : targetValueString

  React.useEffect(() => {
    if (targetNumber === 0 && suffix === targetValueString) return

    let startTime: number
    let animationFrameId: number
    const duration = 2000 // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - percentage, 3)
      setCurrentValue(Math.floor(easeOut * targetNumber))
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    
    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [targetNumber, suffix, targetValueString])

  if (targetNumber === 0 && suffix === targetValueString) {
    return <span className="stat-value" style={style}>{targetValueString}</span>
  }

  return (
    <span className="stat-value" style={style}>
      {currentValue}{suffix}
    </span>
  )
}

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
              <AnimatedStatValue 
                targetValueString={stat.value}
                style={{ left: `${stat.valueLeft}px`, top: `${stat.valueTop}px` }} 
              />
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
