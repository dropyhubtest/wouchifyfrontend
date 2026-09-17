import React, { useState, useMemo, useRef, useEffect } from 'react'
import { DealCard } from './DealCard'
import {
  DEALS_FILTER_CATEGORIES,
  DEALS_FAVOURITE_STORES,
  normalizeDealToCard,
  normalizeLootToCard,
  type DealCardItem,
} from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { DealCardSkeleton } from '../common/Skeletons'
import './DealsFavouriteStores.css'

export interface DealsFavouriteStoresProps {
  title?: string
  searchPlaceholder?: string
  singleCardMode?: boolean
  hideCards?: boolean
  dataSource?: 'deals' | 'loot'
}

const FILTER_OPTIONS_MAP: Record<string, string[]> = {
  Products: ['All Products', 'Electronics', 'Fashion', 'Mobiles & Audio', 'Home & Living'],
  Stores: ['All Stores', 'Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Zepto'],
  Brands: ['All Brands', 'Apple', 'Samsung', 'Nike', 'Boat', 'Sony'],
  Festivals: ['All Festivals', 'Diwali Sale', 'Great Indian Festival', 'Big Billion Days'],
  Banks: ['All Banks', 'HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank'],
  Coupons: ['All Coupons', 'Flat 50% OFF', '₹500 Cashback', 'Extra 20% Off'],
}

export const DealsFavouriteStores: React.FC<DealsFavouriteStoresProps> = ({
  title = 'Deals from Favourite Stores',
  searchPlaceholder = 'Search Deals',
  singleCardMode = false,
  hideCards = false,
  dataSource = 'deals',
}) => {
  const scale = useDesktopScale()
  const canvasRef = useRef<HTMLDivElement>(null)
  const filterRowRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1100)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('Stores')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeSelections, setActiveSelections] = useState<Record<string, string>>({
    Products: 'All Products',
    Stores: 'All Stores',
    Brands: 'All Brands',
    Festivals: 'All Festivals',
    Banks: 'All Banks',
    Coupons: 'All Coupons',
  })

  const [dealsList, setDealsList] = useState<DealCardItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch live deals from Backend API & listen to update events
  useEffect(() => {
    let isMounted = true
    const fetchLiveItems = async () => {
      try {
        if (dataSource === 'loot') {
          const res = await adminApi.getLootDeals()
          if (!isMounted) return
          if (Array.isArray(res)) {
            const normalized = res
              .filter((l: any) => !l.status || l.status.toLowerCase() === 'active' || l.status.toLowerCase() === 'approved')
              .map((l: any, idx: number) => normalizeLootToCard(l, idx))
            setDealsList(normalized)
          }
        } else {
          const res = await adminApi.getDeals()
          if (!isMounted) return
          if (Array.isArray(res)) {
            const normalized = res
              .filter((d: any) => !d.status || d.status.toLowerCase() === 'active' || d.status.toLowerCase() === 'approved')
              .map((d: any, idx: number) => normalizeDealToCard(d, idx))
            setDealsList(normalized)
          }
        }
      } catch (err) {
        console.error('Failed to load deals:', err)
        if (isMounted) setDealsList([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchLiveItems()

    const handleUpdate = () => {
      fetchLiveItems()
    }

    window.addEventListener(dataSource === 'loot' ? 'wouchify_loot_deals_updated' : 'wouchify_deals_updated', handleUpdate)
    window.addEventListener('wouchify_deal_clicked', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      isMounted = false
      window.removeEventListener(dataSource === 'loot' ? 'wouchify_loot_deals_updated' : 'wouchify_deals_updated', handleUpdate)
      window.removeEventListener('wouchify_deal_clicked', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [dataSource])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRowRef.current && !filterRowRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredDeals = useMemo(() => {
    return dealsList.filter((item) => {
      // Only show active deals
      if (item.status && item.status.toLowerCase() !== 'active' && item.status.toLowerCase() !== 'approved') return false

      // Section Placement check: hide deals designated strictly for Section 2 (Best Selling Only)
      if (item.sectionPlacement === 'best_selling') return false

      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.store.toLowerCase().includes(searchQuery.toLowerCase())

      const activeSub = activeSelections[selectedFilter]

      let matchesFilter = true
      if (selectedFilter === 'Stores') {
        matchesFilter =
          !activeSub ||
          activeSub === 'All Stores' ||
          item.store.toLowerCase().includes(activeSub.toLowerCase())
      } else if (selectedFilter === 'Products') {
        matchesFilter =
          !activeSub ||
          activeSub === 'All Products' ||
          item.category.toLowerCase().includes(activeSub.toLowerCase()) ||
          item.title.toLowerCase().includes(activeSub.toLowerCase())
      } else if (selectedFilter === 'Brands') {
        matchesFilter =
          !activeSub ||
          activeSub === 'All Brands' ||
          item.title.toLowerCase().includes(activeSub.toLowerCase()) ||
          item.store.toLowerCase().includes(activeSub.toLowerCase())
      } else {
        matchesFilter =
          !selectedFilter ||
          item.category.toLowerCase() === selectedFilter.toLowerCase()
      }

      return matchesSearch && matchesFilter
    })
  }, [dealsList, searchQuery, selectedFilter, activeSelections])

  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        const measured = Math.max(
          canvasRef.current.scrollHeight,
          canvasRef.current.offsetHeight,
          canvasRef.current.getBoundingClientRect().height / (scale || 1)
        )
        setCanvasHeight(Math.ceil(measured) + 20)
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 100)

    const observer = new ResizeObserver(updateHeight)
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }
    window.addEventListener('resize', updateHeight)
    window.addEventListener('load', updateHeight)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('load', updateHeight)
    }
  }, [filteredDeals.length, scale])

  return (
    <section
      className="deals-favourite-stores"
      id="deals-favourite-stores"
      aria-label={title}
      style={{ height: `${canvasHeight * scale}px` }}
    >
      <div className="deals-favourite-canvas" ref={canvasRef}>
        {/* Controls row: Heading with blue accent + Search field (pushed right) */}
        <div className="deals-favourite__controls">
          <div className="deals-favourite__heading-group">
            <div className="deals-favourite__heading-accent" aria-hidden="true" />
            <h2 className="deals-favourite__heading">{title}</h2>
          </div>

          <div className="deals-favourite__search-box">
            <input
              type="text"
              className="deals-favourite__search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={searchPlaceholder}
            />
            <div className="deals-favourite__search-icon-wrap" aria-hidden="true">
              <svg
                className="deals-favourite__search-icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 20L16 16"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Categories Pill Row: Exact Figma Compact Geometry & Alternating Colors with Interactive Custom Dropdowns */}
        <div className="deals-favourite__filter-row" role="toolbar" aria-label="Deal categories" ref={filterRowRef}>
          {DEALS_FILTER_CATEGORIES.map((cat, index) => {
            const isPeach = index % 2 === 1
            const isMenuOpen = openDropdown === cat
            const currentSelected = activeSelections[cat] || `All ${cat}`
            const displayLabel = currentSelected && !currentSelected.startsWith('All ') ? currentSelected : cat
            const options = FILTER_OPTIONS_MAP[cat] || []

            return (
              <div key={cat} className="deals-favourite__filter-pill-wrapper">
                <button
                  type="button"
                  className={`deals-favourite__filter-pill ${isPeach ? 'deals-favourite__filter-pill--peach' : 'deals-favourite__filter-pill--lavender'} ${selectedFilter === cat ? 'deals-favourite__filter-pill--active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(cat)
                    setOpenDropdown(isMenuOpen ? null : cat)
                  }}
                  aria-label={`Filter by ${cat}`}
                  aria-pressed={selectedFilter === cat}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="listbox"
                >
                  <span className="deals-favourite__filter-label">{displayLabel}</span>
                  <svg
                    className="deals-favourite__filter-chevron"
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{
                      transform: isMenuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <path
                      d="M2 2.5L8 8L14 2.5"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Custom Dropdown Menu */}
                {isMenuOpen && (
                  <ul className="deals-favourite__filter-menu" role="listbox" aria-label={`${cat} options`}>
                    {options.map((opt) => {
                      const isOptionActive = activeSelections[cat] === opt
                      return (
                        <li
                          key={opt}
                          role="option"
                          aria-selected={isOptionActive}
                          className={`deals-favourite__filter-menu-item ${isOptionActive ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedFilter(cat)
                            setActiveSelections((prev) => ({ ...prev, [cat]: opt }))
                            setOpenDropdown(null)
                          }}
                        >
                          <span>{opt}</span>
                          {isOptionActive && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        {/* Favourite Store Logo Strip (Full Width Scroller) */}
        <div className="deals-favourite__store-strip-wrap">
          <div className="deals-favourite__store-strip" aria-label="Popular store deals">
            {DEALS_FAVOURITE_STORES.map((store) => (
              <a
                key={store.id}
                href={store.href}
                className={`deals-favourite__store-tile ${store.id === 'meesho' ? 'deals-favourite__store-tile--meesho' : ''}`}
                aria-label={`Browse ${store.name} deals`}
              >
                {/* Discount Badge on top edge */}
                <div className="deals-favourite__store-badge">
                  <span className="deals-favourite__store-badge-percent">{store.discountBadge.replace(' off', '')}</span>
                  <span className="deals-favourite__store-badge-off">off</span>
                </div>

                {/* Logo area */}
                <div className="deals-favourite__store-logo-wrapper">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className={`deals-favourite__store-logo deals-favourite__store-logo--${store.id}`}
                    style={store.logoScale ? { transform: `scale(${store.logoScale})` } : undefined}
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Deal Cards Grid (Optional) */}
        {!hideCards && (
          <div className={`deals-favourite__grid ${singleCardMode ? 'deals-favourite__grid--single' : ''}`}>
            {loading ? (
              <DealCardSkeleton count={8} />
            ) : filteredDeals.length > 0 ? (
              singleCardMode ? (
                <DealCard key={filteredDeals[0].id} deal={filteredDeals[0]} isLoot={dataSource === 'loot'} />
              ) : (
                filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} isLoot={dataSource === 'loot'} />
                ))
              )
            ) : (
              <div className="deals-favourite__empty">
                <p className="deals-favourite__empty-text">No deals found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default DealsFavouriteStores
