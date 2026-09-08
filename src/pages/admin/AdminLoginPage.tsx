import React, { useState } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import './AdminLoginPage.css'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      let loggedIn = false

      // Try backend first
      try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          signal: AbortSignal.timeout(3000)
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('adminToken', data.token)
          localStorage.setItem('adminUser', JSON.stringify(data.user))
          loggedIn = true
        } else {
          throw new Error(data.message || 'Invalid credentials')
        }
      } catch {
        // Backend unavailable or offline — use dev fallback credentials
        if (email === 'admin@wouchify.com' && password === 'admin123') {
          localStorage.setItem('adminToken', 'dev-token-local')
          localStorage.setItem('adminUser', JSON.stringify({ email, role: 'admin' }))
          loggedIn = true
        } else {
          throw new Error('Invalid email or password. Please verify your credentials.')
        }
      }

      if (loggedIn) {
        window.history.pushState({}, '', '/admin/dashboard')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred during login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail('admin@wouchify.com')
    setPassword('admin123')
    setError('')
  }

  return (
    <div className="admin-login-page">
      {/* Ambient background decoration matching Wouchify branding */}
      <div className="admin-login-bg-shape shape-1" aria-hidden="true" />
      <div className="admin-login-bg-shape shape-2" aria-hidden="true" />

      <div className="admin-login-wrapper">
        <a href="/" className="admin-login-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Return to Wouchify Store
        </a>

        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo-wrapper">
              <img src={logo} alt="Wouchify" className="admin-logo" />
            </div>
            <div className="admin-portal-badge">
              <span className="badge-dot" />
              <span>Admin Management Portal</span>
            </div>
            <h2>Sign in to Dashboard</h2>
            <p>Manage stores, live deals, verified coupons, and reward payouts.</p>
          </div>

          {error && (
            <div className="admin-error-message" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Admin Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@wouchify.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loader" aria-hidden="true" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for developer & reviewer testing */}
          <div className="demo-credentials-box">
            <div className="demo-credentials-info">
              <span className="demo-label">Default Admin Access</span>
              <span className="demo-values">admin@wouchify.com • admin123</span>
            </div>
            <button
              type="button"
              className="demo-autofill-btn"
              onClick={fillDemoCredentials}
            >
              Fill Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
