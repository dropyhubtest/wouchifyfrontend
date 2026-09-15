import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { IconTrash } from '../icons'
import type { DealItem } from '../types'

interface DealsManagementViewProps {
  deals: DealItem[]
  filteredDeals: DealItem[]
  dealCategoryFilter: string
  setDealCategoryFilter: (category: string) => void
  dealStatusFilter: string
  setDealStatusFilter: (status: string) => void
  onToggleDealStatus: (dealId: number | string) => void
  onDeleteDeal: (dealId: number | string) => void
  getStoreLogo: (storeName: string) => string | null
}

export const DealsManagementView: React.FC<DealsManagementViewProps> = ({
  deals,
  filteredDeals,
  dealCategoryFilter,
  setDealCategoryFilter,
  dealStatusFilter,
  setDealStatusFilter,
  onToggleDealStatus,
  onDeleteDeal,
  getStoreLogo
}) => {
  return (
    <div className="view-deals-admin">
      <div className="admin-table-section">
        <div className="table-toolbar">
          <div className="table-filter-pills">
            <label className="toolbar-filter-label" htmlFor="deal-cat-select">Category:</label>
            <CustomDropdown
              id="deal-cat-select"
              value={dealCategoryFilter}
              onChange={(val: string) => setDealCategoryFilter(val)}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Fashion', label: 'Fashion' },
                { value: 'Food', label: 'Food & Dining' },
                { value: 'Grocery', label: 'Grocery' },
                { value: 'Beauty', label: 'Beauty & Personal Care' }
              ]}
              variant="admin"
              size="sm"
            />

            <label className="toolbar-filter-label" htmlFor="deal-stat-select" style={{ marginLeft: '12px' }}>Status:</label>
            <CustomDropdown
              id="deal-stat-select"
              value={dealStatusFilter}
              onChange={(val: string) => setDealStatusFilter(val)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'active', label: 'Active Only' },
                { value: 'pending', label: 'Pending Review' },
                { value: 'expired', label: 'Expired' }
              ]}
              variant="admin"
              size="sm"
            />
          </div>

          <span className="results-count">
            Showing {filteredDeals.length} of {deals.length} deals
          </span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deal Title & Product</th>
                <th>Store Partner</th>
                <th>Category</th>
                <th>Price</th>
                <th>Original</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => {
                const logoUrl = getStoreLogo(deal.store)
                return (
                  <tr key={deal.id}>
                    <td className="deal-name-cell">
                      <span className="deal-title">{deal.name}</span>
                      <span className="deal-sub">ID: #{deal.id}</span>
                    </td>
                    <td>
                      <div className="table-store-pill">
                        {logoUrl && <img src={logoUrl} alt={deal.store} className="table-store-logo" />}
                        <span>{deal.store}</span>
                      </div>
                    </td>
                    <td><span className="category-chip">{deal.category}</span></td>
                    <td><strong className="deal-price">{deal.price}</strong></td>
                    <td><span className="deal-original-price">{deal.originalPrice || '—'}</span></td>
                    <td><span className="discount-badge">{deal.discount}</span></td>
                    <td>
                      <button
                        type="button"
                        className={`status-switch ${deal.status === 'active' ? 'active' : 'paused'}`}
                        onClick={() => onToggleDealStatus(deal.id)}
                        title="Click to toggle status"
                      >
                        <span className="switch-track"><span className="switch-thumb" /></span>
                        <span className="switch-text">{deal.status === 'active' ? 'Active' : 'Pending'}</span>
                      </button>
                    </td>
                    <td><span className="expiry-text">{deal.expiry}</span></td>
                    <td>
                      <div className="action-btns">
                        <button
                          type="button"
                          className="table-delete-btn"
                          onClick={() => onDeleteDeal(deal.id)}
                          title="Delete Deal"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
