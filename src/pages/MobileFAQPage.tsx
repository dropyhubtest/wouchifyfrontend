import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import { FAQCard } from '../components/faq'
import { FAQ_ITEMS } from '../data/faqData'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'

import styles from './MobileFAQPage.module.css'

export const MobileFAQPage: React.FC = () => {
  return (
    <div className={styles.mobileFaqPage}>
      {/* 1. Mobile Header: Light Lavender, Minimal Variant (Hamburger, Logo, Wishlist Heart) */}
      <div className={styles.headerWrapper}>
        <MobileHeader variant="minimal" />
      </div>

      {/* 2. Top Hero Section with Back Link and Animated Watermark */}
      <section className={styles.heroSection} aria-label="FAQ Header">
        {/* Animated W Watermark on Top-Right */}
        <WatermarkAnimation
          className={styles.watermarkWrap}
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          width={140}
          height={98}
        />

        {/* Back Link: '<< Frequently asked questions' */}
        <a href="/" className={styles.backLink} aria-label="Back to home">
          &lt;&lt; <span className={styles.backLinkText}>Frequently asked questions</span>
        </a>
      </section>

      {/* 3. Main Content: Question Cards Stack */}
      <main className={styles.mainContent}>
        <section className={styles.cardsList} aria-label="Frequently Asked Questions list">
          {FAQ_ITEMS.map((item) => (
            <div key={item.id} className={styles.cardContainer}>
              <FAQCard item={item} />
            </div>
          ))}
        </section>
      </main>

      {/* 4. Mobile Footer with Accordions */}
      <MobileFooter />
    </div>
  )
}

export default MobileFAQPage
