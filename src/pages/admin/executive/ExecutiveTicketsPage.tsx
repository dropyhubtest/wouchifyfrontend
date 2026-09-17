import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Check,
  X,
  Clock,
  ArrowUpRight,
  MessageSquare,
  ShieldAlert,
  Send,
  ExternalLink,
  Info,
  Link as LinkIcon
} from 'lucide-react'
import { getStoreLogo, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { AdminPromptDialog } from '../../../components/common/AdminDialog'
import './ExecutiveShared.css'

export interface FlaggedTicket {
  id: string
  reportedAt: string
  reporterName: string
  reporterEmail: string
  issueType: string
  title: string
  store: string
  targetUrl: string
  couponCode?: string
  reportedPrice?: string
  actualPrice?: string
  priority: string
  status: string
  userNote: string
  resolutionNote?: string
  assignedTo?: string
  messages: {
    sender: 'user' | 'executive' | 'manager'
    senderName: string
    time: string
    text: string
  }[]
  entityType?: 'deal' | 'coupon' | 'store'
}

export const ExecutiveTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<FlaggedTicket[]>([])
  const [loading, setLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('all')

  // Drawer state
  const [inspectedTicket, setInspectedTicket] = useState<FlaggedTicket | null>(null)
  const [drawerTab, setDrawerTab] = useState<'overview' | 'timeline' | 'related'>('overview')
  const [replyText, setReplyText] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [promptDialog, setPromptDialog] = useState<{
    isOpen: boolean
    type: 'fixed' | 'escalate'
    ticket: FlaggedTicket
    title: string
    message: string
    label: string
    defaultValue: string
    confirmLabel: string
    variant: 'primary' | 'warning' | 'danger'
  } | null>(null)

  // Real data state for cross-referencing
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [rawCoupons, setRawCoupons] = useState<any[]>([])
  const [rawStores, setRawStores] = useState<any[]>([])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [ticketsRes, dealsRes, couponsRes, storesRes] = await Promise.all([
        adminApi.getSupportTickets(),
        adminApi.getDeals(),
        adminApi.getCoupons(),
        adminApi.getStores()
      ])

      const mappedTickets = (ticketsRes || []).map((t: any) => ({
        id: t.id || `TKT-${Math.floor(Math.random() * 10000)}`,
        reportedAt: t.createdAt || t.reportedAt || 'Just now',
        reporterName: t.userName || t.reporterName || 'Unknown User',
        reporterEmail: t.userEmail || t.reporterEmail || 'unknown@example.com',
        issueType: t.category || t.issueType || 'General Inquiry',
        title: t.subject || t.title || 'Untitled Ticket',
        store: t.store || 'Unknown Store',
        targetUrl: t.targetUrl || t.url || '#',
        couponCode: t.couponCode,
        reportedPrice: t.reportedPrice,
        actualPrice: t.actualPrice,
        priority: t.priority || 'Normal',
        status: t.status || 'Open',
        userNote: t.userNote || t.description || '',
        resolutionNote: t.resolutionNote,
        assignedTo: t.assignedTo,
        messages: t.messages || [],
        entityType: t.entityType || 'deal'
      }))

      setTickets(mappedTickets)
      if (Array.isArray(dealsRes)) setRawDeals(dealsRes)
      if (Array.isArray(couponsRes)) setRawCoupons(couponsRes)
      if (Array.isArray(storesRes)) setRawStores(storesRes)
    } catch (err) {
      console.warn('Failed to load tickets API:', err)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const handleSync = () => { loadData() }
    window.addEventListener('wouchify_tickets_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_tickets_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  // KPI Metrics
  const kpis = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'Open').length
    const inProgress = tickets.filter(t => t.status === 'In Progress' || t.status === 'Escalated').length
    const resolved = tickets.filter(t => t.status === 'Resolved').length
    const urgent = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length
    return { total, open, inProgress, resolved, urgent }
  }, [tickets])

  const openCount = kpis.open
  const urgentCount = kpis.urgent
  const inProgressCount = kpis.inProgress
  const resolvedCount = kpis.resolved

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (issueTypeFilter !== 'all' && t.issueType !== issueTypeFilter) return false

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const mId = t.id.toLowerCase().includes(q)
        const mTitle = t.title.toLowerCase().includes(q)
        const mStore = t.store.toLowerCase().includes(q)
        const mUser = t.reporterName.toLowerCase().includes(q)
        const mEmail = t.reporterEmail.toLowerCase().includes(q)
        if (!mId && !mTitle && !mStore && !mUser && !mEmail) return false
      }
      return true
    })
  }, [tickets, statusFilter, priorityFilter, issueTypeFilter, searchTerm])

  const handleMarkFixed = (ticket: FlaggedTicket) => {
    setPromptDialog({
      isOpen: true,
      type: 'fixed',
      ticket,
      title: `Mark Issue Fixed (${ticket.id})`,
      message: 'Please provide a resolution note detailing the fix applied to this deal or link.',
      label: 'Resolution Note',
      defaultValue: 'Affiliate link / deal price updated and verified healthy on live storefront.',
      confirmLabel: 'Resolve Issue',
      variant: 'primary'
    })
  }

  const handleEscalateToOps = (ticket: FlaggedTicket) => {
    setPromptDialog({
      isOpen: true,
      type: 'escalate',
      ticket,
      title: `Escalate to Operations Manager (${ticket.id})`,
      message: 'Please specify the reason why this issue requires Operations Manager review.',
      label: 'Escalation Reason',
      defaultValue: 'Merchant affiliate commission or tracking discrepancy requires Ops Manager intervention.',
      confirmLabel: 'Escalate to Ops',
      variant: 'warning'
    })
  }

  const handleConfirmPrompt = async (note: string) => {
    if (!promptDialog) return
    const { type, ticket } = promptDialog
    setPromptDialog(null)
    try {
      if (type === 'fixed') {
        await adminApi.updateSupportTicketStatus(ticket.id, 'Resolved')
        await adminApi.replySupportTicket(ticket.id, {
          sender: 'executive',
          senderName: 'Executive Staff',
          text: `Resolution: ${note}`,
          time: new Date().toLocaleString()
        })
        if (inspectedTicket?.id === ticket.id) setInspectedTicket(null)
        showToast(`Issue ${ticket.id} marked as Fixed & Resolved!`)
        loadData()
      } else if (type === 'escalate') {
        await adminApi.updateSupportTicketStatus(ticket.id, 'Escalated')
        await adminApi.replySupportTicket(ticket.id, {
          sender: 'executive',
          senderName: 'Executive Staff',
          text: `Escalated to Operations Manager: ${note}`,
          time: new Date().toLocaleString()
        })
        if (inspectedTicket?.id === ticket.id) setInspectedTicket(null)
        showToast(`Ticket ${ticket.id} escalated to Operations Manager`)
        loadData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkFalseReport = async (ticket: FlaggedTicket) => {
    try {
      await adminApi.updateSupportTicketStatus(ticket.id, 'False Report')
      await adminApi.replySupportTicket(ticket.id, {
        sender: 'executive',
        senderName: 'Executive Staff',
        text: 'Investigated report: Offer and pricing are functioning properly.',
        time: new Date().toLocaleString()
      })
      if (inspectedTicket?.id === ticket.id) setInspectedTicket(null)
      showToast(`Issue ${ticket.id} closed as False Report`)
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendDiscussionReply = async () => {
    if (!inspectedTicket || !replyText.trim()) return

    try {
      if (inspectedTicket.status === 'Open') {
        await adminApi.updateSupportTicketStatus(inspectedTicket.id, 'In Progress')
      }
      await adminApi.replySupportTicket(inspectedTicket.id, {
        sender: 'executive',
        senderName: 'Content Executive',
        text: replyText,
        time: new Date().toLocaleString()
      })
      
      setReplyText('')
      showToast('Note added to ticket history')
      loadData()
      setInspectedTicket(null)
    } catch (err) {
      console.error(err)
    }
  }

  const openDrawer = (ticket: FlaggedTicket) => {
    setInspectedTicket(ticket)
    setDrawerTab('overview')
  }

  // Related item helper
  const renderRelatedItem = () => {
    if (!inspectedTicket) return null
    const q = inspectedTicket.title.toLowerCase()
    const url = inspectedTicket.targetUrl?.toLowerCase()

    let relatedDeal = rawDeals.find(d => (d.title && d.title.toLowerCase().includes(q)) || (d.url && url && url !== '#' && d.url.includes(url)))
    let relatedCoupon = rawCoupons.find(c => (c.code && inspectedTicket.couponCode === c.code) || (c.title && c.title.toLowerCase().includes(q)))
    let relatedStore = rawStores.find(s => s.name?.toLowerCase() === inspectedTicket.store.toLowerCase())

    if (relatedDeal) {
      return (
        <div className="exec-drawer__item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <img src={getStoreLogo(relatedDeal.store)} alt="store" style={{ width: 40, height: 40, borderRadius: 8 }} />
             <div>
               <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{relatedDeal.title}</h4>
               <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Store: {relatedDeal.store} | Price: ₹{relatedDeal.salePrice}</p>
             </div>
          </div>
        </div>
      )
    } else if (relatedCoupon) {
      return (
        <div className="exec-drawer__item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <img src={getStoreLogo(relatedCoupon.store)} alt="store" style={{ width: 40, height: 40, borderRadius: 8 }} />
             <div>
               <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{relatedCoupon.title}</h4>
               <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Code: {relatedCoupon.code} | Store: {relatedCoupon.store}</p>
             </div>
          </div>
        </div>
      )
    } else if (relatedStore) {
      return (
        <div className="exec-drawer__item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <img src={relatedStore.logoUrl || getStoreLogo(relatedStore.name)} alt="store" style={{ width: 40, height: 40, borderRadius: 8 }} />
             <div>
               <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{relatedStore.name}</h4>
               <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Base Cashback: {relatedStore.cashbackRate}</p>
             </div>
          </div>
        </div>
      )
    }

    return <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No direct matching entity found in catalog.</div>
  }

  return (
    <ExecutiveLayout activeMenu="tickets">
      <div className="executive-crud-page">
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="crud-header">
          <div>
            <h1 className="crud-title">Flagged Issues & Broken Link Resolution Queue</h1>
            <p className="crud-subtitle">
              Review shopper-reported broken affiliate links, invalid promo coupons, and deal price discrepancies with 1-click fixes.
            </p>
          </div>
        </div>

        <div className="kpi-ribbon">
          <div className="kpi-card" onClick={() => setStatusFilter('Open')} style={{ cursor: 'pointer', border: statusFilter === 'Open' ? '1.5px solid #dc2626' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Open Flagged Issues</span>
              <span className="kpi-value">{openCount}</span>
              <span className="kpi-sub">Awaiting executive fix</span>
            </div>
            <div className="kpi-icon ops-kpi-red"><AlertTriangle size={20} /></div>
          </div>
          <div className="kpi-card" onClick={() => { setPriorityFilter('Urgent'); setStatusFilter('Open') }} style={{ cursor: 'pointer', border: priorityFilter === 'Urgent' ? '1.5px solid #ea580c' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Urgent Broken Links</span>
              <span className="kpi-value">{urgentCount}</span>
              <span className="kpi-sub">High revenue impact</span>
            </div>
            <div className="kpi-icon ops-kpi-orange"><ShieldAlert size={20} /></div>
          </div>
          <div className="kpi-card" onClick={() => setStatusFilter('In Progress')} style={{ cursor: 'pointer', border: statusFilter === 'In Progress' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">In Progress</span>
              <span className="kpi-value">{inProgressCount}</span>
              <span className="kpi-sub">Being investigated</span>
            </div>
            <div className="kpi-icon ops-kpi-blue"><Clock size={20} /></div>
          </div>
          <div className="kpi-card" onClick={() => setStatusFilter('Resolved')} style={{ cursor: 'pointer', border: statusFilter === 'Resolved' ? '1.5px solid #16a34a' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Resolved Issues</span>
              <span className="kpi-value">{resolvedCount}</span>
              <span className="kpi-sub">Fixed & updated</span>
            </div>
            <div className="kpi-icon ops-kpi-green"><CheckCircle2 size={20} /></div>
          </div>
        </div>

        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, deal title, store, or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="search-clear-btn" onClick={() => setSearchTerm('')}><X size={14} /></button>}
          </div>
          <div className="filter-dropdown-wrap">
            <select value={issueTypeFilter} onChange={e => setIssueTypeFilter(e.target.value)} className="filter-select">
              <option value="all">All Issue Categories</option>
              <option value="Broken Link">Broken Link</option>
              <option value="Invalid Coupon Code">Invalid Coupon Code</option>
              <option value="Price Discrepancy">Price Discrepancy</option>
              <option value="Expired Offer">Expired Offer</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
              <option value="False Report">False Report</option>
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="filter-select">
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        <div className="crud-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading tickets...</div>
          ) : (
            <div className="crud-table-wrapper">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>Issue ID & Date</th>
                    <th style={{ minWidth: '220px' }}>Reported Deal / Coupon</th>
                    <th style={{ width: '110px' }}>Category & Priority</th>
                    <th style={{ width: '100px' }}>Partner Store</th>
                    <th style={{ minWidth: '180px' }}>Shopper Feedback</th>
                    <th style={{ width: '90px' }}>Status</th>
                    <th style={{ minWidth: '240px', textAlign: 'right' }}>Executive Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(t => (
                    <tr key={t.id} onClick={() => openDrawer(t)} style={{ cursor: 'pointer' }}>
                      <td onClick={e => e.stopPropagation()}>
                        <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{t.id}</strong>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{t.reportedAt}</span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', lineHeight: 1.3 }}>{t.title}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            {t.couponCode && (
                              <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700 }}>
                                CODE: {t.couponCode}
                              </span>
                            )}
                            {t.reportedPrice && (
                              <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                                Reported: {t.reportedPrice} (Live: {t.actualPrice || 'N/A'})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                            {t.issueType}
                          </span>
                          <span className={`priority-pill ${t.priority.toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="store-partner-chip" style={{ justifyContent: 'center' }}>
                          <img src={getStoreLogo(t.store)} alt={t.store} className="store-partner-logo" onError={(e: any) => e.target.src = PLACEHOLDER_STORE_LOGO} />
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="executive-notes-bubble">"{t.userNote}"</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '2px' }}>By {t.reporterName}</span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <span className={`status-badge ${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <button type="button" className="action-btn view" onClick={() => openDrawer(t)} title="Inspect Ticket">
                            <MessageSquare size={15} />
                          </button>
                          <button type="button" className="btn-approve-quick" onClick={() => handleMarkFixed(t)} title="Mark Fixed" style={{ background: '#16a34a', padding: '6px 10px', fontSize: '0.75rem' }}>
                            <Check size={13} /> Fixed
                          </button>
                          <button type="button" className="btn-reject-quick" onClick={() => handleEscalateToOps(t)} title="Escalate" style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}>
                            <ArrowUpRight size={13} /> Escalate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No tickets found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── DEEP INSPECTION DRAWER ── */}
        {inspectedTicket && (
          <div className="exec-drawer-overlay" onClick={() => setInspectedTicket(null)}>
            <div className="exec-drawer" onClick={e => e.stopPropagation()}>
              <div className="exec-drawer__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="exec-drawer__avatar" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="exec-drawer__title">Ticket {inspectedTicket.id}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      Reported by {inspectedTicket.reporterName} ({inspectedTicket.reporterEmail})
                    </p>
                  </div>
                </div>
                <button className="exec-drawer__close" onClick={() => setInspectedTicket(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="exec-drawer__stats">
                <div className="exec-drawer__stats-card">
                  <div className="label">Status</div>
                  <div className="value">
                    <span className={`status-badge ${inspectedTicket.status.toLowerCase().replace(' ', '-')}`}>
                      {inspectedTicket.status}
                    </span>
                  </div>
                </div>
                <div className="exec-drawer__stats-card">
                  <div className="label">Priority</div>
                  <div className="value">
                    <span className={`priority-pill ${inspectedTicket.priority.toLowerCase()}`}>
                      {inspectedTicket.priority}
                    </span>
                  </div>
                </div>
                <div className="exec-drawer__stats-card">
                  <div className="label">Time</div>
                  <div className="value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {inspectedTicket.reportedAt}
                  </div>
                </div>
                <div className="exec-drawer__stats-card">
                  <div className="label">Replies</div>
                  <div className="value" style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {inspectedTicket.messages.length}
                  </div>
                </div>
              </div>

              <div className="exec-drawer__tabs">
                <button
                  className={`exec-drawer__tab ${drawerTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('overview')}
                >
                  <Info size={16} /> Overview
                </button>
                <button
                  className={`exec-drawer__tab ${drawerTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('timeline')}
                >
                  <Clock size={16} /> Thread Timeline
                </button>
                <button
                  className={`exec-drawer__tab ${drawerTab === 'related' ? 'active' : ''}`}
                  onClick={() => setDrawerTab('related')}
                >
                  <LinkIcon size={16} /> Related Item
                </button>
              </div>

              <div className="exec-drawer__body">
                {drawerTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#334155' }}>Ticket Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: '#64748b' }}>Issue Type:</span> <strong style={{ color: '#0f172a' }}>{inspectedTicket.issueType}</strong></div>
                        <div><span style={{ color: '#64748b' }}>Store:</span> <strong style={{ color: '#0f172a' }}>{inspectedTicket.store}</strong></div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={{ color: '#64748b' }}>Reported Title:</span> <strong style={{ color: '#0f172a' }}>{inspectedTicket.title}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Target URL</span>
                        {inspectedTicket.targetUrl && inspectedTicket.targetUrl !== '#' && (
                          <a href={inspectedTicket.targetUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                            <ExternalLink size={14} /> Test Link
                          </a>
                        )}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f172a', wordBreak: 'break-all', background: '#f1f5f9', padding: '10px', borderRadius: '6px' }}>
                        {inspectedTicket.targetUrl}
                      </div>
                    </div>

                    <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#92400e' }}>User Note</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309', lineHeight: 1.5 }}>"{inspectedTicket.userNote}"</p>
                    </div>
                  </div>
                )}

                {drawerTab === 'timeline' && (
                  <div>
                    <div className="ticket-thread-box" style={{ maxHeight: 'none', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      {inspectedTicket.messages.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center' }}>No messages yet.</p>
                      ) : (
                        inspectedTicket.messages.map((msg, idx) => (
                          <div key={idx} className={`ticket-msg-bubble ${msg.sender === 'user' ? 'user' : 'staff'}`} style={{ marginBottom: '12px' }}>
                            <div className="ticket-msg-header" style={{ marginBottom: '6px' }}>
                              <strong style={{ fontSize: '0.85rem' }}>{msg.senderName}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{msg.time}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{msg.text}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                        rows={3}
                        placeholder="Type a reply or internal note..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      />
                      <button
                        className="btn-save"
                        style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={handleSendDiscussionReply}
                        disabled={!replyText.trim()}
                      >
                        <Send size={14} /> Add Note
                      </button>
                    </div>
                  </div>
                )}

                {drawerTab === 'related' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Cross-Referenced Match</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Automatically searched catalogs for deals, coupons, or stores matching the reported title or URL.</p>
                    {renderRelatedItem()}
                  </div>
                )}
              </div>

              <div className="exec-drawer__actions">
                <button className="btn-cancel" onClick={() => setInspectedTicket(null)}>
                  Cancel
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-reject" onClick={() => handleMarkFalseReport(inspectedTicket)}>
                    False Report
                  </button>
                  <button className="btn-reject-quick" onClick={() => handleEscalateToOps(inspectedTicket)} style={{ background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe', padding: '0 16px', borderRadius: '6px', fontWeight: 600 }}>
                    Escalate
                  </button>
                  <button className="btn-save" onClick={() => handleMarkFixed(inspectedTicket)} style={{ background: '#16a34a' }}>
                    Mark Fixed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOM PROMPT DIALOG ── */}
        {promptDialog && (
          <AdminPromptDialog
            isOpen={promptDialog.isOpen}
            title={promptDialog.title}
            message={promptDialog.message}
            label={promptDialog.label}
            defaultValue={promptDialog.defaultValue}
            confirmLabel={promptDialog.confirmLabel}
            variant={promptDialog.variant}
            required={true}
            onConfirm={handleConfirmPrompt}
            onCancel={() => setPromptDialog(null)}
          />
        )}
      </div>
    </ExecutiveLayout>
  )
}
