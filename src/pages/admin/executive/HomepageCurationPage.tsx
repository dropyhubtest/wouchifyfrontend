import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { ManagerLayout } from '../manager/ManagerLayout'
import { adminApi } from '../../../services/adminApi'
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Crown, 
  Store as StoreIcon, 
  Tag, 
  CreditCard as CreditCardIcon, 
  Megaphone, 
  Search, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Filter
} from 'lucide-react'
import { getStoreLogo, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { 
  filterRecentlyAddedDeals, 
  filterTrendingDeals, 
  filterFlashLootDeals, 
  filterExclusiveLootDeals, 
  filterPopularBrands, 
  filterTopStores, 
  filterHomepageAdvertisements, 
  filterFeaturedCreditCards 
} from '../../../utils/homepageSectionFilters'
import './HomepageCurationPage.css'

export type HomepageSectionKey = 
  | 'recent_deals' 
  | 'trending_deals' 
  | 'flash_loot' 
  | 'exclusive_loot' 
  | 'top_stores' 
  | 'popular_brands' 
  | 'banners' 
  | 'credit_cards'

interface SectionConfig {
  key: HomepageSectionKey
  title: string
  subtitle: string
  icon: React.ReactNode
  entityType: 'deal' | 'loot' | 'store' | 'brand' | 'ad' | 'card'
  accentColor: string
  badgeBg: string
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: 'recent_deals',
    title: 'Recently Added Deals',
    subtitle: 'High-value recent product discounts shown at the top of the homepage',
    icon: <Sparkles size={20} />,
    entityType: 'deal',
    accentColor: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.1)'
  },
  {
    key: 'trending_deals',
    title: 'Trending Best Sellers',
    subtitle: 'Hot viral discounts & popular best-selling deals with high click-through rates',
    icon: <Flame size={20} />,
    entityType: 'deal',
    accentColor: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.1)'
  },
  {
    key: 'flash_loot',
    title: 'Flash Loot Deals',
    subtitle: 'Time-limited flash drop deals with live countdown tickers',
    icon: <Zap size={20} />,
    entityType: 'loot',
    accentColor: '#eab308',
    badgeBg: 'rgba(234, 179, 8, 0.1)'
  },
  {
    key: 'exclusive_loot',
    title: 'Exclusive Loot Deals',
    subtitle: 'Wouchify exclusive steal prices, price glitches, and 80%+ discount loot',
    icon: <Crown size={20} />,
    entityType: 'loot',
    accentColor: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.1)'
  },
  {
    key: 'top_stores',
    title: 'Shop by Top Stores',
    subtitle: 'Prominent merchant partner store hubs on the homepage store carousel',
    icon: <StoreIcon size={20} />,
    entityType: 'store',
    accentColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.1)'
  },
  {
    key: 'popular_brands',
    title: 'Most Popular Brands',
    subtitle: 'Top trending electronics, fashion, and lifestyle brands catalog',
    icon: <Tag size={20} />,
    entityType: 'brand',
    accentColor: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.1)'
  },
  {
    key: 'banners',
    title: 'Homepage Banners (1713x685)',
    subtitle: 'Hero promotional banners, brand sponsorships, and full-width display ads',
    icon: <Megaphone size={20} />,
    entityType: 'ad',
    accentColor: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.1)'
  },
  {
    key: 'credit_cards',
    title: 'Featured Credit Cards',
    subtitle: 'High-cashback credit card cards & financial rewards highlighted on the homepage',
    icon: <CreditCardIcon size={20} />,
    entityType: 'card',
    accentColor: '#6366f1',
    badgeBg: 'rgba(99, 102, 241, 0.1)'
  }
]

export const HomepageCurationPage: React.FC = () => {
  const isManagerPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/manager')
  
  const [activeSection, setActiveSection] = useState<HomepageSectionKey>('recent_deals')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterView, setFilterView] = useState<'all' | 'active_only' | 'inactive_only'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Datasets
  const [deals, setDeals] = useState<any[]>([])
  const [lootDeals, setLootDeals] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [creditCards, setCreditCards] = useState<any[]>([])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [dealsRes, lootRes, storesRes, adsRes, cardsRes] = await Promise.all([
        adminApi.getDeals({ all: true }).catch(() => []),
        adminApi.getLootDeals({ all: true }).catch(() => []),
        adminApi.getStores({ all: true }).catch(() => []),
        adminApi.getAdvertisements({ all: true }).catch(() => []),
        adminApi.getCreditCards({ all: true }).catch(() => [])
      ])

      setDeals(Array.isArray(dealsRes) ? dealsRes : [])
      setLootDeals(Array.isArray(lootRes) ? lootRes : [])
      setStores(Array.isArray(storesRes) ? storesRes : [])
      setAds(Array.isArray(adsRes) ? adsRes : [])
      setCreditCards(Array.isArray(cardsRes) ? cardsRes : [])
    } catch (err) {
      console.warn('Failed to load curation data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // Section calculation helpers
  const activeRecentDeals = useMemo(() => filterRecentlyAddedDeals(deals), [deals])
  const activeTrendingDeals = useMemo(() => filterTrendingDeals(deals), [deals])
  const activeFlashLoot = useMemo(() => filterFlashLootDeals(lootDeals), [lootDeals])
  const activeExclusiveLoot = useMemo(() => filterExclusiveLootDeals(lootDeals), [lootDeals])
  const activeTopStores = useMemo(() => filterTopStores(stores), [stores])
  const activePopularBrands = useMemo(() => filterPopularBrands(stores), [stores])
  const activeBanners = useMemo(() => filterHomepageAdvertisements(ads), [ads])
  const activeCreditCards = useMemo(() => filterFeaturedCreditCards(creditCards), [creditCards])

  // Count helper
  const getSectionCounts = (key: HomepageSectionKey) => {
    switch (key) {
      case 'recent_deals':
        return { active: activeRecentDeals.length, total: deals.length }
      case 'trending_deals':
        return { active: activeTrendingDeals.length, total: deals.length }
      case 'flash_loot':
        return { active: activeFlashLoot.length, total: lootDeals.length }
      case 'exclusive_loot':
        return { active: activeExclusiveLoot.length, total: lootDeals.length }
      case 'top_stores':
        return { active: activeTopStores.length, total: stores.length }
      case 'popular_brands':
        return { active: activePopularBrands.length, total: stores.length }
      case 'banners':
        return { active: activeBanners.length, total: ads.length }
      case 'credit_cards':
        return { active: activeCreditCards.length, total: creditCards.length }
    }
  }

  // Update Placement Handlers
  const handleDealPlacementChange = async (id: string, newPlacement: string) => {
    const isBest = newPlacement === 'trending_deals' || newPlacement === 'both'
    const showHome = newPlacement !== 'none'

    setDeals(prev => prev.map(d => {
      if (d.id === id || d._id === id) {
        return {
          ...d,
          sectionPlacement: newPlacement,
          showOnHome: showHome,
          isBestSelling: isBest
        }
      }
      return d
    }))

    try {
      await adminApi.updateDeal(id, {
        sectionPlacement: newPlacement,
        showOnHome: showHome,
        isBestSelling: isBest
      })
      showToast('Deal section placement updated')
    } catch (err: any) {
      showToast(err?.message || 'Failed to update deal placement')
    }
  }

  const handleLootPlacementChange = async (id: string, newPlacement: string) => {
    const isExclusive = newPlacement === 'exclusive_loot'
    const showHome = newPlacement !== 'none'
    const lootType = newPlacement === 'exclusive_loot' ? 'exclusive' : 'flash'

    setLootDeals(prev => prev.map(d => {
      if (d.id === id || d._id === id) {
        return {
          ...d,
          sectionPlacement: newPlacement,
          showOnHome: showHome,
          isExclusive,
          dealType: lootType
        }
      }
      return d
    }))

    try {
      await adminApi.updateLootDeal(id, {
        sectionPlacement: newPlacement,
        showOnHome: showHome,
        isExclusive,
        dealType: lootType
      })
      showToast('Loot deal section placement updated')
    } catch (err: any) {
      showToast(err?.message || 'Failed to update loot placement')
    }
  }

  const handleStorePlacementChange = async (id: string, showHome: boolean) => {
    setStores(prev => prev.map(s => {
      if (s.id === id || s._id === id) {
        return {
          ...s,
          showOnHome: showHome,
          sectionPlacement: showHome ? 'home' : 'none'
        }
      }
      return s
    }))

    try {
      await adminApi.updateStore(id, {
        showOnHome: showHome,
        sectionPlacement: showHome ? 'home' : 'none'
      })
      showToast(showHome ? 'Store visible on homepage' : 'Store hidden from homepage')
    } catch (err: any) {
      showToast(err?.message || 'Failed to update store visibility')
    }
  }

  const handleCardPlacementChange = async (id: string, isFeatured: boolean) => {
    setCreditCards(prev => prev.map(c => {
      if (c.id === id || c._id === id) {
        return {
          ...c,
          showOnHome: isFeatured,
          isFeatured: isFeatured
        }
      }
      return c
    }))

    try {
      await adminApi.updateCreditCard(id, {
        showOnHome: isFeatured,
        isFeatured: isFeatured
      })
      showToast(isFeatured ? 'Card featured on homepage' : 'Card removed from homepage')
    } catch (err: any) {
      showToast(err?.message || 'Failed to update card feature status')
    }
  }

  const handleAdPlacementChange = async (id: string, placement: string) => {
    setAds(prev => prev.map(a => {
      if (a.id === id || a._id === id) {
        return {
          ...a,
          placement,
          status: placement !== 'none' ? 'active' : 'inactive'
        }
      }
      return a
    }))

    try {
      await adminApi.updateAdvertisement(id, {
        placement,
        status: placement !== 'none' ? 'active' : 'inactive'
      })
      showToast('Banner placement updated')
    } catch (err: any) {
      showToast(err?.message || 'Failed to update advertisement')
    }
  }

  const currentConfig = SECTION_CONFIGS.find(c => c.key === activeSection) || SECTION_CONFIGS[0]

  // Filter current section list based on search and active view
  const currentSectionItems = useMemo(() => {
    let rawItems: any[] = []
    let isActiveCheck: (item: any) => boolean = () => true

    if (activeSection === 'recent_deals') {
      rawItems = deals
      isActiveCheck = (d) => activeRecentDeals.some(x => (x.id || x._id) === (d.id || d._id))
    } else if (activeSection === 'trending_deals') {
      rawItems = deals
      isActiveCheck = (d) => activeTrendingDeals.some(x => (x.id || x._id) === (d.id || d._id))
    } else if (activeSection === 'flash_loot') {
      rawItems = lootDeals
      isActiveCheck = (d) => activeFlashLoot.some(x => (x.id || x._id) === (d.id || d._id))
    } else if (activeSection === 'exclusive_loot') {
      rawItems = lootDeals
      isActiveCheck = (d) => activeExclusiveLoot.some(x => (x.id || x._id) === (d.id || d._id))
    } else if (activeSection === 'top_stores') {
      rawItems = stores
      isActiveCheck = (s) => activeTopStores.some(x => (x.id || x._id) === (s.id || s._id))
    } else if (activeSection === 'popular_brands') {
      rawItems = stores
      isActiveCheck = (s) => activePopularBrands.some(x => (x.id || x._id) === (s.id || s._id))
    } else if (activeSection === 'banners') {
      rawItems = ads
      isActiveCheck = (a) => activeBanners.some(x => (x.id || x._id) === (a.id || a._id))
    } else if (activeSection === 'credit_cards') {
      rawItems = creditCards
      isActiveCheck = (c) => activeCreditCards.some(x => (x.id || x._id) === (c.id || c._id))
    }

    const sorted = [...rawItems].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime()
      if (timeA && timeB && timeA !== timeB) {
        return timeB - timeA
      }
      const idA = String(a.id || a._id || '')
      const idB = String(b.id || b._id || '')
      return idB.localeCompare(idA)
    })

    return sorted
      .map(item => ({ ...item, _isActiveInThisSection: isActiveCheck(item) }))
      .filter(item => {
        if (filterView === 'active_only' && !item._isActiveInThisSection) return false
        if (filterView === 'inactive_only' && item._isActiveInThisSection) return false
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const name = (item.title || item.name || item.cardName || item.store || item.storeName || item.advertiser || '').toLowerCase()
          const category = (item.category || item.tag || item.bank || '').toLowerCase()
          return name.includes(q) || category.includes(q)
        }
        return true
      })
  }, [
    activeSection, 
    deals, 
    lootDeals, 
    stores, 
    ads, 
    creditCards, 
    activeRecentDeals, 
    activeTrendingDeals, 
    activeFlashLoot, 
    activeExclusiveLoot, 
    activeTopStores, 
    activePopularBrands, 
    activeBanners, 
    activeCreditCards, 
    filterView, 
    searchQuery
  ])

  const content = (
    <div className="homepage-curation-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="curation-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="curation-header">
        <div className="curation-header-left">
          <div className="curation-badge">
            <Layers size={14} />
            <span>Storefront Layout Manager</span>
          </div>
          <h1 className="curation-title">Homepage Sections Curation</h1>
          <p className="curation-desc">
            Directly control and curate specific deals, loot offers, merchant stores, banners, and credit cards displayed in each of the 8 dedicated sections on the Wouchify Homepage.
          </p>
        </div>
        <div className="curation-header-right">
          <button className="curation-refresh-btn" onClick={loadAllData} disabled={loading} title="Sync Live Data">
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            <span>{loading ? 'Syncing...' : 'Sync Catalog'}</span>
          </button>
        </div>
      </div>

      {/* Section Selection Carousel / Grid */}
      <div className="curation-section-tabs">
        {SECTION_CONFIGS.map(sec => {
          const isSelected = activeSection === sec.key
          const counts = getSectionCounts(sec.key)
          return (
            <button
              key={sec.key}
              className={`curation-tab-card ${isSelected ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(sec.key)
                setSearchQuery('')
              }}
              style={{
                borderColor: isSelected ? sec.accentColor : 'transparent',
                '--tab-accent': sec.accentColor
              } as React.CSSProperties}
            >
              <div className="tab-icon-row">
                <div className="tab-icon" style={{ color: sec.accentColor, backgroundColor: sec.badgeBg }}>
                  {sec.icon}
                </div>
                <div className="tab-live-badge">
                  <span className="live-dot" style={{ backgroundColor: counts.active > 0 ? '#10b981' : '#94a3b8' }}></span>
                  <span>{counts.active} Active</span>
                </div>
              </div>
              <div className="tab-title">{sec.title}</div>
              <div className="tab-stats">
                <span>{counts.total} in Catalog</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Section Workspace */}
      <div className="curation-workspace">
        <div className="workspace-header">
          <div className="workspace-header-title-wrap">
            <div className="workspace-sec-icon" style={{ color: currentConfig.accentColor, backgroundColor: currentConfig.badgeBg }}>
              {currentConfig.icon}
            </div>
            <div>
              <h2 className="workspace-title">{currentConfig.title}</h2>
              <p className="workspace-subtitle">{currentConfig.subtitle}</p>
            </div>
          </div>

          <div className="workspace-controls">
            {/* Search Filter */}
            <div className="curation-search-wrap">
              <Search size={16} className="search-icon" />
              <input 
                type="text"
                placeholder={`Search ${currentConfig.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="curation-search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Filter Switch */}
            <div className="curation-filter-pills">
              <button 
                className={`filter-pill ${filterView === 'all' ? 'active' : ''}`}
                onClick={() => setFilterView('all')}
              >
                All ({currentSectionItems.length})
              </button>
              <button 
                className={`filter-pill ${filterView === 'active_only' ? 'active' : ''}`}
                onClick={() => setFilterView('active_only')}
              >
                Active on Home
              </button>
              <button 
                className={`filter-pill ${filterView === 'inactive_only' ? 'active' : ''}`}
                onClick={() => setFilterView('inactive_only')}
              >
                Hidden
              </button>
            </div>
          </div>
        </div>

        {/* Section Entity Grid */}
        <div className="curation-items-grid">
          {loading ? (
            <div className="curation-loading-state">
              <RefreshCw size={28} className="spinning" color="#3b82f6" />
              <p>Loading {currentConfig.title} items...</p>
            </div>
          ) : currentSectionItems.length === 0 ? (
            <div className="curation-empty-state">
              <Filter size={36} color="#94a3b8" />
              <h3>No items found</h3>
              <p>Try searching for a different keyword or toggle the filter view.</p>
            </div>
          ) : (
            currentSectionItems.map(item => {
              const itemId = item.id || item._id
              const itemTitle = item.title || item.name || item.cardName || item.advertiser || 'Item'
              const itemStore = item.store || item.storeName || item.bank || item.advertiser || 'Wouchify'
              const itemCategory = item.category || item.tier || 'General'
              const isActive = item._isActiveInThisSection
              const logoUrl = getStoreLogo(itemStore)

              return (
                <div 
                  key={itemId} 
                  className={`curation-card ${isActive ? 'active-item' : 'inactive-item'}`}
                  style={{ '--card-accent': currentConfig.accentColor } as React.CSSProperties}
                >
                  {/* Card Status Indicator */}
                  <div className="card-top-bar">
                    <div className="card-store-info">
                      <img 
                        src={logoUrl || PLACEHOLDER_STORE_LOGO} 
                        alt={itemStore} 
                        className="card-store-logo" 
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                      />
                      <span className="card-store-name">{itemStore}</span>
                      <span className="card-category-tag">{itemCategory}</span>
                    </div>

                    <div className={`card-status-badge ${isActive ? 'live' : 'hidden'}`}>
                      {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{isActive ? 'Active on Homepage' : 'Hidden'}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-body">
                    <h4 className="card-title" title={itemTitle}>{itemTitle}</h4>

                    <div className="card-meta-row">
                      {item.price && (
                        <div className="card-price-wrap">
                          <span className="card-curr-price">₹{item.price}</span>
                          {item.originalPrice && <span className="card-orig-price">₹{item.originalPrice}</span>}
                          {item.discount && <span className="card-disc-tag">{item.discount}</span>}
                        </div>
                      )}

                      {item.clicks !== undefined && (
                        <div className="card-clicks-tag">
                          <span>{item.clicks || 0} clicks</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Placement Selector */}
                  <div className="card-placement-footer">
                    <span className="placement-label">Section Placement:</span>

                    {/* Deals Placement Controls */}
                    {(activeSection === 'recent_deals' || activeSection === 'trending_deals') && (
                      <select
                        className="placement-select"
                        value={
                          item.showOnHome === false || item.sectionPlacement === 'none'
                            ? 'none'
                            : item.sectionPlacement === 'recent_deals' || item.sectionPlacement === 'recently_added'
                            ? 'recent_deals'
                            : item.sectionPlacement === 'trending_deals' || item.sectionPlacement === 'best_selling' || item.sectionPlacement === 'trending'
                            ? 'trending_deals'
                            : 'both'
                        }
                        onChange={(e) => handleDealPlacementChange(itemId, e.target.value)}
                      >
                        <option value="both">🌟 Both Sections (Recent & Trending)</option>
                        <option value="recent_deals">✨ Recently Added Deals Only</option>
                        <option value="trending_deals">🔥 Trending Best Sellers Only</option>
                        <option value="none">🚫 Hide from Homepage</option>
                      </select>
                    )}

                    {/* Loot Deals Placement Controls */}
                    {(activeSection === 'flash_loot' || activeSection === 'exclusive_loot') && (
                      <select
                        className="placement-select"
                        value={
                          item.showOnHome === false || item.sectionPlacement === 'none'
                            ? 'none'
                            : item.sectionPlacement === 'flash_loot' || item.sectionPlacement === 'flash'
                            ? 'flash_loot'
                            : item.sectionPlacement === 'exclusive_loot' || item.sectionPlacement === 'exclusive' || item.isExclusive
                            ? 'exclusive_loot'
                            : 'both'
                        }
                        onChange={(e) => handleLootPlacementChange(itemId, e.target.value)}
                      >
                        <option value="both">⚡ Both Loot Sections</option>
                        <option value="flash_loot">⚡ Flash Loot Deals Only</option>
                        <option value="exclusive_loot">💎 Exclusive Loot Deals Only</option>
                        <option value="none">🚫 Hide from Homepage</option>
                      </select>
                    )}

                    {/* Stores & Brands Placement Controls */}
                    {(activeSection === 'top_stores' || activeSection === 'popular_brands') && (
                      <div className="placement-toggle-row">
                        <button
                          className={`toggle-btn ${item.showOnHome !== false ? 'btn-active' : ''}`}
                          onClick={() => handleStorePlacementChange(itemId, true)}
                        >
                          <Check size={14} /> Show on Homepage
                        </button>
                        <button
                          className={`toggle-btn ${item.showOnHome === false ? 'btn-inactive' : ''}`}
                          onClick={() => handleStorePlacementChange(itemId, false)}
                        >
                          <X size={14} /> Hide
                        </button>
                      </div>
                    )}

                    {/* Credit Cards Placement Controls */}
                    {activeSection === 'credit_cards' && (
                      <div className="placement-toggle-row">
                        <button
                          className={`toggle-btn ${item.showOnHome !== false && item.isFeatured !== false ? 'btn-active' : ''}`}
                          onClick={() => handleCardPlacementChange(itemId, true)}
                        >
                          <Check size={14} /> Feature on Homepage
                        </button>
                        <button
                          className={`toggle-btn ${item.showOnHome === false || item.isFeatured === false ? 'btn-inactive' : ''}`}
                          onClick={() => handleCardPlacementChange(itemId, false)}
                        >
                          <X size={14} /> Hide
                        </button>
                      </div>
                    )}

                    {/* Advertisements Placement Controls */}
                    {activeSection === 'banners' && (
                      <select
                        className="placement-select"
                        value={item.placement || 'homepage-banner-1713x685'}
                        onChange={(e) => handleAdPlacementChange(itemId, e.target.value)}
                      >
                        <option value="homepage-banner-1713x685">🖼️ Homepage Banner (1713x685)</option>
                        <option value="deals-sidebar">Deals Sidebar Banner</option>
                        <option value="coupons-header">Coupons Header Banner</option>
                        <option value="none">🚫 Inactive / Hidden</option>
                      </select>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )

  if (isManagerPath) {
    return <ManagerLayout activeMenu="homepage-curation">{content}</ManagerLayout>
  }

  return <ExecutiveLayout activeMenu="homepage-curation">{content}</ExecutiveLayout>
}

export default HomepageCurationPage
