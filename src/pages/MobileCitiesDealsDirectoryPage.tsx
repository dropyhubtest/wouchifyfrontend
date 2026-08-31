import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileTrendingEntityRow } from '../components/mobile/MobileTrendingEntityRow'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCard } from '../components/mobile/DirectoryCard'
import { CITIES_DEALS_DIRECTORY_DATA, TRENDING_CITIES } from '../data/citiesDealsDirectoryData'
import type { UnifiedDirectoryItem } from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import gridStyles from '../components/mobile/DirectoryCardGrid.module.css'
import styles from './MobileSubCategoriesPage.module.css'

const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const MobileCitiesDealsDirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  const normalizedCities: UnifiedDirectoryItem[] = useMemo(() => {
    return CITIES_DEALS_DIRECTORY_DATA.map((c) => ({
      id: `city-${c.id}`,
      name: c.name,
      slug: c.slug,
      logo: c.image,
      href: c.destinationHref || `/categories/cities-deals#${c.slug}`,
      letter: (c.letter || c.name.charAt(0)).toUpperCase(),
      type: 'cities-deals' as const,
    }))
  }, [])

  const filteredCities = useMemo(() => {
    if (!debouncedSearch) return normalizedCities
    return normalizedCities.filter((item) => {
      const original = CITIES_DEALS_DIRECTORY_DATA.find((c) => c.slug === item.slug)
      const matchesName = item.name.toLowerCase().includes(debouncedSearch)
      const matchesTerms = original?.searchTerms?.some((t) => t.toLowerCase().includes(debouncedSearch)) ?? false
      return matchesName || matchesTerms
    })
  }, [normalizedCities, debouncedSearch])

  const groupedLetterSections = useMemo(() => {
    const map = new Map<string, UnifiedDirectoryItem[]>()
    filteredCities.forEach((item) => {
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
  }, [filteredCities])

  const availableLetters = useMemo(() => {
    return new Set(groupedLetterSections.map((g) => g.letter))
  }, [groupedLetterSections])

  const trendingItems = useMemo(() => {
    return TRENDING_CITIES.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
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
        <h1 className={styles.subHeaderTitle}>Trending Cities</h1>
      </div>

      <MobileTrendingEntityRow items={trendingItems} ariaLabel="Trending cities" />

      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      <main className={styles.directorySection} aria-label="Cities Deals Directory">
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType="cities-deals"
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
                No cities found matching "{searchInput}"
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

export default MobileCitiesDealsDirectoryPage
