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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
