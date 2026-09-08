import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { FooterSection } from '../components/footer/FooterSection'
import { adminApi } from '../services/adminApi'
import './WalletPage.css'

interface Transaction {
  id: string | number
  date: string
  description: string
  type: string
  amount: number
  status: string
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2026-09-05', description: 'Amazon iPhone 16 Pro Cashback', type: 'EARNED', amount: 800, status: 'COMPLETED' },
  { id: 2, date: '2026-09-02', description: 'Used on Myntra Checkout', type: 'SPENT', amount: -250, status: 'COMPLETED' },
  { id: 3, date: '2026-08-28', description: 'Flipkart Electronics Reward', type: 'EARNED', amount: 350, status: 'PENDING' },
  { id: 4, date: '2026-08-15', description: 'Sign Up Bonus Credit', type: 'EARNED', amount: 100, status: 'COMPLETED' },
]

export const WalletPage: React.FC = () => {
  const [availableBalance, setAvailableBalance] = useState(1250)
  const [pendingBalance, setPendingBalance] = useState(350)
  const [totalEarned, setTotalEarned] = useState(4500)
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  // Sync with live backend transactions if available
  useEffect(() => {
    let mounted = true
    adminApi.getTransactions()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: Transaction[] = data.map((t: any, idx: number) => {
            const num = parseInt(String(t.amount || '0').replace(/[^0-9]/g, ''), 10) || 0
            const isSpent = t.type === 'Redemption'
            return {
              id: t.id || t.transactionId || idx,
              date: t.time && t.time.includes('-') ? t.time.slice(0, 10) : '2026-09-08',
              description: `${t.type} - ${t.user || 'Reward Credit'}`,
              type: isSpent ? 'SPENT' : 'EARNED',
              amount: isSpent ? -num : num,
              status: (t.status || 'Completed').toUpperCase()
            }
          })
          setTransactions(mapped)

          // Calculate earned and pending from transactions
          const completedEarned = mapped
            .filter(t => t.type === 'EARNED' && t.status === 'COMPLETED')
            .reduce((acc, t) => acc + t.amount, 0)
          const pending = mapped
            .filter(t => t.status === 'PENDING')
            .reduce((acc, t) => acc + Math.abs(t.amount), 0)

          if (completedEarned > 0) {
            setAvailableBalance(completedEarned)
            setTotalEarned(completedEarned + 3000)
          }
          if (pending > 0) {
            setPendingBalance(pending)
          }
        }
      })
      .catch(() => {
        // Fall back gracefully to mock state
      })
    return () => { mounted = false }
  }, [])

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(withdrawAmount)
    if (amt > 0 && amt <= availableBalance) {
      setAvailableBalance(prev => prev - amt)
      const newTx: Transaction = {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        description: 'Bank Withdrawal Request',
        type: 'SPENT',
        amount: -amt,
        status: 'PENDING'
      }
      setTransactions(prev => [newTx, ...prev])
      setWithdrawSuccess(true)
      setTimeout(() => {
        setShowWithdrawModal(false)
        setWithdrawSuccess(false)
        setWithdrawAmount('')
      }, 1500)
    }
  }

  return (
    <main className="wallet-page">
      {/* Clean Navbar Wrapper - No unnecessary bar beneath */}
      <div className="wallet-page__navbar-wrapper">
        <Navbar />
      </div>

      <div className="wallet-container">
        <div className="wallet-header">
          <h1 className="wallet-title">My Wallet</h1>
          <p className="wallet-subtitle">Manage your cashback, track pending rewards, and view transaction history.</p>
        </div>

        {/* Balance Cards */}
        <div className="wallet-balances">
          <div className="balance-card primary">
            <h3>Available Balance</h3>
            <div className="amount">₹{availableBalance.toLocaleString('en-IN')}</div>
            <button className="withdraw-btn" onClick={() => setShowWithdrawModal(true)}>
              Withdraw to Bank
            </button>
          </div>
          
          <div className="balance-card secondary">
            <h3>Pending Cashback</h3>
            <div className="amount">₹{pendingBalance.toLocaleString('en-IN')}</div>
            <p className="note">Will be confirmed in 60-90 days</p>
          </div>

          <div className="balance-card secondary">
            <h3>Lifetime Earned</h3>
            <div className="amount">₹{totalEarned.toLocaleString('en-IN')}</div>
            <p className="note">Since you joined</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="wallet-transactions">
          <h2>Transaction History</h2>
          
          <div className="transaction-table">
            <div className="table-header">
              <div className="col date">Date</div>
              <div className="col desc">Description</div>
              <div className="col amount">Amount</div>
              <div className="col status">Status</div>
            </div>
            
            {transactions.map(tx => (
              <div key={tx.id} className="table-row">
                <div className="col date">
                  {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="col desc">{tx.description}</div>
                <div className="col amount" style={{ color: tx.amount > 0 ? '#10B981' : '#EF4444' }}>
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                </div>
                <div className="col status">
                  <span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="wallet-modal-backdrop" onClick={() => setShowWithdrawModal(false)}>
          <div className="wallet-modal-card" onClick={e => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h3>Withdraw to Bank Account</h3>
              <button className="wallet-modal-close" onClick={() => setShowWithdrawModal(false)}>✕</button>
            </div>
            {withdrawSuccess ? (
              <div className="wallet-modal-success">
                <div className="success-icon">✓</div>
                <h4>Withdrawal Initiated!</h4>
                <p>₹{withdrawAmount} will be transferred to your linked bank account within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="wallet-withdraw-form">
                <p className="withdraw-info">
                  Available for withdrawal: <strong>₹{availableBalance.toLocaleString('en-IN')}</strong>
                </p>
                <div className="withdraw-input-group">
                  <label htmlFor="withdraw-amount">Amount (₹)</label>
                  <input
                    id="withdraw-amount"
                    type="number"
                    min="100"
                    max={availableBalance}
                    placeholder="Enter amount (min ₹100)"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="withdraw-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowWithdrawModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm" disabled={!withdrawAmount || Number(withdrawAmount) > availableBalance || Number(withdrawAmount) < 100}>
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <FooterSection />
    </main>
  )
}
