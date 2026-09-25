import React, { useState, useEffect } from 'react'
import wouchifyIcon from '../../assets/brand/wouchify-icon.png'
import { TOP_STORES } from '../../data/topStores'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import './TopStoresSection.css'

export const TopStoresSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [stores, setStores] = useState<any[]>(TOP_STORES)

  const loadStores = async () => {
    try {
      const data = await adminApi.getStores({ all: true })
      if (Array.isArray(data) && data.length > 0) {
        const hiddenSet = new Set(
          data
            .filter((s: any) => s.showOnHome === false || s.sectionPlacement === 'none' || s.status === 'inactive')
            .map((s: any) => (s.name || s.slug || '').toLowerCase().trim())
        )

        const visibleDefaults = TOP_STORES.filter(
          (item) => !hiddenSet.has(item.name.toLowerCase().trim()) && !hiddenSet.has((item.slug || '').toLowerCase().trim())
        )

        const merged = visibleDefaults.map((staticFallback) => {
          const liveMatch = data.find((s: any) =>
            (s.name || '').toLowerCase().trim() === staticFallback.name.toLowerCase().trim() ||
            s.slug === staticFallback.slug
          )
          if (liveMatch) {
            return {
              ...staticFallback,
              id: liveMatch._id || liveMatch.id || staticFallback.id,
              name: liveMatch.name || staticFallback.name,
              rewardBadge: liveMatch.reward || staticFallback.rewardBadge,
              logo: liveMatch.logo || staticFallback.logo,
              href: liveMatch.href || staticFallback.href
            }
          }
          return staticFallback
        })
        setStores(merged)
      }
    } catch (err) {
      console.warn('Could not sync live top stores:', err)
    }
  }

  useEffect(() => {
    loadStores()
    const handleUpdate = () => loadStores()
    window.addEventListener('wouchify_stores_updated', handleUpdate)
    return () => window.removeEventListener('wouchify_stores_updated', handleUpdate)
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
                        target.onerror = null
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
