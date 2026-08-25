import React from 'react'
import { TRENDING_FESTIVALS } from '../../data/festivalsDirectoryData'
import type { TrendingFestival } from '../../data/festivalsDirectoryData'
import './TrendingFestivalsRow.css'

interface TrendingFestivalsRowProps {
  onFestivalClick?: (festival: TrendingFestival) => void
}

export const TrendingFestivalsRow: React.FC<TrendingFestivalsRowProps> = ({
  onFestivalClick,
}) => {
  return (
    <section className="trending-festivals-section" aria-label="Trending Festivals">
      <div className="trending-festivals-row">
        {TRENDING_FESTIVALS.map((festival) => (
          <a
            key={festival.id}
            href={festival.href}
            className="trending-festival-card"
            onClick={(e) => {
              if (onFestivalClick) {
                e.preventDefault()
                onFestivalClick(festival)
              }
            }}
            title={festival.name}
          >
            <div className="trending-festival-card__image-wrap">
              {festival.image ? (
                <img
                  src={festival.image}
                  alt={festival.name}
                  className="trending-festival-card__image"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-festival-card__title">{festival.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingFestivalsRow
