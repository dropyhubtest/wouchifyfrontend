import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero/WatermarkAnimation'
import { DealCard } from '../components/deals/DealCard'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { getBrandData } from '../data/brandDeals'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../assets/hero/hero-watermark-secondary-state-2.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import amazonHeroArtwork from '../assets/brands-inner/amazon-hero.png'

import './BrandPage.css'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const BAR_PITCH = 26
const PEACH_BAR_HEIGHT = 21.5
const WHITE_BAR_HEIGHT = 4.5
const HERO_HEIGHT = 640
const TOTAL_BARS = Math.ceil(HERO_HEIGHT / BAR_PITCH) + 2
const PEACH_FILL = '#fee2d3'

interface BrandPageProps {
  brandSlug: string
}

const FILTER_PILLS = ['All', 'Deals', 'Loot', 'Coupons', 'Expired', '25%+'] as const
type FilterPill = typeof FILTER_PILLS[number]

export const BrandPage: React.FC<BrandPageProps> = ({ brandSlug }) => {
  const scale = useDesktopScale()
  const brand = getBrandData(brandSlug) || getBrandData('amazon')
  const brandName = brand?.name || 'Amazon'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterPill>('All')
  const [copied, setCopied] = useState(false)

  // Animation DOM Refs for top-to-bottom bars sweep
  const fullBarsGroupRef = useRef<SVGGElement | null>(null)
  const whiteBarsGroupRef = useRef<SVGGElement | null>(null)
  const heroClipRectRef = useRef<SVGRectElement | null>(null)
  const whiteBarsClipRectRef = useRef<SVGRectElement | null>(null)
  const basePeachRectRef = useRef<SVGRectElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)

  // Precompute bar indices
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
      if (basePeachRectRef.current) basePeachRectRef.current.style.display = 'block'
      return
    }

    const PHASE1_DURATION = 500 // 0.5s: sweep down from top to bottom
    const PHASE2_DURATION = 500 // 0.5s: white bars exit downwards, peach fills
    const TOTAL_DURATION = PHASE1_DURATION + PHASE2_DURATION

    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < PHASE1_DURATION) {
        // Phase 1: Bars sweep down from 0 to 640px
        const progress = Math.min(1, elapsed / PHASE1_DURATION)
        const eased = easeOutCubic(progress)
        const currentHeight = HERO_HEIGHT * eased

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'block'
        }

        if (heroClipRectRef.current) {
          heroClipRectRef.current.setAttribute('y', '0')
          heroClipRectRef.current.setAttribute('height', currentHeight.toString())
        }

        if (basePeachRectRef.current) {
          basePeachRectRef.current.style.display = 'none'
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else if (elapsed < TOTAL_DURATION) {
        // Phase 2: White bars exit downwards, base peach rect fills
        const p2Elapsed = elapsed - PHASE1_DURATION
        const progress = Math.min(1, p2Elapsed / PHASE2_DURATION)
        const eased = easeInOutQuad(progress)

        const exitY = HERO_HEIGHT * eased
        const remainingHeight = Math.max(0, HERO_HEIGHT - exitY)

        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }

        if (basePeachRectRef.current) {
          basePeachRectRef.current.style.display = 'block'
          basePeachRectRef.current.setAttribute('y', '0')
          basePeachRectRef.current.setAttribute('height', HERO_HEIGHT.toString())
        }

        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'block'
        }

        if (whiteBarsClipRectRef.current) {
          whiteBarsClipRectRef.current.setAttribute('y', exitY.toString())
          whiteBarsClipRectRef.current.setAttribute('height', remainingHeight.toString())
        }

        animFrameRef.current = requestAnimationFrame(step)
      } else {
        // Completed
        if (fullBarsGroupRef.current) {
          fullBarsGroupRef.current.style.display = 'none'
        }
        if (whiteBarsGroupRef.current) {
          whiteBarsGroupRef.current.style.display = 'none'
        }
        if (basePeachRectRef.current) {
          basePeachRectRef.current.style.display = 'block'
          basePeachRectRef.current.setAttribute('y', '0')
          basePeachRectRef.current.setAttribute('height', HERO_HEIGHT.toString())
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 2 sample deals matching Figma media_1788953307381.png
  const amazonDeals: DealCardItem[] = useMemo(() => {
    return DEALS_CARD_ITEMS.slice(0, 2)
  }, [])

  // Filtered deals based on search and active filter pill
  const filteredDeals = useMemo(() => {
    return amazonDeals.filter((deal) => {
      const matchesSearch =
        !searchQuery.trim() ||
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (activeFilter === 'All' || activeFilter === 'Deals') return true
      if (activeFilter === 'Coupons') return false
      if (activeFilter === 'Loot') return true
      if (activeFilter === '25%+') return true
      return true
    })
  }, [amazonDeals, searchQuery, activeFilter])

  // Coupon Ticket SVG Path (1560 x 480) with side cutouts and rounded corners
  const ticketPath = `
    M 40 0
    H 990
    A 30 30 0 0 0 1050 0
    H 1520
    A 40 40 0 0 1 1560 40
    V 210
    A 30 30 0 0 0 1560 270
    V 440
    A 40 40 0 0 1 1520 480
    H 1050
    A 30 30 0 0 0 990 480
    H 40
    A 40 40 0 0 1 0 440
    V 270
    A 30 30 0 0 0 0 210
    V 40
    A 40 40 0 0 1 40 0
    Z
  `

  const showCouponsSection = activeFilter === 'All' || activeFilter === 'Coupons'
  const showDealsSection = activeFilter === 'All' || activeFilter === 'Deals' || activeFilter === 'Loot' || activeFilter === '25%+'

  return (
    <div className="amazon-brand-page">
      {/* 1. Desktop Fixed Navbar */}
      <Navbar />

      {/* 2. Top-to-Bottom Animated Hero Section (Full Viewport Width 100%) */}
      <section
        className="amazon-hero-section"
        aria-label={`${brandName} Store Promotions`}
        style={{
          marginTop: 0,
          height: `${HERO_HEIGHT * scale}px`,
        }}
      >
        {/* Full Viewport Width SVG Background Layer */}
        <div className="amazon-hero__bg-wrap" aria-hidden="true">
          <svg
            className="amazon-hero__bg-animated-svg"
            width="100%"
            height="100%"
            viewBox="0 0 1920 640"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Clip path for Phase 1 expanding downward sweep */}
              <clipPath id="amazonHeroBarsSweepClip">
                <rect
                  ref={heroClipRectRef}
                  x="0"
                  y="0"
                  width="1920"
                  height="0"
                />
              </clipPath>

              {/* Clip path for Phase 2 white bars downward exit */}
              <clipPath id="amazonWhiteBarsExitClip">
                <rect
                  ref={whiteBarsClipRectRef}
                  x="0"
                  y="0"
                  width="1920"
                  height="640"
                />
              </clipPath>
            </defs>

            {/* Base Peach Background Layer */}
            <rect
              ref={basePeachRectRef}
              x="0"
              y="0"
              width="1920"
              height="640"
              fill={PEACH_FILL}
              style={{ display: 'none' }}
            />

            {/* Phase 1: Full Peach + White Horizontal Bars */}
            <g
              ref={fullBarsGroupRef}
              clipPath="url(#amazonHeroBarsSweepClip)"
            >
              {barIndices.map((idx) => {
                const baseY = idx * BAR_PITCH
                return (
                  <g key={`full-bar-${idx}`}>
                    <rect
                      x={0}
                      y={baseY}
                      width={1920}
                      height={PEACH_BAR_HEIGHT}
                      fill={PEACH_FILL}
                    />
                    <rect
                      x={0}
                      y={baseY + PEACH_BAR_HEIGHT}
                      width={1920}
                      height={WHITE_BAR_HEIGHT}
                      fill="#FFFFFF"
                    />
                  </g>
                )
              })}
            </g>

            {/* Phase 2: White Bars Exiting Downwards */}
            <g
              ref={whiteBarsGroupRef}
              clipPath="url(#amazonWhiteBarsExitClip)"
              style={{ display: 'none' }}
            >
              {barIndices.map((idx) => {
                const baseY = idx * BAR_PITCH
                return (
                  <rect
                    key={`white-bar-${idx}`}
                    x={0}
                    y={baseY + PEACH_BAR_HEIGHT}
                    width={1920}
                    height={WHITE_BAR_HEIGHT}
                    fill="#FFFFFF"
                  />
                )
              })}
            </g>
          </svg>
        </div>

        {/* 1920px Centered Hero Content Canvas */}
        <div
          className="amazon-hero-canvas"
          style={{
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Top-Center Animated Watermark */}
          <WatermarkAnimation
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            className="amazon-hero__watermark-top"
            width={430}
            height={285}
          />

          {/* Lower-Right Accent Watermark */}
          <WatermarkAnimation
            state1Src={watermarkSecondary}
            state2Src={watermarkSecondaryState2}
            className="amazon-hero__watermark-right"
            width={290}
            height={190}
          />

          <div className="amazon-hero__inner">
            {/* Left Copy Block (Half Width, Bigger Content) */}
            <div className="amazon-hero__left">
              {/* Amazon Brand Logo */}
              <div className="amazon-hero__logo-box">
                <img
                  src={amazonLogo}
                  alt={brandName}
                  className="amazon-hero__logo"
                  width="360"
                  height="90"
                />
              </div>

              {/* Main Headline */}
              <h1 className="amazon-hero__headline">
                Up to 6.2% rewards
              </h1>

              {/* Subtitle */}
              <p className="amazon-hero__subtitle">
                Get verified electronics, fashion, and home coupons with high success rates.
              </p>

              {/* Red CTA Button */}
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="amazon-hero__cta"
                aria-label="View Amazon Store"
              >
                View Store&gt;&gt;
              </a>
            </div>

            {/* Right 3D Artwork (Bigger & Bottom Aligned with CTA button) */}
            <div className="amazon-hero__right">
              <img
                src={amazonHeroArtwork}
                alt="Amazon Rewards and Deals Box"
                className="amazon-hero__artwork-img"
                width="940"
                height="627"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Scale-Aware 1920px Canvas Wrapper for Controls & Cards */}
      <div
        className="amazon-brand-canvas"
        style={{
          '--brand-scale': scale,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        } as React.CSSProperties}
      >

        {/* ── SEARCH & FILTER PILLS BAR ── */}
        <section className="amazon-controls-bar" aria-label="Search and Filter Deals">
          {/* Lavender Pill Search Input */}
          <div className="amazon-search-box">
            <input
              type="text"
              className="amazon-search-input"
              placeholder="Search Store, Code or Discount"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Store, Code or Discount"
            />
            <div className="amazon-search-icon-wrap" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="#2F368C"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20L16 16"
                  stroke="#2F368C"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="amazon-filter-pills" role="toolbar" aria-label="Deal filters">
            {FILTER_PILLS.map((pill) => {
              const isActive = activeFilter === pill
              return (
                <button
                  key={pill}
                  type="button"
                  className={`amazon-filter-pill ${isActive ? 'amazon-filter-pill--active' : ''}`}
                  onClick={() => setActiveFilter(pill)}
                  aria-pressed={isActive}
                >
                  {pill}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── AVAILABLE COUPONS SECTION ── */}
        {showCouponsSection && (
          <section className="amazon-coupons-section" aria-label="Available Coupons">
            {/* Header with Red Accent */}
            <div className="amazon-section-header">
              <div className="amazon-heading-accent amazon-heading-accent--red" aria-hidden="true" />
              <h2 className="amazon-section-title">Available Coupons</h2>
            </div>

            {/* Perforated Coupon Ticket (1560 x 480) */}
            <div className="amazon-coupon-ticket">
              <svg
                className="amazon-ticket-svg"
                width="1560"
                height="480"
                viewBox="0 0 1560 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <filter id="amzTicketDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Lavender Ticket Body */}
                <path
                  d={ticketPath}
                  fill="#E5E7FF"
                  filter="url(#amzTicketDropShadow)"
                />

                {/* White Dotted Perforation Line */}
                <line
                  x1="1020"
                  y1="30"
                  x2="1020"
                  y2="450"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
              </svg>

              {/* Left Partition: Logo, 10% Off, Expiry & Min Order */}
              <div className="amazon-coupon-left">
                {/* White Logo Container */}
                <div className="amazon-coupon-logo-box">
                  <img
                    src={amazonLogo}
                    alt="Amazon"
                    className="amazon-coupon-logo"
                    width="230"
                    height="58"
                  />
                </div>

                {/* Discount Value */}
                <div className="amazon-coupon-discount-row">
                  <span className="amazon-coupon-discount-value">10%</span>
                  <span className="amazon-coupon-discount-off">off</span>
                </div>

                {/* Meta details */}
                <div className="amazon-coupon-meta-row">
                  <div className="amazon-coupon-meta-item">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#282D78"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Expires in 3 days</span>
                  </div>

                  <div className="amazon-coupon-meta-item">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#282D78"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Min Order: 499</span>
                  </div>
                </div>
              </div>

              {/* Right Partition: USE CODE & AMAZON10 Copy Pill */}
              <div className="amazon-coupon-right">
                <span className="amazon-coupon-use-code">USE CODE :</span>

                <button
                  type="button"
                  className="amazon-coupon-code-btn"
                  onClick={() => handleCopyCode('AMAZON10')}
                  title="Click to copy AMAZON10"
                >
                  AMAZON10
                </button>

                <button
                  type="button"
                  className="amazon-coupon-copy-action"
                  onClick={() => handleCopyCode('AMAZON10')}
                  aria-label="Copy code"
                >
                  <span className="amazon-coupon-copy-text">
                    {copied ? 'Copied! ✓' : 'Copy Code'}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── AVAILABLE DEALS SECTION ── */}
        {showDealsSection && (
          <section className="amazon-deals-section" aria-label="Available Deals">
            {/* Header with Navy Accent */}
            <div className="amazon-section-header">
              <div className="amazon-heading-accent amazon-heading-accent--navy" aria-hidden="true" />
              <h2 className="amazon-section-title">Available Deals</h2>
            </div>

            {/* Top Deals Pill */}
            <div className="amazon-deals-top-pill">Top Deals</div>

            {/* Deal Cards Container (Uniform 2-column grid of horizontal cards) */}
            <div className="amazon-deals-grid">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} horizontal={true} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 3. Scaled Page Bottom Spacer (matches 1920 scale height adjustment) */}
      <div
        style={{
          height: `calc((2300px * ${scale}) - 2300px + 60px)`,
          pointerEvents: 'none',
        }}
      />

      {/* 4. Desktop Footer with Red Dotted Divider */}
      <FooterSection />
    </div>
  )
}

export default BrandPage
