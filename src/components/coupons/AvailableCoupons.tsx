import React, { useState } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import amazonLogo from '../../assets/coupons/amazon.png'
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

        {/* Scaled Coupon Ticket Container (1560 x 480) */}
        <div className={styles.couponCard}>
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
              {/* 1. Deep Outer Elevation Drop Shadow (-15% pixels) */}
              <filter
                id="ticketOuterShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="20"
                  stdDeviation="22"
                  floodColor="#000000"
                  floodOpacity="0.18"
                />
              </filter>

              {/* 2. Inner Rim Shadow Blur Filter (Softer) */}
              <filter id="ticketInnerBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5.5" />
              </filter>

              {/* 3. Clip Path strictly matching Ticket Outline */}
              <clipPath id="ticketOutlineClip">
                <path d={ticketPath} />
              </clipPath>
            </defs>

            {/* Base Ticket with Deep Outer Drop Shadow */}
            <path
              d={ticketPath}
              fill="#FFE5D8"
              filter="url(#ticketOuterShadow)"
            />

            {/* Guaranteed Inner Inset Rim Shadow along all outer curves & notches */}
            <g clipPath="url(#ticketOutlineClip)">
              <path
                d={ticketPath}
                fill="none"
                stroke="#6B2F1C"
                strokeWidth="13"
                filter="url(#ticketInnerBlur)"
                opacity="0.36"
              />
            </g>

            {/* Vertical White Dotted Perforation Line */}
            <line
              x1="1020"
              y1="30"
              x2="1020"
              y2="450"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </svg>

          {/* Left Partition (Width: 1020px) */}
          <div className={styles.cardLeft}>
            {/* Logo Box */}
            <div className={styles.logoBox}>
              <img
                src={amazonLogo}
                alt="Amazon"
                className={styles.storeLogo}
                width="297"
                height="131"
              />
            </div>

            {/* Centered Discount Row */}
            <div className={styles.discountRow}>
              <span className={styles.discountPercent}>10%</span>
              <span className={styles.discountOff}>off</span>
            </div>

            {/* Meta Information Row */}
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#282D78"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className={styles.metaText}>Expires in 3 days</span>
              </div>

              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#282D78"
                  strokeWidth="2.4"
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

          {/* Right Partition (Width: 540px) */}
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
              <svg
                className={styles.copyIcon}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AvailableCoupons
