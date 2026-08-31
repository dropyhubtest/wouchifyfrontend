import React from 'react'
import type { UnifiedDirectoryItem } from '../../data/unifiedDirectory'
import styles from './DirectoryCard.module.css'

interface DirectoryCardProps {
  item: UnifiedDirectoryItem
}

export const DirectoryCard: React.FC<DirectoryCardProps> = React.memo(({ item }) => {
  return (
    <a
      href={item.href}
      className={styles.card}
      title={item.name}
      aria-label={item.name}
    >
      <div className={styles.logoArea}>
        <img
          src={item.logo}
          alt={item.name}
          className={styles.logoImg}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className={styles.label}>{item.name}</span>
    </a>
  )
})

DirectoryCard.displayName = 'DirectoryCard'

export default DirectoryCard
