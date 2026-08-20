import React from 'react'
import {
  MOBILE_FLASH_DEALS,
  type MobileFlashDealItem,
} from '../../data/mobileFlashDeals'
import './MobileFlashDeals.css'

interface MobileFlashDealCardProps {
  deal: MobileFlashDealItem
}

const MobileFlashDealCard: React.FC<MobileFlashDealCardProps> = ({ deal }) => {
  return (
    <a
      href={deal.href}
      className="mobile-flash-banner-link"
      aria-label={`View ${deal.name}`}
    >
      <img
        src={deal.image}
        alt={deal.alt}
        className="mobile-flash-banner-image"
        loading="lazy"
      />
    </a>
  )
}

export const MobileFlashDeals: React.FC = () => {
  return (
    <section className="mobile-flash-deals" aria-label="Flash Deals">
      <div className="mobile-flash-deals__content">
        <span className="mobile-flash-deals__accent" aria-hidden="true" />
        <h2 className="mobile-flash-deals__heading">Flash Deals</h2>

        {MOBILE_FLASH_DEALS.map((deal) => (
          <MobileFlashDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

export default MobileFlashDeals
