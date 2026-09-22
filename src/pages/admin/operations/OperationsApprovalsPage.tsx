import React, { useState, useEffect, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { adminApi } from '../../../services/adminApi'
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  Check, 
  X, 
  Eye, 
  Flame, 
  Zap, 
  Tag, 
  Image as ImageIcon, 
  Megaphone,
  Send,
  ShieldAlert,
  Store,
  CreditCard,
  Layers
} from 'lucide-react'
import './OperationsShared.css'
import { getStoreLogo, PLACEHOLDER_DEAL_IMAGE, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { AdminPromptDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

export interface ModerationItem {
  id: string
  entityId?: string
  action?: 'create' | 'update' | 'delete'
  type: 'loot' | 'deal' | 'coupon' | 'banner' | 'ad' | 'store' | 'credit_card' | 'category'
  title: string
  brand?: string
  store: string
  submittedBy: string
  submittedByName?: string
  submittedAt: string
  price: string
  originalPrice?: string
  discount?: string
  code?: string
  priority: 'Critical' | 'High' | 'Normal'
  link: string
  image: string
  notes?: string
  category: string
  status: 'Pending Approval' | 'Approved' | 'Rejected'
  rejectionReason?: string
  subCategory?: string
  asinOrSku?: string
  bankOffer?: string
  effectivePrice?: string
  cashback?: string
  stockStatus?: 'In Stock' | 'Limited Stock' | 'Lightning Deal (85% Claimed)' | 'Out of Stock'
  rating?: string
  deliveryInfo?: string
  warranty?: string
  variantNote?: string
  howToClaim?: string
  highlights?: string[]
  isFeatured?: boolean
  isVerified?: boolean
  expiresAt?: string
  description?: string
  terms?: string
  dataSnapshot?: any
}

export const OperationsApprovalsPage: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterExecutive, setFilterExecutive] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState<ModerationItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false)
  const [approvalAlert, setApprovalAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'danger' | 'info' | 'success' } | null>(null)

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<ModerationItem | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const fetchQueue = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await adminApi.getSubmissions({ status: 'all' })
      if (Array.isArray(res)) {
        const mapped: ModerationItem[] = res.map((s: any, idx: number) => {
          const snap = s.dataSnapshot || {}
          return {
            id: s._id || s.id || `appr-${idx + 1}`,
            entityId: s.entityId,
            action: s.action || 'create',
            type: s.entityType === 'loot_deal' ? 'loot' :
                  s.entityType === 'deal' ? 'deal' :
                  s.entityType === 'coupon' ? 'coupon' :
                  s.entityType === 'banner' ? 'banner' :
                  s.entityType === 'advertisement' ? 'ad' :
                  s.entityType === 'store' ? 'store' :
                  s.entityType === 'credit_card' ? 'credit_card' :
                  s.entityType === 'category' ? 'category' : 'deal',
            title: s.title || snap.title || snap.name || snap.cardName || 'Submitted Item',
            brand: snap.brand || snap.bank || snap.store || s.store || 'Generic',
            store: s.store || snap.store || snap.storeName || snap.advertiser || snap.bank || 'Partner',
            submittedBy: s.submittedBy || 'Content Executive',
            submittedByName: s.submittedByName,
            submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            price: snap.price || snap.currentPrice || snap.reward || snap.annualFee || (snap.pricingModel ? `${snap.pricingModel} • ${snap.budgetOrRate || ''}` : 'Special Offer'),
            originalPrice: snap.originalPrice || '',
            discount: snap.discount || snap.discountLabel || snap.rewardRate || '',
            code: snap.code || '',
            priority: s.priority || 'Normal',
            link: snap.link || snap.href || snap.targetLink || snap.affiliateLink || '#',
            image: snap.image || snap.imageUrl || snap.productImage || snap.primaryImage || snap.logo || PLACEHOLDER_DEAL_IMAGE,
            notes: s.notes || snap.proofNote || snap.description || '',
            category: s.category || snap.category || 'General',
            status: s.status === 'Approved' ? 'Approved' : (s.status === 'Rejected' ? 'Rejected' : 'Pending Approval'),
            rejectionReason: s.rejectionReason,
            description: snap.description,
            terms: snap.terms,
            highlights: snap.highlights || snap.keyBenefits,
            dataSnapshot: snap
          }
        })
        setItems(mapped)
      }
    } catch (err) {
      console.error('Failed to load submissions queue:', err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue(false)

    // Event listener for in-window updates
    const handleSubmissionsUpdated = () => fetchQueue(true)
    window.addEventListener('wouchify_submissions_updated', handleSubmissionsUpdated)

    // Storage listener for cross-tab updates (when executive adds deal in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wouchify_submissions_sync') {
        fetchQueue(true)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('wouchify_submissions_updated', handleSubmissionsUpdated)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleApproveOne = async (id: string, title: string) => {
    // Optimistic UI update: change state immediately for instant feedback
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Approved' } : i))
    setSelectedIds(prev => prev.filter(selId => selId !== id))
    showToast(`Approved: "${title}"`)

    try {
      await adminApi.approveSubmission(id)
      try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()) } catch {}
      window.dispatchEvent(new CustomEvent('wouchify_deals_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_coupons_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_banners_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_categories_updated'))
    } catch (err: any) {
      console.error('Approve failed:', err)
      showToast(`Error approving item: ${err?.message || 'Unknown error'}`)
      fetchQueue(true)
    }
  }

  const handleOpenRejectModal = (item: ModerationItem) => {
    setRejectingItem(item)
    setRejectionReason('')
  }

  const handleConfirmReject = async () => {
    if (!rejectingItem) return
    if (!rejectionReason.trim()) {
      setApprovalAlert({ title: 'Missing Reason', message: 'Please enter a rejection reason note for the executive team.', variant: 'warning' })
      return
    }

    const targetId = rejectingItem.id
    const note = rejectionReason

    // Optimistic UI update: update local status immediately
    setItems(prev => prev.map(item => 
      item.id === targetId ? { ...item, status: 'Rejected', rejectionReason: note } : item
    ))
    setSelectedIds(prev => prev.filter(id => id !== targetId))
    showToast(`Rejected submission with feedback note`)
    setRejectingItem(null)
    setRejectionReason('')

    try {
      await adminApi.rejectSubmission(targetId, note)
      try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()) } catch {}
      window.dispatchEvent(new CustomEvent('wouchify_submissions_updated'))
    } catch (err: any) {
      console.error('Reject failed:', err)
      showToast(`Error rejecting item: ${err?.message || 'Unknown error'}`)
      fetchQueue(true)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return
    const idsToApprove = [...selectedIds]
    setItems(prev => prev.map(item => idsToApprove.includes(item.id) ? { ...item, status: 'Approved' } : item))
    setSelectedIds([])
    showToast(`Bulk approved ${idsToApprove.length} submissions`)

    try {
      await adminApi.bulkApproveSubmissions(idsToApprove)
      try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()) } catch {}
      window.dispatchEvent(new CustomEvent('wouchify_submissions_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_deals_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_loot_deals_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_stores_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_coupons_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_credit_cards_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_banners_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_advertisements_updated'))
      window.dispatchEvent(new CustomEvent('wouchify_categories_updated'))
    } catch (err: any) {
      console.error('Bulk approve failed:', err)
      showToast(`Error during bulk approval`)
      fetchQueue(true)
    }
  }

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return
    setBulkRejectOpen(true)
  }

  const handleConfirmBulkReject = async (reason: string) => {
    const idsToReject = [...selectedIds]
    setItems(prev => prev.map(item => idsToReject.includes(item.id) ? { ...item, status: 'Rejected', rejectionReason: reason } : item))
    setSelectedIds([])
    setBulkRejectOpen(false)
    showToast(`Rejected ${idsToReject.length} submissions`)

    try {
      await adminApi.bulkRejectSubmissions(idsToReject, reason)
      try { localStorage.setItem('wouchify_submissions_sync', Date.now().toString()) } catch {}
      window.dispatchEvent(new CustomEvent('wouchify_submissions_updated'))
    } catch (err: any) {
      console.error('Bulk reject failed:', err)
      showToast(`Error during bulk rejection`)
      fetchQueue(true)
    }
  }

  // Counts
  const pendingCount = items.filter(i => i.status === 'Pending Approval').length
  const approvedCount = items.filter(i => i.status === 'Approved').length
  const rejectedCount = items.filter(i => i.status === 'Rejected').length
  const totalCount = items.length

  // KPIs (reflecting currently pending items)
  const criticalCount = items.filter(i => i.status === 'Pending Approval' && i.priority === 'Critical').length
  const dealsCount = items.filter(i => i.status === 'Pending Approval' && (i.type === 'deal' || i.type === 'loot')).length
  const couponsCount = items.filter(i => i.status === 'Pending Approval' && i.type === 'coupon').length
  const cardsCount = items.filter(i => i.status === 'Pending Approval' && i.type === 'credit_card').length
  const bannersCount = items.filter(i => i.status === 'Pending Approval' && (i.type === 'banner' || i.type === 'ad')).length

  const executiveOptions = useMemo(() => {
    const set = new Set<string>()
    items.forEach(i => {
      if (i.submittedBy) set.add(i.submittedBy)
    })
    return ['all', ...Array.from(set)]
  }, [items])

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((item: ModerationItem) => {
      // Status Tab filter
      if (activeTab === 'pending' && item.status !== 'Pending Approval') return false
      if (activeTab === 'approved' && item.status !== 'Approved') return false
      if (activeTab === 'rejected' && item.status !== 'Rejected') return false

      if (filterType !== 'all' && item.type !== filterType) {
        return false
      }

      if (filterExecutive !== 'all' && item.submittedBy.toLowerCase() !== filterExecutive.toLowerCase()) {
        return false
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchStore = item.store.toLowerCase().includes(q)
        const matchSubmitter = item.submittedBy.toLowerCase().includes(q)
        const matchCode = (item.code || '').toLowerCase().includes(q)
        if (!matchTitle && !matchStore && !matchSubmitter && !matchCode) return false
      }

      return true
    })
  }, [items, activeTab, filterType, filterExecutive, searchTerm])

  const handleSelectAll = () => {
    const pageIds = filteredItems.map((i: ModerationItem) => i.id)
    if (pageIds.every((id: string) => selectedIds.includes(id))) {
      setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)))
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])))
    }
  }

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selId => selId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Store', 'Price', 'Discount', 'Code', 'SubmittedBy', 'SubmittedAt', 'Priority', 'Status']
    const rows = filteredItems.map((i: ModerationItem) => [
      i.id,
      i.type,
      `"${i.title.replace(/"/g, '""')}"`,
      i.store,
      i.price,
      i.discount || '',
      i.code || '',
      i.submittedBy,
      i.submittedAt,
      i.priority,
      i.status
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_approval_queue_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported moderation queue to CSV')
  }

  return (
    <OperationsLayout activeMenu="approvals" pendingCounts={{ approvals: pendingCount }}>
      <div className="executive-crud-page">
        
        {/* Toast */}
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Top Header */}
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Central Moderation & Approval Queue</h1>
            <p className="crud-subtitle">
              Review and authorize deals, flash loot, coupons, banners, and advertising campaigns submitted by content executives.
            </p>
          </div>

          <div className="crud-header-actions">
            <button className="btn-secondary" onClick={handleExportCSV}>
              <Download size={16} /> Export Queue
            </button>
            {selectedIds.length > 0 && (
              <>
                <button className="btn-reject-quick" onClick={handleBulkReject} style={{ padding: '8px 14px' }}>
                  <X size={15} /> Reject ({selectedIds.length})
                </button>
                <button className="btn-primary" onClick={handleBulkApprove} style={{ background: '#16a34a' }}>
                  <Check size={16} /> Bulk Approve ({selectedIds.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          
          <div className="kpi-card" onClick={() => setFilterType('all')} style={{ cursor: 'pointer', border: filterType === 'all' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Total Awaiting Review</span>
              <span className="kpi-value">{pendingCount}</span>
              <span className="kpi-sub">All submitted modules</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <Clock size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setFilterType('loot')} style={{ cursor: 'pointer', border: filterType === 'loot' ? '1.5px solid #dc2626' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Critical Loot Glitches</span>
              <span className="kpi-value">{criticalCount}</span>
              <span className="kpi-sub">Immediate approval required</span>
            </div>
            <div className="kpi-icon ops-kpi-red">
              <Flame size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setFilterType('deal')} style={{ cursor: 'pointer', border: filterType === 'deal' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Standard Deals</span>
              <span className="kpi-value">{dealsCount}</span>
              <span className="kpi-sub">E-commerce price drops</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Zap size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setFilterType('coupon')} style={{ cursor: 'pointer', border: filterType === 'coupon' ? '1.5px solid #7c3aed' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Coupons & Codes</span>
              <span className="kpi-value">{couponsCount}</span>
              <span className="kpi-sub">Promo codes & terms</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <Tag size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setFilterType('credit_card')} style={{ cursor: 'pointer', border: filterType === 'credit_card' ? '1.5px solid #0891b2' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Credit Cards</span>
              <span className="kpi-value">{cardsCount}</span>
              <span className="kpi-sub">Banking & cards</span>
            </div>
            <div className="kpi-icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
              <CreditCard size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setFilterType('banner')} style={{ cursor: 'pointer', border: filterType === 'banner' ? '1.5px solid #16a34a' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Banners & Ads</span>
              <span className="kpi-value">{bannersCount}</span>
              <span className="kpi-sub">Creatives & hero visuals</span>
            </div>
            <div className="kpi-icon ops-kpi-green">
              <ImageIcon size={20} />
            </div>
          </div>

        </div>

        {/* ── Approval Navigation Tabs ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('pending')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: activeTab === 'pending' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'pending' ? '#eff6ff' : 'transparent',
              color: activeTab === 'pending' ? '#1d4ed8' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            <Clock size={16} style={{ color: activeTab === 'pending' ? '#2563eb' : '#94a3b8' }} />
            Pending Approval
            <span style={{
              background: activeTab === 'pending' ? '#2563eb' : '#e2e8f0',
              color: activeTab === 'pending' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {pendingCount}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('approved')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: activeTab === 'approved' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'approved' ? '#ecfdf5' : 'transparent',
              color: activeTab === 'approved' ? '#047857' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            <CheckCircle2 size={16} style={{ color: activeTab === 'approved' ? '#10b981' : '#94a3b8' }} />
            Approved Items
            <span style={{
              background: activeTab === 'approved' ? '#10b981' : '#e2e8f0',
              color: activeTab === 'approved' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {approvedCount}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('rejected')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: activeTab === 'rejected' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'rejected' ? '#fef2f2' : 'transparent',
              color: activeTab === 'rejected' ? '#b91c1c' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} style={{ color: activeTab === 'rejected' ? '#ef4444' : '#94a3b8' }} />
            Rejected Submissions
            <span style={{
              background: activeTab === 'rejected' ? '#ef4444' : '#e2e8f0',
              color: activeTab === 'rejected' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {rejectedCount}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: activeTab === 'all' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'all' ? '#f1f5f9' : 'transparent',
              color: activeTab === 'all' ? '#0f172a' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={16} style={{ color: activeTab === 'all' ? '#0f172a' : '#94a3b8' }} />
            All History
            <span style={{
              background: activeTab === 'all' ? '#475569' : '#e2e8f0',
              color: activeTab === 'all' ? '#ffffff' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {totalCount}
            </span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, store, code or executive email…" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-dropdown-wrap">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Content Types</option>
              <option value="loot">Loot Deals (Price Errors)</option>
              <option value="deal">Standard Deals</option>
              <option value="coupon">Coupons</option>
              <option value="store">Stores</option>
              <option value="credit_card">Credit Cards</option>
              <option value="banner">Hero Banners</option>
              <option value="ad">Advertisements</option>
              <option value="category">Categories</option>
            </select>

            <select 
              value={filterExecutive}
              onChange={(e) => setFilterExecutive(e.target.value)}
              className="filter-select"
              aria-label="Filter by Executive"
            >
              <option value="all">👥 All Executives</option>
              {executiveOptions.filter(e => e !== 'all').map(email => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Moderation Table */}
        <div className="crud-table-card">
          {loading ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <Clock size={36} style={{ color: '#2563eb', margin: '0 auto 12px', display: 'block', animation: 'spin 1.5s linear infinite' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Loading Moderation Queue…</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Syncing with central database</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              {activeTab === 'pending' ? (
                <>
                  <CheckCircle2 size={42} style={{ color: '#16a34a', margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Approval Queue is Clear!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                    {searchTerm || filterType !== 'all' 
                      ? 'No pending items match the selected filter criteria.' 
                      : 'All executive submissions have been processed and published.'}
                  </p>
                </>
              ) : activeTab === 'approved' ? (
                <>
                  <CheckCircle2 size={42} style={{ color: '#10b981', margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>No Approved Items in History</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                    Items approved by Operational Managers will be logged here.
                  </p>
                </>
              ) : activeTab === 'rejected' ? (
                <>
                  <ShieldAlert size={42} style={{ color: '#ef4444', margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>No Rejected Submissions</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                    Any submissions rejected with feedback notes will be cataloged here.
                  </p>
                </>
              ) : (
                <>
                  <Layers size={42} style={{ color: '#64748b', margin: '0 auto 12px', display: 'block' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>No Submissions Found</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                    No submission records match your search or filter filters.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="crud-table-wrapper">
              <table className="crud-table">
                <thead>
                  <tr>
                    {activeTab === 'pending' && (
                      <th style={{ width: '32px', textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={filteredItems.length > 0 && filteredItems.every(i => selectedIds.includes(i.id))}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    <th style={{ width: '44px', textAlign: 'center' }}>Image</th>
                    <th style={{ minWidth: '190px' }}>Submission Headline & Details</th>
                    <th style={{ width: '90px' }}>Type & Priority</th>
                    <th style={{ width: '95px' }}>Store Partner</th>
                    <th style={{ width: '105px' }}>Submitted By</th>
                    <th style={{ width: '95px' }}>Price / Offer</th>
                    <th style={{ width: activeTab === 'rejected' ? '180px' : '130px' }}>
                      {activeTab === 'rejected' ? 'Rejection Feedback' : 'Executive Notes'}
                    </th>
                    <th style={{ width: '140px', textAlign: 'right' }}>
                      {activeTab === 'pending' ? 'Moderation Actions' : 'Status & Action'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id)
                    return (
                      <tr key={item.id} className={isSelected ? 'row-selected' : ''}>
                        {activeTab === 'pending' && (
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(item.id)}
                            />
                          </td>
                        )}
                        <td style={{ width: '44px', textAlign: 'center' }}>
                          <div className="product-table-thumb-wrap">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="product-table-thumb"
                              onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="submission-details-cell">
                            {item.brand && (
                              <span className="submission-brand-tag">
                                {item.brand}
                              </span>
                            )}
                            <div className="submission-title-text">
                              {item.title}
                            </div>
                            <div className="submission-meta-row">
                              {item.category && (
                                <span className="submission-category-pill">{item.category}</span>
                              )}
                              <span>•</span>
                              <span>Submitted {item.submittedAt}</span>
                              {item.code && (
                                <span className="submission-code-pill">
                                  {item.code}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              <span className={`ops-type-badge ${item.type}`}>
                                {item.type === 'loot' && <Flame size={12} />}
                                {item.type === 'deal' && <Zap size={12} />}
                                {item.type === 'coupon' && <Tag size={12} />}
                                {item.type === 'banner' && <ImageIcon size={12} />}
                                {item.type === 'ad' && <Megaphone size={12} />}
                                {item.type === 'store' && <Store size={12} />}
                                {item.type === 'credit_card' && <CreditCard size={12} />}
                                {item.type === 'category' && <Layers size={12} />}
                                {item.type.replace('_', ' ').toUpperCase()}
                              </span>
                              {item.action && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  background: item.action === 'create' ? '#ecfdf5' : item.action === 'update' ? '#eff6ff' : '#fef2f2',
                                  color: item.action === 'create' ? '#059669' : item.action === 'update' ? '#2563eb' : '#dc2626',
                                  border: `1px solid ${item.action === 'create' ? '#a7f3d0' : item.action === 'update' ? '#bfdbfe' : '#fecaca'}`
                                }}>
                                  {item.action}
                                </span>
                              )}
                            </div>
                            <span className={`priority-pill ${item.priority.toLowerCase()}`}>
                              {item.priority}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="store-partner-chip" style={{ justifyContent: 'center' }}>
                            <img 
                              src={getStoreLogo(item.store)} 
                              alt={item.store} 
                              className="store-partner-logo"
                              onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="submitter-chip">
                            <span className="submitter-avatar-xs">{item.submittedBy.charAt(0).toUpperCase()}</span>
                            <span>{item.submittedBy.split('@')[0]}</span>
                          </div>
                        </td>
                        <td>
                          <div className="price-display-cell">
                            <strong className={`price-main ${item.type === 'loot' ? 'loot' : ''}`}>
                              {item.price}
                            </strong>
                            {item.originalPrice && (
                              <span className="price-sub">
                                <span className="price-original">{item.originalPrice}</span>
                                {item.discount && <span className="price-discount-tag">({item.discount})</span>}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {item.status === 'Rejected' ? (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 8px', fontSize: '0.78rem', color: '#991b1b', lineHeight: '1.3' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, marginBottom: '2px', color: '#b91c1c' }}>
                                <ShieldAlert size={12} /> Rejection Note:
                              </div>
                              "{item.rejectionReason || 'Declined during moderation review'}"
                            </div>
                          ) : (
                            <div className="executive-notes-bubble">
                              "{item.notes || 'Verified for live publication'}"
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button 
                              type="button" 
                              className="action-btn view" 
                              onClick={() => setPreviewItem(item)}
                              title="Live storefront preview"
                            >
                              <Eye size={15} />
                            </button>

                            {item.status === 'Pending Approval' && (
                              <>
                                <button 
                                  type="button" 
                                  className="btn-approve-quick" 
                                  onClick={() => handleApproveOne(item.id, item.title)}
                                  title="Approve and push to live storefront"
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-reject-quick" 
                                  onClick={() => handleOpenRejectModal(item)}
                                  title="Reject submission with feedback"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}

                            {item.status === 'Approved' && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}>
                                <Check size={13} /> Live
                              </span>
                            )}

                            {item.status === 'Rejected' && (
                              <button 
                                type="button" 
                                className="btn-approve-quick" 
                                onClick={() => handleApproveOne(item.id, item.title)}
                                title="Re-approve this item to push live"
                                style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                              >
                                <Check size={13} /> Re-Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── MODAL 1: REJECTION FEEDBACK DIALOG ── */}
        {rejectingItem && (
          <div className="crud-modal-overlay" onClick={() => setRejectingItem(null)}>
            <div className="crud-modal" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <ShieldAlert size={12} /> Moderation Rejection
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>Reject Submission</h3>
                </div>
                <button className="modal-close" onClick={() => setRejectingItem(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>{rejectingItem.title}</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Store: <strong>{rejectingItem.store}</strong> • Submitter: <strong>{rejectingItem.submittedBy}</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label>Rejection Reason & Required Fixes <span className="required-star">*</span></label>
                  <textarea 
                    rows={4}
                    placeholder="e.g. MRP on store does not match. Please verify selling price again before resubmitting."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                  <span className="field-hint">This note will be sent directly to the executive staff member.</span>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Quick Reason Presets:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {[
                      'Price MRP mismatch',
                      'Affiliate link not resolving',
                      'Coupon code expired/invalid',
                      'Duplicate deal already published',
                      'Low quality image asset'
                    ].map(preset => (
                      <button 
                        key={preset}
                        type="button"
                        className="quick-preset-btn"
                        onClick={() => setRejectionReason(preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setRejectingItem(null)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-save" 
                  style={{ background: '#dc2626' }}
                  onClick={handleConfirmReject}
                >
                  <Send size={15} /> Send Rejection Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: LIVE STOREFRONT PREVIEW ── */}
        {previewItem && (
          <div className="crud-modal-overlay" onClick={() => setPreviewItem(null)}>
            <div className="crud-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="modal-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <Eye size={12} /> Submission Inspection
                    </span>
                    {previewItem.action && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        background: previewItem.action === 'create' ? '#ecfdf5' : previewItem.action === 'update' ? '#eff6ff' : '#fef2f2',
                        color: previewItem.action === 'create' ? '#059669' : previewItem.action === 'update' ? '#2563eb' : '#dc2626',
                        border: `1px solid ${previewItem.action === 'create' ? '#a7f3d0' : previewItem.action === 'update' ? '#bfdbfe' : '#fecaca'}`
                      }}>
                        Proposed Action: {previewItem.action}
                      </span>
                    )}
                  </div>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>Review Proposed Content</h3>
                </div>
                <button className="modal-close" onClick={() => setPreviewItem(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  {previewItem.image && (
                    <img 
                      src={previewItem.image} 
                      alt={previewItem.title} 
                      style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', margin: '0 auto 16px', borderRadius: '8px' }} 
                      onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                    />
                  )}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    {previewItem.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src={getStoreLogo(previewItem.store)} alt={previewItem.store} style={{ height: '20px' }} onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{previewItem.store}</span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626', marginBottom: '8px' }}>
                    {previewItem.price} {previewItem.originalPrice && <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 400 }}>{previewItem.originalPrice}</span>}
                  </div>
                  {previewItem.code && (
                    <div style={{ display: 'inline-block', padding: '6px 14px', background: '#f5f3ff', border: '1px dashed #7c3aed', borderRadius: '6px', fontFamily: 'monospace', fontWeight: 700, color: '#7c3aed' }}>
                      COUPON: {previewItem.code}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Detailed Submission Information</h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Submitter / Creator</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.submittedByName || previewItem.submittedBy}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Category & Module</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.category} • {previewItem.type.toUpperCase()}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Priority & Urgency</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.priority}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Target Link</span>
                      {previewItem.link ? (
                        <a href={previewItem.link} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                          Open Target URL ↗
                        </a>
                      ) : <strong style={{ color: '#0f172a' }}>None</strong>}
                    </div>
                    {previewItem.notes && (
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', marginTop: '4px', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 700 }}>Executive Notes:</span>
                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.4' }}>"{previewItem.notes}"</p>
                      </div>
                    )}
                    {previewItem.description && (
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', marginTop: '8px' }}>
                        <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Description</span>
                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.4' }}>{previewItem.description}</p>
                      </div>
                    )}
                    {previewItem.highlights && previewItem.highlights.length > 0 && (
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', marginTop: '4px' }}>
                        <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Highlights / Key Benefits</span>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
                          {previewItem.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setPreviewItem(null)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn-save" 
                  style={{ background: '#16a34a' }}
                  onClick={() => {
                    handleApproveOne(previewItem.id, previewItem.title)
                    setPreviewItem(null)
                  }}
                >
                  <Check size={16} /> Approve & Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOM BULK REJECT PROMPT DIALOG ── */}
        <AdminPromptDialog
          isOpen={bulkRejectOpen}
          title="Reject Selected Submissions"
          message={`Please enter a rejection feedback note for all ${selectedIds.length} selected items:`}
          label="Rejection Reason Note"
          placeholder="Details incomplete, coupon invalid, or price mismatch..."
          defaultValue="Details incomplete or inaccurate. Please review and resubmit."
          confirmLabel={`Reject ${selectedIds.length} Items`}
          variant="danger"
          required={true}
          onConfirm={handleConfirmBulkReject}
          onCancel={() => setBulkRejectOpen(false)}
        />

        {/* ── CUSTOM ALERT DIALOG ── */}
        {approvalAlert && (
          <AdminAlertDialog
            isOpen={!!approvalAlert}
            title={approvalAlert.title}
            message={approvalAlert.message}
            variant={approvalAlert.variant || 'warning'}
            buttonLabel="Understood"
            onClose={() => setApprovalAlert(null)}
          />
        )}

      </div>
    </OperationsLayout>
  )
}
