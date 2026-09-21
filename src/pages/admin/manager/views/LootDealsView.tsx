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
  onOpenBulkImport?: () => void
}

export const LootDealsView: React.FC<LootDealsViewProps> = ({
  filteredLootDeals,
  lootDealTypeFilter,
  setLootDealTypeFilter,
  onToggleLootDealStatus,
  onDeleteLootDeal,
  onOpenBulkImport
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

            {onOpenBulkImport && (
              <button
                type="button"
                className="btn-bulk-import-trigger"
                onClick={onOpenBulkImport}
                style={{
                  marginLeft: '12px',
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
                ⚡ Bulk Import Loot (Excel / CSV)
              </button>
            )}
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
                <th>Approval & Workflow</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLootDeals.map((deal) => {
                const isScheduled = (deal as any).publishAt && new Date((deal as any).publishAt).getTime() > Date.now()
                const approver = (deal as any).approvedByName || (deal as any).approvedBy || ((deal as any).opsManagerApproval === 'Approved' ? 'Operational Manager' : ((deal as any).managerApproval === 'Approved' ? 'Manager' : (deal.status === 'active' ? 'Verified Catalog' : null)))
                const approverRole = (deal as any).approvedByRole || (approver?.includes('manager@') && !approver?.includes('ops') ? 'Manager' : 'Operations')
                const approvedTime = (deal as any).approvedAt ? new Date((deal as any).approvedAt).toLocaleDateString() : null

                return (
                  <tr key={deal.id}>
                    <td>
                      <strong>{deal.title}</strong>
                      {isScheduled && (
                        <span
                          style={{
                            marginLeft: '8px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          ⏳ Scheduled
                        </span>
                      )}
                    </td>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {approver ? (
                          <>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>
                              ✓ Approved by {approverRole}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {approver} {approvedTime ? `(${approvedTime})` : ''}
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ea580c' }}>
                            ⏳ Pending Review
                          </span>
                        )}
                      </div>
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
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
