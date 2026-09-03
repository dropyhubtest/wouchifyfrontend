import React, { useState } from 'react'
import amazonLogo from '../../assets/coupons/amazon.png'
import styles from './MobileCouponCard.module.css'

interface MobileCouponCardProps {
  code?: string
  storeName?: string
  logo?: string
  discountPercentage?: string
  discountText?: string
  expiresText?: string
  minOrderText?: string
}

export const MobileCouponCard: React.FC<MobileCouponCardProps> = ({
  code = 'AMAZON10',
  storeName = 'Amazon',
  logo = amazonLogo,
  discountPercentage = '10%',
  discountText = 'Off',
  expiresText = 'Expires in 3 days',
  minOrderText = 'Min Order: 499',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const mobileTicketPath = `
    M 16 0
    H 203
    A 15 15 0 0 0 233 0
    H 342
    A 16 16 0 0 1 358 16
    V 80
    A 15 15 0 0 0 358 110
    V 174
    A 16 16 0 0 1 342 190
    H 233
    A 15 15 0 0 0 203 190
    H 16
    A 16 16 0 0 1 0 174
    V 110
    A 15 15 0 0 0 0 80
    V 16
    A 16 16 0 0 1 16 0
    Z
  `

  return (
    <div className={styles.cardContainer} aria-label={`${storeName} ${discountPercentage} Coupon`}>
      {/* SVG Ticket Vector with Deep Drop Shadow and Inset Rim Shadow */}
      <svg
        className={styles.ticketSvg}
        viewBox="0 0 358 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* 1. Deep Outer Drop Shadow (-15% pixels) */}
          <filter id="mobileOuterShadow" x="-20%" y="-20%" width="140%" height="145%">
            <feDropShadow
              dx="0"
              dy="8.5"
              stdDeviation="10"
              floodColor="#000000"
              floodOpacity="0.22"
            />
          </filter>

          {/* 2. Inner Rim Shadow Blur Filter (Softer) */}
          <filter id="mobileInnerBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>

          {/* 3. Clip Path strictly matching Mobile Ticket Outline */}
          <clipPath id="mobileTicketOutlineClip">
            <path d={mobileTicketPath} />
          </clipPath>
        </defs>

        {/* Base Red Ticket Body with Deep Drop Shadow */}
        <path
          d={mobileTicketPath}
          fill="#E31E25"
          filter="url(#mobileOuterShadow)"
        />

        {/* Guaranteed Inner Inset Rim Shadow along all outer curves & notches */}
        <g clipPath="url(#mobileTicketOutlineClip)">
          <path
            d={mobileTicketPath}
            fill="none"
            stroke="#5A0004"
            strokeWidth="9.5"
            filter="url(#mobileInnerBlur)"
            opacity="0.42"
          />
        </g>

        {/* Vertical White Dotted Perforation Line */}
        <line
          x1="218"
          y1="16"
          x2="218"
          y2="174"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Content Overlay */}
      <div className={styles.contentOverlay}>
        {/* Left Section (61% width) */}
        <div className={styles.leftSection}>
          {/* Logo Box */}
          <div className={styles.logoBox}>
            <img src={logo} alt={storeName} className={styles.storeLogo} />
          </div>

          {/* Discount Row */}
          <div className={styles.discountRow}>
            <span className={styles.discountNum}>{discountPercentage}</span>
            <span className={styles.discountOff}>{discountText}</span>
          </div>

          {/* Meta Information Stack */}
          <div className={styles.metaStack}>
            <div className={styles.metaItem}>
              <svg
                className={styles.metaIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className={styles.metaLabel}>{expiresText}</span>
            </div>

            <div className={styles.metaItem}>
              <svg
                className={styles.metaIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className={styles.metaLabel}>{minOrderText}</span>
            </div>
          </div>
        </div>

        {/* Right Section (39% width) */}
        <div className={styles.rightSection}>
          <span className={styles.useCodeText}>USE CODE:</span>

          {/* Black Pill Button with White Dotted Border */}
          <button
            type="button"
            className={styles.codePill}
            onClick={handleCopyCode}
            title={`Copy coupon code ${code}`}
            aria-label={`Coupon code ${code}`}
          >
            {code}
          </button>

          {/* Copy Code Link */}
          <button
            type="button"
            className={styles.copyAction}
            onClick={handleCopyCode}
            aria-label="Copy code to clipboard"
          >
            <span className={styles.copyText}>
              {copied ? 'Copied! ✓' : 'Copy Code'}
            </span>
            <svg
              className={styles.copyIcon}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
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
  )
}

export default MobileCouponCard
