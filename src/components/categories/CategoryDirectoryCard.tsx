import React from 'react'
import type { CategoryDirectoryItem } from '../../data/categoriesDirectoryData'
import './CategoryDirectoryCard.css'

interface CategoryDirectoryCardProps {
  item: CategoryDirectoryItem
}

export const CategoryDirectoryCard: React.FC<CategoryDirectoryCardProps> = ({ item }) => {
  const isAmazon = item.slug.toLowerCase() === 'amazon' || item.name.toLowerCase() === 'amazon'
  const targetHref = isAmazon ? '/brands/amazon' : `/categories/${item.slug}`

  return (
    <a
      href={targetHref}
      className="category-dir-card"
      title={item.name}
    >
      <div className="category-dir-card__image-area">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="category-dir-card__image"
            loading="lazy"
          />
        ) : null}
      </div>

      <h4 className="category-dir-card__title">{item.name}</h4>
    </a>
  )
}

export default CategoryDirectoryCard
