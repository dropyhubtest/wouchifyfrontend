import React from 'react'
import amazonLogo from '../../assets/categories/popular-stores/Amazon.png'
import ajioLogo from '../../assets/categories/popular-stores/ajio.png'
import flipkartLogo from '../../assets/categories/popular-stores/flipkart.png'
import myntraLogo from '../../assets/categories/popular-stores/myntra.png'
import bigbasketLogo from '../../assets/categories/popular-stores/bigbasket.png'
import swiggyLogo from '../../assets/categories/popular-stores/Swiggy.png'
import meeshoLogo from '../../assets/categories/popular-stores/meesho.png'
import './PopularStores.css'

interface PopularStoreItem {
  name: string
  logo: string
  slug: string
}

const POPULAR_STORES: PopularStoreItem[] = [
  { name: 'Amazon', logo: amazonLogo, slug: 'amazon' },
  { name: 'AJIO', logo: ajioLogo, slug: 'ajio' },
  { name: 'Flipkart', logo: flipkartLogo, slug: 'flipkart' },
  { name: 'Myntra', logo: myntraLogo, slug: 'myntra' },
  { name: 'BigBasket', logo: bigbasketLogo, slug: 'bigbasket' },
  { name: 'Swiggy', logo: swiggyLogo, slug: 'swiggy' },
  { name: 'Meesho', logo: meeshoLogo, slug: 'meesho' },
]

export const PopularStores: React.FC = () => {
  return (
    <div className="popular-stores-sidebar" aria-label="Popular Stores">
      <h3 className="popular-stores-sidebar__title">Popular Stores</h3>
      <div className="popular-stores-sidebar__grid">
        {POPULAR_STORES.map((store) => (
          <a
            key={store.slug}
            href={`/stores#${store.slug}`}
            className="popular-stores-sidebar__circle"
            title={store.name}
          >
            <img
              src={store.logo}
              alt={store.name}
              className="popular-stores-sidebar__logo"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default PopularStores
