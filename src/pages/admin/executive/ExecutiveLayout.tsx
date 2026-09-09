import React, { useEffect, useState } from 'react'
import { LayoutDashboard, Zap, Flame, Store, Tag, CreditCard, Image as ImageIcon, Megaphone, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import logo from '../../../assets/navbar/wouchify-logo.png'
import './ExecutiveLayout.css'

interface ExecutiveLayoutProps {
  children: React.ReactNode
  activeMenu: string
}

export const ExecutiveLayout: React.FC<ExecutiveLayoutProps> = ({ children, activeMenu }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('staffToken')
    const userData = localStorage.getItem('staffUser')
    
    if (!token || !userData) {
      window.history.pushState({}, '', '/executive/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    window.history.pushState({}, '', '/executive/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsSidebarOpen(false)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/executive/dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'deals', label: 'Deals', path: '/executive/deals', icon: <Zap size={20} /> },
    { id: 'loot-deals', label: 'Loot Deals', path: '/executive/loot-deals', icon: <Flame size={20} /> },
    { id: 'stores', label: 'Stores', path: '/executive/stores', icon: <Store size={20} /> },
    { id: 'coupons', label: 'Coupons', path: '/executive/coupons', icon: <Tag size={20} /> },
    { id: 'credit-cards', label: 'Credit Cards', path: '/executive/credit-cards', icon: <CreditCard size={20} /> },
    { id: 'banners', label: 'Banners', path: '/executive/banners', icon: <ImageIcon size={20} /> },
    { id: 'advertisements', label: 'Advertisements', path: '/executive/advertisements', icon: <Megaphone size={20} /> },
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

      {/* Sidebar */}
      <aside className={`executive-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="sidebar-header">
          <img src={logo} alt="Wouchify" className="executive-logo" onClick={() => navigate('/executive/dashboard')} />
          <div className="executive-badge">Executive</div>
        </div>

        <nav className="executive-nav">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.id} 
                className={activeMenu === item.id ? 'active' : ''}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="executive-user-info">
            <div className="executive-avatar">{user.email.charAt(0).toUpperCase()}</div>
            <div className="executive-details">
              <span className="executive-email">{user.email}</span>
              <span className="executive-role">Executive</span>
            </div>
          </div>
          <button className="executive-logout-btn" onClick={handleLogout} title="Logout">
            {isCollapsed ? <LogOut size={20} /> : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="executive-main-content">
        {children}
      </main>
    </div>
  )
}
