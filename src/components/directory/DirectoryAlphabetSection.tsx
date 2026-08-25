import React, { useState, useEffect, useRef } from 'react'
import { DirectoryLogoCard } from './DirectoryLogoCard'
import type { GenericDirectoryItem } from './DirectoryLogoCard'
import './DirectoryAlphabetSection.css'

interface DirectoryAlphabetSectionProps {
  letter: string
  items: GenericDirectoryItem[]
  index: number
  prefixId?: string
}

export const DirectoryAlphabetSection: React.FC<DirectoryAlphabetSectionProps> = ({
  letter,
  items,
  index,
  prefixId = 'directory',
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
      ? 'directory-alphabet-bar--active-red'
      : 'directory-alphabet-bar--active-blue'
    : ''

  return (
    <section
      ref={sectionRef}
      id={`${prefixId}-${letter}`}
      data-letter={letter}
      className="directory-alphabet-section"
    >
      {/* 45px Animated Horizontal Bar */}
      <div
        className={`directory-alphabet-bar ${activeColorClass}`}
        aria-label={`Alphabet section ${letter}`}
      >
        <span className="directory-alphabet-bar__letter">{letter}</span>
      </div>

      <div className="directory-alphabet-section__grid">
        {items.map((item) => (
          <DirectoryLogoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default DirectoryAlphabetSection
