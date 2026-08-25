import React from 'react'
import { POPULAR_SIDEBAR_BRANDS } from '../../data/categories'
import './PopularBrands.css'

export const PopularBrands: React.FC = () => {
  return (
    <div className="popular-brands-sidebar">
      <h3 className="popular-brands-sidebar__title">Popular Brands</h3>
      <div className="popular-brands-sidebar__grid">
        {POPULAR_SIDEBAR_BRANDS.map((brand) => (
          <a
            key={brand.slug}
            href={`/stores#${brand.slug}`}
            className="popular-brands-sidebar__item"
            title={brand.name}
          >
            <img src={brand.logo} alt={brand.name} className="popular-brands-sidebar__logo" />
          </a>
        ))}
      </div>
    </div>
  )
}
