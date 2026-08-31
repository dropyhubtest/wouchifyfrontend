import React from 'react'
import clothingImg from '../../assets/categories/hero/category-clothing.png'
import beautyMakeupImg from '../../assets/categories/hero/category-beauty-makeup.png'
import kitchenAppliancesImg from '../../assets/categories/hero/category-kitchen-appliances.png'
import electronicsImg from '../../assets/categories/hero/category-electronics.png'
import pharmacyImg from '../../assets/categories/hero/category-pharmacy.png'
import stationeryImg from '../../assets/categories/hero/category-stationery.png'
import styles from './MobileCategoriesSlider.module.css'

interface SliderCategory {
  id: string
  name: string
  image: string
  href: string
}

const CATEGORY_HERO_ITEMS: SliderCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    image: clothingImg,
    href: '/categories/clothing',
  },
  {
    id: 'beauty-makeup',
    name: 'Beauty & Makeup',
    image: beautyMakeupImg,
    href: '/categories/beauty-makeup',
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    image: kitchenAppliancesImg,
    href: '/categories/kitchen-appliances',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    image: electronicsImg,
    href: '/categories/electronics',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    image: pharmacyImg,
    href: '/categories/pharmacy',
  },
  {
    id: 'stationery',
    name: 'Stationery',
    image: stationeryImg,
    href: '/categories/stationery',
  },
]

export const MobileCategoriesSlider: React.FC = () => {
  return (
    <section className={styles.sliderSection} aria-label="Hero Categories">
      <div className={styles.categoryRow}>
        {CATEGORY_HERO_ITEMS.map((cat) => (
          <a
            key={cat.id}
            href={cat.href}
            className={styles.sliderItem}
            aria-label={`Browse ${cat.name}`}
          >
            <div className={styles.circleFrame}>
              <img
                src={cat.image}
                alt={cat.name}
                className={styles.circleImg}
                loading="lazy"
              />
            </div>
            <span className={styles.itemLabel}>{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default MobileCategoriesSlider
