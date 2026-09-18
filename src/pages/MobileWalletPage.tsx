import React, { useState, useEffect, useMemo } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { adminApi } from '../services/adminApi'
import accountCircleIcon from '../assets/profile/account_circle.png'
import ordersIcon from '../assets/profile/orders.png'
import favoriteIcon from '../assets/profile/favorite.png'
import walletIcon from '../assets/profile/wallet.png'
import notificationsIcon from '../assets/profile/notifications.png'
import referIcon from '../assets/profile/refer.png'
import balanceImg from '../assets/wallet/balance.png'
import cashbackImg from '../assets/wallet/cashback.png'
import earnedImg from '../assets/wallet/earned.png'
import styles from './MobileWalletPage.module.css'

interface CashbackTransaction {
  id: string | number
  date: string
  description: string
  amount: string
  status: 'Completed' | 'Pending' | string
  variant?: 'blue' | 'peach'
}

const DEFAULT_TRANSACTIONS: CashbackTransaction[] = [
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

const NAV_PILLS = [
  { id: 'profile', label: 'My Profile', href: '/profile', icon: accountCircleIcon, active: false },
  { id: 'orders', label: 'My Orders', href: '/orders', icon: ordersIcon, active: false },
  { id: 'wishlist', label: 'Wishlist', href: '/favorites', icon: favoriteIcon, active: false },
  { id: 'wallet', label: 'My Wallet', href: '/wallet', icon: walletIcon, active: true },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: notificationsIcon, active: false },
  { id: 'refer', label: 'Refer & Earn', href: '/refer', icon: referIcon, active: false },
]

export const MobileWalletPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [availableBalance, setAvailableBalance] = useState(1250)
  const [pendingCashback, setPendingCashback] = useState(350)
  const [lifetimeEarned, setLifetimeEarned] = useState(4500)
  const [transactions, setTransactions] = useState<CashbackTransaction[]>(DEFAULT_TRANSACTIONS)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  // Sync with live backend transactions if available
  useEffect(() => {
    let mounted = true
    adminApi.getTransactions()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped: CashbackTransaction[] = data.slice(0, 8).map((t: any, idx: number) => {
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
            setTransactions(mapped)
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
        // Fall back gracefully
      })
    return () => { mounted = false }
  }, [])

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions
    const q = searchQuery.toLowerCase().trim()
    return transactions.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.date.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q) ||
        tx.amount.toLowerCase().includes(q)
    )
  }, [transactions, searchQuery])

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(withdrawAmount)
    if (amt > 0 && amt <= availableBalance) {
      setAvailableBalance((prev) => prev - amt)
      const newTx: CashbackTransaction = {
        id: Date.now(),
        date: 'Today',
        description: 'Bank Withdrawal Transfer',
        amount: `-₹${amt.toLocaleString('en-IN')}`,
        status: 'Pending',
        variant: 'peach',
      }
      setTransactions((prev) => [newTx, ...prev])
      setWithdrawSuccess(true)
      setTimeout(() => {
        setShowWithdrawModal(false)
        setWithdrawSuccess(false)
        setWithdrawAmount('')
      }, 1600)
    }
  }

  return (
    <div className={styles.mobileWalletPage}>
      {/* 1. Mobile Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Top Breadcrumb link */}
      <div className={styles.topNavWrap}>
        <a href="/" className={styles.breadcrumbLink} aria-label="Back to Home">
          <span className={styles.chevron}>&lt;&lt;</span>{' '}
          <span className={styles.breadcrumbTitle}>Home</span>
        </a>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchBarWrap}>
        <input
          type="text"
          placeholder="Search coupons.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search coupons"
        />
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1F2937"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* 4. 2x3 Navigation Pills Grid */}
      <nav className={styles.pillsGrid} aria-label="Account Navigation">
        {NAV_PILLS.map((pill) => (
          <a
            key={pill.id}
            href={pill.href}
            className={`${styles.pillLink} ${pill.active ? styles.pillActive : styles.pillRed}`}
          >
            <img src={pill.icon} alt="" className={styles.pillIcon} />
            <span className={styles.pillText}>{pill.label}</span>
          </a>
        ))}
      </nav>

      {/* 5. Metrics Cards Horizontal Scrollable Rail */}
      <section className={styles.metricsSection} aria-label="Balance and Earnings">
        <div className={styles.metricsRail}>
          {/* Card 1: Available Balance (Navy Blue) */}
          <div className={`${styles.metricCard} ${styles.metricCardNavy}`}>
            <div className={styles.metricCardInner}>
              <div className={styles.metricIconWrap}>
                <img src={balanceImg} alt="" className={styles.metricIcon} />
              </div>
              <div className={styles.metricBody}>
                <span className={styles.metricLabel}>Available Balance</span>
                <span className={styles.metricAmount}>
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  className={styles.withdrawBtn}
                  onClick={() => setShowWithdrawModal(true)}
                >
                  Withdraw to Bank&gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Pending Cashback (Red) */}
          <div className={`${styles.metricCard} ${styles.metricCardRed}`}>
            <div className={styles.metricCardInner}>
              <div className={styles.metricIconWrap}>
                <img src={cashbackImg} alt="" className={styles.metricIcon} />
              </div>
              <div className={styles.metricBody}>
                <span className={styles.metricLabel}>Pending Cashback</span>
                <span className={styles.metricAmount}>
                  ₹{pendingCashback.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className={styles.metricNote}>
              Will be confirmed in 60-90 days
            </div>
          </div>

          {/* Card 3: Lifetime Earned (Red) */}
          <div className={`${styles.metricCard} ${styles.metricCardRed}`}>
            <div className={styles.metricCardInner}>
              <div className={styles.metricIconWrap}>
                <img src={earnedImg} alt="" className={styles.metricIcon} />
              </div>
              <div className={styles.metricBody}>
                <span className={styles.metricLabel}>Lifetime Earned</span>
                <span className={styles.metricAmount}>
                  ₹{lifetimeEarned.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className={styles.metricNote}>
              Since you joined
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section Header ("Your Cashback") */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIndicator} aria-hidden="true" />
        <h2 className={styles.sectionTitle}>Your Cashback</h2>
      </div>

      {/* 7. Cashback Transactions Table */}
      <section className={styles.cashbackSection} aria-label="Your Cashback Transactions">
        <div className={styles.tableContainer}>
          {/* Table Header */}
          <div className={styles.tableHeaderRow} role="row">
            <div className={`${styles.th} ${styles.thDate}`}>Date</div>
            <div className={`${styles.th} ${styles.thDesc}`}>Description</div>
            <div className={`${styles.th} ${styles.thAmount}`}>Amount</div>
            <div className={`${styles.th} ${styles.thStatus}`}>Status</div>
          </div>

          {/* Table Body */}
          <div className={styles.tableBody}>
            {filteredTransactions.map((tx) => {
              const isCompleted = tx.status.toLowerCase() === 'completed'
              const isPeach = tx.variant === 'peach'
              return (
                <div
                  key={tx.id}
                  className={`${styles.tableRow} ${isPeach ? styles.rowPeach : styles.rowBlue}`}
                  role="row"
                >
                  <div className={styles.rowLeft}>
                    <div className={`${styles.td} ${styles.tdDate}`}>{tx.date}</div>
                    <div className={`${styles.td} ${styles.tdDesc}`}>{tx.description}</div>
                    <div className={`${styles.td} ${styles.tdAmount}`}>{tx.amount}</div>
                  </div>
                  <div className={styles.rowRight}>
                    <span
                      className={`${styles.tdStatus} ${
                        isCompleted ? styles.statusCompleted : styles.statusPending
                      }`}
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

      {/* 8. Dashed Red Divider Line */}
      <div className={styles.dashedDivider} aria-hidden="true" />

      {/* 9. Mobile Footer */}
      <MobileFooter />

      {/* 10. Bank Withdrawal Modal */}
      {showWithdrawModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-modal-title"
          >
            <div className={styles.modalHeader}>
              <h3 id="withdraw-modal-title" className={styles.modalTitle}>Withdraw to Bank Account</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShowWithdrawModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {withdrawSuccess ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>✓</div>
                <h4>Withdrawal Request Submitted!</h4>
                <p>
                  ₹{withdrawAmount} will be transferred to your registered bank account within 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className={styles.withdrawForm}>
                <p className={styles.withdrawInfo}>
                  Available for withdrawal:{' '}
                  <strong>₹{availableBalance.toLocaleString('en-IN')}</strong>
                </p>
                <div className={styles.inputGroup}>
                  <label htmlFor="mobile-withdraw-amount" className={styles.inputLabel}>
                    Enter Amount (₹)
                  </label>
                  <input
                    id="mobile-withdraw-amount"
                    type="number"
                    min="100"
                    max={availableBalance}
                    placeholder="Enter amount (min ₹100)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    autoFocus
                    className={styles.modalInput}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setShowWithdrawModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.btnConfirm}
                    disabled={
                      !withdrawAmount ||
                      Number(withdrawAmount) > availableBalance ||
                      Number(withdrawAmount) < 100
                    }
                  >
                    Confirm
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileWalletPage
