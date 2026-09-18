import React from 'react'
import type { StoreItem } from '../../data/storesHero'
import { FAVOURITE_STORES } from '../../data/storesHero'
import { getStoreLogo } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import './StoreCard.css'

interface StoreCardProps {
  store: StoreItem
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const handleClick = () => {
    adminApi.trackStoreClick(store.id || store.slug || store.name)
  }

  // Lookup original store definition to guarantee original Figma styles (cardBg, badgeBg, logoPanelBg, logo)
  const orig = FAVOURITE_STORES.find(
    (s) => s.id === store.id || s.slug === store.slug || s.name.toLowerCase() === (store.name || '').toLowerCase()
  )

  const cardBg = store.cardBg || orig?.cardBg || '#ECF4FF'
  const badgeBg = store.badgeBg || orig?.badgeBg || '#D3E0F2'
  const logoPanelBg = store.logoPanelBg || orig?.logoPanelBg
  const rawLogo = store.logo && !store.logo.includes('clearbit.com') ? store.logo : ''
  const logoSrc = orig?.logo || rawLogo || (store as any).logoUrl || getStoreLogo(store.slug || store.name)
  const storeId = store.id || orig?.id || 'store'
  const category = store.category || orig?.category || 'FASHION'
  const name = store.name || orig?.name || 'Store'
  const reward = store.reward || orig?.reward || 'Upto 5% rewards'
  const description = store.description || orig?.description || `${name} online deals & cashback`
  const slug = store.slug || orig?.slug || name.toLowerCase().replace(/\s+/g, '-')

  return (
    <div
      className="store-card"
      style={{ '--card-bg': cardBg, '--badge-bg': badgeBg } as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Logo panel centered at top */}
      <div 
        className="store-card__logo-panel"
        style={logoPanelBg ? { backgroundColor: logoPanelBg } : undefined}
      >
        <img
          src={logoSrc}
          alt={`${name} logo`}
          className={`store-card__logo-img store-card__logo-img--${storeId}`}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getStoreLogo(slug || name)
          }}
        />
      </div>

      {/* Category label (e.g. FASHION, GROCERY, E-COMMERCE) placed at TOP above company name */}
      <span className="store-card__category">{category.toUpperCase()}</span>

      {/* Company name placed below category */}
      <h3 className="store-card__name">{name}</h3>

      {/* Reward badge */}
      <div className="store-card__reward">{reward}</div>

      {/* Description */}
      <p className="store-card__description">{description}</p>

      {/* View Details button positioned on the right side */}
      <a 
        href={`/brands/${slug}`} 
        className="store-card__details-btn"
        onClick={(e) => {
          e.stopPropagation()
          handleClick()
        }}
      >
        View Details &gt;&gt;
      </a>
    </div>
  )
}

export default StoreCard
