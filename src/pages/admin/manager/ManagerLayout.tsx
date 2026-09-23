import React, { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Users, UserCircle, 
  
  ShieldAlert, 
  
  
  
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Activity, Database
} from 'lucide-react'
import logo from '../../../assets/navbar/wouchify-logo.png'
import '../operations/OperationsLayout.css' // Reuse operations layout styles

interface ManagerLayoutProps {
  children: React.ReactNode
  activeMenu: string
  onMenuChange?: (menu: string) => void
  pendingCounts?: {
    approvals?: number
  }
  pendingApprovalsCount?: number
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ 
  children, 
  activeMenu,
  pendingCounts = {}
}) => {
  const [liveCounts, setLiveCounts] = useState({ approvals: 0 })
  const mergedCounts = { ...liveCounts, ...pendingCounts }
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('manager_sidebar_collapsed') === 'true'
  })

  useEffect(() => {
    const fetchLiveCounts = async () => {
      try {
        const [subs] = await Promise.all([
          fetch('/api/submissions?status=Pending%20Approval', { headers: { Authorization: `Bearer ${localStorage.getItem('staffToken') || localStorage.getItem('adminToken') || 'dev-manager'}` } }).then(r => r.ok ? r.json() : []).catch(() => [])
        ])
        const apprs = Array.isArray(subs) ? subs.filter((s: any) => s.status === 'Pending Approval' || s.status === 'Pending Review' || s.status === 'pending').length : 0
        setLiveCounts({ approvals: apprs })
      } catch {}
    }
    fetchLiveCounts()
  }, [])

  useEffect(() => {
    localStorage.setItem('manager_sidebar_collapsed', isCollapsed.toString())
  }, [isCollapsed])

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
    const userData = localStorage.getItem('adminUser') || localStorage.getItem('user')
    
    if (!token || !userData) {
      window.history.pushState({}, '', '/manager/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch {
      window.history.pushState({}, '', '/manager/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.history.pushState({}, '', '/manager/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsSidebarOpen(false)
  }

  const menuItems: Array<{ id: string; label: string; path: string; icon: React.ReactElement; badge?: number; badgeColor?: string }> = [
    { 
      id: 'dashboard', 
      label: 'Overview', 
      path: '/manager/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      id: 'approvals', 
      label: 'Manager Approvals', 
      path: '/manager/approvals', 
      icon: <CheckCircle2 size={20} />,
      badge: mergedCounts.approvals 
    },
    { 
      id: 'staff', 
      label: 'Staff Management', 
      path: '/manager/staff', 
      icon: <Users size={20} /> 
    },
    {
      id: 'users',
      label: 'Customer Accounts',
      path: '/manager/users',
      icon: <UserCircle size={20} />
    },
    { 
      id: 'governance', 
      label: 'Data Governance', 
      path: '/manager/governance', 
      icon: <ShieldAlert size={20} /> 
    },
    { 
      id: 'staff-activity', 
      label: 'Staff Activity', 
      path: '/manager/staff-activity', 
      icon: <Activity size={20} /> 
    },
    {
      id: 'live-data',
      label: 'Live Data Viewer',
      path: '/manager/live-data',
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
          className="ops-mobile-logo" 
          onClick={() => navigate('/manager/dashboard')}
        />
        <div className="ops-mobile-user">
          {user.email.substring(0, 2).toUpperCase()}
        </div>
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
              onClick={() => navigate('/manager/dashboard')} 
            />
            <button className="sidebar-mobile-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
              <span style={{ fontSize: '20px', lineHeight: 1 }}>✕</span>
            </button>
          </div>
          <div className="operations-badge">
            <CheckCircle2 size={12} /> Manager Panel
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
              <span className="operations-role">Manager Panel</span>
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
            <span className="operations-top-title">Manager Panel Studio</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
