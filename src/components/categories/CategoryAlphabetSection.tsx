import React, { useState, useEffect, useRef } from 'react'
import type { CategoryDirectoryItem } from '../../data/categoriesDirectoryData'
import { CategoryDirectoryCard } from './CategoryDirectoryCard'
import './CategoryAlphabetSection.css'

interface CategoryAlphabetSectionProps {
  letter: string
  items: CategoryDirectoryItem[]
  index: number
}

export const CategoryAlphabetSection: React.FC<CategoryAlphabetSectionProps> = ({
  letter,
  items,
  index,
}) => {
  const [isActive, setIsActive] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '-5% 0px -10% 0px',
        threshold: 0.05,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (items.length === 0) return null

  // Even index = Red (#E31E25), Odd index = Navy/Blue (#2F368C)
  const isEven = index % 2 === 0
  const activeColorClass = isActive
    ? isEven
      ? 'category-alphabet-bar--active-red'
      : 'category-alphabet-bar--active-blue'
    : ''

  return (
    <section
      ref={sectionRef}
      id={`directory-${letter}`}
      data-letter={letter}
      className="category-alphabet-section"
    >
      {/* 45px Rounded Horizontal Bar matching Rectangle 583 */}
      <div
        className={`category-alphabet-bar ${activeColorClass}`}
        aria-label={`Alphabet section ${letter}`}
      >
        <span className="category-alphabet-bar__letter">{letter}</span>
      </div>

      <div className="category-alphabet-section__grid">
        {items.map((item) => (
          <CategoryDirectoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default CategoryAlphabetSection
