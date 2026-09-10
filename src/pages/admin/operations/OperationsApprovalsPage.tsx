import React, { useState, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
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
  Store
} from 'lucide-react'
import './OperationsShared.css'
import { getStoreLogo } from '../../../data/dealsPage'

export interface ModerationItem {
  id: string
  type: 'loot' | 'deal' | 'coupon' | 'banner' | 'ad' | 'store'
  title: string
  brand?: string
  store: string
  submittedBy: string
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
}

const initialApprovalQueue: ModerationItem[] = [
  {
    id: 'appr-201',
    type: 'loot',
    title: 'Sony WH-1000XM5 Wireless ANC Headphones (Price Glitch at ₹4,999)',
    brand: 'Sony',
    store: 'Amazon',
    submittedBy: 'rahul.executive@wouchify.com',
    submittedAt: '12 mins ago',
    price: '₹4,999',
    originalPrice: '₹29,990',
    discount: '83% OFF',
    code: 'GLITCHSONY',
    priority: 'Critical',
    link: 'https://amazon.in/dp/B09XS7JWHH',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    notes: 'Price drop verified on Amazon seller app. Very high urgency.',
    category: 'Electronics',
    subCategory: 'Headphones',
    asinOrSku: 'B09XS7JWHH',
    bankOffer: '10% Instant Discount via SBI Credit Card',
    cashback: '₹200 Amazon Pay Balance',
    stockStatus: 'Lightning Deal (85% Claimed)',
    rating: '4.5/5 (2,300 reviews)',
    deliveryInfo: 'Free One-Day Delivery for Prime',
    description: 'The best ANC headphones in the market, now at an unbelievable glitch price.',
    highlights: ['Industry Leading ANC', '30hr Battery Life', 'Multipoint connection'],
    status: 'Pending Approval'
  },
  {
    id: 'appr-202',
    type: 'loot',
    title: 'Puma Speedcat OG Leather Sneakers (Under ₹999 Steal Deal)',
    brand: 'Puma',
    store: 'Myntra',
    submittedBy: 'rahul.executive@wouchify.com',
    submittedAt: '25 mins ago',
    price: '₹949',
    originalPrice: '₹7,999',
    discount: '88% OFF',
    code: 'PUMASTEAL',
    priority: 'Critical',
    link: 'https://myntra.com/puma-speedcat',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    notes: 'Myntra End of Reason flash glitch.',
    category: 'Footwear',
    status: 'Pending Approval'
  },
  {
    id: 'appr-203',
    type: 'deal',
    title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Titanium Black)',
    brand: 'Samsung',
    store: 'Flipkart',
    submittedBy: 'sneha.deals@wouchify.com',
    submittedAt: '35 mins ago',
    price: '₹1,09,999',
    originalPrice: '₹1,34,999',
    discount: '19% OFF',
    priority: 'High',
    link: 'https://flipkart.com/samsung-s24-ultra',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
    notes: 'Includes ₹5,000 instant HDFC Bank discount.',
    category: 'Electronics',
    status: 'Pending Approval'
  },
  {
    id: 'appr-204',
    type: 'deal',
    title: 'Apple MacBook Air M3 (13.6-inch Liquid Retina, 8GB/256GB SSD)',
    brand: 'Apple',
    store: 'Amazon',
    submittedBy: 'sneha.deals@wouchify.com',
    submittedAt: '45 mins ago',
    price: '₹94,990',
    originalPrice: '₹1,14,900',
    discount: '17% OFF',
    priority: 'High',
    link: 'https://amazon.in/dp/B0CX2319',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    notes: 'Amazon Prime Day special pricing.',
    category: 'Computers',
    status: 'Pending Approval'
  },
  {
    id: 'appr-205',
    type: 'coupon',
    title: 'Myntra Flat ₹500 OFF on Orders Above ₹1,999',
    brand: 'Myntra',
    store: 'Myntra',
    submittedBy: 'arjun.coupons@wouchify.com',
    submittedAt: '1 hour ago',
    price: 'Flat ₹500 OFF',
    code: 'MYNTRAPRO',
    discount: '₹500 OFF',
    priority: 'Normal',
    link: 'https://myntra.com',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop',
    notes: 'Verified working coupon on Fashion catalog.',
    category: 'Fashion',
    status: 'Pending Approval'
  },
  {
    id: 'appr-206',
    type: 'coupon',
    title: 'Dominos Pizza: Flat 50% OFF up to ₹120 on Pizza Mania & Combos',
    brand: "Domino's",
    store: 'Dominos',
    submittedBy: 'arjun.coupons@wouchify.com',
    submittedAt: '2 hours ago',
    price: '50% OFF',
    code: 'DOM50FEST',
    discount: '50% OFF',
    priority: 'Normal',
    link: 'https://dominos.co.in',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop',
    notes: 'Applicable on min order ₹249.',
    category: 'Food',
    status: 'Pending Approval'
  },
  {
    id: 'appr-207',
    type: 'banner',
    title: 'Home Page Hero: Diwali Mega Cashback Bonanza (Up to 15% Extra)',
    brand: 'Wouchify',
    store: 'Wouchify',
    submittedBy: 'priya.media@wouchify.com',
    submittedAt: '3 hours ago',
    price: 'Heroic Banner',
    discount: 'Up to 15% Cashback',
    priority: 'High',
    link: '/stores',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop',
    notes: 'Scheduled to go live for upcoming festive season.',
    category: 'Campaign',
    status: 'Pending Approval'
  },
  {
    id: 'appr-208',
    type: 'ad',
    title: 'Header Sticky Sponsor Banner: HDFC Regalia Gold Credit Card',
    brand: 'HDFC Bank',
    store: 'HDFC Bank',
    submittedBy: 'priya.media@wouchify.com',
    submittedAt: '4 hours ago',
    price: '₹45,000 / Week',
    discount: 'Sponsor Ad',
    priority: 'Normal',
    link: 'https://hdfcbank.com/credit-cards',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop',
    notes: 'Targeting Deals & Coupons page header slot.',
    category: 'Banking',
    status: 'Pending Approval'
  }
]

export const OperationsApprovalsPage: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>(initialApprovalQueue)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterExecutive, setFilterExecutive] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState<ModerationItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<ModerationItem | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const pendingCount = items.filter(i => i.status === 'Pending Approval').length
  const criticalCount = items.filter(i => i.status === 'Pending Approval' && i.priority === 'Critical').length
  const dealsCount = items.filter(i => i.status === 'Pending Approval' && (i.type === 'deal' || i.type === 'loot')).length
  const couponsCount = items.filter(i => i.status === 'Pending Approval' && i.type === 'coupon').length
  const bannersCount = items.filter(i => i.status === 'Pending Approval' && (i.type === 'banner' || i.type === 'ad')).length

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.status !== 'Pending Approval') return false

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
  }, [items, filterType, filterExecutive, searchTerm])

  const handleApproveOne = (id: string, title: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item))
    setSelectedIds(prev => prev.filter(selId => selId !== id))
    showToast(`Approved & published to storefront: "${title}"`)
  }

  const handleOpenRejectModal = (item: ModerationItem) => {
    setRejectingItem(item)
    setRejectionReason('')
  }

  const handleConfirmReject = () => {
    if (!rejectingItem) return
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason note for the executive team.')
      return
    }

    setItems(prev => prev.map(item => 
      item.id === rejectingItem.id ? { ...item, status: 'Rejected', rejectionReason } : item
    ))
    setSelectedIds(prev => prev.filter(id => id !== rejectingItem.id))
    showToast(`Rejected submission with feedback note`)
    setRejectingItem(null)
    setRejectionReason('')
  }

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return
    setItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'Approved' } : item))
    showToast(`Bulk approved ${selectedIds.length} submissions`)
    setSelectedIds([])
  }

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return
    const reason = prompt(`Enter rejection reason for ${selectedIds.length} selected items:`, 'Details incomplete or inaccurate')
    if (reason) {
      setItems(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'Rejected', rejectionReason: reason } : item))
      showToast(`Rejected ${selectedIds.length} submissions`)
      setSelectedIds([])
    }
  }

  const handleSelectAll = () => {
    const pageIds = filteredItems.map(i => i.id)
    if (pageIds.every(id => selectedIds.includes(id))) {
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
    const rows = filteredItems.map(i => [
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
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
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
              <option value="banner">Hero Banners</option>
              <option value="ad">Advertisements</option>
            </select>

            <select 
              value={filterExecutive}
              onChange={(e) => setFilterExecutive(e.target.value)}
              className="filter-select"
              aria-label="Filter by Executive"
            >
              <option value="all">👥 All Executives</option>
              <option value="rahul.executive@wouchify.com">Rahul Sharma (Content Exec)</option>
              <option value="sneha.deals@wouchify.com">Sneha Patel (Deals Exec)</option>
              <option value="arjun.coupons@wouchify.com">Arjun Verma (Coupons Exec)</option>
              <option value="priya.media@wouchify.com">Priya Sundaram (Creative Exec)</option>
            </select>
          </div>
        </div>

        {/* Moderation Table */}
        <div className="crud-table-card">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 size={42} style={{ color: '#16a34a', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Approval Queue is Clear!</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                {searchTerm || filterType !== 'all' 
                  ? 'No pending items match the selected filter criteria.' 
                  : 'All executive submissions have been processed and published.'}
              </p>
            </div>
          ) : (
            <div className="crud-table-wrapper">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th style={{ width: '32px', textAlign: 'center' }}>
                      <input 
                        type="checkbox"
                        checked={filteredItems.length > 0 && filteredItems.every(i => selectedIds.includes(i.id))}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ width: '44px', textAlign: 'center' }}>Image</th>
                    <th style={{ minWidth: '190px' }}>Submission Headline & Details</th>
                    <th style={{ width: '90px' }}>Type & Priority</th>
                    <th style={{ width: '95px' }}>Store Partner</th>
                    <th style={{ width: '105px' }}>Submitted By</th>
                    <th style={{ width: '95px' }}>Price / Offer</th>
                    <th style={{ width: '130px' }}>Executive Notes</th>
                    <th style={{ width: '140px', textAlign: 'right' }}>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id)
                    return (
                      <tr key={item.id} className={isSelected ? 'row-selected' : ''}>
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                          />
                        </td>
                        <td style={{ width: '44px', textAlign: 'center' }}>
                          <div className="product-table-thumb-wrap">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="product-table-thumb"
                              onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/48?text=Deal' }}
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
                            <span className={`ops-type-badge ${item.type}`}>
                              {item.type === 'loot' && <Flame size={12} />}
                              {item.type === 'deal' && <Zap size={12} />}
                              {item.type === 'coupon' && <Tag size={12} />}
                              {item.type === 'banner' && <ImageIcon size={12} />}
                              {item.type === 'ad' && <Megaphone size={12} />}
                              {item.type === 'store' && <Store size={12} />}
                              {item.type.toUpperCase()}
                            </span>
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
                              onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/56x18?text=' + item.store }}
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
                          <div className="executive-notes-bubble">
                            "{item.notes || 'Verified for live publication'}"
                          </div>
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
            <div className="crud-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <Eye size={12} /> Storefront Preview
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>Live Preview Inspection</h3>
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
                    />
                  )}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    {previewItem.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src={getStoreLogo(previewItem.store)} alt={previewItem.store} style={{ height: '20px' }} />
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
                  <h5 style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Detailed Deal Information</h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Category & Brand</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.category} {previewItem.subCategory ? `> ${previewItem.subCategory}` : ''} • {previewItem.brand || 'No Brand'}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Stock & Delivery</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.stockStatus || 'Not specified'} • {previewItem.deliveryInfo || 'Standard Delivery'}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Additional Offers</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.bankOffer || 'No Bank Offer'} {previewItem.cashback ? ` | ${previewItem.cashback}` : ''}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Product ASIN / SKU</span>
                      <strong style={{ color: '#0f172a' }}>{previewItem.asinOrSku || 'N/A'}</strong>
                    </div>
                    {previewItem.description && (
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', marginTop: '8px' }}>
                        <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Description</span>
                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.4' }}>{previewItem.description}</p>
                      </div>
                    )}
                    {previewItem.highlights && previewItem.highlights.length > 0 && (
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', marginTop: '4px' }}>
                        <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Highlights</span>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
                          {previewItem.highlights.map((h, i) => <li key={i}>{h}</li>)}
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

      </div>
    </OperationsLayout>
  )
}
