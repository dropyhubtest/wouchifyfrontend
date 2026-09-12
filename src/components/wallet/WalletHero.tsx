import React from 'react'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import watermarkSecondary from '../../assets/hero/hero-watermark-secondary.png'
import watermarkSecondaryState2 from '../../assets/hero/hero-watermark-secondary-state-2.png'
import walletHeroBg from '../../assets/wallet/wallethero_bg.png'
import walletHeroImg from '../../assets/wallet/Wallet_hero.png'
import styles from './WalletHero.module.css'

interface WalletHeroProps {
  onCheckBalanceClick?: () => void
}

export const WalletHero: React.FC<WalletHeroProps> = ({ onCheckBalanceClick }) => {
  return (
    <section className={styles.heroSection} aria-label="Wallet Hero Banner">
      <div className={styles.heroCanvas}>
        {/* Background Artwork Layer (Falling Confetti) */}
        <div
          className={styles.bgOverlay}
          style={{ backgroundImage: `url(${walletHeroBg})` }}
          aria-hidden="true"
        />

        {/* Bigger W Watermark (close to the middle from the left side) */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkMain}
          width={420}
          height={275}
        />

        {/* Smaller W Watermark (at the bottom right corner) */}
        <WatermarkAnimation
          state1Src={watermarkSecondary}
          state2Src={watermarkSecondaryState2}
          className={styles.watermarkBottomRight}
          width={290}
          height={190}
        />

        {/* Hero Content Container */}
        <div className={styles.contentContainer}>
          {/* Left Text & CTA */}
          <div className={styles.heroLeftGroup}>
            <h1 className={styles.heroTitle}>My Wallet</h1>
            <p className={styles.heroSubtitle}>
              Manage your cashback, track pending rewards, and view transaction history.
            </p>
            <button
              type="button"
              className={styles.checkBalanceBtn}
              onClick={onCheckBalanceClick}
            >
              Check your Balance&gt;&gt;
            </button>
          </div>

          {/* Right Wallet Illustration */}
          <div className={styles.illustrationContainer} aria-hidden="true">
            <img
              src={walletHeroImg}
              alt="Wallet with notes and coins"
              className={styles.illustrationImg}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WalletHero
