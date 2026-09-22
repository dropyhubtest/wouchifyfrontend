import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Navbar } from '../components/layout'
import { CreditCardsHero } from '../components/credit-cards'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { PREMIUM_CARDS, LIFETIME_FREE_CARDS, type CreditCardItem } from '../data/creditCardsData'
import { adminApi } from '../services/adminApi'
import { CreditCardSkeleton } from '../components/common/Skeletons'

import indusindLogo from '../assets/creditcardpage/indusind_bank.png'
import iciciLogo from '../assets/creditcardpage/ICICI_bank.png'
import idfcLogo from '../assets/creditcardpage/IDFC_back.png'
import tataNeuLogo from '../assets/creditcardpage/Tata_neu.svg'
import axisLogo from '../assets/creditcardpage/Axis_Bank.png'
import bajajLogo from '../assets/creditcardpage/Bajaj-Finsery.png'

import './CreditCardsPage.css'

function resolveBankLogo(bank: string, id: string, logoUrl?: string) {
  if (logoUrl && typeof logoUrl === 'string' && (logoUrl.startsWith('data:') || logoUrl.startsWith('blob:') || logoUrl.startsWith('http') || logoUrl.startsWith('/src/'))) {
    return logoUrl
  }
  const b = (bank || '').toLowerCase()
  const i = (id || '').toLowerCase()
  if (b.includes('indusind') || i.includes('indusind')) return indusindLogo
  if (b.includes('icici') || i.includes('icici')) return iciciLogo
  if (b.includes('idfc') || i.includes('idfc')) return idfcLogo
  if (b.includes('tata') || i.includes('tata')) return tataNeuLogo
  if (b.includes('axis') || i.includes('axis')) return axisLogo
  if (b.includes('bajaj') || i.includes('bajaj')) return bajajLogo
  return logoUrl || indusindLogo
}

function transformApiCardToItem(card: any, idx: number): CreditCardItem {
  const bank = card.bank || 'Banking Partner'
  
  // Section determination: explicit choice first, then fallback to fee heuristic
  const section: 'premium' | 'lifetime-free' = card.section
    ? card.section
    : (
        card.annualFee === '₹0' || 
        card.annualFee === '0' ||
        String(card.annualFee || '').toLowerCase().includes('free') ||
        String(card.annualFee || '').toLowerCase().includes('lifetime') ||
        String(card.feeWaiver || '').toLowerCase().includes('lifetime')
      )
      ? 'lifetime-free'
      : 'premium'

  // Theme determination: explicit choice first, then appropriate section defaults
  let cardTheme: 'white-blue' | 'white-red' | 'navy-card' | 'red-card' = card.cardTheme
  if (!cardTheme) {
    if (section === 'lifetime-free') {
      cardTheme = idx % 2 === 0 ? 'red-card' : 'navy-card'
    } else {
      cardTheme = idx % 2 === 0 ? 'white-blue' : 'white-red'
    }
  }

  const suitedFor = Array.isArray(card.partnerBrands) && card.partnerBrands.length > 0 
    ? card.partnerBrands 
    : (Array.isArray(card.keyBenefits) && card.keyBenefits.length > 0 
      ? card.keyBenefits.slice(0, 3) 
      : (Array.isArray(card.suitedFor) && card.suitedFor.length > 0 ? card.suitedFor : ['Shopping', 'Travel', 'Dining']))

  return {
    id: String(card._id || card.id || `card-${idx}`),
    name: card.cardName || card.name || 'Credit Card',
    logo: resolveBankLogo(bank, String(card._id || card.id || ''), card.bankLogoUrl || card.logo),
    section,
    cardTheme,
    tagText: card.tagText || bank,
    keyBenefitLabel: card.keyBenefitLabel || 'TOP BENEFIT',
    keyBenefitValue: card.welcomeOffer || card.keyBenefitValue || 'Upto 5% Cashback',
    rewardsLabel: card.rewardsLabel || 'REWARDS',
    rewardsValue: card.rewardRate || card.rewardsValue || (section === 'lifetime-free' ? 'Lifetime Free Offers' : 'Exclusive Rewards'),
    suitedFor,
    userCount: card.userCount || (card.applyCount ? `+${(card.applyCount / 1000).toFixed(1)}k` : '+2.4k'),
    applyHref: card.affiliateLink || card.applyHref || '#'
  }
}

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

import { getCached } from '../services/dataCache'

/* ── Main CreditCardsPage Component ── */
export const CreditCardsPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [canvasHeight, setCanvasHeight] = useState<number>(0)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // Synchronously check cache
  const cachedData = getCached<any[]>(`public:credit-cards::`)
  const initialCards = cachedData && Array.isArray(cachedData) && cachedData.length > 0 
    ? cachedData.map(transformApiCardToItem) 
    : []

  const [liveCards, setLiveCards] = useState<CreditCardItem[]>(initialCards)
  const [loading, setLoading] = useState(!cachedData)

  const fetchLive = async () => {
    try {
      const res = await adminApi.getCreditCards()
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(transformApiCardToItem)
        setLiveCards(mapped)
      } else {
        // Fallback to local data if API returns empty array (e.g. initial dev state)
        setLiveCards([...PREMIUM_CARDS, ...LIFETIME_FREE_CARDS])
      }
    } catch (err) {
      console.warn('Failed to fetch public credit cards:', err)
      setLiveCards([...PREMIUM_CARDS, ...LIFETIME_FREE_CARDS])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLive()
    const handleSync = () => fetchLive()
    window.addEventListener('wouchify_credit_cards_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_credit_cards_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const premiumCards = useMemo(() => liveCards.filter(c => c.section === 'premium'), [liveCards])
  const lifetimeFreeCards = useMemo(() => liveCards.filter(c => c.section === 'lifetime-free'), [liveCards])

  // Filter cards by search
  const filteredPremium = useMemo(() => {
    if (!searchQuery.trim()) return premiumCards
    const q = searchQuery.toLowerCase()
    return premiumCards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.keyBenefitValue.toLowerCase().includes(q) ||
        c.rewardsValue.toLowerCase().includes(q) ||
        c.suitedFor.some((s) => s.toLowerCase().includes(q))
    )
  }, [searchQuery, premiumCards])

  const filteredLifetimeFree = useMemo(() => {
    if (!searchQuery.trim()) return lifetimeFreeCards
    const q = searchQuery.toLowerCase()
    return lifetimeFreeCards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.keyBenefitValue.toLowerCase().includes(q) ||
        c.rewardsValue.toLowerCase().includes(q) ||
        c.suitedFor.some((s) => s.toLowerCase().includes(q))
    )
  }, [searchQuery, lifetimeFreeCards])

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
          {(loading || filteredPremium.length > 0) && (
            <section className="credit-cards-section" aria-label="Premium Shopping Cards">
              {/* Header with Red Accent */}
              <div className="credit-cards-section-header">
                <div className="credit-cards-heading-accent credit-cards-heading-accent--red" aria-hidden="true" />
                <h2 className="credit-cards-section-title">Premium Shopping Cards</h2>
              </div>

              {/* Centered 2-Column Grid */}
              <div className="credit-cards-grid">
                {loading ? (
                  <CreditCardSkeleton count={4} />
                ) : (
                  filteredPremium.map((card) => (
                    <div key={card.id} className="credit-cards-grid-col">
                      <CreditCardTile card={card} />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* ── 2. UNLIMITED LIFETIME FREE SECTION ── */}
          {(loading || filteredLifetimeFree.length > 0) && (
            <section className="credit-cards-section" aria-label="Unlimited Lifetime Free">
              {/* Header with Navy Accent */}
              <div className="credit-cards-section-header">
                <div className="credit-cards-heading-accent credit-cards-heading-accent--navy" aria-hidden="true" />
                <h2 className="credit-cards-section-title">Unlimited Lifetime Free</h2>
              </div>

              {/* Centered 2-Column Grid */}
              <div className="credit-cards-grid">
                {loading ? (
                  <CreditCardSkeleton count={4} />
                ) : (
                  filteredLifetimeFree.map((card) => (
                    <div key={card.id} className="credit-cards-grid-col">
                      <CreditCardTile card={card} />
                    </div>
                  ))
                )}
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
