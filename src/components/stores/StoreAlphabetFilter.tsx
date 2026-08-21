import React from 'react'
import './StoreAlphabetFilter.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface StoreAlphabetFilterProps {
  activeLetter: string | null
  onSelect: (letter: string | null) => void
}

export const StoreAlphabetFilter: React.FC<StoreAlphabetFilterProps> = ({
  activeLetter,
  onSelect,
}) => {
  const handleClick = (letter: string) => {
    // Toggle: clicking the same letter deselects it
    onSelect(activeLetter === letter ? null : letter)
  }

  return (
    <div className="store-alphabet" role="toolbar" aria-label="Filter stores by letter">
      {ALPHABET.map((letter) => {
        const isSelected = activeLetter === letter

        return (
          <button
            key={letter}
            type="button"
            className={`store-alphabet__btn ${isSelected ? 'store-alphabet__btn--active' : ''}`}
            onClick={() => handleClick(letter)}
            aria-pressed={isSelected}
            aria-label={`Filter by letter ${letter}`}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}

export default StoreAlphabetFilter
