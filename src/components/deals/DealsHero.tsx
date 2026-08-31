import React from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import { DEALS_HERO_DATA } from '../../data/dealsPage'
import { useDesktopScale } from '../../hooks/useDesktopScale'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import bgAnimation1 from '../../assets/deals/hero/bg_animation_1.png'
import heroImage from '../../assets/deals/hero/hero_image.png'

import './DealsHero.css'

export const DealsHero: React.FC = () => {
  const scale = useDesktopScale()

  return (
    <section
      className="deals-hero-section"
      aria-label="Deals Hero"
      style={{ height: `${657 * scale}px` }}
    >
      <div className="deals-hero-canvas">
        {/* Background Artwork Stack (Clipped at 657px visible baseline) */}
        <div className="deals-hero__art-clip" aria-hidden="true">
          <div className="deals-hero__art-canvas">
            {/* Layer 0: Cream fallback base */}

            {/* Layer 0.5: Animated Main Watermark (upper left) */}
            <WatermarkAnimation
              state1Src={watermarkMain}
              state2Src={watermarkMainState2}
              className="deals-hero__watermark-wrap"
            />

            {/* Layer 1: Navy curved background shape (bg_animation_1) */}
            <img
              src={bgAnimation1}
              alt=""
              className="deals-hero__bg-shape"
              width="1920"
              height="657"
            />

            {/* Layer 1.5: Confetti / party texture overlay PNG */}
            <img
              src={dealsHeroBackground}
              alt=""
              className="deals-hero__bg-overlay"
              width="1920"
              height="657"
            />
          </div>
        </div>

        {/* Layer 2: Main 3D Product Group on Red Platform (Calibrated 1920px Footprint) */}
        <div className="deals-hero__products-container" aria-hidden="true">
          <img
            src={heroImage}
            alt=""
            className="deals-hero__product-group"
            width="1000"
            height="650"
          />
        </div>

        {/* Layer 3: 10% rewards circular badge (Figma x≈925-1072, center x≈1000, page y≈502 -> hero canvas top=295px) */}
        <div className="deals-hero__badge-10" aria-hidden="true">
          <span className="deals-hero__badge-10-num">10%</span>
          <span className="deals-hero__badge-10-label">rewards!</span>
        </div>

        {/* Layer 4: 55% off circular badge (Figma x≈1660, page y≈289 -> hero canvas top=158px) */}
        <div className="deals-hero__badge-55" aria-hidden="true">
          <span className="deals-hero__badge-55-num">55%</span>
          <span className="deals-hero__badge-55-label">off</span>
        </div>

        {/* Left Hero Content & Copy (Figma: Top Picks y≈503, Heading y≈550, Pill y≈629 -> hero canvas top=368px) */}
        <div className="deals-hero__copy">
          {/* Top Picks white pill badge */}
          <div className="deals-hero__top-picks-badge">
            {DEALS_HERO_DATA.badge}
          </div>

          {/* Main bold title */}
          <h1 className="deals-hero__heading">
            {DEALS_HERO_DATA.heading}
          </h1>

          {/* Verified deals red sub-pill */}
          <div className="deals-hero__verified-pill">
            {DEALS_HERO_DATA.subHeadingPill}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DealsHero
