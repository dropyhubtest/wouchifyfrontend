import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FavouriteStores } from '../components/stores'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero/WatermarkAnimation'
import { STORES_HERO_DATA } from '../data/storesHero'
import { useDesktopScale } from '../hooks/useDesktopScale'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import storesHeroBackground from '../assets/stores/hero/stores-hero-background.png'
import storesHeroCartBackdrop from '../assets/stores/hero/stores-hero-cart-backdrop.png'
import storesHeroCart from '../assets/stores/hero/stores-hero-cart.png'
import storesHeroShopper from '../assets/stores/hero/stores-hero-shopper.png'

import './StoresPage.css'

/* ==========================================================================
   SVG Path Morph Animation Constants & State Machine
   ========================================================================== */

const STATE_1_PATH =
  'M332.28 833.464L459.99 1189.11L2267.02 540.226L2073.03 0.00028921C2073.03 0.00028921 1761.97 356.415 1465.3 464.723C1204.95 559.774 1043.65 425.27 785.517 525.863C578.565 606.511 332.28 833.464 332.28 833.464Z'

const STATE_2_PATH =
  'M-270.695 267.931L105.768 1316.31L2267.02 540.226L1695.17 -1052.25C1695.17 -1052.25 1459.5 -246.244 1105.67 -113.945C795.149 2.15976 495.01 -457.295 190.68 -324.726C-53.312 -218.442 -270.695 267.931 -270.695 267.931Z'

const STATE_1_NUMS = [
  332.28, 833.464, 459.99, 1189.11, 2267.02, 540.226, 2073.03, 0.00028921,
  2073.03, 0.00028921, 1761.97, 356.415, 1465.3, 464.723, 1204.95, 559.774,
  1043.65, 425.27, 785.517, 525.863, 578.565, 606.511, 332.28, 833.464,
  332.28, 833.464,
]

const STATE_2_NUMS = [
  -270.695, 267.931, 105.768, 1316.31, 2267.02, 540.226, 1695.17, -1052.25,
  1695.17, -1052.25, 1459.5, -246.244, 1105.67, -113.945, 795.149, 2.15976,
  495.01, -457.295, 190.68, -324.726, -53.312, -218.442, -270.695, 267.931,
  -270.695, 267.931,
]

function interpolatePath(t: number): string {
  if (t <= 0) return STATE_1_PATH
  if (t >= 1) return STATE_2_PATH
  const n = STATE_1_NUMS.map((v, i) => v + (STATE_2_NUMS[i] - v) * t)
  return `M${n[0]} ${n[1]}L${n[2]} ${n[3]}L${n[4]} ${n[5]}L${n[6]} ${n[7]}C${n[8]} ${n[9]} ${n[10]} ${n[11]} ${n[12]} ${n[13]}C${n[14]} ${n[15]} ${n[16]} ${n[17]} ${n[18]} ${n[19]}C${n[20]} ${n[21]} ${n[22]} ${n[23]} ${n[24]} ${n[25]}Z`
}

/**
 * power2.inOut easing: smooth acceleration and gentle deceleration
 */
function power2InOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const MORPH_DURATION = 4000 // 4.0s slow, deliberate morph
const HOLD_DURATION = 7000 // 7.0s hold on State 2

type AnimationState = 'idle' | 'morphingToActive' | 'active' | 'morphingToNormal'

export const StoresPage: React.FC = () => {
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

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const handleMouseEnter = () => {
    // Only trigger red wave sequence if idle; do nothing if sequence is already in progress
    if (animStateRef.current !== 'idle') return

    const path = pathRef.current
    if (!path) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    animStateRef.current = 'morphingToActive'
    let startTime: number | null = null

    // Phase 1: Morph State 1 -> State 2 (4000ms, power2.inOut)
    const stepForward = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / MORPH_DURATION)
      const eased = power2InOut(progress)

      if (progress >= 1) {
        path.setAttribute('d', STATE_2_PATH)
        animStateRef.current = 'active'
        rafRef.current = null

        // Phase 2: Hold State 2 for 7 seconds (7000ms)
        timerRef.current = window.setTimeout(() => {
          animStateRef.current = 'morphingToNormal'
          let reverseStartTime: number | null = null

          // Phase 3: Morph State 2 -> State 1 (4000ms, power2.inOut)
          const stepBackward = (reverseNow: number) => {
            if (reverseStartTime === null) reverseStartTime = reverseNow
            const revElapsed = reverseNow - reverseStartTime
            const revProgress = Math.min(1, revElapsed / MORPH_DURATION)
            const revEased = power2InOut(revProgress)
            const t = 1 - revEased

            if (revProgress >= 1) {
              path.setAttribute('d', STATE_1_PATH)
              animStateRef.current = 'idle'
              rafRef.current = null
              timerRef.current = null
            } else {
              path.setAttribute('d', interpolatePath(t))
              rafRef.current = requestAnimationFrame(stepBackward)
            }
          }

          rafRef.current = requestAnimationFrame(stepBackward)
        }, HOLD_DURATION)
      } else {
        path.setAttribute('d', interpolatePath(eased))
        rafRef.current = requestAnimationFrame(stepForward)
      }
    }

    rafRef.current = requestAnimationFrame(stepForward)
  }

  return (
    <div className="stores-page" style={{ '--stores-scale': scale } as React.CSSProperties}>
      {/* 1. Header Background Layer (height: 131px, z-index: 10, #EEEFFF) */}
      <div
        className="stores-page__header-bg"
        style={{ height: `${131 * scale}px` }}
        aria-hidden="true"
      />

      {/* 2. Transparent Navbar (z-index: 30) */}
      <div className="stores-page__navbar-wrapper">
        <Navbar activeNav="stores" transparent={true} />
      </div>

      {/* 3. Stores Hero Section (1920 x 590 px Visible Canvas, overflow-visible for shopper) */}
      <section
        className="stores-hero-section"
        aria-label="Stores Hero"
        style={{ height: `${590 * scale}px` }}
      >
        <div
          className="stores-hero-canvas"
          onMouseEnter={handleMouseEnter}
        >
          {/* Background Artwork Stack (Clipped at 590px visible baseline) */}
          <div className="stores-hero__art-clip" aria-hidden="true">
            <div className="stores-hero__art-canvas">
              {/* Layer 0: Cream fallback base (#FFF7E1) set on .stores-hero__art-canvas */}

              {/* Layer 0.5: Animated Main Watermark (Exact Desktop Home Implementation) */}
              <WatermarkAnimation
                state1Src={watermarkMain}
                state2Src={watermarkMainState2}
                className="stores-hero__watermark-wrap"
              />

              {/* Layer 1: Morphing red wave silhouette SVG (Hover triggered: 4s morph -> 7s hold -> 4s reverse) */}
              <svg
                className="stores-hero__wave-animated"
                width="1920"
                height="611"
                viewBox="0 0 1920 611"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path ref={pathRef} d={STATE_1_PATH} fill="#E31E25" />
              </svg>

              {/* Layer 2: Confetti/party texture overlay PNG (z-index: 2, rendered above SVG) */}
              <img
                src={storesHeroBackground}
                alt=""
                className="stores-hero__bg-overlay"
                width="1920"
                height="611"
              />
            </div>
          </div>

          {/* Foreground Visual Assets */}

          {/* Layer 3: Cart backdrop circle (behind cart, z-index: 3) */}
          <img
            src={storesHeroCartBackdrop}
            alt=""
            className="stores-hero__cart-backdrop"
            width="528"
            height="528"
            aria-hidden="true"
          />

          {/* Layer 4: Shopping cart (z-index: 4) */}
          <img
            src={storesHeroCart}
            alt=""
            className="stores-hero__cart"
            width="643"
            height="510"
            aria-hidden="true"
          />

          {/* Layer 5: Shopper visual (z-index: 5, extends -70px into navbar) */}
          <img
            src={storesHeroShopper}
            alt=""
            className="stores-hero__shopper"
            width="607"
            height="660"
            aria-hidden="true"
          />

          {/* Layer 10: Hero Text Copy & CTA */}
          <div className="stores-hero__badge">{STORES_HERO_DATA.badge}</div>

          <h1 className="stores-hero__heading">
            <span className="stores-hero__heading-main">Shop at</span>
            <span className="stores-hero__heading-sub">100+ Verified Stores</span>
          </h1>

          <p className="stores-hero__description">{STORES_HERO_DATA.description}</p>

          <a href={STORES_HERO_DATA.ctaHref} className="stores-hero__cta">
            {STORES_HERO_DATA.ctaText}
          </a>
        </div>
      </section>

      {/* Favourite Stores Section */}
      <FavouriteStores />

      {/* Footer Section */}
      <FooterSection />
    </div>
  )
}

export default StoresPage
