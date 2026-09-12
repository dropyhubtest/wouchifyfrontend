import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { WalletHero } from '../components/wallet/WalletHero'
import { adminApi } from '../services/adminApi'
import { useMediaQuery } from '../hooks/useMediaQuery'
import balanceImg from '../assets/wallet/balance.png'
import cashbackImg from '../assets/wallet/cashback.png'
import earnedImg from '../assets/wallet/earned.png'
import './WalletPage.css'

interface ReferralTransaction {
  id: string | number
  date: string
  description: string
  amount: string
  status: 'Completed' | 'Pending' | string
  variant?: 'blue' | 'peach'
}

const DEFAULT_REFERRALS: ReferralTransaction[] = [
  {
    id: 1,
    date: '5 Sept 2026',
    description: 'Amazon iPhone 16 Pro Cashback',
    amount: '+₹800',
    status: 'Completed',
    variant: 'blue',
  },
  {
    id: 2,
    date: '2 Sept 2026',
    description: 'Used on Myntra Checkout',
    amount: '+₹350',
    status: 'Completed',
    variant: 'peach',
  },
  {
    id: 3,
    date: '28 Aug 2026',
    description: 'Flipkart Electronics Reward',
    amount: '+₹100',
    status: 'Pending',
    variant: 'blue',
  },
]

export const WalletPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [availableBalance, setAvailableBalance] = useState(1250)
  const [pendingCashback, setPendingCashback] = useState(350)
  const [lifetimeEarned, setLifetimeEarned] = useState(4500)
  const [referrals, setReferrals] = useState<ReferralTransaction[]>(DEFAULT_REFERRALS)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const contentSectionRef = useRef<HTMLDivElement | null>(null)

  // Sync with live backend transactions if available
  useEffect(() => {
    let mounted = true
    adminApi.getTransactions()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: ReferralTransaction[] = data.slice(0, 8).map((t: any, idx: number) => {
            const rawAmt = parseInt(String(t.amount || '0').replace(/[^0-9]/g, ''), 10) || 0
            const isCompleted = (t.status || 'Completed').toLowerCase() === 'completed'
            return {
              id: t.id || t.transactionId || idx,
              date: t.time && t.time.includes('-') ? t.time.slice(0, 10) : `${5 - idx} Sept 2026`,
              description: t.description || `${t.user || 'User'} ${t.type || 'Cashback'}`,
              amount: `+₹${rawAmt.toLocaleString('en-IN')}`,
              status: isCompleted ? 'Completed' : 'Pending',
              variant: idx % 2 === 1 ? 'peach' : 'blue',
            }
          })
          if (mapped.length > 0) {
            setReferrals(mapped)
            const completedSum = mapped
              .filter((t) => t.status.toLowerCase() === 'completed')
              .reduce((sum, t) => sum + (parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0), 0)
            const pendingSum = mapped
              .filter((t) => t.status.toLowerCase() === 'pending')
              .reduce((sum, t) => sum + (parseInt(t.amount.replace(/[^0-9]/g, ''), 10) || 0), 0)

            if (completedSum > 0) {
              setAvailableBalance(completedSum)
              setLifetimeEarned(completedSum + 3250)
            }
            if (pendingSum > 0) {
              setPendingCashback(pendingSum)
            }
          }
        }
      })
      .catch(() => {
        // Fall back gracefully to mock state
      })
    return () => { mounted = false }
  }, [])

  const handleScrollToContent = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(withdrawAmount)
    if (amt > 0 && amt <= availableBalance) {
      setAvailableBalance(prev => prev - amt)
      const newTx: ReferralTransaction = {
        id: Date.now(),
        date: 'Today',
        description: 'Bank Withdrawal Transfer',
        amount: `-₹${amt.toLocaleString('en-IN')}`,
        status: 'Pending',
        variant: 'peach',
      }
      setReferrals(prev => [newTx, ...prev])
      setWithdrawSuccess(true)
      setTimeout(() => {
        setShowWithdrawModal(false)
        setWithdrawSuccess(false)
        setWithdrawAmount('')
      }, 1600)
    }
  }

  return (
    <div className="wallet-page">
      {/* 1. Global Navbar */}
      {isMobile ? <MobileHeader /> : <Navbar activeNav="wallet" />}

      {/* 2. Hero Section */}
      <WalletHero onCheckBalanceClick={handleScrollToContent} />

      {/* 3. Main Body Container - Full Viewport Width */}
      <main className="wallet-main" ref={contentSectionRef}>
        {/* Top Row: Sidebar attached to left + 3 Main 488*303 Cards on right */}
        <div className="wallet-top-section">
          {/* Left Column: ProfileSidebar */}
          <ProfileSidebar activeTab="wallet" showQuickAccess={false} />

          {/* Right Column: 3 Metric Cards (488*303) */}
          <div className="wallet-metrics-grid">
            {/* Card 1: Available Balance (Navy Blue) */}
            <div className="wallet-metric-card wallet-metric-card--navy">
              <div className="wallet-metric-card__inner">
                <div className="wallet-metric-card__icon-wrap">
                  <img
                    src={balanceImg}
                    alt="Available Balance"
                    className="wallet-metric-card__icon"
                  />
                </div>
                <div className="wallet-metric-card__body">
                  <span className="wallet-metric-card__label">Available Balance</span>
                  <span className="wallet-metric-card__amount">
                    ₹{availableBalance.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    className="wallet-metric-card__withdraw-btn"
                    onClick={() => setShowWithdrawModal(true)}
                  >
                    Withdraw to Bank&gt;&gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Pending Cashback (Red) */}
            <div className="wallet-metric-card wallet-metric-card--red">
              <div className="wallet-metric-card__inner">
                <div className="wallet-metric-card__icon-wrap">
                  <img
                    src={cashbackImg}
                    alt="Pending Cashback"
                    className="wallet-metric-card__icon"
                  />
                </div>
                <div className="wallet-metric-card__body">
                  <span className="wallet-metric-card__label">Pending Cashback</span>
                  <span className="wallet-metric-card__amount">
                    ₹{pendingCashback.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="wallet-metric-card__note">
                Will be confirmed in 60-90 days
              </div>
            </div>

            {/* Card 3: Lifetime Earned (Red) */}
            <div className="wallet-metric-card wallet-metric-card--red">
              <div className="wallet-metric-card__inner">
                <div className="wallet-metric-card__icon-wrap">
                  <img
                    src={earnedImg}
                    alt="Lifetime Earned"
                    className="wallet-metric-card__icon"
                  />
                </div>
                <div className="wallet-metric-card__body">
                  <span className="wallet-metric-card__label">Lifetime Earned</span>
                  <span className="wallet-metric-card__amount">
                    ₹{lifetimeEarned.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="wallet-metric-card__note">
                Since you joined
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Full Viewport Width "Your Referrals" (Comes AFTER cards & sidebar) */}
        <section className="wallet-referrals-section" aria-label="Your Referrals">
          <div className="wallet-referrals-heading-row">
            <div className="wallet-referrals-heading__accent" aria-hidden="true" />
            <h2 className="wallet-referrals-title">Your Referrals</h2>
          </div>

          <div className="wallet-table-container">
            {/* Table Column Headers */}
            <div className="wallet-table-header-row" role="row">
              <div className="wallet-th-group-left">
                <div className="wallet-th wallet-th--date">Date</div>
                <div className="wallet-th wallet-th--desc">Description</div>
                <div className="wallet-th wallet-th--amount">Amount</div>
              </div>
              <div className="wallet-th-group-right">
                <div className="wallet-th wallet-th--status">Status</div>
              </div>
            </div>

            {/* Table Body Cards Stack */}
            <div className="wallet-table-body">
              {referrals.map((tx, idx) => {
                const isCompleted = tx.status.toLowerCase() === 'completed'
                const isPeach = tx.variant === 'peach'
                const rowClass = idx === 0 ? 'wallet-table-row-card--row1' : idx === 1 ? 'wallet-table-row-card--row2' : 'wallet-table-row-card--row3'
                return (
                  <div
                    key={tx.id}
                    className={`wallet-table-row-card ${rowClass} ${isPeach ? 'wallet-table-row-card--peach' : 'wallet-table-row-card--blue'}`}
                    role="row"
                  >
                    {/* Left Colored Area: Date, Description, Amount */}
                    <div className="wallet-row-left-content">
                      <div className="wallet-td wallet-td--date">{tx.date}</div>
                      <div className="wallet-td wallet-td--desc">{tx.description}</div>
                      <div className="wallet-td wallet-td--amount">{tx.amount}</div>
                    </div>

                    {/* Right White Area: Status */}
                    <div className="wallet-row-right-status">
                      <span
                        className={`wallet-td--status-text ${isCompleted ? 'wallet-td--completed' : 'wallet-td--pending'}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* 4. Bank Withdrawal Modal */}
      {showWithdrawModal && (
        <div
          className="wallet-modal-backdrop"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="wallet-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-modal-title"
          >
            <div className="wallet-modal-header">
              <h3 id="withdraw-modal-title">Withdraw to Bank Account</h3>
              <button
                type="button"
                className="wallet-modal-close"
                onClick={() => setShowWithdrawModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="wallet-modal-success">
                <div className="wallet-success-icon">✓</div>
                <h4>Withdrawal Request Submitted!</h4>
                <p>
                  ₹{withdrawAmount} will be transferred to your registered bank account within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="wallet-withdraw-form">
                <p className="wallet-withdraw-info">
                  Available for withdrawal:{' '}
                  <strong>₹{availableBalance.toLocaleString('en-IN')}</strong>
                </p>
                <div className="wallet-withdraw-input-group">
                  <label htmlFor="withdraw-amount">Enter Amount (₹)</label>
                  <input
                    id="withdraw-amount"
                    type="number"
                    min="100"
                    max={availableBalance}
                    placeholder="Enter amount (min ₹100)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="wallet-withdraw-actions">
                  <button
                    type="button"
                    className="wallet-btn-cancel"
                    onClick={() => setShowWithdrawModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="wallet-btn-confirm"
                    disabled={
                      !withdrawAmount ||
                      Number(withdrawAmount) > availableBalance ||
                      Number(withdrawAmount) < 100
                    }
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default WalletPage
