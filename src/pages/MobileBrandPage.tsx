import React, { useState, useMemo } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import { getBrandData } from '../data/brandDeals'

import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import amazonCouponLogo from '../assets/coupons/amazon.png'

import './MobileBrandPage.css'

const FILTER_PILLS = ['All', 'Deals', 'Loot', 'Coupons', 'Expired', '25%+'] as const
type FilterPill = typeof FILTER_PILLS[number]

interface MobileBrandPageProps {
  brandSlug?: string
}

export const MobileBrandPage: React.FC<MobileBrandPageProps> = ({ brandSlug = 'amazon' }) => {
  const brand = getBrandData(brandSlug) || getBrandData('amazon')
  const brandName = brand?.name || 'Amazon'

  const [activeFilter, setActiveFilter] = useState<FilterPill>('All')
  const [copied, setCopied] = useState(false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 2 sample deals matching Figma / Mobile reference
  const deals: DealCardItem[] = useMemo(() => {
    return DEALS_CARD_ITEMS.slice(0, 2)
  }, [])

  const filteredDeals = useMemo(() => {
    if (activeFilter === 'Coupons') return []
    return deals
  }, [deals, activeFilter])

  const showCouponsSection = activeFilter === 'All' || activeFilter === 'Coupons'
  const showDealsSection = activeFilter === 'All' || activeFilter === 'Deals' || activeFilter === 'Loot' || activeFilter === '25%+'

  // SVG Ticket Path for Mobile (390 x 190) with 4 notch cutouts and rounded corners
  const ticketPath = `
    M 18 0
    H 226
    A 14 14 0 0 0 254 0
    H 372
    A 18 18 0 0 1 390 18
    V 81
    A 14 14 0 0 0 390 109
    V 172
    A 18 18 0 0 1 372 190
    H 254
    A 14 14 0 0 0 226 190
    H 18
    A 18 18 0 0 1 0 172
    V 109
    A 14 14 0 0 0 0 81
    V 18
    A 18 18 0 0 1 18 0
    Z
  `

  return (
    <div className="mobile-brand-page">
      {/* 1. Mobile Header (Minimal with Hamburger, Logo & Wishlist Heart) */}
      <MobileHeader variant="minimal" />

      <main className="mobile-brand-content">
        {/* 2. Breadcrumb Navigation */}
        <div className="mobile-brand__breadcrumb-wrap">
          <a href="/deals" className="mobile-brand__breadcrumb">
            &lt;&lt; {brandName} Deals
          </a>
        </div>

        {/* 3. 2-Row Filter Grid */}
        <div className="mobile-brand__filter-grid" role="toolbar" aria-label="Deal filters">
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill
            return (
              <button
                key={pill}
                type="button"
                className={`mobile-brand__filter-btn ${isActive ? 'mobile-brand__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(pill)}
                aria-pressed={isActive}
              >
                {pill}
              </button>
            )
          })}
        </div>

        {/* 4. Brand Intro & Reward Headline */}
        <section className="mobile-brand__intro-section" aria-label={`${brandName} Information`}>
          <div className="mobile-brand__logo-wrap">
            <img
              src={amazonLogo}
              alt={brandName}
              className="mobile-brand__main-logo"
              width="140"
              height="36"
            />
          </div>

          <h1 className="mobile-brand__headline">
            Up to 6.2% rewards
          </h1>

          <p className="mobile-brand__subtitle">
            Get verified electronics, fashion, and home coupons with high success rates.
          </p>
        </section>

        {/* 5. Available Coupons Section */}
        {showCouponsSection && (
          <section className="mobile-brand__coupons-section" aria-label="Available Coupons">
            {/* Heading with Red Semi-Circle Accent */}
            <div className="mobile-brand__section-header">
              <div className="mobile-brand__heading-accent" aria-hidden="true" />
              <h2 className="mobile-brand__section-title">Available Coupons</h2>
            </div>

            {/* Red Perforated Coupon Ticket */}
            <div className="mobile-coupon-ticket">
              <svg
                className="mobile-coupon-ticket__svg"
                viewBox="0 0 390 190"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Red Ticket Body */}
                <path d={ticketPath} fill="#E31E25" />

                {/* White Dotted Perforation Line */}
                <line
                  x1="240"
                  y1="16"
                  x2="240"
                  y2="174"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Left Partition: Logo, 10% Off, Expiry & Min Order */}
              <div className="mobile-coupon-left">
                {/* White Logo Container */}
                <div className="mobile-coupon-logo-box">
                  <img
                    src={amazonCouponLogo}
                    alt="Amazon"
                    className="mobile-coupon-logo"
                    width="75"
                    height="22"
                  />
                </div>

                {/* 10% Off Row */}
                <div className="mobile-coupon-discount-wrap">
                  <span className="mobile-coupon-discount-val">10%</span>
                  <span className="mobile-coupon-discount-off">Off</span>
                </div>

                {/* Meta details */}
                <div className="mobile-coupon-meta">
                  <div className="mobile-coupon-meta-item">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Expires in 3 days</span>
                  </div>

                  <div className="mobile-coupon-meta-item">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
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

              {/* Right Partition: USE CODE, AMAZON10 pill, Copy Code */}
              <div className="mobile-coupon-right">
                <span className="mobile-coupon-use-code">USE CODE:</span>

                <button
                  type="button"
                  className="mobile-coupon-code-pill"
                  onClick={() => handleCopyCode('AMAZON10')}
                  title="Click to copy AMAZON10"
                >
                  AMAZON10
                </button>

                <button
                  type="button"
                  className="mobile-coupon-copy-btn"
                  onClick={() => handleCopyCode('AMAZON10')}
                  aria-label="Copy coupon code"
                >
                  <span className="mobile-coupon-copy-text">
                    {copied ? 'Copied! ✓' : 'Copy Code'}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
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

        {/* 6. Available Deals Section */}
        {showDealsSection && (
          <section className="mobile-brand__deals-section" aria-label="Available Deals">
            {/* Heading with Red Semi-Circle Accent */}
            <div className="mobile-brand__section-header">
              <div className="mobile-brand__heading-accent" aria-hidden="true" />
              <h2 className="mobile-brand__section-title">Available Deals</h2>
            </div>

            {/* Top Deals Pill */}
            <div className="mobile-brand__top-deals-pill">
              Top Deals
            </div>

            {/* Horizontal Deals Carousel */}
            <div className="mobile-brand__deals-scroll">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="mobile-brand__deal-card-wrap">
                  <MobileDealCard deal={deal} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 7. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileBrandPage
