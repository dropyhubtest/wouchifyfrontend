import React, { useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import './ExecutiveShared.css'

interface Banner {
  id: string
  title: string
  imageUrl: string
  targetLink: string
  position: string
  status: 'active' | 'inactive'
}

const mockBanners: Banner[] = [
  { id: '1', title: 'Diwali Mega Sale Hero', imageUrl: 'https://via.placeholder.com/300x100', targetLink: '/categories/festivals', position: 'Home Hero', status: 'active' },
  { id: '2', title: 'Top Deals Slider', imageUrl: 'https://via.placeholder.com/300x100', targetLink: '/deals', position: 'Deals Top', status: 'active' },
  { id: '3', title: 'Old Clearance', imageUrl: 'https://via.placeholder.com/300x100', targetLink: '/loot-deals', position: 'Home Hero', status: 'inactive' },
]

export const ExecutiveBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(mockBanners)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const handleAddBanner = () => {
    setEditingBanner(null)
    setIsModalOpen(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setIsModalOpen(true)
  }

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
  }

  const filteredBanners = banners.filter(banner => 
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="banners">
      <div className="executive-crud-page">
        <div className="crud-header">
          <h2 className="crud-title">Manage Banners</h2>
          <button className="crud-add-btn" onClick={handleAddBanner}>
            <Plus size={18} /> Add New Banner
          </button>
        </div>

        <div className="crud-filters">
          <div className="crud-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search banners by title or position..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Banner Preview</th>
                <th>Title</th>
                <th>Target Link</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner) => (
                <tr key={banner.id}>
                  <td>
                    <img src={banner.imageUrl} alt={banner.title} style={{ width: '120px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{banner.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {banner.id}</div>
                  </td>
                  <td style={{ color: '#3b82f6', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={banner.targetLink} target="_blank" rel="noopener noreferrer">{banner.targetLink}</a>
                  </td>
                  <td><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>{banner.position}</span></td>
                  <td>
                    <span className={`status-badge ${banner.status}`}>
                      {banner.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditBanner(banner)} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteBanner(banner.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBanners.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No banners found matching your search.
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
                <h3 className="modal-title">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Banner Title</label>
                    <input type="text" placeholder="e.g., Diwali Mega Sale Hero" defaultValue={editingBanner?.title} />
                  </div>
                  
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" placeholder="https://..." defaultValue={editingBanner?.imageUrl} />
                  </div>

                  <div className="form-group">
                    <label>Target Link</label>
                    <input type="text" placeholder="/deals or https://..." defaultValue={editingBanner?.targetLink} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Position</label>
                      <select defaultValue={editingBanner?.position || 'Home Hero'}>
                        <option value="Home Hero">Home Hero</option>
                        <option value="Home Middle">Home Middle</option>
                        <option value="Deals Top">Deals Top</option>
                        <option value="Categories Side">Categories Side</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select defaultValue={editingBanner?.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={closeModal}>Save Banner</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
