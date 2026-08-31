import React from 'react'
import styles from './PeachWaveDivider.module.css'

interface PeachWaveDividerProps {
  hasTail?: boolean
}

export const PeachWaveDivider: React.FC<PeachWaveDividerProps> = ({ hasTail = false }) => {
  if (hasTail) {
    return (
      <div
        className={`${styles.dividerContainer} ${styles.dividerContainerTailed}`}
        aria-hidden="true"
      >
        <svg
          className={styles.svgWaveTailed}
          viewBox="0 0 390 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main 315px Peach Wavy Scallop Ribbon starting at x=75 */}
          <path
            d="M 88 4 
               C 135 12, 190 2, 240 10 
               C 290 18, 345 6, 377 4 
               C 384 4, 390 8, 390 14 
               C 390 20, 384 26, 377 26 
               C 335 24, 285 30, 235 22 
               C 185 14, 130 26, 88 26 
               C 81 26, 75 21, 75 15 
               C 75 9, 81 4, 88 4 Z"
            fill="var(--color-peach, #FDE0D1)"
          />

          {/* Left extending tail reaching x≈25 */}
          <path
            d="M 75 15 
               C 55 16, 40 22, 28 27 
               C 27 27.5, 26 28, 25 28 
               C 24 28, 25 26, 27 25 
               C 38 20, 55 14, 75 15 Z"
            fill="var(--color-peach, #FDE0D1)"
          />

          {/* Orange Accent Dot at x=25, y=28 */}
          <circle cx="26" cy="27.5" r="2.5" fill="#F0803F" />
        </svg>
      </div>
    )
  }

  return (
    <div className={styles.dividerContainer} aria-hidden="true">
      <svg
        className={styles.svgWave}
        viewBox="0 0 315 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft wave ribbon with S-curves and rounded corners */}
        <path
          d="M 13 3 
             C 65 11, 120 1, 170 9 
             C 220 17, 275 5, 302 3 
             C 309 3, 315 7, 315 13.5 
             C 315 19.5, 309 24.5, 302 24.5 
             C 255 22.5, 205 28.5, 155 20.5 
             C 105 12.5, 50 24.5, 13 24.5 
             C 6 24.5, 0 19.5, 0 13.5 
             C 0 7.5, 6 3, 13 3 Z"
          fill="var(--color-peach, #FDE0D1)"
        />
      </svg>
    </div>
  )
}

export default PeachWaveDivider
