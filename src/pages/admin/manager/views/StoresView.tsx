import React from 'react'
import { IconExternal } from '../icons'
import type { StoreItem } from '../../../../data/storesHero'

interface StoresViewProps {
  filteredStores: StoreItem[]
  onOpenBulkImport?: () => void
}

export const StoresView: React.FC<StoresViewProps> = ({ filteredStores, onOpenBulkImport }) => {
  return (
    <div className="view-stores-admin">
      {onOpenBulkImport && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="results-count">Total: {filteredStores.length} Partner Stores</span>
          <button
            type="button"
            className="btn-bulk-import-trigger"
            onClick={onOpenBulkImport}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)'
            }}
          >
            🏪 Bulk Import Stores (Excel / CSV)
          </button>
        </div>
      )}

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
