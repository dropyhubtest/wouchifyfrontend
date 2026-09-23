import React, { useState, useEffect } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import { Inbox, AlertCircle, Search, Eye } from 'lucide-react'
import './ExecutiveShared.css'
import { AdminAlertDialog } from '../../../components/common/AdminDialog'

export const ExecutiveRejectionsPage: React.FC = () => {
  const [rejections, setRejections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const fetchRejections = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getSubmissions({ status: 'Rejected' })
      setRejections(data || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRejections()
    const handleSync = () => fetchRejections()
    window.addEventListener('wouchify_submissions_updated', handleSync)
    return () => window.removeEventListener('wouchify_submissions_updated', handleSync)
  }, [])

  const filteredRejections = rejections.filter((sub) =>
    (sub.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.entityType || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ExecutiveLayout activeMenu="rejections">
      <div className="executive-crud-page">
        <header className="crud-header">
          <div className="crud-header-left">
            <h1 className="crud-title">Rejection Inbox</h1>
            <p className="crud-subtitle">Review items returned by the Operational Manager for correction</p>
          </div>
        </header>

        {/* Top Kpi */}
        <div className="kpi-strip">
          <div className="kpi-card" style={{ borderColor: '#ef4444', background: '#fef2f2' }}>
            <span className="kpi-label" style={{ color: '#991b1b' }}>Needs Rework</span>
            <strong className="kpi-value" style={{ color: '#ef4444' }}>{rejections.length}</strong>
            <span className="kpi-sub" style={{ color: '#b91c1c' }}>Rejected submissions</span>
          </div>
        </div>

        <div className="crud-table-section">
          <div className="crud-table-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search rejections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Reviewed By</th>
                  <th>Rejection Reason</th>
                  <th>Date</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>Loading...</td>
                  </tr>
                ) : filteredRejections.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      <Inbox size={48} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                      <div style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>No rejected items!</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Great job on accuracy.</div>
                    </td>
                  </tr>
                ) : (
                  filteredRejections.map((sub) => (
                    <tr key={sub.id || sub._id}>
                      <td>
                        <span className={`status-badge inactive`}>
                          {sub.entityType.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{sub.title}</td>
                      <td>{sub.reviewedByName || sub.reviewedBy}</td>
                      <td style={{ color: '#ef4444', maxWidth: '300px' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                          {sub.rejectionReason || 'No reason provided'}
                        </div>
                      </td>
                      <td style={{ color: '#64748b' }}>
                        {new Date(sub.reviewedAt || sub.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            className="table-action-btn view-btn"
                            onClick={() => setSelectedItem(sub)}
                            title="View Feedback"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdminAlertDialog
        isOpen={!!selectedItem}
        title="Rejection Feedback"
        message={selectedItem ? `Item: ${selectedItem.title}\n\nReason for rejection:\n${selectedItem.rejectionReason || 'No specific reason provided.'}\n\nPlease locate this item in your Deals/Coupons panel to edit and re-submit it.` : ''}
        buttonLabel="Close"
        onConfirm={() => setSelectedItem(null)}
        variant="info"
      />
    </ExecutiveLayout>
  )
}
