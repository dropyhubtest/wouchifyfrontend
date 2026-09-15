import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { StoreCard } from './StoreCard'
import { StoreSearch } from './StoreSearch'
import { StoreCategoryFilter } from './StoreCategoryFilter'
import { StoreAlphabetFilter } from './StoreAlphabetFilter'
import { FAVOURITE_STORES, STORE_CATEGORIES, type StoreItem } from '../../data/storesHero'
import { adminApi } from '../../services/adminApi'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { getPublicStores } from '../../services/api'
import { getStoreLogo } from '../../data/storesDirectoryData'
import './FavouriteStores.css'

const normalizeStoreKey = (val?: string) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const mergeWithMasterStores = (list: any[]): StoreItem[] => {
  if (!Array.isArray(list) || list.length === 0) return FAVOURITE_STORES

  // Build a Set of all normalized master store identifiers (id, name, slug)
  const masterKeys = new Set<string>()
  FAVOURITE_STORES.forEach(orig => {
    masterKeys.add(normalizeStoreKey(orig.id))
    masterKeys.add(normalizeStoreKey(orig.slug))
    masterKeys.add(normalizeStoreKey(orig.name))
  })

  // Start with all 20 FAVOURITE_STORES to guarantee exact original Figma design & ordering
  const mapped = FAVOURITE_STORES.map(orig => {
    const origNormId = normalizeStoreKey(orig.id)
    const origNormSlug = normalizeStoreKey(orig.slug)
    const origNormName = normalizeStoreKey(orig.name)

    const updated = list.find(s => {
      const sId = normalizeStoreKey(s.id || s._id)
      const sSlug = normalizeStoreKey(s.slug)
      const sName = normalizeStoreKey(s.name)
      return (
        (sId && (sId === origNormId || sId === origNormSlug || sId === origNormName)) ||
        (sSlug && (sSlug === origNormId || sSlug === origNormSlug || sSlug === origNormName)) ||
        (sName && (sName === origNormId || sName === origNormSlug || sName === origNormName))
      )
    })

    if (!updated) return orig
    return {
      ...orig,
      name: updated.name || orig.name,
      category: updated.category || orig.category,
      reward: updated.reward || orig.reward,
      description: updated.description || orig.description,
      cardBg: updated.cardBg || orig.cardBg,
      badgeBg: updated.badgeBg || orig.badgeBg,
      logoPanelBg: updated.logoPanelBg || orig.logoPanelBg,
      logo: orig.logo || updated.logo || updated.logoUrl,
      status: updated.status || 'active'
    }
  })

  // Only include genuinely new custom stores that do not match ANY of the 20 FAVOURITE_STORES
  const extraStores: StoreItem[] = []
  list.forEach((s: any) => {
    const sId = normalizeStoreKey(s.id || s._id)
    const sSlug = normalizeStoreKey(s.slug)
    const sName = normalizeStoreKey(s.name)

    const isMasterStore = (
      (sId && masterKeys.has(sId)) ||
      (sSlug && masterKeys.has(sSlug)) ||
      (sName && masterKeys.has(sName))
    )

    if (!isMasterStore && (s.name || s.id)) {
      extraStores.push({
        id: s.id || s._id || `store-${Date.now()}`,
        name: s.name || 'Store',
        slug: s.slug || (s.name || '').toLowerCase().replace(/\s+/g, '-'),
        logo: s.logo || s.logoUrl || '',
        category: s.category || 'Fashion',
        reward: s.reward || 'Upto 5% rewards',
        description: s.description || `${s.name} online deals & cashback`,
        cardBg: s.cardBg || '#ECF4FF',
        badgeBg: s.badgeBg || '#D3E0F2',
      })
    }
  })

  return [...mapped, ...extraStores].filter(s => (s as any).status !== 'inactive')
}

export const FavouriteStores: React.FC = () => {
  const scale = useDesktopScale()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All Stores')
  const [storesList, setStoresList] = useState<StoreItem[]>(() => {
    try {
      const cached = localStorage.getItem('wouchify_stores')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return mergeWithMasterStores(parsed)
      }
    } catch {}
    return FAVOURITE_STORES
  })
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1800)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchLiveStores = async () => {
      try {
        const fetched = await getPublicStores()
        if (!isMounted) return
        if (Array.isArray(fetched) && fetched.length > 0) {
          setStoresList(mergeWithMasterStores(fetched))
        }
      } catch (err) {
        console.error("Failed to auto-refresh stores:", err)
      }
    }

    fetchLiveStores()
    const intervalId = setInterval(fetchLiveStores, 10000)

    const handleSync = () => { fetchLiveStores() }
    window.addEventListener('wouchify_stores_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      isMounted = false
      clearInterval(intervalId)
      window.removeEventListener('wouchify_stores_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

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
        store.category === selectedCategory

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
