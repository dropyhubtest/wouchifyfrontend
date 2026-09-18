import React, { useState, useEffect, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { adminApi } from '../../../services/adminApi'
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
import { AdminConfirmDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

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

export const OperationsSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Active Ticket Drawer / Modal
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [creditAmount, setCreditAmount] = useState<number>(0)
  const [confirmCreditModal, setConfirmCreditModal] = useState(false)
  const [supportAlert, setSupportAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'danger' | 'info' | 'success' } | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Load from backend API
  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = await adminApi.getSupportTickets()
      if (Array.isArray(res)) {
        const mapped: SupportTicket[] = res.map((t: any, idx: number) => ({
          id: t.ticketId || t._id || t.id || `TKT-${8900 + idx}`,
          userName: t.userName || 'Customer',
          userEmail: t.userEmail || 'customer@wouchify.com',
          category: t.category || 'Missing Cashback',
          subject: t.subject || 'Support Ticket',
          priority: t.priority || 'Medium',
          status: t.status || 'Open',
          createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently',
          orderId: t.orderId,
          disputeAmount: t.disputeAmount,
          messages: Array.isArray(t.messages) && t.messages.length > 0 ? t.messages : [
            {
              sender: 'user',
              senderName: t.userName || 'Customer',
              time: 'Recently',
              text: t.subject || 'Query details'
            }
          ]
        }))
        setTickets(mapped)
      } else {
        setTickets([])
      }
    } catch (err) {
      console.warn('API error loading support tickets:', err)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // KPIs
  const openCount = tickets.filter(t => t.status === 'Open').length
  const urgentCount = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchUser = t.userName.toLowerCase().includes(q)
        const matchEmail = t.userEmail.toLowerCase().includes(q)
        const matchSubject = t.subject.toLowerCase().includes(q)
        const matchId = t.id.toLowerCase().includes(q)
        if (!matchUser && !matchEmail && !matchSubject && !matchId) return false
      }
      return true
    })
  }, [tickets, statusFilter, searchTerm])

  const handleOpenTicket = (ticket: SupportTicket) => {
    setActiveTicket(ticket)
    setReplyText('')
    setCreditAmount(ticket.disputeAmount || 0)
  }

  const handleSendReply = (newStatus: 'In Progress' | 'Resolved') => {
    if (!activeTicket) return
    if (!replyText.trim()) {
      setSupportAlert({ title: 'Missing Reply Message', message: 'Please enter a reply message before sending.', variant: 'warning' })
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

    adminApi.replySupportTicket(activeTicket.id, newMsg).catch(console.warn)
    adminApi.updateSupportTicketStatus(activeTicket.id, newStatus).catch(console.warn)

    setTickets(prev => prev.map(t => t.id === activeTicket.id ? updated : t))
    setActiveTicket(updated)
    setReplyText('')
    showToast(`Reply sent • Ticket status updated to ${newStatus}`)
  }

  const handleCreditWalletDirectly = () => {
    if (!activeTicket || creditAmount <= 0) return
    setConfirmCreditModal(true)
  }

  const confirmCreditWalletExecution = () => {
    if (!activeTicket || creditAmount <= 0) return
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

    adminApi.replySupportTicket(activeTicket.id, newMsg).catch(console.warn)
    adminApi.updateSupportTicketStatus(activeTicket.id, 'Resolved').catch(console.warn)

    setTickets(prev => prev.map(t => t.id === activeTicket.id ? updated : t))
    setActiveTicket(updated)
    setConfirmCreditModal(false)
    showToast(`Credited ₹${creditAmount} to ${activeTicket.userName}'s wallet`)
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
          {loading ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <Clock size={36} style={{ color: '#2563eb', margin: '0 auto 12px', display: 'block', animation: 'spin 1.5s linear infinite' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Loading Support Tickets…</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Syncing with customer support desk</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 size={42} style={{ color: '#16a34a', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>No Support Tickets Found</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No support tickets match your search or filter criteria.' 
                  : 'All shopper inquiries and tickets have been resolved.'}
              </p>
            </div>
          ) : (
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
          )}
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

        {/* ── CUSTOM CONFIRM DIALOG (WALLET CREDIT) ── */}
        <AdminConfirmDialog
          isOpen={confirmCreditModal}
          title="Direct Wallet Credit"
          message={activeTicket ? `Are you sure you want to instantly credit ₹${creditAmount} to ${activeTicket.userName}'s wallet and mark ticket #${activeTicket.id} as Resolved?` : ''}
          confirmLabel={`Credit ₹${creditAmount}`}
          cancelLabel="Cancel"
          variant="primary"
          icon="check"
          onConfirm={confirmCreditWalletExecution}
          onCancel={() => setConfirmCreditModal(false)}
        />

        {/* ── CUSTOM ALERT DIALOG ── */}
        {supportAlert && (
          <AdminAlertDialog
            isOpen={!!supportAlert}
            title={supportAlert.title}
            message={supportAlert.message}
            variant={supportAlert.variant || 'warning'}
            buttonLabel="Understood"
            onClose={() => setSupportAlert(null)}
          />
        )}

      </div>
    </OperationsLayout>
  )
}
