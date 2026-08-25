import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { TrendingCategoriesRow } from '../components/subcategories/TrendingCategoriesRow'
import { CategorySidebar, CategoryAlphabetSection } from '../components/categories'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { SUBCATEGORIES_DATA } from '../data/subcategoriesData'
import type { SubcategoryItem } from '../data/subcategoriesData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './SubCategoriesPage.css'

export const SubCategoriesPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSidebarCategory, setSelectedSidebarCategory] = useState('categories')
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(8500)

  // Live-filter 114 subcategories by search query and letter
  const filteredSubcategories = useMemo(() => {
    return SUBCATEGORIES_DATA.filter((item) => {
      // Letter filter if selected
      if (activeLetter && item.letter.toUpperCase() !== activeLetter.toUpperCase()) {
        return false
      }
      // Search filter across name and searchTerms
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesTerms = item.searchTerms?.some((t) => t.includes(q)) ?? false
        return matchesName || matchesTerms
      }
      return true
    })
  }, [searchQuery, activeLetter])

  // Group filtered subcategories into alphabetical sections
  const letterGroups = useMemo(() => {
    const map = new Map<string, SubcategoryItem[]>()
    for (const item of filteredSubcategories) {
      const letter = item.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(item)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredSubcategories])

  // Update canvas height dynamically for natural document flow
  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight)
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 100)
    return () => clearTimeout(timer)
  }, [letterGroups.length, searchQuery, activeLetter])

  // Smooth scroll to letter section on A-Z click
  const handleLetterClick = useCallback((letter: string | null) => {
    setActiveLetter(letter)
    if (letter) {
      const element = document.getElementById(`directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="subcategories-page-wrapper"
      style={{ '--subcategories-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="subcategories-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="subcategories-page__main"
        style={{ height: `${canvasHeight * scale}px` }}
      >
        <div className="subcategories-page__canvas" ref={canvasRef}>
          {/* Top Row: Back Link and Trending Categories Heading */}
          <div className="subcategories-top-bar">
            <a
              href="/categories"
              className="subcategories-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h2 className="subcategories-trending-heading">
              Trending Categories
            </h2>
          </div>

          {/* Dedicated 6-Card Trending Categories Row */}
          <div className="subcategories-trending-container">
            <TrendingCategoriesRow />
          </div>

          {/* Browse All Toolbar */}
          <section className="subcategories-toolbar" aria-label="Toolbar">
            <div className="subcategories-toolbar__controls">
              {/* Heading with Navy Semicircle Accent */}
              <div className="subcategories-toolbar__heading-group">
                <div className="subcategories-toolbar__heading-accent" aria-hidden="true" />
                <h3 className="subcategories-toolbar__heading">Browse All</h3>
              </div>

              {/* Lavender Search Pill */}
              <div className="subcategories-toolbar__search">
                <StoreSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              {/* All Stores Dropdown */}
              <div className="subcategories-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* A–Z Letter Controls Row */}
            <div className="subcategories-toolbar__alphabet-row">
              <StoreAlphabetFilter
                activeLetter={activeLetter}
                onSelect={handleLetterClick}
              />
            </div>
          </section>

          {/* Main Layout: Left Sidebar + Right Alphabetical Directory */}
          <section className="subcategories-directory-layout" aria-label="Subcategories Directory">
            {/* Left Sidebar */}
            <aside className="subcategories-sidebar-column">
              <CategorySidebar
                selectedCategorySlug={selectedSidebarCategory}
                onSelectCategory={setSelectedSidebarCategory}
              />
            </aside>

            {/* Right Directory */}
            <section className="subcategories-directory-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, items], index) => (
                  <CategoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={items}
                    index={index}
                  />
                ))
              ) : (
                <div className="subcategories-empty-state">
                  <p className="subcategories-empty-state__text">
                    No subcategories found for "{searchQuery}"
                  </p>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      {/* 3. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default SubCategoriesPage
