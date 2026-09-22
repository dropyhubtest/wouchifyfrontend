import React, { useState, useEffect, useMemo } from 'react'
import { adminApi } from '../../services/adminApi'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  Tag,
  Store,
  CreditCard,
  FolderTree,
  Megaphone,
  Search,
  Filter,
  Eye,
  CheckCheck,
  UserCheck
} from 'lucide-react'
import './AdminDashboardPage.css'
import './manager/ManagerApprovalsPage.css'

export interface ModerationItem {
  id: string
  entityId?: string
  entityType?: 'deal' | 'loot_deal' | 'coupon' | 'store' | 'credit_card' | 'category' | 'banner' | 'advertisement'
  action?: 'create' | 'update' | 'delete'
  title: string
  store?: string
  category?: string
  submittedBy: string
  submittedByName?: string
  submittedAt: string
  reviewedBy?: string
  reviewedByName?: string
  reviewedByRole?: string
  reviewedAt?: string
  approvedBy?: string
  approvedByName?: string
  approvedByRole?: string
  approvedAt?: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Pending Approval' | 'Pending Review' | 'pending' | string
  rejectionReason?: string
  price?: string
  originalPrice?: string
  discount?: string
  dataSnapshot?: any
}

export const AdminApprovalsView: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewItem, setPreviewItem] = useState<ModerationItem | null>(null)
  const [rejectingItem, setRejectingItem] = useState<ModerationItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const subs = await adminApi.getSubmissions({ status: 'all' })
      if (Array.isArray(subs)) {
        const formatted: ModerationItem[] = subs.map((s: any) => ({
          id: s._id || s.id,
          entityId: s.entityId,
          entityType: s.entityType || s.type || 'deal',
          action: s.action || 'create',
          title: s.title || s.name || s.dataSnapshot?.name || s.dataSnapshot?.title || s.dataSnapshot?.code || 'Catalog Item',
          store: s.store || s.dataSnapshot?.store || s.dataSnapshot?.storeName || 'Storefront',
          category: s.category || s.dataSnapshot?.category || 'General',
          submittedBy: s.submittedBy || 'executive@wouchify.com',
          submittedByName: s.submittedByName || (s.submittedBy?.includes('ops.manager') ? 'Operations Manager' : 'Content Executive'),
          submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent',
          reviewedBy: s.reviewedBy || s.approvedBy,
          reviewedByName: s.reviewedByName || s.approvedByName,
          reviewedByRole: s.reviewedByRole || s.approvedByRole || (s.reviewedBy ? 'Reviewer' : undefined),
          reviewedAt: s.reviewedAt || s.approvedAt ? new Date(s.reviewedAt || s.approvedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
          approvedBy: s.approvedBy || s.reviewedBy,
          approvedByName: s.approvedByName || s.reviewedByName,
          approvedByRole: s.approvedByRole || s.reviewedByRole || ((s.approvedBy || s.reviewedBy)?.includes('ops.manager') ? 'Operations Manager' : 'Manager'),
          approvedAt: s.approvedAt || s.reviewedAt ? new Date(s.approvedAt || s.reviewedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
          status: s.status || 'Pending',
          rejectionReason: s.rejectionReason,
          price: s.dataSnapshot?.price || s.dataSnapshot?.currentPrice,
          originalPrice: s.dataSnapshot?.originalPrice,
          discount: s.dataSnapshot?.discount,
          dataSnapshot: s.dataSnapshot
        }))
        setItems(formatted)
      }
    } catch (err) {
      console.warn('Failed to load submissions queue:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const handleApprove = async (item: ModerationItem) => {
    try {
      const managerMeta = {
        reviewedBy: 'manager@wouchify.com',
        reviewedByName: 'Manager',
        reviewedByRole: 'Manager'
      }
      await adminApi.approveSubmission(item.id, managerMeta)
      setItems(prev => prev.map(i => i.id === item.id ? {
        ...i,
        status: 'Approved',
        approvedBy: managerMeta.reviewedBy,
        approvedByName: managerMeta.reviewedByName,
        approvedByRole: managerMeta.reviewedByRole,
        approvedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      } : i))
      setSelectedIds(prev => prev.filter(id => id !== item.id))
      showToast(`✓ "${item.title}" approved by Manager & published live!`)
    } catch {
      showToast('Failed to approve submission.')
    }
  }

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return
    try {
      const managerMeta = {
        reviewedBy: 'manager@wouchify.com',
        reviewedByName: 'Manager',
        reviewedByRole: 'Manager'
      }
      await adminApi.bulkApproveSubmissions(selectedIds, managerMeta)
      const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      setItems(prev => prev.map(i => selectedIds.includes(i.id) ? {
        ...i,
        status: 'Approved',
        approvedBy: managerMeta.reviewedBy,
        approvedByName: managerMeta.reviewedByName,
        approvedByRole: managerMeta.reviewedByRole,
        approvedAt: nowStr
      } : i))
      showToast(`✓ ${selectedIds.length} items bulk-approved by Manager & published live!`)
      setSelectedIds([])
    } catch {
      showToast('Bulk approval failed.')
    }
  }

  const handleRejectConfirm = async () => {
    if (!rejectingItem) return
    try {
      const managerMeta = {
        reviewedBy: 'manager@wouchify.com',
        reviewedByName: 'Manager',
        reviewedByRole: 'Manager'
      }
      await adminApi.rejectSubmission(rejectingItem.id, rejectionReason || 'Rejected by Manager', managerMeta)
      const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      setItems(prev => prev.map(i => i.id === rejectingItem.id ? {
        ...i,
        status: 'Rejected',
        rejectionReason: rejectionReason || 'Rejected by Manager',
        reviewedBy: managerMeta.reviewedBy,
        reviewedByName: managerMeta.reviewedByName,
        reviewedByRole: managerMeta.reviewedByRole,
        reviewedAt: nowStr
      } : i))
      showToast(`✕ "${rejectingItem.title}" marked as Rejected.`)
      setRejectingItem(null)
      setRejectionReason('')
    } catch {
      showToast('Failed to reject submission.')
    }
  }

  // Counts
  const counts = useMemo(() => {
    const pending = items.filter(i => i.status.toLowerCase().includes('pending')).length
    const approved = items.filter(i => i.status.toLowerCase() === 'approved').length
    const rejected = items.filter(i => i.status.toLowerCase() === 'rejected').length
    return { pending, approved, rejected, total: items.length }
  }, [items])

  // Filtered Items
  const filtered = useMemo(() => {
    return items.filter(item => {
      const isPending = item.status.toLowerCase().includes('pending')
      const isApproved = item.status.toLowerCase() === 'approved'
      const isRejected = item.status.toLowerCase() === 'rejected'

      if (activeTab === 'pending' && !isPending) return false
      if (activeTab === 'approved' && !isApproved) return false
      if (activeTab === 'rejected' && !isRejected) return false

      if (typeFilter !== 'all' && item.entityType !== typeFilter) return false

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchStore = (item.store || '').toLowerCase().includes(q)
        const matchSubmitter = (item.submittedBy || '').toLowerCase().includes(q) || (item.submittedByName || '').toLowerCase().includes(q)
        const matchApprover = (item.approvedBy || '').toLowerCase().includes(q) || (item.approvedByName || '').toLowerCase().includes(q)
        if (!matchTitle && !matchStore && !matchSubmitter && !matchApprover) return false
      }

      return true
    })
  }, [items, activeTab, typeFilter, searchTerm])

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'deal': return <Zap size={14} />
      case 'loot_deal': return <Flame size={14} />
      case 'coupon': return <Tag size={14} />
      case 'store': return <Store size={14} />
      case 'credit_card': return <CreditCard size={14} />
      case 'category': return <FolderTree size={14} />
      case 'banner':
      case 'advertisement': return <Megaphone size={14} />
      default: return <Zap size={14} />
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'deal': return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
      case 'loot_deal': return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' }
      case 'coupon': return { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' }
      case 'store': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
      case 'credit_card': return { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' }
      default: return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
    }
  }

  return (
    <div className="view-approvals-studio">
      {toastMessage && (
        <div className="admin-toast" role="status">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Spotlight Ribbon */}
      <div className="today-metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="today-metric-card highlight" onClick={() => setActiveTab('pending')} style={{ cursor: 'pointer' }}>
          <div className="today-metric-info">
            <span className="today-metric-label">Awaiting Approval</span>
            <span className="today-metric-value">{counts.pending}</span>
            <span className="today-metric-trend" style={{ color: counts.pending > 0 ? '#ea580c' : '#10b981' }}>
              <Clock size={12} /> {counts.pending > 0 ? 'Action Required' : 'Queue Cleared'}
            </span>
          </div>
          <div className="today-metric-icon total"><ShieldCheck size={20} /></div>
        </div>

        <div className="today-metric-card" onClick={() => setActiveTab('approved')} style={{ cursor: 'pointer' }}>
          <div className="today-metric-info">
            <span className="today-metric-label">Approved & Active</span>
            <span className="today-metric-value">{counts.approved}</span>
            <span className="today-metric-trend up"><CheckCircle2 size={12} /> Live on Storefront</span>
          </div>
          <div className="today-metric-icon deals"><CheckCircle2 size={20} /></div>
        </div>

        <div className="today-metric-card" onClick={() => setActiveTab('rejected')} style={{ cursor: 'pointer' }}>
          <div className="today-metric-info">
            <span className="today-metric-label">Rejected Items</span>
            <span className="today-metric-value">{counts.rejected}</span>
            <span className="today-metric-trend" style={{ color: '#ef4444' }}><XCircle size={12} /> Needs Revision</span>
          </div>
          <div className="today-metric-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><XCircle size={20} /></div>
        </div>

        <div className="today-metric-card" onClick={() => setActiveTab('all')} style={{ cursor: 'pointer' }}>
          <div className="today-metric-info">
            <span className="today-metric-label">Total Submissions</span>
            <span className="today-metric-value">{counts.total}</span>
            <span className="today-metric-trend up"><UserCheck size={12} /> Audit Trail</span>
          </div>
          <div className="today-metric-icon" style={{ background: '#f8fafc', color: '#64748b' }}><FolderTree size={20} /></div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Navigation Tabs & Filter Bar */}
        <div className="card-header-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="timeframe-tabs-group">
            <button
              className={`timeframe-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Approval ({counts.pending})
            </button>
            <button
              className={`timeframe-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Items ({counts.approved})
            </button>
            <button
              className={`timeframe-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected ({counts.rejected})
            </button>
            <button
              className={`timeframe-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Full History ({counts.total})
            </button>
          </div>

          {selectedIds.length > 0 && (
            <button className="btn-primary" onClick={handleBulkApprove} style={{ background: '#16a34a' }}>
              <CheckCheck size={16} />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-controls-bar">
          <div className="filter-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by title, store, executive, or approver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="#64748b" />
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Content Types</option>
              <option value="deal">Deals</option>
              <option value="loot_deal">Loot Deals</option>
              <option value="coupon">Coupons</option>
              <option value="store">Partner Stores</option>
              <option value="credit_card">Credit Cards</option>
              <option value="category">Categories</option>
              <option value="banner">Banners</option>
              <option value="advertisement">Advertisements</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="crud-table-wrapper">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Loading moderation queue...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: 500 }}>
                {activeTab === 'pending' ? 'Zero pending items. The queue is fully cleared.' : 'No items match the current filter.'}
              </p>
            </div>
          ) : (
            <table className="crud-table">
              <thead>
                <tr>
                  {activeTab === 'pending' && (
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filtered.length && filtered.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(filtered.map(i => i.id))
                          else setSelectedIds([])
                        }}
                      />
                    </th>
                  )}
                  <th>Type & Title</th>
                  <th>Store / Merchant</th>
                  <th>Submitted By</th>
                  <th>Approval Audit (Who & When)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const typeStyle = getTypeColor(item.entityType)
                  const isPending = item.status.toLowerCase().includes('pending')
                  const isApproved = item.status.toLowerCase() === 'approved'
                  const isRejected = item.status.toLowerCase() === 'rejected'

                  return (
                    <tr key={item.id}>
                      {activeTab === 'pending' && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedIds(prev => [...prev, item.id])
                              else setSelectedIds(prev => prev.filter(id => id !== item.id))
                            }}
                          />
                        </td>
                      )}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                background: typeStyle.bg,
                                color: typeStyle.color,
                                border: `1px solid ${typeStyle.border}`
                              }}
                            >
                              {getTypeIcon(item.entityType)}
                              {(item.entityType || 'deal').replace('_', ' ')}
                            </span>
                            <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>{item.title}</strong>
                          </div>
                          {(item.price || item.discount) && (
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {item.discount ? `${item.discount} • ` : ''}
                              {item.price ? `₹${item.price}` : ''}
                              {item.originalPrice ? ` (MRP: ₹${item.originalPrice})` : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: '#334155', fontSize: '0.88rem' }}>{item.store}</strong>
                        {item.category && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.category}</div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{item.submittedByName || 'Executive'}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.submittedBy}</span>
                          <small style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{item.submittedAt}</small>
                        </div>
                      </td>

                      {/* Approval Audit Column: Who approved & When */}
                      <td>
                        {isApproved ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.82rem' }}>
                                ✓ {item.approvedByRole || 'Manager'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600 }}>
                              {item.approvedByName || item.approvedBy || 'manager@wouchify.com'}
                            </span>
                            {item.approvedAt && (
                              <small style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                {item.approvedAt}
                              </small>
                            )}
                          </div>
                        ) : isRejected ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.82rem' }}>
                              ✕ Rejected
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              by {item.reviewedByName || item.reviewedBy || 'Reviewer'}
                            </span>
                            {item.rejectionReason && (
                              <small style={{ fontSize: '0.7rem', color: '#ef4444', fontStyle: 'italic' }}>
                                "{item.rejectionReason}"
                              </small>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#ea580c', fontSize: '0.78rem', fontWeight: 600 }}>
                            ⏳ Pending Manager Review
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isApproved ? '#ecfdf5' : isRejected ? '#fef2f2' : '#fff7ed',
                            color: isApproved ? '#16a34a' : isRejected ? '#dc2626' : '#c2410c',
                            border: `1px solid ${isApproved ? '#bbf7d0' : isRejected ? '#fecaca' : '#fed7aa'}`
                          }}
                        >
                          {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            className="btn-secondary"
                            onClick={() => setPreviewItem(item)}
                            title="Inspect Details"
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          >
                            <Eye size={14} />
                          </button>

                          {isPending && (
                            <>
                              <button
                                className="btn-primary"
                                onClick={() => handleApprove(item)}
                                title="Approve as Manager"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#16a34a' }}
                              >
                                <CheckCircle2 size={14} />
                                <span>Approve</span>
                              </button>

                              <button
                                className="btn-secondary"
                                onClick={() => setRejectingItem(item)}
                                title="Reject"
                                style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#dc2626', borderColor: '#fecaca' }}
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Submission Details</h3>
              <button
                onClick={() => setPreviewItem(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Title:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{previewItem.title}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Store:</span>
                  <div>{previewItem.store || 'Storefront'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Type:</span>
                  <div style={{ textTransform: 'capitalize' }}>{previewItem.entityType}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Submitted By:</span>
                <div style={{ fontWeight: 600 }}>{previewItem.submittedByName || 'Executive'} ({previewItem.submittedBy})</div>
                <small style={{ color: '#94a3b8' }}>{previewItem.submittedAt}</small>
              </div>

              {previewItem.approvedBy && (
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <span style={{ color: '#16a34a', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Approval Record:</span>
                  <div style={{ fontWeight: 700, color: '#15803d' }}>Approved by {previewItem.approvedByRole || 'Manager'}: {previewItem.approvedByName || previewItem.approvedBy}</div>
                  <small style={{ color: '#166534' }}>{previewItem.approvedAt}</small>
                </div>
              )}

              {previewItem.rejectionReason && (
                <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <span style={{ color: '#dc2626', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Rejection Reason:</span>
                  <div style={{ color: '#991b1b' }}>{previewItem.rejectionReason}</div>
                </div>
              )}

              {previewItem.dataSnapshot && (
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Raw Data Snapshot:</span>
                  <pre style={{ background: '#0f172a', color: '#38bdf8', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', overflowX: 'auto' }}>
                    {JSON.stringify(previewItem.dataSnapshot, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-secondary" onClick={() => setPreviewItem(null)}>
                Close
              </button>
              {previewItem.status.toLowerCase().includes('pending') && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    handleApprove(previewItem)
                    setPreviewItem(null)
                  }}
                  style={{ background: '#16a34a' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve as Manager</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {rejectingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setRejectingItem(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#dc2626', fontSize: '1.2rem' }}>Reject Submission</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
              Provide a reason for rejecting "<strong>{rejectingItem.title}</strong>". The content executive will be notified.
            </p>

            <textarea
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                minHeight: '90px',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="e.g. Expired promotional link, incorrect discount percentage, missing store logo..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setRejectingItem(null)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleRejectConfirm}
                style={{ background: '#dc2626' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
