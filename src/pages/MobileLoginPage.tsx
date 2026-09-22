import React, { useState } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import { GoogleLogin } from '@react-oauth/google'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import { login, googleLogin as googleLoginApi, sendOtp, verifyOtp } from '../utils/api'
import styles from './MobileLoginPage.module.css'

export const MobileLoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (emailOrPhone.trim()) {
      try {
        setLoading(true)
        await sendOtp(emailOrPhone)
        setIsOtpSent(true)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send OTP')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (emailOrPhone.trim() && otp.trim()) {
      try {
        setLoading(true)
        const { data } = await verifyOtp(emailOrPhone, otp)
        if (data.token) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userInfo', JSON.stringify(data.user))
          localStorage.setItem('just_logged_in', 'true')
        }
        window.location.href = '/'
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid OTP')
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
        localStorage.setItem('userInfo', JSON.stringify(data.user))
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

          <form className={styles.form} onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
            {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
            
            {!isOtpSent ? (
              <div className={styles.inputWrap}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Email Address"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className={styles.inputWrap} style={{ marginTop: '16px' }}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}

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
              {loading ? (isOtpSent ? 'Verifying...' : 'Sending...') : (isOtpSent ? 'Verify & Login' : 'Send OTP')}
            </button>
          </form>
        </div>
      </main>

      <MobileFooter />
    </div>
  )
}

export default MobileLoginPage
