import React from 'react'
import { TRENDING_CITIES } from '../../data/citiesDealsDirectoryData'
import type { TrendingCity } from '../../data/citiesDealsDirectoryData'
import './TrendingCitiesRow.css'

interface TrendingCitiesRowProps {
  onCityClick?: (city: TrendingCity) => void
}

export const TrendingCitiesRow: React.FC<TrendingCitiesRowProps> = ({ onCityClick }) => {
  return (
    <section className="trending-cities-section" aria-label="Trending Cities">
      <div className="trending-cities-row">
        {TRENDING_CITIES.map((city) => (
          <a
            key={city.id}
            href={city.href}
            className="trending-city-card"
            onClick={(e) => {
              if (onCityClick) {
                e.preventDefault()
                onCityClick(city)
              }
            }}
            title={city.name}
          >
            <div className="trending-city-card__image-wrap">
              {city.image ? (
                <img
                  src={city.image}
                  alt={city.name}
                  className="trending-city-card__image"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-city-card__title">{city.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingCitiesRow
