import React from 'react'
import { TRENDING_CATEGORIES } from '../../data/subcategoriesData'
import styles from './MobileTrendingCategoriesRow.module.css'

export const MobileTrendingCategoriesRow: React.FC = () => {
  return (
    <section className={styles.trendingSection} aria-label="Trending categories">
      <div className={styles.trendingGrid}>
        {TRENDING_CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={styles.trendingCard}
            aria-label={`Browse ${cat.name}`}
          >
            <div className={styles.logoArea}>
              <img
                src={cat.image}
                alt={cat.name}
                className={styles.logoImg}
                loading="lazy"
              />
            </div>
            <span className={styles.cardLabel}>{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default MobileTrendingCategoriesRow
