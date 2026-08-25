import React from 'react'
import { PopularStores } from './PopularStores'
import categoriesImg from '../../assets/categories/sidebar/category-categories.png'
import storesImg from '../../assets/categories/sidebar/category-stores.png'
import brandsImg from '../../assets/categories/sidebar/category-brands.png'
import banksImg from '../../assets/categories/sidebar/category-banks.png'
import festivalsImg from '../../assets/categories/sidebar/category-festivals.png'
import travellingImg from '../../assets/categories/sidebar/category-travelling.png'
import citiesDealsImg from '../../assets/categories/sidebar/category-cities-deals.png'
import './CategorySidebar.css'

interface CategorySidebarProps {
  selectedCategorySlug: string
  onSelectCategory: (slug: string) => void
}

interface SidebarCategoryItem {
  id: string
  name: string
  slug: string
  image: string
  bgColor: string
  imageWidth: number
  imageHeight: number
  imageLeft: number
  imageTop: number
}

const SIDEBAR_CATEGORIES: SidebarCategoryItem[] = [
  {
    id: 'categories',
    name: 'Categories',
    slug: 'categories',
    image: categoriesImg,
    bgColor: '#D4F7F2',
    imageWidth: 126,
    imageHeight: 122,
    imageLeft: 6,
    imageTop: -40, // pushed top higher up
  },
  {
    id: 'stores',
    name: 'Stores',
    slug: 'stores',
    image: storesImg,
    bgColor: '#D4F7F2',
    imageWidth: 120,
    imageHeight: 116,
    imageLeft: 8,
    imageTop: -28,
  },
  {
    id: 'brands',
    name: 'Brands',
    slug: 'brands',
    image: brandsImg,
    bgColor: '#FCE7F3',
    imageWidth: 118,
    imageHeight: 114,
    imageLeft: 8,
    imageTop: -28,
  },
  {
    id: 'banks',
    name: 'Banks',
    slug: 'banks',
    image: banksImg,
    bgColor: '#FEF9C3',
    imageWidth: 122,
    imageHeight: 118,
    imageLeft: 8,
    imageTop: -28,
  },
  {
    id: 'festivals',
    name: 'Festivals',
    slug: 'festivals',
    image: festivalsImg,
    bgColor: '#FEE2E2',
    imageWidth: 126,
    imageHeight: 122,
    imageLeft: 6,
    imageTop: -30,
  },
  {
    id: 'travelling',
    name: 'Travelling',
    slug: 'travelling',
    image: travellingImg,
    bgColor: '#E0F2FE',
    imageWidth: 120,
    imageHeight: 116,
    imageLeft: 8,
    imageTop: -28,
  },
  {
    id: 'cities-deals',
    name: 'Cities Deals',
    slug: 'cities-deals',
    image: citiesDealsImg,
    bgColor: '#EBF5FF',
    imageWidth: 120,
    imageHeight: 116,
    imageLeft: 8,
    imageTop: -28,
  },
]

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategorySlug,
  onSelectCategory,
}) => {
  return (
    <aside className="category-sidebar" aria-label="Categories Sidebar">
      <div className="category-sidebar__list">
        {SIDEBAR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug

          return (
            <div
              key={cat.id}
              className={`category-sidebar-item ${isSelected ? 'category-sidebar-item--active' : ''}`}
              style={{ backgroundColor: cat.bgColor }}
              onClick={() => onSelectCategory(cat.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(cat.slug)
                }
              }}
            >
              {/* 3D illustration pushed right & elevated */}
              <img
                src={cat.image}
                alt=""
                className="category-sidebar-item__image"
                style={{
                  width: `${cat.imageWidth}px`,
                  height: `${cat.imageHeight}px`,
                  left: `${cat.imageLeft}px`,
                  top: `${cat.imageTop}px`,
                }}
                aria-hidden="true"
              />

              {/* Category Name positioned right next to the illustration */}
              <span className="category-sidebar-item__label">{cat.name}</span>

              {/* White circular arrow button */}
              <button
                type="button"
                className="category-sidebar-item__arrow"
                aria-label={`View ${cat.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCategory(cat.slug)
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="#000000"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Popular Stores Section */}
      <PopularStores />
    </aside>
  )
}

export default CategorySidebar
