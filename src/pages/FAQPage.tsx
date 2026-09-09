import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import { FAQCard } from '../components/faq'
import { FAQ_ITEMS } from '../data/faqData'

import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'

import './FAQPage.css'

export const FAQPage: React.FC = () => {
  return (
    <div className="faq-page">
      {/* 1. Desktop Navbar */}
      <Navbar />

      {/* 2. Main FAQ Container */}
      <main className="faq-page__content">
        {/* Header: Title & Watermark */}
        <div className="faq-page__header">
          <h1 className="faq-page__title">Frequently Asked Questions</h1>

          {/* Animated W Watermark in Background */}
          <WatermarkAnimation
            className="faq-page__watermark"
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            width={260}
            height={175}
          />
        </div>

        {/* 3. Interactive Question Cards Stack */}
        <section className="faq-page__list" aria-label="Frequently Asked Questions list">
          {FAQ_ITEMS.map((item) => (
            <FAQCard key={item.id} item={item} />
          ))}
        </section>
      </main>

      {/* 4. Footer Section */}
      <FooterSection />
    </div>
  )
}

export default FAQPage
