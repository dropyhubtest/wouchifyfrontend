import React from 'react'
import type { StoreItem } from '../../data/storesHero'
import { FAVOURITE_STORES } from '../../data/storesHero'
import { getStoreLogo } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import './StoreCard.css'

interface StoreCardProps {
  store: StoreItem
}

const STORE_COLOR_PALETTES = [
  { cardBg: '#ECF4FF', badgeBg: '#D3E0F2' }, // Ice blue
  { cardBg: '#FFE6D3', badgeBg: '#FFB67C' }, // Peach orange
  { cardBg: '#EFFFBF', badgeBg: '#D1F170' }, // Lime green
  { cardBg: '#FFEDF8', badgeBg: '#FCA7E1' }, // Pink lavender
  { cardBg: '#E8F5FF', badgeBg: '#B3DCFA' }, // Sky blue
  { cardBg: '#FFDCDE', badgeBg: '#FFB0B4' }, // Coral rose
  { cardBg: '#FFE3F9', badgeBg: '#FFB0EA' }, // Magenta
  { cardBg: '#FFF0BF', badgeBg: '#FFE07A' }, // Soft yellow
  { cardBg: '#FFD9E8', badgeBg: '#FFB0C8' }, // Rose pink
  { cardBg: '#FFDED9', badgeBg: '#FFB5AB' }, // Warm terra
  { cardBg: '#DFF4FF', badgeBg: '#A8E0FF' }, // Aqua
  { cardBg: '#F0D3FF', badgeBg: '#DCA8FF' }, // Lilac purple
  { cardBg: '#FFCFC8', badgeBg: '#FFA89D' }, // Peach
  { cardBg: '#FFD5E1', badgeBg: '#FFAAC0' }, // Flamingo
]

function getStoreColorPalette(storeName: string, slug?: string) {
  const key = (storeName || slug || 'store').toLowerCase()
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % STORE_COLOR_PALETTES.length
  return STORE_COLOR_PALETTES[idx]
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const handleClick = () => {
    adminApi.trackStoreClick(store.id || store.slug || store.name)
  }

  // Lookup original store definition to guarantee original Figma styles (cardBg, badgeBg, logoPanelBg, logo)
  const orig = FAVOURITE_STORES.find(
    (s) => s.id === store.id || s.slug === store.slug || s.name.toLowerCase() === (store.name || '').toLowerCase()
  )

  const defaultPalette = getStoreColorPalette(store.name || '', store.slug)
  const cardBg = store.cardBg || orig?.cardBg || defaultPalette.cardBg
  const badgeBg = store.badgeBg || orig?.badgeBg || defaultPalette.badgeBg
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
            const img = e.currentTarget as HTMLImageElement
            img.onerror = null
            img.src = getStoreLogo(slug || name)
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
