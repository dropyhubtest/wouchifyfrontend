import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { StoreCard } from './StoreCard'
import { StoreSearch } from './StoreSearch'
import { StoreCategoryFilter } from './StoreCategoryFilter'
import { StoreAlphabetFilter } from './StoreAlphabetFilter'
import { FAVOURITE_STORES, STORE_CATEGORIES, type StoreItem } from '../../data/storesHero'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { getPublicStores } from '../../services/api'
import { getStoreLogo } from '../../data/storesDirectoryData'
import './FavouriteStores.css'

export const FavouriteStores: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Stores')
  const [dbStores, setDbStores] = useState<StoreItem[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1800)
  const [revealed, setRevealed] = useState(false)

  // Fetch from DB
  useEffect(() => {
    const fetchStoresData = () => {
      getPublicStores().then(fetched => {
        // Map backend Store to StoreItem format to integrate with existing UI
        const mapped: StoreItem[] = fetched.map((s: any) => {
          const fallbackStore = FAVOURITE_STORES.find(fs => fs.name.toLowerCase() === s.name.toLowerCase())
          return {
            id: s._id || s.name.toLowerCase().replace(/\s+/g, '-'),
            name: s.name,
            slug: s.name.toLowerCase().replace(/\s+/g, '-'),
            logo: s.logo || fallbackStore?.logo || getStoreLogo(`${s.name.toLowerCase().replace(/\s+/g, '')}.png`) || '',
            category: s.category || fallbackStore?.category || 'Other',
            reward: s.reward || fallbackStore?.reward || 'Earn Cashback',
            description: s.reward || fallbackStore?.description || 'Shop and Earn',
            cardBg: s.cardBg || fallbackStore?.cardBg || '#ECF4FF',
            badgeBg: s.badgeBg || fallbackStore?.badgeBg || '#D3E0F2',
            mobileCategory: (s.category || fallbackStore?.mobileCategory || 'OTHER').toUpperCase(),
            mobileReward: s.reward || fallbackStore?.mobileReward || 'Earn Cashback',
            mobileDescription: s.reward || fallbackStore?.mobileDescription || 'Shop and Earn'
          }
        })
        setDbStores(mapped)
      }).catch(err => console.error("Failed to auto-refresh stores:", err))
    }

    // Fetch immediately on mount
    fetchStoresData()

    // Set up auto-refresh polling every 10 seconds
    const intervalId = setInterval(fetchStoresData, 10000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Single derived filtered list combining all three filters
  const filteredStores = useMemo(() => {
    // Merge DB stores only, rely entirely on the backend
    const combined = dbStores;

    return combined.filter((store) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLetter =
        activeLetter === null ||
        store.name.charAt(0).toUpperCase() === activeLetter

      const matchesCategory =
        selectedCategory === 'All Stores' ||
        store.category === selectedCategory

      return matchesSearch && matchesLetter && matchesCategory
    })
  }, [searchQuery, activeLetter, selectedCategory, dbStores])

  // Update canvas height dynamically based on filtered stores
  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight)
      }
    }
    updateHeight()
    // Small timeout to allow DOM layout to settle
    const timer = setTimeout(updateHeight, 50)
    return () => clearTimeout(timer)
  }, [filteredStores.length])

  // Subtle entrance animation via IntersectionObserver
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setRevealed(true)
      }
    }
  }, [])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    })

    observer.observe(grid)
    return () => observer.disconnect()
  }, [observerCallback])

  return (
    <section
      className="favourite-stores"
      id="favourite-stores"
      aria-label="Your Favourite Stores"
      style={
        {
          '--stores-scale': scale,
          height: `${canvasHeight * scale}px`,
        } as React.CSSProperties
      }
    >
      <div className="favourite-stores-canvas" ref={canvasRef}>
        {/* Controls row: heading with blue accent + search + category dropdown */}
        <div className="favourite-stores__controls">
          <div className="favourite-stores__heading-group">
            {/* Figma node 3603:981: Blue accent circle on left edge (x: -37px, y: 796px, 75x75) */}
            <div className="favourite-stores__heading-accent" aria-hidden="true" />
            <h2 className="favourite-stores__heading">Your Favourite Stores</h2>
          </div>

          <StoreSearch value={searchQuery} onChange={setSearchQuery} />

          <StoreCategoryFilter
            categories={STORE_CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Alphabet filter: all 26 letters on one horizontal row */}
        <div className="favourite-stores__alphabet-row">
          <StoreAlphabetFilter activeLetter={activeLetter} onSelect={setActiveLetter} />
        </div>

        {/* Store card grid */}
        <div
          ref={gridRef}
          className={`favourite-stores__grid ${revealed ? 'favourite-stores__grid--revealed' : ''}`}
        >
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <div
                key={store.id}
                className="favourite-stores__card-wrapper"
                style={{ '--card-index': index } as React.CSSProperties}
              >
                <StoreCard store={store} />
              </div>
            ))
          ) : (
            <div className="favourite-stores__empty">
              <p className="favourite-stores__empty-text">No stores found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FavouriteStores
