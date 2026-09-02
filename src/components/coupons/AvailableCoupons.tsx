import React, { useState } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import amazonLogo from '../../assets/brand-logos/amazon-logo.png'
import couponBg from '../../assets/coupons/coupon.png'
import styles from './AvailableCoupons.module.css'

export const AvailableCoupons: React.FC = () => {
  const scale = useDesktopScale()
  const [copied, setCopied] = useState(false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <section
      className={styles.section}
      id="available-coupons"
      aria-label="Available Coupons"
    >
      <div
        className={styles.canvas}
        style={
          {
            '--deals-scale': scale,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          } as React.CSSProperties
        }
      >
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.titleBullet} aria-hidden="true" />
            <h2 className={styles.title}>Available Coupons</h2>
          </div>

          <div className={styles.topPill}>
            Top Deals
          </div>
        </div>

        {/* Big Amazon Coupon Card Container */}
        <div className={styles.couponCard}>
          {/* Card Background Image (Peach with notches) */}
          <img
            src={couponBg}
            alt=""
            className={styles.cardBgImg}
            aria-hidden="true"
          />

          {/* Left Portion: Logo, Discount, Meta */}
          <div className={styles.cardLeft}>
            {/* White Rounded Store Logo Box */}
            <div className={styles.logoBox}>
              <img
                src={amazonLogo}
                alt="Amazon"
                className={styles.storeLogo}
              />
            </div>

            {/* Huge Discount Headline */}
            <div className={styles.discountRow}>
              <span className={styles.discountPercent}>10%</span>
              <span className={styles.discountOff}>Off</span>
            </div>

            {/* Meta Info Row */}
            <div className={styles.metaRow}>
              {/* Expires in 3 days */}
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#282D78"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className={styles.metaText}>Expires in 3 days</span>
              </div>

              {/* Min Order: 499 */}
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#282D78"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className={styles.metaText}>Min Order: 499</span>
              </div>
            </div>
          </div>

          {/* Vertical Dashed Divider */}
          <div className={styles.dashedDivider} aria-hidden="true" />

          {/* Right Portion: Use Code, Code Pill, Copy Action */}
          <div className={styles.cardRight}>
            <span className={styles.useCodeLabel}>USE CODE:</span>

            <button
              type="button"
              className={styles.codeButton}
              onClick={() => handleCopyCode('AMAZON10')}
              title="Click to copy AMAZON10"
            >
              AMAZON10
            </button>

            <button
              type="button"
              className={styles.copyAction}
              onClick={() => handleCopyCode('AMAZON10')}
              aria-label="Copy coupon code"
            >
              <span className={styles.copyText}>
                {copied ? 'Copied! ✓' : 'Copy Code'}
              </span>
              {!copied && (
                <svg
                  className={styles.copyIcon}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AvailableCoupons
