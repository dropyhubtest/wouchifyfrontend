import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/adminApi'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import wouchifyWordmark from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import defaultAdFallback from '../../assets/advertisement/image-7.png'
import './AdvertisementSection.css'

export interface LiveAdItem {
  id: string
  title: string
  advertiser?: string
  imageUrl: string
  targetLink: string
  alt?: string
  ctaText?: string
  badgeText?: string
  placement?: string
  status?: string
}

export const AdvertisementSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [ads, setAds] = useState<LiveAdItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchActiveAdvertisements = async () => {
    try {
      const res = await adminApi.getPublicAdvertisements({ status: 'active' })
      if (Array.isArray(res) && res.length > 0) {
        // Map backend advertisements
        const liveItems: LiveAdItem[] = res.map((a: any, i: number) => ({
          id: a._id || a.id || `live-ad-${i}`,
          title: a.title || 'Wouchify Partner Promotion',
          advertiser: a.advertiser || 'Sponsored',
          imageUrl: a.imageUrl || defaultAdFallback,
          targetLink: a.targetLink || '/offers/sale',
          alt: a.title || 'Advertisement Banner',
          ctaText: a.ctaText || 'Learn More',
          badgeText: a.badgeText || 'SPONSORED',
          placement: a.placement,
          status: a.status
        }))
        setAds(liveItems)
      } else {
        // Fallback banner when no ads configured
        setAds([
          {
            id: 'default-wouchify-ad',
            title: 'Wouchify Sale & Cashback Bonanza',
            advertiser: 'Wouchify',
            imageUrl: defaultAdFallback,
            targetLink: '/deals',
            alt: 'Wouchify advertisement banner',
            ctaText: 'Explore Deals',
            badgeText: 'FEATURED'
          }
        ])
      }
    } catch (err) {
      console.warn('Failed to load live advertisements for Home Page:', err)
      setAds([
        {
          id: 'default-wouchify-ad',
          title: 'Wouchify Sale & Cashback Bonanza',
          advertiser: 'Wouchify',
          imageUrl: defaultAdFallback,
          targetLink: '/deals',
          alt: 'Wouchify advertisement banner',
          ctaText: 'Explore Deals',
          badgeText: 'FEATURED'
        }
      ])
    }
  }

  useEffect(() => {
    fetchActiveAdvertisements()

    // Real-time synchronization listeners
    const handleSync = () => {
      fetchActiveAdvertisements()
    }
    window.addEventListener('wouchify_advertisements_updated', handleSync)
    window.addEventListener('wouchify_ads_updated', handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('wouchify_advertisements_updated', handleSync)
      window.removeEventListener('wouchify_ads_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  // Auto-rotate if multiple active advertisements
  useEffect(() => {
    if (ads.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [ads.length])

  const handleAdClick = (ad: LiveAdItem) => {
    if (ad.id && !ad.id.startsWith('default-')) {
      adminApi.trackAdClick(ad.id).catch(console.warn)
    }
  }

  const currentAd = ads[currentIndex] || ads[0]

  return (
    <section
      className="advertisement-section"
      aria-label="Advertisement"
      style={
        {
          '--advertisement-scale': sectionScale,
          height: `${865 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 865 Reference Canvas */}
      <div className="advertisement-canvas">
        {/* Section Header with Navy Accent */}
        <div className="advertisement__header">
          <div className="advertisement__heading-accent" aria-hidden="true" />
          <h2 className="advertisement__title">Advertisement</h2>
        </div>

        {/* Advertisement Banner Container */}
        <div className="advertisement__container">
          {currentAd && (
            <a
              key={currentAd.id}
              href={currentAd.targetLink}
              target={currentAd.targetLink.startsWith('http') ? '_blank' : '_self'}
              rel={currentAd.targetLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={currentAd.title}
              className="advertisement__banner-link"
              onClick={() => handleAdClick(currentAd)}
            >
              <img
                className="advertisement__brand-logo"
                src={wouchifyWordmark}
                alt="Wouchify"
              />
              <img
                src={currentAd.imageUrl}
                alt={currentAd.alt || currentAd.title}
                className="advertisement__banner-image"
                width="1713"
                height="685"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = defaultAdFallback
                }}
              />
              {currentAd.badgeText && (
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 3
                  }}
                >
                  {currentAd.badgeText}
                </div>
              )}
            </a>
          )}

          {/* Dots Indicator if multiple active ads */}
          {ads.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 4
              }}
            >
              {ads.map((a, idx) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentIndex(idx)
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  style={{
                    width: idx === currentIndex ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: idx === currentIndex ? '#E31E25' : 'rgba(255,255,255,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdvertisementSection
