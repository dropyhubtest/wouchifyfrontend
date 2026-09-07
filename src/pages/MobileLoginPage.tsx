import React, { useState } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import { GoogleLogin } from '@react-oauth/google'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import { login, googleLogin as googleLoginApi } from '../utils/api'
import styles from './MobileLoginPage.module.css'

export const MobileLoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (emailOrPhone.trim() && password.trim()) {
      try {
        setLoading(true)
        const { data } = await login({ email: emailOrPhone, password })
        if (data.token) {
          localStorage.setItem('token', data.token)
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
      }
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.mobileLoginPage}>
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      <main className={styles.mainContent}>
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
        />

        <div className={styles.formCard}>
          <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
          <h2 className={styles.formTitle}>Login</h2>
          <p className={styles.otpDesc}>Login to access your amazing deals</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="Email or Mobile number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputWrap} style={{ marginTop: '16px' }}>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.orDivider}>or</div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                text="signin_with"
                shape="pill"
                width="190"
              />
            </div>

            <p className={styles.termsText}>
              Don't have an account?{' '}
              <a href="/signup" className={styles.termsLink}>
                Sign Up
              </a>
            </p>

            <button type="submit" className={styles.continueBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>

      <MobileFooter />
    </div>
  )
}

export default MobileLoginPage
