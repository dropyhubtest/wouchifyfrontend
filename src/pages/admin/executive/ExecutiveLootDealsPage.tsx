import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X, Clock } from 'lucide-react'
import './ExecutiveShared.css'

interface LootDeal {
  id: string
  title: string
  store: string
  discount: string
  originalPrice: string
  sellingPrice: string
  expiresAt: string
  status: 'active' | 'expired'
}

const mockLootDeals: LootDeal[] = [
  { id: '1', title: 'Apple iPhone 15 Pro Max', store: 'Amazon', discount: 'Flat ₹25,000 OFF', originalPrice: '₹1,59,900', sellingPrice: '₹1,34,900', expiresAt: '2024-05-20T23:59', status: 'active' },
  { id: '2', title: 'Sony PlayStation 5 Console', store: 'Flipkart', discount: '₹10,000 Price Drop', originalPrice: '₹54,990', sellingPrice: '₹44,990', expiresAt: '2024-05-18T12:00', status: 'expired' },
  { id: '3', title: 'Samsung 55" 4K Smart TV', store: 'Samsung', discount: '55% OFF', originalPrice: '₹89,900', sellingPrice: '₹39,990', expiresAt: '2024-05-22T23:59', status: 'active' },
]

export const ExecutiveLootDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<LootDeal[]>(mockLootDeals)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<LootDeal | null>(null)

  const handleAddDeal = () => {
    setEditingDeal(null)
    setIsModalOpen(true)
  }

  const handleEditDeal = (deal: LootDeal) => {
    setEditingDeal(deal)
    setIsModalOpen(true)
  }

  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this loot deal?')) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' 
    }).format(date)
  }

  return (
    <ExecutiveLayout activeMenu="loot-deals">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Loot Deals</h2>
          <button className="crud-add-btn" onClick={handleAddDeal}>
            <Plus size={18} /> Add Loot Deal
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search loot deals by title or store..." 
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
                <th>Pricing</th>
                <th>Expires At</th>
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
                  <td>
                    <div style={{ color: '#10b981', fontWeight: 600 }}>{deal.discount}</div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '8px' }}>{deal.originalPrice}</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{deal.sellingPrice}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: deal.status === 'expired' ? '#ef4444' : '#334155' }}>
                      <Clock size={14} />
                      {formatDate(deal.expiresAt)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${deal.status}`}>
                      {deal.status === 'active' ? 'Active' : 'Expired'}
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No loot deals found matching your search.
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
                <h3 className="modal-title">{editingDeal ? 'Edit Loot Deal' : 'Add New Loot Deal'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Loot Deal Title</label>
                    <input type="text" placeholder="e.g., Apple iPhone 15 Pro Max" defaultValue={editingDeal?.title} />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Store</label>
                      <select defaultValue={editingDeal?.store || ''}>
                        <option value="" disabled>Select Store</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Myntra">Myntra</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Discount Text</label>
                      <input type="text" placeholder="e.g., Flat ₹25,000 OFF" defaultValue={editingDeal?.discount} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Original Price (₹)</label>
                      <input type="text" placeholder="1,59,900" defaultValue={editingDeal?.originalPrice} />
                    </div>
                    <div className="form-group">
                      <label>Selling Price (₹)</label>
                      <input type="text" placeholder="1,34,900" defaultValue={editingDeal?.sellingPrice} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date & Time</label>
                      <input type="datetime-local" defaultValue={editingDeal?.expiresAt} />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select defaultValue={editingDeal?.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Affiliate URL</label>
                    <input type="url" placeholder="https://..." />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Loot Deal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
