import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Coupon {
  id: string
  title: string
  store: string
  code: string
  discount: string
  expiryDate: string
  status: 'active' | 'inactive'
}

const mockCoupons: Coupon[] = [
  { id: '1', title: 'Flat 50% Off on First Order', store: 'Swiggy', code: 'WELCOME50', discount: '50% OFF', expiryDate: '2026-12-31', status: 'active' },
  { id: '2', title: '₹500 Off on Electronics', store: 'Amazon', code: 'ELEC500', discount: '₹500 OFF', expiryDate: '2026-10-15', status: 'active' },
  { id: '3', title: 'Buy 1 Get 1 Free', store: 'Myntra', code: 'BOGO', discount: 'BOGO', expiryDate: '2026-09-30', status: 'inactive' },
]

export const ExecutiveCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  const handleAddCoupon = () => {
    setEditingCoupon(null)
    setIsModalOpen(true)
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCoupon(null)
  }

  const filteredCoupons = coupons.filter(coupon => 
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="coupons">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Coupons</h2>
          <button className="crud-add-btn" onClick={handleAddCoupon}>
            <Plus size={18} /> Add New Coupon
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search coupons by title, store or code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Coupon Details</th>
                <th>Store</th>
                <th>Code</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{coupon.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {coupon.id}</div>
                  </td>
                  <td>{coupon.store}</td>
                  <td>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '1px' }}>
                      {coupon.code}
                    </span>
                  </td>
                  <td><span style={{ color: '#10b981', fontWeight: 600 }}>{coupon.discount}</span></td>
                  <td>{coupon.expiryDate}</td>
                  <td>
                    <span className={`status-badge ${coupon.status}`}>
                      {coupon.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditCoupon(coupon)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteCoupon(coupon.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No coupons found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="crud-modal-overlay">
            <div className="crud-modal">
              <div className="modal-header">
                <h3 className="modal-title">{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Coupon Title</label>
                    <input type="text" placeholder="e.g., Flat 50% Off" defaultValue={editingCoupon?.title} />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Store</label>
                      <select defaultValue={editingCoupon?.store || ''}>
                        <option value="" disabled>Select Store</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Myntra">Myntra</option>
                        <option value="Swiggy">Swiggy</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Coupon Code</label>
                      <input type="text" placeholder="e.g., WELCOME50" defaultValue={editingCoupon?.code} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Discount</label>
                      <input type="text" placeholder="e.g., 50% OFF" defaultValue={editingCoupon?.discount} />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="date" defaultValue={editingCoupon?.expiryDate} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select defaultValue={editingCoupon?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Coupon</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
