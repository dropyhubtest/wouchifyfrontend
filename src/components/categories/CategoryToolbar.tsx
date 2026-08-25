import React from 'react'
import { StoreSearch } from '../stores/StoreSearch'
import { StoreCategoryFilter } from '../stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../../data/storesHero'
import './CategoryToolbar.css'

interface CategoryToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategorySelect: (category: string) => void
  activeLetter: string | null
  onLetterClick: (letter: string | null) => void
}

/**
 * Categories Page Discovery Toolbar
 * Matches Figma Node 3745:964 & 3745:1133 - 3745:1145
 * 1920px Canvas Layout with:
 * - Left blue semicircle (node 3745:1135, x: -37px, 75x75)
 * - Heading "Browse All" (node 3745:1133, x: 80px)
 * - Lavender Search Pill (node 3745:1136, x: 373px, w: 1233px, h: 78px)
 * - All Stores Dropdown (node 3745:1094, x: 1659px, w: 210px, h: 64px)
 * - Circular 57x57px A-Z Alphabet Controls (node 3745:1145)
 * - Horizontal Bottom Divider
 */
export const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  activeLetter,
  onLetterClick,
}) => {
  return (
    <div className="category-toolbar-canvas" role="region" aria-label="Category discovery toolbar">
      {/* Top Controls Row */}
      <div className="category-toolbar__controls">
        {/* Heading Group with Blue Semicircle Accent */}
        <div className="category-toolbar__heading-group">
          <div className="category-toolbar__heading-accent" aria-hidden="true" />
          <h2 className="category-toolbar__heading">Browse All</h2>
        </div>

        {/* Large Lavender Search Pill (x: 373px, w: 1233px, h: 78px) */}
        <div className="category-toolbar__search-wrapper">
          <StoreSearch value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* "All Stores" Dropdown (x: 1659px, w: 210px, h: 64px) */}
        <div className="category-toolbar__dropdown-wrapper">
          <StoreCategoryFilter
            categories={STORE_CATEGORIES}
            selected={selectedCategory || 'All Stores'}
            onSelect={onCategorySelect}
          />
        </div>
      </div>

      {/* Circular A-Z Alphabet Filter Row */}
      <div className="category-toolbar__alphabet-row">
        <StoreAlphabetFilter activeLetter={activeLetter} onSelect={onLetterClick} />
      </div>
    </div>
  )
}

export default CategoryToolbar
