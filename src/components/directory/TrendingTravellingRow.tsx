import React from 'react'
import { TRENDING_TRAVELLING } from '../../data/travellingDirectoryData'
import type { TrendingTravelCategory } from '../../data/travellingDirectoryData'
import './TrendingTravellingRow.css'

interface TrendingTravellingRowProps {
  onCategoryClick?: (cat: TrendingTravelCategory) => void
}

export const TrendingTravellingRow: React.FC<TrendingTravellingRowProps> = ({
  onCategoryClick,
}) => {
  return (
    <section className="trending-travel-section" aria-label="Trending Travelling Categories">
      <div className="trending-travel-row">
        {TRENDING_TRAVELLING.map((cat) => (
          <a
            key={cat.id}
            href={cat.href}
            className="trending-travel-card"
            onClick={(e) => {
              if (onCategoryClick) {
                e.preventDefault()
                onCategoryClick(cat)
              }
            }}
            title={cat.name}
          >
            <div className="trending-travel-card__image-wrap">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="trending-travel-card__image"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-travel-card__title">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingTravellingRow
