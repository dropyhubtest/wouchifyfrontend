import React, { useState, useEffect } from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import blobImg from '../../assets/refer/reference.png'
import girlsHeroImg from '../../assets/refer/refer_hero.png'
import styles from './ReferHero.module.css'

interface ReferHeroProps {
  referralCode?: string
}

export const ReferHero: React.FC<ReferHeroProps> = ({
  referralCode = 'WOUCHIFY-RAHUL25',
}) => {
  const [copied, setCopied] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  useEffect(() => {
    // Show static reference image first, then begin filling animation outward in all directions
    const timer = window.setTimeout(() => {
      setIsFilled(true)
    }, 900)

    return () => clearTimeout(timer)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Wouchify',
        text: `Use my referral code ${referralCode} to get ₹50 bonus on Wouchify!`,
        url: window.location.origin,
      }).catch(() => {})
    }
  }

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `Join Wouchify with my referral code ${referralCode} and get ₹50 bonus! ${window.location.origin}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <section
      className={styles.heroSection}
      aria-label="Refer & Earn Hero Banner"
    >
      <div className={styles.heroCanvas}>
        {/* Animated 'W' Watermark behind Left Title */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={`${styles.watermarkMain} ${isFilled ? styles.watermarkMainActive : ''}`}
          width={400}
          height={260}
        />

        {/* Single Blue Organic Reference Shape that Expands Seamlessly */}
        <div
          className={`${styles.blobContainer} ${isFilled ? styles.blobExpanded : ''}`}
          aria-hidden="true"
        >
          <img
            src={blobImg}
            alt=""
            className={styles.blobImg}
          />
        </div>

        {/* Full Viewport Content Container */}
        <div className={styles.contentContainer}>
          {/* Left Text & Code CTA */}
          <div className={styles.heroLeftGroup}>
            {/* Top Red Pill Badge */}
            <div className={styles.referPillBadge}>
              <span className={styles.blueDot} />
              <span>Refer &amp; Earn</span>
            </div>

            {/* Headline on One Single Line */}
            <h1 className={`${styles.heroTitle} ${isFilled ? styles.heroTitleActive : ''}`}>
              Invite Friends, Earn Together!
            </h1>

            <p className={`${styles.heroSubtitle} ${isFilled ? styles.heroSubtitleActive : ''}`}>
              Get ₹100 for every friend who joins using your code.<br />
              Your friend gets ₹50 bonus on their first deal!
            </p>

            {/* Referral Code Copy Button */}
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.codeBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                aria-label="Copy Referral Code"
              >
                <span className={styles.codeText}>{copied ? 'COPIED!' : referralCode}</span>
                <svg
                  className={styles.copyIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>

            {/* Secondary Share Action Buttons (Revealed later during filling animation) */}
            <div className={`${styles.secondaryShareRow} ${isFilled ? styles.secondaryShareRowActive : ''}`}>
              <button
                type="button"
                className={styles.secondaryShareBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  handleShareFriends()
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>Share with Friends</span>
              </button>

              <button
                type="button"
                className={styles.secondaryShareBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  handleShareWhatsapp()
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Share on Whatsapp</span>
              </button>
            </div>
          </div>

          {/* Right Girls Shopping Illustration */}
          <div className={styles.illustrationContainer} aria-hidden="true">
            <img
              src={girlsHeroImg}
              alt="Two friends shopping online with coupons and bags"
              className={styles.illustrationImg}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReferHero
