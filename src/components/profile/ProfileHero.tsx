import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import dealsHeroBackground from '../../assets/stores/hero/stores-hero-background.png'
import profileHeroImg from '../../assets/profile/profile_hero.png'
import profileAvatarImg from '../../assets/profile/profile_avatar.png'
import editIcon from '../../assets/profile/edit.png'
import styles from './ProfileHero.module.css'

interface ProfileHeroProps {
  name?: string
  email?: string
  onEditClick?: () => void
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const BAR_HEIGHT_PITCH = 22
const BLUE_BAR_HEIGHT = 17.5
const WHITE_BAR_HEIGHT = 4.5
const TOTAL_BARS = 28 // 28 * 22 = 616px (covers 500px height)

// Rich deep blue color
const BLUE_FILL = '#232B85'
const BLUE_OPACITY = '0.96'

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  name = 'Arushi',
  email = 'aarushi123@gmail.com',
  onEditClick,
}) => {
  // Animation DOM Refs
  const fullBarsGroupRef = useRef<SVGGElement | null>(null)
  const whiteBarsGroupRef = useRef<SVGGElement | null>(null)
  const heroClipRectRef = useRef<SVGRectElement | null>(null)
  const whiteBarsClipRectRef = useRef<SVGRectElement | null>(null)
  const baseBlueRectRef = useRef<SVGRectElement | null>(null)
  const greetingRef = useRef<HTMLHeadingElement | null>(null)
  const emailRef = useRef<HTMLDivElement | null>(null)

  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)

  // Generate horizontal bar indices from 0 to 27
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

    // Fast 1.0s total animation (500ms top-to-bottom sweep + 500ms white bars exit downward)
    const PHASE1_DURATION = 500
    const PHASE2_DURATION = 500
    const TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION

    const HERO_HEIGHT = 500
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < PHASE1_DURATION) {
        // Phase 1: Horizontal bars sweep from top (0px) all the way down to bottom (500px)
        const progress = Math.min(1, elapsed / PHASE1_DURATION)
        const eased = easeOutCubic(progress)
        const currentHeight = HERO_HEIGHT * eased

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'block'
        }

        if (heroClipRectRef.current) {
          heroClipRectRef.current.setAttribute('x', '0')
          heroClipRectRef.current.setAttribute('y', '0')
          heroClipRectRef.current.setAttribute('width', '1920')
          heroClipRectRef.current.setAttribute('height', currentHeight.toString())
        }

        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'none'
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }

        // Heading visibility starts low and solidifies as blue background sweeps down
        if (greetingRef.current) {
          const textGain = Math.min(1, Math.max(0, currentHeight / 420))
          const opacity = 0.35 + (1 - 0.35) * textGain
          greetingRef.current.style.color = `rgba(255, 255, 255, ${opacity})`
          if (opacity > 0.85) {
            greetingRef.current.style.textShadow = '0px 2px 12px rgba(0, 0, 0, 0.30)'
          }
        }

        if (emailRef.current) {
          const textGain = Math.min(1, Math.max(0, currentHeight / 420))
          const opacity = 0.30 + (0.90 - 0.30) * textGain
          emailRef.current.style.color = `rgba(255, 255, 255, ${opacity})`
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else if (elapsed < TOTAL_DURATION) {
        // Phase 2: Blue background fills completely, white horizontal bars slide down and exit
        const p2Elapsed = elapsed - PHASE1_DURATION
        const progress = Math.min(1, p2Elapsed / PHASE2_DURATION)
        const eased = easeInOutQuad(progress)

        const exitY = HERO_HEIGHT * eased
        const remainingHeight = Math.max(0, HERO_HEIGHT - exitY)

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }

        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'block'
          baseBlueRectRef.current.setAttribute('x', '0')
          baseBlueRectRef.current.setAttribute('y', '0')
          baseBlueRectRef.current.setAttribute('width', '1920')
          baseBlueRectRef.current.setAttribute('height', HERO_HEIGHT.toString())
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'block'
        }

        if (whiteBarsClipRectRef.current) {
          whiteBarsClipRectRef.current.setAttribute('x', '0')
          whiteBarsClipRectRef.current.setAttribute('y', exitY.toString())
          whiteBarsClipRectRef.current.setAttribute('width', '1920')
          whiteBarsClipRectRef.current.setAttribute('height', remainingHeight.toString())
        }

        if (greetingRef.current) {
          greetingRef.current.style.color = '#FFFFFF'
          greetingRef.current.style.textShadow = '0px 2px 12px rgba(0, 0, 0, 0.30)'
        }

        if (emailRef.current) {
          emailRef.current.style.color = 'rgba(255, 255, 255, 0.90)'
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else {
        // Completed: All white bars exited downward, full blue background established
        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }
        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }
        if (baseBlueRectRef.current) {
          baseBlueRectRef.current.style.display = 'block'
          baseBlueRectRef.current.setAttribute('x', '0')
          baseBlueRectRef.current.setAttribute('y', '0')
          baseBlueRectRef.current.setAttribute('width', '1920')
          baseBlueRectRef.current.setAttribute('height', HERO_HEIGHT.toString())
        }
        if (greetingRef.current) {
          greetingRef.current.style.color = '#FFFFFF'
          greetingRef.current.style.textShadow = '0px 2px 12px rgba(0, 0, 0, 0.30)'
        }
        if (emailRef.current) {
          emailRef.current.style.color = 'rgba(255, 255, 255, 0.90)'
        }
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
    <section className={styles.heroSection} aria-label="Profile Hero Banner">
      {/* Top Decorative Stripe Line */}
      <div className={styles.topStripeBar} aria-hidden="true" />

      <div className={styles.heroCanvas}>
        {/* Background Artwork Stack (1920 x 440) */}
        <div className={styles.artClip} aria-hidden="true">
          <div className={styles.artCanvas}>
            {/* Layer 1: Top-to-Bottom Animated Horizontal Blue & White Stripes */}
            <svg
              className={styles.bgAnimatedSvg}
              width="100%"
              height="100%"
              viewBox="0 0 1920 500"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Clip path for Phase 1 expanding top-to-bottom sweep */}
                <clipPath id="profileBarsSweepClip">
                  <rect
                    ref={heroClipRectRef}
                    x="0"
                    y="0"
                    width="1920"
                    height="80"
                  />
                </clipPath>

                {/* Clip path for Phase 2 white horizontal bars downward exit */}
                <clipPath id="whiteHorizontalBarsExitClip">
                  <rect
                    ref={whiteBarsClipRectRef}
                    x="0"
                    y="0"
                    width="1920"
                    height="500"
                  />
                </clipPath>
              </defs>

              {/* 1. Base Rich Blue Background Layer */}
              <rect
                ref={baseBlueRectRef}
                x="0"
                y="0"
                width="1920"
                height="500"
                fill={BLUE_FILL}
                fillOpacity={BLUE_OPACITY}
                style={{ display: 'none' }}
              />

              {/* 2. Full Horizontal Bars Group (Phase 1) */}
              <g
                ref={fullBarsGroupRef}
                clipPath="url(#profileBarsSweepClip)"
              >
                {barIndices.map((idx) => {
                  const baseY = idx * BAR_HEIGHT_PITCH
                  return (
                    <g key={`full-hbar-${idx}`}>
                      {/* Blue Horizontal Bar */}
                      <rect
                        x={0}
                        y={baseY}
                        width={1920}
                        height={BLUE_BAR_HEIGHT}
                        fill={BLUE_FILL}
                        fillOpacity={BLUE_OPACITY}
                      />
                      {/* White Horizontal Bar / Gap */}
                      <rect
                        x={0}
                        y={baseY + BLUE_BAR_HEIGHT}
                        width={1920}
                        height={WHITE_BAR_HEIGHT}
                        fill="#FFFFFF"
                        fillOpacity="0.90"
                      />
                    </g>
                  )
                })}
              </g>

              {/* 3. White Horizontal Bars Only Group (Phase 2) */}
              <g
                ref={whiteBarsGroupRef}
                clipPath="url(#whiteHorizontalBarsExitClip)"
                style={{ display: 'none' }}
              >
                {barIndices.map((idx) => {
                  const baseY = idx * BAR_HEIGHT_PITCH
                  return (
                    <rect
                      key={`white-hbar-${idx}`}
                      x={0}
                      y={baseY + BLUE_BAR_HEIGHT}
                      width={1920}
                      height={WHITE_BAR_HEIGHT}
                      fill="#FFFFFF"
                      fillOpacity="0.90"
                    />
                  )
                })}
              </g>
            </svg>

            {/* Layer 2: Confetti & Deals Background Texture */}
            <img
              src={dealsHeroBackground}
              alt=""
              className={styles.bgOverlay}
              width="1920"
              height="500"
            />
          </div>
        </div>

        {/* Faint W Watermark on Top Right */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkMainWrap}
          width={320}
          height={210}
        />

        {/* Hero Content Container */}
        <div className={styles.contentContainer}>
          {/* Left Group: Circular Avatar + Greeting + Edit Profile Button */}
          <div className={styles.profileLeftGroup}>
            <div className={styles.avatarWrap}>
              <img
                src={profileAvatarImg}
                alt="Profile Avatar"
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.greetingBlock}>
              <h1 ref={greetingRef} className={styles.greetingTitle}>
                Hi {name}!
              </h1>

              <div ref={emailRef} className={styles.emailSubtitle}>
                <svg
                  className={styles.emailIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{email}</span>
              </div>

              <button
                type="button"
                className={styles.editBtn}
                onClick={onEditClick}
                aria-label="Edit Profile"
              >
                <img src={editIcon} alt="" className={styles.editIcon} />
                <span>Edit Profile &gt;&gt;</span>
              </button>
            </div>
          </div>

          {/* Right Group: Illustration of Woman Shopping with deal tags */}
          <div className={styles.illustrationContainer} aria-hidden="true">
            <img
              src={profileHeroImg}
              alt="Happy shopper with deals"
              className={styles.illustrationImg}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileHero
