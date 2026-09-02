import React from 'react'
import styles from './LootCountdown.module.css'

export interface LootCountdownProps {
  hours?: string | number
  minutes?: string | number
}

export const LootCountdown: React.FC<LootCountdownProps> = ({
  hours = '10',
  minutes = '09',
}) => {
  return (
    <div className={styles.countdownContainer} aria-label="Loot Deals Countdown Timer">
      <div className={styles.digitBox}>
        <span className={styles.digitNumber}>{hours}</span>
        <span className={styles.digitLabel}>HRS</span>
      </div>

      <span className={styles.colon} aria-hidden="true">:</span>

      <div className={styles.digitBox}>
        <span className={styles.digitNumber}>{minutes}</span>
        <span className={styles.digitLabel}>MIN</span>
      </div>
    </div>
  )
}

export default LootCountdown
