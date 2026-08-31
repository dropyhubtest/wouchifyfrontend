import React, { useRef } from 'react'
import styles from './MobileAlphabetBar.module.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface MobileAlphabetBarProps {
  selectedLetter?: string
  onSelectLetter?: (letter: string) => void
}

export const MobileAlphabetBar: React.FC<MobileAlphabetBarProps> = ({
  selectedLetter,
  onSelectLetter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleLetterClick = (letter: string) => {
    onSelectLetter?.(selectedLetter === letter ? '' : letter)

    // Scroll to the letter section on page
    const targetElement = document.getElementById(`letter-group-${letter}`)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={styles.alphabetWrapper}>
      <div
        ref={scrollRef}
        className={styles.alphabetScroll}
        aria-label="Alphabet navigation bar"
      >
        <div className={styles.scallopTrack}>
          {ALPHABET.map((letter) => {
            const isSelected = selectedLetter === letter

            return (
              <button
                key={letter}
                type="button"
                className={`${styles.scallopItem} ${isSelected ? styles.scallopItemActive : ''}`}
                onClick={() => handleLetterClick(letter)}
                aria-label={`Jump to letter ${letter}`}
                aria-pressed={isSelected}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileAlphabetBar
