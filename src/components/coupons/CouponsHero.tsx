import React from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import couponBgAnimation1 from '../../assets/coupons/couponbganimation1.png'
import couponsHeroImage from '../../assets/coupons/couponsheroimage.png'

import styles from './CouponsHero.module.css'

export const CouponsHero: React.FC = () => {
  const scale = useDesktopScale()

  return (
    <section
      className={styles.heroSection}
      aria-label="Coupons Hero"
      style={{ height: `${657 * scale}px` }}
    >
      <div className={styles.heroCanvas}>
        {/* Background Artwork Stack (1920 x 657) */}
        <div className={styles.artClip} aria-hidden="true">
          <div className={styles.artCanvas}>
            {/* Layer 1: Red Dynamic Left Wave Shape */}
            <img
              src={couponBgAnimation1}
              alt=""
              className={styles.redWaveImg}
              width="1920"
              height="657"
            />

            {/* Layer 2: Big Animated Watermark */}
            <WatermarkAnimation
              state1Src={watermarkMain}
              state2Src={watermarkMainState2}
              className={styles.watermarkMainWrap}
              width={403}
              height={266}
            />

            {/* Layer 3: Confetti & Tickets Texture Overlay */}
            <img
              src={dealsHeroBackground}
              alt=""
              className={styles.bgOverlay}
              width="1920"
              height="657"
            />
          </div>
        </div>

        {/* Small Animated Watermark on bottom-right ticket */}
        <WatermarkAnimation
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          className={styles.watermarkSecondaryWrap}
          width={318}
          height={210}
        />

        {/* Left Copy Block - Positioned lower so only 'Sa' overlaps red background */}
        <div className={styles.copyBlock}>
          {/* Dark Navy Pill Badge: LOOT DEALS */}
          <div className={styles.lootPillBadge}>
            LOOT DEALS
          </div>

          {/* Main Headline: Only 'Sa' is solid white on red, the rest is faint on cream */}
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>
              <span className={styles.headlineSolid}>Sa</span>
              <span className={styles.headlineFaint}>ve Big</span>
            </span>
            <span className={styles.headlineLine}>
              <span className={styles.headlineFaint}>with Verified Codes</span>
            </span>
          </h1>

          {/* Subtitle: Faint on cream */}
          <p className={styles.subtitle}>
            <span className={styles.subtitleFaint}>
              Hand-picked coupon codes — all verified and ready to use.
            </span>
          </p>

          {/* Navy Blue CTA Pill Button */}
          <a href="#available-coupons" className={styles.ctaPill}>
            Explore Coupons Now!!
          </a>
        </div>

        {/* Hanging Offer Promo Tags - Pushed further to bottom */}
        <div className={styles.hangingContainer} aria-hidden="true">
          {/* Tag 1: 70% Off with Silver String */}
          <div className={styles.hangingItem1}>
            <div className={styles.swayLeft}>
              <div className={styles.string} style={{ height: '275px' }} />
              <div className={styles.tag70}>
                <span className={styles.tag70Val}>70%</span>
                <span className={styles.tag70Sub}>off</span>
              </div>
            </div>
          </div>

          {/* Tag 2: 25% Rewards with Silver String */}
          <div className={styles.hangingItem2}>
            <div className={styles.swayCounter}>
              <div className={styles.string} style={{ height: '385px' }} />
              <div className={styles.tag25}>
                <span className={styles.tag25Val}>25%</span>
                <span className={styles.tag25Sub}>rewards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Illustration Zone: Pushed down towards bottom */}
        <div className={styles.illustrationContainer} aria-hidden="true">
          <div className={styles.circleBackdrop} />
          <img
            src={couponsHeroImage}
            alt="Coupons Hero Model"
            className={styles.illustrationImg}
            width="540"
            height="540"
          />
        </div>
      </div>
    </section>
  )
}

export default CouponsHero
