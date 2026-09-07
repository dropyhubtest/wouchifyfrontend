import React, { useState } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { GoogleLogin } from '@react-oauth/google'
import { login, googleLogin as googleLoginApi } from '../utils/api'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import './LoginPage.css'

export const LoginPage: React.FC = () => {
  const scale = useDesktopScale()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasHeight = 760

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (emailOrPhone.trim() && password.trim()) {
      try {
        setLoading(true)
        const { data } = await login({ email: emailOrPhone, password })
        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userInfo', JSON.stringify(data))
          localStorage.setItem('just_logged_in', 'true')
        }
        window.location.href = '/'
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid credentials')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true)
      const { data } = await googleLoginApi(credentialResponse.credential, true)
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data))
        localStorage.setItem('just_logged_in', 'true')
      }
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="login-page"
      style={{ '--deals-scale': scale } as React.CSSProperties}
    >
      <Navbar />

      <div
        className="login-page__hero-section"
        style={{ height: `${canvasHeight * scale}px` }}
      >
        <main
          className="login-page__canvas"
          style={
            {
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: 'top center',
            } as React.CSSProperties
          }
        >
          <WatermarkAnimation
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            className="login-page__watermark-wrap"
          />

          <div className="login-page__card">
            <h1 className="login-page__welcome-title">Welcome Back!</h1>
            <h2 className="login-page__form-title">Login</h2>
            <p className="login-page__otp-desc">Login to access your amazing deals</p>

            <form className="login-page__form" onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
              
              <div className="login-page__input-wrap">
                <input
                  type="text"
                  className="login-page__input"
                  placeholder="Email or Mobile number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </div>

              <div className="login-page__input-wrap" style={{ marginTop: '16px' }}>
                <input
                  type="password"
                  className="login-page__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-page__or-divider">or</div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  text="signin_with"
                  shape="rectangular"
                  width="330"
                />
              </div>

              <p className="login-page__terms-text">
                Don't have an account?{' '}
                <a href="/signup" className="login-page__terms-link">
                  Sign Up
                </a>
              </p>

              <button type="submit" className="login-page__submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </main>
      </div>

      <FooterSection />
    </div>
  )
}

export default LoginPage
