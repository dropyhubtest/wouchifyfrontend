import React from 'react'
import './CategoryHeroItem.css'

export interface CategoryHeroItemData {
  id: string
  name: string
  slug: string
  image: string
  labelLines: string[]
  initialX: number
  initialY: number
  finalX: number
  finalY: number
  zIndex: number
}

interface CategoryHeroItemProps {
  item: CategoryHeroItemData
  isExpanded: boolean
  index: number
}

export const CategoryHeroItem: React.FC<CategoryHeroItemProps> = ({
  item,
  isExpanded,
  index,
}) => {
  const offsetX = item.initialX - item.finalX
  const offsetY = item.initialY - item.finalY
  const delayMs = Math.round(Math.abs(2.5 - index) * 25)

  return (
    <a
      href={`/categories/${item.slug}`}
      className="category-hero-item"
      style={{
        left: `${item.finalX}px`,
        top: `${item.finalY}px`,
        zIndex: isExpanded ? 5 : item.zIndex,
      }}
      title={item.name}
    >
      <div
        className="category-hero-item__circle-wrapper"
        style={{
          transform: isExpanded
            ? 'translate(0px, 0px)'
            : `translate(${offsetX}px, ${offsetY}px)`,
          transitionDelay: isExpanded ? `${delayMs}ms` : '0ms',
        }}
      >
        <div className="category-hero-item__circle">
          <img
            src={item.image}
            alt={item.name}
            className="category-hero-item__img"
            loading="eager"
            width="240"
            height="240"
          />
        </div>
      </div>

      <div
        className={`category-hero-item__label ${
          isExpanded ? 'category-hero-item__label--visible' : ''
        }`}
        style={{
          transitionDelay: isExpanded ? `${delayMs + 220}ms` : '0ms',
        }}
      >
        {item.labelLines.map((line, idx) => (
          <span key={idx} className="category-hero-item__label-line">
            {line}
          </span>
        ))}
      </div>
    </a>
  )
}
