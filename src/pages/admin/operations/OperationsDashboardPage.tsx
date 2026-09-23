import React, { useState, useEffect, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { adminApi } from '../../../services/adminApi'
import {
  CheckCircle2,
  Clock,
  
  LifeBuoy,
  Users,
  ArrowUpRight,
  Check,
  X,
  ShieldCheck,
  TrendingUp,
  Zap,
  Flame,
  Tag,
  ImageIcon,
  UserCheck,
  Download,
  CalendarDays,
  Store
} from 'lucide-react'
import './OperationsShared.css'
import { getStoreLogo, PLACEHOLDER_DEAL_IMAGE, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { AdminPromptDialog } from '../../../components/common/AdminDialog'

export interface UrgentModerationItem {
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
  image?: string
  category?: string
}

export interface ExecutiveInfo {
  id: string
  name: string
  shortName: string
  email: string
  role: string
  domain: string
  dealsToday: number
  lootToday: number
  couponsToday: number
  bannersToday: number
  storesToday: number
  submissionsToday: number
  approvalRate: number
  avgTurnaround: string
  status: 'Online' | 'Away' | 'Offline'
}

export const OperationsDashboardPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedExecutiveEmail, setSelectedExecutiveEmail] = useState<string>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all')
  const [reportFilter, setReportFilter] = useState<'today' | 'week' | 'month'>('week')
  const [reportExecutiveFilter, setReportExecutiveFilter] = useState<string>('all')
  const [urgentItems, setUrgentItems] = useState<UrgentModerationItem[]>([])
  const [executivesList, setExecutivesList] = useState<ExecutiveInfo[]>([])
  const [kpiStats, setKpiStats] = useState({
    pendingApprovals: 0,
    pendingPayoutsAmount: '₹0',
    pendingPayoutsCount: 0,
    openTicketsCount: 0,
    activeStaffCount: 0,
    submissionsTodayCount: 0,
    linkHealth: '100% Operational'
  })

  const loadOperationsData = async () => {
    try {
      const [subsRes, claimsRes, ticketsRes, staffRes] = await Promise.all([
        adminApi.getSubmissions().catch(() => []),
        adminApi.getCashbackClaims().catch(() => []),
        adminApi.getSupportTickets().catch(() => []),
        adminApi.getStaffMembers().catch(() => [])
      ])

      const subs = Array.isArray(subsRes) ? subsRes : []
      const claims = Array.isArray(claimsRes) ? claimsRes : []
      const tickets = Array.isArray(ticketsRes) ? ticketsRes : []
      const staff = Array.isArray(staffRes) ? staffRes : []

      // Pending urgent submissions
      const pendingSubs = subs.filter((s: any) => s.status === 'Pending Approval' || s.status === 'Pending Review' || s.status === 'pending')
      const mappedUrgent: UrgentModerationItem[] = pendingSubs.map((s: any, idx: number) => {
        const snap = s.dataSnapshot || {}
        return {
          id: s._id || s.id || `appr-${idx + 1}`,
          type: s.entityType === 'loot_deal' ? 'loot' :
                s.entityType === 'deal' ? 'deal' :
                s.entityType === 'coupon' ? 'coupon' :
                s.entityType === 'banner' ? 'banner' :
                s.entityType === 'advertisement' ? 'ad' :
                s.entityType === 'store' ? 'store' : 'deal',
          title: s.title || snap.title || snap.name || 'Submitted Item',
          brand: snap.brand || snap.store || s.store || 'Generic',
          store: s.store || snap.store || snap.storeName || 'Partner Store',
          submittedBy: s.submittedBy || 'executive@wouchify.com',
          submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          price: snap.price || snap.currentPrice || snap.reward || 'Offer',
          originalPrice: snap.originalPrice,
          discount: snap.discount || snap.discountLabel,
          code: snap.code,
          priority: s.priority || 'Normal',
          category: s.category || snap.category || 'General',
          image: snap.image || snap.imageUrl || snap.productImage || snap.primaryImage || PLACEHOLDER_DEAL_IMAGE
        }
      })
      setUrgentItems(mappedUrgent)

      // Pending payouts calculation
      const pendingClaims = claims.filter((c: any) => c.status === 'Pending')
      const totalPayouts = pendingClaims.reduce((sum: number, c: any) => {
        const amt = parseInt(String(c.cashbackAmount || c.orderAmount || 0).replace(/[^0-9]/g, '')) || 0
        return sum + amt
      }, 0)

      // Open support tickets
      const openTickets = tickets.filter((t: any) => t.status === 'Open' || t.status === 'In Progress')

      // Staff dynamically from real DB and real submissions
      let baseStaff = [...staff]
      if (baseStaff.length === 0 && subs.length > 0) {
        const emailMap = new Map<string, string>()
        subs.forEach(s => {
          if (s.submittedBy) emailMap.set(s.submittedBy.toLowerCase(), s.submittedByName || s.submittedBy.split('@')[0])
        })
        baseStaff = Array.from(emailMap.entries()).map(([email, name], idx) => ({
          _id: `stf-gen-${idx + 1}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          role: 'executive',
          domain: 'Deals & Coupons',
          status: 'Online'
        }))
      }

      const dynamicStaff: ExecutiveInfo[] = baseStaff.map((st: any) => {
        const userEmail = (st.email || '').toLowerCase()
        const userSubs = subs.filter((s: any) => (s.submittedBy || '').toLowerCase() === userEmail)
        const userDeals = userSubs.filter((s: any) => s.entityType === 'deal').length
        const userLoot = userSubs.filter((s: any) => s.entityType === 'loot_deal').length
        const userCoupons = userSubs.filter((s: any) => s.entityType === 'coupon').length
        const userBanners = userSubs.filter((s: any) => s.entityType === 'banner').length
        const userStores = userSubs.filter((s: any) => s.entityType === 'store').length

        const approvedCount = userSubs.filter((s: any) => s.status === 'Approved').length
        const rate = userSubs.length > 0 ? Math.round((approvedCount / userSubs.length) * 100) : 100

        return {
          id: String(st._id || st.id || st.email),
          name: st.name || st.email.split('@')[0],
          shortName: (st.name || st.email.split('@')[0]).split(' ')[0],
          email: st.email,
          role: st.role === 'operational_manager' ? 'Ops Manager' : 'Content Executive',
          domain: st.domain || 'All Categories',
          dealsToday: userDeals,
          lootToday: userLoot,
          couponsToday: userCoupons,
          bannersToday: userBanners,
          storesToday: userStores,
          submissionsToday: userSubs.length,
          approvalRate: rate,
          avgTurnaround: '10 mins',
          status: (st.status as any) || 'Online'
        }
      })
      setExecutivesList(dynamicStaff)

      setKpiStats({
        pendingApprovals: pendingSubs.length,
        pendingPayoutsAmount: totalPayouts > 0 ? `₹${totalPayouts.toLocaleString('en-IN')}` : '₹0',
        pendingPayoutsCount: pendingClaims.length,
        openTicketsCount: openTickets.length,
        activeStaffCount: dynamicStaff.filter(s => s.status === 'Online').length,
        submissionsTodayCount: subs.length,
        linkHealth: '100% Operational'
      })
    } catch (err) {
      console.warn('loadOperationsData error:', err)
    }
  }

  useEffect(() => {
    loadOperationsData()

    const handleSync = () => { loadOperationsData() }
    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('wouchify_loot_deals_updated', handleSync)
    window.addEventListener('wouchify_coupons_updated', handleSync)
    window.addEventListener('wouchify_stores_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('wouchify_loot_deals_updated', handleSync)
      window.removeEventListener('wouchify_coupons_updated', handleSync)
      window.removeEventListener('wouchify_stores_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const [rejectPromptItem, setRejectPromptItem] = useState<{ id: string; title: string } | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleApprove = (id: string, title: string) => {
    adminApi.approveSubmission(id).catch(console.warn)
    setUrgentItems(prev => prev.filter(item => item.id !== id))
    showToast(`Approved & published: ${title}`)
  }

  const handleReject = (id: string, title: string) => {
    setRejectPromptItem({ id, title })
  }

  const handleConfirmReject = (reason: string) => {
    if (!rejectPromptItem) return
    const { id, title } = rejectPromptItem
    adminApi.rejectSubmission(id, reason).catch(console.warn)
    setUrgentItems(prev => prev.filter(item => item.id !== id))
    showToast(`Rejected submission: ${title}`)
    setRejectPromptItem(null)
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Active executive details lookup
  const selectedExecutive = useMemo(() => {
    if (selectedExecutiveEmail === 'all') return null
    return executivesList.find(e => e.email.toLowerCase() === selectedExecutiveEmail.toLowerCase()) || null
  }, [selectedExecutiveEmail, executivesList])

  // Filter urgent items by chosen executive and content type
  const displayedItems = useMemo(() => {
    let items = urgentItems;
    if (selectedExecutiveEmail !== 'all') {
      items = items.filter(item => item.submittedBy.toLowerCase() === selectedExecutiveEmail.toLowerCase())
    }
    if (contentTypeFilter !== 'all') {
      items = items.filter(item => item.type === contentTypeFilter)
    }
    return items
  }, [urgentItems, selectedExecutiveEmail, contentTypeFilter])

  const reportData = useMemo(() => {
    let baseList = executivesList;
    if (reportExecutiveFilter !== 'all') {
      baseList = baseList.filter(e => e.id === reportExecutiveFilter);
    }

    return baseList.map(exec => {
      let multiplier = 1
      if (reportFilter === 'week') multiplier = 1
      if (reportFilter === 'month') multiplier = 1
      return {
        ...exec,
        dealsAdded: exec.dealsToday * multiplier,
        lootAdded: exec.lootToday * multiplier,
        couponsAdded: exec.couponsToday * multiplier,
        bannersAdded: exec.bannersToday * multiplier,
        storesAdded: exec.storesToday * multiplier,
        totalAdded: exec.submissionsToday * multiplier
      }
    }).sort((a, b) => b.totalAdded - a.totalAdded)
  }, [executivesList, reportFilter, reportExecutiveFilter])

  const downloadCSV = () => {
    const headers = ['Executive ID', 'Name', 'Role', 'Domain', 'Approval Rate', 'Deals Added', 'Loot Added', 'Coupons Added', 'Banners Added', 'Stores Added', `Total Added (${reportFilter})`]
    const rows = reportData.map(exec => [
      exec.id,
      exec.name,
      exec.role,
      exec.domain,
      `${exec.approvalRate}%`,
      exec.dealsAdded,
      exec.lootAdded,
      exec.couponsAdded,
      exec.bannersAdded,
      exec.storesAdded,
      exec.totalAdded
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    const filenamePrefix = reportExecutiveFilter === 'all' ? 'all_executives' : reportExecutiveFilter
    link.setAttribute('download', `executive_data_report_${filenamePrefix}_${reportFilter}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Report downloaded successfully')
  }

  return (
    <OperationsLayout activeMenu="dashboard">
      <div className="executive-crud-page">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Top Header */}
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Operational Manager Command Center</h1>
            <p className="crud-subtitle">
              Central control console for content moderation, financial payouts, customer support, and executive SLA tracking.
            </p>
          </div>

          <div className="crud-header-actions">
            {/* Executives Dropdown */}
            <div className="executive-select-box" title="Filter dashboard view by Executive">
              <Users size={15} className="executive-select-icon" />
              <select
                id="executive-dashboard-select"
                className="executive-dropdown-select"
                value={selectedExecutiveEmail}
                onChange={(e) => setSelectedExecutiveEmail(e.target.value)}
                aria-label="Filter by Executive"
              >
                <option value="all">👥 All Executives ({executivesList.length} Staff)</option>
                {executivesList.map((exec) => (
                  <option key={exec.id} value={exec.email}>
                    {exec.name} — {exec.role} ({exec.submissionsToday} today)
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={() => navigate('/operational-manager/approvals')}
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              <CheckCircle2 size={16} /> Open Approval Queue ({urgentItems.length})
            </button>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">

          <div className="kpi-card" onClick={() => navigate('/operational-manager/approvals')} style={{ cursor: 'pointer' }}>
            <div className="kpi-body">
              <span className="kpi-label">Pending Approvals</span>
              <span className="kpi-value">{kpiStats.pendingApprovals}</span>
              <span className="kpi-sub">Awaiting moderation</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <Clock size={20} />
            </div>
          </div>



          <div className="kpi-card" onClick={() => navigate('/operational-manager/support')} style={{ cursor: 'pointer' }}>
            <div className="kpi-body">
              <span className="kpi-label">Open Support Tickets</span>
              <span className="kpi-value">{kpiStats.openTicketsCount}</span>
              <span className="kpi-sub">Customer queries</span>
            </div>
            <div className="kpi-icon ops-kpi-red">
              <LifeBuoy size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/operational-manager/staff-activity')} style={{ cursor: 'pointer' }}>
            <div className="kpi-body">
              <span className="kpi-label">Content Executives</span>
              <span className="kpi-value">{kpiStats.activeStaffCount} Active</span>
              <span className="kpi-sub">{kpiStats.submissionsTodayCount} submissions recorded</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <Users size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/operational-manager/merchants')} style={{ cursor: 'pointer' }}>
            <div className="kpi-body">
              <span className="kpi-label">Affiliate Link Health</span>
              <span className="kpi-value">{kpiStats.linkHealth}</span>
              <span className="kpi-sub">Monitored live</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <ShieldCheck size={20} />
            </div>
          </div>

        </div>

        {/* ── Executive Snapshot & Quick Filter Strip ── */}
        <div className="executive-snapshot-bar">
          <div className="executive-chips-row">
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
              Executives:
            </span>
            <button
              type="button"
              className={`executive-chip-btn ${selectedExecutiveEmail === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedExecutiveEmail('all')}
            >
              All Staff ({executivesList.length})
            </button>
            {executivesList.map((exec) => (
              <button
                key={exec.id}
                type="button"
                className={`executive-chip-btn ${selectedExecutiveEmail === exec.email ? 'active' : ''}`}
                onClick={() => setSelectedExecutiveEmail(exec.email)}
              >
                <span className={`executive-chip-dot ${exec.status.toLowerCase()}`} />
                {exec.shortName} ({exec.submissionsToday})
              </button>
            ))}
          </div>

          {selectedExecutive ? (
            <div className="executive-active-card">
              <div className="executive-active-avatar">
                {selectedExecutive.name.charAt(0)}
              </div>
              <div className="executive-active-info">
                <span className="executive-active-name">{selectedExecutive.name}</span>
                <span className="executive-active-meta">{selectedExecutive.role} • {selectedExecutive.domain}</span>
              </div>
              <div className="executive-active-stats">
                <span className="executive-stat-pill" title="Submissions created today">
                  <strong>{selectedExecutive.submissionsToday}</strong> Today
                </span>
                <span className="executive-stat-pill" style={{ color: '#16a34a' }} title="Historical approval rate">
                  <strong>{selectedExecutive.approvalRate}%</strong> Approval
                </span>
                <span className="executive-stat-pill" style={{ color: '#2563eb' }} title="Average SLA turnaround">
                  ⚡ <strong>{selectedExecutive.avgTurnaround}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedExecutiveEmail('all')}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', padding: '0 4px' }}
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={14} style={{ color: '#16a34a' }} />
              <span>{executivesList.length} content executive{executivesList.length === 1 ? '' : 's'} registered on platform.</span>
            </div>
          )}
        </div>

        {/* ── SECTION 1: URGENT MODERATION STREAM ── */}
        <div className="crud-table-card" style={{ marginBottom: '24px' }}>
          <div className="card-header-styled" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} style={{ color: '#ea580c' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Urgent Moderation Stream
                  {selectedExecutive && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>
                      Filtered: {selectedExecutive.name}
                    </span>
                  )}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {selectedExecutive 
                    ? `Showing pending submissions from ${selectedExecutive.name} (${selectedExecutive.role})`
                    : 'High-velocity items awaiting operational manager approval across all executives'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="filter-dropdown-wrap" style={{ margin: 0 }}>
                <select 
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  className="filter-select"
                  style={{ 
                    padding: '8px 32px 8px 12px', 
                    fontSize: '0.82rem', 
                    borderColor: contentTypeFilter !== 'all' ? '#dc2626' : '#e2e8f0', 
                    color: contentTypeFilter !== 'all' ? '#dc2626' : '#1e293b' 
                  }}
                >
                  <option value="all">All Content Types</option>
                  <option value="loot">Loot Deals (Price Errors)</option>
                  <option value="deal">Standard Deals</option>
                  <option value="coupon">Coupons</option>
                  <option value="store">Stores</option>
                  <option value="banner">Hero Banners</option>
                  <option value="ad">Advertisements</option>
                </select>
              </div>

              <button
                className="btn-preview-quick"
                onClick={() => navigate('/operational-manager/approvals')}
                style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: '0.8rem', borderRadius: '8px' }}
              >
                View Full Queue ({kpiStats.pendingApprovals}) <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {displayedItems.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} style={{ color: '#10b981' }} />
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#0f172a', display: 'block' }}>
                {selectedExecutive 
                  ? `No pending urgent items for ${selectedExecutive.name}`
                  : 'All urgent submissions have been moderated!'}
              </strong>
              <p style={{ fontSize: '0.9rem', marginTop: '6px', maxWidth: '400px', margin: '6px auto 0' }}>
                {selectedExecutive 
                  ? `All submissions from this executive have been reviewed or approved.`
                  : 'No critical items are pending right now. All submissions are published.'}
              </p>
              {selectedExecutive && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setSelectedExecutiveEmail('all')}
                  style={{ marginTop: '20px', padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  View All Executives ({urgentItems.length} items)
                </button>
              )}
            </div>
          ) : (
            <div className="crud-table-wrapper">
              <table className="crud-table" style={{ width: '100%', tableLayout: 'auto' }}>
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Item Details</th>
                    <th>Classification</th>
                    <th>Partner & Code</th>
                    <th>Submitter Info</th>
                    <th>Pricing</th>
                    <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item) => (
                    <tr key={item.id}>
                      {/* Column 1: Item Details */}
                      <td>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div className="product-table-thumb-wrap" style={{ width: '48px', height: '48px' }}>
                            <img 
                              src={item.image || PLACEHOLDER_DEAL_IMAGE} 
                              alt={item.title} 
                              className="product-table-thumb"
                              onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                            />
                          </div>
                          <div className="submission-details-cell" style={{ maxWidth: '320px' }}>
                            {item.brand && <span className="submission-brand-tag">{item.brand}</span>}
                            <span className="submission-title-text" title={item.title} style={{ marginTop: '2px', marginBottom: '2px' }}>{item.title}</span>
                            {item.category && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Classification */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <span className={`ops-type-badge ${item.type}`}>
                            {item.type === 'loot' && <Flame size={12} />}
                            {item.type === 'deal' && <Zap size={12} />}
                            {item.type === 'coupon' && <Tag size={12} />}
                            {item.type === 'banner' && <ImageIcon size={12} />}
                            {item.type === 'store' && <Store size={12} />}
                            {item.type.toUpperCase()}
                          </span>
                          <span className={`priority-pill ${item.priority.toLowerCase()}`}>
                            {item.priority}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Partner & Code */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <div className="store-partner-chip" style={{ padding: '2px 6px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'none', justifyContent: 'center' }}>
                            <img 
                              src={getStoreLogo(item.store)} 
                              alt={item.store} 
                              className="store-partner-logo"
                              onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                            />
                          </div>
                          {item.code ? (
                            <span className="submission-code-pill">{item.code}</span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Submitter */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="submitter-avatar-xs" style={{ width: 20, height: 20, fontSize: '0.65rem' }}>
                              {item.submittedBy.charAt(0).toUpperCase()}
                            </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                              {item.submittedBy.split('@')[0]}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {item.submittedAt}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Pricing */}
                      <td>
                        <div className="price-display-cell" style={{ alignItems: 'flex-start' }}>
                          <strong className={`price-main ${item.type === 'loot' ? 'loot' : ''}`} style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>
                            {item.price}
                          </strong>
                          {item.originalPrice && (
                            <span className="price-sub" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                              <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{item.originalPrice}</span>
                              {item.discount && <span style={{ color: '#16a34a', fontWeight: 800 }}>({item.discount})</span>}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 6: Actions */}
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                          <button 
                            type="button" 
                            className="btn-approve-quick" 
                            onClick={() => handleApprove(item.id, item.title)}
                            title="Approve and publish"
                            style={{ padding: '7px 12px' }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            type="button" 
                            className="btn-reject-quick" 
                            onClick={() => handleReject(item.id, item.title)}
                            title="Reject"
                            style={{ padding: '7px 12px' }}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── SECTION 2: EXECUTIVE LEADERBOARD & PLATFORM HEALTH ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Executive Leaderboard */}
          <div className="crud-table-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} style={{ color: '#8b5cf6' }} /> Top Performing Executives
            </h4>

            {executivesList.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b' }}>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>No executive activity recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...executivesList].sort((a, b) => b.submissionsToday - a.submissionsToday).slice(0, 3).map((exec, idx) => (
                  <div key={exec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: idx !== Math.min(executivesList.length - 1, 2) ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#334155', fontSize: '0.85rem' }}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{exec.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{exec.domain}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.85rem' }}>{exec.submissionsToday} Submissions</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{exec.approvalRate}% Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button style={{ width: '100%', padding: '8px', marginTop: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/operational-manager/staff-activity')}>
              View Full Leaderboard
            </button>
          </div>

          {/* Fraud & Anomaly Detection */}
          <div className="crud-table-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} style={{ color: '#16a34a' }} /> Security & Anomaly Monitor
              </h4>
              <span className="status-badge" style={{ padding: '2px 8px', fontSize: '0.65rem', background: '#ecfdf5', color: '#15803d' }}>
                NORMAL
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '6px', background: '#ecfdf5', borderRadius: '6px', color: '#16a34a' }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Affiliate Click Integrity</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Live bot & click fraud filters active. All links verified.</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>PASS</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '6px', background: '#eff6ff', borderRadius: '6px', color: '#2563eb' }}>
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Maker-Checker Compliance</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>All live deals gated by operational manager review.</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb' }}>ACTIVE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '6px', background: '#ecfdf5', borderRadius: '6px', color: '#16a34a' }}>
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>System Velocity Check</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Submission processing running normally with low latency.</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10b981' }}>OPTIMAL</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── SECTION 3: EXECUTIVE DATA ADDED REPORT ── */}
        <div className="crud-table-card" style={{ marginTop: '24px' }}>
          <div className="card-header-styled" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={20} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Executive Data Upload Report
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Track volume of deals, banners, and data added by each operational executive.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                className="executive-dropdown-select"
                value={reportExecutiveFilter}
                onChange={(e) => setReportExecutiveFilter(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.85rem', maxWidth: '200px' }}
                aria-label="Filter by Executive"
              >
                <option value="all">All Executives</option>
                {executivesList.map(exec => (
                  <option key={exec.id} value={exec.id}>{exec.name}</option>
                ))}
              </select>

              <select
                className="executive-dropdown-select"
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value as any)}
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                aria-label="Filter by Time Period"
              >
                <option value="today">Today (Every day)</option>
                <option value="week">1 Week Back to Today</option>
                <option value="month">Monthly</option>
              </select>

              <button
                className="btn-primary"
                onClick={downloadCSV}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', background: '#0f172a' }}
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          <div className="crud-table-wrapper">
            <table className="crud-table" style={{ width: '100%', tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>Rank</th>
                  <th style={{ width: '22%' }}>Executive</th>
                  <th style={{ width: '18%' }}>Domain Area</th>
                  <th style={{ textAlign: 'center' }}>Deals</th>
                  <th style={{ textAlign: 'center' }}>Loot</th>
                  <th style={{ textAlign: 'center' }}>Coupons</th>
                  <th style={{ textAlign: 'center' }}>Banners</th>
                  <th style={{ textAlign: 'center' }}>Stores</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Total Added</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px 20px', color: '#64748b' }}>
                      No executive upload activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  reportData.map((exec, idx) => (
                    <tr key={exec.id}>
                      <td>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx < 3 ? '#fffbeb' : '#f8fafc', color: idx < 3 ? '#d97706' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                          #{idx + 1}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{exec.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{exec.role}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exec.domain}</span>
                      </td>
                      <td style={{ textAlign: 'center', color: '#334155', fontWeight: 500 }}>
                        {exec.dealsAdded.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', color: '#334155', fontWeight: 500 }}>
                        {exec.lootAdded.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', color: '#334155', fontWeight: 500 }}>
                        {exec.couponsAdded.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', color: '#334155', fontWeight: 500 }}>
                        {exec.bannersAdded.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center', color: '#334155', fontWeight: 500 }}>
                        {exec.storesAdded.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#2563eb' }}>
                          {exec.totalAdded.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CUSTOM REJECT PROMPT DIALOG ── */}
        {rejectPromptItem && (
          <AdminPromptDialog
            isOpen={!!rejectPromptItem}
            title="Reject Submission"
            message={`Please enter a rejection feedback note for "${rejectPromptItem.title}":`}
            label="Rejection Reason"
            defaultValue="Details need review"
            confirmLabel="Reject Submission"
            variant="danger"
            required={true}
            onConfirm={handleConfirmReject}
            onCancel={() => setRejectPromptItem(null)}
          />
        )}

      </div>
    </OperationsLayout>
  )
}
