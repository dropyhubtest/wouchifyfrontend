import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import creditCardsHeroImg from '../../assets/creditcardpage/creditpage_heroimage.png'

import styles from './CreditCardsHero.module.css'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const CANVAS_W = 1920
const CANVAS_H = 640
const DIAG_SPAN = Math.ceil(Math.sqrt(CANVAS_W * CANVAS_W + CANVAS_H * CANVAS_H)) + 200
const BAR_PITCH = 28
const NAVY_BAR_WIDTH = 22.5
const WHITE_BAR_WIDTH = 5.5
const TOTAL_BARS = Math.ceil(DIAG_SPAN / BAR_PITCH) + 4
const NAVY_FILL = '#282D78'

export const CreditCardsHero: React.FC = () => {
  const scale = useDesktopScale()

  // Animation DOM Refs
  const fullBarsGroupRef = useRef<SVGGElement | null>(null)
  const whiteBarsGroupRef = useRef<SVGGElement | null>(null)
  const heroClipRectRef = useRef<SVGRectElement | null>(null)
  const whiteBarsClipRectRef = useRef<SVGRectElement | null>(null)
  const baseNavyRectRef = useRef<SVGRectElement | null>(null)

  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)

  // Generate bar indices
  const barIndices = useMemo(() => {
    const indices: number[] = []
    for (let i = 0; i < TOTAL_BARS; i++) {
      indices.push(i)
    }
    return indices
  }, [])

  const runAnimation = useCallback(() => {
    if (hasRunRef.current) return
    hasRunRef.current = true

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) {
      if (baseNavyRectRef.current) baseNavyRectRef.current.style.display = 'block'
      return
    }

    // Slightly smoother & slower animation (750ms + 750ms = 1.5s total)
    const PHASE1_DURATION = 750 // 0.75s: Diagonal sweep from top-right to bottom-left
    const PHASE2_DURATION = 750 // 0.75s: White bars exit downwards, navy occupies
    const TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION

    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < PHASE1_DURATION) {
        // Phase 1: Diagonal bars sweep from top-right towards bottom-left
        const progress = Math.min(1, elapsed / PHASE1_DURATION)
        const eased = easeOutCubic(progress)
        const currentSpan = DIAG_SPAN * eased

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'block'
        }

        if (heroClipRectRef.current) {
          heroClipRectRef.current.setAttribute('x', '0')
          heroClipRectRef.current.setAttribute('width', currentSpan.toString())
        }

        if (baseNavyRectRef.current) {
          baseNavyRectRef.current.style.display = 'none'
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else if (elapsed < TOTAL_DURATION) {
        // Phase 2: White bars exit, solid navy fills
        const p2Elapsed = elapsed - PHASE1_DURATION
        const progress = Math.min(1, p2Elapsed / PHASE2_DURATION)
        const eased = easeInOutQuad(progress)

        const exitX = DIAG_SPAN * eased
        const remainingWidth = Math.max(0, DIAG_SPAN - exitX)

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }

        if (baseNavyRectRef.current) {
          baseNavyRectRef.current.style.display = 'block'
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'block'
        }

        if (whiteBarsClipRectRef.current) {
          whiteBarsClipRectRef.current.setAttribute('x', exitX.toString())
          whiteBarsClipRectRef.current.setAttribute('width', remainingWidth.toString())
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else {
        // Completed: Full navy background
        if (fullBarsGroupRef.current) fullBarsGroupRef.current.style.display = 'none'
        if (whiteBarsGroupRef.current) whiteBarsGroupRef.current.style.display = 'none'
        if (baseNavyRectRef.current) baseNavyRectRef.current.style.display = 'block'
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      runAnimation()
    }, 150)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [runAnimation])

  return (
    <section
      className={styles.heroSection}
      aria-label="Credit Cards Hero"
      style={{ height: `${CANVAS_H * scale}px` }}
    >
      <div className={styles.heroCanvas}>
        {/* Background Artwork Stack (1920 × 640) */}
        <div className={styles.artClip} aria-hidden="true">
          <div className={styles.artCanvas}>
            {/* Layer 1: Diagonal Animated Navy & White Bars from Top-Right (1920, 0) */}
            <svg
              className={styles.bgAnimatedSvg}
              width="1920"
              height="640"
              viewBox="0 0 1920 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Clip path for Phase 1 diagonal sweep */}
                <clipPath id="ccHeroBarsSweepClip">
                  <rect
                    ref={heroClipRectRef}
                    x="0"
                    y="-1000"
                    width="0"
                    height="3000"
                  />
                </clipPath>

                {/* Clip path for Phase 2 white bars exit */}
                <clipPath id="ccWhiteBarsExitClip">
                  <rect
                    ref={whiteBarsClipRectRef}
                    x="0"
                    y="-1000"
                    width={DIAG_SPAN.toString()}
                    height="3000"
                  />
                </clipPath>
              </defs>

              {/* Transformed Diagonal Bars Group anchored at top-right (1920, 0) rotated 135 deg to sweep down-left */}
              <g transform="translate(1920, 0) rotate(135)">
                {/* Base Navy Rect */}
                <rect
                  ref={baseNavyRectRef}
                  x="0"
                  y="-1000"
                  width={DIAG_SPAN.toString()}
                  height="3000"
                  fill={NAVY_FILL}
                  style={{ display: 'none' }}
                />

                {/* Phase 1: Full Navy + White Bars */}
                <g
                  ref={fullBarsGroupRef}
                  clipPath="url(#ccHeroBarsSweepClip)"
                >
                  {barIndices.map((idx) => {
                    const baseX = idx * BAR_PITCH
                    return (
                      <g key={`full-bar-${idx}`}>
                        <rect
                          x={baseX}
                          y="-1000"
                          width={NAVY_BAR_WIDTH}
                          height="3000"
                          fill={NAVY_FILL}
                        />
                        <rect
                          x={baseX + NAVY_BAR_WIDTH}
                          y="-1000"
                          width={WHITE_BAR_WIDTH}
                          height="3000"
                          fill="#FFFFFF"
                        />
                      </g>
                    )
                  })}
                </g>

                {/* Phase 2: White Bars Only (exit to left) */}
                <g
                  ref={whiteBarsGroupRef}
                  clipPath="url(#ccWhiteBarsExitClip)"
                  style={{ display: 'none' }}
                >
                  {barIndices.map((idx) => {
                    const baseX = idx * BAR_PITCH
                    return (
                      <rect
                        key={`white-bar-${idx}`}
                        x={baseX + NAVY_BAR_WIDTH}
                        y="-1000"
                        width={WHITE_BAR_WIDTH}
                        height="3000"
                        fill="#FFFFFF"
                      />
                    )
                  })}
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Top-Left Animated Watermark (x: 440px, y: 10px, z-index: 10) */}
        <WatermarkAnimation
          className={styles.watermarkMainWrap}
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          width={430}
          height={285}
        />

        {/* Bottom-Right Animated Watermark (x: 1630px, y: 440px, z-index: 10) */}
        <WatermarkAnimation
          className={styles.watermarkSecondaryWrap}
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          width={290}
          height={190}
        />

        {/* Left Copy Block (Centered Vertically) */}
        <div className={styles.copyBlock}>
          {/* Card Deals White Pill Badge */}
          <div className={styles.cardDealsPill}>
            CARD DEALS
          </div>

          {/* Main Headline (One Single Line) */}
          <h1 className={styles.headline}>
            <span className={styles.headlineSolid}>Best Credit Cards for Cashback</span>
          </h1>

          {/* Subtitle with "with India's top" in the first line */}
          <p className={styles.subtitle}>
            Earn rewards on every purchase with India's top<br />credit cards.
          </p>

          {/* Red CTA Pill Button */}
          <a href="#credit-cards-grid" className={styles.ctaPill}>
            Explore Top Offers
          </a>
        </div>

        {/* Right 3D Artwork Illustration */}
        <div className={styles.illustrationContainer} aria-hidden="true">
          <img
            src={creditCardsHeroImg}
            alt="Credit Cards with Cashback and Coins"
            className={styles.illustrationImg}
            width="820"
            height="640"
          />
        </div>
      </div>
    </section>
  )
}

export default CreditCardsHero
