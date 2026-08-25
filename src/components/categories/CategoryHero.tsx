import React, { useState } from 'react'
import { CategoryHeroItem } from './CategoryHeroItem'
import type { CategoryHeroItemData } from './CategoryHeroItem'
import { useDesktopScale } from '../../hooks/useDesktopScale'

import clothingImg from '../../assets/categories/hero/category-clothing.png'
import beautyMakeupImg from '../../assets/categories/hero/category-beauty-makeup.png'
import kitchenAppliancesImg from '../../assets/categories/hero/category-kitchen-appliances.png'
import electronicsImg from '../../assets/categories/hero/category-electronics.png'
import pharmacyImg from '../../assets/categories/hero/category-pharmacy.png'
import stationeryImg from '../../assets/categories/hero/category-stationery.png'

import './CategoryHero.css'

/**
 * 1920 x 450 Categories Hero Layout
 * Circle diameter: 240px
 * Top position (Y=60px) provides balanced gap with Navbar and next section.
 * State 1: Centered overlapping cluster from X=690 to X=990
 * State 2: Horizontally expanded row from X=160 to X=1520
 */
const CATEGORY_HERO_ITEMS: CategoryHeroItemData[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'fashion',
    image: clothingImg,
    labelLines: ['Clothing'],
    initialX: 690,
    initialY: 60,
    finalX: 160,
    finalY: 60,
    zIndex: 1,
  },
  {
    id: 'beauty-makeup',
    name: 'Beauty & Makeup',
    slug: 'beauty',
    image: beautyMakeupImg,
    labelLines: ['Beauty &', 'Makeup'],
    initialX: 750,
    initialY: 60,
    finalX: 432,
    finalY: 60,
    zIndex: 2,
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    slug: 'home',
    image: kitchenAppliancesImg,
    labelLines: ['Kitchen', 'Appliances'],
    initialX: 810,
    initialY: 60,
    finalX: 704,
    finalY: 60,
    zIndex: 3,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: electronicsImg,
    labelLines: ['Electronics'],
    initialX: 870,
    initialY: 60,
    finalX: 976,
    finalY: 60,
    zIndex: 4,
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    slug: 'grocery',
    image: pharmacyImg,
    labelLines: ['Pharmacy'],
    initialX: 930,
    initialY: 60,
    finalX: 1248,
    finalY: 60,
    zIndex: 5,
  },
  {
    id: 'stationary',
    name: 'Stationary',
    slug: 'b2b',
    image: stationeryImg,
    labelLines: ['Stationary'],
    initialX: 990,
    initialY: 60,
    finalX: 1520,
    finalY: 60,
    zIndex: 6,
  },
]

export const CategoryHero: React.FC = () => {
  const [hasExpanded, setHasExpanded] = useState(false)
  const scale = useDesktopScale()

  const handleFirstHover = () => {
    if (!hasExpanded) {
      setHasExpanded(true)
    }
  }

  return (
    <section
      className="category-hero-section"
      aria-label="Categories Hero"
      style={{
        '--categories-scale': scale,
        height: `${450 * scale}px`,
      } as React.CSSProperties}
    >
      <div
        className="category-hero-canvas"
        onMouseEnter={handleFirstHover}
        aria-label="Categories interactive hero"
      >
        {CATEGORY_HERO_ITEMS.map((item, index) => (
          <CategoryHeroItem
            key={item.id}
            item={item}
            isExpanded={hasExpanded}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
