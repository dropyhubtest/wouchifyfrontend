import React, { useState } from 'react'
import './AdminDashboardPage.css'

// ── Icons (inline SVGs to avoid dependencies) ──────────────────────────────
const IconDashboard = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
)
const IconDeals = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
)
const IconCoupons = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/><path d="M12 12v4m0-8v4"/></svg>
)
const IconStores = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
)
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
)
const IconWallet = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2V4a2 2 0 012-2h14v4"/><path d="M4 6v12a2 2 0 002 2h14v-4"/><circle cx="18" cy="12" r="2" fill="currentColor" stroke="none"/></svg>
)
const IconLogout = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
)
const IconTrend = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
)
const IconBell = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
)
const IconSearch = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
)

// ── Mock Data ───────────────────────────────────────────────────────────────
const stats = [
  { label: 'Total Users', value: '12,843', change: '+8.2%', positive: true, icon: <IconUsers /> },
  { label: 'Active Deals', value: '3,271', change: '+12.5%', positive: true, icon: <IconDeals /> },
  { label: 'Coupons Live', value: '894', change: '-2.1%', positive: false, icon: <IconCoupons /> },
  { label: 'Wallet Balance', value: '₹2,14,500', change: '+5.8%', positive: true, icon: <IconWallet /> },
]

const recentDeals = [
  { id: 1, name: 'Amazon - 40% off Electronics', store: 'Amazon', category: 'Electronics', status: 'active', expiry: 'Sep 10, 2026' },
  { id: 2, name: 'Flipkart Big Billion Day', store: 'Flipkart', category: 'Fashion', status: 'active', expiry: 'Sep 15, 2026' },
  { id: 3, name: 'Swiggy 50% off First Order', store: 'Swiggy', category: 'Food', status: 'pending', expiry: 'Sep 8, 2026' },
  { id: 4, name: 'Zomato Gold Membership', store: 'Zomato', category: 'Food', status: 'expired', expiry: 'Sep 1, 2026' },
  { id: 5, name: 'Myntra End of Season Sale', store: 'Myntra', category: 'Fashion', status: 'active', expiry: 'Sep 20, 2026' },
]

const recentTransactions = [
  { id: 1, user: 'Rahul Sharma', email: 'rahul@gmail.com', type: 'Cashback', amount: '₹250', time: '2 min ago' },
  { id: 2, user: 'Priya Patel', email: 'priya@gmail.com', type: 'Redemption', amount: '₹500', time: '15 min ago' },
  { id: 3, user: 'Amit Kumar', email: 'amit@gmail.com', type: 'Cashback', amount: '₹120', time: '1 hr ago' },
  { id: 4, user: 'Sneha Verma', email: 'sneha@gmail.com', type: 'Redemption', amount: '₹300', time: '3 hr ago' },
]

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { key: 'deals', label: 'Deals', icon: <IconDeals /> },
  { key: 'coupons', label: 'Coupons', icon: <IconCoupons /> },
  { key: 'stores', label: 'Stores', icon: <IconStores /> },
  { key: 'users', label: 'Users', icon: <IconUsers /> },
  { key: 'wallet', label: 'Wallet / Txns', icon: <IconWallet /> },
]

// ── Main Component ──────────────────────────────────────────────────────────
export const AdminDashboardPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('adminUser') || '{}') } catch { return {} }
  })()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.history.pushState({}, '', '/admin/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">W</span>
            {sidebarOpen && <span className="logo-text">Wouchify <small>Admin</small></span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => setActiveNav(item.key)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout} title="Logout">
            <span className="nav-icon"><IconLogout /></span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="admin-main">

        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-search">
            <IconSearch />
            <input type="text" placeholder="Search deals, users, coupons..." />
          </div>
          <div className="topbar-right">
            <button className="topbar-btn notif-btn">
              <IconBell />
              <span className="notif-badge">3</span>
            </button>
            <div className="topbar-user">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-email">{adminUser.email || 'admin@wouchify.com'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="admin-content">
          <div className="content-header">
            <div>
              <h1>Dashboard Overview</h1>
              <p>Welcome back! Here's what's happening with Wouchify today.</p>
            </div>
            <div className="content-actions">
              <button className="btn-secondary">Export Report</button>
              <button className="btn-primary">+ Add New Deal</button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <p className="stat-label">{stat.label}</p>
                  <h2 className="stat-value">{stat.value}</h2>
                  <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                    <IconTrend />
                    {stat.change} vs last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column: Deals Table + Transactions */}
          <div className="dashboard-grid">

            {/* Recent Deals Table */}
            <div className="panel">
              <div className="panel-header">
                <h3>Recent Deals</h3>
                <button className="panel-link">View All →</button>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Deal Name</th>
                      <th>Store</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Expiry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeals.map(deal => (
                      <tr key={deal.id}>
                        <td className="deal-name">{deal.name}</td>
                        <td>{deal.store}</td>
                        <td><span className="category-chip">{deal.category}</span></td>
                        <td><span className={`status-badge status-${deal.status}`}>{deal.status}</span></td>
                        <td className="expiry-date">{deal.expiry}</td>
                        <td>
                          <div className="action-btns">
                            <button className="action-edit">Edit</button>
                            <button className="action-delete">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Wallet Transactions */}
            <div className="panel transactions-panel">
              <div className="panel-header">
                <h3>Wallet Activity</h3>
                <button className="panel-link">View All →</button>
              </div>
              <div className="transaction-list">
                {recentTransactions.map(txn => (
                  <div className="txn-item" key={txn.id}>
                    <div className="txn-avatar">{txn.user[0]}</div>
                    <div className="txn-info">
                      <span className="txn-user">{txn.user}</span>
                      <span className="txn-email">{txn.email}</span>
                    </div>
                    <div className="txn-right">
                      <span className={`txn-type txn-type-${txn.type.toLowerCase()}`}>{txn.type}</span>
                      <span className="txn-amount">{txn.amount}</span>
                      <span className="txn-time">{txn.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="wallet-quick-stats">
                <div className="quick-stat">
                  <span>Total Cashback Issued</span>
                  <strong>₹48,200</strong>
                </div>
                <div className="quick-stat">
                  <span>Total Redeemed</span>
                  <strong>₹31,500</strong>
                </div>
                <div className="quick-stat">
                  <span>Pending Balance</span>
                  <strong>₹16,700</strong>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
