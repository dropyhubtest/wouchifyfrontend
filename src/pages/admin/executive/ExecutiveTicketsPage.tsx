import React, { useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
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
  ExternalLink
} from 'lucide-react'
import { getStoreLogo, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import './ExecutiveShared.css'

export interface FlaggedTicket {
  id: string
  reportedAt: string
  reporterName: string
  reporterEmail: string
  issueType: 'Broken Link' | 'Invalid Coupon Code' | 'Price Discrepancy' | 'Expired Offer' | 'Out of Stock'
  title: string
  store: string
  targetUrl: string
  couponCode?: string
  reportedPrice?: string
  actualPrice?: string
  priority: 'Urgent' | 'High' | 'Normal'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated' | 'False Report'
  userNote: string
  resolutionNote?: string
  assignedTo?: string
  messages: {
    sender: 'user' | 'executive' | 'manager'
    senderName: string
    time: string
    text: string
  }[]
}

const INITIAL_FLAGGED_TICKETS: FlaggedTicket[] = [
  {
    id: 'FLG-101',
    reportedAt: '18 mins ago',
    reporterName: 'Vikram Mehta',
    reporterEmail: 'vikram.m@gmail.com',
    issueType: 'Broken Link',
    title: 'Sony WH-1000XM5 ANC Headphones Price Drop at ₹4,999',
    store: 'Amazon',
    targetUrl: 'https://amazon.in/dp/B09XS7JWHH?tag=wouchify-21',
    priority: 'Urgent',
    status: 'Open',
    userNote: 'The affiliate link leads to Amazon 404 page (Dog error page). Please update with the working ASIN link.',
    messages: [
      {
        sender: 'user',
        senderName: 'Vikram Mehta',
        time: '18 mins ago',
        text: 'The Amazon link gives page not found when clicking Grab Deal.'
      }
    ]
  },
  {
    id: 'FLG-102',
    reportedAt: '45 mins ago',
    reporterName: 'Shreya Roy',
    reporterEmail: 'shreya.roy@yahoo.com',
    issueType: 'Invalid Coupon Code',
    title: 'Myntra Flat ₹500 OFF on Orders Above ₹1,999',
    store: 'Myntra',
    couponCode: 'MYNTRAPRO',
    targetUrl: 'https://myntra.com/puma-speedcat',
    priority: 'High',
    status: 'Open',
    userNote: 'Coupon code MYNTRAPRO shows "Coupon expired or ineligible for cart items" at Myntra payment screen.',
    messages: [
      {
        sender: 'user',
        senderName: 'Shreya Roy',
        time: '45 mins ago',
        text: 'Tried using code MYNTRAPRO on ₹2,400 cart but was rejected.'
      }
    ]
  },
  {
    id: 'FLG-103',
    reportedAt: '2 hours ago',
    reporterName: 'Aditya Gupta',
    reporterEmail: 'aditya.g@outlook.com',
    issueType: 'Price Discrepancy',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
    store: 'Flipkart',
    reportedPrice: '₹1,09,999',
    actualPrice: '₹1,24,999',
    targetUrl: 'https://flipkart.com/samsung-s24-ultra',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Rahul (Content Exec)',
    userNote: 'Wouchify lists this at ₹1,09,999, but Flipkart current live selling price is ₹1,24,999.',
    messages: [
      {
        sender: 'user',
        senderName: 'Aditya Gupta',
        time: '2 hours ago',
        text: 'Price increased back to ₹1,24,999 on Flipkart.'
      },
      {
        sender: 'executive',
        senderName: 'Rahul (Content Exec)',
        time: '1 hour ago',
        text: 'Checking if bank instant discount coupon is still active or expired.'
      }
    ]
  },
  {
    id: 'FLG-104',
    reportedAt: '4 hours ago',
    reporterName: 'Neha Deshmukh',
    reporterEmail: 'neha.d@gmail.com',
    issueType: 'Expired Offer',
    title: 'Puma Speedcat OG Leather Sneakers Glitch',
    store: 'Myntra',
    targetUrl: 'https://myntra.com',
    priority: 'Normal',
    status: 'Resolved',
    userNote: 'Price returned back to ₹7,999 from glitch price of ₹949.',
    resolutionNote: 'Glitch deal expired on merchant store. Marked as Expired and hidden from live storefront.',
    messages: [
      {
        sender: 'user',
        senderName: 'Neha Deshmukh',
        time: '4 hours ago',
        text: 'Price returned back to ₹7,999.'
      },
      {
        sender: 'executive',
        senderName: 'Executive Team',
        time: '3 hours ago',
        text: 'Deal expired on Myntra. Catalog status updated.'
      }
    ]
  },
  {
    id: 'FLG-105',
    reportedAt: 'Yesterday',
    reporterName: 'Kunal Sen',
    reporterEmail: 'kunal.s@gmail.com',
    issueType: 'Broken Link',
    title: 'Swiggy Flat 50% Off First Order Promo',
    store: 'Swiggy',
    targetUrl: 'https://swiggy.com/special',
    priority: 'Normal',
    status: 'False Report',
    userNote: 'Coupon code not triggering discount on my account.',
    resolutionNote: 'Verified link and coupon. Offer requires new user phone number authentication to trigger discount.',
    messages: [
      {
        sender: 'user',
        senderName: 'Kunal Sen',
        time: 'Yesterday',
        text: 'Not working on my existing account.'
      },
      {
        sender: 'executive',
        senderName: 'Executive Team',
        time: 'Yesterday',
        text: 'Verified terms: Applicable strictly for new user accounts.'
      }
    ]
  }
]

export const ExecutiveTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<FlaggedTicket[]>(INITIAL_FLAGGED_TICKETS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('all')

  // Detail Modal / Drawer State
  const [activeTicket, setActiveTicket] = useState<FlaggedTicket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const openCount = tickets.filter(t => t.status === 'Open').length
  const urgentCount = tickets.filter(t => t.priority === 'Urgent' && t.status === 'Open').length
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length

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

  // Quick Action 1: Mark Fixed & Update Deal
  const handleMarkFixed = (ticket: FlaggedTicket) => {
    const resolutionNote = prompt(
      `Enter resolution note for ${ticket.id}:`,
      'Affiliate link / deal price updated and verified healthy on live storefront.'
    )
    if (!resolutionNote) return

    const updated: FlaggedTicket = {
      ...ticket,
      status: 'Resolved',
      resolutionNote,
      messages: [
        ...ticket.messages,
        {
          sender: 'executive',
          senderName: 'Executive Staff',
          time: 'Just now',
          text: `Resolution: ${resolutionNote}`
        }
      ]
    }

    setTickets(prev => prev.map(t => (t.id === ticket.id ? updated : t)))
    if (activeTicket?.id === ticket.id) setActiveTicket(updated)
    showToast(`Issue ${ticket.id} marked as Fixed & Resolved!`)
  }

  // Quick Action 2: Escalate to Ops Manager
  const handleEscalateToOps = (ticket: FlaggedTicket) => {
    const reason = prompt(
      `Enter escalation note for Operations Manager:`,
      'Merchant affiliate commission or tracking discrepancy requires Ops Manager intervention.'
    )
    if (!reason) return

    const updated: FlaggedTicket = {
      ...ticket,
      status: 'Escalated',
      messages: [
        ...ticket.messages,
        {
          sender: 'executive',
          senderName: 'Executive Staff',
          time: 'Just now',
          text: `Escalated to Operations Manager: ${reason}`
        }
      ]
    }

    setTickets(prev => prev.map(t => (t.id === ticket.id ? updated : t)))
    if (activeTicket?.id === ticket.id) setActiveTicket(updated)
    showToast(`Ticket ${ticket.id} escalated to Operations Manager`)
  }

  // Quick Action 3: Mark False Report
  const handleMarkFalseReport = (ticket: FlaggedTicket) => {
    const updated: FlaggedTicket = {
      ...ticket,
      status: 'False Report',
      resolutionNote: 'Verified deal is working accurately as intended on merchant app.',
      messages: [
        ...ticket.messages,
        {
          sender: 'executive',
          senderName: 'Executive Staff',
          time: 'Just now',
          text: 'Investigated report: Offer and pricing are functioning properly.'
        }
      ]
    }

    setTickets(prev => prev.map(t => (t.id === ticket.id ? updated : t)))
    if (activeTicket?.id === ticket.id) setActiveTicket(updated)
    showToast(`Issue ${ticket.id} closed as False Report`)
  }

  // Send reply inside modal
  const handleSendDiscussionReply = () => {
    if (!activeTicket || !replyText.trim()) return

    const newMsg = {
      sender: 'executive' as const,
      senderName: 'Content Executive',
      time: 'Just now',
      text: replyText
    }

    const updated: FlaggedTicket = {
      ...activeTicket,
      status: activeTicket.status === 'Open' ? 'In Progress' : activeTicket.status,
      messages: [...activeTicket.messages, newMsg]
    }

    setTickets(prev => prev.map(t => (t.id === activeTicket.id ? updated : t)))
    setActiveTicket(updated)
    setReplyText('')
    showToast('Note added to ticket history')
  }

  return (
    <ExecutiveLayout activeMenu="tickets">
      <div className="executive-crud-page">
        {/* Toast */}
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Flagged Issues & Broken Link Resolution Queue</h1>
            <p className="crud-subtitle">
              Review shopper-reported broken affiliate links, invalid promo coupons, and deal price discrepancies with 1-click fixes.
            </p>
          </div>
        </div>

        {/* KPI Ribbon */}
        <div className="kpi-ribbon">
          <div
            className="kpi-card"
            onClick={() => setStatusFilter('Open')}
            style={{ cursor: 'pointer', border: statusFilter === 'Open' ? '1.5px solid #dc2626' : undefined }}
          >
            <div className="kpi-body">
              <span className="kpi-label">Open Flagged Issues</span>
              <span className="kpi-value">{openCount}</span>
              <span className="kpi-sub">Awaiting executive fix</span>
            </div>
            <div className="kpi-icon ops-kpi-red">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => {
              setPriorityFilter('Urgent')
              setStatusFilter('Open')
            }}
            style={{ cursor: 'pointer', border: priorityFilter === 'Urgent' ? '1.5px solid #ea580c' : undefined }}
          >
            <div className="kpi-body">
              <span className="kpi-label">Urgent Broken Links</span>
              <span className="kpi-value">{urgentCount}</span>
              <span className="kpi-sub">High revenue impact</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <ShieldAlert size={20} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => setStatusFilter('In Progress')}
            style={{ cursor: 'pointer', border: statusFilter === 'In Progress' ? '1.5px solid #2563eb' : undefined }}
          >
            <div className="kpi-body">
              <span className="kpi-label">In Progress</span>
              <span className="kpi-value">{inProgressCount}</span>
              <span className="kpi-sub">Being investigated</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Clock size={20} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => setStatusFilter('Resolved')}
            style={{ cursor: 'pointer', border: statusFilter === 'Resolved' ? '1.5px solid #16a34a' : undefined }}
          >
            <div className="kpi-body">
              <span className="kpi-label">Resolved Issues</span>
              <span className="kpi-value">{resolvedCount}</span>
              <span className="kpi-sub">Fixed & updated</span>
            </div>
            <div className="kpi-icon ops-kpi-green">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Issue ID, deal title, store, or reporter email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-dropdown-wrap">
            <select
              value={issueTypeFilter}
              onChange={e => setIssueTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Issue Categories</option>
              <option value="Broken Link">Broken Link</option>
              <option value="Invalid Coupon Code">Invalid Coupon Code</option>
              <option value="Price Discrepancy">Price Discrepancy</option>
              <option value="Expired Offer">Expired Offer</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
              <option value="False Report">False Report</option>
            </select>

            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Issues Queue Table */}
        <div className="crud-table-card">
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
                  <tr key={t.id}>
                    <td>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{t.id}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{t.reportedAt}</span>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', lineHeight: 1.3 }}>
                          {t.title}
                        </strong>
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
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                          {t.issueType}
                        </span>
                        <span className={`priority-pill ${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="store-partner-chip" style={{ justifyContent: 'center' }}>
                        <img
                          src={getStoreLogo(t.store)}
                          alt={t.store}
                          className="store-partner-logo"
                          onError={(e: any) => {
                            e.target.src = PLACEHOLDER_STORE_LOGO
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="executive-notes-bubble">
                        "{t.userNote}"
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                        By {t.reporterName}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${t.status.toLowerCase().replace(' ', '-')}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="action-btn view"
                          onClick={() => setActiveTicket(t)}
                          title="Open Ticket Thread & Details"
                        >
                          <MessageSquare size={15} />
                        </button>

                        <button
                          type="button"
                          className="btn-approve-quick"
                          onClick={() => handleMarkFixed(t)}
                          title="Mark Fixed & Update Storefront"
                          style={{ background: '#16a34a', padding: '6px 10px', fontSize: '0.75rem' }}
                        >
                          <Check size={13} /> Fixed
                        </button>

                        <button
                          type="button"
                          className="btn-reject-quick"
                          onClick={() => handleEscalateToOps(t)}
                          title="Escalate to Operations Manager"
                          style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}
                        >
                          <ArrowUpRight size={13} /> Escalate
                        </button>

                        <button
                          type="button"
                          className="btn-reject-quick"
                          onClick={() => handleMarkFalseReport(t)}
                          title="Mark as False Report"
                          style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── TICKET DETAIL MODAL / DRAWER ── */}
        {activeTicket && (
          <div className="crud-modal-overlay" onClick={() => setActiveTicket(null)}>
            <div className="crud-modal" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <AlertTriangle size={12} /> Issue Ticket #{activeTicket.id}
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>
                    {activeTicket.title}
                  </h3>
                </div>
                <button className="modal-close" onClick={() => setActiveTicket(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* Meta details bar */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Reporter: </span>
                    <strong>{activeTicket.reporterName}</strong> ({activeTicket.reporterEmail})
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Store: </span>
                    <strong>{activeTicket.store}</strong> • Category: <strong>{activeTicket.issueType}</strong>
                  </div>
                </div>

                {/* Target Link Box with Quick Verify Action */}
                <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Reported Target Link:
                    </span>
                    <a
                      href={activeTicket.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} /> Test Live Link
                    </a>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#0f172a', wordBreak: 'break-all' }}>
                    {activeTicket.targetUrl}
                  </div>
                </div>

                {/* Message Thread History */}
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                    Discussion & Resolution Timeline
                  </span>
                  <div className="ticket-thread-box" style={{ maxHeight: '200px' }}>
                    {activeTicket.messages.map((msg, idx) => (
                      <div key={idx} className={`ticket-msg-bubble ${msg.sender === 'user' ? 'user' : 'staff'}`}>
                        <div className="ticket-msg-header">
                          <strong>{msg.senderName}</strong>
                          <span>{msg.time}</span>
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Input */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Executive Internal Note / Resolution Action</label>
                  <textarea
                    rows={3}
                    placeholder="Enter notes on fixes applied or reasons for escalation..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-approve-quick"
                    onClick={() => handleMarkFixed(activeTicket)}
                    style={{ background: '#16a34a' }}
                  >
                    <Check size={14} /> Mark Fixed & Update Deal
                  </button>

                  <button
                    type="button"
                    className="btn-reject-quick"
                    onClick={() => handleEscalateToOps(activeTicket)}
                    style={{ background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}
                  >
                    <ArrowUpRight size={14} /> Escalate to Ops
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-cancel" onClick={() => setActiveTicket(null)}>
                    Close
                  </button>
                  {replyText.trim() && (
                    <button
                      type="button"
                      className="btn-save"
                      onClick={handleSendDiscussionReply}
                    >
                      <Send size={14} /> Add Note
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
