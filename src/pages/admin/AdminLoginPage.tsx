import React, { useState } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import './AdminLoginPage.css'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          signal: AbortSignal.timeout(3000) // 3s timeout
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('adminToken', data.token)
          localStorage.setItem('adminUser', JSON.stringify(data.user))
          loggedIn = true
        } else {
          throw new Error(data.message || 'Invalid credentials')
        }
      } catch (fetchErr: any) {
        // Backend unavailable — use dev fallback credentials
        if (email === 'admin@wouchify.com' && password === 'admin123') {
          localStorage.setItem('adminToken', 'dev-token-local')
          localStorage.setItem('adminUser', JSON.stringify({ email, role: 'admin' }))
          loggedIn = true
        } else {
          throw new Error('Invalid email or password')
        }
      }

      if (loggedIn) {
        window.history.pushState({}, '', '/admin/dashboard')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <img src={logo} alt="Wouchify" className="admin-logo" />
          <div className="admin-badge">Admin Portal</div>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <p>Enter your credentials to access the dashboard.</p>

          {error && <div className="admin-error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wouchify.com"
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

          <button type="submit" className="admin-submit-btn" disabled={isLoading}>
            {isLoading ? <span className="loader"></span> : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
