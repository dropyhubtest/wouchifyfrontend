import React, { useState } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { DealCard } from '../components/deals/DealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import deal1 from '../assets/deals/deal1.png'
import deal2 from '../assets/deals/deal2.png'
import './ProductDisplayPage.css'

export const ProductDisplayPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(false)

  const product = {
    id: 'deal-1',
    titleLine1: 'Xiaomi 138 cm (55 inch) FX Pro QLED',
    titleLine2: 'Ultra HD 4K Smart Fire TV',
    titleLine3: 'L55MB-FPIN',
    fullTitle: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal1,
    price: '37998/-',
    originalPrice: '65000/-',
    discount: '40% off',
    rewards: '10% Rewards',
    rating: '4.2',
    ratingCount: '1984 Ratings',
    dealTag: 'Deal',
    couponCode: 'AMAZON2000',
    ctaHref: 'https://www.amazon.in',
    ctaText: 'Grab this Deal now>>',
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
    redeemSteps: ['1. Grab deal', '2. pay'],
  }

  const similarProducts: DealCardItem[] = [
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
    <div className="product-display-page">
      {/* 1. Desktop Top Navbar */}
      <Navbar activeNav="deals" />

      {/* 2. Main Product Container (Full Viewport Width 2-Column Grid) */}
      <main className="product-display-container">
        {/* Left Column (Product Card with deep & inner shadows) */}
        <section className="product-display-showcase">
          <div className="product-showcase-card">
            <div className="product-showcase-image-wrapper">
              <img
                src={product.productImage}
                alt={product.fullTitle}
                className="product-showcase-image"
              />
            </div>

            <div className="product-showcase-meta-row">
              <div className="product-showcase-store-column">
                <img
                  src={product.storeLogo}
                  alt={product.store}
                  className="product-showcase-store-logo"
                />
                <span className="product-showcase-verified-badge">
                  <span className="product-showcase-verified-dot" /> verified store
                </span>
              </div>
              <span className="product-showcase-deal-pill">
                <span className="product-showcase-deal-dot" /> Deal
              </span>
            </div>

            <h2 className="product-showcase-title">
              <span>{product.titleLine1}</span>
              <span>{product.titleLine2}</span>
              <span>{product.titleLine3}</span>
            </h2>

            <div className="product-showcase-badges-row">
              <span className="product-badge-pill">{product.discount}</span>
              <span className="product-badge-pill">{product.rewards}</span>
            </div>
          </div>
        </section>

        {/* Right Column (Complete Description, Large Text & Updated Coupon Design) */}
        <section className="product-display-details">
          {/* Store Logo */}
          <div className="product-details-store-logo-wrapper">
            <img
              src={product.storeLogo}
              alt={product.store}
              className="product-details-store-logo"
            />
          </div>

          {/* Product Title */}
          <h1 className="product-details-title">{product.fullTitle}</h1>

          {/* Ratings */}
          <div className="product-details-rating-row">
            <span className="product-details-rating">{product.rating}</span>
            <span className="product-details-rating-divider">|</span>
            <span className="product-details-rating-count">{product.ratingCount}</span>
          </div>

          <div className="product-details-header-divider" />

          {/* Pricing Block */}
          <div className="product-details-price-block">
            <div className="product-details-price-row">
              <span className="product-details-current-price">{product.price}</span>
              <span className="product-details-original-price">{product.originalPrice}</span>
            </div>
            <span className="product-details-mrp-subtext">Inclusive of all taxes</span>
          </div>

          {/* Precision SVG Vector Coupon Ticket Card (Top Inner Shadow + Bottom Drop Shadow) */}
          <div className="product-coupon-ticket-wrapper">
            <svg
              className="product-coupon-ticket-svg"
              viewBox="0 0 605 226"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Subtle vertical gradient */}
                <linearGradient id="ticketFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E4E8FE" />
                  <stop offset="100%" stopColor="#EBF0FE" />
                </linearGradient>

                {/* Top Border Inner Shadow Filter */}
                <filter id="topInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feOffset dx="0" dy="6" />
                  <feGaussianBlur stdDeviation="4" result="offset-blur" />
                  <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                  <feFlood floodColor="#000000" floodOpacity="0.28" result="color" />
                  <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                  <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                </filter>
              </defs>

              {/* Base filled path with Top Inner Shadow filter applied */}
              <path
                d="M 56 0 L 372 0 A 18 18 0 0 0 408 0 L 549 0 A 56 56 0 0 1 605 56 L 605 95 A 18 18 0 0 0 605 131 L 605 170 A 56 56 0 0 1 549 226 L 408 226 A 18 18 0 0 0 372 226 L 56 226 A 56 56 0 0 1 0 170 L 0 56 A 56 56 0 0 1 56 0 Z"
                fill="url(#ticketFillGrad)"
                filter="url(#topInnerShadow)"
              />

              {/* Crisp outer stroke border */}
              <path
                d="M 56 0 L 372 0 A 18 18 0 0 0 408 0 L 549 0 A 56 56 0 0 1 605 56 L 605 95 A 18 18 0 0 0 605 131 L 605 170 A 56 56 0 0 1 549 226 L 408 226 A 18 18 0 0 0 372 226 L 56 226 A 56 56 0 0 1 0 170 L 0 56 A 56 56 0 0 1 56 0 Z"
                fill="none"
                stroke="#9CA8E3"
                strokeWidth="1.5"
              />

              {/* Vertical Dashed Perforation Line */}
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

            <div className="product-coupon-ticket-content">
              {/* Left Section (65%) */}
              <div className="coupon-ticket-left">
                <h3 className="coupon-ticket-offer-title">Available Offer</h3>
                <p className="coupon-ticket-offer-sub">Use promo code at checkout:</p>
                <button
                  type="button"
                  className="coupon-ticket-apply-btn"
                  onClick={handleApplyCoupon}
                  title="Click to apply"
                >
                  {applied ? 'APPLIED ✓' : product.couponCode}
                </button>
              </div>

              {/* Right Section (35%) */}
              <div className="coupon-ticket-right">
                <button
                  type="button"
                  className="coupon-ticket-code-btn"
                  onClick={() => handleCopyCode(product.couponCode)}
                  title="Click to copy code"
                >
                  <span>{copied ? 'Copied! ✓' : 'Copy Code'}</span>
                  <svg
                    className="coupon-ticket-copy-icon"
                    width="20"
                    height="20"
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

          {/* Red CTA Button */}
          <a
            href={product.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="product-details-grab-btn"
          >
            {product.ctaText}
          </a>

          {/* About the Product */}
          <div className="product-about-section">
            <h3 className="product-about-heading">About the Product:</h3>
            <p className="product-about-paragraph">{product.aboutParagraph}</p>
            <ul className="product-about-specs-list">
              {product.specs.map((spec, index) => (
                <li key={index} className="product-about-spec-item">
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* How to Redeem */}
          <div className="product-redeem-section">
            <h3 className="product-redeem-heading">How to Redeem:</h3>
            <ol className="product-redeem-list">
              {product.redeemSteps.map((step, index) => (
                <li key={index} className="product-redeem-item">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* 3. Similar Products Section */}
      <section className="product-similar-section">
        <div className="product-similar-header">
          <div className="product-similar-accent" aria-hidden="true" />
          <h2 className="product-similar-title">Similar Products</h2>
        </div>

        <div className="product-similar-grid">
          {similarProducts.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* 4. Desktop Footer */}
      <FooterSection />
    </div>
  )
}

export default ProductDisplayPage