import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import styles from './MobileCookiePolicyPage.module.css'

export const MobileCookiePolicyPage: React.FC = () => {
  return (
    <div className={styles.mobileCookiePage}>
      {/* 1. Mobile Header (Light Lavender, Minimal variant with hamburger, logo & wishlist icon) */}
      <div className={styles.headerWrapper}>
        <MobileHeader variant="minimal" />
      </div>

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Animated Small W Watermark on Top-Right Corner */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
          width={95}
          height={65}
        />

        {/* Page Heading */}
        <h1 className={styles.pageTitle}>Cookie Policy – Wouchify</h1>

        {/* Document Content */}
        <div className={styles.content}>
          {/* Section 1: 1. Introduction (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.paragraph}>
              Wouchify (&ldquo;Wouchify&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo; or &ldquo;Our&rdquo;) uses cookies and similar technologies on our website and mobile application (&ldquo;Platform&rdquo;) to provide a better, safer, and more personalized experience.
            </p>
            <p className={styles.paragraph}>
              This Cookie Policy explains what cookies are, how we use them, and how you can manage your cookie preferences.
            </p>
          </section>

          {/* Section 2: 2. What Are Cookies? (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. What Are Cookies?</h2>
            <p className={styles.paragraph}>
              Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, understand how the Platform is being used, and improve your overall experience.
            </p>
            <p className={styles.paragraph}>
              Cookies may be temporary (session cookies) or remain on your device for a specific period (persistent cookies).
            </p>
          </section>

          {/* Section 3: 3. How We Use Cookies (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Cookies</h2>
            <p className={styles.paragraph}>
              Wouchify may use cookies and similar technologies to:
            </p>
            <ul className={styles.list}>
              <li>Keep you signed in and maintain your session.</li>
              <li>Remember your preferences and settings.</li>
              <li>Track clicks and purchases to accurately identify eligible cashback and rewards.</li>
              <li>Understand how users interact with our Platform.</li>
              <li>Improve website performance, functionality, and security.</li>
              <li>Provide relevant offers, promotions, and content.</li>
              <li>Analyze traffic and usage patterns.</li>
              <li>Detect and prevent fraudulent or unauthorized activity.</li>
            </ul>
          </section>

          {/* Section 4: 4. Types of Cookies We Use (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Types of Cookies We Use</h2>

            <div className={styles.subgroup}>
              <h3 className={styles.subheading}>Essential Cookies</h3>
              <p className={styles.paragraph}>
                These cookies are necessary for the basic operation of Wouchify. They help with login sessions, security, navigation, and essential Platform functions.
              </p>
            </div>

            <div className={styles.subgroup}>
              <h3 className={styles.subheading}>Performance &amp; Analytics Cookies</h3>
              <p className={styles.paragraph}>
                These cookies help us understand how visitors use our Platform, such as which pages are visited and how users navigate the website. This information helps us improve our services.
              </p>
            </div>

            <div className={styles.subgroup}>
              <h3 className={styles.subheading}>Functional Cookies</h3>
              <p className={styles.paragraph}>
                These cookies remember your preferences and choices to provide a more convenient and personalized experience.
              </p>
            </div>

            <div className={styles.subgroup}>
              <h3 className={styles.subheading}>Advertising &amp; Marketing Cookies</h3>
              <p className={styles.paragraph}>
                These cookies may be used to understand your interests and deliver relevant advertisements, offers, or promotional content. They may also help measure the effectiveness of marketing campaigns.
              </p>
            </div>

            <div className={styles.subgroup}>
              <h3 className={styles.subheading}>Tracking &amp; Affiliate Cookies</h3>
              <p className={styles.paragraph}>
                Wouchify may use tracking technologies to identify when a user visits a participating retailer through Wouchify and completes an eligible purchase. These technologies help us track transactions and calculate applicable cashback or rewards.
              </p>
            </div>
          </section>

          {/* Section 5: 5. Third-Party Cookies (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Third-Party Cookies</h2>
            <p className={styles.paragraph}>
              Some cookies may be placed by third-party service providers that help us operate, analyze, secure, or promote our Platform.
            </p>
            <p className={styles.paragraph}>
              These third parties may collect information about your activity on our Platform in accordance with their own privacy policies and terms.
            </p>
            <p className={styles.paragraph}>
              Wouchify does not control how third-party cookies are used and recommends reviewing the relevant third party’s privacy policy for more information.
            </p>
          </section>

          {/* Section 6: 6. Managing Cookies (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Managing Cookies</h2>
            <p className={styles.paragraph}>
              You can control or disable cookies through your browser or device settings. You may also be presented with cookie preference options when you first visit the Wouchify Platform.
            </p>
            <p className={styles.paragraph}>
              Please note that disabling certain cookies may affect the functionality of the Platform, including login, transaction tracking, cashback, or reward-related features.
            </p>
          </section>

          {/* Section 7: 7. Updates to This Cookie Policy (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Updates to This Cookie Policy</h2>
            <p className={styles.paragraph}>
              Wouchify may update this Cookie Policy from time to time to reflect changes in our services, technologies, or applicable requirements.
            </p>
            <p className={styles.paragraph}>
              Any updated version will be published on the Platform with the revised &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          {/* Section 8: 8. Contact Us (Navy) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Contact Us</h2>
            <p className={styles.paragraph}>
              If you have any questions about this Cookie Policy or how Wouchify uses cookies, you can contact us through the official contact details provided on the Wouchify Platform.
            </p>
          </section>
        </div>
      </main>

      {/* 3. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileCookiePolicyPage
