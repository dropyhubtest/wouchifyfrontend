import React, { useState } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import { GoogleLogin } from '@react-oauth/google'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import { register, googleLogin as googleLoginApi } from '../utils/api'
import styles from './MobileSignUpPage.module.css'

export const MobileSignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      alert(`Account created for ${data.email}! Please login.`)
      window.location.href = '/login'
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
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.mobileSignUpPage}>
      {/* 1. Mobile Header (64px, #EEEFFF) */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Big Animated W Watermark on Top-Right (Matching Figma media_1788427907092.png) */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
        />

        {/* Form Container */}
        <div className={styles.formCard}>
          {/* Main Welcome Title */}
          <h1 className={styles.welcomeTitle}>Welcome to Wouchify!</h1>
          <h2 className={styles.formTitle}>Sign Up</h2>
          <p className={styles.otpDesc}>Create your account to unlock exclusive deals</p>

          {/* Sign Up / Login Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrap} style={{ marginTop: '12px' }}>
              <input
                type="email"
                className={styles.input}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrap} style={{ marginTop: '12px' }}>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrap} style={{ marginTop: '12px' }}>
              <input
                type="password"
                className={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* "or" Divider */}
            <div className={styles.orDivider}>or</div>

            {/* Google Sign-In Button */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                text="signup_with"
                shape="pill"
                width="190"
              />
            </div>

            <p className={styles.termsText}>
              Already have an account?{' '}
              <a href="/login" className={styles.termsLink}>
                Login
              </a>
            </p>

            {/* Primary Action Button */}
            <button type="submit" className={styles.continueBtn} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </main>

      {/* 3. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileSignUpPage
