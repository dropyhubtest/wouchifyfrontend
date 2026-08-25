import React, { useMemo } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategoryDirectoryCard } from '../components/categories/CategoryDirectoryCard'
import { CATEGORIES_DATA } from '../data/categories'
import { CATEGORY_DIRECTORY_ITEMS } from '../data/categoriesDirectoryData'
import './CategoryDetailPage.css'

interface CategoryDetailPageProps {
  categorySlug: string
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ categorySlug }) => {
  const category = useMemo(() => {
    return CATEGORIES_DATA.find((c) => c.slug === categorySlug) || CATEGORIES_DATA[0]
  }, [categorySlug])

  const categoryItems = useMemo(() => {
    const q = category.slug.toLowerCase()
    return CATEGORY_DIRECTORY_ITEMS.filter(
      (item) => item.slug.includes(q) || item.name.toLowerCase().includes(q)
    )
  }, [category.slug])

  return (
    <div className="category-detail-page">
      {/* 1. Navbar */}
      <div className="category-detail-page__navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Category Detail Hero Banner */}
      <header
        className="category-detail-hero"
        style={{
          '--cat-bg': category.bgColor,
          '--cat-color': category.color,
          '--cat-text': category.textColor,
        } as React.CSSProperties}
      >
        <div className="category-detail-hero__container">
          <nav className="category-detail-hero__breadcrumbs" aria-label="Breadcrumbs">
            <a href="/categories">Categories</a>
            <span aria-hidden="true">&gt;</span>
            <span>{category.name}</span>
          </nav>

          <h1 className="category-detail-hero__title">{category.name}</h1>
          <p className="category-detail-hero__desc">{category.description}</p>

          {/* Subcategory Pills */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="category-detail-hero__subcategories">
              {category.subcategories.map((sub) => (
                <span key={sub.id} className="category-detail-hero__sub-pill">
                  {sub.name}
                  {sub.itemCount && <small>({sub.itemCount})</small>}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 3. Main Category Items Directory */}
      <main className="category-detail-page__main">
        <div className="category-detail-page__container">
          <div className="category-detail-page__header">
            <h2 className="category-detail-page__section-title">
              {category.name} Items
              <span className="category-detail-page__count">({categoryItems.length})</span>
            </h2>
            <a href="/categories" className="category-detail-page__back-link">
              &larr; Back to All Categories
            </a>
          </div>

          {categoryItems.length > 0 ? (
            <div className="category-detail-page__grid">
              {categoryItems.map((item) => (
                <CategoryDirectoryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="category-detail-page__empty">
              <p>No items currently listed in this category.</p>
            </div>
          )}
        </div>
      </main>

      {/* 4. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default CategoryDetailPage
