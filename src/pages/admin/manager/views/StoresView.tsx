import React from 'react'
import { IconExternal } from '../icons'
import type { StoreItem } from '../../../../data/storesHero'

interface StoresViewProps {
  filteredStores: StoreItem[]
}

export const StoresView: React.FC<StoresViewProps> = ({ filteredStores }) => {
  return (
    <div className="view-stores-admin">
      <div className="stores-grid">
        {filteredStores.map((store) => (
          <div key={store.id} className="store-admin-card">
            <div className="store-card-top">
              <div className="store-logo-wrapper">
                <img src={store.logo} alt={store.name} className="store-admin-logo" />
              </div>
              <span className="store-reward-tag">{store.reward}</span>
            </div>
            <div className="store-card-body">
              <h4>{store.name}</h4>
              <p className="store-admin-cat">{store.category}</p>
              <p className="store-admin-desc">{store.description}</p>
            </div>
            <div className="store-card-footer">
              <span className="store-status-active">● Active Partner</span>
              <a href={store.slug} className="store-view-btn" target="_blank" rel="noreferrer">
                View Deals <IconExternal />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
