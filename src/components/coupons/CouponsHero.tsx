import React, { useEffect, useRef } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import couponsHeroImage from '../../assets/coupons/couponsheroimage.png'

import styles from './CouponsHero.module.css'

/* ==========================================================================
   Hyper-Pronounced S-Curve Interpolator (Accelerated Top Crest Matrix)
   Format: [
     xTop, yTop,
     cp0b_x, cp0b_y, cp1a_x, cp1a_y, xCrest, yCrest,
     cp1b_x, cp1b_y, cp2a_x, cp2a_y, xTrough, yTrough,
     cp2b_x, cp2b_y, cp3a_x, cp3a_y, xBot, yBot
   ]
   ========================================================================== */

// Stage 0: Idle static wedge (apex at 175, 235; lower boundary flush along x=0)
const STAGE_0 = [
  0, 30,
  60, 90, 150, 160, 175, 235,
  175, 275, 50, 315, 0, 325,
  0, 420, 0, 540, 0, 657,
]

// Stage 1: Immediate explosive S-curve emergence (Crest leads at 740px, Trough at 90px; Δx = 650px)
const STAGE_1 = [
  240, 0,
  380, 70, 760, 130, 740, 210,
  710, 290, 120, 360, 90, 450,
  70, 520, 180, 590, 240, 657,
]

// Stage 2: Mid-canvas high-amplitude S-curve (Crest at 1480px, Trough at 440px; Δx = 1040px)
const STAGE_2 = [
  860, 0,
  1060, 70, 1520, 130, 1480, 210,
  1430, 290, 480, 360, 440, 450,
  410, 520, 560, 590, 660, 657,
]

// Stage 3: Top Outer Crest SEALS FIRST at right boundary (x = 1920px) at only ~60% timeline
const STAGE_3 = [
  1560, 0,
  1720, 70, 1920, 130, 1920, 210,
  1920, 290, 940, 360, 880, 450,
  830, 520, 1020, 590, 1140, 657,
]

// Stage 4: Top flattens along right border while trailing waist sweeps forward
const STAGE_4 = [
  1920, 0,
  1920, 70, 1920, 130, 1920, 210,
  1920, 290, 1480, 360, 1440, 450,
  1400, 520, 1500, 590, 1580, 657,
]

// Stage 5: Inner curve nears full boundary closure
const STAGE_5 = [
  1920, 0,
  1920, 70, 1920, 130, 1920, 210,
  1920, 290, 1840, 360, 1820, 450,
  1800, 520, 1840, 590, 1860, 657,
]

// Stage 6: 100% Canvas Seal
const STAGE_6 = [
  1920, 0,
  1920, 70, 1920, 130, 1920, 210,
  1920, 290, 1920, 360, 1920, 450,
  1920, 520, 1920, 590, 1920, 657,
]

function buildPathString(p: number[]): string {
  return `M 0 0 L ${p[0]} ${p[1]} C ${p[2]} ${p[3]}, ${p[4]} ${p[5]}, ${p[6]} ${p[7]} C ${p[8]} ${p[9]}, ${p[10]} ${p[11]}, ${p[12]} ${p[13]} C ${p[14]} ${p[15]}, ${p[16]} ${p[17]}, ${p[18]} ${p[19]} L 0 657 Z`
}

function lerpArrays(a: number[], b: number[], t: number): number[] {
  return a.map((val, i) => val + (b[i] - val) * t)
}

function interpolateMultiStagePath(t: number): string {
  if (t <= 0) return buildPathString(STAGE_0)
  if (t >= 1) return buildPathString(STAGE_6)

  // Stage 3 (top outer crest hitting x = 1920px) completes early at t = 0.60
  if (t < 0.18) {
    return buildPathString(lerpArrays(STAGE_0, STAGE_1, t / 0.18))
  } else if (t < 0.38) {
    return buildPathString(lerpArrays(STAGE_1, STAGE_2, (t - 0.18) / 0.20))
  } else if (t < 0.60) {
    return buildPathString(lerpArrays(STAGE_2, STAGE_3, (t - 0.38) / 0.22))
  } else if (t < 0.80) {
    return buildPathString(lerpArrays(STAGE_3, STAGE_4, (t - 0.60) / 0.20))
  } else if (t < 0.93) {
    return buildPathString(lerpArrays(STAGE_4, STAGE_5, (t - 0.80) / 0.13))
  } else {
    return buildPathString(lerpArrays(STAGE_5, STAGE_6, (t - 0.93) / 0.07))
  }
}

function power2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const MORPH_DURATION = 2000     // 2.0s smooth wave sweep
const INITIAL_AUTO_DELAY = 1000 // 1.0s auto-trigger after page mount

type AnimationState = 'idle' | 'morphing' | 'completed'

export const CouponsHero: React.FC = () => {
  const scale = useDesktopScale()
  const pathRef = useRef<SVGPathElement | null>(null)
  const animStateRef = useRef<AnimationState>('idle')
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const cleanup = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const triggerRevealAnimation = () => {
    if (animStateRef.current !== 'idle') return
    const path = pathRef.current
    if (!path) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.setAttribute('d', buildPathString(STAGE_6))
      animStateRef.current = 'completed'
      return
    }

    animStateRef.current = 'morphing'
    let startTime: number | null = null

    const stepForward = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / MORPH_DURATION)
      const eased = power2InOut(progress)

      if (progress >= 1) {
        path.setAttribute('d', buildPathString(STAGE_6))
        animStateRef.current = 'completed'
        rafRef.current = null
      } else {
        path.setAttribute('d', interpolateMultiStagePath(eased))
        rafRef.current = requestAnimationFrame(stepForward)
      }
    }

    rafRef.current = requestAnimationFrame(stepForward)
  }

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      triggerRevealAnimation()
    }, INITIAL_AUTO_DELAY)

    return () => {
      cleanup()
    }
  }, [])

  return (
    <section
      className={styles.heroSection}
      aria-label="Coupons Hero"
      style={{ height: `${657 * scale}px` }}
    >
      <div className={styles.heroCanvas}>
        {/* Background Artwork Stack */}
        <div className={styles.artClip} aria-hidden="true">
          <div className={styles.artCanvas}>
            {/* Morphing Red Wave SVG Fill (#E31E25) */}
            <svg
              className={styles.redWaveSvg}
              width="1920"
              height="657"
              viewBox="0 0 1920 657"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                ref={pathRef}
                d={buildPathString(STAGE_0)}
                fill="#E31E25"
              />
            </svg>

            {/* Layer 2: Big Animated Watermark */}
            <WatermarkAnimation
              className={styles.watermarkMainWrap}
              height={266}
              width={403}
              state1Src={watermarkMain}
              state2Src={watermarkMainState2}
            />

            {/* Layer 3: Confetti & Tickets Texture Overlay (Visible above red wave) */}
            <img
              src={dealsHeroBackground}
              alt=""
              className={styles.bgOverlay}
              width="1920"
              height="657"
            />
          </div>
        </div>

        {/* Small Animated Watermark */}
        <WatermarkAnimation
          className={styles.watermarkSecondaryWrap}
          height={210}
          width={318}
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
        />

        {/* Left Copy Block (z-index: 15) */}
        <div className={styles.copyBlock}>
          <div className={styles.lootPillBadge}>LOOT DEALS</div>

          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>Save Big</span>
            <span className={styles.headlineLine}>with Verified Codes</span>
          </h1>

          <p className={styles.subtitle}>
            Hand-picked coupon codes — all verified and ready to use.
          </p>

          <a href="#available-coupons" className={styles.ctaPill}>
            Explore Coupons Now!!
          </a>
        </div>

        {/* Hanging Promotional Tags (z-index: 22) */}
        <div className={styles.hangingContainer} aria-hidden="true">
          <div className={`${styles.couponsTagItem} ${styles.couponsTag70}`}>
            <div className={styles.string} style={{ height: '260px' }} />
            <div className={styles.tag70}>
              <span className={styles.tag70Val}>70%</span>
              <span className={styles.tag70Sub}>off</span>
            </div>
          </div>

          <div className={`${styles.couponsTagItem} ${styles.couponsTag25}`}>
            <div className={styles.string} style={{ height: '420px' }} />
            <div className={styles.tag25}>
              <span className={styles.tag25Val}>25%</span>
              <span className={styles.tag25Sub}>rewards</span>
            </div>
          </div>
        </div>

        {/* Right Hero Graphic (z-index: 20) */}
        <div className={styles.illustrationContainer} aria-hidden="true">
          <div className={styles.circleBackdrop} />
          <img
            src={couponsHeroImage}
            alt="Coupons Hero Model"
            className={styles.illustrationImg}
            width="530"
            height="530"
          />
        </div>
      </div>
    </section>
  )
}

export default CouponsHero
