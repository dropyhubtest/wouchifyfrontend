import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingStoresRow } from '../components/directory/TrendingStoresRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { STORES_DIRECTORY_DATA } from '../data/storesDirectoryData'
import type { DirectoryStore } from '../data/storesDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './StoresDirectoryPage.css'

export const StoresDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 61 Figma stores based on search query and active letter
  const filteredStores = useMemo(() => {
    let result = STORES_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(q) ||
          store.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((store) => store.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered stores by letter (Only non-empty Figma groups are created)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryStore[]>()

    for (const store of filteredStores) {
      const letter = store.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(store)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredStores])

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
      const element = document.getElementById(`stores-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="stores-directory-page-wrapper"
      style={{ '--stores-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="stores-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="stores-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="stores-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="stores-directory-top-area">
            <a
              href="/categories"
              className="stores-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h1 className="stores-directory-heading">Trending Stores</h1>
          </div>

          {/* 6 Dedicated Trending Stores Cards */}
          <div className="stores-directory-trending-container">
            <TrendingStoresRow />
          </div>

          {/* Browse All Toolbar */}
          <section className="stores-directory-toolbar" aria-label="Toolbar">
            <div className="stores-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent */}
              <div className="stores-directory-toolbar__heading-group">
                <div className="stores-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="stores-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill */}
              <div className="stores-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown */}
              <div className="stores-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="stores-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar + Right Store Directory */}
          <div className="stores-directory-layout">
            <aside className="stores-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="stores" />
            </aside>

            <section className="stores-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, stores], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={stores}
                    index={index}
                    prefixId="stores-directory"
                  />
                ))
              ) : (
                <div className="stores-directory-empty">
                  <p className="stores-directory-empty__text">No stores found matching your search.</p>
                  <button
                    type="button"
                    className="stores-directory-empty__reset-btn"
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

export default StoresDirectoryPage
