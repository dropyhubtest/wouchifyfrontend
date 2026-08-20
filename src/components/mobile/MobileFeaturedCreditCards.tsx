import React, { useState } from 'react'
import {
  MOBILE_FEATURED_CREDIT_CARDS,
  type MobileCreditCardItem,
} from '../../data/mobileFeaturedCreditCards'
import './MobileFeaturedCreditCards.css'

interface MobileCreditCardItemProps {
  card: MobileCreditCardItem
}

const MobileCreditCardCard: React.FC<MobileCreditCardItemProps> = ({ card }) => {
  return (
    <div className="mobile-credit-card-card">
      <div className="mobile-credit-card__bank-row">
        <img
          src={card.bankMark}
          alt={`${card.bank} logo mark`}
          className="mobile-credit-card__bank-mark"
          loading="lazy"
        />
        <span className="mobile-credit-card__bank-name">{card.bank}</span>
      </div>

      <div className="mobile-credit-card__art-wrapper">
        <a
          href={card.href}
          className="mobile-credit-card__art-link"
          aria-label={`View ${card.bank} ${card.alt}`}
        >
          <img
            src={card.cardImage}
            alt={card.alt}
            className="mobile-credit-card__art-image"
            loading="lazy"
          />
        </a>
      </div>

      <p className="mobile-credit-card__description">{card.description}</p>
    </div>
  )
}

export const MobileFeaturedCreditCards: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalDots = 6

  return (
    <section className="mobile-featured-credit-cards" aria-label="Top Featured Credit Cards">
      <div className="mobile-featured-credit-cards-heading">
        <span
          className="mobile-featured-credit-cards-heading__accent"
          aria-hidden="true"
        />
        <h2>Top Featured Credit Cards</h2>
      </div>

      <div className="mobile-featured-credit-cards__pill">
        <span className="mobile-featured-credit-cards__pill-text">
          Check the exclusive offers now!!
        </span>
      </div>

      {MOBILE_FEATURED_CREDIT_CARDS.map((card) => (
        <MobileCreditCardCard key={card.id} card={card} />
      ))}

      <div
        className="mobile-featured-credit-cards__pagination"
        role="tablist"
        aria-label="Credit card pagination"
      >
        {Array.from({ length: totalDots }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`mobile-featured-credit-cards__dot ${
              index === activeIndex ? 'mobile-featured-credit-cards__dot--active' : ''
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === activeIndex}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}

export default MobileFeaturedCreditCards
