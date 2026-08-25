import React from 'react'
import { TRENDING_CATEGORIES } from '../../data/subcategoriesData'
import type { TrendingCategoryItem } from '../../data/subcategoriesData'
import './TrendingCategoriesRow.css'

interface TrendingCategoriesRowProps {
  categories?: TrendingCategoryItem[]
}

export const TrendingCategoriesRow: React.FC<TrendingCategoriesRowProps> = ({
  categories = TRENDING_CATEGORIES,
}) => {
  return (
    <section
      className="trending-categories-section"
      aria-label="Trending Categories"
    >
      <div className="trending-categories-row">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={cat.href}
            className="trending-category-card"
            title={cat.name}
          >
            <div className="trending-category-card__image-wrap">
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="trending-category-card__image"
                  loading="lazy"
                />
              )}
            </div>
            <span className="trending-category-card__title">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingCategoriesRow
