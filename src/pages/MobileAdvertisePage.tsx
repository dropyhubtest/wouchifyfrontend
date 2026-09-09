import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'

import styles from './MobileAdvertisePage.module.css'

export const MobileAdvertisePage: React.FC = () => {
  return (
    <div className={styles.mobileAdvertisePage}>
      {/* 1. Header (Minimal variant: hamburger, logo, wishlist heart) */}
      <div className={styles.headerWrapper}>
        <MobileHeader variant="minimal" />
      </div>

      {/* 2. Top Hero Area with Back Link, Watermark & Red Headline */}
      <section className={styles.heroSection} aria-label="Advertise with Wouchify">
        {/* Animated W Watermark on Top-Right */}
        <WatermarkAnimation
          className={styles.watermarkWrap}
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          width={130}
          height={95}
        />

        {/* Back Link: '<< Advertise with us' */}
        <a href="/" className={styles.backLink} aria-label="Back to home">
          &lt;&lt; <span className={styles.backLinkText}>Advertise with us</span>
        </a>

        {/* 3-line Red Headline */}
        <h1 className={styles.title}>
          Promote.
          <br />
          Reach.
          <br />
          Grow with Wouchify.
        </h1>
      </section>

      {/* 3. Content Sections */}
      <main className={styles.mainContent}>
        {/* Section 1: Why Advertise With Wouchify? (Navy) */}
        <section className={styles.contentSection}>
          <h2 className={[styles.sectionHeading, styles.navyHeading].join(' ')}>
            Why Advertise With Wouchify?
          </h2>
          <ul className={styles.list}>
            <li>
              • Reach More Customers – Showcase your brand to an engaged audience.
            </li>
            <li>
              • Promote Exclusive Deals – Drive attention to your best offers and discounts.
            </li>
            <li>
              • Increase Sales – Turn offers into measurable conversions.
            </li>
            <li>
              • Boost Brand Visibility – Get your products in front of potential customers.
            </li>
            <li>
              • Performance-Based Growth – Track clicks, purchases, and campaign performance.
            </li>
          </ul>
        </section>

        {/* Section 2: What You Can Promote? (Red) */}
        <section className={styles.contentSection}>
          <h2 className={[styles.sectionHeading, styles.redHeading].join(' ')}>
            What You Can Promote?
          </h2>
          <ul className={[styles.list, styles.redBullets].join(' ')}>
            <li>• Product Deals</li>
            <li>• Discount Coupons</li>
            <li>• Cashback Offers</li>
            <li>• Seasonal Campaigns</li>
            <li>• Special Promotions</li>
            <li>• New Product Launches</li>
          </ul>
        </section>

        {/* Section 3: Partner With Us (Navy) */}
        <section className={styles.contentSection}>
          <h2 className={[styles.sectionHeading, styles.navyHeading].join(' ')}>
            Partner With Us
          </h2>
          <p className={styles.paragraph}>
            Whether you’re a growing brand or an established business, Wouchify can help you reach the right customers with compelling deals.
          </p>
          <p className={styles.paragraph}>
            Ready to grow with Wouchify?
          </p>
          <p className={styles.actionParagraph}>
            <a
              href="mailto:hello@wouchify.com?subject=Wouchify%20Partnership%20Inquiry%20-%20Advertise%20With%20Us"
              className={styles.advertiseActionLink}
            >
              [Advertise With Us]
            </a>
          </p>
          <p className={styles.paragraph}>
            Contact our team to discuss your campaign and partnership opportunities.
          </p>
        </section>
      </main>

      {/* 4. Dashed Red Separator Line */}
      <div className={styles.dashedSeparator} aria-hidden="true" />

      {/* 5. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}
export default MobileAdvertisePage
