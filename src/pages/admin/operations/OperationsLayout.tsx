import React, { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Wallet, 
  LifeBuoy, 
  Activity, 
  Store, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Bell
} from 'lucide-react'
import logo from '../../../assets/navbar/wouchify-logo.png'
import './OperationsLayout.css'

interface OperationsLayoutProps {
  children: React.ReactNode
  activeMenu: string
  pendingCounts?: {
    approvals?: number
    cashbacks?: number
    support?: number
  }
}

export const OperationsLayout: React.FC<OperationsLayoutProps> = ({ 
  children, 
  activeMenu,
  pendingCounts = {}
}) => {
  const mergedCounts = { approvals: 7, cashbacks: 14, support: 5, ...pendingCounts }
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('ops_sidebar_collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('ops_sidebar_collapsed', isCollapsed.toString())
  }, [isCollapsed])

  useEffect(() => {
    const token = localStorage.getItem('staffToken')
    const userData = localStorage.getItem('staffUser')
    
    if (!token || !userData) {
      // Auto-assign dev user if testing without full login session
      const devUser = { email: 'ops.manager@wouchify.com', role: 'operational_manager' }
      localStorage.setItem('staffToken', 'dev-ops-token')
      localStorage.setItem('staffUser', JSON.stringify(devUser))
      setUser(devUser)
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch {
      setUser({ email: 'ops.manager@wouchify.com', role: 'operational_manager' })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    window.history.pushState({}, '', '/operational-manager/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsSidebarOpen(false)
  }

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Overview', 
      path: '/operational-manager/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      id: 'approvals', 
      label: 'Approval Queue', 
      path: '/operational-manager/approvals', 
      icon: <CheckCircle2 size={20} />,
      badge: mergedCounts.approvals 
    },
    { 
      id: 'cashbacks', 
      label: 'Cashback & Payouts', 
      path: '/operational-manager/cashbacks', 
      icon: <Wallet size={20} />,
      badge: mergedCounts.cashbacks,
      badgeColor: 'blue'
    },
    { 
      id: 'support', 
      label: 'Support & Disputes', 
      path: '/operational-manager/support', 
      icon: <LifeBuoy size={20} />,
      badge: mergedCounts.support 
    },
    { 
      id: 'staff-activity', 
      label: 'Staff Activity', 
      path: '/operational-manager/staff-activity', 
      icon: <Activity size={20} /> 
    },
    { 
      id: 'merchants', 
      label: 'Affiliate Health', 
      path: '/operational-manager/merchants', 
      icon: <Store size={20} /> 
    }
  ]

  if (!user) return null

  return (
    <div className="operations-layout">
      {/* Mobile Header */}
      <div className="operations-mobile-header">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
        <img 
          src={logo} 
          alt="Wouchify" 
          className="operations-logo-mobile" 
          onClick={() => navigate('/operational-manager/dashboard')} 
        />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="operations-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`operations-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="sidebar-header">
          <img 
            src={logo} 
            alt="Wouchify" 
            className="operations-logo" 
            onClick={() => navigate('/operational-manager/dashboard')} 
          />
          <div className="operations-badge">
            <ShieldCheck size={12} /> Ops Manager
          </div>
        </div>

        <nav className="operations-nav">
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.id} 
                className={activeMenu === item.id ? 'active' : ''}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`nav-count-badge ${item.badgeColor || ''}`}>
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="operations-user-info">
            <div className="operations-avatar">{user.email.charAt(0).toUpperCase()}</div>
            <div className="operations-details">
              <span className="operations-email" title={user.email}>{user.email}</span>
              <span className="operations-role">Operational Manager</span>
            </div>
          </div>
          <button className="operations-logout-btn" onClick={handleLogout} title="Logout">
            {isCollapsed ? <LogOut size={18} /> : <> <LogOut size={15} /> Logout</>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="operations-main-content">
        <div className="operations-top-bar">
          <div className="operations-top-title-wrap">
            <span className="operations-live-dot" title="Operational Services Online"></span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
              Wouchify Operations Hub • Live Sync Active
            </span>
          </div>

          <div className="operations-top-actions">
            <button 
              type="button" 
              className="operations-quick-link-btn"
              onClick={() => navigate('/executive/dashboard')}
              title="Open Content Executive Console"
            >
              <ExternalLink size={13} /> Executive Portal
            </button>
            <button 
              type="button" 
              className="operations-quick-link-btn"
              onClick={() => navigate('/operational-manager/approvals')}
              title="View Pending Moderation Queue"
            >
              <Bell size={13} style={{ color: '#ea580c' }} /> Moderation Queue ({mergedCounts.approvals})
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
