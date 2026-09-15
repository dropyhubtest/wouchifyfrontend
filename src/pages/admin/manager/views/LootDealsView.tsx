import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { IconTrash } from '../icons'
import type { LootDealAdminItem } from '../types'

interface LootDealsViewProps {
  filteredLootDeals: LootDealAdminItem[]
  lootDealTypeFilter: 'All' | 'flash' | 'exclusive'
  setLootDealTypeFilter: (filter: 'All' | 'flash' | 'exclusive') => void
  onToggleLootDealStatus: (dealId: number | string) => void
  onDeleteLootDeal: (dealId: number | string) => void
}

export const LootDealsView: React.FC<LootDealsViewProps> = ({
  filteredLootDeals,
  lootDealTypeFilter,
  setLootDealTypeFilter,
  onToggleLootDealStatus,
  onDeleteLootDeal
}) => {
  return (
    <div className="view-loot-admin">
      <div className="admin-table-section">
        <div className="table-toolbar">
          <div className="table-filter-pills">
            <label className="toolbar-filter-label" htmlFor="loot-type-select">Loot Type:</label>
            <CustomDropdown
              id="loot-type-select"
              value={lootDealTypeFilter}
              onChange={(val: string) => setLootDealTypeFilter(val as any)}
              options={[
                { value: 'All', label: 'All Loot Types' },
                { value: 'flash', label: '⚡ Flash Loot' },
                { value: 'exclusive', label: '💎 Exclusive Loot' }
              ]}
              variant="admin"
              size="sm"
            />
          </div>
          <span className="results-count">Showing {filteredLootDeals.length} loot promotions</span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Store Partner</th>
                <th>Category</th>
                <th>Current Price</th>
                <th>Original</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLootDeals.map((deal) => (
                <tr key={deal.id}>
                  <td><strong>{deal.title}</strong></td>
                  <td><span className="table-store-pill">{deal.storeName}</span></td>
                  <td><span className="category-chip">{deal.category}</span></td>
                  <td><strong className="deal-price">{deal.currentPrice}</strong></td>
                  <td><span className="deal-original-price">{deal.originalPrice}</span></td>
                  <td><span className="discount-badge">{deal.discount}</span></td>
                  <td>
                    <span className={`badge-pill ${deal.dealType === 'flash' ? 'danger' : 'purple'}`}>
                      {deal.dealType === 'flash' ? '⚡ Flash Loot' : '💎 Exclusive'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`status-switch ${deal.status === 'active' ? 'active' : 'paused'}`}
                      onClick={() => onToggleLootDealStatus(deal.id)}
                      title="Click to toggle status"
                    >
                      <span className="switch-track"><span className="switch-thumb" /></span>
                      <span className="switch-text">{deal.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        type="button"
                        className="table-delete-btn"
                        onClick={() => onDeleteLootDeal(deal.id)}
                        title="Delete Loot Deal"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
