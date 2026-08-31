import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileCategoriesSlider } from '../components/mobile/MobileCategoriesSlider'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCardGrid } from '../components/mobile/DirectoryCardGrid'
import {
  buildUnifiedDirectory,
  groupDirectoryByAlphabet,
} from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import styles from './MobileCategoriesPage.module.css'

export const MobileCategoriesPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  // Debounce search input by 120ms to prevent layout thrashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Build the complete 351-item unified directory once and memoize
  const allUnifiedItems = useMemo(() => {
    return buildUnifiedDirectory()
  }, [])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return allUnifiedItems
    return allUnifiedItems.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch)
    )
  }, [allUnifiedItems, debouncedSearch])

  // Group into all 26 letter buckets (A-Z)
  const groupedAlphabet = useMemo(() => {
    return groupDirectoryByAlphabet(filteredItems)
  }, [filteredItems])

  // Compute available letters that have items in the current view
  const availableLetters = useMemo(() => {
    const set = new Set<string>()
    groupedAlphabet.forEach((g) => {
      if (g.items.length > 0) {
        set.add(g.letter)
      }
    })
    return set
  }, [groupedAlphabet])

  const handleResetFilters = () => {
    setSearchInput('')
    setDebouncedSearch('')
    setActiveLetter(null)
  }

  return (
    <div className={styles.mobileCategoriesPage}>
      {/* 64px Header bar */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* Pill Search Bar matching Figma (media_1788154485761.png) */}
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

      {/* Category Circle Section (6 items) */}
      <MobileCategoriesSlider />

      {/* Shared A-Z Alphabet Quick-Jump Strip */}
      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      {/* Main Directory Area: Sticky Left Navigation Rail (76px) + Right 3-Column Card Grid */}
      <main className={styles.directorySection} aria-label="Categories Directory">
        {/* Left Sticky Navigation Rail (76px) - None active on general landing page */}
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType={null}
          />
        </aside>

        {/* Right 3-Column Grid with 26 Peach Wave Dividers */}
        <DirectoryCardGrid
          groupedItems={groupedAlphabet}
          onResetFilters={handleResetFilters}
        />
      </main>

      <div className={styles.directoryBottomSpacer} />

      {/* Reused MobileFooter */}
      <MobileFooter />
    </div>
  )
}

export default MobileCategoriesPage
