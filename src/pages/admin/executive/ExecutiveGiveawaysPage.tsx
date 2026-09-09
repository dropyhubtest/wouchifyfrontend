import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Giveaway {
  id: string
  title: string
  description: string
  imageUrl: string
  endDate: string
  status: 'active' | 'inactive'
}

const mockGiveaways: Giveaway[] = [
  { id: '1', title: 'iPhone 15 Pro Max Giveaway', description: 'Win a brand new iPhone 15 Pro Max. Participate by sharing our app.', imageUrl: 'https://via.placeholder.com/60x60', endDate: '2026-12-25', status: 'active' },
  { id: '2', title: 'Amazon Gift Card ₹5000', description: 'Weekly ₹5000 Amazon Gift card giveaway for top referrers.', imageUrl: 'https://via.placeholder.com/60x60', endDate: '2026-09-30', status: 'active' },
  { id: '3', title: 'Sony PS5 Giveaway', description: 'Exclusive giveaway for premium members.', imageUrl: 'https://via.placeholder.com/60x60', endDate: '2026-08-15', status: 'inactive' },
]

export const ExecutiveGiveawaysPage: React.FC = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>(mockGiveaways)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGiveaway, setEditingGiveaway] = useState<Giveaway | null>(null)

  const handleAddGiveaway = () => {
    setEditingGiveaway(null)
    setIsModalOpen(true)
  }

  const handleEditGiveaway = (giveaway: Giveaway) => {
    setEditingGiveaway(giveaway)
    setIsModalOpen(true)
  }

  const handleDeleteGiveaway = (id: string) => {
    if (window.confirm('Are you sure you want to delete this giveaway?')) {
      setGiveaways(giveaways.filter(g => g.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingGiveaway(null)
  }

  const filteredGiveaways = giveaways.filter(giveaway => 
    giveaway.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="giveaways">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Giveaways</h2>
          <button className="crud-add-btn" onClick={handleAddGiveaway}>
            <Plus size={18} /> Add New Giveaway
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search giveaways by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Giveaway Title</th>
                <th>Description</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGiveaways.map((giveaway) => (
                <tr key={giveaway.id}>
                  <td>
                    <img src={giveaway.imageUrl} alt={giveaway.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{giveaway.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {giveaway.id}</div>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {giveaway.description}
                  </td>
                  <td>{giveaway.endDate}</td>
                  <td>
                    <span className={`status-badge ${giveaway.status}`}>
                      {giveaway.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditGiveaway(giveaway)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteGiveaway(giveaway.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGiveaways.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No giveaways found matching your search.
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
                <h3 className="modal-title">{editingGiveaway ? 'Edit Giveaway' : 'Add New Giveaway'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Giveaway Title</label>
                    <input type="text" placeholder="e.g., iPhone 15 Pro Max Giveaway" defaultValue={editingGiveaway?.title} />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Giveaway details and rules..." defaultValue={editingGiveaway?.description} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px', fontFamily: 'inherit' }}></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>End Date</label>
                      <input type="date" defaultValue={editingGiveaway?.endDate} />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select defaultValue={editingGiveaway?.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Giveaway Image URL</label>
                    <input type="url" placeholder="https://..." defaultValue={editingGiveaway?.imageUrl} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Giveaway</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
