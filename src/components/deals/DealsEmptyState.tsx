import React from 'react'
import styles from './DealsEmptyState.module.css'

export interface DealsEmptyStateProps {
  title?: string
  subtitle?: string
}

export const DealsEmptyState: React.FC<DealsEmptyStateProps> = ({
  title = 'No loot deals found',
  subtitle = 'Try adjusting your filters',
}) => {
  return (
    <div className={styles.emptyContainer} role="status" aria-live="polite">
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptySubtitle}>{subtitle}</p>
    </div>
  )
}

export default DealsEmptyState
