import React from 'react'
import type { StoreItem } from '../../data/storesHero'
import './StoreCard.css'

interface StoreCardProps {
  store: StoreItem
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <div
      className="store-card"
      style={{ '--card-bg': store.cardBg, '--badge-bg': store.badgeBg } as React.CSSProperties}
    >
      {/* Logo panel centered at top */}
      <div 
        className="store-card__logo-panel"
        style={store.logoPanelBg ? { backgroundColor: store.logoPanelBg } : undefined}
      >
        <img
          src={store.logo}
          alt={`${store.name} logo`}
          className={`store-card__logo-img store-card__logo-img--${store.id}`}
          loading="lazy"
        />
      </div>

      {/* Category label (e.g. FASHION, GROCERY, E-COMMERCE) placed at TOP above company name */}
      <span className="store-card__category">{store.category.toUpperCase()}</span>

      {/* Company name placed below category */}
      <h3 className="store-card__name">{store.name}</h3>

      {/* Reward badge */}
      <div className="store-card__reward">{store.reward}</div>

      {/* Description */}
      <p className="store-card__description">{store.description}</p>

      {/* View Details button positioned on the right side */}
      <a href={`#store-${store.slug}`} className="store-card__details-btn">
        View Details &gt;&gt;
      </a>
    </div>
  )
}

export default StoreCard
