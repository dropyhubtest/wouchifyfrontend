import React, { useEffect, useRef } from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import { DEALS_HERO_DATA } from '../../data/dealsPage'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { HangingPromoTags } from './HangingPromoCard'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import heroImage from '../../assets/deals/hero/hero_image.png'

import './DealsHero.css'

/* ==========================================================================
   Full Canvas Sweeping Morph Interpolator (Seamless Green Curve Ending & Reversible)
   Stage 0: Initial State (matches right crescent of bg_animation_1)
   Stage 1: Red Line boundary on top-right (x=1200 at top)
   Stage 2: Green Arc 1 (Sweeps across upper canvas from (0, 50) to (1550, 657))
   Stage 3: Green Arc 2 (Sweeps downward through center from (0, 220) to (1250, 657))
   Stage 4: Green Arc 3 (Sweeps through copy area, left edge connects to corner)
   Stage 5: Exact Green Curve Arc (between x=200px and x=520px with apex at 360, 585)
   Stage 6: 100% Seamless Full Fill (smoothly flattens green arc against bottom edge)
   ========================================================================== */

const STAGE_0 = [
  1920, 657, 1860, 580, 1780, 500, 1700, 420, 1640, 350, 1600, 280, 1600, 220,
  1600, 150, 1590, 60, 1580, 0, 1580, 0,
]

const STAGE_1 = [
  1350, 657, 1380, 570, 1420, 460, 1400, 360, 1380, 270, 1340, 180, 1280, 100,
  1240, 50, 1215, 20, 1200, 0, 1200, 0,
]

const STAGE_2 = [
  1550, 657, 1500, 520, 1250, 380, 950, 240, 750, 150, 500, 90, 280, 60,
  160, 45, 60, 45, 0, 50, 0, 0,
]

const STAGE_3 = [
  1250, 657, 1200, 540, 1000, 420, 760, 320, 580, 240, 380, 200, 200, 200,
  120, 200, 40, 210, 0, 220, 0, 0,
]

const STAGE_4 = [
  800, 657, 720, 580, 600, 510, 460, 490, 320, 490, 180, 530, 80, 590,
  30, 620, 5, 645, 0, 657, 0, 0,
]

const STAGE_5 = [
  520, 657, 480, 615, 420, 585, 360, 585, 300, 585, 240, 615, 200, 657,
  130, 657, 60, 657, 0, 657, 0, 0,
]

const STAGE_6 = [
  520, 657, 480, 657, 420, 657, 360, 657, 300, 657, 240, 657, 200, 657,
  130, 657, 60, 657, 0, 657, 0, 0,
]

function buildPathString(n: number[]): string {
  return `M 1920 0 L 1920 657 L ${n[0]} ${n[1]} C ${n[2]} ${n[3]}, ${n[4]} ${n[5]}, ${n[6]} ${n[7]} C ${n[8]} ${n[9]}, ${n[10]} ${n[11]}, ${n[12]} ${n[13]} C ${n[14]} ${n[15]}, ${n[16]} ${n[17]}, ${n[18]} ${n[19]} L ${n[20]} ${n[21]} Z`
}

function lerpArrays(a: number[], b: number[], t: number): number[] {
  return a.map((val, i) => val + (b[i] - val) * t)
}

function interpolateMultiStagePath(t: number): string {
  if (t <= 0) return buildPathString(STAGE_0)
  if (t >= 1) return buildPathString(STAGE_6)

  if (t < 0.18) {
    const localT = t / 0.18
    return buildPathString(lerpArrays(STAGE_0, STAGE_1, localT))
  } else if (t < 0.36) {
    const localT = (t - 0.18) / 0.18
    return buildPathString(lerpArrays(STAGE_1, STAGE_2, localT))
  } else if (t < 0.54) {
    const localT = (t - 0.36) / 0.18
    return buildPathString(lerpArrays(STAGE_2, STAGE_3, localT))
  } else if (t < 0.72) {
    const localT = (t - 0.54) / 0.18
    return buildPathString(lerpArrays(STAGE_3, STAGE_4, localT))
  } else if (t < 0.88) {
    const localT = (t - 0.72) / 0.16
    return buildPathString(lerpArrays(STAGE_4, STAGE_5, localT))
  } else {
    const localT = (t - 0.88) / 0.12
    return buildPathString(lerpArrays(STAGE_5, STAGE_6, localT))
  }
}

/**
 * Smooth power2 easeInOut matching StoresPage deliberate animation
 */
function power2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const MORPH_DURATION = 3600 // 3.6s smooth, deliberate morph
const HOLD_DURATION = 10000 // 10.0s hold on full fill before reverting
const INITIAL_AUTO_DELAY = 7470 // 7.47s sequence delay from video recording

type AnimationState = 'idle' | 'morphingToActive' | 'active' | 'morphingToNormal'

export const DealsHero: React.FC = () => {
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

  const startBackwardSequence = () => {
    const path = pathRef.current
    if (!path) return

    animStateRef.current = 'morphingToNormal'
    let reverseStartTime: number | null = null

    const stepBackward = (reverseNow: number) => {
      if (reverseStartTime === null) reverseStartTime = reverseNow
      const revElapsed = reverseNow - reverseStartTime
      const revProgress = Math.min(1, revElapsed / MORPH_DURATION)
      const revEased = power2InOut(revProgress)
      const t = 1 - revEased

      if (revProgress >= 1) {
        path.setAttribute('d', buildPathString(STAGE_0))
        animStateRef.current = 'idle'
        rafRef.current = null
        timerRef.current = null
      } else {
        path.setAttribute('d', interpolateMultiStagePath(t))
        rafRef.current = requestAnimationFrame(stepBackward)
      }
    }

    rafRef.current = requestAnimationFrame(stepBackward)
  }

  const triggerRevealAnimation = () => {
    if (animStateRef.current !== 'idle') return

    const path = pathRef.current
    if (!path) return

    // Reduced motion immediately sets final state
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.setAttribute('d', buildPathString(STAGE_6))
      animStateRef.current = 'active'
      timerRef.current = window.setTimeout(() => {
        path.setAttribute('d', buildPathString(STAGE_0))
        animStateRef.current = 'idle'
      }, HOLD_DURATION)
      return
    }

    animStateRef.current = 'morphingToActive'
    let startTime: number | null = null

    const stepForward = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / MORPH_DURATION)
      const eased = power2InOut(progress)

      if (progress >= 1) {
        path.setAttribute('d', buildPathString(STAGE_6))
        animStateRef.current = 'active'
        rafRef.current = null

        // Hold for 10 seconds then smoothly morph back to original state
        timerRef.current = window.setTimeout(() => {
          startBackwardSequence()
        }, HOLD_DURATION)
      } else {
        path.setAttribute('d', interpolateMultiStagePath(eased))
        rafRef.current = requestAnimationFrame(stepForward)
      }
    }

    rafRef.current = requestAnimationFrame(stepForward)
  }

  useEffect(() => {
    // Sequence auto-start at 7.47s
    timerRef.current = window.setTimeout(() => {
      triggerRevealAnimation()
    }, INITIAL_AUTO_DELAY)

    return () => {
      cleanup()
    }
  }, [])

  const handleMouseEnter = () => {
    // Triggers animation if idle; if held >10s and reverted to idle, hovering will start it again!
    if (animStateRef.current === 'idle') {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      triggerRevealAnimation()
    }
  }

  return (
    <section
      className="deals-hero-section"
      aria-label="Deals Hero"
      style={{ height: `${657 * scale}px` }}
    >
      <div
        className="deals-hero-canvas"
        onMouseEnter={handleMouseEnter}
      >
        {/* Background Artwork Stack (Clipped at 657px visible baseline) */}
        <div className="deals-hero__art-clip" aria-hidden="true">
          <div className="deals-hero__art-canvas">
            {/* Layer 0.5: Animated Main Watermark (upper left) */}
            <WatermarkAnimation
              state1Src={watermarkMain}
              state2Src={watermarkMainState2}
              className="deals-hero__watermark-wrap"
            />

            {/* Layer 1: Morphing Navy Wave Silhouette SVG (#282D78) */}
            <svg
              className="deals-hero__wave-animated"
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
                fill="#282D78"
              />
            </svg>

            {/* Layer 2: Confetti / party texture overlay PNG (z-index: 2, above SVG) */}
            <img
              src={dealsHeroBackground}
              alt=""
              className="deals-hero__bg-overlay"
              width="1920"
              height="657"
            />
          </div>
        </div>

        {/* Animation 1: Hanging Promotional Tags */}
        <HangingPromoTags />

        {/* Layer 5: Main 3D Product Group on Red Platform (Static) */}
        <div className="deals-hero__products-container" aria-hidden="true">
          <img
            src={heroImage}
            alt=""
            className="deals-hero__product-group"
            width="1000"
            height="650"
          />
        </div>

        {/* Layer 6: 10% rewards circular badge (Static) */}
        <div className="deals-hero__badge-10" aria-hidden="true">
          <span className="deals-hero__badge-10-num">10%</span>
          <span className="deals-hero__badge-10-label">rewards!</span>
        </div>

        {/* Layer 7: 55% off circular badge (Static) */}
        <div className="deals-hero__badge-55" aria-hidden="true">
          <span className="deals-hero__badge-55-num">55%</span>
          <span className="deals-hero__badge-55-label">off</span>
        </div>

        {/* Layer 8: Left Hero Content & Copy */}
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
