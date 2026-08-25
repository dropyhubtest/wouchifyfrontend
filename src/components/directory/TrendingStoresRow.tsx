import React from 'react'
import { TRENDING_STORES } from '../../data/storesDirectoryData'
import type { TrendingStore } from '../../data/storesDirectoryData'
import './TrendingStoresRow.css'

interface TrendingStoresRowProps {
  onStoreClick?: (store: TrendingStore) => void
}

export const TrendingStoresRow: React.FC<TrendingStoresRowProps> = ({ onStoreClick }) => {
  return (
    <section className="trending-stores-section" aria-label="Trending Stores">
      <div className="trending-stores-row">
        {TRENDING_STORES.map((store) => (
          <a
            key={store.id}
            href={store.href}
            className="trending-store-card"
            onClick={(e) => {
              if (onStoreClick) {
                e.preventDefault()
                onStoreClick(store)
              }
            }}
            title={store.name}
          >
            <div className="trending-store-card__logo-wrap">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="trending-store-card__logo"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-store-card__title">{store.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingStoresRow
