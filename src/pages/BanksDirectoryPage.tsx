import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategorySidebar } from '../components/categories/CategorySidebar'
import { TrendingBanksRow } from '../components/directory/TrendingBanksRow'
import { DirectoryAlphabetSection } from '../components/directory/DirectoryAlphabetSection'
import { StoreSearch } from '../components/stores/StoreSearch'
import { StoreCategoryFilter } from '../components/stores/StoreCategoryFilter'
import { StoreAlphabetFilter } from '../components/stores/StoreAlphabetFilter'
import { STORE_CATEGORIES } from '../data/storesHero'
import { BANKS_DIRECTORY_DATA } from '../data/banksDirectoryData'
import type { DirectoryBank } from '../data/banksDirectoryData'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './BanksDirectoryPage.css'

export const BanksDirectoryPage: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedStoreCategory, setSelectedStoreCategory] = useState('All Stores')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(0)

  // Filter 9 Figma banks based on search query and active letter
  const filteredBanks = useMemo(() => {
    let result = BANKS_DIRECTORY_DATA

    // Search query filter (matches name and searchTerms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (bank) =>
          bank.name.toLowerCase().includes(q) ||
          bank.searchTerms?.some((term) => term.toLowerCase().includes(q))
      )
    }

    // Active letter filter
    if (activeLetter) {
      result = result.filter((bank) => bank.letter === activeLetter)
    }

    return result
  }, [searchQuery, activeLetter])

  // Group filtered banks by letter (Only non-empty Figma groups are created - exactly 6 groups)
  const letterGroups = useMemo(() => {
    const map = new Map<string, DirectoryBank[]>()

    for (const bank of filteredBanks) {
      const letter = bank.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(bank)
    }

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredBanks])

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
      const element = document.getElementById(`banks-directory-${letter}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <div
      className="banks-directory-page-wrapper"
      style={{ '--banks-scale': scale } as React.CSSProperties}
    >
      {/* 1. Global Shared Desktop Navbar */}
      <div className="banks-directory-navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Main 1920px Reference Canvas in Natural Document Flow */}
      <main
        className="banks-directory-main"
        style={{ height: canvasHeight ? `${canvasHeight * scale}px` : 'auto' }}
      >
        <div className="banks-directory-canvas" ref={canvasRef}>
          {/* Top Back Link & Heading */}
          <div className="banks-directory-top-area">
            <a
              href="/categories"
              className="banks-directory-back-link"
              title="Back to All Categories"
            >
              &gt;&gt;Back to All Categories
            </a>

            <h1 className="banks-directory-heading">Trending Banks</h1>
          </div>

          {/* 6 Dedicated Trending Banks Cards */}
          <div className="banks-directory-trending-container">
            <TrendingBanksRow />
          </div>

          {/* Browse All Toolbar using canonical StoreSearch, StoreCategoryFilter, StoreAlphabetFilter */}
          <section className="banks-directory-toolbar" aria-label="Toolbar">
            <div className="banks-directory-toolbar__controls">
              {/* Heading with Navy Semicircle Accent anchored to X: 0 */}
              <div className="banks-directory-toolbar__heading-group">
                <div className="banks-directory-toolbar__heading-accent" aria-hidden="true" />
                <h2 className="banks-directory-toolbar__heading">Browse All</h2>
              </div>

              {/* Lavender Search Pill (X: 373px to X: 1606px) */}
              <div className="banks-directory-toolbar__search">
                <StoreSearch value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* All Stores Dropdown (X: 1659px) */}
              <div className="banks-directory-toolbar__dropdown">
                <StoreCategoryFilter
                  categories={STORE_CATEGORIES}
                  selected={selectedStoreCategory}
                  onSelect={setSelectedStoreCategory}
                />
              </div>
            </div>

            {/* Circular A-Z Alphabet Filter Row */}
            <div className="banks-directory-toolbar__alphabet">
              <StoreAlphabetFilter activeLetter={activeLetter} onSelect={handleLetterClick} />
            </div>
          </section>

          {/* Main Layout: Left Sidebar (Banks Active) + Right Bank Directory (6 Groups, 9 Cards) */}
          <div className="banks-directory-layout">
            <aside className="banks-directory-sidebar-column">
              <CategorySidebar selectedCategorySlug="banks" />
            </aside>

            <section className="banks-directory-content-column">
              {letterGroups.length > 0 ? (
                letterGroups.map(([letter, banks], index) => (
                  <DirectoryAlphabetSection
                    key={letter}
                    letter={letter}
                    items={banks}
                    index={index}
                    prefixId="banks-directory"
                  />
                ))
              ) : (
                <div className="banks-directory-empty">
                  <p className="banks-directory-empty__text">No banks found matching your search.</p>
                  <button
                    type="button"
                    className="banks-directory-empty__reset-btn"
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

export default BanksDirectoryPage
