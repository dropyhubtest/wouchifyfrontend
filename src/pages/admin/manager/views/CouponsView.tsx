import React from 'react'
import { IconCopy } from '../icons'
import type { CouponItem } from '../types'

interface CouponsViewProps {
  filteredCoupons: CouponItem[]
  copiedCode: string | null
  onCopyCode: (code: string) => void
  onOpenBulkImport?: () => void
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  filteredCoupons,
  copiedCode,
  onCopyCode,
  onOpenBulkImport
}) => {
  return (
    <div className="view-coupons-admin">
      {onOpenBulkImport && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="results-count">Total: {filteredCoupons.length} Active Coupons</span>
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
            🎟️ Bulk Import Coupons (Excel / CSV)
          </button>
        </div>
      )}

      <div className="coupons-grid">
        {filteredCoupons.map((coupon) => {
          const isScheduled = (coupon as any).publishAt && new Date((coupon as any).publishAt).getTime() > Date.now()
          return (
            <div key={coupon.id} className="coupon-admin-card">
              <div className="coupon-card-header">
                <div className="coupon-code-pill" onClick={() => onCopyCode(coupon.code)}>
                  <strong>{copiedCode === coupon.code ? 'Copied!' : coupon.code}</strong>
                  <IconCopy />
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isScheduled && (
                    <span
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      ⏳ Scheduled
                    </span>
                  )}
                  <span className="discount-badge">{coupon.discount}</span>
                </div>
              </div>
              <div className="coupon-card-details">
                <div>Store: <strong>{coupon.store}</strong></div>
                <div>Category: <span>{coupon.category}</span></div>
                <div>Usage: <strong>{coupon.usageCount || 0} / {coupon.usageLimit || 5000}</strong></div>
                <div>Valid Till: <span>{coupon.expiry || (coupon as any).expiresAt || 'No Expiry'}</span></div>
                {(() => {
                  const approver = (coupon as any).approvedByName || (coupon as any).approvedBy || ((coupon as any).opsManagerApproval === 'Approved' ? 'Operational Manager' : ((coupon as any).managerApproval === 'Approved' ? 'Manager' : (coupon.status === 'active' ? 'Verified Catalog' : null)))
                  const approverRole = (coupon as any).approvedByRole || (approver?.includes('manager@') && !approver?.includes('ops') ? 'Manager' : 'Operational Manager')
                  return (
                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Workflow:</span>
                      {approver ? (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: '#ecfdf5',
                          color: '#059669',
                          border: '1px solid #a7f3d0',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          ✓ {approverRole}: {approver.split('@')[0]}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          ⏳ Pending Review
                        </span>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
