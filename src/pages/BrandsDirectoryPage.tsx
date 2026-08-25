import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingBrandsRow } from '../components/directory/TrendingBrandsRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { BRANDS_DIRECTORY_DATA } from '../data/brandsDirectoryData'
import type { DirectoryBrand } from '../data/brandsDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './BrandsDirectoryPage.css'

export const BrandsDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 88 Figma brands based on search query and active letter
  const filteredBrands = useMemo(() => {
    let result = BRANDS_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (brand) =>
          brand.name.toLowerCase().includes(q) ||
          brand.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((brand) => brand.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered brands by letter (Only non-empty Figma groups are created - exactly 23 groups)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryBrand[]>()

    for (const brand of filteredBrands) {
      const letter = brand.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(brand)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredBrands])

  // Update canvas height dynamically for natural document flow into FooterSection
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
      const element = document.getElementById(`brands-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="brands-directory-page-wrapper"
      style={{ '--brands-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="brands-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="brands-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="brands-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="brands-directory-top-area">
            <a
              href="/categories"
              className="brands-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h1 className="brands-directory-heading">Trending Brands</h1>
          </div>

          {/* 6 Dedicated Trending Brands Cards */}
          <div className="brands-directory-trending-container">
            <TrendingBrandsRow />
          </div>

          {/* Browse All Toolbar */}
          <section className="brands-directory-toolbar" aria-label="Toolbar">
            <div className="brands-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent anchored to X: 0 */}
              <div className="brands-directory-toolbar__heading-group">
                <div className="brands-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="brands-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill */}
              <div className="brands-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown */}
              <div className="brands-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="brands-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar + Right Brand Directory (23 Groups, 88 Cards) */}
          <div className="brands-directory-layout">
            <aside className="brands-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="brands" />
            </aside>

            <section className="brands-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, brands], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={brands}
                    index={index}
                    prefixId="brands-directory"
                  />
                ))
              ) : (
                <div className="brands-directory-empty">
                  <p className="brands-directory-empty__text">No brands found matching your search.</p>
                  <button
                    type="button"
                    className="brands-directory-empty__reset-btn"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveLetter(null)
                      setSelectedStoreCategory('All Stores')
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* 3. Global Footer in Normal Document Flow */}
      <FooterSection />
    </div>
  )
}

export default BrandsDirectoryPage
