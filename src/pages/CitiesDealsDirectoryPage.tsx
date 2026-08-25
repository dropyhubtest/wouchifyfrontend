import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingCitiesRow } from '../components/directory/TrendingCitiesRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { CITIES_DEALS_DIRECTORY_DATA } from '../data/citiesDealsDirectoryData'
import type { DirectoryCity } from '../data/citiesDealsDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './CitiesDealsDirectoryPage.css'

export const CitiesDealsDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 7 Figma cities based on search query and active letter
  const filteredCities = useMemo(() => {
    let result = CITIES_DEALS_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (city) =>
          city.name.toLowerCase().includes(q) ||
          city.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((city) => city.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered cities by letter (Only non-empty Figma groups are created - exactly 7 groups)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryCity[]>()

    for (const city of filteredCities) {
      const letter = city.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(city)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredCities])

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
      const element = document.getElementById(`cities-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="cities-deals-directory-page-wrapper"
      style={{ '--cities-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="cities-deals-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="cities-deals-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="cities-deals-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="cities-deals-directory-top-area">
            <a
              href="/categories"
              className="cities-deals-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            {/* Exact Figma text title match */}
            <h1 className="cities-deals-directory-heading">Trending Travelling Categories</h1>
          </div>

          {/* 6 Dedicated Trending City Cards */}
          <div className="cities-deals-directory-trending-container">
            <TrendingCitiesRow />
          </div>

          {/* Browse All Toolbar using canonical StoreSearch, StoreCategoryFilter, StoreAlphabetFilter */}
          <section className="cities-deals-directory-toolbar" aria-label="Toolbar">
            <div className="cities-deals-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent anchored to X: 0 */}
              <div className="cities-deals-directory-toolbar__heading-group">
                <div className="cities-deals-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="cities-deals-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill (X: 373px to X: 1606px) */}
              <div className="cities-deals-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown (X: 1659px) */}
              <div className="cities-deals-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="cities-deals-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar (Cities Deals Active) + Right City Directory (7 Groups, 7 Cards) */}
          <div className="cities-deals-directory-layout">
            <aside className="cities-deals-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="cities-deals" />
            </aside>

            <section className="cities-deals-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, cities], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={cities}
                    index={index}
                    prefixId="cities-directory"
                  />
                ))
              ) : (
                <div className="cities-deals-directory-empty">
                  <p className="cities-deals-directory-empty__text">
                    No city deals found matching your search.
                  </p>
                  <button
                    type="button"
                    className="cities-deals-directory-empty__reset-btn"
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

export default CitiesDealsDirectoryPage
