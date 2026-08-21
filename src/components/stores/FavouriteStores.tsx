import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { StoreCard } from './StoreCard'
import { StoreSearch } from './StoreSearch'
import { StoreCategoryFilter } from './StoreCategoryFilter'
import { StoreAlphabetFilter } from './StoreAlphabetFilter'
import { FAVOURITE_STORES, STORE_CATEGORIES } from '../../data/storesHero'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './FavouriteStores.css'

export const FavouriteStores: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Stores')
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1800)
  const [revealed, setRevealed] = useState(false)

  // Single derived filtered list combining all three filters
  const filteredStores = useMemo(() => {
    return FAVOURITE_STORES.filter((store) => {
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
  }, [searchQuery, activeLetter, selectedCategory])

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
