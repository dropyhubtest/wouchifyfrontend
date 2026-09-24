import React, { useState, useEffect } from 'react'
import wouchifyIcon from '../../assets/brand/wouchify-icon.png'
import { TOP_STORES } from '../../data/topStores'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getPublicStores } from '../../services/api'
import { getStoreLogo } from '../../data/dealsPage'
import './TopStoresSection.css'

export const TopStoresSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [stores, setStores] = useState<any[]>(TOP_STORES)

  useEffect(() => {
    getPublicStores().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter((s: any) => s.showOnHome !== false && (s.status === 'active' || !s.status))
        if (filtered.length > 0) {
          const merged = filtered.map((s: any, idx: number) => {
            const staticFallback = TOP_STORES.find(ts => ts.id === s.id || ts.slug === s.slug) || TOP_STORES[idx % TOP_STORES.length]
            return {
              ...staticFallback,
              id: s._id || s.id || staticFallback.id,
              name: s.name || staticFallback.name,
              rewardBadge: s.reward || staticFallback.rewardBadge,
              logo: s.logo || staticFallback.logo,
              href: s.href || staticFallback.href
            }
          })
          setStores(merged)
        }
      }
    }).catch(console.warn)
  }, [])

  return (
    <section
      className="top-stores-section"
      aria-label="Shop by top Stores"
      style={
        {
          '--stores-scale': sectionScale,
          height: `${493 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 493 Reference Canvas */}
      <div className="top-stores-canvas">
        {/* Section Header with Red Accent */}
        <div className="top-stores__header">
          <div className="top-stores__heading-accent" aria-hidden="true" />
          <h2 className="top-stores__title">Shop by top Stores</h2>
        </div>

        {/* Go to Stores CTA */}
        <a href="/stores" className="top-stores__cta">
          Go to Stores&gt;&gt;
        </a>

        {/* Promo Carousel Viewport */}
        <div className="top-stores__viewport">
          <div className="top-stores__track">
            {stores.map((store) => (
              <a
                key={store.id}
                onClick={() => adminApi.trackStoreClick(store.id)}
                href={store.href}
                className={`top-stores__tile top-stores__tile--${store.slug}`}
                aria-label={`Shop on ${store.name}`}
              >
                {/* 1. Background clean artwork image */}
                <img
                  src={store.bgImage}
                  alt={store.alt}
                  className="top-stores__bg-image"
                  width="398"
                  height="237"
                />

                {/* 2. Top Reward Badge */}
                <div
                  className={`top-stores__reward-badge top-stores__reward-badge--${store.badgePosition}`}
                >
                  {store.showWouchifyMiniLogo && (
                    <img
                      src={wouchifyIcon}
                      alt=""
                      className="top-stores__wouchify-logo-img"
                      aria-hidden="true"
                    />
                  )}
                  <span>{store.rewardBadge}</span>
                </div>

                {/* 3. Center Brand Logo Overlay */}
                <div className={`top-stores__brand-logo top-stores__brand-logo--${store.slug}`}>
                  {store.slug === 'ajio' && (
                    <div className="top-stores__ajio-brand">
                      <span className="top-stores__ajio-main">AJIO</span>
                      <span className="top-stores__ajio-dot">.</span>
                      <span className="top-stores__ajio-sub">COM</span>
                    </div>
                  )}
                  {store.slug === 'amazon' && (
                    <img
                      src={store.logo}
                      alt="Amazon"
                      className="top-stores__logo-img top-stores__logo-img--amazon"
                    />
                  )}
                  {store.slug === 'flipkart' && (
                    <img
                      src={store.logo}
                      alt="Flipkart"
                      className="top-stores__logo-img top-stores__logo-img--flipkart"
                    />
                  )}
                  {store.slug === 'firstcry' && (
                    <div className="top-stores__firstcry-wrapper">
                      <img
                        src={store.logo}
                        alt="FirstCry"
                        className="top-stores__logo-img top-stores__logo-img--firstcry"
                      />
                    </div>
                  )}
                  {!['ajio', 'amazon', 'flipkart', 'firstcry'].includes(store.slug) && (
                    <img
                      src={store.logo || getStoreLogo(store.name)}
                      alt={store.name}
                      className="top-stores__logo-img"
                      style={{ maxHeight: '48px', maxWidth: '140px', objectFit: 'contain' }}
                      onError={(e) => {
                        const target = e.currentTarget
                        const fallback = getStoreLogo(store.name)
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                  )}
                </div>

                {/* 4. Bottom CTA Button */}
                <div
                  className={`top-stores__cta-badge top-stores__cta-badge--${store.ctaPosition}`}
                >
                  <span className="top-stores__visit-text">Visit Store &gt;&gt;</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default TopStoresSection
