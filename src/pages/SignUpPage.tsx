import React, { useState } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { GoogleLogin } from '@react-oauth/google'
import { register, googleLogin as googleLoginApi } from '../utils/api'
import { RegistrationSuccessModal } from '../components/auth/RegistrationSuccessModal'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import './SignUpPage.css'

export const SignUpPage: React.FC = () => {
  const scale = useDesktopScale()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredName, setRegisteredName] = useState('')
  const canvasHeight = 840

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    try {
      setLoading(true)
      const { data } = await register({ fullName, email, password })
      setRegisteredName(fullName)
      setShowSuccessModal(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true)
      const { data } = await googleLoginApi(credentialResponse.credential, false)
      setRegisteredName(data.user?.name || data.user?.email || 'User')
      setShowSuccessModal(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    window.location.href = '/login'
  }

  return (
    <div
      className="signup-page"
      style={{ '--deals-scale': scale } as React.CSSProperties}
    >
      {showSuccessModal && (
        <RegistrationSuccessModal userName={registeredName} onClose={handleModalClose} />
      )}

      {/* 1. Existing Shared Navbar */}
      <Navbar />

      {/* 2. Scaled 1920px Canvas Section */}
      <div
        className="signup-page__hero-section"
        style={{ height: `${canvasHeight * scale}px` }}
      >
        <main
          className="signup-page__canvas"
          style={
            {
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: 'top center',
            } as React.CSSProperties
          }
        >
          {/* Big Animated W Watermark on Top-Left */}
          <WatermarkAnimation
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            className="signup-page__watermark-wrap"
          />

          {/* Sign-Up / Login Form Card */}
          <div className="signup-page__card">
            {/* Main Welcome Heading */}
            <h1 className="signup-page__welcome-title">Welcome to Wouchify!</h1>
            <h2 className="signup-page__form-title">Sign Up</h2>
            <p className="signup-page__otp-desc">Create your account to unlock exclusive deals</p>

            {/* Form */}
            <form className="signup-page__form" onSubmit={handleSubmit}>
              {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
              {/* Mobile / Email Input */}
              <div className="signup-page__input-wrap">
                <input
                  type="text"
                  className="signup-page__input"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="signup-page__input-wrap" style={{ marginTop: '16px' }}>
                <input
                  type="email"
                  className="signup-page__input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="signup-page__input-wrap" style={{ marginTop: '16px' }}>
                <input
                  type="password"
                  className="signup-page__input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="signup-page__input-wrap" style={{ marginTop: '16px' }}>
                <input
                  type="password"
                  className="signup-page__input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* "or" Divider */}
              <div className="signup-page__or-divider">or</div>

              {/* Google Sign-In Button */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  text="signup_with"
                  shape="rectangular"
                  width="330"
                />
              </div>

              {/* Terms and Privacy Policy Note */}
              <p className="signup-page__terms-text">
                Already have an account?{' '}
                <a href="/login" className="signup-page__terms-link">
                  Login
                </a>
              </p>

              {/* Primary Continue Button */}
              <button type="submit" className="signup-page__submit-btn" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* 3. Global Desktop Footer */}
      <FooterSection />
    </div>
  )
}

export default SignUpPage
