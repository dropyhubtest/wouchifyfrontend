import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MobileAdvertisePage } from './MobileAdvertisePage'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import advertiseHeroImg from '../assets/advertise/advertise_hero.png'

import './AdvertisePage.css'

export const AdvertisePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileAdvertisePage />
  }

  const handlePartnerScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('partner-with-us')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="advertise-page">
      {/* 1. Header (Desktop Navbar) */}
      <Navbar />

      {/* 2. Hero Section with Exact Figma S-Curve Background */}
      <section className="advertise-hero" aria-label="Advertise with Wouchify Hero">
        {/* Animated Slide-in Red S-Curve Wave Background */}
        <div className="advertise-hero__bg-wave" aria-hidden="true" />

        <div className="advertise-hero__container">
          {/* Animated W Watermark in Background */}
          <WatermarkAnimation
            className="advertise-hero__watermark"
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            width={320}
            height={215}
          />

          {/* Left Column: Copy & CTAs */}
          <div className="advertise-hero__left">
            <div className="advertise-hero__badge">Advertise with us</div>

            <h1 className="advertise-hero__title">
              <span className="advertise-hero__title-line">Promote.</span>
              <span className="advertise-hero__title-line">Reach.</span>
              <span className="advertise-hero__title-line">Grow with Wouchify.</span>
            </h1>

            <p className="advertise-hero__subtitle">
              <span className="advertise-hero__subtitle-line">Showcase your offers to millions of Smart shoppers, drive</span>
              <span className="advertise-hero__subtitle-line">more brand with India&apos;s trusted <strong>deals &amp; cashback</strong> platforms</span>
            </p>

            <a
              href="#partner-with-us"
              onClick={handlePartnerScroll}
              className="advertise-hero__cta-btn"
            >
              Partner with us&gt;&gt;
            </a>
          </div>

          {/* Right Column: Hero Graphic (Static, Proportional Size) */}
          <div className="advertise-hero__right">
            <img
              src={advertiseHeroImg}
              alt="Wouchify Advertising and Partner Deals"
              className="advertise-hero__image"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* 3. Main Content Sections */}
      <main className="advertise-page__content-container">
        {/* Section 1: Why Advertise With Wouchify? (Navy) */}
        <section className="advertise-section">
          <h2 className="advertise-section__title text-navy">
            Why Advertise With Wouchify?
          </h2>
          <ul className="advertise-section__list">
            <li>
              <strong>Reach More Customers</strong> – Showcase your brand to an engaged audience.
            </li>
            <li>
              <strong>Promote Exclusive Deals</strong> – Drive attention to your best offers and discounts.
            </li>
            <li>
              <strong>Increase Sales</strong> – Turn offers into measurable conversions.
            </li>
            <li>
              <strong>Boost Brand Visibility</strong> – Get your products in front of potential customers.
            </li>
            <li>
              <strong>Performance-Based Growth</strong> – Track clicks, purchases, and campaign performance.
            </li>
          </ul>
        </section>

        {/* Section 2: What You Can Promote? (Red) */}
        <section className="advertise-section">
          <h2 className="advertise-section__title text-red">
            What You Can Promote?
          </h2>
          <ul className="advertise-section__list simple-bullets">
            <li>Product Deals</li>
            <li>Discount Coupons</li>
            <li>Cashback Offers</li>
            <li>Seasonal Campaigns</li>
            <li>Special Promotions</li>
            <li>New Product Launches</li>
          </ul>
        </section>

        {/* Section 3: Partner With Us (Navy) */}
        <section id="partner-with-us" className="advertise-section partner-section">
          <h2 className="advertise-section__title text-navy">
            Partner With Us
          </h2>
          <p className="advertise-section__text">
            Whether you’re a growing brand or an established business, Wouchify can help you reach the right customers with compelling deals.
          </p>
          <p className="advertise-section__text">
            Ready to grow with Wouchify?
          </p>
          <div className="advertise-action-wrapper">
            <a
              href="mailto:hello@wouchify.com?subject=Wouchify%20Partnership%20Inquiry%20-%20Advertise%20With%20Us"
              className="advertise-partner-pill-btn"
            >
              [Advertise With Us]
            </a>
          </div>
          <p className="advertise-section__text">
            Contact our team to discuss your campaign and partnership opportunities.
          </p>
        </section>
      </main>

      {/* 4. Footer Section */}
      <FooterSection />
    </div>
  )
}
export default AdvertisePage
