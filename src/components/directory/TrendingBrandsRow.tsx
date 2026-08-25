import React from 'react'
import { TRENDING_BRANDS } from '../../data/brandsDirectoryData'
import type { TrendingBrand } from '../../data/brandsDirectoryData'
import './TrendingBrandsRow.css'

interface TrendingBrandsRowProps {
  onBrandClick?: (brand: TrendingBrand) => void
}

export const TrendingBrandsRow: React.FC<TrendingBrandsRowProps> = ({ onBrandClick }) => {
  return (
    <section className="trending-brands-section" aria-label="Trending Brands">
      <div className="trending-brands-row">
        {TRENDING_BRANDS.map((brand) => (
          <a
            key={brand.id}
            href={brand.href}
            className="trending-brand-card"
            onClick={(e) => {
              if (onBrandClick) {
                e.preventDefault()
                onBrandClick(brand)
              }
            }}
            title={brand.name}
          >
            <div className="trending-brand-card__logo-wrap">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="trending-brand-card__logo"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-brand-card__title">{brand.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingBrandsRow
