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
  bgColor?: string
  imgScale?: number
  objectFit?: 'contain' | 'cover'
}

const POPULAR_STORES: PopularStoreItem[] = [
  {
    name: 'Amazon',
    logo: amazonLogo,
    slug: 'amazon',
    bgColor: '#FFFFFF',
    objectFit: 'cover',
  },
  {
    name: 'AJIO',
    logo: ajioLogo,
    slug: 'ajio',
    bgColor: '#273B4A',
    imgScale: 1.08,
    objectFit: 'cover',
  },
  {
    name: 'Flipkart',
    logo: flipkartLogo,
    slug: 'flipkart',
    bgColor: '#047BD5',
    objectFit: 'cover',
  },
  {
    name: 'Myntra',
    logo: myntraLogo,
    slug: 'myntra',
    bgColor: '#FFFFFF',
    objectFit: 'cover',
  },
  {
    name: 'BigBasket',
    logo: bigbasketLogo,
    slug: 'bigbasket',
    bgColor: '#A6CE39', // Exact official BigBasket Guacamole Green
    imgScale: 0.75,
    objectFit: 'contain',
  },
  {
    name: 'Swiggy',
    logo: swiggyLogo,
    slug: 'swiggy',
    bgColor: '#FFFFFF',
    objectFit: 'cover',
  },
  {
    name: 'Meesho',
    logo: meeshoLogo,
    slug: 'meesho',
    bgColor: '#580A46', // Exact official Meesho Jamuni Purple
    imgScale: 0.72,
    objectFit: 'contain',
  },
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
            style={{ backgroundColor: store.bgColor || '#FFFFFF' }}
            title={store.name}
          >
            <img
              src={store.logo}
              alt={store.name}
              className="popular-stores-sidebar__logo"
              style={{
                objectFit: store.objectFit || 'cover',
                transform: store.imgScale ? `scale(${store.imgScale})` : undefined,
              }}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default PopularStores
