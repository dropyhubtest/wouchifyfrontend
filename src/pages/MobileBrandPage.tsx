import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileDealCard } from '../components/mobile/MobileDealCard'
import { DEALS_CARD_ITEMS, type DealCardItem } from '../data/dealsPage'
import { getBrandData } from '../data/brandDeals'
import { adminApi } from '../services/adminApi'

import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import amazonCouponLogo from '../assets/coupons/amazon.png'

import './MobileBrandPage.css'

const FILTER_PILLS = ['All', 'Deals', 'Loot', 'Coupons', 'Expired', '25%+'] as const
type FilterPill = typeof FILTER_PILLS[number]

interface MobileBrandPageProps {
  brandSlug?: string
}

export const MobileBrandPage: React.FC<MobileBrandPageProps> = ({ brandSlug = 'amazon' }) => {
  const staticBrand = getBrandData(brandSlug) || getBrandData('amazon')
  
  const [liveStore, setLiveStore] = useState<any>(null)
  const [liveDeals, setLiveDeals] = useState<any[]>([])
  const [liveCoupons, setLiveCoupons] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterPill>('All')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const brandName = liveStore?.name || staticBrand?.name || brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)
  const brandLogo = liveStore?.logo || staticBrand?.logoSrc || amazonLogo
  const rewardText = liveStore?.reward || (staticBrand ? `Up to ${staticBrand.rewardValue} rewards` : 'Up to 6.2% rewards')

  const loadBrandData = useCallback(async () => {
    try {
      const [stores, deals, loots, coupons] = await Promise.all([
        adminApi.getStores(),
        adminApi.getDeals(),
        adminApi.getLootDeals(),
        adminApi.getCoupons()
      ]);

      const targetSlug = brandSlug.toLowerCase();
      const matchedStore = stores.find(
        (s: any) =>
          (s.slug && s.slug.toLowerCase() === targetSlug) ||
          (s.name && s.name.toLowerCase() === targetSlug) ||
          (s.name && targetSlug.includes(s.name.toLowerCase()))
      );
      if (matchedStore) {
        setLiveStore(matchedStore);
      }

      const matchName = (matchedStore?.name || brandName || brandSlug).toLowerCase();

      const filteredLiveDeals = deals.filter(
        (d: any) =>
          d.store && (d.store.toLowerCase() === matchName || d.store.toLowerCase().includes(targetSlug) || targetSlug.includes(d.store.toLowerCase()))
      );

      const filteredLiveLoots = loots.filter(
        (l: any) =>
          l.storeName && (l.storeName.toLowerCase() === matchName || l.storeName.toLowerCase().includes(targetSlug) || targetSlug.includes(l.storeName.toLowerCase()))
      );

      const combinedDeals = [
        ...filteredLiveDeals.map((d: any) => ({
          id: d.id || d._id,
          title: d.name || d.title,
          category: d.category || 'DEALS',
          store: d.store || brandName,
          storeLogo: brandLogo,
          productImage: d.image || d.productImage || DEALS_CARD_ITEMS[0]?.productImage,
          price: d.price ? `₹${d.price.toString().replace(/[^0-9]/g, '')}` : '₹999',
          originalPrice: d.originalPrice ? `₹${d.originalPrice.toString().replace(/[^0-9]/g, '')}` : undefined,
          discountPercentage: d.discount || '20% OFF',
          ctaText: 'GRAB DEAL',
          ctaHref: `/product?id=${d.id || d._id}`
        })),
        ...filteredLiveLoots.map((l: any) => ({
          id: l.id || l._id,
          title: l.title,
          category: l.category || 'LOOT',
          store: l.storeName || brandName,
          storeLogo: brandLogo,
          productImage: l.image || l.productImage || DEALS_CARD_ITEMS[1]?.productImage,
          price: l.currentPrice ? `₹${l.currentPrice.toString().replace(/[^0-9]/g, '')}` : '₹499',
          originalPrice: l.originalPrice ? `₹${l.originalPrice.toString().replace(/[^0-9]/g, '')}` : undefined,
          discountPercentage: l.discount || '50% OFF',
          ctaText: 'GRAB LOOT',
          ctaHref: l.href || `/product?id=${l.id || l._id}`
        }))
      ];

      setLiveDeals(combinedDeals);

      const filteredLiveCoupons = coupons.filter(
        (c: any) =>
          c.store && (c.store.toLowerCase() === matchName || c.store.toLowerCase().includes(targetSlug) || targetSlug.includes(c.store.toLowerCase()))
      );
      setLiveCoupons(filteredLiveCoupons);
    } catch (err) {
      console.warn('MobileBrandPage fetch error:', err);
    }
  }, [brandSlug, brandName, brandLogo]);

  useEffect(() => {
    loadBrandData();
    window.addEventListener('wouchify_deals_updated', loadBrandData);
    window.addEventListener('wouchify_coupons_updated', loadBrandData);
    window.addEventListener('wouchify_stores_updated', loadBrandData);
    return () => {
      window.removeEventListener('wouchify_deals_updated', loadBrandData);
      window.removeEventListener('wouchify_coupons_updated', loadBrandData);
      window.removeEventListener('wouchify_stores_updated', loadBrandData);
    };
  }, [loadBrandData]);

  const handleCopyCode = (code: string, couponId?: string | number) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedCode(code)
    if (couponId || code) {
      adminApi.trackCouponClick(couponId || code);
    }
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Display deals
  const displayDeals: DealCardItem[] = useMemo(() => {
    if (liveDeals.length > 0) return liveDeals;
    return DEALS_CARD_ITEMS.slice(0, 4);
  }, [liveDeals]);

  const filteredDeals = useMemo(() => {
    if (activeFilter === 'Coupons') return []
    if (activeFilter === 'Loot') return displayDeals.filter(d => d.category.toLowerCase().includes('loot') || d.ctaText?.includes('LOOT'))
    if (activeFilter === '25%+') {
      return displayDeals.filter(d => {
        const num = parseInt(d.discountPercentage?.replace(/[^0-9]/g, '') || '0', 10);
        return num >= 25;
      });
    }
    return displayDeals
  }, [displayDeals, activeFilter])

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
              src={brandLogo}
              alt={brandName}
              className="mobile-brand__main-logo"
              width="140"
              height="36"
            />
          </div>

          <h1 className="mobile-brand__headline">
            {rewardText}
          </h1>

          <p className="mobile-brand__subtitle">
            Get verified deals, loot offers, and coupons from {brandName} with real-time rewards tracking.
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

            {/* Render dynamic coupons or default ticket */}
            {(liveCoupons.length > 0 ? liveCoupons : [{
              id: 'default-mobile-coupon',
              code: `${brandName.toUpperCase().replace(/[^A-Z0-9]/g, '') || 'WOUCH'}10`,
              discount: '10% Off',
              expiry: '3 days',
              minOrder: '499'
            }]).map((cpn: any, idx: number) => {
              const code = (cpn.code || `${brandName.toUpperCase()}10`).toUpperCase();
              const discountVal = (cpn.discount || '10%').replace(/off/i, '').trim();
              const isCopied = copiedCode === code;

              return (
                <div key={cpn.id || cpn._id || idx} className="mobile-coupon-ticket" style={{ marginBottom: liveCoupons.length > 1 ? 16 : 0 }}>
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

                  {/* Left Partition: Logo, Discount, Expiry & Min Order */}
                  <div className="mobile-coupon-left">
                    <div className="mobile-coupon-logo-box">
                      <img
                        src={brandLogo || amazonCouponLogo}
                        alt={brandName}
                        className="mobile-coupon-logo"
                        width="75"
                        height="22"
                      />
                    </div>

                    <div className="mobile-coupon-discount-wrap">
                      <span className="mobile-coupon-discount-val">{discountVal}</span>
                      <span className="mobile-coupon-discount-off">Off</span>
                    </div>

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
                        <span>{cpn.expiry ? `Expires: ${cpn.expiry}` : 'Expires in 3 days'}</span>
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
                        <span>Min Order: {cpn.minOrder || '499'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Partition: USE CODE, Pill, Copy Code */}
                  <div className="mobile-coupon-right">
                    <span className="mobile-coupon-use-code">USE CODE:</span>

                    <button
                      type="button"
                      className="mobile-coupon-code-pill"
                      onClick={() => handleCopyCode(code, cpn.id || cpn._id)}
                      title={`Click to copy ${code}`}
                    >
                      {code}
                    </button>

                    <button
                      type="button"
                      className="mobile-coupon-copy-btn"
                      onClick={() => handleCopyCode(code, cpn.id || cpn._id)}
                      aria-label="Copy coupon code"
                    >
                      <span className="mobile-coupon-copy-text">
                        {isCopied ? 'Copied! ✓' : 'Copy Code'}
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
              );
            })}
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
