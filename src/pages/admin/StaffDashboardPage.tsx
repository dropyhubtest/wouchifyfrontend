import React, { useEffect, useState } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import './StaffLoginPage.css' // We can reuse the CSS for a simple UI

export const StaffDashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const [title, setTitle] = useState('Staff Dashboard')

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('staffToken')
    const userData = localStorage.getItem('staffUser')
    
    if (!token || !userData) {
      window.history.pushState({}, '', '/manager/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Set title based on role
    if (parsedUser.role === 'operational_manager') {
      setTitle('Operational Manager Dashboard')
    } else if (parsedUser.role === 'executive') {
      setTitle('Executive Dashboard')
    } else {
      setTitle('Manager Dashboard')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffUser')
    
    const loginUrl = user ? `/${user.role.replace('_', '-')}/login` : '/manager/login'
    window.history.pushState({}, '', loginUrl)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  if (!user) return null

  return (
    <div className="staff-login-page">
      <div className="staff-login-container" style={{ maxWidth: '600px' }}>
        <div className="staff-login-header">
          <img src={logo} alt="Wouchify" className="staff-logo" />
          <div className="staff-badge">{title}</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Welcome, {user.email}</h2>
          <p style={{ color: '#64748B', margin: '16px 0' }}>
            You are successfully logged in as an <strong>{user.role.replace('_', ' ')}</strong>.
          </p>
          <p style={{ color: '#64748B', margin: '16px 0', fontSize: '14px' }}>
            (This is a placeholder dashboard. The full dashboard features will be built here.)
          </p>

          <button 
            onClick={handleLogout}
            className="staff-submit-btn" 
            style={{ marginTop: '30px', backgroundColor: '#334155' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
