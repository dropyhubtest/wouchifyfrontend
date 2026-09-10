import React, { useState, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { 
  CheckCircle2, 
  Wallet, 
  Search, 
  Download, 
  Check, 
  X, 
  Eye, 
  Clock, 
  Receipt,
  TrendingUp
} from 'lucide-react'
import './OperationsShared.css'
import { getStoreLogo } from '../../../data/dealsPage'

export interface CashbackClaim {
  id: string
  userName: string
  userEmail: string
  store: string
  orderId: string
  orderAmount: string
  cashbackAmount: number
  claimedAt: string
  status: 'Pending' | 'Approved' | 'Processed' | 'Rejected'
  payoutMethod: 'UPI' | 'Bank Transfer'
  payoutDetails: string
  receiptUrl?: string
  notes?: string
}

const initialClaims: CashbackClaim[] = [
  {
    id: 'CB-9021',
    userName: 'Vikramaditya Sharma',
    userEmail: 'vikram.sharma@gmail.com',
    store: 'Amazon',
    orderId: '402-8921820-1928301',
    orderAmount: '₹24,999',
    cashbackAmount: 1250,
    claimedAt: 'Today, 11:20 AM',
    status: 'Pending',
    payoutMethod: 'UPI',
    payoutDetails: 'vikram.sharma@okhdfcbank',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop',
    notes: 'Purchased OnePlus 12 via Amazon affiliate link.'
  },
  {
    id: 'CB-9022',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.d@outlook.com',
    store: 'Myntra',
    orderId: 'MYN-89201948',
    orderAmount: '₹5,400',
    cashbackAmount: 432,
    claimedAt: 'Today, 10:15 AM',
    status: 'Pending',
    payoutMethod: 'UPI',
    payoutDetails: 'ananya99@paytm',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop',
    notes: '8% Wouchify cash on fashion order.'
  },
  {
    id: 'CB-9023',
    userName: 'Rohan Mehta',
    userEmail: 'rohan.mehta@yahoo.com',
    store: 'Flipkart',
    orderId: 'OD1290384910293',
    orderAmount: '₹64,990',
    cashbackAmount: 3250,
    claimedAt: 'Yesterday, 04:45 PM',
    status: 'Approved',
    payoutMethod: 'Bank Transfer',
    payoutDetails: 'HDFC Bank • A/C: 5010049281920 • IFSC: HDFC0001092',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop',
    notes: 'Verified against Flipkart affiliate sub-ID conversion.'
  },
  {
    id: 'CB-9024',
    userName: 'Pooja Hegde',
    userEmail: 'pooja.h@gmail.com',
    store: 'Ajio',
    orderId: 'AJIO-7839210',
    orderAmount: '₹3,200',
    cashbackAmount: 320,
    claimedAt: 'Yesterday, 02:10 PM',
    status: 'Approved',
    payoutMethod: 'UPI',
    payoutDetails: 'pooja.hegde@ibl',
    notes: 'Instant cashback claim auto-approved.'
  },
  {
    id: 'CB-9025',
    userName: 'Karthik Subramanian',
    userEmail: 'karthik.sub@gmail.com',
    store: 'Tata CLiQ',
    orderId: 'TATA-981290',
    orderAmount: '₹14,200',
    cashbackAmount: 710,
    claimedAt: '08-Sep-2026',
    status: 'Processed',
    payoutMethod: 'UPI',
    payoutDetails: 'karthik@ybl',
    notes: 'Disbursed via ICICI banking batch ID #DISB-4091.'
  },
  {
    id: 'CB-9026',
    userName: 'Sneha Patel',
    userEmail: 'sneha.patel@gmail.com',
    store: 'Nykaa',
    orderId: 'NYK-492019',
    orderAmount: '₹4,890',
    cashbackAmount: 244,
    claimedAt: '08-Sep-2026',
    status: 'Processed',
    payoutMethod: 'Bank Transfer',
    payoutDetails: 'SBI • A/C: 30918290192 • IFSC: SBIN0004921',
    notes: 'Disbursed via batch payout.'
  }
]

export const OperationsCashbacksPage: React.FC = () => {
  const [claims, setClaims] = useState<CashbackClaim[]>(initialClaims)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 2-Step Review Modal
  const [reviewClaim, setReviewClaim] = useState<CashbackClaim | null>(null)
  const [modalStep, setModalStep] = useState<1 | 2>(1)
  const [editedCashback, setEditedCashback] = useState<number>(0)
  const [verificationNote, setVerificationNote] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const pendingCount = claims.filter(c => c.status === 'Pending').length
  const pendingAmount = claims.filter(c => c.status === 'Pending').reduce((acc, c) => acc + c.cashbackAmount, 0)
  const approvedCount = claims.filter(c => c.status === 'Approved').length
  const approvedAmount = claims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.cashbackAmount, 0)
  const processedAmount = claims.filter(c => c.status === 'Processed').reduce((acc, c) => acc + c.cashbackAmount, 0)

  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchUser = c.userName.toLowerCase().includes(q)
        const matchEmail = c.userEmail.toLowerCase().includes(q)
        const matchOrder = c.orderId.toLowerCase().includes(q)
        const matchStore = c.store.toLowerCase().includes(q)
        const matchId = c.id.toLowerCase().includes(q)
        if (!matchUser && !matchEmail && !matchOrder && !matchStore && !matchId) return false
      }
      return true
    })
  }, [claims, statusFilter, searchTerm])

  const handleOpenReview = (claim: CashbackClaim) => {
    setReviewClaim(claim)
    setEditedCashback(claim.cashbackAmount)
    setVerificationNote(claim.notes || 'Order verified against affiliate transaction log.')
    setModalStep(1)
  }

  const handleApproveClaim = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c))
    showToast(`Approved cashback payout for claim #${id}`)
    setReviewClaim(null)
  }

  const handleMarkProcessed = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Processed' } : c))
    showToast(`Marked #${id} as Disbursed/Paid`)
    setReviewClaim(null)
  }

  const handleRejectClaim = (id: string) => {
    const reason = prompt('Please enter rejection reason (e.g. Order returned or cancelled):', 'Order returned on merchant store')
    if (reason) {
      setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'Rejected', notes: reason } : c))
      showToast(`Rejected cashback claim #${id}`)
      setReviewClaim(null)
    }
  }

  const handleExportBankBatchCSV = () => {
    const approvedClaims = claims.filter(c => c.status === 'Approved' || c.status === 'Pending')
    const headers = ['ClaimID', 'BeneficiaryName', 'UserEmail', 'PayoutMethod', 'PaymentDetails', 'AmountINR', 'StorePartner', 'OrderID']
    const rows = approvedClaims.map(c => [
      c.id,
      `"${c.userName}"`,
      c.userEmail,
      c.payoutMethod,
      `"${c.payoutDetails}"`,
      c.cashbackAmount,
      c.store,
      c.orderId
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_bank_batch_payout_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported bank batch payout CSV file')
  }

  return (
    <OperationsLayout activeMenu="cashbacks" pendingCounts={{ cashbacks: pendingCount }}>
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
            <h1 className="crud-title">Cashback Verification & Payout Operations</h1>
            <p className="crud-subtitle">
              Verify shopper order invoices, authorize cashback disbursements, and process bulk UPI/bank payouts.
            </p>
          </div>

          <div className="crud-header-actions">
            <button className="btn-secondary" onClick={handleExportBankBatchCSV}>
              <Download size={16} /> Download Bank Payout Batch CSV
            </button>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          
          <div className="kpi-card" onClick={() => setStatusFilter('Pending')} style={{ cursor: 'pointer', border: statusFilter === 'Pending' ? '1.5px solid #ea580c' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Pending Review</span>
              <span className="kpi-value">₹{pendingAmount.toLocaleString('en-IN')}</span>
              <span className="kpi-sub">{pendingCount} claims awaiting check</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <Clock size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setStatusFilter('Approved')} style={{ cursor: 'pointer', border: statusFilter === 'Approved' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Ready for Payout</span>
              <span className="kpi-value">₹{approvedAmount.toLocaleString('en-IN')}</span>
              <span className="kpi-sub">{approvedCount} claims authorized</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setStatusFilter('Processed')} style={{ cursor: 'pointer', border: statusFilter === 'Processed' ? '1.5px solid #16a34a' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Disbursed (Total)</span>
              <span className="kpi-value">₹{processedAmount.toLocaleString('en-IN')}</span>
              <span className="kpi-sub">Successful bank payouts</span>
            </div>
            <div className="kpi-icon ops-kpi-green">
              <Wallet size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Avg Processing Time</span>
              <span className="kpi-value">16.2 hrs</span>
              <span className="kpi-sub">SLA &lt; 24h</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <TrendingUp size={20} />
            </div>
          </div>

        </div>

        {/* Filter Bar */}
        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by User Name, Email, Order ID or Store…" 
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Payout Statuses</option>
              <option value="Pending">⏳ Pending Review</option>
              <option value="Approved">✅ Approved (Ready for Payout)</option>
              <option value="Processed">💰 Disbursed / Paid</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
        </div>

        {/* Cashback Claims Table */}
        <div className="crud-table-card">
          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Claim ID & Date</th>
                  <th>Shopper Details</th>
                  <th>Store Partner</th>
                  <th>Order ID & Amount</th>
                  <th>Cashback Claimed</th>
                  <th>Payout Destination</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{claim.id}</strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{claim.claimedAt}</span>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>{claim.userName}</strong>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{claim.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={getStoreLogo(claim.store)} alt={claim.store} style={{ height: '18px', maxWidth: '54px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{claim.store}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0f172a', display: 'block' }}>{claim.orderId}</span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Order: {claim.orderAmount}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: '#16a34a', fontSize: '0.96rem' }}>₹{claim.cashbackAmount.toLocaleString('en-IN')}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Direct Wallet Cash</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '190px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: claim.payoutMethod === 'UPI' ? '#7c3aed' : '#2563eb', display: 'block' }}>
                          {claim.payoutMethod}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-all' }}>
                          {claim.payoutDetails}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${claim.status.toLowerCase()}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          type="button" 
                          className="btn-preview-quick" 
                          onClick={() => handleOpenReview(claim)}
                          title="Review invoice and details"
                        >
                          <Eye size={14} /> Review
                        </button>
                        {claim.status === 'Pending' && (
                          <button 
                            type="button" 
                            className="btn-approve-quick" 
                            onClick={() => handleApproveClaim(claim.id)}
                            title="Approve cashback payout"
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {claim.status === 'Approved' && (
                          <button 
                            type="button" 
                            className="btn-approve-quick" 
                            style={{ background: '#2563eb' }}
                            onClick={() => handleMarkProcessed(claim.id)}
                            title="Mark as Disbursed"
                          >
                            <Wallet size={14} /> Disburse
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 2-STEP CASHBACK VERIFICATION MODAL ── */}
        {reviewClaim && (
          <div className="crud-modal-overlay" onClick={() => setReviewClaim(null)}>
            <div className="crud-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <Receipt size={12} /> Claim Verification #{reviewClaim.id}
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>Cashback Audit & Disbursement</h3>
                </div>
                <button className="modal-close" onClick={() => setReviewClaim(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* 2-Step Form Stepper */}
              <div className="form-stepper" style={{ margin: '0 24px' }}>
                <button 
                  type="button" 
                  className={`step-tab-btn ${modalStep === 1 ? 'active' : 'completed'}`}
                  onClick={() => setModalStep(1)}
                >
                  <span className="step-number">{modalStep > 1 ? '✓' : '1'}</span>
                  <div className="step-info">
                    <span className="step-title">Step 1: Order & Invoice Verification</span>
                    <span className="step-desc">Shopper receipt, merchant ID & proof</span>
                  </div>
                </button>

                <div className="step-divider" />

                <button 
                  type="button" 
                  className={`step-tab-btn ${modalStep === 2 ? 'active' : ''}`}
                  onClick={() => setModalStep(2)}
                >
                  <span className="step-number">2</span>
                  <div className="step-info">
                    <span className="step-title">Step 2: Payout Math & Authorization</span>
                    <span className="step-desc">Cashback amount, bank details & approval</span>
                  </div>
                </button>
              </div>

              <div className="modal-body">
                {modalStep === 1 && (
                  <div className="form-step-pane">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Receipt size={16} /></div>
                        <h4 className="form-section-title">Order Information</h4>
                        <span className="form-section-desc">Details submitted by user</span>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Shopper Name & Email</label>
                          <input type="text" value={`${reviewClaim.userName} (${reviewClaim.userEmail})`} disabled />
                        </div>
                        <div className="form-group">
                          <label>Partner Merchant</label>
                          <input type="text" value={reviewClaim.store} disabled />
                        </div>
                      </div>

                      <div className="form-row-2" style={{ marginTop: '12px' }}>
                        <div className="form-group">
                          <label>Merchant Order ID</label>
                          <input type="text" value={reviewClaim.orderId} disabled style={{ fontFamily: 'monospace' }} />
                        </div>
                        <div className="form-group">
                          <label>Purchase Order Total</label>
                          <input type="text" value={reviewClaim.orderAmount} disabled />
                        </div>
                      </div>

                      {reviewClaim.receiptUrl && (
                        <div style={{ marginTop: '16px' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                            Uploaded Invoice / Order Proof
                          </label>
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', textAlign: 'center', background: '#f8fafc' }}>
                            <img 
                              src={reviewClaim.receiptUrl} 
                              alt="Invoice Proof" 
                              style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {modalStep === 2 && (
                  <div className="form-step-pane">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Wallet size={16} /></div>
                        <h4 className="form-section-title">Payout & Authorization</h4>
                        <span className="form-section-desc">Authorize transfer to user account</span>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group highlight-input">
                          <label>Verified Cashback Amount (₹) <span className="required-star">*</span></label>
                          <div className="input-with-symbol">
                            <span className="input-symbol">₹</span>
                            <input 
                              type="number" 
                              value={editedCashback} 
                              onChange={(e) => setEditedCashback(Number(e.target.value) || 0)}
                            />
                          </div>
                          <span className="field-hint">Can be adjusted if return/partial cancellation occurred</span>
                        </div>

                        <div className="form-group">
                          <label>Payout Channel & Details</label>
                          <input type="text" value={`${reviewClaim.payoutMethod}: ${reviewClaim.payoutDetails}`} disabled />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>Operational Manager Audit Note</label>
                        <textarea 
                          rows={3} 
                          value={verificationNote}
                          onChange={(e) => setVerificationNote(e.target.value)}
                          placeholder="Add internal notes on order reconciliation..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Step <strong>{modalStep} of 2</strong> • Status: <strong style={{ color: '#0f172a' }}>{reviewClaim.status}</strong>
                </div>

                <div className="modal-footer-actions">
                  {modalStep === 1 ? (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setReviewClaim(null)}>
                        Cancel
                      </button>
                      <button type="button" className="btn-save" onClick={() => setModalStep(2)}>
                        Next: Payout Math & Authorization →
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setModalStep(1)}>
                        ← Back to Step 1
                      </button>
                      <button 
                        type="button" 
                        className="btn-reject-quick" 
                        onClick={() => handleRejectClaim(reviewClaim.id)}
                      >
                        <X size={15} /> Reject Claim
                      </button>
                      <button 
                        type="button" 
                        className="btn-save" 
                        style={{ background: '#16a34a' }}
                        onClick={() => handleApproveClaim(reviewClaim.id)}
                      >
                        <Check size={16} /> Authorize Cashback Payout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </OperationsLayout>
  )
}
