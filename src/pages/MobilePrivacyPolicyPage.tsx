import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import styles from './MobilePrivacyPolicyPage.module.css'

export const MobilePrivacyPolicyPage: React.FC = () => {
  return (
    <div className={styles.mobilePrivacyPage}>
      {/* 1. Mobile Header (Light Lavender, Minimal variant with hamburger, logo & wishlist icon) */}
      <div className={styles.headerWrapper}>
        <MobileHeader variant="minimal" />
      </div>

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Animated W Watermark on Top-Right Corner */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
        />

        {/* Page Heading */}
        <h1 className={styles.pageTitle}>Privacy Policy – Wouchify</h1>

        {/* Document Content */}
        <div className={styles.content}>
          {/* Section 1: 1. Introduction (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.paragraph}>
              Wouchify respects your privacy and is committed to protecting your personal information when you use our website, mobile application, and services.
            </p>
          </section>

          {/* Section 2: 2. Information We Collect (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
            <p className={styles.paragraph}>
              We may collect information such as:
            </p>
            <ul className={styles.list}>
              <li>Name and contact details</li>
              <li>Account and login information</li>
              <li>Transaction and cashback details</li>
              <li>Device, browser, and usage information</li>
              <li>Information you provide when contacting our support team</li>
            </ul>
          </section>

          {/* Section 3: 3. How We Use Your Information (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p className={styles.paragraph}>
              We use your information to:
            </p>
            <ul className={styles.list}>
              <li>Create and manage your Wouchify account</li>
              <li>Process cashback, rewards, and referrals</li>
              <li>Track eligible purchases and transactions</li>
              <li>Provide customer support</li>
              <li>Improve our Platform and services</li>
              <li>Detect and prevent fraud or misuse</li>
              <li>Send important service-related communications</li>
            </ul>
          </section>

          {/* Section 4: 4. Cookies & Tracking Technologies (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Cookies &amp; Tracking Technologies</h2>
            <p className={styles.paragraph}>
              Wouchify uses cookies and similar technologies to maintain sessions, remember preferences, track eligible purchases, measure performance, and improve your experience. You can manage cookies through your browser or device settings.
            </p>
          </section>

          {/* Section 5: 5. Sharing of Information (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Sharing of Information</h2>
            <p className={styles.paragraph}>
              We may share necessary information with trusted service providers, partner stores, payment providers, analytics providers, or other third parties when required to provide our services. We do not sell your personal information.
            </p>
          </section>

          {/* Section 6: 6. Data Security (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Data Security</h2>
            <p className={styles.paragraph}>
              We take reasonable measures to protect your information from unauthorized access, misuse, loss, or disclosure. However, no online service can guarantee complete security.
            </p>
          </section>

          {/* Section 7: 7. Third-Party Links (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Third-Party Links</h2>
            <p className={styles.paragraph}>
              Wouchify may contain links to third-party websites or stores. Their privacy practices are governed by their own policies, and we recommend reviewing their privacy policies before providing personal information.
            </p>
          </section>

          {/* Section 8: 8. Your Choices (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Your Choices</h2>
            <p className={styles.paragraph}>
              You may review or update your account information and manage certain communication and cookie preferences. You may also contact us regarding your personal information.
            </p>
          </section>

          {/* Section 9: 9. Policy Updates (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Policy Updates</h2>
            <p className={styles.paragraph}>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page along with the revised Last Updated date.
            </p>
          </section>

          {/* Section 10: 10. Contact Us (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Us</h2>
            <p className={styles.paragraph}>
              If you have questions or concerns about this Privacy Policy or your personal information, please contact Wouchify through the contact details available on our Platform.
            </p>
          </section>
        </div>
      </main>

      {/* 3. Mobile Footer (Accordion navigation, contact, socials, and bottom links) */}
      <MobileFooter />
    </div>
  )
}

export default MobilePrivacyPolicyPage
