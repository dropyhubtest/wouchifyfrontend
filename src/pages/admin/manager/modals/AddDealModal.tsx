import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { FAVOURITE_STORES } from '../../../../data/storesHero'
import { IconClose } from '../icons'

interface AddDealModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  newDeal: {
    name: string
    store: string
    category: string
    price: string
    originalPrice: string
    discount: string
    expiry: string
    status: 'active' | 'pending' | 'expired'
    productImage: string
    ctaText: string
    ctaHref: string
    dealTag: string
    isBestSelling: boolean
    sectionPlacement: 'favourite' | 'best_selling' | 'both'
  }
  setNewDeal: React.Dispatch<React.SetStateAction<any>>
}

export const AddDealModal: React.FC<AddDealModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newDeal,
  setNewDeal
}) => {
  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Add New Promotional Deal</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7E86B8' }}>
              Provide all details to render high-conversion promotional cards on the live Deals storefront.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>Deal Title / Product Name <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g. Apple iPhone 16 Pro (128 GB) - Natural Titanium"
              value={newDeal.name}
              onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
              required
            />
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>Partner Store</label>
              <CustomDropdown
                value={newDeal.store}
                onChange={(val) => setNewDeal({ ...newDeal, store: val })}
                options={FAVOURITE_STORES.map((s) => ({ value: s.name, label: s.name }))}
                variant="admin"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <CustomDropdown
                value={newDeal.category}
                onChange={(val) => setNewDeal({ ...newDeal, category: val })}
                options={[
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Fashion', label: 'Fashion' },
                  { value: 'Food', label: 'Food & Dining' },
                  { value: 'Grocery', label: 'Grocery' },
                  { value: 'Beauty', label: 'Beauty & Personal Care' },
                  { value: 'Home', label: 'Home & Living' }
                ]}
                variant="admin"
              />
            </div>
          </div>

          <div className="modal-form-row modal-form-row--3">
            <div className="form-group">
              <label>Offer Price (₹) <span className="req">*</span></label>
              <input
                type="text"
                placeholder="e.g. 18990"
                value={newDeal.price}
                onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Original MRP (₹)</label>
              <input
                type="text"
                placeholder="e.g. 24900"
                value={newDeal.originalPrice}
                onChange={(e) => setNewDeal({ ...newDeal, originalPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Discount Badge</label>
              <input
                type="text"
                placeholder="e.g. 25% OFF"
                value={newDeal.discount}
                onChange={(e) => setNewDeal({ ...newDeal, discount: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Deal Live 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
