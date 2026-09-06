import React, { useState, useMemo } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { getBrandData } from '../data/brandDeals'
import type { BrandDeal, DealCategory, DealType } from '../data/brandDeals'
import './BrandPage.css'

interface BrandPageProps {
  brandSlug: string
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'discount-high', label: 'Highest Discount' },
  { value: 'expiry', label: 'Expiring Soon' },
  { value: 'newest', label: 'Newest First' },
]

const TYPE_FILTERS: { value: DealType | 'All'; label: string }[] = [
  { value: 'All', label: 'All Types' },
  { value: 'Deal', label: 'Deals' },
  { value: 'Coupon', label: 'Coupons' },
  { value: 'Cashback', label: 'Cashback' },
  { value: 'Offer', label: 'Offers' },
]

export const BrandPage: React.FC<BrandPageProps> = ({ brandSlug }) => {
  const brand = getBrandData(brandSlug)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<DealCategory | 'All'>('All')
  const [activeType, setActiveType] = useState<DealType | 'All'>('All')
  const [sortBy, setSortBy] = useState('popular')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).catch(() => { })
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredDeals = useMemo(() => {
    if (!brand) return []

    let deals = [...brand.deals]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      deals = deals.filter(
        d => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.code && d.code.toLowerCase().includes(q))
      )
    }

    // Category filter
    if (activeCategory !== 'All') {
      deals = deals.filter(d => d.category === activeCategory || d.category === 'All')
    }

    // Type filter
    if (activeType !== 'All') {
      deals = deals.filter(d => d.type === activeType)
    }

    // Sort
    switch (sortBy) {
      case 'discount-high':
        deals = deals.sort((a, b) => parseInt(b.discount) - parseInt(a.discount))
        break
      case 'expiry':
        deals = deals.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
        break
      case 'popular':
      default:
        deals = deals.sort((a, b) => b.usedCount - a.usedCount)
    }

    return deals
  }, [brand, searchQuery, activeCategory, activeType, sortBy])

  if (!brand) {
    return (
      <div id="app">
        <Navbar />
        <div className="brand-page__not-found">
          <h2>Brand not found</h2>
          <p>We couldn't find any deals for this brand.</p>
          <a href="/" className="brand-page__back-btn">← Back to Home</a>
        </div>
        <FooterSection />
      </div>
    )
  }

  return (
    <div id="app">
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="brand-hero">
        <div className="brand-hero__top-nav">
          <a href="/#popular-brands" className="brand-hero__back-btn">
            ← Back to Popular Brands
          </a>
        </div>
        <div className="brand-hero__inner">
          <div className="brand-hero__logo-wrap" style={brand.logoBgColor ? { background: brand.logoBgColor } : {}}>
            <img src={brand.logoSrc} alt={brand.name} className="brand-hero__logo" />
          </div>
          <div className="brand-hero__info">
            <h1 className="brand-hero__name">{brand.name}</h1>
            <p className="brand-hero__tagline">{brand.tagline}</p>
            <div className="brand-hero__reward-pill">
              <span className="reward-pill__icon">🎁</span>
              Up to <strong>{brand.rewardValue} {brand.rewardLabel}</strong> via Wouchify
            </div>
          </div>
          <div className="brand-hero__stats">
            <div className="brand-hero__stat">
              <span className="stat-num">{brand.deals.length}</span>
              <span className="stat-lbl">Live Deals</span>
            </div>
            <div className="brand-hero__stat">
              <span className="stat-num">{brand.rewardValue}</span>
              <span className="stat-lbl">Max {brand.rewardLabel}</span>
            </div>
            <div className="brand-hero__stat">
              <span className="stat-num">✓</span>
              <span className="stat-lbl">Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters & Search Bar ── */}
      <section className="brand-filters-bar">
        <div className="brand-filters-bar__inner">

          {/* Search */}
          <div className="brand-search">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder={`Search ${brand.name} deals, coupons...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Type Filter */}
          <div className="brand-filter-group">
            {TYPE_FILTERS.map(t => (
              <button
                key={t.value}
                className={`filter-chip ${activeType === t.value ? 'active' : ''}`}
                onClick={() => setActiveType(t.value as DealType | 'All')}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="brand-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="brand-category-tabs">
          {brand.categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Deals List ── */}
      <section className="brand-deals-section">
        <div className="brand-deals-section__inner">
          <div className="brand-deals__header">
            <h2>
              {filteredDeals.length > 0
                ? `${filteredDeals.length} ${activeCategory !== 'All' ? activeCategory + ' ' : ''}Deals & Coupons for ${brand.name}`
                : `No deals found`
              }
            </h2>
            {searchQuery && (
              <p className="brand-deals__search-hint">Results for "<strong>{searchQuery}</strong>"</p>
            )}
          </div>

          {filteredDeals.length === 0 ? (
            <div className="brand-deals__empty">
              <span>😕</span>
              <p>No deals match your filters. Try changing the search or category.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveType('All') }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="brand-deals-list">
              {filteredDeals.map(deal => (
                <DealListItem key={deal.id} deal={deal} brandName={brand.name} copiedId={copiedId} onCopy={handleCopy} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  )
}

// ── Deal List Item ────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  Deal: 'type-deal',
  Coupon: 'type-coupon',
  Cashback: 'type-cashback',
  Offer: 'type-offer',
}

interface DealListItemProps {
  deal: BrandDeal
  brandName: string
  copiedId: string | null
  onCopy: (code: string, id: string) => void
}

const DealListItem: React.FC<DealListItemProps> = ({ deal, brandName, copiedId, onCopy }) => {
  return (
    <div className="deal-list-item">
      {/* Left Strip: Discount & Type */}
      <div className="deal-list-item__left">
        <div className="deal-list-item__discount">{deal.discount}</div>
        <div className="deal-list-item__badges">
          <span className={`deal-type-badge ${TYPE_COLORS[deal.type]}`}>{deal.type}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="deal-list-item__main">
        <div className="deal-list-item__header">
          <h3 className="deal-list-item__title">{deal.title}</h3>
          {deal.isVerified && <span className="deal-verified-badge">✓ Verified</span>}
        </div>
        <p className="deal-list-item__desc">{deal.description}</p>
        <div className="deal-list-item__meta">
          <span className="deal-expiry">🕐 Expires: {deal.expiresAt}</span>
          <span className="deal-used">👥 {deal.usedCount.toLocaleString()} used</span>
        </div>
      </div>

      {/* Right Strip: Action Button */}
      <div className="deal-list-item__right">
        {deal.code ? (
          <button
            className={`deal-list-item__copy-btn ${copiedId === deal.id ? 'copied' : ''}`}
            onClick={() => onCopy(deal.code!, deal.id)}
          >
            {copiedId === deal.id ? (
              <><span>✓</span> Copied!</>
            ) : (
              <><span className="code-label">{deal.code}</span><span className="copy-icon">📋 Copy Code</span></>
            )}
          </button>
        ) : (
          <a
            href={`https://${brandName.toLowerCase()}.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="deal-list-item__get-btn"
          >
            Get Deal →
          </a>
        )}
      </div>
    </div>
  )
}

export default BrandPage
