import React, { useState, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { 
  CheckCircle2, 
  LifeBuoy, 
  Search, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  Wallet
} from 'lucide-react'
import './OperationsShared.css'

export interface SupportTicket {
  id: string
  userName: string
  userEmail: string
  category: 'Missing Cashback' | 'Broken Deal/Coupon' | 'KYC & Account' | 'Wallet Withdrawal' | 'General Inquiry'
  subject: string
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  createdAt: string
  messages: {
    sender: 'user' | 'staff'
    senderName: string
    time: string
    text: string
  }[]
  orderId?: string
  disputeAmount?: number
}

const initialTickets: SupportTicket[] = [
  {
    id: 'TKT-8921',
    userName: 'Akash Roy',
    userEmail: 'akash.roy@gmail.com',
    category: 'Missing Cashback',
    subject: 'Amazon order cashback of ₹850 not tracked after 72 hours',
    priority: 'Urgent',
    status: 'Open',
    createdAt: '45 mins ago',
    orderId: '402-1829038-1928391',
    disputeAmount: 850,
    messages: [
      {
        sender: 'user',
        senderName: 'Akash Roy',
        time: '45 mins ago',
        text: 'Hello, I ordered a boAt Soundbar on Amazon using the Wouchify Grab Deal link. It has been 72 hours and the ₹850 cashback is still not showing in my pending wallet.'
      }
    ]
  },
  {
    id: 'TKT-8922',
    userName: 'Meera Iyer',
    userEmail: 'meera.iyer@yahoo.com',
    category: 'Wallet Withdrawal',
    subject: 'Bank transfer failed but ₹1,200 deducted from wallet',
    priority: 'Urgent',
    status: 'Open',
    createdAt: '2 hours ago',
    disputeAmount: 1200,
    messages: [
      {
        sender: 'user',
        senderName: 'Meera Iyer',
        time: '2 hours ago',
        text: 'Hi team, I requested ₹1,200 UPI withdrawal to my HDFC VPA. The app says failed but balance was debited from my Wouchify wallet. Please refund or re-trigger.'
      }
    ]
  },
  {
    id: 'TKT-8923',
    userName: 'Gaurav Kulkarni',
    userEmail: 'gaurav.k@gmail.com',
    category: 'Broken Deal/Coupon',
    subject: 'Coupon code MYNTRAPRO showing invalid on checkout',
    priority: 'High',
    status: 'In Progress',
    createdAt: '3 hours ago',
    messages: [
      {
        sender: 'user',
        senderName: 'Gaurav Kulkarni',
        time: '3 hours ago',
        text: 'The coupon MYNTRAPRO listed under your coupon section is returning "Invalid Code" on Myntra app.'
      },
      {
        sender: 'staff',
        senderName: 'Wouchify Operations',
        time: '2 hours ago',
        text: 'Hi Gaurav, we are checking with the Myntra affiliate manager regarding coupon validity.'
      }
    ]
  },
  {
    id: 'TKT-8924',
    userName: 'Priya Nambiar',
    userEmail: 'priya.n@gmail.com',
    category: 'KYC & Account',
    subject: 'PAN card verification for withdrawals pending over 48h',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: 'Yesterday',
    messages: [
      {
        sender: 'user',
        senderName: 'Priya Nambiar',
        time: 'Yesterday',
        text: 'I submitted my PAN card document for withdrawal verification. Please approve.'
      }
    ]
  },
  {
    id: 'TKT-8925',
    userName: 'Tanmay Joshi',
    userEmail: 'tanmay.j@gmail.com',
    category: 'Missing Cashback',
    subject: 'Flipkart Big Billion Days extra cashback credited',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '08-Sep-2026',
    disputeAmount: 450,
    messages: [
      {
        sender: 'user',
        senderName: 'Tanmay Joshi',
        time: '08-Sep-2026',
        text: 'Claiming ₹450 cashback on order OD1829012.'
      },
      {
        sender: 'staff',
        senderName: 'Ops Manager',
        time: '08-Sep-2026',
        text: 'Verified with Flipkart sub-ID. ₹450 credited to your active wallet.'
      }
    ]
  }
]

export const OperationsSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Active Ticket Drawer / Modal
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [creditAmount, setCreditAmount] = useState<number>(0)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const openCount = tickets.filter(t => t.status === 'Open').length
  const urgentCount = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved' && t.status !== 'Closed').length
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchId = t.id.toLowerCase().includes(q)
        const matchUser = t.userName.toLowerCase().includes(q)
        const matchEmail = t.userEmail.toLowerCase().includes(q)
        const matchSubject = t.subject.toLowerCase().includes(q)
        if (!matchId && !matchUser && !matchEmail && !matchSubject) return false
      }
      return true
    })
  }, [tickets, categoryFilter, statusFilter, searchTerm])

  const handleOpenTicket = (ticket: SupportTicket) => {
    setActiveTicket(ticket)
    setReplyText('')
    setCreditAmount(ticket.disputeAmount || 0)
  }

  const handleSendReply = (newStatus: 'In Progress' | 'Resolved') => {
    if (!activeTicket) return
    if (!replyText.trim()) {
      alert('Please enter a reply message before sending.')
      return
    }

    const newMsg = {
      sender: 'staff' as const,
      senderName: 'Operational Manager',
      time: 'Just now',
      text: replyText
    }

    const updated = {
      ...activeTicket,
      status: newStatus,
      messages: [...activeTicket.messages, newMsg]
    }

    setTickets(prev => prev.map(t => t.id === activeTicket.id ? updated : t))
    setActiveTicket(updated)
    setReplyText('')
    showToast(`Reply sent • Ticket status updated to ${newStatus}`)
  }

  const handleCreditWalletDirectly = () => {
    if (!activeTicket || creditAmount <= 0) return
    if (window.confirm(`Instantly credit ₹${creditAmount} to ${activeTicket.userName}'s wallet and resolve ticket?`)) {
      const newMsg = {
        sender: 'staff' as const,
        senderName: 'Operations Billing',
        time: 'Just now',
        text: `Resolution: An instant goodwill refund of ₹${creditAmount} has been credited to your Wouchify wallet. Ticket marked resolved.`
      }
      const updated: SupportTicket = {
        ...activeTicket,
        status: 'Resolved',
        messages: [...activeTicket.messages, newMsg]
      }
      setTickets(prev => prev.map(t => t.id === activeTicket.id ? updated : t))
      setActiveTicket(updated)
      showToast(`Credited ₹${creditAmount} to ${activeTicket.userName}'s wallet`)
    }
  }

  return (
    <OperationsLayout activeMenu="support" pendingCounts={{ support: openCount }}>
      <div className="executive-crud-page">
        
        {/* Toast */}
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Customer Support & Dispute Console</h1>
            <p className="crud-subtitle">
              Resolve shopper inquiries, investigate missing cashback claims, troubleshoot broken coupons, and manage wallet disputes.
            </p>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          
          <div className="kpi-card" onClick={() => setStatusFilter('Open')} style={{ cursor: 'pointer', border: statusFilter === 'Open' ? '1.5px solid #ea580c' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Open Tickets</span>
              <span className="kpi-value">{openCount}</span>
              <span className="kpi-sub">Awaiting first response</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <LifeBuoy size={20} />
            </div>
          </div>

          <div className="kpi-card" style={{ cursor: 'pointer' }}>
            <div className="kpi-body">
              <span className="kpi-label">Urgent Disputes</span>
              <span className="kpi-value">{urgentCount}</span>
              <span className="kpi-sub">High financial priority</span>
            </div>
            <div className="kpi-icon ops-kpi-red">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setStatusFilter('In Progress')} style={{ cursor: 'pointer', border: statusFilter === 'In Progress' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">In Progress</span>
              <span className="kpi-value">{inProgressCount}</span>
              <span className="kpi-sub">Under merchant review</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Clock size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setStatusFilter('Resolved')} style={{ cursor: 'pointer', border: statusFilter === 'Resolved' ? '1.5px solid #16a34a' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Resolved</span>
              <span className="kpi-value">{resolvedCount}</span>
              <span className="kpi-sub">Satisfied shoppers</span>
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
              placeholder="Search by Ticket ID, User, Email or Subject…" 
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Missing Cashback">Missing Cashback</option>
              <option value="Wallet Withdrawal">Wallet Withdrawal</option>
              <option value="Broken Deal/Coupon">Broken Deal/Coupon</option>
              <option value="KYC & Account">KYC & Account</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="crud-table-card">
          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Ticket ID & Date</th>
                  <th>Customer Details</th>
                  <th>Category</th>
                  <th>Subject & Dispute Summary</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{t.id}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{t.createdAt}</span>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>{t.userName}</strong>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{t.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ maxWidth: '320px' }}>
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block', lineHeight: 1.35 }}>
                          {t.subject}
                        </strong>
                        {t.disputeAmount && (
                          <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700 }}>
                            Dispute Value: ₹{t.disputeAmount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`priority-pill ${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${t.status.toLowerCase().replace(' ', '-')}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="btn-approve-quick" 
                        onClick={() => handleOpenTicket(t)}
                        style={{ background: '#2563eb' }}
                      >
                        <MessageSquare size={13} /> Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── TICKET REPLY & RESOLUTION MODAL ── */}
        {activeTicket && (
          <div className="crud-modal-overlay" onClick={() => setActiveTicket(null)}>
            <div className="crud-modal" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <LifeBuoy size={12} /> Support Case #{activeTicket.id}
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>{activeTicket.subject}</h3>
                </div>
                <button className="modal-close" onClick={() => setActiveTicket(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* User & Order Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Customer: </span>
                    <strong style={{ color: '#0f172a' }}>{activeTicket.userName}</strong> ({activeTicket.userEmail})
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Category: </span>
                    <strong style={{ color: '#0f172a' }}>{activeTicket.category}</strong>
                  </div>
                </div>

                {/* Message Thread History */}
                <div className="ticket-thread-box">
                  {activeTicket.messages.map((msg, idx) => (
                    <div key={idx} className={`ticket-msg-bubble ${msg.sender}`}>
                      <div className="ticket-msg-header">
                        <strong>{msg.senderName}</strong>
                        <span>{msg.time}</span>
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Resolution Templates */}
                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>Quick Response Templates:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {[
                      'Cashback confirmed & credited to your wallet.',
                      'Merchant tracking takes up to 72 hours. Please check back tomorrow.',
                      'Coupon has been verified and updated with the merchant team.',
                      'KYC verification successful. You can now request payouts.'
                    ].map(tmpl => (
                      <button 
                        key={tmpl}
                        type="button" 
                        className="quick-preset-btn"
                        onClick={() => setReplyText(tmpl)}
                      >
                        {tmpl.slice(0, 40)}…
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reply Input */}
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Staff Reply Message</label>
                  <textarea 
                    rows={3} 
                    placeholder="Type your response to the user…" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>

                {/* Direct Wallet Credit Tool (for missing cashback disputes) */}
                {activeTicket.disputeAmount && activeTicket.disputeAmount > 0 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#166534', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Wallet size={15} /> Instant Goodwill Wallet Credit
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
                        Dispute Claim: ₹{activeTicket.disputeAmount}
                      </span>
                    </div>

                    <button 
                      type="button" 
                      className="btn-approve-quick"
                      onClick={handleCreditWalletDirectly}
                    >
                      Credit ₹{activeTicket.disputeAmount} & Resolve
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setActiveTicket(null)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn-save" 
                  style={{ background: '#3b82f6' }}
                  onClick={() => handleSendReply('In Progress')}
                >
                  <Send size={15} /> Reply (Keep In Progress)
                </button>
                <button 
                  type="button" 
                  className="btn-save" 
                  style={{ background: '#16a34a' }}
                  onClick={() => handleSendReply('Resolved')}
                >
                  <Check size={16} /> Reply & Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </OperationsLayout>
  )
}
