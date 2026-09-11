import React, { useState } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import deal1 from '../assets/deals/deal1.png'
import deal2 from '../assets/deals/deal2.png'
import './MobileProductPage.css'

export const MobileProductPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(false)
  const [activeDot, setActiveDot] = useState(0)

  const product = {
    id: 'deal-1',
    fullTitle: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal1,
    price: '37998',
    originalPrice: '65000',
    discount: '40% off',
    rewards: '10% Rewards',
    rating: '4.2',
    ratingCount: '1984 Ratings',
    dealTag: 'Deal',
    couponCode: 'AMAZON2000',
    ctaHref: 'https://www.amazon.in',
    aboutParagraph:
      'Screen Size 55 Inches Brand XIAOMI Display Technology QLED Resolution 4K Refresh Rate 60 Hz Special Feature Bezel-Less Design, Built-In Speaker, Chromecast, Eye Comfort Mode, Wide Viewing Angle Included Components Power Cable Connectivity Technology Ethernet, HDMI, USB, Wi-Fi Aspect Ratio 16:9 Product Dimensions 7.6D x 122.6W x 71.7H Centimeters',
    specs: [
      'Screen Size 55 Inches',
      'Brand XIAOMI',
      'Display Technology QLED',
      'Resolution 4K',
      'Refresh Rate 60 Hz',
      'Special Feature Bezel-Less Design, Built-In Speaker, Chromecast, Eye Comfort Mode, Wide Viewing Angle',
      'Included Components Power Cable',
      'Connectivity Technology Ethernet, HDMI, USB, Wi-Fi',
      'Aspect Ratio 16:9',
      'Product Dimensions 7.6D x 122.6W x 71.7H Centimeters',
    ],
  }

  const relatedDeals: DealCardItem[] = [
    DEALS_CARD_ITEMS[0] || {
      id: 'deal-1',
      title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN',
      category: 'ELECTRONICS',
      store: 'Amazon',
      storeLogo: amazonLogo,
      productImage: deal1,
      price: '37998',
      originalPrice: '62999',
      discountPercentage: '40% OFF',
      ctaText: 'GRAB DEAL',
      ctaHref: '/product?id=deal-1',
    },
    DEALS_CARD_ITEMS[1] || {
      id: 'deal-2',
      title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable Electric..',
      category: 'ELECTRONICS',
      store: 'Amazon',
      storeLogo: amazonLogo,
      productImage: deal2,
      price: '604',
      originalPrice: '1499',
      discountPercentage: '60% OFF',
      ctaText: 'GRAB DEAL',
      ctaHref: '/product?id=deal-2',
    },
  ]

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleApplyCoupon = () => {
    setApplied(true)
    setTimeout(() => setApplied(false), 2500)
  }

  return (
    <div className="mobile-product-page">
      {/* 1. Mobile Header */}
      <MobileHeader activeNav="deals" />

      {/* 2. Breadcrumb / Back Link */}
      <div className="mobile-product-back-row">
        <a href="/" className="mobile-product-back-link">
          &lt;&lt; Home
        </a>
      </div>

      {/* 3. Store Info Row */}
      <div className="mobile-product-store-row">
        <div className="mobile-product-store-left">
          <img
            src={product.storeLogo}
            alt={product.store}
            className="mobile-product-store-logo"
          />
          <span className="mobile-product-verified-badge">
            <span className="mobile-product-verified-dot" /> verified store
          </span>
        </div>
        <span className="mobile-product-deal-pill">
          <span className="mobile-product-deal-dot" /> Deal
        </span>
      </div>

      {/* 4. Product Image Card */}
      <div className="mobile-product-image-card">
        <img
          src={product.productImage}
          alt={product.fullTitle}
          className="mobile-product-image"
        />
      </div>

      {/* Pagination Dots */}
      <div className="mobile-product-dots-row" aria-hidden="true">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            className={`mobile-product-dot ${activeDot === idx ? 'mobile-product-dot--active' : ''}`}
            onClick={() => setActiveDot(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 5. Product Title */}
      <h1 className="mobile-product-title">{product.fullTitle}</h1>

      {/* 6. Perforated Coupon Ticket Card (Mobile Vector SVG) */}
      <div className="mobile-product-coupon-wrapper">
        <svg
          className="mobile-product-coupon-svg"
          viewBox="0 0 605 226"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mobileTicketFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E4E8FE" />
              <stop offset="100%" stopColor="#EBF0FE" />
            </linearGradient>

            <filter id="mobileTopInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset dx="0" dy="6" />
              <feGaussianBlur stdDeviation="4" result="offset-blur" />
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
              <feFlood floodColor="#000000" floodOpacity="0.28" result="color" />
              <feComposite operator="in" in="color" in2="inverse" result="shadow" />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Base path with Top Inner Shadow */}
          <path
            d="M 56 0 L 372 0 A 18 18 0 0 0 408 0 L 549 0 A 56 56 0 0 1 605 56 L 605 95 A 18 18 0 0 0 605 131 L 605 170 A 56 56 0 0 1 549 226 L 408 226 A 18 18 0 0 0 372 226 L 56 226 A 56 56 0 0 1 0 170 L 0 56 A 56 56 0 0 1 56 0 Z"
            fill="url(#mobileTicketFillGrad)"
            filter="url(#mobileTopInnerShadow)"
          />

          {/* Outer stroke border */}
          <path
            d="M 56 0 L 372 0 A 18 18 0 0 0 408 0 L 549 0 A 56 56 0 0 1 605 56 L 605 95 A 18 18 0 0 0 605 131 L 605 170 A 56 56 0 0 1 549 226 L 408 226 A 18 18 0 0 0 372 226 L 56 226 A 56 56 0 0 1 0 170 L 0 56 A 56 56 0 0 1 56 0 Z"
            fill="none"
            stroke="#9CA8E3"
            strokeWidth="1.5"
          />

          {/* Vertical dashed perforation line */}
          <line
            x1="390"
            y1="20"
            x2="390"
            y2="206"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
        </svg>

        <div className="mobile-product-coupon-content">
          <div className="mobile-coupon-left">
            <h3 className="mobile-coupon-offer-title">Available Offer</h3>
            <p className="mobile-coupon-offer-sub">Use promo code at checkout:</p>
            <button
              type="button"
              className="mobile-coupon-apply-btn"
              onClick={handleApplyCoupon}
            >
              {applied ? 'APPLIED ✓' : product.couponCode}
            </button>
          </div>

          <div className="mobile-coupon-right">
            <button
              type="button"
              className="mobile-coupon-code-btn"
              onClick={() => handleCopyCode(product.couponCode)}
              title="Click to copy code"
            >
              <span>{copied ? 'Copied! ✓' : 'Copy Code'}</span>
              <svg
                className="mobile-coupon-copy-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 7. About the Product Section */}
      <div className="mobile-product-about-section">
        <h2 className="mobile-product-about-heading">About the Product:</h2>
        <p className="mobile-product-about-paragraph">{product.aboutParagraph}</p>
        <ul className="mobile-product-specs-list">
          {product.specs.map((spec, index) => (
            <li key={index} className="mobile-product-spec-item">
              {spec}
            </li>
          ))}
        </ul>
      </div>

      {/* 8. Similar Products Section matching Figma */}
      <section className="mobile-product-similar-section" aria-label="Similar Products">
        <div className="mobile-product-similar-heading">
          <div className="mobile-product-similar-heading__accent" />
          <h2>Similar Products</h2>
        </div>

        <div className="mobile-product-scroller" tabIndex={0} role="region" aria-label="Scrollable Similar Products">
          <div className="mobile-product-track">
            {relatedDeals.map((deal) => (
              <MobileDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileProductPage