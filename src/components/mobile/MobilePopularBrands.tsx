import React from 'react'
import {
  MOBILE_POPULAR_BRANDS_ROW_1,
  MOBILE_POPULAR_BRANDS_ROW_2,
  type MobileBrandItem,
} from '../../data/mobilePopularBrands'
import './MobilePopularBrands.css'

interface MobileBrandCardProps {
  brand: MobileBrandItem
}

const MobileBrandCard: React.FC<MobileBrandCardProps> = ({ brand }) => {
  const logoStyle: React.CSSProperties = brand.mobileLogoScale
    ? { transform: `scale(${brand.mobileLogoScale})` }
    : {}

  const cardStyle: React.CSSProperties = brand.cardBgColor
    ? { backgroundColor: brand.cardBgColor }
    : {}

  return (
    <a
      href={`/brands/${brand.slug}`}
      className="mobile-brand-card"
      aria-label={`View ${brand.name} offers`}
      style={cardStyle}
    >
      <img
        src={brand.logoSrc}
        alt={`${brand.name} logo`}
        className="mobile-brand-card__logo"
        style={logoStyle}
        loading="lazy"
      />
      <div className="mobile-brand-card__discount" aria-hidden="true">
        <span className="mobile-brand-card__discount-percentage">
          {brand.discount}%
        </span>
        <span className="mobile-brand-card__discount-off">off</span>
      </div>
    </a>
  )
}

export const MobilePopularBrands: React.FC = () => {
  return (
    <section className="mobile-popular-brands" aria-label="Most Popular Brands">
      <div className="mobile-popular-heading">
        <span className="mobile-popular-heading__accent" aria-hidden="true" />
        <h2>Most Popular Brands</h2>
      </div>

      <div className="mobile-brands__row mobile-brands__row--1">
        <div className="mobile-brands__row-scroller">
          <div className="mobile-brands__track">
            {MOBILE_POPULAR_BRANDS_ROW_1.map((brand) => (
              <MobileBrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>

      <div className="mobile-brands__row mobile-brands__row--2">
        <div className="mobile-brands__row-scroller">
          <div className="mobile-brands__track">
            {MOBILE_POPULAR_BRANDS_ROW_2.map((brand) => (
              <MobileBrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MobilePopularBrands
