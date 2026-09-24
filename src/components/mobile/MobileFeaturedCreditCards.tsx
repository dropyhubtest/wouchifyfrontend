import React, { useState, useEffect } from 'react'
import {
  MOBILE_FEATURED_CREDIT_CARDS,
  type MobileCreditCardItem,
} from '../../data/mobileFeaturedCreditCards'
import { adminApi } from '../../services/adminApi'
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
  const [cards, setCards] = useState<MobileCreditCardItem[]>(MOBILE_FEATURED_CREDIT_CARDS)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    adminApi.getPublicCreditCards().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter((c: any) => c.showOnHome !== false && (c.status === 'active' || c.status === 'featured' || !c.status))
        if (filtered.length > 0) {
          const mapped: MobileCreditCardItem[] = filtered.map((c: any, idx: number) => {
            const staticFallback = MOBILE_FEATURED_CREDIT_CARDS[idx % MOBILE_FEATURED_CREDIT_CARDS.length]
            return {
              id: c._id || c.id || `mob-card-${idx}`,
              bank: c.bank || staticFallback.bank,
              bankMark: c.bankLogoUrl || staticFallback.bankMark,
              cardImage: c.imageUrl || staticFallback.cardImage,
              alt: c.cardName || c.name || staticFallback.alt,
              description: c.welcomeOffer || c.rewardRate || staticFallback.description,
              href: c.affiliateLink || staticFallback.href
            }
          })
          setCards(mapped)
        }
      }
    }).catch(console.warn)
  }, [])

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

      {cards.slice(activeIndex, activeIndex + 1).map((card) => (
        <MobileCreditCardCard key={card.id} card={card} />
      ))}

      <div
        className="mobile-featured-credit-cards__pagination"
        role="tablist"
        aria-label="Credit card pagination"
      >
        {cards.map((_, index) => (
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
