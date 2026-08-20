import React from 'react'
import { MOBILE_CATEGORIES, type MobileCategoryItem } from '../../data/mobileCategories'
import './MobileCategories.css'

interface MobileCategoryCardProps {
  category: MobileCategoryItem
}

const MobileCategoryCard: React.FC<MobileCategoryCardProps> = ({ category }) => {
  return (
    <a
      href={category.href}
      className="mobile-category-item"
      aria-label={`Browse ${category.name}`}
    >
      <div className="mobile-category-item__frame">
        <img
          src={category.image}
          alt={category.alt}
          className="mobile-category-item__image"
          loading="lazy"
        />
      </div>
      <span className="mobile-category-item__label">{category.name}</span>
    </a>
  )
}

export const MobileCategories: React.FC = () => {
  return (
    <section className="mobile-categories" aria-label="Categories">
      <div className="mobile-categories-heading">
        <span className="mobile-categories-heading__accent" aria-hidden="true" />
        <h2>Categories</h2>
      </div>

      <div className="mobile-categories__row">
        <div className="mobile-categories__track">
          {MOBILE_CATEGORIES.map((category) => (
            <MobileCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MobileCategories
