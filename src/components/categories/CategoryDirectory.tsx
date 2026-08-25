import React from 'react'
import type { CategoryDirectoryItem } from '../../data/categoriesDirectoryData'
import { CategoryAlphabetSection } from './CategoryAlphabetSection'
import './CategoryDirectory.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface CategoryDirectoryProps {
  items: CategoryDirectoryItem[]
}

export const CategoryDirectory: React.FC<CategoryDirectoryProps> = ({ items }) => {
  // Group items by letter
  const groupedItems = ALPHABET.reduce((acc, letter) => {
    acc[letter] = items.filter((item) => item.letter.toUpperCase() === letter)
    return acc
  }, {} as Record<string, CategoryDirectoryItem[]>)

  const presentLetters = ALPHABET.filter((l) => (groupedItems[l] || []).length > 0)

  if (items.length === 0) {
    return (
      <div className="category-directory__empty">
        <p className="category-directory__empty-text">No categories found matching your filter.</p>
      </div>
    )
  }

  return (
    <div className="category-directory">
      {presentLetters.map((letter, index) => {
        const letterItems = groupedItems[letter] || []

        return (
          <CategoryAlphabetSection
            key={letter}
            letter={letter}
            items={letterItems}
            index={index}
          />
        )
      })}
    </div>
  )
}

export default CategoryDirectory
