import React, { useState, useMemo } from 'react'
import { MobileHeader } from './MobileHeader'
import { MobileFooter } from './MobileFooter'
import { PREMIUM_CARDS, LIFETIME_FREE_CARDS, type CreditCardItem } from '../../data/creditCardsData'
import './MobileCreditCardsPage.css'

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
