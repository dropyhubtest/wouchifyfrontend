import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileTrendingCategoriesRow } from '../components/mobile/MobileTrendingCategoriesRow'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCard } from '../components/mobile/DirectoryCard'
import { SUBCATEGORIES_DATA } from '../data/subcategoriesData'
import type { UnifiedDirectoryItem } from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import gridStyles from '../components/mobile/DirectoryCardGrid.module.css'
import styles from './MobileSubCategoriesPage.module.css'

const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const MobileSubCategoriesPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  // Debounce search input by 120ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Map subcategories into unified directory item format
  const normalizedSubcategories: UnifiedDirectoryItem[] = useMemo(() => {
    return SUBCATEGORIES_DATA.map((sc) => ({
      id: `cat-${sc.id}`,
      name: sc.name,
      slug: sc.slug,
      logo: sc.image,
      href: `/categories/${sc.slug}`,
      letter: (sc.letter || sc.name.charAt(0)).toUpperCase(),
      type: 'categories' as const,
    }))
  }, [])

  // Filter 114 subcategories by live search query
  const filteredSubcategories = useMemo(() => {
    if (!debouncedSearch) return normalizedSubcategories
    return normalizedSubcategories.filter((item) => {
      const original = SUBCATEGORIES_DATA.find((sc) => sc.slug === item.slug)
      const matchesName = item.name.toLowerCase().includes(debouncedSearch)
      const matchesTerms = original?.searchTerms?.some((t) => t.toLowerCase().includes(debouncedSearch)) ?? false
      return matchesName || matchesTerms
    })
  }, [normalizedSubcategories, debouncedSearch])

  // Group filtered items by letter
  const groupedLetterSections = useMemo(() => {
    const map = new Map<string, UnifiedDirectoryItem[]>()
    filteredSubcategories.forEach((item) => {
      const letter = item.letter.toUpperCase()
      if (!map.has(letter)) {
        map.set(letter, [])
      }
      map.get(letter)!.push(item)
    })

    return ALPHABET_LETTERS.map((letter) => ({
      letter,
      items: map.get(letter) || [],
    })).filter((group) => group.items.length > 0)
  }, [filteredSubcategories])

  // Available letters set for A-Z strip
  const availableLetters = useMemo(() => {
    return new Set(groupedLetterSections.map((g) => g.letter))
  }, [groupedLetterSections])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/categories'
    }
  }

  const handleResetSearch = () => {
    setSearchInput('')
    setDebouncedSearch('')
  }

  return (
    <div className={styles.subCategoriesPage}>
      {/* 64px Header bar */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* Pill Search Bar */}
      <div className={styles.searchContainer} role="search">
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search your Favourite Stores"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search your Favourite Stores"
        />
        <div className={styles.searchIconWrapper} aria-hidden="true">
          <img src={searchIcon} alt="" className={styles.searchIcon} />
        </div>
      </div>

      {/* Sub-header row: « Back left + "Trending Categories" centered */}
      <div className={styles.subHeaderRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Back to Categories"
        >
          &laquo; Back
        </button>
        <h1 className={styles.subHeaderTitle}>Trending Categories</h1>
      </div>

      {/* 6 Trending Category Cards in Viewport */}
      <MobileTrendingCategoriesRow />

      {/* Shared A-Z Alphabet Quick-Jump Strip */}
      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      {/* Main Directory Area: Left Navigation Rail (76px) + Right 3-Col Card Grid */}
      <main className={styles.directorySection} aria-label="Subcategories Directory">
        {/* Left Sticky Nav Rail */}
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType="categories"
          />
        </aside>

        {/* Right 3-Column Grid with Peach Letter Header Pills */}
        <div className={gridStyles.gridContainer}>
          {groupedLetterSections.length > 0 ? (
            groupedLetterSections.map((group) => {
              return (
                <section
                  key={group.letter}
                  id={`letter-group-${group.letter}`}
                  data-letter={group.letter}
                  className={gridStyles.letterSection}
                  aria-label={`Letter ${group.letter}`}
                >
                  {/* Peach Letter Header Pill */}
                  <div className={gridStyles.letterHeaderPill}>
                    <span className={gridStyles.letterHeaderText}>{group.letter}</span>
                  </div>

                  <div className={gridStyles.cardGrid}>
                    {group.items.map((item) => (
                      <DirectoryCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <div className={gridStyles.emptyState}>
              <p className={gridStyles.emptyText}>
                No subcategories found matching "{searchInput}"
              </p>
              <button
                type="button"
                className={gridStyles.resetBtn}
                onClick={handleResetSearch}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </main>

      <div className={styles.directoryBottomSpacer} />

      {/* Reused MobileFooter */}
      <MobileFooter />
    </div>
  )
}

export default MobileSubCategoriesPage
