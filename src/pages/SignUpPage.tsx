import React, { useState } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { useDesktopScale } from '../hooks/useDesktopScale'
import googleLogo from '../assets/sign-up/google.png'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import './SignUpPage.css'

export const SignUpPage: React.FC = () => {
  const scale = useDesktopScale()
  const [identifier, setIdentifier] = useState('')
  const canvasHeight = 760

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
    <div
      className="signup-page"
      style={{ '--deals-scale': scale } as React.CSSProperties}
    >
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

            {/* Subheading */}
            <h2 className="signup-page__form-title">Login or Singup</h2>

            {/* Helper OTP Text */}
            <p className="signup-page__otp-desc">We will send an OTP to verify</p>

            {/* Form */}
            <form className="signup-page__form" onSubmit={handleSubmit}>
              {/* Mobile / Email Input */}
              <div className="signup-page__input-wrap">
                <input
                  type="text"
                  className="signup-page__input"
                  placeholder="Enter Mobile number or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  aria-label="Mobile number or Email"
                  required
                />
              </div>

              {/* "or" Divider */}
              <div className="signup-page__or-divider">or</div>

              {/* Google Circular Sign-In Button */}
              <button
                type="button"
                className="signup-page__google-btn"
                onClick={handleGoogleSignIn}
                title="Sign in with Google"
                aria-label="Sign in with Google"
              >
                <img
                  src={googleLogo}
                  alt="Google"
                  className="signup-page__google-icon"
                />
              </button>

              {/* Terms and Privacy Policy Note */}
              <p className="signup-page__terms-text">
                By continuing, you agree to Wouchify&apos;s{' '}
                <a href="/terms" className="signup-page__terms-link">
                  terms &amp; conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="signup-page__terms-link">
                  privacy policy
                </a>
              </p>

              {/* Primary Continue Button */}
              <button type="submit" className="signup-page__submit-btn">
                Continue
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
