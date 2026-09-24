import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/adminApi'
import wouchifyWordmark from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import defaultMobileAdFallback from '../../assets/advertisement/image-7.png'
import './MobileAdvertisement.css'

export interface MobileAdItem {
  id: string
  title: string
  image: string
  alt: string
  href: string
}

const MobileAdvertisementCard: React.FC<{ advertisement: MobileAdItem }> = ({
  advertisement,
}) => {
  const handleClick = () => {
    if (advertisement.id && !advertisement.id.startsWith('default-')) {
      adminApi.trackAdClick(advertisement.id).catch(console.warn)
    }
  }

  return (
    <a
      href={advertisement.href}
      target={advertisement.href.startsWith('http') ? '_blank' : '_self'}
      rel={advertisement.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="mobile-advertisement__link"
      aria-label={advertisement.title}
      onClick={handleClick}
    >
      <img
        className="mobile-advertisement__brand-logo"
        src={wouchifyWordmark}
        alt="Wouchify"
      />
      <img
        src={advertisement.image}
        alt={advertisement.alt}
        className="mobile-advertisement__image"
        loading="lazy"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src = defaultMobileAdFallback
        }}
      />
    </a>
  )
}

export const MobileAdvertisement: React.FC = () => {
  const [ads, setAds] = useState<MobileAdItem[]>([])

  const fetchMobileAds = async () => {
    try {
      const res = await adminApi.getPublicAdvertisements({ status: 'active' })
      if (Array.isArray(res) && res.length > 0) {
        const mapped: MobileAdItem[] = res
          .filter((a: any) => a.showOnHome !== false)
          .map((a: any, i: number) => ({
            id: a._id || a.id || `mob-ad-${i}`,
            title: a.title || 'Wouchify Sale',
            image: a.imageUrl || defaultMobileAdFallback,
            alt: a.title || 'Advertisement banner',
            href: a.targetLink || '/offers/sale',
          }))
        setAds(mapped)
      } else {
        setAds([
          {
            id: 'default-mobile-ad',
            title: 'Wouchify Sale',
            image: defaultMobileAdFallback,
            alt: 'Wouchify sale advertisement banner',
            href: '/offers/sale',
          }
        ])
      }
    } catch {
      setAds([
        {
          id: 'default-mobile-ad',
          title: 'Wouchify Sale',
          image: defaultMobileAdFallback,
          alt: 'Wouchify sale advertisement banner',
          href: '/offers/sale',
        }
      ])
    }
  }

  useEffect(() => {
    fetchMobileAds()

    const handleSync = () => { fetchMobileAds() }
    window.addEventListener('wouchify_advertisements_updated', handleSync)
    window.addEventListener('wouchify_ads_updated', handleSync)
    window.addEventListener('storage', handleSync)

    return () => {
      window.removeEventListener('wouchify_advertisements_updated', handleSync)
      window.removeEventListener('wouchify_ads_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  return (
    <section className="mobile-advertisement" aria-label="Advertisement">
      {ads.map((ad) => (
        <MobileAdvertisementCard key={ad.id} advertisement={ad} />
      ))}
    </section>
  )
}

export default MobileAdvertisement
