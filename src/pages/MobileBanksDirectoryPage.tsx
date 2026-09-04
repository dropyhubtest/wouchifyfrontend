import React, { useState, useMemo, useEffect } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { MobileTrendingEntityRow } from '../components/mobile/MobileTrendingEntityRow'
import { MobileAlphabetStrip } from '../components/mobile/MobileAlphabetStrip'
import { DirectoryTypeRail } from '../components/mobile/DirectoryTypeRail'
import { DirectoryCard } from '../components/mobile/DirectoryCard'
import { BANKS_DIRECTORY_DATA, TRENDING_BANKS } from '../data/banksDirectoryData'
import type { UnifiedDirectoryItem } from '../data/unifiedDirectory'
import searchIcon from '../assets/icons/search.svg'
import gridStyles from '../components/mobile/DirectoryCardGrid.module.css'
import styles from './MobileSubCategoriesPage.module.css'

const ALPHABET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const MobileBanksDirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 120)
    return () => clearTimeout(timer)
  }, [searchInput])

  const normalizedBanks: UnifiedDirectoryItem[] = useMemo(() => {
    return BANKS_DIRECTORY_DATA.map((bk) => ({
      id: `bank-${bk.id}`,
      name: bk.name,
      slug: bk.slug,
      logo: bk.logo,
      href: bk.destinationHref || `/categories/banks#${bk.slug}`,
      letter: (bk.letter || bk.name.charAt(0)).toUpperCase(),
      type: 'banks' as const,
    }))
  }, [])

  const filteredBanks = useMemo(() => {
    if (!debouncedSearch) return normalizedBanks
    return normalizedBanks.filter((item) => {
      const original = BANKS_DIRECTORY_DATA.find((bk) => bk.slug === item.slug)
      const matchesName = item.name.toLowerCase().includes(debouncedSearch)
      const matchesTerms = original?.searchTerms?.some((t) => t.toLowerCase().includes(debouncedSearch)) ?? false
      return matchesName || matchesTerms
    })
  }, [normalizedBanks, debouncedSearch])

  const groupedLetterSections = useMemo(() => {
    const map = new Map<string, UnifiedDirectoryItem[]>()
    filteredBanks.forEach((item) => {
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
  }, [filteredBanks])

  const availableLetters = useMemo(() => {
    return new Set(groupedLetterSections.map((g) => g.letter))
  }, [groupedLetterSections])

  const trendingItems = useMemo(() => {
    return TRENDING_BANKS.map((t) => ({
      id: t.id,
      name: t.name,
      image: t.logo,
      href: t.href,
    }))
  }, [])

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
        <a
          href="/categories"
          className={styles.backButton}
          aria-label="Back to Categories"
        >
          &laquo; Back
        </a>
        <h1 className={styles.subHeaderTitle}>Trending Banks</h1>
      </div>

      <MobileTrendingEntityRow items={trendingItems} ariaLabel="Trending banks" />

      <MobileAlphabetStrip
        activeLetter={activeLetter}
        onSelectLetter={setActiveLetter}
        availableLetters={availableLetters}
      />

      <main className={styles.directorySection} aria-label="Banks Directory">
        <aside className={styles.railWrapper}>
          <DirectoryTypeRail
            mode="nav"
            activeNavType="banks"
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
                No banks found matching "{searchInput}"
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

export default MobileBanksDirectoryPage
