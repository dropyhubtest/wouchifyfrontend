import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'

import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import lootHeroBox from '../../assets/loot/loot-hero-box-illustration.png'

import styles from './LootDealsHero.module.css'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const BAR_PITCH = 26
const BLUE_BAR_WIDTH = 21.5
const WHITE_BAR_WIDTH = 4.5
const TOTAL_BARS = 76

// Rich blue color
const BLUE_FILL = '#282D78'
const BLUE_OPACITY = '0.88'

export const LootDealsHero: React.FC = () => {
  const scale = useDesktopScale()

  // Animation DOM Refs
  const fullBarsGroupRef = useRef<SVGGElement | null>(null)
  const whiteBarsGroupRef = useRef<SVGGElement | null>(null)
  const heroClipRectRef = useRef<SVGRectElement | null>(null)
  const whiteBarsClipRectRef = useRef<SVGRectElement | null>(null)
  const baseBlueRectRef = useRef<SVGRectElement | null>(null)
  const headlineFaintRef = useRef<HTMLSpanElement | null>(null)

  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)

  // Generate bar indices from 0 to 75
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

    // Fast 1.0s total animation (500ms + 500ms)
    const PHASE1_DURATION = 500  // 0.5s: Rapid sweep across to fill 1920px
    const PHASE2_DURATION = 500  // 0.5s: White bars exit to right, blue occupies
    const TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION

    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < PHASE1_DURATION) {
        // Phase 1: Bars sweep quickly across canvas from 516px to 1920px
        const progress = Math.min(1, elapsed / PHASE1_DURATION)
        const eased = easeOutCubic(progress)

        const currentWidth = 516 + (1920 - 516) * eased

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'block'
        }

        if (heroClipRectRef.current) {
          heroClipRectRef.current.setAttribute('x', '0')
          heroClipRectRef.current.setAttribute('width', currentWidth.toString())
        }

        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'none'
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }

        // Headline solidifies quickly as bars sweep across
        if (headlineFaintRef.current) {
          const textGain = Math.min(1, Math.max(0, (currentWidth - 500) / 450))
          const opacity = 0.44 + (1 - 0.44) * textGain
          headlineFaintRef.current.style.color = `rgba(255, 255, 255, ${opacity})`
          if (opacity > 0.85) {
            headlineFaintRef.current.style.textShadow = '0px 4px 16px rgba(0, 0, 0, 0.28)'
          }
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else if (elapsed < TOTAL_DURATION) {
        // Phase 2: Direct transition — white bars exit to right, blue background fills
        const p2Elapsed = elapsed - PHASE1_DURATION
        const progress = Math.min(1, p2Elapsed / PHASE2_DURATION)
        const eased = easeInOutQuad(progress)

        const exitX = 1920 * eased
        const remainingWidth = Math.max(0, 1920 - exitX)

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }

        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'block'
          baseBlueRectRef.current.setAttribute('x', '0')
          baseBlueRectRef.current.setAttribute('width', '1920')
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'block'
        }

        if (whiteBarsClipRectRef.current) {
          whiteBarsClipRectRef.current.setAttribute('x', exitX.toString())
          whiteBarsClipRectRef.current.setAttribute('width', remainingWidth.toString())
        }

        if (headlineFaintRef.current) {
          headlineFaintRef.current.style.color = '#FFFFFF'
          headlineFaintRef.current.style.textShadow = '0px 4px 16px rgba(0, 0, 0, 0.28)'
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else {
        // Completed: All white bars exited, full rich blue background permanently set
        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }
        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }
        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'block'
          baseBlueRectRef.current.setAttribute('x', '0')
          baseBlueRectRef.current.setAttribute('width', '1920')
        }
        if (headlineFaintRef.current) {
          headlineFaintRef.current.style.color = '#FFFFFF'
          headlineFaintRef.current.style.textShadow = '0px 4px 16px rgba(0, 0, 0, 0.28)'
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    // Run exactly once on page mount after 200ms
    timeoutRef.current = window.setTimeout(() => {
      runAnimation()
    }, 200)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [runAnimation])

  return (
    <section
      className={styles.heroSection}
      aria-label="Loot Deals Hero"
      style={{ height: `${657 * scale}px` }}
    >
      <div className={styles.heroCanvas}>
        {/* Background Artwork Stack (1920 x 657) */}
        <div className={styles.artClip} aria-hidden="true">
          <div className={styles.artCanvas}>
            {/* Layer 1: Vector Animated Blue & White Bars Background */}
            <svg
              className={styles.bgAnimatedSvg}
              width="1920"
              height="657"
              viewBox="0 0 1920 657"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Clip path for Phase 1 expanding sweep */}
                <clipPath id="heroBarsSweepClip">
                  <rect
                    ref={heroClipRectRef}
                    x="0"
                    y="0"
                    width="516"
                    height="657"
                  />
                </clipPath>

                {/* Clip path for Phase 2 white bars rightward exit */}
                <clipPath id="whiteBarsExitClip">
                  <rect
                    ref={whiteBarsClipRectRef}
                    x="0"
                    y="0"
                    width="1920"
                    height="657"
                  />
                </clipPath>
              </defs>

              {/* 1. Base Rich Blue Background Layer */}
              <rect
                ref={baseBlueRectRef}
                x="0"
                y="0"
                width="1920"
                height="657"
                fill={BLUE_FILL}
                fillOpacity={BLUE_OPACITY}
                style={{ display: 'none' }}
              />

              {/* 2. Full Bars Group (Phase 1) */}
              <g
                ref={fullBarsGroupRef}
                clipPath="url(#heroBarsSweepClip)"
              >
                {barIndices.map((idx) => {
                  const baseX = idx * BAR_PITCH
                  return (
                    <g key={`full-bar-${idx}`}>
                      {/* Blue Bar */}
                      <rect
                        x={baseX}
                        y={0}
                        width={BLUE_BAR_WIDTH}
                        height={657}
                        fill={BLUE_FILL}
                        fillOpacity={BLUE_OPACITY}
                      />
                      {/* White Vertical Bar / Gap */}
                      <rect
                        x={baseX + BLUE_BAR_WIDTH}
                        y={0}
                        width={WHITE_BAR_WIDTH}
                        height={657}
                        fill="#FFFFFF"
                        fillOpacity="0.90"
                      />
                    </g>
                  )
                })}
              </g>

              {/* 3. White Bars Only Group (Phase 2: White bars slide right and exit) */}
              <g
                ref={whiteBarsGroupRef}
                clipPath="url(#whiteBarsExitClip)"
                style={{ display: 'none' }}
              >
                {barIndices.map((idx) => {
                  const baseX = idx * BAR_PITCH
                  return (
                    <rect
                      key={`white-bar-${idx}`}
                      x={baseX + BLUE_BAR_WIDTH}
                      y={0}
                      width={WHITE_BAR_WIDTH}
                      height={657}
                      fill="#FFFFFF"
                      fillOpacity="0.90"
                    />
                  )
                })}
              </g>
            </svg>

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

        {/* Small Animated Watermark (Increased by 20% to 318x210, z-index 25) */}
        <WatermarkAnimation
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          className={styles.watermarkSecondaryWrap}
          width={318}
          height={210}
        />

        {/* Left Copy Block - Centered Vertically */}
        <div className={styles.copyBlock}>
          {/* White Pill Badge: LOOT DEALS */}
          <div className={styles.lootPillBadge}>
            LOOT DEALS
          </div>

          {/* Main Headline: Solid White on Left, Dynamically solidifies as blue background sweeps across */}
          <h1 className={styles.headline}>
            <span className={styles.headlineSolid}>Flash Prices</span>{' '}
            <span ref={headlineFaintRef} className={styles.headlineFaint}>
              – Grab Fast!
            </span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Limited-time loot deals before they expire.
          </p>

          {/* Red CTA Pill Button */}
          <a href="#deals-favourite-stores" className={styles.ctaPill}>
            Explore Coupons Now!!
          </a>
        </div>

        {/* Right 3D Illustration Zone */}
        <div className={styles.illustrationContainer} aria-hidden="true">
          <img
            src={lootHeroBox}
            alt="Loot Deals Box"
            className={styles.illustrationImg}
            width="802"
            height="669"
          />
        </div>
      </div>
    </section>
  )
}

export default LootDealsHero
