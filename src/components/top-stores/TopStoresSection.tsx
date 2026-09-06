import React from 'react'
import wouchifyIcon from '../../assets/brand/wouchify-icon.png'
import { TOP_STORES } from '../../data/topStores'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './TopStoresSection.css'

export const TopStoresSection: React.FC = () => {
  const sectionScale = useDesktopScale()

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
            {TOP_STORES.map((store) => (
              <a
                key={store.id}
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
