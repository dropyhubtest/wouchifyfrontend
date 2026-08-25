import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingTravellingRow } from '../components/directory/TrendingTravellingRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { TRAVELLING_DIRECTORY_DATA } from '../data/travellingDirectoryData'
import type { DirectoryTravelItem } from '../data/travellingDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './TravellingDirectoryPage.css'

export const TravellingDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 43 Figma travel items based on search query and active letter
  const filteredTravel = useMemo(() => {
    let result = TRAVELLING_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((item) => item.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered travel items by letter (Only non-empty Figma groups are created - exactly 17 groups)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryTravelItem[]>()

    for (const item of filteredTravel) {
      const letter = item.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(item)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredTravel])

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
      const element = document.getElementById(`travelling-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="travelling-directory-page-wrapper"
      style={{ '--travelling-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="travelling-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="travelling-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="travelling-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="travelling-directory-top-area">
            <a
              href="/categories"
              className="travelling-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h1 className="travelling-directory-heading">Trending Travelling Categories</h1>
          </div>

          {/* 6 Dedicated Trending Travel Category Cards */}
          <div className="travelling-directory-trending-container">
            <TrendingTravellingRow />
          </div>

          {/* Browse All Toolbar using canonical StoreSearch, StoreCategoryFilter, StoreAlphabetFilter */}
          <section className="travelling-directory-toolbar" aria-label="Toolbar">
            <div className="travelling-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent anchored to X: 0 */}
              <div className="travelling-directory-toolbar__heading-group">
                <div className="travelling-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="travelling-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill (X: 373px to X: 1606px) */}
              <div className="travelling-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown (X: 1659px) */}
              <div className="travelling-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="travelling-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar (Travelling Active) + Right Travel Directory (17 Groups, 43 Cards) */}
          <div className="travelling-directory-layout">
            <aside className="travelling-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="travelling" />
            </aside>

            <section className="travelling-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, items], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={items}
                    index={index}
                    prefixId="travelling-directory"
                  />
                ))
              ) : (
                <div className="travelling-directory-empty">
                  <p className="travelling-directory-empty__text">
                    No travel options found matching your search.
                  </p>
                  <button
                    type="button"
                    className="travelling-directory-empty__reset-btn"
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

export default TravellingDirectoryPage
