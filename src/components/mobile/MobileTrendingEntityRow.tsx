import React from 'react'
import styles from './MobileTrendingCategoriesRow.module.css'

export interface TrendingEntityItem {
  id: string
  name: string
  image: string
  href: string
}

interface MobileTrendingEntityRowProps {
  items: TrendingEntityItem[]
  ariaLabel?: string
}

export const MobileTrendingEntityRow: React.FC<MobileTrendingEntityRowProps> = ({
  items,
  ariaLabel = 'Trending items',
}) => {
  // Take up to 6 items to fit cleanly across the viewport
  const displayItems = items.slice(0, 6)

  return (
    <section className={styles.trendingSection} aria-label={ariaLabel}>
      <div className={styles.trendingGrid}>
        {displayItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={styles.trendingCard}
            aria-label={`Browse ${item.name}`}
          >
            <div className={styles.logoArea}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.logoImg}
                loading="lazy"
              />
            </div>
            <span className={styles.cardLabel}>{item.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default MobileTrendingEntityRow
