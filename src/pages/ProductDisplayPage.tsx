import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { DealCard } from '../components/deals/DealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import { adminApi } from '../services/adminApi'
import { isWishlisted, toggleWishlist } from '../utils/wishlistManager'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import deal1 from '../assets/deals/deal1.png'
import deal2 from '../assets/deals/deal2.png'
import './ProductDisplayPage.css'

export const ProductDisplayPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [applied, setApplied] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [upvotes, setUpvotes] = useState<number>(48)
  const [downvotes, setDownvotes] = useState<number>(2)
  const [liveProduct, setLiveProduct] = useState<any>(null)
  const [categoryDeals, setCategoryDeals] = useState<DealCardItem[]>([])
  const [favorited, setFavorited] = useState<boolean>(false)

  const loadProductData = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const targetId = urlParams.get('id') || urlParams.get('product') || 'deal-1'

      const [dealsRes, lootsRes] = await Promise.all([
        adminApi.getDeals(),
        adminApi.getLootDeals()
      ])

      const foundDeal = dealsRes.find((d: any) => String(d.id || d._id) === String(targetId))
      const foundLoot = !foundDeal ? lootsRes.find((l: any) => String(l.id || l._id) === String(targetId)) : null

      if (foundDeal) {
        setLiveProduct({
          id: foundDeal.id || foundDeal._id,
          isLoot: false,
          titleLine1: (foundDeal.name || foundDeal.title || '').slice(0, 45),
          titleLine2: (foundDeal.name || foundDeal.title || '').slice(45, 90),
          titleLine3: (foundDeal.name || foundDeal.title || '').slice(90),
          fullTitle: foundDeal.name || foundDeal.title,
          category: foundDeal.category || 'ELECTRONICS',
          store: foundDeal.store || 'Amazon',
          storeLogo: amazonLogo,
          productImage: foundDeal.image || foundDeal.productImage || deal1,
          price: foundDeal.price ? `₹${foundDeal.price.toString().replace(/[^0-9]/g, '')}/-` : '₹37,998/-',
          originalPrice: foundDeal.originalPrice ? `₹${foundDeal.originalPrice.toString().replace(/[^0-9]/g, '')}/-` : '₹65,000/-',
          discount: foundDeal.discount || '40% off',
          rewards: '10% Rewards',
          rating: '4.5',
          ratingCount: '2,140 Ratings',
          dealTag: 'Deal',
          couponCode: (foundDeal.couponCode || `${(foundDeal.store || 'WOUCH').toUpperCase().replace(/[^A-Z0-9]/g, '')}10`).toUpperCase(),
          ctaHref: foundDeal.ctaHref || foundDeal.href || 'https://www.amazon.in',
          ctaText: 'Grab this Deal now>>',
          aboutParagraph: foundDeal.description || `Special offer on verified ${foundDeal.name || foundDeal.title} with high savings and guaranteed cashback through Wouchify.`,
          specs: [
            `Category: ${foundDeal.category || 'General'}`,
            `Store: ${foundDeal.store || 'Amazon'}`,
            `Status: ${foundDeal.status || 'Active'}`,
            `Verified: Instant cashback eligible`,
            `Expiry: ${foundDeal.expiry || 'Limited time offer'}`
          ],
          redeemSteps: ['1. Click Grab Deal to visit store', '2. Apply coupon at checkout & get cashback']
        })

        const related = dealsRes
          .filter((d: any) => d.id !== foundDeal.id && (d.category === foundDeal.category || d.store === foundDeal.store))
          .map((d: any) => ({
            id: d.id || d._id,
            title: d.name || d.title,
            category: d.category || 'DEALS',
            store: d.store || 'Amazon',
            storeLogo: amazonLogo,
            productImage: d.image || d.productImage || deal2,
            price: d.price ? `₹${d.price.toString().replace(/[^0-9]/g, '')}` : '₹604',
            originalPrice: d.originalPrice ? `₹${d.originalPrice.toString().replace(/[^0-9]/g, '')}` : undefined,
            discountPercentage: d.discount || '40% OFF',
            ctaText: 'GRAB DEAL',
            ctaHref: `/product?id=${d.id || d._id}`
          }))
        setCategoryDeals(related)
      } else if (foundLoot) {
        setLiveProduct({
          id: foundLoot.id || foundLoot._id,
          isLoot: true,
          titleLine1: (foundLoot.title || '').slice(0, 45),
          titleLine2: (foundLoot.title || '').slice(45, 90),
          titleLine3: (foundLoot.title || '').slice(90),
          fullTitle: foundLoot.title,
          category: foundLoot.category || 'LOOT DEALS',
          store: foundLoot.storeName || 'Amazon',
          storeLogo: amazonLogo,
          productImage: foundLoot.image || foundLoot.productImage || deal1,
          price: foundLoot.currentPrice ? `₹${foundLoot.currentPrice.toString().replace(/[^0-9]/g, '')}/-` : '₹499/-',
          originalPrice: foundLoot.originalPrice ? `₹${foundLoot.originalPrice.toString().replace(/[^0-9]/g, '')}/-` : '₹1,999/-',
          discount: foundLoot.discount || '75% off',
          rewards: '15% Rewards',
          rating: '4.8',
          ratingCount: '3,450 Ratings',
          dealTag: 'Loot Deal',
          couponCode: 'LOOTNOW',
          ctaHref: foundLoot.href || 'https://www.amazon.in',
          ctaText: 'Grab this Loot now>>',
          aboutParagraph: `Exclusive flash loot deal on ${foundLoot.title}. Hurry before stocks run out!`,
          specs: [
            `Category: ${foundLoot.category || 'General'}`,
            `Store: ${foundLoot.storeName || 'Partner Store'}`,
            `Deal Type: ${foundLoot.dealType || 'Flash'}`,
            `Status: Active Loot`
          ],
          redeemSteps: ['1. Click Grab Loot', '2. Checkout immediately before deal expires']
        })
      }
    } catch (err) {
      console.warn('ProductDisplayPage load error:', err)
    }
  }, [])

  useEffect(() => {
    loadProductData()
  }, [loadProductData])

  const defaultProduct = {
    id: 'deal-1',
    isLoot: false,
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

  const product = liveProduct || defaultProduct

  const similarProducts: DealCardItem[] = useMemo(() => {
    if (categoryDeals.length > 0) return categoryDeals
    return [
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
  }, [categoryDeals])

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    adminApi.trackCouponClick(code)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleApplyCoupon = () => {
    setApplied(true)
    adminApi.trackCouponClick(product.couponCode)
    setTimeout(() => setApplied(false), 2500)
  }

  useEffect(() => {
    if (product?.id) {
      setFavorited(isWishlisted(product.id))
    }
  }, [product?.id])

  useEffect(() => {
    const handleSync = (e: any) => {
      if (e.detail?.targetId === String(product?.id)) {
        setFavorited(e.detail.added)
      } else if (product?.id) {
        setFavorited(isWishlisted(product.id))
      }
    }
    window.addEventListener('wouchify_wishlist_updated', handleSync)
    return () => window.removeEventListener('wouchify_wishlist_updated', handleSync)
  }, [product?.id])

  const handleToggleFavorite = () => {
    if (!product) return
    const cardItem: DealCardItem = {
      id: product.id,
      title: product.fullTitle,
      category: product.category,
      store: product.store,
      storeLogo: product.storeLogo,
      productImage: product.productImage,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discount,
      ctaText: 'GRAB DEAL',
      ctaHref: `/product?id=${product.id}`
    }
    const added = toggleWishlist(cardItem)
    setFavorited(added)
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: product.fullTitle,
        text: `Check out this deal on Wouchify: ${product.fullTitle}`,
        url
      }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2500)
    }
  }

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      // Toggle off
      setUserVote(null)
      if (type === 'up') setUpvotes((v) => Math.max(0, v - 1))
      if (type === 'down') setDownvotes((v) => Math.max(0, v - 1))
    } else {
      if (userVote === 'up') setUpvotes((v) => Math.max(0, v - 1))
      if (userVote === 'down') setDownvotes((v) => Math.max(0, v - 1))
      setUserVote(type)
      if (type === 'up') setUpvotes((v) => v + 1)
      if (type === 'down') setDownvotes((v) => v + 1)
    }
  }

  const handleGrabDealClick = () => {
    if (product?.isLoot) {
      adminApi.trackLootClick(product.id)
    } else if (product?.id) {
      adminApi.trackDealClick(product.id)
    }
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
            <div className="product-showcase-image-wrapper" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
                title={favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 5,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={favorited ? '#E31E25' : 'none'} stroke={favorited ? '#E31E25' : '#1E1E1E'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
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

          {/* Red CTA Button & Actions Row */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
            <a
              href={product.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="product-details-grab-btn"
              onClick={handleGrabDealClick}
              style={{ flex: 1, minWidth: '220px', margin: 0 }}
            >
              {product.ctaText}
            </a>

            <button
              type="button"
              onClick={handleShare}
              title="Share Deal"
              aria-label="Share this deal"
              style={{
                height: '52px',
                padding: '0 20px',
                borderRadius: '12px',
                border: '1.5px solid #2F368C',
                background: '#FFFFFF',
                color: '#2F368C',
                fontWeight: '700',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>{shareToast ? 'Link Copied! ✓' : 'Share'}</span>
            </button>
          </div>

          {/* Deal Helpful Feedback Bar */}
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: '#F8FAFC',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                Did this deal work for you?
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleVote('up')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: userVote === 'up' ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
                  background: userVote === 'up' ? '#DCFCE7' : '#FFFFFF',
                  color: userVote === 'up' ? '#15803D' : '#475569',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease'
                }}
              >
                <span>👍</span>
                <span>Yes ({upvotes})</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote('down')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: userVote === 'down' ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                  background: userVote === 'down' ? '#FEE2E2' : '#FFFFFF',
                  color: userVote === 'down' ? '#B91C1C' : '#475569',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease'
                }}
              >
                <span>👎</span>
                <span>No ({downvotes})</span>
              </button>
            </div>
          </div>

          {/* About the Product */}
          <div className="product-about-section">
            <h3 className="product-about-heading">About the Product:</h3>
            <p className="product-about-paragraph">{product.aboutParagraph}</p>
            <ul className="product-about-specs-list">
              {(product.specs || []).map((spec: string, index: number) => (
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
              {(product.redeemSteps || []).map((step: string, index: number) => (
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