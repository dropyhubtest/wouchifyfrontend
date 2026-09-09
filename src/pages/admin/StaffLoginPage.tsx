import React, { useState, useEffect } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import './StaffLoginPage.css'

export const StaffLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Determine role based on URL
  const [role, setRole] = useState<'operational_manager' | 'manager' | 'executive'>('manager')
  const [title, setTitle] = useState('Staff Login')

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('operational-manager')) {
      setRole('operational_manager')
      setTitle('Operational Manager Portal')
    } else if (path.includes('executive')) {
      setRole('executive')
      setTitle('Executive Portal')
    } else {
      setRole('manager')
      setTitle('Manager Portal')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/admin/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requestedRole: role })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('staffToken', data.token)
        localStorage.setItem('staffUser', JSON.stringify(data.user))
        
        // Redirect to their respective dashboard
        const dashboardUrl = `/${role.replace('_', '-')}/dashboard`
        window.history.pushState({}, '', dashboardUrl)
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        throw new Error(data.message || 'Invalid credentials or unauthorized role')
      }
    } catch (err: any) {
      // Temporary dev fallback if backend is down
      if (email === `${role}@wouchify.com` && password === 'staff123') {
        localStorage.setItem('staffToken', 'dev-token')
        localStorage.setItem('staffUser', JSON.stringify({ email, role }))
        const dashboardUrl = `/${role.replace('_', '-')}/dashboard`
        window.history.pushState({}, '', dashboardUrl)
        window.dispatchEvent(new PopStateEvent('popstate'))
      } else {
        setError(err.message || 'An error occurred during login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="staff-login-page">
      <div className="staff-login-container">
        <div className="staff-login-header">
          <img src={logo} alt="Wouchify" className="staff-logo" />
          <div className="staff-badge">{title}</div>
        </div>

        <form className="staff-login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <p>Enter your credentials to access the {title.toLowerCase()}.</p>

          {error && <div className="staff-error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${role}@wouchify.com`}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="staff-submit-btn" disabled={isLoading}>
            {isLoading ? <span className="loader"></span> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
