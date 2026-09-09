import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Store {
  id: string
  name: string
  logoUrl: string
  affiliateLink: string
  status: 'active' | 'inactive'
}

const mockStores: Store[] = [
  { id: '1', name: 'Amazon', logoUrl: 'https://logo.clearbit.com/amazon.com', affiliateLink: 'https://amazon.in/?tag=wouchify', status: 'active' },
  { id: '2', name: 'Flipkart', logoUrl: 'https://logo.clearbit.com/flipkart.com', affiliateLink: 'https://flipkart.com/?affid=wouchify', status: 'active' },
  { id: '3', name: 'Myntra', logoUrl: 'https://logo.clearbit.com/myntra.com', affiliateLink: 'https://myntra.com/?affid=wouchify', status: 'inactive' },
]

export const ExecutiveStoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>(mockStores)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)

  const handleAddStore = () => {
    setEditingStore(null)
    setIsModalOpen(true)
  }

  const handleEditStore = (store: Store) => {
    setEditingStore(store)
    setIsModalOpen(true)
  }

  const handleDeleteStore = (id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setStores(stores.filter(s => s.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingStore(null)
  }

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="stores">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Stores</h2>
          <button className="crud-add-btn" onClick={handleAddStore}>
            <Plus size={18} /> Add New Store
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search stores by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Store Name</th>
                <th>Affiliate Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <img src={store.logoUrl} alt={store.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{store.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {store.id}</div>
                  </td>
                  <td style={{ color: '#3b82f6', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={store.affiliateLink} target="_blank" rel="noopener noreferrer">{store.affiliateLink}</a>
                  </td>
                  <td>
                    <span className={`status-badge ${store.status}`}>
                      {store.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditStore(store)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteStore(store.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No stores found matching your search.
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
                <h3 className="modal-title">{editingStore ? 'Edit Store' : 'Add New Store'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Store Name</label>
                    <input type="text" placeholder="e.g., Amazon" defaultValue={editingStore?.name} />
                  </div>
                  
                  <div className="form-group">
                    <label>Logo URL</label>
                    <input type="url" placeholder="https://..." defaultValue={editingStore?.logoUrl} />
                  </div>

                  <div className="form-group">
                    <label>Affiliate Tracking Link</label>
                    <input type="url" placeholder="https://..." defaultValue={editingStore?.affiliateLink} />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select defaultValue={editingStore?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Store</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
