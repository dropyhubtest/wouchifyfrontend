import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Navbar } from '../components/layout'
import { CreditCardsHero } from '../components/credit-cards'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { PREMIUM_CARDS, LIFETIME_FREE_CARDS, type CreditCardItem } from '../data/creditCardsData'

import './CreditCardsPage.css'

/* ── Single Credit Card Tile Component matching media_1789038793890.png ── */
const CreditCardTile: React.FC<{ card: CreditCardItem }> = ({ card }) => {
  return (
    <div className={`cc-card-tile cc-card-tile--${card.cardTheme}`}>
      {/* 1. Top Content Header */}
      <div className="cc-card-top-content">
        <div className="cc-card-left-header">
          <span className="cc-card-tag">{card.tagText}</span>
          <h3 className="cc-card-name">{card.name}</h3>
        </div>
        <div className="cc-card-logo-box">
          <img src={card.logo} alt={card.name} className="cc-card-logo" />
        </div>
      </div>

      {/* 2. Full-Width Edge-to-Edge Middle Banner */}
      <div className="cc-card-full-banner">
        <div className="cc-card-banner-col">
          <span className="cc-card-banner-label">{card.keyBenefitLabel}</span>
          <span className="cc-card-banner-value">{card.keyBenefitValue}</span>
        </div>
        <div className="cc-card-banner-col cc-card-banner-col--right">
          <span className="cc-card-banner-label">{card.rewardsLabel}</span>
          <span className="cc-card-banner-value">{card.rewardsValue}</span>
        </div>
      </div>

      {/* 3. Bottom Content Area */}
      <div className="cc-card-bottom-content">
        {/* Verified Partners */}
        <div className="cc-card-suited-section">
          <span className="cc-card-suited-label">VERIFIED PARTNERS</span>
          <div className="cc-card-suited-pills">
            {card.suitedFor.map((item, idx) => (
              <span key={idx} className="cc-card-suited-pill">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Thin Divider Line (Tighter gap) */}
        <div className="cc-card-divider-line" aria-hidden="true" />

        {/* Footer Row: Themed Avatars & Apply Button */}
        <div className="cc-card-footer-row">
          <div className="cc-card-users-wrap">
            <div className="cc-card-avatar-stack">
              <span className="cc-card-avatar cc-card-avatar--1">U1</span>
              <span className="cc-card-avatar cc-card-avatar--2">U2</span>
              <span className="cc-card-avatar cc-card-avatar--3">U3</span>
            </div>
            <span className="cc-card-user-count">{card.userCount}</span>
          </div>

          <a href={card.applyHref} className="cc-card-apply-btn">
            <span>Apply now</span>
            <span className="cc-card-apply-arrow">&gt;&gt;</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Main CreditCardsPage Component ── */
export const CreditCardsPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [canvasHeight, setCanvasHeight] = useState<number>(0)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // Filter cards by search
  const filteredPremium = useMemo(() => {
    if (!searchQuery.trim()) return PREMIUM_CARDS
    const q = searchQuery.toLowerCase()
    return PREMIUM_CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.keyBenefitValue.toLowerCase().includes(q) ||
        c.rewardsValue.toLowerCase().includes(q) ||
        c.suitedFor.some((s) => s.toLowerCase().includes(q))
    )
  }, [searchQuery])

  const filteredLifetimeFree = useMemo(() => {
    if (!searchQuery.trim()) return LIFETIME_FREE_CARDS
    const q = searchQuery.toLowerCase()
    return LIFETIME_FREE_CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.keyBenefitValue.toLowerCase().includes(q) ||
        c.rewardsValue.toLowerCase().includes(q) ||
        c.suitedFor.some((s) => s.toLowerCase().includes(q))
    )
  }, [searchQuery])

  // Dynamic layout height observer
  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        const measured = Math.max(
          canvasRef.current.scrollHeight,
          canvasRef.current.offsetHeight,
          canvasRef.current.getBoundingClientRect().height / (scale || 1)
        )
        setCanvasHeight(Math.ceil(measured))
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 50)

    const observer = new ResizeObserver(updateHeight)
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }
    window.addEventListener('resize', updateHeight)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [scale, searchQuery, filteredPremium, filteredLifetimeFree])

  return (
    <div className="credit-cards-page" style={{ '--deals-scale': scale } as React.CSSProperties}>
      {/* 1. Desktop Fixed Navbar */}
      <Navbar />

      {/* 2. Top-Right Diagonal Animated Hero Section */}
      <CreditCardsHero />

      {/* 3. Scale-Aware 1920px Canvas Outer Container */}
      <div
        className="credit-cards-canvas-outer"
        style={{
          height: canvasHeight ? `${canvasHeight * scale}px` : 'auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div
          ref={canvasRef}
          className="credit-cards-canvas"
          style={{
            '--brand-scale': scale,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          } as React.CSSProperties}
        >
          {/* ── SEARCH BAR (Right Area Covered, Left Side Empty) ── */}
          <section className="credit-cards-search-wrap" aria-label="Search Credit Cards">
            <div className="credit-cards-search-box">
              <input
                type="text"
                className="credit-cards-search-input"
                placeholder="Search Store, Code or Discount"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search Store, Code or Discount"
              />
              <div className="credit-cards-search-icon-wrap" aria-hidden="true">
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
          </section>

          {/* ── 1. PREMIUM SHOPPING CARDS SECTION ── */}
          {filteredPremium.length > 0 && (
            <section className="credit-cards-section" aria-label="Premium Shopping Cards">
              {/* Header with Red Accent */}
              <div className="credit-cards-section-header">
                <div className="credit-cards-heading-accent credit-cards-heading-accent--red" aria-hidden="true" />
                <h2 className="credit-cards-section-title">Premium Shopping Cards</h2>
              </div>

              {/* Centered 2-Column Grid */}
              <div className="credit-cards-grid">
                {filteredPremium.map((card) => (
                  <div key={card.id} className="credit-cards-grid-col">
                    <CreditCardTile card={card} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 2. UNLIMITED LIFETIME FREE SECTION ── */}
          {filteredLifetimeFree.length > 0 && (
            <section className="credit-cards-section" aria-label="Unlimited Lifetime Free">
              {/* Header with Navy Accent */}
              <div className="credit-cards-section-header">
                <div className="credit-cards-heading-accent credit-cards-heading-accent--navy" aria-hidden="true" />
                <h2 className="credit-cards-section-title">Unlimited Lifetime Free</h2>
              </div>

              {/* Centered 2-Column Grid */}
              <div className="credit-cards-grid">
                {filteredLifetimeFree.map((card) => (
                  <div key={card.id} className="credit-cards-grid-col">
                    <CreditCardTile card={card} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 4. Global Footer with Red Dotted Divider */}
      <FooterSection />
    </div>
  )
}

export default CreditCardsPage
