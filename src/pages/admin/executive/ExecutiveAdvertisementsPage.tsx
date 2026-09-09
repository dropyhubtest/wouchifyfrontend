import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Advertisement {
  id: string
  title: string
  imageUrl: string
  targetLink: string
  placement: string
  status: 'active' | 'inactive'
}

const mockAds: Advertisement[] = [
  { id: '1', title: 'SBI Card Promo', imageUrl: 'https://via.placeholder.com/250x250', targetLink: '/executive/credit-cards', placement: 'Sidebar Top', status: 'active' },
  { id: '2', title: 'Summer Collection', imageUrl: 'https://via.placeholder.com/250x250', targetLink: '/stores', placement: 'Popup Modal', status: 'inactive' },
  { id: '3', title: 'Flash Deal Banner', imageUrl: 'https://via.placeholder.com/250x250', targetLink: '/loot-deals', placement: 'Sidebar Bottom', status: 'active' },
]

export const ExecutiveAdvertisementsPage: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>(mockAds)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)

  const handleAddAd = () => {
    setEditingAd(null)
    setIsModalOpen(true)
  }

  const handleEditAd = (ad: Advertisement) => {
    setEditingAd(ad)
    setIsModalOpen(true)
  }

  const handleDeleteAd = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      setAds(ads.filter(a => a.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAd(null)
  }

  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.placement.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="advertisements">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Advertisements</h2>
          <button className="crud-add-btn" onClick={handleAddAd}>
            <Plus size={18} /> Add New Ad
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search ads by title or placement..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Ad Image</th>
                <th>Title</th>
                <th>Target Link</th>
                <th>Placement</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map((ad) => (
                <tr key={ad.id}>
                  <td>
                    <img src={ad.imageUrl} alt={ad.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{ad.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {ad.id}</div>
                  </td>
                  <td style={{ color: '#3b82f6', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={ad.targetLink} target="_blank" rel="noopener noreferrer">{ad.targetLink}</a>
                  </td>
                  <td><span style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #e2e8f0' }}>{ad.placement}</span></td>
                  <td>
                    <span className={`status-badge ${ad.status}`}>
                      {ad.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditAd(ad)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteAd(ad.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No advertisements found matching your search.
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
                <h3 className="modal-title">{editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Advertisement Title</label>
                    <input type="text" placeholder="e.g., SBI Card Promo" defaultValue={editingAd?.title} />
                  </div>
                  
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" placeholder="https://..." defaultValue={editingAd?.imageUrl} />
                  </div>

                  <div className="form-group">
                    <label>Target Link</label>
                    <input type="text" placeholder="/credit-cards or https://..." defaultValue={editingAd?.targetLink} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Placement Area</label>
                      <select defaultValue={editingAd?.placement || 'Sidebar Top'}>
                        <option value="Sidebar Top">Sidebar Top</option>
                        <option value="Sidebar Bottom">Sidebar Bottom</option>
                        <option value="Popup Modal">Popup Modal</option>
                        <option value="In-Content Ad">In-Content Ad</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select defaultValue={editingAd?.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Advertisement</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
