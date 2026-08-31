import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileTrendingEntityRow } from '../components/mobile/MobileTrendingEntityRow'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCard } from '../components/mobile/DirectoryCard'
import { BRANDS_DIRECTORY_DATA, TRENDING_BRANDS } from '../data/brandsDirectoryData'
import type { UnifiedDirectoryItem } from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import gridStyles from '../components/mobile/DirectoryCardGrid.module.css'
import styles from './MobileSubCategoriesPage.module.css'

const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const MobileBrandsDirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  const normalizedBrands: UnifiedDirectoryItem[] = useMemo(() => {
    return BRANDS_DIRECTORY_DATA.map((b) => ({
      id: `brand-${b.id}`,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      href: b.destinationHref || `/categories/brands#${b.slug}`,
      letter: (b.letter || b.name.charAt(0)).toUpperCase(),
      type: 'brands' as const,
    }))
  }, [])

  const filteredBrands = useMemo(() => {
    if (!debouncedSearch) return normalizedBrands
    return normalizedBrands.filter((item) => {
      const original = BRANDS_DIRECTORY_DATA.find((b) => b.slug === item.slug)
      const matchesName = item.name.toLowerCase().includes(debouncedSearch)
      const matchesTerms = original?.searchTerms?.some((t) => t.toLowerCase().includes(debouncedSearch)) ?? false
      return matchesName || matchesTerms
    })
  }, [normalizedBrands, debouncedSearch])

  const groupedLetterSections = useMemo(() => {
    const map = new Map<string, UnifiedDirectoryItem[]>()
    filteredBrands.forEach((item) => {
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
  }, [filteredBrands])

  const availableLetters = useMemo(() => {
    return new Set(groupedLetterSections.map((g) => g.letter))
  }, [groupedLetterSections])

  const trendingItems = useMemo(() => {
    return TRENDING_BRANDS.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.logo,
      href: t.href,
    }))
  }, [])

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
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

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

      <div className={styles.subHeaderRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Back to Categories"
        >
          &laquo; Back
        </button>
        <h1 className={styles.subHeaderTitle}>Trending Brands</h1>
      </div>

      <MobileTrendingEntityRow items={trendingItems} ariaLabel="Trending brands" />

      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      <main className={styles.directorySection} aria-label="Brands Directory">
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType="brands"
          />
        </aside>

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
                No brands found matching "{searchInput}"
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
      <MobileFooter />
    </div>
  )
}

export default MobileBrandsDirectoryPage
