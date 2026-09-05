import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { FooterSection } from '../components/footer/FooterSection'
import './WalletPage.css'

export const WalletPage: React.FC = () => {
  // Mock Data
  const availableBalance = 1250
  const pendingBalance = 350
  const totalEarned = 4500

  const transactions = [
    { id: 1, date: '2023-10-15', description: 'Amazon iPhone 15 Cashback', type: 'EARNED', amount: 800, status: 'COMPLETED' },
    { id: 2, date: '2023-10-12', description: 'Used on Myntra Checkout', type: 'SPENT', amount: -250, status: 'COMPLETED' },
    { id: 3, date: '2023-10-10', description: 'Flipkart Big Billion Days', type: 'EARNED', amount: 350, status: 'PENDING' },
    { id: 4, date: '2023-09-28', description: 'Sign Up Bonus', type: 'EARNED', amount: 100, status: 'COMPLETED' },
  ]

  return (
    <main className="wallet-page">
      <div className="wallet-page__header-bg" />
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
            <div className="amount">₹{availableBalance}</div>
            <button className="withdraw-btn">Withdraw to Bank</button>
          </div>
          
          <div className="balance-card secondary">
            <h3>Pending Cashback</h3>
            <div className="amount">₹{pendingBalance}</div>
            <p className="note">Will be confirmed in 60-90 days</p>
          </div>

          <div className="balance-card secondary">
            <h3>Lifetime Earned</h3>
            <div className="amount">₹{totalEarned}</div>
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
                <div className="col date">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div className="col desc">{tx.description}</div>
                <div className="col amount" style={{ color: tx.amount > 0 ? '#10B981' : '#EF4444' }}>
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                </div>
                <div className="col status">
                  <span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  )
}
