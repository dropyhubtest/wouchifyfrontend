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
  LogOut, Link, 
  ShieldCheck,
  Bell,
  Database, UserCircle
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
  const [liveCounts, setLiveCounts] = useState({ approvals: 0, cashbacks: 0, support: 0 })
  const mergedCounts = { ...liveCounts, ...pendingCounts }
  const [user, setUser] = useState<{ email: string; role: string } | null>(() => {
    if (typeof window === 'undefined') return null
    const staffToken = sessionStorage.getItem('staffToken')
    const staffUserData = sessionStorage.getItem('staffUser')
    if (staffToken && staffUserData) {
      try {
        const parsed = JSON.parse(staffUserData)
        if (parsed && (parsed.role === 'operational_manager' || parsed.role === 'admin')) {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse operations user', e)
      }
    }
    const adminToken = sessionStorage.getItem('adminToken')
    const adminUserData = sessionStorage.getItem('adminUser')
    if (adminToken && adminUserData) {
      try {
        const parsed = JSON.parse(adminUserData)
        if (parsed && parsed.role === 'admin') {
          return parsed
        }
      } catch (e) {
        console.error('Failed to parse admin user', e)
      }
    }
    return null
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('ops_sidebar_collapsed') === 'true'
  })

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('staffToken')
      sessionStorage.removeItem('staffUser')
      localStorage.removeItem('staffToken')
      localStorage.removeItem('staffUser')
      window.history.replaceState({}, '', '/operational-manager/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [user])

  useEffect(() => {
    const fetchLiveCounts = async () => {
      try {
        const token = sessionStorage.getItem('staffToken') || sessionStorage.getItem('adminToken') || ''
        const [subs, claims, tickets] = await Promise.all([
          fetch('/api/submissions?status=Pending%20Approval', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('/api/cashback-claims?status=Pending', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('/api/support-tickets?status=Open', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []).catch(() => [])
        ])
        const apprs = Array.isArray(subs) ? subs.filter((s: any) => s.status === 'Pending Approval' || s.status === 'Pending Review' || s.status === 'pending').length : 0
        const cbs = Array.isArray(claims) ? claims.filter((c: any) => c.status === 'Pending').length : 0
        const supps = Array.isArray(tickets) ? tickets.filter((t: any) => t.status === 'Open' || t.status === 'In Progress').length : 0
        setLiveCounts({ approvals: apprs, cashbacks: cbs, support: supps })
      } catch {}
    }
    if (user) {
      fetchLiveCounts()
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('ops_sidebar_collapsed', isCollapsed.toString())
  }, [isCollapsed])

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
    window.history.pushState({}, '', '/operational-manager/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsSidebarOpen(false)
  }

  const menuItems: Array<{ id: string, label: string, path: string, icon: React.ReactNode, badge?: number, badgeColor?: string }> = [
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
      id: 'link-health',
      label: 'Affiliate Link Health',
      path: '/operational-manager/link-health',
      icon: <Link size={20} />
    },
    {
      id: 'users',
      label: 'Customer Accounts',
      path: '/operational-manager/users',
      icon: <UserCircle size={20} />
    },
    { 
      id: 'merchants', 
      label: 'Affiliate Health', 
      path: '/operational-manager/merchants', 
      icon: <Store size={20} /> 
    },
    {
      id: 'approved-data',
      label: 'Live Data',
      path: '/operational-manager/approved-data',
      icon: <Database size={20} />
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
          <div className="sidebar-header-top-row">
            <img 
              src={logo} 
              alt="Wouchify" 
              className="operations-logo" 
              onClick={() => navigate('/operational-manager/dashboard')} 
            />
            <button className="sidebar-mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
              <span style={{ fontSize: '20px', lineHeight: 1 }}>✕</span>
            </button>
          </div>
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
            <span className="operations-top-title">Operations Manager Portal</span>
          </div>

          <div className="operations-top-actions">
            <button 
              type="button" 
              className="operations-quick-link-btn queue-highlight"
              onClick={() => navigate('/operational-manager/approvals')}
              title="View Pending Moderation Queue"
            >
              <Bell size={14} /> Moderation Queue ({mergedCounts.approvals})
            </button>
            <button 
              type="button" 
              className="operations-quick-link-btn"
              onClick={() => navigate('/operational-manager/cashbacks')}
              title="View Cashback Claims"
            >
              <Wallet size={14} /> Payouts ({mergedCounts.cashbacks})
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
