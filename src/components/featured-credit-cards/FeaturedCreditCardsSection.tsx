import React, { useState, useEffect } from 'react'
import { FEATURED_CREDIT_CARDS } from '../../data/featuredCreditCards'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import iciciBankMark from '../../assets/credit-cards/icici-bank-mark.png'
import iciciPlatinumCard from '../../assets/credit-cards/icici-platinum-card.png'
import './FeaturedCreditCardsSection.css'

const DOT_LEFT_POSITIONS = [695, 783, 871, 959, 1047]

export const FeaturedCreditCardsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [cards, setCards] = useState<any[]>(FEATURED_CREDIT_CARDS)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const loadCards = async () => {
    try {
      const data = await adminApi.getCreditCards({ all: true })
      if (Array.isArray(data) && data.length > 0) {
        // Collect IDs/Banks of cards explicitly hidden
        const hiddenBanks = new Set(
          data
            .filter((c: any) => c.showOnHome === false || c.isFeatured === false || c.sectionPlacement === 'none' || c.status === 'inactive')
            .map((c: any) => (c.bank || c.cardName || c.name || c.id || '').toLowerCase().trim())
        )

        const activeLiveCards = data.filter((c: any) => 
          c.showOnHome !== false && 
          c.isFeatured !== false && 
          c.sectionPlacement !== 'none' && 
          c.status !== 'inactive'
        )

        // Filter default cards
        const visibleDefaults = FEATURED_CREDIT_CARDS.filter(
          (item) => !hiddenBanks.has((item.bank || '').toLowerCase().trim()) && 
                    !hiddenBanks.has((item.heading || '').toLowerCase().trim()) && 
                    !hiddenBanks.has(item.id.toLowerCase().trim())
        )

        if (activeLiveCards.length > 0) {
          const merged = activeLiveCards.map((c: any, idx: number) => {
            const staticFallback = FEATURED_CREDIT_CARDS.find(fc => fc.id === c.id || fc.heading?.toLowerCase() === (c.cardName || c.name || '').toLowerCase()) || FEATURED_CREDIT_CARDS[idx % FEATURED_CREDIT_CARDS.length]
            const rawCardImg = c.imageUrl || c.cardImage
            const rawBankMark = c.bankLogoUrl || c.bankMark
            return {
              ...staticFallback,
              id: c._id || c.id || staticFallback.id,
              heading: c.cardName || c.name || staticFallback.heading,
              bank: c.bank || staticFallback.bank,
              description: c.welcomeOffer || c.rewardRate || staticFallback.description,
              cardImage: (rawCardImg && (rawCardImg.startsWith('http') || rawCardImg.startsWith('data:') || rawCardImg.startsWith('/'))) ? rawCardImg : staticFallback.cardImage,
              bankMark: (rawBankMark && (rawBankMark.startsWith('http') || rawBankMark.startsWith('data:') || rawBankMark.startsWith('/'))) ? rawBankMark : staticFallback.bankMark,
              href: c.affiliateLink || staticFallback.href
            }
          })
          setCards(merged)
        } else {
          setCards(visibleDefaults)
        }
      }
    } catch (err) {
      console.warn('Could not load credit cards:', err)
    }
  }

  useEffect(() => {
    loadCards()
    const handleUpdate = () => loadCards()
    window.addEventListener('wouchify_credit_cards_updated', handleUpdate)
    return () => window.removeEventListener('wouchify_credit_cards_updated', handleUpdate)
  }, [])

  useEffect(() => {
    if (cards.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [cards.length])

  return (
    <section
      className="featured-credit-cards-section"
      aria-label="Top Featured Credit Cards"
      style={
        {
          '--credit-cards-scale': sectionScale,
          height: `${624 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 624 Reference Canvas */}
      <div className="featured-credit-cards-canvas">
        {/* Section Heading with Dark Accent */}
        <div className="featured-credit-cards__heading-accent" aria-hidden="true" />
        <h2 className="featured-credit-cards__title">Top Featured Credit Cards</h2>

        {/* Navy Sub-Pill and Text */}
        <div className="featured-credit-cards__pill" aria-hidden="true" />
        <p className="featured-credit-cards__pill-text">
          Check the exclusive offers now!!
        </p>

        {/* Carousel Viewport */}
        <div className="featured-credit-cards__viewport">
          <div
            className="featured-credit-cards__track"
            style={{ transform: `translateX(-${activeIndex * 1920}px)` }}
          >
            {cards.map((card) => (
              <div key={card.id} className="featured-credit-cards__slide">
                {/* Active Credit Card Data Content */}
                <img
                  src={card.bankMark || iciciBankMark}
                  alt={`${card.bank || 'Bank'} logo`}
                  className="featured-credit-cards__bank-mark"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (target.src !== iciciBankMark) {
                      target.src = iciciBankMark
                    }
                  }}
                />

                <h3 className="featured-credit-cards__bank-heading">
                  {card.heading || card.bank}
                </h3>

                <p className="featured-credit-cards__offer-description">
                  {card.description}
                </p>

                {/* Clickable Credit Card Anchor */}
                <a
                  href={card.href || '/credit-cards'}
                  aria-label={`View ${card.heading || 'credit card'} offer`}
                  className="featured-credit-cards__card-link"
                >
                  <img
                    src={card.cardImage || iciciPlatinumCard}
                    alt={`${card.heading || 'Credit card'}`}
                    className="featured-credit-cards__card-image"
                    width="613"
                    height="561"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (target.src !== iciciPlatinumCard) {
                        target.src = iciciPlatinumCard
                      }
                    }}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {cards.map((_, index) => {
          if (index >= 5) return null
          const leftPos = DOT_LEFT_POSITIONS[index] || (695 + index * 88)
          const isActive = index === activeIndex
          return (
            <button
              key={index}
              type="button"
              className={`featured-credit-cards__dot ${
                isActive ? 'featured-credit-cards__dot--active' : ''
              }`}
              style={{ left: `${leftPos}px` }}
              aria-label={`Go to credit card slide ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            />
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedCreditCardsSection
