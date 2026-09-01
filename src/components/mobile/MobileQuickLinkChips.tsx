import React from 'react'
import styles from './MobileQuickLinkChips.module.css'

interface QuickLinkItem {
  id: string
  label: string
  href: string
  variant: 'lavender' | 'peach'
}

// Exactly 7 items matching media_1788241922690.png
const ROW_1_LINKS: QuickLinkItem[] = [
  { id: 'products', label: 'Products>>', href: '/categories', variant: 'lavender' },
  { id: 'stores', label: 'Stores>>', href: '/stores', variant: 'peach' },
  { id: 'brands', label: 'Brands>>', href: '/categories/brands', variant: 'lavender' },
  { id: 'festivals', label: 'Festivals>>', href: '/categories/festivals', variant: 'peach' },
]

const ROW_2_LINKS: QuickLinkItem[] = [
  { id: 'cities', label: 'Cities>>', href: '/categories/cities-deals', variant: 'lavender' },
  { id: 'travel', label: 'Travel>>', href: '/categories/travelling', variant: 'peach' },
  { id: 'trending', label: 'Trending>>', href: '/#trending-deals', variant: 'lavender' },
]

export const MobileQuickLinkChips: React.FC = () => {
  return (
    <nav className={styles.chipsSection} aria-label="Quick Navigation Links">
      {/* Row 1: 4 Buttons fitted across width */}
      <div className={styles.row1} role="list">
        {ROW_1_LINKS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`${styles.chip} ${
              item.variant === 'lavender' ? styles.chipLavender : styles.chipPeach
            }`}
            role="listitem"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Row 2: 3 Buttons centered */}
      <div className={styles.row2} role="list">
        {ROW_2_LINKS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`${styles.chip} ${
              item.variant === 'lavender' ? styles.chipLavender : styles.chipPeach
            }`}
            role="listitem"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default MobileQuickLinkChips
