import React, { useState, useEffect } from 'react'
import {
  MOBILE_FLASH_DEALS,
  type MobileFlashDealItem,
} from '../../data/mobileFlashDeals'
import { getPublicLootDeals } from '../../services/api'
import './MobileFlashDeals.css'

interface MobileFlashDealCardProps {
  deal: MobileFlashDealItem
}

const MobileFlashDealCard: React.FC<MobileFlashDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.href}
      className="mobile-flash-deal-card"
      aria-label={`View ${deal.title}`}
    >
      {/* Left Image with Discount Tag */}
      <div className="mobile-flash-deal-card__media">
        <img
          src={deal.image}
          alt={deal.title}
          className="mobile-flash-deal-card__img"
          loading="lazy"
        />
        <div className="mobile-flash-deal-card__badge" aria-label={`${deal.discount} off`}>
          <span className="mobile-flash-deal-card__badge-val">{deal.discount}</span>
          <span className="mobile-flash-deal-card__badge-txt">off!</span>
        </div>
      </div>

      {/* Right Details Panel */}
      <div className="mobile-flash-deal-card__details">
        {/* Top Row: Category Pill on Left, Store Logo on Right */}
        <div className="mobile-flash-deal-card__top">
          <span className="mobile-flash-deal-card__tag">{deal.category}</span>
          <img
            src={deal.storeLogo}
            alt={deal.storeName}
            className="mobile-flash-deal-card__store-img"
          />
        </div>

        {/* Product Title */}
        <h3 className="mobile-flash-deal-card__title">{deal.title}</h3>

        {/* Price Row */}
        <div className="mobile-flash-deal-card__price-group">
          <span className="mobile-flash-deal-card__price">{deal.currentPrice}</span>
          <span className="mobile-flash-deal-card__original-price">{deal.originalPrice}</span>
        </div>

        {/* Grab Deal Button */}
        <div className="mobile-flash-deal-card__cta-row">
          <span className="mobile-flash-deal-card__cta">Grab deal!!</span>
        </div>
      </div>
    </a>
  )
}

export const MobileFlashDeals: React.FC = () => {
  const [deals, setDeals] = useState<MobileFlashDealItem[]>(MOBILE_FLASH_DEALS)

  useEffect(() => {
    getPublicLootDeals().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.type === 'flash' || d.dealType === 'flash' || d.lootType === 'flash' || !d.type)
        )
        if (filtered.length > 0) {
          const mapped: MobileFlashDealItem[] = filtered.map((d: any, idx: number) => {
            const staticFallback = MOBILE_FLASH_DEALS[idx % MOBILE_FLASH_DEALS.length]
            return {
              id: d._id || d.id || `mobile-flash-${idx}`,
              title: d.title || d.name || staticFallback.title,
              category: d.category || staticFallback.category,
              storeName: d.store || d.storeName || staticFallback.storeName,
              storeLogo: d.storeLogo || staticFallback.storeLogo,
              image: d.image || d.productImage || staticFallback.image,
              discount: d.discount || d.discountLabel || staticFallback.discount,
              currentPrice: d.price || d.currentPrice || staticFallback.currentPrice,
              originalPrice: d.originalPrice || staticFallback.originalPrice,
              href: d.ctaHref || d.link || d.href || `/loot-deals#${d.id}`
            }
          })
          setDeals(mapped)
        }
      }
    }).catch(console.warn)
  }, [])

  return (
    <section className="mobile-flash-deals" aria-label="Flash Deals">
      <div className="mobile-flash-deals__content">
        <div className="mobile-flash-deals__heading-row">
          <span className="mobile-flash-deals__accent" aria-hidden="true" />
          <h2 className="mobile-flash-deals__heading">Flash Deals</h2>
        </div>

        {deals.map((deal) => (
          <MobileFlashDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

export default MobileFlashDeals
