import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Deal {
  id: string
  title: string
  store: string
  discount: string
  originalPrice: string
  sellingPrice: string
  status: 'active' | 'inactive'
}

const mockDeals: Deal[] = [
  { id: '1', title: 'Nike Air Max 2024', store: 'Nike', discount: '40% OFF', originalPrice: '₹10,000', sellingPrice: '₹6,000', status: 'active' },
  { id: '2', title: 'Samsung Galaxy S24 Ultra', store: 'Amazon', discount: 'Flat ₹15,000 OFF', originalPrice: '₹1,29,999', sellingPrice: '₹1,14,999', status: 'active' },
  { id: '3', title: 'Sony WH-1000XM5 Headphones', store: 'Flipkart', discount: '30% OFF', originalPrice: '₹29,990', sellingPrice: '₹20,990', status: 'inactive' },
  { id: '4', title: 'Puma Running Shoes', store: 'Myntra', discount: 'Min 50% OFF', originalPrice: '₹5,999', sellingPrice: '₹2,999', status: 'active' },
]

export const ExecutiveDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const handleAddDeal = () => {
    setEditingDeal(null)
    setIsModalOpen(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setIsModalOpen(true)
  }

  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDeal(null)
  }

  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.store.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="deals">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Deals</h2>
          <button className="crud-add-btn" onClick={handleAddDeal}>
            <Plus size={18} /> Add New Deal
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search deals by title or store..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Deal Title</th>
                <th>Store</th>
                <th>Discount</th>
                <th>Original Price</th>
                <th>Selling Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => (
                <tr key={deal.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{deal.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {deal.id}</div>
                  </td>
                  <td>{deal.store}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 600 }}>{deal.discount}</span></td>
                  <td style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{deal.originalPrice}</td>
                  <td style={{ fontWeight: 600 }}>{deal.sellingPrice}</td>
                  <td>
                    <span className={`status-badge ${deal.status}`}>
                      {deal.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditDeal(deal)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteDeal(deal.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No deals found matching your search.
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
                <h3 className="modal-title">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Deal Title</label>
                    <input type="text" placeholder="e.g., Nike Air Max 2024" defaultValue={editingDeal?.title} />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Store</label>
                      <select defaultValue={editingDeal?.store || ''}>
                        <option value="" disabled>Select Store</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Myntra">Myntra</option>
                        <option value="Nike">Nike</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Discount Text</label>
                      <input type="text" placeholder="e.g., 40% OFF" defaultValue={editingDeal?.discount} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Original Price (₹)</label>
                      <input type="text" placeholder="10,000" defaultValue={editingDeal?.originalPrice} />
                    </div>
                    <div className="form-group">
                      <label>Selling Price (₹)</label>
                      <input type="text" placeholder="6,000" defaultValue={editingDeal?.sellingPrice} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Affiliate URL</label>
                    <input type="url" placeholder="https://..." />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select defaultValue={editingDeal?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Deal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
