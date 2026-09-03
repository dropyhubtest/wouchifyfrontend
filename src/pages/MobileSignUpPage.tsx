import React, { useState } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import googleLogo from '../assets/sign-up/google.png'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import styles from './MobileSignUpPage.module.css'

export const MobileSignUpPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (identifier.trim()) {
      alert(`OTP sent to ${identifier.trim()}`)
    }
  }

  const handleGoogleSignIn = () => {
    alert('Signing in with Google...')
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

          {/* Subheading */}
          <h2 className={styles.formTitle}>Login or Singup</h2>

          {/* Helper OTP Text */}
          <p className={styles.otpDesc}>We will send an OTP to verify</p>

          {/* Sign Up / Login Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Mobile / Email Input */}
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter Mobile number or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-label="Mobile number or Email"
                required
              />
            </div>

            {/* "or" Divider */}
            <div className={styles.orDivider}>or</div>

            {/* Google Circular Sign-In Button */}
            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleSignIn}
              title="Sign in with Google"
              aria-label="Sign in with Google"
            >
              <img
                src={googleLogo}
                alt="Google"
                className={styles.googleIcon}
              />
            </button>

            {/* Terms and Privacy Text */}
            <p className={styles.termsText}>
              By continuing, you agree to Wouchify&apos;s{' '}
              <a href="/terms" className={styles.termsLink}>
                terms &amp; conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className={styles.termsLink}>
                privacy policy
              </a>
            </p>

            {/* Primary Action Button */}
            <button type="submit" className={styles.continueBtn}>
              Continue
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
