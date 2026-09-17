import React, { useState, useEffect, useMemo } from 'react'
import { MobileHeader } from './MobileHeader'
import { MobileFooter } from './MobileFooter'
import { PREMIUM_CARDS, LIFETIME_FREE_CARDS, type CreditCardItem } from '../../data/creditCardsData'
import { adminApi } from '../../services/adminApi'

import indusindLogo from '../../assets/creditcardpage/indusind_bank.png'
import iciciLogo from '../../assets/creditcardpage/ICICI_bank.png'
import idfcLogo from '../../assets/creditcardpage/IDFC_back.png'
import tataNeuLogo from '../../assets/creditcardpage/Tata_neu.svg'
import axisLogo from '../../assets/creditcardpage/Axis_Bank.png'
import bajajLogo from '../../assets/creditcardpage/Bajaj-Finsery.png'

import './MobileCreditCardsPage.css'

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

/* ── Mobile Credit Card Item Component ── */
const MobileCreditCardItem: React.FC<{ card: CreditCardItem }> = ({ card }) => {
  return (
    <div className={`mobile-cc-card mobile-cc-card--${card.cardTheme}`}>
      {/* 1. Top Content Header */}
      <div className="mobile-cc-card__top">
        <div className="mobile-cc-card__left-header">
          <span className="mobile-cc-card__tag">{card.tagText}</span>
          <h3 className="mobile-cc-card__name">{card.name}</h3>
        </div>
        <div className="mobile-cc-card__logo-box">
          <img src={card.logo} alt={card.name} className="mobile-cc-card__logo" />
        </div>
      </div>

      {/* 2. Full-Width Middle Banner */}
      <div className="mobile-cc-card__banner">
        <div className="mobile-cc-card__banner-col">
          <span className="mobile-cc-card__banner-label">{card.keyBenefitLabel}</span>
          <span className="mobile-cc-card__banner-value">{card.keyBenefitValue}</span>
        </div>
        <div className="mobile-cc-card__banner-col mobile-cc-card__banner-col--right">
          <span className="mobile-cc-card__banner-label">{card.rewardsLabel}</span>
          <span className="mobile-cc-card__banner-value">{card.rewardsValue}</span>
        </div>
      </div>

      {/* 3. Bottom Content */}
      <div className="mobile-cc-card__bottom">
        {/* Verified Partners */}
        <div className="mobile-cc-card__partners">
          <span className="mobile-cc-card__partners-label">VERIFIED PARTNERS</span>
          <div className="mobile-cc-card__partners-pills">
            {card.suitedFor.map((partner, idx) => (
              <span key={idx} className="mobile-cc-card__partner-pill">
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Thin Divider Line */}
        <div className="mobile-cc-card__divider" aria-hidden="true" />

        {/* Footer Row */}
        <div className="mobile-cc-card__footer-row">
          <div className="mobile-cc-card__users">
            <div className="mobile-cc-card__avatar-stack">
              <span className="mobile-cc-card__avatar mobile-cc-card__avatar--1">U1</span>
              <span className="mobile-cc-card__avatar mobile-cc-card__avatar--2">U2</span>
              <span className="mobile-cc-card__avatar mobile-cc-card__avatar--3">U3</span>
            </div>
            <span className="mobile-cc-card__user-count">{card.userCount}</span>
          </div>

          <a href={card.applyHref} className="mobile-cc-card__apply-btn">
            <span>Apply now</span>
            <span className="mobile-cc-card__apply-arrow">&gt;&gt;</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Mobile Credit Cards Page Main Component ── */
export const MobileCreditCardsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const [liveCards, setLiveCards] = useState<CreditCardItem[]>(() => {
    return [...PREMIUM_CARDS, ...LIFETIME_FREE_CARDS]
  })

  const fetchLive = async () => {
    try {
      const res = await adminApi.getCreditCards()
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(transformApiCardToItem)
        setLiveCards(mapped)
      }
    } catch (err) {
      console.warn('Failed to fetch public credit cards on mobile:', err)
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

  return (
    <div className="mobile-credit-cards-page">
      {/* 1. Mobile Header */}
      <MobileHeader />

      {/* 2. Breadcrumbs Bar: Back to Home */}
      <div className="mobile-cc__breadcrumb">
        <a href="/" className="mobile-cc__back-link" aria-label="Back to home">
          &lt;&lt; Home
        </a>
      </div>

      {/* 3. Search Bar */}
      <div className="mobile-cc__search-wrap">
        <div className="mobile-cc__search-box">
          <input
            type="text"
            className="mobile-cc__search-input"
            placeholder="Search cards"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search cards"
          />
          <div className="mobile-cc__search-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="#222222"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 20L16 16"
                stroke="#222222"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Section 1: Premium Shopping Cards (Navy Accent) */}
      {filteredPremium.length > 0 && (
        <section className="mobile-cc__section" aria-label="Premium Shopping Cards">
          <div className="mobile-cc__section-header">
            <div className="mobile-cc__accent mobile-cc__accent--navy" aria-hidden="true" />
            <h2 className="mobile-cc__section-title">Premium Shopping Cards</h2>
          </div>

          {/* Horizontal Scroll Carousel */}
          <div className="mobile-cc__carousel">
            {filteredPremium.map((card) => (
              <MobileCreditCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Section 2: Unlimited Lifetime Free (Red Accent) */}
      {filteredLifetimeFree.length > 0 && (
        <section className="mobile-cc__section" aria-label="Unlimited Lifetime Free">
          <div className="mobile-cc__section-header">
            <div className="mobile-cc__accent mobile-cc__accent--red" aria-hidden="true" />
            <h2 className="mobile-cc__section-title">Unlimited Lifetime Free</h2>
          </div>

          {/* Horizontal Scroll Carousel */}
          <div className="mobile-cc__carousel">
            {filteredLifetimeFree.map((card) => (
              <MobileCreditCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileCreditCardsPage
