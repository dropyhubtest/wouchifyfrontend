import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileTrendingEntityRow } from '../components/mobile/MobileTrendingEntityRow'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCard } from '../components/mobile/DirectoryCard'
import { STORES_DIRECTORY_DATA, TRENDING_STORES } from '../data/storesDirectoryData'
import type { UnifiedDirectoryItem } from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import gridStyles from '../components/mobile/DirectoryCardGrid.module.css'
import styles from './MobileSubCategoriesPage.module.css'

const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const MobileStoresDirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  const normalizedStores: UnifiedDirectoryItem[] = useMemo(() => {
    return STORES_DIRECTORY_DATA.map((s) => ({
      id: `store-${s.id}`,
      name: s.name,
      slug: s.slug,
      logo: s.logo,
      href: s.destinationHref || `/stores#${s.slug}`,
      letter: (s.letter || s.name.charAt(0)).toUpperCase(),
      type: 'stores' as const,
    }))
  }, [])

  const filteredStores = useMemo(() => {
    if (!debouncedSearch) return normalizedStores
    return normalizedStores.filter((item) => {
      const original = STORES_DIRECTORY_DATA.find((s) => s.slug === item.slug)
      const matchesName = item.name.toLowerCase().includes(debouncedSearch)
      const matchesTerms = original?.searchTerms?.some((t) => t.toLowerCase().includes(debouncedSearch)) ?? false
      return matchesName || matchesTerms
    })
  }, [normalizedStores, debouncedSearch])

  const groupedLetterSections = useMemo(() => {
    const map = new Map<string, UnifiedDirectoryItem[]>()
    filteredStores.forEach((item) => {
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
  }, [filteredStores])

  const availableLetters = useMemo(() => {
    return new Set(groupedLetterSections.map((g) => g.letter))
  }, [groupedLetterSections])

  const trendingItems = useMemo(() => {
    return TRENDING_STORES.map((t) => ({
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
        <h1 className={styles.subHeaderTitle}>Trending Stores</h1>
      </div>

      <MobileTrendingEntityRow items={trendingItems} ariaLabel="Trending stores" />

      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      <main className={styles.directorySection} aria-label="Stores Directory">
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType="stores"
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
                No stores found matching "{searchInput}"
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

export default MobileStoresDirectoryPage
