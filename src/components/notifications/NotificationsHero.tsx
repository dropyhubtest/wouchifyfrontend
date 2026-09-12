import React from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import heroBg from '../../assets/notifications/hero_bg.png'
import bellHeroImg from '../../assets/notifications/notifications_hero.png'
import styles from './NotificationsHero.module.css'

interface NotificationsHeroProps {
  onCheckNowClick?: () => void
}

export const NotificationsHero: React.FC<NotificationsHeroProps> = ({ onCheckNowClick }) => {
  return (
    <section className={styles.heroSection} aria-label="Notifications Hero Banner">
      <div className={styles.heroCanvas}>
        {/* Background Artwork Layer (Chat Bubbles Pattern) */}
        <div
          className={styles.bgOverlay}
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden="true"
        />

        {/* Center Animated 'W' Watermark */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkMain}
          width={420}
          height={275}
        />

        {/* Small Bottom-Right 'W' Watermark */}
        <WatermarkAnimation
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          className={styles.watermarkBottomRight}
          width={280}
          height={180}
        />

        {/* Hero Content Container */}
        <div className={styles.contentContainer}>
          {/* Left Text & CTA */}
          <div className={styles.heroLeftGroup}>
            <h1 className={styles.heroTitle}>Notifications</h1>
            <p className={styles.heroSubtitle}>
              Check all your notifications below
            </p>
            <button
              type="button"
              className={styles.checkNowBtn}
              onClick={onCheckNowClick}
            >
              Check now&gt;&gt;
            </button>
          </div>

          {/* Right Golden Bell Illustration */}
          <div className={styles.illustrationContainer} aria-hidden="true">
            <img
              src={bellHeroImg}
              alt="Golden Notification Bell with unread badge"
              className={styles.illustrationImg}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotificationsHero
