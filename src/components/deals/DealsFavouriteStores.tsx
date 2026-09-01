import React, { useState, useMemo, useRef, useEffect } from 'react'
import { DealCard } from './DealCard'
import {
  DEALS_FILTER_CATEGORIES,
  DEALS_FAVOURITE_STORES,
  DEALS_CARD_ITEMS,
} from '../../data/dealsPage'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './DealsFavouriteStores.css'

export const DealsFavouriteStores: React.FC = () => {
  const scale = useDesktopScale()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(1100)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('Stores')

  const filteredDeals = useMemo(() => {
    return DEALS_CARD_ITEMS.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.store.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter =
        !selectedFilter ||
        selectedFilter === 'Stores' ||
        selectedFilter === 'Products' ||
        item.category.toLowerCase() === selectedFilter.toLowerCase()

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, selectedFilter])

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
      aria-label="Deals from Favourite Stores"
      style={{ height: `${canvasHeight * scale}px` }}
    >
      <div className="deals-favourite-canvas" ref={canvasRef}>
        {/* Controls row: Heading with blue accent + Search Deals field (pushed right) */}
        <div className="deals-favourite__controls">
          <div className="deals-favourite__heading-group">
            <div className="deals-favourite__heading-accent" aria-hidden="true" />
            <h2 className="deals-favourite__heading">Deals from Favourite Stores</h2>
          </div>

          <div className="deals-favourite__search-box">
            <input
              type="text"
              className="deals-favourite__search-input"
              placeholder="Search Deals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Deals"
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

        {/* Filter Categories Pill Row: Exact Figma Compact Geometry & Alternating Colors */}
        <div className="deals-favourite__filter-row" role="toolbar" aria-label="Deal categories">
          {DEALS_FILTER_CATEGORIES.map((cat, index) => {
            const isPeach = index % 2 === 1 // Alternating: Products(lavender), Stores(peach), Brands(lavender), Festivals(peach)...

            return (
              <button
                key={cat}
                type="button"
                className={`deals-favourite__filter-pill ${isPeach ? 'deals-favourite__filter-pill--peach' : 'deals-favourite__filter-pill--lavender'}`}
                onClick={() => setSelectedFilter(cat)}
                aria-label={`Filter by ${cat}`}
                aria-pressed={selectedFilter === cat}
              >
                <span className="deals-favourite__filter-label">{cat}</span>
                <svg
                  className="deals-favourite__filter-chevron"
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
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

        {/* Deal Cards Grid */}
        <div className="deals-favourite__grid">
          {filteredDeals.length > 0 ? (
            filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))
          ) : (
            <div className="deals-favourite__empty">
              <p className="deals-favourite__empty-text">No deals found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DealsFavouriteStores
