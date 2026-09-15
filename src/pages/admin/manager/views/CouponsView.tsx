import React from 'react'
import { IconCopy } from '../icons'
import type { CouponItem } from '../types'

interface CouponsViewProps {
  filteredCoupons: CouponItem[]
  copiedCode: string | null
  onCopyCode: (code: string) => void
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  filteredCoupons,
  copiedCode,
  onCopyCode
}) => {
  return (
    <div className="view-coupons-admin">
      <div className="coupons-grid">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="coupon-admin-card">
            <div className="coupon-card-header">
              <div className="coupon-code-pill" onClick={() => onCopyCode(coupon.code)}>
                <strong>{copiedCode === coupon.code ? 'Copied!' : coupon.code}</strong>
                <IconCopy />
              </div>
              <span className="discount-badge">{coupon.discount}</span>
            </div>
            <div className="coupon-card-details">
              <div>Store: <strong>{coupon.store}</strong></div>
              <div>Category: <span>{coupon.category}</span></div>
              <div>Usage: <strong>{coupon.usageCount} / {coupon.usageLimit}</strong></div>
              <div>Valid Till: <span>{coupon.expiry}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
