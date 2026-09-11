import React from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import contactUsImg from '../assets/help/contactus.png'
import feedbackImg from '../assets/help/feedback.png'
import faqImg from '../assets/help/faq.png'
import cashbackImg from '../assets/help/cashback.png'
import trackCashbackImg from '../assets/help/track_cashback.png'
import styles from './MobileHelpPage.module.css'

interface MobileHelpCard {
  id: string
  title: string
  image: string
  bg: string
  href: string
}

const MOBILE_ROW1_CARDS: MobileHelpCard[] = [
  {
    id: 'contact-us',
    title: 'Contact\nUs',
    image: contactUsImg,
    bg: '#EBF3FF',
    href: '/contact',
  },
  {
    id: 'give-feedback',
    title: 'Give us\nFeedback',
    image: feedbackImg,
    bg: '#FCEEE3',
    href: '/contact',
  },
  {
    id: 'faq',
    title: 'Frequently asked\nQuestions',
    image: faqImg,
    bg: '#EFFBD7',
    href: '/faq',
  },
]

const MOBILE_ROW2_CARDS: MobileHelpCard[] = [
  {
    id: 'about-cashback',
    title: 'About\nCashback',
    image: cashbackImg,
    bg: '#FCF8D5',
    href: '/faq',
  },
  {
    id: 'track-cashback',
    title: 'Track\nyour Cashback',
    image: trackCashbackImg,
    bg: '#FCE7F3',
    href: '/wallet',
  },
]

export const MobileHelpPage: React.FC = () => {
  return (
    <div className={styles.mobileHelpPage}>
      {/* 1. Mobile Header (Light Lavender, Minimal variant with hamburger, logo & wishlist icon) */}
      <div className={styles.headerWrapper}>
        <MobileHeader variant="minimal" />
      </div>

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        {/* Floating Small W Watermark on Top-Right Corner */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
          width={100}
          height={70}
        />

        {/* Home Navigation Link */}
        <a
          href="/"
          className={styles.backLink}
          aria-label="Go to Home"
        >
          &lt;&lt; Home
        </a>

        {/* Page Heading */}
        <h1 className={styles.pageTitle}>How can we help you?</h1>

        {/* Cards Grid */}
        <div className={styles.cardsSection}>
          {/* Row 1: 3 cards */}
          <div className={styles.cardsRow1}>
            {MOBILE_ROW1_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className={styles.card}
                style={{ backgroundColor: card.bg }}
                aria-label={card.title.replace('\n', ' ')}
              >
                <div className={styles.cardImgWrap}>
                  <img
                    src={card.image}
                    alt=""
                    className={styles.cardImg}
                    loading="lazy"
                  />
                </div>
                <span className={styles.cardTitle}>{card.title}</span>
              </a>
            ))}
          </div>

          {/* Row 2: 2 centered cards */}
          <div className={styles.cardsRow2}>
            {MOBILE_ROW2_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className={styles.card}
                style={{ backgroundColor: card.bg }}
                aria-label={card.title.replace('\n', ' ')}
              >
                <div className={styles.cardImgWrap}>
                  <img
                    src={card.image}
                    alt=""
                    className={styles.cardImg}
                    loading="lazy"
                  />
                </div>
                <span className={styles.cardTitle}>{card.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Dotted separator above footer */}
        <div className={styles.redDottedDivider} aria-hidden="true" />
      </main>

      {/* 3. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileHelpPage
