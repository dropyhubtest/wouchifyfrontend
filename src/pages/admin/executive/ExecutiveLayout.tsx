import React, { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Zap,
  Flame,
  Store,
  Tag,
  CreditCard,
  FolderTree,
  Megaphone,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Plus,
  FileSpreadsheet, XCircle,
  Sliders
} from 'lucide-react'
import logo from '../../../assets/navbar/wouchify-logo.png'
import './ExecutiveLayout.css'

interface ExecutiveLayoutProps {
  children: React.ReactNode
  activeMenu: string
}

export const ExecutiveLayout: React.FC<ExecutiveLayoutProps> = ({ children, activeMenu }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    const staffToken = sessionStorage.getItem('staffToken')
    const staffUserStr = sessionStorage.getItem('staffUser')
    if (staffToken && staffUserStr) {
      try {
        const parsed = JSON.parse(staffUserStr)
        if (parsed && (parsed.role === 'executive' || parsed.role === 'admin')) {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse staff user', e)
      }
    }
    const adminToken = sessionStorage.getItem('adminToken')
    const adminUserStr = sessionStorage.getItem('adminUser')
    if (adminToken && adminUserStr) {
      try {
        const parsed = JSON.parse(adminUserStr)
        if (parsed && parsed.role === 'admin') return parsed
      } catch (e) {
        console.error('Failed to parse admin user', e)
      }
    }
    return null
  })

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('staffToken')
      sessionStorage.removeItem('staffUser')
      localStorage.removeItem('staffToken')
      localStorage.removeItem('staffUser')
      window.history.replaceState({}, '', '/executive/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [user])

  const handleLogout = () => {
    sessionStorage.removeItem('staffToken')
    sessionStorage.removeItem('staffUser')
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminUser')
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setUser(null)
    window.history.pushState({}, '', '/executive/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsSidebarOpen(false)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/executive/dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'bulk-upload', label: 'Bulk Data Upload', path: '/executive/bulk-upload', icon: <FileSpreadsheet size={19} /> },
    { id: 'deals', label: 'Deals', path: '/executive/deals', icon: <Zap size={19} /> },
    { id: 'loot-deals', label: 'Loot Deals', path: '/executive/loot-deals', icon: <Flame size={19} /> },
    { id: 'stores', label: 'Stores', path: '/executive/stores', icon: <Store size={19} /> },
    { id: 'coupons', label: 'Coupons', path: '/executive/coupons', icon: <Tag size={19} /> },
    { id: 'credit-cards', label: 'Credit Cards', path: '/executive/credit-cards', icon: <CreditCard size={19} /> },
    { id: 'categories', label: 'Categories', path: '/executive/categories', icon: <FolderTree size={19} /> },
    { id: 'homepage-curation', label: 'Homepage Curation', path: '/executive/homepage-curation', icon: <Sliders size={19} /> },
    { id: 'advertisements', label: 'Advertisements', path: '/executive/advertisements', icon: <Megaphone size={19} /> },
    { id: 'verification', label: 'Link & Coupon Verification', path: '/executive/verification', icon: <ShieldCheck size={19} /> },
    { id: 'rejections', label: 'Rejection Inbox', path: '/executive/rejections', icon: <XCircle size={19} /> },
    { id: 'tickets', label: 'Flagged Issues & Tickets', path: '/executive/tickets', icon: <AlertTriangle size={19} /> },
  ]

  if (!user) return null

  return (
    <div className="executive-layout">
      {/* Mobile Header */}
      <div className="executive-mobile-header">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
        <img src={logo} alt="Wouchify" className="executive-logo-mobile" onClick={() => navigate('/executive/dashboard')} />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="executive-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar with Deep Navy Gradient */}
      <aside className={`executive-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        <div className="sidebar-header">
          <div className="sidebar-header-top-row">
            <img src={logo} alt="Wouchify" className="executive-logo" onClick={() => navigate('/executive/dashboard')} />
            <button className="sidebar-mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
              <span style={{ fontSize: '20px', lineHeight: 1 }}>✕</span>
            </button>
          </div>
          <div className="executive-badge">Content Executive</div>
        </div>

        <nav className="executive-nav">
          <ul>
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id
              return (
                <li 
                  key={item.id} 
                  className={isActive ? 'active' : ''}
                  onClick={() => navigate(item.path)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="executive-user-info">
            <div className="executive-avatar">
              {(user.name || user.email || 'E').charAt(0).toUpperCase()}
            </div>
            <div className="executive-details">
              <span className="executive-email">{user.name || user.email}</span>
              <span className="executive-role">Content Executive</span>
            </div>
          </div>
          <button className="executive-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`executive-main-content ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Top Bar with Clean Header and Quick Actions */}
        <header className="executive-top-bar">
          <div className="top-bar-left">
            <span className="top-bar-title">Content Executive Portal</span>
          </div>

          <div className="top-bar-right">
            <button 
              type="button" 
              className="quick-link-btn"
              onClick={() => navigate('/executive/verification')}
              title="Verify links and coupon codes"
            >
              <ShieldCheck size={15} className="quick-link-icon" />
              <span>Link Checker</span>
            </button>

            <button 
              type="button" 
              className="quick-link-btn"
              onClick={() => navigate('/executive/deals')}
              title="Create a new deal"
            >
              <Plus size={15} className="quick-link-icon" />
              <span>Add Deal</span>
            </button>

            <button 
              type="button" 
              className="quick-link-btn highlight"
              onClick={() => navigate('/executive/tickets')}
              title="Reported issues and broken links"
            >
              <AlertTriangle size={15} className="quick-link-icon" />
              <span>Flagged Issues</span>
            </button>

            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="storefront-preview-btn"
              title="View live website"
            >
              <ExternalLink size={14} />
              <span>Storefront</span>
            </a>
          </div>
        </header>

        <div className="executive-view-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}

