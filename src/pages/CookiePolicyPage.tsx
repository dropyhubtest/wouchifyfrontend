import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MobileCookiePolicyPage } from './MobileCookiePolicyPage'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import './CookiePolicyPage.css'

export const CookiePolicyPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileCookiePolicyPage />
  }

  return (
    <div className="cookie-page">
      {/* 1. Header (Desktop Navbar) */}
      <Navbar />

      {/* 2. Main Content Container */}
      <main className="cookie-page__container">
        {/* Animated W Watermark on Top-Left */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className="cookie-page__watermark-wrap"
          width={320}
          height={210}
        />

        {/* Page Title */}
        <h1 className="cookie-page__title">Cookie Policy – Wouchify</h1>

        {/* Document Content */}
        <div className="cookie-page__content">
          {/* Section 1: 1. Introduction (Red) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">1. Introduction</h2>
            <p className="cookie-page__paragraph">
              Wouchify (&ldquo;Wouchify&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo; or &ldquo;Our&rdquo;) uses cookies and similar technologies on our website and mobile application (&ldquo;Platform&rdquo;) to provide a better, safer, and more personalized experience.
            </p>
            <p className="cookie-page__paragraph">
              This Cookie Policy explains what cookies are, how we use them, and how you can manage your cookie preferences.
            </p>
          </section>

          {/* Section 2: 2. What Are Cookies? (Navy) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">2. What Are Cookies?</h2>
            <p className="cookie-page__paragraph">
              Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, understand how the Platform is being used, and improve your overall experience.
            </p>
            <p className="cookie-page__paragraph">
              Cookies may be temporary (session cookies) or remain on your device for a specific period (persistent cookies).
            </p>
          </section>

          {/* Section 3: 3. How We Use Cookies (Red) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">3. How We Use Cookies</h2>
            <p className="cookie-page__paragraph">
              Wouchify may use cookies and similar technologies to:
            </p>
            <ul className="cookie-page__list">
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
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">4. Types of Cookies We Use</h2>

            <div className="cookie-page__subgroup">
              <h3 className="cookie-page__subheading">Essential Cookies</h3>
              <p className="cookie-page__paragraph">
                These cookies are necessary for the basic operation of Wouchify. They help with login sessions, security, navigation, and essential Platform functions.
              </p>
            </div>

            <div className="cookie-page__subgroup">
              <h3 className="cookie-page__subheading">Performance &amp; Analytics Cookies</h3>
              <p className="cookie-page__paragraph">
                These cookies help us understand how visitors use our Platform, such as which pages are visited and how users navigate the website. This information helps us improve our services.
              </p>
            </div>

            <div className="cookie-page__subgroup">
              <h3 className="cookie-page__subheading">Functional Cookies</h3>
              <p className="cookie-page__paragraph">
                These cookies remember your preferences and choices to provide a more convenient and personalized experience.
              </p>
            </div>

            <div className="cookie-page__subgroup">
              <h3 className="cookie-page__subheading">Advertising &amp; Marketing Cookies</h3>
              <p className="cookie-page__paragraph">
                These cookies may be used to understand your interests and deliver relevant advertisements, offers, or promotional content. They may also help measure the effectiveness of marketing campaigns.
              </p>
            </div>

            <div className="cookie-page__subgroup">
              <h3 className="cookie-page__subheading">Tracking &amp; Affiliate Cookies</h3>
              <p className="cookie-page__paragraph">
                Wouchify may use tracking technologies to identify when a user visits a participating retailer through Wouchify and completes an eligible purchase. These technologies help us track transactions and calculate applicable cashback or rewards.
              </p>
            </div>
          </section>

          {/* Section 5: 5. Third-Party Cookies (Red) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">5. Third-Party Cookies</h2>
            <p className="cookie-page__paragraph">
              Some cookies may be placed by third-party service providers that help us operate, analyze, secure, or promote our Platform.
            </p>
            <p className="cookie-page__paragraph">
              These third parties may collect information about your activity on our Platform in accordance with their own privacy policies and terms.
            </p>
            <p className="cookie-page__paragraph">
              Wouchify does not control how third-party cookies are used and recommends reviewing the relevant third party’s privacy policy for more information.
            </p>
          </section>

          {/* Section 6: 6. Managing Cookies (Navy) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">6. Managing Cookies</h2>
            <p className="cookie-page__paragraph">
              You can control or disable cookies through your browser or device settings. You may also be presented with cookie preference options when you first visit the Wouchify Platform.
            </p>
            <p className="cookie-page__paragraph">
              Please note that disabling certain cookies may affect the functionality of the Platform, including login, transaction tracking, cashback, or reward-related features.
            </p>
          </section>

          {/* Section 7: 7. Updates to This Cookie Policy (Red) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">7. Updates to This Cookie Policy</h2>
            <p className="cookie-page__paragraph">
              Wouchify may update this Cookie Policy from time to time to reflect changes in our services, technologies, or applicable requirements.
            </p>
            <p className="cookie-page__paragraph">
              Any updated version will be published on the Platform with the revised &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          {/* Section 8: 8. Contact Us (Navy) */}
          <section className="cookie-page__section">
            <h2 className="cookie-page__section-title">8. Contact Us</h2>
            <p className="cookie-page__paragraph">
              If you have any questions about this Cookie Policy or how Wouchify uses cookies, you can contact us through the official contact details provided on the Wouchify Platform.
            </p>
          </section>
        </div>
      </main>

      {/* 3. Footer Section */}
      <FooterSection />
    </div>
  )
}

export default CookiePolicyPage
