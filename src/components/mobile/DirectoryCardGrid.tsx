import React from 'react'
import type { LetterGroup } from '../../data/unifiedDirectory'
import { DirectoryCard } from './DirectoryCard'
import styles from './DirectoryCardGrid.module.css'

interface DirectoryCardGridProps {
  groupedItems: LetterGroup[]
  onResetFilters?: () => void
}

export const DirectoryCardGrid: React.FC<DirectoryCardGridProps> = ({
  groupedItems,
  onResetFilters,
}) => {
  const visibleGroups = groupedItems.filter((g) => g.items.length > 0)
  const totalItemsCount = visibleGroups.reduce((acc, g) => acc + g.items.length, 0)

  if (totalItemsCount === 0) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No matching directory items found.</p>
          {onResetFilters && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.gridContainer}>
      {visibleGroups.map((group) => {
        return (
          <section
            key={group.letter}
            id={`letter-group-${group.letter}`}
            className={styles.letterSection}
            aria-label={`Letter ${group.letter}`}
          >
            {/* Peach letter header pill matching Figma (media_1788156938968.png) */}
            <div className={styles.letterHeaderPill}>
              <span className={styles.letterHeaderText}>{group.letter}</span>
            </div>

            <div className={styles.cardGrid}>
              {group.items.map((item) => (
                <DirectoryCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default DirectoryCardGrid
