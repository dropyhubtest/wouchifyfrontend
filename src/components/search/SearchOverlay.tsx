import React, { useState, useEffect, useRef } from 'react'
import './SearchOverlay.css'

/* ---- Mock search data ---- */
const SEARCH_DATA = [
  { type: 'deal',  label: 'iPhone 15 — 10% Cashback',           href: '/deals',       tag: 'Deal',     store: 'Amazon' },
  { type: 'deal',  label: 'Samsung Galaxy S24 — 8% Cashback',    href: '/deals',       tag: 'Deal',     store: 'Flipkart' },
  { type: 'deal',  label: 'Apple MacBook Air M2 — 12% Off',      href: '/deals',       tag: 'Deal',     store: 'Amazon' },
  { type: 'deal',  label: 'boAt Airdopes 141 v2 — ₹50 Back',    href: '/loot-deals',  tag: 'Loot',     store: 'Flipkart' },
  { type: 'deal',  label: 'Sony WH-1000XM5 Headphones',          href: '/deals',       tag: 'Deal',     store: 'Croma' },
  { type: 'store', label: 'Amazon India',                         href: '/stores',      tag: 'Store',    store: '' },
  { type: 'store', label: 'Myntra Fashion Store',                 href: '/stores',      tag: 'Store',    store: '' },
  { type: 'store', label: 'Flipkart',                             href: '/stores',      tag: 'Store',    store: '' },
  { type: 'store', label: 'Nykaa Beauty',                         href: '/stores',      tag: 'Store',    store: '' },
  { type: 'store', label: 'Ajio Fashion',                         href: '/stores',      tag: 'Store',    store: '' },
  { type: 'coupon',label: 'Myntra FLAT50 — 50% Off Coupon',      href: '/coupons',     tag: 'Coupon',   store: 'Myntra' },
  { type: 'coupon',label: 'Zomato TRYNEW — ₹100 off First Order',href: '/coupons',     tag: 'Coupon',   store: 'Zomato' },
  { type: 'coupon',label: 'Amazon SAVE10 — Extra 10% Off',       href: '/coupons',     tag: 'Coupon',   store: 'Amazon' },
  { type: 'deal',  label: 'Swiggy Instamart — Free Delivery',    href: '/deals',       tag: 'Deal',     store: 'Swiggy' },
  { type: 'deal',  label: 'Bigbasket Weekend Sale',               href: '/deals',       tag: 'Deal',     store: 'Bigbasket' },
  { type: 'deal',  label: 'Meesho Mega Fashion Sale — 70% Off',  href: '/deals',       tag: 'Deal',     store: 'Meesho' },
  { type: 'deal',  label: 'Zomato Gold Membership — 30% Off',    href: '/deals',       tag: 'Deal',     store: 'Zomato' },
]

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Deal:   { color: '#1e40af', bg: '#eff6ff' },
  Loot:   { color: '#7c3aed', bg: '#f5f3ff' },
  Store:  { color: '#065f46', bg: '#ecfdf5' },
  Coupon: { color: '#c2410c', bg: '#fff7ed' },
}

const TRENDING = [
  { label: 'iPhone 15 deals',        href: '/deals' },
  { label: 'Myntra sale coupons',    href: '/coupons' },
  { label: 'Flipkart Big Billion',   href: '/deals' },
  { label: 'Zomato discount codes',  href: '/coupons' },
  { label: 'Amazon Great Sale',      href: '/deals' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  headerScale?: number
}

export const SearchOverlay: React.FC<Props> = ({ isOpen, onClose, headerScale = 1 }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length > 0
    ? SEARCH_DATA.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.store.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/deals?search=${encodeURIComponent(query.trim())}`
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="search-overlay__backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div 
        className="search-overlay__panel" 
        role="search" 
        aria-label="Site Search"
        style={{ '--header-height': `${131 * headerScale}px` } as React.CSSProperties}
      >
        <div className="search-overlay__inner">
          <div className="search-overlay__header">
            {/* Search bar */}
            <form className="search-overlay__form" onSubmit={handleSubmit}>
            <span className="search-overlay__icon" aria-hidden="true">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className="search-overlay__input"
              type="text"
              placeholder="Search deals, stores, coupons..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="search-overlay__clear"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button type="submit" className="search-overlay__submit">
              Search
            </button>
          </form>
          <button type="button" className="search-overlay__close-panel" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>

          {/* Live Results */}
          {results.length > 0 && (
            <div className="search-overlay__results">
              <p className="search-overlay__results-label">Results for "{query}"</p>
              <ul className="search-overlay__results-list">
                {results.map((item, i) => {
                  const tc = TAG_COLORS[item.tag] || TAG_COLORS.Deal
                  return (
                    <li key={i}>
                      <a className="search-overlay__result-item" href={item.href} onClick={onClose}>
                        <span className="search-overlay__result-tag" style={{ color: tc.color, background: tc.bg }}>
                          {item.tag}
                        </span>
                        <span className="search-overlay__result-label">{item.label}</span>
                        {item.store && <span className="search-overlay__result-store">{item.store}</span>}
                        <span className="search-overlay__result-arrow">→</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* No results */}
          {query.trim().length > 1 && results.length === 0 && (
            <div className="search-overlay__empty">
              <span style={{ fontSize: 32 }}>🔍</span>
              <p>No results for <strong>"{query}"</strong></p>
              <a className="search-overlay__browse-btn" href="/deals" onClick={onClose}>Browse All Deals</a>
            </div>
          )}

          {/* Trending (shown when no query) */}
          {!query && (
            <div className="search-overlay__trending">
              <p className="search-overlay__trending-label">🔥 Trending Searches</p>
              <div className="search-overlay__trending-pills">
                {TRENDING.map(t => (
                  <a key={t.label} href={t.href} className="search-overlay__trending-pill" onClick={onClose}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchOverlay
