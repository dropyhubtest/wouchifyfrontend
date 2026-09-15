import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { FAVOURITE_STORES } from '../../../../data/storesHero'
import { IconClose } from '../icons'

interface AddCouponModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  newCoupon: {
    code: string
    store: string
    discount: string
    category: string
    usageLimit: number
    expiry: string
  }
  setNewCoupon: React.Dispatch<React.SetStateAction<any>>
}

export const AddCouponModal: React.FC<AddCouponModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newCoupon,
  setNewCoupon
}) => {
  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Verified Coupon Code</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>Coupon Code</label>
            <input
              type="text"
              placeholder="e.g. FESTIVAL50"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>Partner Store</label>
              <CustomDropdown
                value={newCoupon.store}
                onChange={(val) => setNewCoupon({ ...newCoupon, store: val })}
                options={FAVOURITE_STORES.map((s) => ({ value: s.name, label: s.name }))}
                variant="admin"
              />
            </div>

            <div className="form-group">
              <label>Discount Value</label>
              <input
                type="text"
                placeholder="e.g. 30% OFF"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Activate Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
