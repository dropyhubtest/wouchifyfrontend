import React, { useState, useEffect } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import amazonLogo from '../../assets/coupons/amazon.png'
import styles from './AvailableCoupons.module.css'
import { getPublicCoupons } from '../../services/api'

export const AvailableCoupons: React.FC = () => {
  const scale = useDesktopScale()
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [coupons, setCoupons] = useState<any[]>([])

  useEffect(() => {
    const fetchCoupons = () => {
      getPublicCoupons()
        .then(data => setCoupons(data))
        .catch(err => console.error("Failed to auto-refresh coupons:", err))
    }

    fetchCoupons()
    const intervalId = setInterval(fetchCoupons, 10000)
    return () => clearInterval(intervalId)
  }, [])

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(index)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const ticketPath = `
    M 40 0
    H 990
    A 30 30 0 0 0 1050 0
    H 1520
    A 40 40 0 0 1 1560 40
    V 210
    A 30 30 0 0 0 1560 270
    V 440
    A 40 40 0 0 1 1520 480
    H 1050
    A 30 30 0 0 0 990 480
    H 40
    A 40 40 0 0 1 0 440
    V 270
    A 30 30 0 0 0 0 210
    V 40
    A 40 40 0 0 1 40 0
    Z
  `

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
        {/* Section Header with Left Semicircle Accent */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.headingAccent} aria-hidden="true" />
            <h2 className={styles.title}>Available Coupons</h2>
          </div>
          <div className={styles.topPill}>Top Deals</div>
        </div>

        {/* Scaled Coupon Tickets Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '40px' }}>
          {coupons.map((coupon, index) => (
            <div key={coupon._id || index} className={styles.couponCard}>
              <svg
                className={styles.ticketSvgBg}
                width="1560"
                height="480"
                viewBox="0 0 1560 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <filter id={`ticketOuterShadow-${index}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="20" stdDeviation="22" floodColor="#000000" floodOpacity="0.18" />
                  </filter>
                  <filter id={`ticketInnerBlur-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5.5" />
                  </filter>
                  <clipPath id={`ticketOutlineClip-${index}`}>
                    <path d={ticketPath} />
                  </clipPath>
                </defs>
                <path d={ticketPath} fill="#FFE5D8" filter={`url(#ticketOuterShadow-${index})`} />
                <g clipPath={`url(#ticketOutlineClip-${index})`}>
                  <path
                    d={ticketPath}
                    fill="none"
                    stroke="#6B2F1C"
                    strokeWidth="13"
                    filter={`url(#ticketInnerBlur-${index})`}
                    opacity="0.36"
                  />
                </g>
                <line
                  x1="1020" y1="30" x2="1020" y2="450"
                  stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="8 8" strokeLinecap="round"
                />
              </svg>

              {/* Left Partition */}
              <div className={styles.cardLeft}>
                <div className={styles.logoBox}>
                  {/* For fallback we use amazonLogo, but normally coupon.store logo goes here */}
                  <img
                    src={amazonLogo}
                    alt={coupon.store}
                    className={styles.storeLogo}
                    width="297"
                    height="131"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className={styles.discountRow}>
                  <span className={styles.discountPercent}>{coupon.discount}</span>
                  <span className={styles.discountOff}>off</span>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.metaItem}>
                    <svg className={styles.metaIcon} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#282D78" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className={styles.metaText}>Expires: {coupon.expiry || 'In 3 days'}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <svg className={styles.metaIcon} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#282D78" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span className={styles.metaText}>Min Order: 499</span>
                  </div>
                </div>
              </div>

              {/* Right Partition */}
              <div className={styles.cardRight}>
                <span className={styles.useCodeLabel}>USE CODE:</span>
                <button
                  type="button"
                  className={styles.codeButton}
                  onClick={() => handleCopyCode(coupon.code, index)}
                  title={`Click to copy ${coupon.code}`}
                >
                  {coupon.code}
                </button>
                <button
                  type="button"
                  className={styles.copyAction}
                  onClick={() => handleCopyCode(coupon.code, index)}
                  aria-label="Copy coupon code"
                >
                  <span className={styles.copyText}>
                    {copiedId === index ? 'Copied! ✓' : 'Copy Code'}
                  </span>
                  <svg className={styles.copyIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px', fontSize: '30px', color: '#666' }}>
              No active coupons available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AvailableCoupons
