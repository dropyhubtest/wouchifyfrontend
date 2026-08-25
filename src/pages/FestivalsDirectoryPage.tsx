import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingFestivalsRow } from '../components/directory/TrendingFestivalsRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { FESTIVALS_DIRECTORY_DATA } from '../data/festivalsDirectoryData'
import type { DirectoryFestival } from '../data/festivalsDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './FestivalsDirectoryPage.css'

export const FestivalsDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 29 Figma festivals based on search query and active letter
  const filteredFestivals = useMemo(() => {
    let result = FESTIVALS_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (fest) =>
          fest.name.toLowerCase().includes(q) ||
          fest.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((fest) => fest.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered festivals by letter (Only non-empty Figma groups are created - exactly 17 groups)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryFestival[]>()

    for (const fest of filteredFestivals) {
      const letter = fest.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(fest)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredFestivals])

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
      const element = document.getElementById(`festivals-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="festivals-directory-page-wrapper"
      style={{ '--festivals-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="festivals-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="festivals-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="festivals-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="festivals-directory-top-area">
            <a
              href="/categories"
              className="festivals-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h1 className="festivals-directory-heading">Trending Festivals</h1>
          </div>

          {/* 6 Dedicated Trending Festivals Cards */}
          <div className="festivals-directory-trending-container">
            <TrendingFestivalsRow />
          </div>

          {/* Browse All Toolbar using canonical StoreSearch, StoreCategoryFilter, StoreAlphabetFilter */}
          <section className="festivals-directory-toolbar" aria-label="Toolbar">
            <div className="festivals-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent anchored to X: 0 */}
              <div className="festivals-directory-toolbar__heading-group">
                <div className="festivals-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="festivals-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill (X: 373px to X: 1606px) */}
              <div className="festivals-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown (X: 1659px) */}
              <div className="festivals-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="festivals-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar (Festivals Active) + Right Festival Directory (17 Groups, 29 Cards) */}
          <div className="festivals-directory-layout">
            <aside className="festivals-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="festivals" />
            </aside>

            <section className="festivals-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, festivals], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={festivals}
                    index={index}
                    prefixId="festivals-directory"
                  />
                ))
              ) : (
                <div className="festivals-directory-empty">
                  <p className="festivals-directory-empty__text">
                    No festivals found matching your search.
                  </p>
                  <button
                    type="button"
                    className="festivals-directory-empty__reset-btn"
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

export default FestivalsDirectoryPage
