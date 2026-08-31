import React from 'react'
import type { DirectoryEntityType } from '../../data/unifiedDirectory'
import categoriesImg from '../../assets/categories/sidebar/category-categories.png'
import storesImg from '../../assets/categories/sidebar/category-stores.png'
import brandsImg from '../../assets/categories/sidebar/category-brands.png'
import festivalsImg from '../../assets/categories/sidebar/category-festivals.png'
import travellingImg from '../../assets/categories/sidebar/category-travelling.png'
import banksImg from '../../assets/categories/sidebar/category-banks.png'
import citiesDealsImg from '../../assets/categories/sidebar/category-cities-deals.png'
import styles from './DirectoryTypeRail.module.css'

interface RailOption {
  type: DirectoryEntityType
  name: string
  icon: string
  href: string
}

const RAIL_OPTIONS: RailOption[] = [
  { type: 'categories', name: 'Categories', icon: categoriesImg, href: '/categories/subcategories' },
  { type: 'stores', name: 'Stores', icon: storesImg, href: '/categories/stores' },
  { type: 'brands', name: 'Brands', icon: brandsImg, href: '/categories/brands' },
  { type: 'festivals', name: 'Festivals', icon: festivalsImg, href: '/categories/festivals' },
  { type: 'travelling', name: 'Travelling', icon: travellingImg, href: '/categories/travelling' },
  { type: 'banks', name: 'Banks', icon: banksImg, href: '/categories/banks' },
  { type: 'cities-deals', name: 'Cities Deals', icon: citiesDealsImg, href: '/categories/cities-deals' },
]

interface DirectoryTypeRailProps {
  selectedType?: DirectoryEntityType | 'all'
  onSelectType?: (type: DirectoryEntityType | 'all') => void
  mode?: 'filter' | 'nav'
  activeNavType?: DirectoryEntityType | null
}

export const DirectoryTypeRail: React.FC<DirectoryTypeRailProps> = ({
  selectedType = 'all',
  onSelectType,
  mode = 'filter',
  activeNavType = null,
}) => {
  return (
    <nav className={styles.railContainer} aria-label="Directory navigation rail">
      {RAIL_OPTIONS.map((item, index) => {
        const isActive = mode === 'nav' ? activeNavType === item.type : selectedType === item.type
        const isNotLast = index < RAIL_OPTIONS.length - 1

        if (mode === 'nav') {
          return (
            <React.Fragment key={item.type}>
              <a
                href={item.href}
                className={`${styles.railItem} ${isActive ? styles.railItemActive : ''}`}
                aria-label={item.name}
                {...(isActive ? { 'aria-current': 'page' } : {})}
              >
                <div className={styles.railIconWrapper}>
                  <img
                    src={item.icon}
                    alt=""
                    className={styles.railIcon}
                    aria-hidden="true"
                    loading="lazy"
                  />
                </div>
                <span className={styles.railLabel}>{item.name}</span>
              </a>

              {isNotLast && <div className={styles.railDivider} aria-hidden="true" />}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={item.type}>
            <button
              type="button"
              className={`${styles.railItem} ${isActive ? styles.railItemActive : ''}`}
              onClick={() => onSelectType?.(isActive ? 'all' : item.type)}
              aria-label={`Filter by ${item.name}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className={styles.railIconWrapper}>
                <img
                  src={item.icon}
                  alt=""
                  className={styles.railIcon}
                  aria-hidden="true"
                  loading="lazy"
                />
              </div>
              <span className={styles.railLabel}>{item.name}</span>
            </button>

            {isNotLast && <div className={styles.railDivider} aria-hidden="true" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default DirectoryTypeRail
