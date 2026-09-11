import React from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MobileHelpPage } from './MobileHelpPage'
import { HELP_ROW_1_CARDS, HELP_ROW_2_CARDS } from '../data/helpData'
import helpHeroImg from '../assets/help/help_hero.png'
import helpQuestionBg from '../assets/help/help_question_bg.png'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import './HelpPage.css'

export const HelpPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    return <MobileHelpPage />
  }

  return (
    <div className="help-page">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Help Hero Banner Section */}
      <section className="help-hero" aria-label="Help Banner">
        {/* Exact Question Marks 3D Embossed Background */}
        <div className="help-hero__bg-wrap" aria-hidden="true">
          <img
            src={helpQuestionBg}
            alt=""
            className="help-hero__bg-img"
          />
          <div className="help-hero__overlay" />
        </div>

        {/* Faint W Watermarks */}
        <div className="help-hero__watermark-wrap" aria-hidden="true">
          <img src={watermarkMain} alt="" className="help-hero__watermark help-hero__watermark--1" />
          <img src={watermarkMain} alt="" className="help-hero__watermark help-hero__watermark--2" />
        </div>

        <div className="help-hero__container">
          {/* Left Text Content */}
          <div className="help-hero__content">
            <div className="help-hero__pill-badge">
              Help
            </div>

            <h1 className="help-hero__title">
              How Can we<br />help you?
            </h1>

            <div className="help-hero__sub-pill">
              Please contact us for more details
            </div>
          </div>
        </div>

        {/* Right Red Telephone Handset Illustration with Coiled Cord starting flush from right side */}
        <div className="help-hero__image-wrap" aria-hidden="true">
          <img
            src={helpHeroImg}
            alt="Customer support red telephone"
            className="help-hero__image"
            loading="eager"
          />
        </div>
      </section>

      {/* 3. Action Cards Grid Section */}
      <main className="help-content">
        <div className="help-content__container">
          {/* Row 1: 3 Action Cards */}
          <div className="help-cards-grid help-cards-grid--row1">
            {HELP_ROW_1_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className="help-card"
                style={{
                  backgroundColor: card.bg,
                }}
                aria-label={card.title}
              >
                <div className="help-card__img-wrap">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="help-card__img"
                    loading="lazy"
                  />
                </div>
                <h2 className="help-card__title">{card.title}</h2>
              </a>
            ))}
          </div>

          {/* Row 2: 2 Centered Action Cards */}
          <div className="help-cards-grid help-cards-grid--row2">
            {HELP_ROW_2_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className="help-card"
                style={{
                  backgroundColor: card.bg,
                }}
                aria-label={card.title}
              >
                <div className="help-card__img-wrap">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="help-card__img"
                    loading="lazy"
                  />
                </div>
                <h2 className="help-card__title">{card.title}</h2>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* 4. Footer Section */}
      <FooterSection />
    </div>
  )
}

export default HelpPage
