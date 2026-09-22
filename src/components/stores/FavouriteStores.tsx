import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { StoreCard } from './StoreCard'
import { StoreSearch } from './StoreSearch'
import { StoreCategoryFilter } from './StoreCategoryFilter'
import { StoreAlphabetFilter } from './StoreAlphabetFilter'
import { STORE_CATEGORIES, type StoreItem } from '../../data/storesHero'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getCached } from '../../services/dataCache'
import { StoreCardSkeleton } from '../common/Skeletons'
import './FavouriteStores.css'

export const FavouriteStores: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Stores')
  
  // Synchronously check cache
  const cachedData = getCached<any[]>('public:stores')
  const initialStores = cachedData && Array.isArray(cachedData) ? cachedData
    .filter((s: any) => s.status !== 'inactive' && s.status !== 'rejected')
    .map((s: any) => ({
      id: s._id || s.id || `store-${s.name}`,
      name: s.name || 'Store',
      slug: s.slug || (s.name || '').toLowerCase().replace(/\s+/g, '-'),
      logo: s.logo || s.logoUrl || '',
      category: s.category || 'Fashion',
      reward: s.reward || 'Upto 5% rewards',
      description: s.description || `${s.name} online deals & cashback`,
      cardBg: s.cardBg || '#ECF4FF',
      badgeBg: s.badgeBg || '#D3E0F2',
      logoPanelBg: s.logoPanelBg
    })) : []

  const [storesList, setStoresList] = useState<StoreItem[]>(initialStores)
  const [loading, setLoading] = useState<boolean>(!cachedData)
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1800)
  const [revealed, setRevealed] = useState(false)

  const fetchLiveStores = useCallback(async () => {
    try {
      const fetched = await adminApi.getStores()
      if (Array.isArray(fetched)) {
        const mapped: StoreItem[] = fetched
          .filter((s: any) => s.status !== 'inactive' && s.status !== 'rejected')
          .map((s: any) => ({
            id: s._id || s.id || `store-${s.name}`,
            name: s.name || 'Store',
            slug: s.slug || (s.name || '').toLowerCase().replace(/\s+/g, '-'),
            logo: s.logo || s.logoUrl || '',
            category: s.category || 'Fashion',
            reward: s.reward || 'Upto 5% rewards',
            description: s.description || `${s.name} online deals & cashback`,
            cardBg: s.cardBg || '#ECF4FF',
            badgeBg: s.badgeBg || '#D3E0F2',
            logoPanelBg: s.logoPanelBg
          }))
        setStoresList(mapped)
      }
    } catch (err) {
      console.error('Failed to auto-refresh stores:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    fetchLiveStores()

    const handleSync = () => {
      if (isMounted) fetchLiveStores()
    }
    window.addEventListener('wouchify_stores_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      isMounted = false
      window.removeEventListener('wouchify_stores_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [fetchLiveStores])

  // Single derived filtered list combining all three filters
  const filteredStores = useMemo(() => {
    return storesList.filter((store) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLetter =
        activeLetter === null ||
        store.name.charAt(0).toUpperCase() === activeLetter

      const matchesCategory =
        selectedCategory === 'All Stores' ||
        store.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesLetter && matchesCategory
    })
  }, [storesList, searchQuery, activeLetter, selectedCategory])

  // Update canvas height dynamically based on filtered stores
  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight)
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 50)
    return () => clearTimeout(timer)
  }, [filteredStores.length, loading])

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
          {loading ? (
            <StoreCardSkeleton count={8} />
          ) : filteredStores.length > 0 ? (
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
