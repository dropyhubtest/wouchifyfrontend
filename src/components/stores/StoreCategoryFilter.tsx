import React, { useState, useRef, useEffect, useCallback } from 'react'
import './StoreCategoryFilter.css'

interface StoreCategoryFilterProps {
  categories: readonly string[]
  selected: string
  onSelect: (category: string) => void
}

export const StoreCategoryFilter: React.FC<StoreCategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  const handleSelect = (cat: string) => {
    onSelect(cat)
    setIsOpen(false)
  }

  // Filter out 'All Stores' from the inner list if we display it at the top or toggle back
  const menuCategories = categories.filter((c) => c !== 'All Stores')

  return (
    <div
      className={`store-category-filter ${isOpen ? 'store-category-filter--open' : ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="store-category-filter__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Filter by category: ${selected}`}
      >
        <span className="store-category-filter__label">{selected}</span>
        {/* White circular container for the bold black SVG chevron */}
        <div
          className={`store-category-filter__arrow-circle ${isOpen ? 'store-category-filter__arrow-circle--open' : ''}`}
          aria-hidden="true"
        >
          <svg
            className="store-category-filter__chevron"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 9L12 16L19 9"
              stroke="#000000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <ul className="store-category-filter__menu" role="listbox" aria-label="Store categories">
          {/* If a category is selected, allow resetting to All Stores */}
          {selected !== 'All Stores' && (
            <li role="option" aria-selected={false}>
              <button
                type="button"
                className="store-category-filter__option"
                onClick={() => handleSelect('All Stores')}
              >
                All Stores
              </button>
            </li>
          )}
          {menuCategories.map((cat) => (
            <li key={cat} role="option" aria-selected={selected === cat}>
              <button
                type="button"
                className={`store-category-filter__option ${selected === cat ? 'store-category-filter__option--active' : ''}`}
                onClick={() => handleSelect(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StoreCategoryFilter
