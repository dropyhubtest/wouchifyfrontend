import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import styles from './MobileTermsPage.module.css'

export const MobileTermsPage: React.FC = () => {
  return (
    <div className={styles.mobileTermsPage}>
      {/* 1. Mobile Header (64px, #EEEFFF) */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Animated W Watermark on Top-Right */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
        />

        {/* Page Heading */}
        <h1 className={styles.pageTitle}>Terms &amp; Conditions – Wouchify</h1>

        {/* Document Content */}
        <div className={styles.content}>
          {/* Section: 1. Introduction (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.paragraph}>
              Welcome to Wouchify (&ldquo;Wouchify&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using the Wouchify website, mobile application, or services (&ldquo;Platform&rdquo;), you agree to these Terms &amp; Conditions. Please read them carefully before using our services.
            </p>
            <p className={styles.paragraph}>
              We may update these Terms from time to time. Any important changes will be communicated through the Platform or your registered contact details.
            </p>
          </section>

          {/* Section: 2. Membership (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Membership</h2>
            <p className={styles.paragraph}>
              To use Wouchify, you must be 18 years or older and provide accurate and complete registration information during registration.
            </p>
            <p className={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account information and must not allow others to misuse your account.
            </p>
            <p className={styles.paragraph}>
              Users are not permitted to run paid search ads (such as Google, Facebook, etc.) or post forms directing traffic to Wouchify without authorization. Violation may result in suspension or termination of the account.
            </p>
          </section>

          {/* Section: 3. Cashback & Rewards (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Cashback &amp; Rewards</h2>
            <p className={styles.paragraph}>
              Wouchify allows registered users to earn cashback or rewards when shopping at eligible participating merchants through our platform.
            </p>
            <p className={styles.paragraph}>
              Cashback will be earned eligible only when:
            </p>
            <ul className={styles.list}>
              <li>The purchase is successfully tracked through Wouchify.</li>
              <li>The retailer confirms the transaction as genuine and successful.</li>
              <li>The product/service has been delivered.</li>
              <li>The applicable return or refund period has expired.</li>
              <li>Wouchify receives the applicable commission from the retailer.</li>
            </ul>
            <p className={styles.paragraph}>
              Cashback or rewards may not be credited if the transaction is cancelled, exchanged, returned, refunded, rejected, or rejected by the retailer.
            </p>
            <p className={styles.paragraph}>
              The estimated reward amount displayed on Wouchify may change depending on the commission received from the retailer.
            </p>
          </section>

          {/* Section: 4. Referral Program (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Referral Program</h2>
            <p className={styles.paragraph}>
              Wouchify may offer referral rewards to existing members for introducing new users. Referral rewards are subject to the applicable referral program terms and qualifying conditions.
            </p>
            <p className={styles.paragraph}>
              Wouchify reserves the right to modify, suspend, or discontinue referral programs at any time.
            </p>
          </section>

          {/* Section: 5. Missing Cashback (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Missing Cashback</h2>
            <p className={styles.paragraph}>
              If your eligible cashback does not appear in your account, you may raise a support request within 3-7 days of the transaction.
            </p>
            <p className={styles.paragraph}>
              Wouchify may verify the transaction and tracking information with the relevant retailer. Missing cashback will only be credited when the retailer confirms and pays the applicable commission.
            </p>
          </section>

          {/* Section: 6. Cashback & Withdrawal (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cashback &amp; Withdrawal</h2>
            <p className={styles.paragraph}>
              Validated cashback or rewards can be withdrawn or redeemed once the minimum applicable threshold has been reached.
            </p>
            <p className={styles.paragraph}>
              Available withdrawal methods may include:
            </p>
            <ul className={styles.list}>
              <li>Bank Transfer</li>
              <li>UPI</li>
              <li>Gift Cards</li>
              <li>Wallets</li>
              <li>Other payment methods offered by Wouchify.</li>
            </ul>
            <p className={styles.paragraph}>
              Users are responsible for providing accurate payment details. Wouchify is not responsible for payment failures resulting from incorrect information provided by the user.
            </p>
          </section>

          {/* Section: 7. Cashback Expiry (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Cashback Expiry</h2>
            <p className={styles.paragraph}>
              Wouchify may set an expiry period for cashback, rewards, vouchers, or promotional earnings.
            </p>
            <p className={styles.paragraph}>
              Users should regularly access their Wouchify account to keep their earnings active.
            </p>
            <p className={styles.paragraph}>
              Expired earnings may no longer be available for withdrawal or redemption.
            </p>
          </section>

          {/* Section: 8. Conditions for Earning Cashback (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Conditions for Earning Cashback</h2>
            <p className={styles.paragraph}>
              To ensure successful tracking:
            </p>
            <ul className={styles.list}>
              <li>Complete your purchase in a single browsing session.</li>
              <li>Avoid using a VPN while making a purchase.</li>
              <li>Keep third-party cookies enabled.</li>
              <li>Make sure you are logged into your Wouchify account.</li>
              <li>Avoid using unauthorized external codes or cashbacks.</li>
            </ul>
            <p className={styles.paragraph}>
              Wouchify cannot guarantee cashback where the retailer or its tracking system fails to record the transaction.
            </p>
          </section>

          {/* Section: 9. Incorrect Credits & Misuse (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Incorrect Credits &amp; Misuse</h2>
            <p className={styles.paragraph}>
              Wouchify reserves the right to cancel, adjust, or recover cashback or rewards that were credited incorrectly or obtained through fraud, misuse, technical errors, or violation of these Terms.
            </p>
            <p className={styles.paragraph}>
              Accounts involved in fraudulent or abnormal activity may be suspended or permanently terminated.
            </p>
            <p className={styles.paragraph}>
              Users must not:
            </p>
            <ul className={styles.list}>
              <li>Use another person&apos;s personal or payment information.</li>
              <li>Create fake or unauthorized referral links.</li>
              <li>Manipulate cashback or reward systems.</li>
              <li>Use the Platform for illegal or unauthorized purposes.</li>
              <li>Resell products purchased through the Platform for commercial gain where prohibited.</li>
            </ul>
          </section>

          {/* Section: 10. Intellectual Property (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Intellectual Property</h2>
            <p className={styles.paragraph}>
              All content, designs, trademarks, logos, graphics, software, and other materials available on Wouchify are owned by or licensed to Wouchify.
            </p>
            <p className={styles.paragraph}>
              You may not copy, reproduce, distribute, modify, or commercially use Platform content without prior written permission.
            </p>
          </section>

          {/* Section: 11. Privacy (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Privacy</h2>
            <p className={styles.paragraph}>
              Your use of Wouchify is also subject to our Privacy Policy. By using the Platform, you consent to the collection and use of information as described in the Privacy Policy.
            </p>
          </section>

          {/* Section: 12. Disclaimer (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Disclaimer</h2>
            <p className={styles.paragraph}>
              Wouchify acts as a platform connecting users with participating retailers. We are not the seller or supplier of products or services offered by retailers.
            </p>
            <p className={styles.paragraph}>
              We are not responsible for the quality, safety, legality, delivery, availability, returns, refunds, or other aspects of products and services provided by retailers.
            </p>
          </section>

          {/* Section: 13. Platform Availability (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>13. Platform Availability</h2>
            <p className={styles.paragraph}>
              Wouchify may modify, suspend, or discontinue any part of its services when required for technical, legal, security, or business reasons.
            </p>
            <p className={styles.paragraph}>
              We will make reasonable efforts to keep the Platform available but cannot guarantee uninterrupted access.
            </p>
          </section>

          {/* Section: 14. Communications (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>14. Communications</h2>
            <p className={styles.paragraph}>
              By registering with Wouchify, you agree to receive service-related communications, updates, notifications, surveys, and promotional communications through email, SMS, WhatsApp, calls, push notifications, or other available communication channels.
            </p>
            <p className={styles.paragraph}>
              You may manage promotional communication preferences where applicable.
            </p>
          </section>

          {/* Section: 15. Limitation of Liability (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>15. Limitation of Liability</h2>
            <p className={styles.paragraph}>
              Wouchify provides its Platform and services on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
            </p>
            <p className={styles.paragraph}>
              To the extent permitted by applicable law, Wouchify shall not be responsible for indirect, incidental, special, or consequential losses arising from your use of the Platform or transactions with retailers.
            </p>
            <p className={styles.paragraph}>
              Wouchify&apos;s total liability for claims relating to the Platform shall be limited to the extent permitted under applicable law.
            </p>
          </section>

          {/* Section: 16. Indemnity (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>16. Indemnity</h2>
            <p className={styles.paragraph}>
              You agree to indemnify and hold Wouchify harmless from claims, losses, liabilities, and expenses arising from your violation of these Terms or misuse of the Platform.
            </p>
          </section>

          {/* Section: 17. Changes to These Terms (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>17. Changes to These Terms</h2>
            <p className={styles.paragraph}>
              Wouchify may update these Terms from time to time. Updated terms will be published on the Platform and will become effective from the date specified in the updated terms.
            </p>
            <p className={styles.paragraph}>
              Continued use of Wouchify after changes are published means you accept the updated Terms.
            </p>
          </section>

          {/* Section: 18. Governing Law (Red) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>18. Governing Law</h2>
            <p className={styles.paragraph}>
              These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts in India.
            </p>
          </section>

          {/* Section: 19. Grievance & Contact (Blue) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>19. Grievance &amp; Contact</h2>
            <p className={styles.paragraph}>
              For questions, complaints, or concerns regarding these Terms, or security concerns, users may contact Wouchify through the official contact details provided on the Platform.
            </p>
            <p className={styles.paragraph}>
              Wouchify may update its grievance and contact details from time to time.
            </p>
          </section>
        </div>
      </main>

      {/* 3. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileTermsPage
