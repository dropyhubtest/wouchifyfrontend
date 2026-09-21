import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import { SUBCATEGORIES_DATA } from '../../../data/subcategoriesData'
import { STORES_DIRECTORY_DATA, TRENDING_STORES } from '../../../data/storesDirectoryData'
import { BRANDS_DIRECTORY_DATA, TRENDING_BRANDS } from '../../../data/brandsDirectoryData'
import { BANKS_DIRECTORY_DATA, TRENDING_BANKS } from '../../../data/banksDirectoryData'
import { FESTIVALS_DIRECTORY_DATA, TRENDING_FESTIVALS } from '../../../data/festivalsDirectoryData'
import { TRAVELLING_DIRECTORY_DATA, TRENDING_TRAVELLING } from '../../../data/travellingDirectoryData'
import { CITIES_DEALS_DIRECTORY_DATA, TRENDING_CITIES } from '../../../data/citiesDealsDirectoryData'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Layers,
  FolderTree,
  Tag,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  ExternalLink,
  ChevronRight,
  Eye,
  Store,
  Zap,
  Flame,
  Ticket,
  Plane,
  MapPin,
  Calendar,
  CreditCard,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react'
import './ExecutiveShared.css'
import './ExecutiveCategoriesPage.css'

export type DirectoryPillar =
  | 'all'
  | 'subcategories'
  | 'stores'
  | 'brands'
  | 'banks'
  | 'festivals'
  | 'travelling'
  | 'cities-deals'

export interface TaxonomyItem {
  id: string
  name: string
  slug: string
  letter: string
  pillar: DirectoryPillar
  pillarLabel: string
  pillarColor: string
  logo?: string
  image?: string
  href: string
  description?: string
  status: 'active' | 'inactive' | 'featured'
  parentCategory?: string
  isTrending?: boolean
}

export const ExecutiveCategoriesPage: React.FC = () => {
  const [activePillar, setActivePillar] = useState<DirectoryPillar>('all')
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [rawLoots, setRawLoots] = useState<any[]>([])
  const [rawCoupons, setRawCoupons] = useState<any[]>([])
  const [rawStores, setRawStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [letterFilter, setLetterFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Deep Inspection Drawer State
  const [inspectedItem, setInspectedItem] = useState<TaxonomyItem | null>(null)
  const [drawerTab, setDrawerTab] = useState<'all' | 'deals' | 'loot' | 'coupons' | 'stores'>('all')
  const [drawerSearch, setDrawerSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TaxonomyItem | null>(null)

  // Notification / Toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [formData, setFormData] = useState<{
    name: string
    slug: string
    pillar: DirectoryPillar
    description: string
    status: 'active' | 'inactive' | 'featured'
    logo: string
    href: string
  }>({
    name: '',
    slug: '',
    pillar: 'subcategories',
    description: '',
    status: 'active',
    logo: '',
    href: ''
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [catsRes, dealsRes, lootsRes, couponsRes, storesRes] = await Promise.all([
        adminApi.getCategories().catch(() => []),
        adminApi.getDeals().catch(() => []),
        adminApi.getLootDeals().catch(() => []),
        adminApi.getCoupons().catch(() => []),
        adminApi.getStores().catch(() => [])
      ])

      setDbCategories(Array.isArray(catsRes) ? catsRes : [])
      setRawDeals(Array.isArray(dealsRes) ? dealsRes : [])
      setRawLoots(Array.isArray(lootsRes) ? lootsRes : [])
      setRawCoupons(Array.isArray(couponsRes) ? couponsRes : [])
      setRawStores(Array.isArray(storesRes) ? storesRes : [])
    } catch (err) {
      console.warn('Failed to load categories inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()

    const handleUpdate = () => {
      loadAllData()
    }
    window.addEventListener('wouchify_categories_updated', handleUpdate)
    window.addEventListener('wouchify_deals_updated', handleUpdate)
    window.addEventListener('wouchify_loot_deals_updated', handleUpdate)
    window.addEventListener('wouchify_coupons_updated', handleUpdate)
    window.addEventListener('wouchify_stores_updated', handleUpdate)
    return () => {
      window.removeEventListener('wouchify_categories_updated', handleUpdate)
      window.removeEventListener('wouchify_deals_updated', handleUpdate)
      window.removeEventListener('wouchify_loot_deals_updated', handleUpdate)
      window.removeEventListener('wouchify_coupons_updated', handleUpdate)
      window.removeEventListener('wouchify_stores_updated', handleUpdate)
    }
  }, [])

  // Build the complete 7-pillar taxonomy catalog
  const allTaxonomyItems = useMemo<TaxonomyItem[]>(() => {
    const list: TaxonomyItem[] = []

    // 1. Subcategories (114+ catalog subcategories & parent categories)
    SUBCATEGORIES_DATA.forEach((s) => {
      list.push({
        id: `subcat-${s.id}`,
        name: s.name,
        slug: s.slug,
        letter: (s.letter || s.name.charAt(0)).toUpperCase(),
        pillar: 'subcategories',
        pillarLabel: 'Catalog Subcategory',
        pillarColor: '#4DABF7',
        logo: s.image,
        href: `/categories/${s.slug}`,
        description: `Explore trending ${s.name} discounts, verified promo codes, and merchant cashbacks.`,
        status: s.active ? 'active' : 'inactive',
        isTrending: s.sortOrder <= 6
      })
    })

    // Include DB dynamic categories if any
    dbCategories.forEach((c) => {
      if (!list.some((it) => it.slug.toLowerCase() === (c.slug || '').toLowerCase())) {
        list.push({
          id: `dbcat-${c.id || c._id || c.slug}`,
          name: c.name,
          slug: c.slug,
          letter: (c.name?.charAt(0) || 'A').toUpperCase(),
          pillar: 'subcategories',
          pillarLabel: 'Custom Category',
          pillarColor: c.color || '#2F368C',
          href: `/categories/${c.slug}`,
          description: c.description || `Catalog category: ${c.name}`,
          status: (c.status || 'active').toLowerCase() as any
        })
      }
    })

    // 2. Stores Directory (61 stores)
    STORES_DIRECTORY_DATA.forEach((s) => {
      const isAmazon = s.slug === 'amazon' || s.name.toLowerCase() === 'amazon'
      list.push({
        id: `store-${s.id}`,
        name: s.name,
        slug: s.slug,
        letter: (s.letter || s.name.charAt(0)).toUpperCase(),
        pillar: 'stores',
        pillarLabel: 'Store Directory',
        pillarColor: '#FF6B6B',
        logo: s.logo,
        href: isAmazon ? '/brands/amazon' : (s.destinationHref || `/stores#${s.slug}`),
        description: `Official store offers, cashback rates, and coupons for ${s.name}.`,
        status: s.active ? 'active' : 'inactive',
        isTrending: TRENDING_STORES.some((t) => t.slug === s.slug)
      })
    })

    // 3. Brands Directory (88 brands)
    BRANDS_DIRECTORY_DATA.forEach((b) => {
      const isAmazon = b.slug === 'amazon' || b.name.toLowerCase() === 'amazon'
      list.push({
        id: `brand-${b.id}`,
        name: b.name,
        slug: b.slug,
        letter: (b.letter || b.name.charAt(0)).toUpperCase(),
        pillar: 'brands',
        pillarLabel: 'Brand Partner',
        pillarColor: '#9C36B5',
        logo: b.logo,
        href: isAmazon ? '/brands/amazon' : (b.destinationHref || `/categories/brands#${b.slug}`),
        description: `Top brand collection, seasonal discounts, and deals for ${b.name}.`,
        status: b.active ? 'active' : 'inactive',
        isTrending: TRENDING_BRANDS.some((t) => t.slug === b.slug)
      })
    })

    // 4. Banks & Payment Cards (28 banks)
    BANKS_DIRECTORY_DATA.forEach((bk) => {
      list.push({
        id: `bank-${bk.id}`,
        name: bk.name,
        slug: bk.slug,
        letter: (bk.letter || bk.name.charAt(0)).toUpperCase(),
        pillar: 'banks',
        pillarLabel: 'Bank & Cards',
        pillarColor: '#F59E0B',
        logo: bk.logo,
        href: bk.destinationHref || `/categories/banks#${bk.slug}`,
        description: `Credit card cashback rewards, EMI offers, and instant discounts with ${bk.name}.`,
        status: bk.active ? 'active' : 'inactive',
        isTrending: TRENDING_BANKS.some((t) => t.slug === bk.slug)
      })
    })

    // 5. Festivals & Seasonal Campaigns (29 festivals)
    FESTIVALS_DIRECTORY_DATA.forEach((f) => {
      list.push({
        id: `fest-${f.id}`,
        name: f.name,
        slug: f.slug,
        letter: (f.letter || f.name.charAt(0)).toUpperCase(),
        pillar: 'festivals',
        pillarLabel: 'Festival Campaign',
        pillarColor: '#EC4899',
        logo: f.image,
        href: f.destinationHref || `/categories/festivals#${f.slug}`,
        description: `Special festive sale deals, limited-time flash offers, and gift promos for ${f.name}.`,
        status: f.active ? 'active' : 'inactive',
        isTrending: TRENDING_FESTIVALS.some((t) => t.slug === f.slug)
      })
    })

    // 6. Travelling & Flights (43 travel items)
    TRAVELLING_DIRECTORY_DATA.forEach((t) => {
      list.push({
        id: `travel-${t.id}`,
        name: t.name,
        slug: t.slug,
        letter: (t.letter || t.name.charAt(0)).toUpperCase(),
        pillar: 'travelling',
        pillarLabel: 'Travel & Flights',
        pillarColor: '#06B6D4',
        logo: t.logo,
        href: t.destinationHref || `/categories/travelling#${t.slug}`,
        description: `Flight bookings, hotel stays, holidays, and commute promo codes for ${t.name}.`,
        status: t.active ? 'active' : 'inactive',
        isTrending: TRENDING_TRAVELLING.some((tr) => tr.slug === t.slug)
      })
    })

    // 7. Cities Deals (7 top metro cities)
    CITIES_DEALS_DIRECTORY_DATA.forEach((c) => {
      list.push({
        id: `city-${c.id}`,
        name: c.name,
        slug: c.slug,
        letter: (c.letter || c.name.charAt(0)).toUpperCase(),
        pillar: 'cities-deals',
        pillarLabel: 'City Deals Hub',
        pillarColor: '#10B981',
        logo: c.image,
        href: c.destinationHref || `/categories/cities-deals#${c.slug}`,
        description: `Local city dining discounts, supermarket vouchers, and events in ${c.name}.`,
        status: c.active ? 'active' : 'inactive',
        isTrending: TRENDING_CITIES.some((tc) => tc.slug === c.slug)
      })
    })

    return list
  }, [dbCategories])

  // Cross-referencing matching function for any item
  const getItemMetrics = (item: TaxonomyItem) => {
    const itemName = item.name.toLowerCase()
    const itemSlug = item.slug.toLowerCase()

    const isMatch = (cat?: string, subCat?: string, store?: string, title?: string) => {
      const c = (cat || '').toLowerCase()
      const sc = (subCat || '').toLowerCase()
      const st = (store || '').toLowerCase()
      const t = (title || '').toLowerCase()

      if (!c && !sc && !st && !t) return false

      if (c === itemSlug || c === itemName || c.includes(itemSlug) || (itemSlug && itemSlug.includes(c))) return true
      if (sc === itemSlug || sc === itemName || sc.includes(itemSlug) || (itemSlug && itemSlug.includes(sc))) return true
      if (st === itemSlug || st === itemName || st.includes(itemSlug) || (itemSlug && itemSlug.includes(st))) return true
      if (t.includes(itemName) || (itemSlug.length > 3 && t.includes(itemSlug))) return true
      return false
    }

    const deals = rawDeals.filter((d) => isMatch(d.category, d.subCategory, d.store, d.name || d.title))
    const loots = rawLoots.filter((l) => isMatch(l.category, l.subCategory, l.storeName || l.store, l.title))
    const coupons = rawCoupons.filter((c) => isMatch(c.category, c.subCategory, c.store, c.code || c.description))
    const stores = rawStores.filter((s) => isMatch(s.category, undefined, s.name, s.name))

    return {
      deals,
      loots,
      coupons,
      stores,
      totalCount: deals.length + loots.length + coupons.length + stores.length
    }
  }

  // Filter items by active pillar, search, and letter
  const filteredItems = useMemo(() => {
    return allTaxonomyItems.filter((item) => {
      // Pillar filter
      if (activePillar !== 'all' && item.pillar !== activePillar) {
        return false
      }

      // Letter filter
      if (letterFilter && item.letter !== letterFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesSlug = item.slug.toLowerCase().includes(q)
        const matchesPillar = item.pillarLabel.toLowerCase().includes(q)
        return matchesName || matchesSlug || matchesPillar
      }

      return true
    })
  }, [allTaxonomyItems, activePillar, letterFilter, searchQuery])

  // Aggregate overview stats
  const stats = useMemo(() => {
    return {
      totalEntities: allTaxonomyItems.length,
      subcategoriesCount: allTaxonomyItems.filter((i) => i.pillar === 'subcategories').length,
      storesCount: allTaxonomyItems.filter((i) => i.pillar === 'stores').length,
      brandsCount: allTaxonomyItems.filter((i) => i.pillar === 'brands').length,
      banksCount: allTaxonomyItems.filter((i) => i.pillar === 'banks').length,
      festivalsCount: allTaxonomyItems.filter((i) => i.pillar === 'festivals').length,
      travellingCount: allTaxonomyItems.filter((i) => i.pillar === 'travelling').length,
      citiesCount: allTaxonomyItems.filter((i) => i.pillar === 'cities-deals').length,
      liveDealsCount: rawDeals.length,
      liveLootCount: rawLoots.length,
      liveCouponsCount: rawCoupons.length,
      liveStoresCount: rawStores.length
    }
  }, [allTaxonomyItems, rawDeals.length, rawLoots.length, rawCoupons.length, rawStores.length])

  // Inspected Item Linked Data
  const inspectedData = useMemo(() => {
    if (!inspectedItem) return null
    const metrics = getItemMetrics(inspectedItem)

    let filteredDeals = metrics.deals
    let filteredLoots = metrics.loots
    let filteredCoupons = metrics.coupons
    let filteredStores = metrics.stores

    if (drawerSearch.trim()) {
      const q = drawerSearch.toLowerCase().trim()
      filteredDeals = filteredDeals.filter((d) => (d.name || d.title || '').toLowerCase().includes(q) || (d.store || '').toLowerCase().includes(q))
      filteredLoots = filteredLoots.filter((l) => (l.title || '').toLowerCase().includes(q) || (l.storeName || '').toLowerCase().includes(q))
      filteredCoupons = filteredCoupons.filter((c) => (c.code || '').toLowerCase().includes(q) || (c.store || '').toLowerCase().includes(q))
      filteredStores = filteredStores.filter((s) => (s.name || '').toLowerCase().includes(q))
    }

    return {
      deals: filteredDeals,
      loots: filteredLoots,
      coupons: filteredCoupons,
      stores: filteredStores,
      totalCount: metrics.totalCount
    }
  }, [inspectedItem, rawDeals, rawLoots, rawCoupons, rawStores, drawerSearch])

  // Form Handlers
  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      pillar: activePillar === 'all' ? 'subcategories' : activePillar,
      description: '',
      status: 'active',
      logo: '',
      href: ''
    })
    setIsCreateModalOpen(true)
  }

  const handleOpenEditModal = (item: TaxonomyItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      pillar: item.pillar,
      description: item.description || '',
      status: item.status,
      logo: item.logo || '',
      href: item.href
    })
    setIsEditModalOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) {
      showNotification('Item name and slug are required', 'error')
      return
    }

    try {
      await adminApi.createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        status: formData.status,
        color: '#2F368C',
        bgColor: '#E5E7FF',
        textColor: '#2F368C',
        count: 0
      })
      showNotification(`"${formData.name}" added to catalog successfully!`)
      setIsCreateModalOpen(false)
      loadAllData()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to create taxonomy item', 'error')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    try {
      await adminApi.updateCategory(selectedItem.slug, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        status: formData.status
      })
      showNotification(`"${formData.name}" updated successfully!`)
      setIsEditModalOpen(false)
      loadAllData()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to update taxonomy item', 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return
    try {
      await adminApi.deleteCategory(selectedItem.slug)
      showNotification(`"${selectedItem.name}" deleted successfully!`)
      setIsDeleteModalOpen(false)
      setSelectedItem(null)
      loadAllData()
    } catch (err: any) {
      showNotification(err?.message || 'Failed to delete taxonomy item', 'error')
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const alphabetList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <ExecutiveLayout activeMenu="categories">
      <div className="exec-cat-hub">
        {/* Notification Toast */}
        {notification && (
          <div className={`exec-cat-hub__toast exec-cat-hub__toast--${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="exec-cat-hub__header">
          <div className="exec-cat-hub__header-left">
            <div className="exec-cat-hub__header-badge">
              <Sparkles size={14} />
              <span>Taxonomy & Storefront Ecosystem Hub</span>
            </div>
            <h1 className="exec-cat-hub__title">Categories & 7 Directory Taxonomy</h1>
            <p className="exec-cat-hub__subtitle">
              Deep inspection, cross-referencing, and real-time synchronization for all 7 storefront directories and catalog items.
            </p>
          </div>

          <div className="exec-cat-hub__header-actions">
            <button
              type="button"
              className="exec-cat-hub__btn exec-cat-hub__btn--secondary"
              onClick={loadAllData}
              title="Refresh Live Data"
            >
              <RefreshCw size={16} className={loading ? 'exec-cat-hub__spin' : ''} />
              <span>Sync Live</span>
            </button>
            <div className="exec-cat-hub__actions">
              <button
                type="button"
                className="exec-cat-hub__btn exec-cat-hub__btn--primary"
                onClick={handleOpenCreateModal}
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Spotlight Grid */}
        <div className="exec-cat-hub__kpi-grid">
          <div className="exec-cat-hub__kpi-card exec-cat-hub__kpi-card--navy">
            <div className="exec-cat-hub__kpi-icon">
              <FolderTree size={22} />
            </div>
            <div className="exec-cat-hub__kpi-content">
              <span className="exec-cat-hub__kpi-label">7 Storefront Directories</span>
              <span className="exec-cat-hub__kpi-value">{stats.totalEntities} Total Items</span>
              <span className="exec-cat-hub__kpi-sub">Subcategories, Stores, Brands, Banks, Festivals, Travel, Cities</span>
            </div>
          </div>

          <div className="exec-cat-hub__kpi-card exec-cat-hub__kpi-card--blue">
            <div className="exec-cat-hub__kpi-icon">
              <Zap size={22} />
            </div>
            <div className="exec-cat-hub__kpi-content">
              <span className="exec-cat-hub__kpi-label">Active Deals Categorized</span>
              <span className="exec-cat-hub__kpi-value">{stats.liveDealsCount} Deals</span>
              <span className="exec-cat-hub__kpi-sub">Live mapped across all catalog items</span>
            </div>
          </div>

          <div className="exec-cat-hub__kpi-card exec-cat-hub__kpi-card--orange">
            <div className="exec-cat-hub__kpi-icon">
              <Flame size={22} />
            </div>
            <div className="exec-cat-hub__kpi-content">
              <span className="exec-cat-hub__kpi-label">Flash & Loot Offers</span>
              <span className="exec-cat-hub__kpi-value">{stats.liveLootCount} Loot Deals</span>
              <span className="exec-cat-hub__kpi-sub">Active discounts up to 90%</span>
            </div>
          </div>

          <div className="exec-cat-hub__kpi-card exec-cat-hub__kpi-card--purple">
            <div className="exec-cat-hub__kpi-icon">
              <Ticket size={22} />
            </div>
            <div className="exec-cat-hub__kpi-content">
              <span className="exec-cat-hub__kpi-label">Promo Codes & Coupons</span>
              <span className="exec-cat-hub__kpi-value">{stats.liveCouponsCount} Coupons</span>
              <span className="exec-cat-hub__kpi-sub">Verified store promo codes</span>
            </div>
          </div>
        </div>

        {/* 7 Directory Pillar Filter Tabs */}
        <div className="exec-cat-hub__pillars-strip" role="tablist">
          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'all' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('all'); setLetterFilter(null); }}
          >
            <Layers size={16} />
            <span>All Categories & Directories ({stats.totalEntities})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'subcategories' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('subcategories'); setLetterFilter(null); }}
          >
            <Tag size={16} />
            <span>1. Subcategories Catalog ({stats.subcategoriesCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'stores' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('stores'); setLetterFilter(null); }}
          >
            <Store size={16} />
            <span>2. Stores Directory ({stats.storesCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'brands' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('brands'); setLetterFilter(null); }}
          >
            <Sparkles size={16} />
            <span>3. Brands Directory ({stats.brandsCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'banks' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('banks'); setLetterFilter(null); }}
          >
            <CreditCard size={16} />
            <span>4. Banks & Cards ({stats.banksCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'festivals' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('festivals'); setLetterFilter(null); }}
          >
            <Calendar size={16} />
            <span>5. Festivals & Sales ({stats.festivalsCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'travelling' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('travelling'); setLetterFilter(null); }}
          >
            <Plane size={16} />
            <span>6. Travelling & Flights ({stats.travellingCount})</span>
          </button>

          <button
            type="button"
            className={`exec-cat-hub__pillar-pill ${activePillar === 'cities-deals' ? 'exec-cat-hub__pillar-pill--active' : ''}`}
            onClick={() => { setActivePillar('cities-deals'); setLetterFilter(null); }}
          >
            <MapPin size={16} />
            <span>7. Cities Deals Hub ({stats.citiesCount})</span>
          </button>
        </div>

        {/* Toolbar & Controls */}
        <div className="exec-cat-hub__toolbar">
          <div className="exec-cat-hub__search-box">
            <Search size={18} className="exec-cat-hub__search-icon" />
            <input
              type="text"
              placeholder={`Search ${activePillar === 'all' ? 'all 350+ taxonomy items' : activePillar} by name or slug...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="exec-cat-hub__search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="exec-cat-hub__search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="exec-cat-hub__view-switch">
            <button
              type="button"
              className={`exec-cat-hub__view-btn ${viewMode === 'table' ? 'exec-cat-hub__view-btn--active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={16} />
            </button>
            <button
              type="button"
              className={`exec-cat-hub__view-btn ${viewMode === 'grid' ? 'exec-cat-hub__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Alphabet Quick Filter Strip */}
        <div className="exec-cat-hub__alphabet-strip">
          <button
            type="button"
            className={`exec-cat-hub__alpha-btn ${letterFilter === null ? 'exec-cat-hub__alpha-btn--active' : ''}`}
            onClick={() => setLetterFilter(null)}
          >
            ALL
          </button>
          {alphabetList.map((letter) => {
            const hasMatches = allTaxonomyItems.some((i) => i.letter === letter && (activePillar === 'all' || i.pillar === activePillar))
            return (
              <button
                key={letter}
                type="button"
                className={`exec-cat-hub__alpha-btn ${letterFilter === letter ? 'exec-cat-hub__alpha-btn--active' : ''} ${!hasMatches ? 'exec-cat-hub__alpha-btn--disabled' : ''}`}
                onClick={() => hasMatches && setLetterFilter(letter === letterFilter ? null : letter)}
                disabled={!hasMatches}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Content Table / Grid */}
        {filteredItems.length === 0 ? (
          <div className="exec-cat-hub__empty">
            <div className="exec-cat-hub__empty-icon">
              <FolderTree size={40} />
            </div>
            <h3>No Taxonomy Items Found</h3>
            <p>No items matched "{searchQuery}" under the selected directory pillar.</p>
            <button
              type="button"
              className="exec-cat-hub__btn exec-cat-hub__btn--primary"
              onClick={() => { setSearchQuery(''); setLetterFilter(null); }}
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="exec-cat-hub__table-wrapper">
            <table className="exec-cat-hub__table">
              <thead>
                <tr>
                  <th>Item & Directory Pillar</th>
                  <th>Directory Type</th>
                  <th>Identifier / Slug</th>
                  <th>Live Linked Inventory</th>
                  <th>Storefront Route</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const m = getItemMetrics(item)
                  const isAmazon = item.slug === 'amazon' || item.name.toLowerCase() === 'amazon'

                  return (
                    <tr key={item.id} className="exec-cat-hub__row" onClick={() => setInspectedItem(item)}>
                      <td>
                        <div className="exec-cat-hub__item-cell">
                          <div className="exec-cat-hub__item-avatar">
                            {item.logo ? (
                              <img src={item.logo} alt={item.name} loading="lazy" />
                            ) : (
                              <span>{item.letter}</span>
                            )}
                          </div>
                          <div className="exec-cat-hub__item-meta">
                            <span className="exec-cat-hub__item-name">{item.name}</span>
                            <span className="exec-cat-hub__item-letter">Group Letter: {item.letter}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className="exec-cat-hub__pillar-tag"
                          style={{
                            backgroundColor: `${item.pillarColor}15`,
                            color: item.pillarColor,
                            borderColor: `${item.pillarColor}40`
                          }}
                        >
                          {item.pillarLabel}
                        </span>
                      </td>

                      <td>
                        <code className="exec-cat-hub__slug-code">{item.slug}</code>
                      </td>

                      <td>
                        <div className="exec-cat-hub__inventory-pills" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="exec-cat-hub__count-pill exec-cat-hub__count-pill--deals"
                            title="View Linked Standard Deals"
                            onClick={() => { setInspectedItem(item); setDrawerTab('deals'); }}
                          >
                            <Zap size={12} />
                            <span>{m.deals.length} Deals</span>
                          </button>

                          <button
                            type="button"
                            className="exec-cat-hub__count-pill exec-cat-hub__count-pill--loot"
                            title="View Linked Loot Deals"
                            onClick={() => { setInspectedItem(item); setDrawerTab('loot'); }}
                          >
                            <Flame size={12} />
                            <span>{m.loots.length} Loot</span>
                          </button>

                          <button
                            type="button"
                            className="exec-cat-hub__count-pill exec-cat-hub__count-pill--coupons"
                            title="View Linked Coupons"
                            onClick={() => { setInspectedItem(item); setDrawerTab('coupons'); }}
                          >
                            <Ticket size={12} />
                            <span>{m.coupons.length} Coupons</span>
                          </button>

                          {m.stores.length > 0 && (
                            <button
                              type="button"
                              className="exec-cat-hub__count-pill exec-cat-hub__count-pill--stores"
                              title="View Linked Stores"
                              onClick={() => { setInspectedItem(item); setDrawerTab('stores'); }}
                            >
                              <Store size={12} />
                              <span>{m.stores.length} Stores</span>
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="exec-cat-hub__live-link"
                          onClick={(e) => e.stopPropagation()}
                          title={`Open ${item.name} in live storefront`}
                        >
                          <span>{isAmazon ? '/brands/amazon' : item.href}</span>
                          <ExternalLink size={13} />
                        </a>
                      </td>

                      <td>
                        <span className={`exec-cat-hub__status-tag exec-cat-hub__status-tag--${item.status}`}>
                          {item.status === 'active' ? '● Active' : item.status === 'featured' ? '★ Featured' : '○ Draft'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div className="exec-cat-hub__actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="exec-cat-hub__action-btn exec-cat-hub__action-btn--inspect"
                            title="Deep Inspect All Categorized Deals"
                            onClick={() => { setInspectedItem(item); setDrawerTab('all'); }}
                          >
                            <Eye size={15} />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            className="exec-cat-hub__action-btn"
                            title="Edit Category"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="exec-cat-hub__action-btn exec-cat-hub__action-btn--delete"
                            title="Delete Item"
                            onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="exec-cat-hub__grid">
            {filteredItems.map((item) => {
              const m = getItemMetrics(item)

              return (
                <div key={item.id} className="exec-cat-hub__card" onClick={() => setInspectedItem(item)}>
                  <div className="exec-cat-hub__card-header">
                    <div className="exec-cat-hub__card-avatar">
                      {item.logo ? (
                        <img src={item.logo} alt={item.name} loading="lazy" />
                      ) : (
                        <span>{item.letter}</span>
                      )}
                    </div>
                    <span
                      className="exec-cat-hub__pillar-tag"
                      style={{
                        backgroundColor: `${item.pillarColor}15`,
                        color: item.pillarColor,
                        borderColor: `${item.pillarColor}40`
                      }}
                    >
                      {item.pillarLabel}
                    </span>
                  </div>

                  <h3 className="exec-cat-hub__card-name">{item.name}</h3>
                  <code className="exec-cat-hub__slug-code">{item.slug}</code>
                  <p className="exec-cat-hub__card-desc">{item.description}</p>

                  <div className="exec-cat-hub__card-stats">
                    <div className="exec-cat-hub__card-stat">
                      <span className="exec-cat-hub__stat-num">{m.deals.length}</span>
                      <span className="exec-cat-hub__stat-lbl">Deals</span>
                    </div>
                    <div className="exec-cat-hub__card-stat">
                      <span className="exec-cat-hub__stat-num">{m.loots.length}</span>
                      <span className="exec-cat-hub__stat-lbl">Loot</span>
                    </div>
                    <div className="exec-cat-hub__card-stat">
                      <span className="exec-cat-hub__stat-num">{m.coupons.length}</span>
                      <span className="exec-cat-hub__stat-lbl">Coupons</span>
                    </div>
                  </div>

                  <div className="exec-cat-hub__card-footer" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="exec-cat-hub__live-link"
                    >
                      <span>Preview</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      className="exec-cat-hub__inspect-link"
                      onClick={() => setInspectedItem(item)}
                    >
                      <span>View All {m.totalCount} Offers</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Deep Inspection Drawer / Modal */}
        {inspectedItem && inspectedData && (
          <div className="exec-cat-hub__drawer-overlay" onClick={() => setInspectedItem(null)}>
            <div className="exec-cat-hub__drawer" onClick={(e) => e.stopPropagation()}>
              {/* Drawer Header */}
              <div className="exec-cat-hub__drawer-header">
                <div className="exec-cat-hub__drawer-title-row">
                  <div className="exec-cat-hub__drawer-avatar">
                    {inspectedItem.logo ? (
                      <img src={inspectedItem.logo} alt={inspectedItem.name} />
                    ) : (
                      <span>{inspectedItem.letter}</span>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h2 className="exec-cat-hub__drawer-name">{inspectedItem.name}</h2>
                      <span
                        className="exec-cat-hub__pillar-tag"
                        style={{
                          backgroundColor: `${inspectedItem.pillarColor}15`,
                          color: inspectedItem.pillarColor,
                          borderColor: `${inspectedItem.pillarColor}40`
                        }}
                      >
                        {inspectedItem.pillarLabel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <code className="exec-cat-hub__slug-code">slug: {inspectedItem.slug}</code>
                      <a
                        href={inspectedItem.href}
                        target="_blank"
                        rel="noreferrer"
                        className="exec-cat-hub__live-link"
                      >
                        <span>Open Live Page</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="exec-cat-hub__drawer-close"
                  onClick={() => setInspectedItem(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Description */}
              <div className="exec-cat-hub__drawer-desc-bar">
                <p>{inspectedItem.description}</p>
              </div>

              {/* Drawer Filter Tabs */}
              <div className="exec-cat-hub__drawer-tabs">
                <button
                  type="button"
                  className={`exec-cat-hub__dtab ${drawerTab === 'all' ? 'exec-cat-hub__dtab--active' : ''}`}
                  onClick={() => setDrawerTab('all')}
                >
                  All Mapped Items ({inspectedData.totalCount})
                </button>
                <button
                  type="button"
                  className={`exec-cat-hub__dtab ${drawerTab === 'deals' ? 'exec-cat-hub__dtab--active' : ''}`}
                  onClick={() => setDrawerTab('deals')}
                >
                  <Zap size={14} />
                  <span>Standard Deals ({inspectedData.deals.length})</span>
                </button>
                <button
                  type="button"
                  className={`exec-cat-hub__dtab ${drawerTab === 'loot' ? 'exec-cat-hub__dtab--active' : ''}`}
                  onClick={() => setDrawerTab('loot')}
                >
                  <Flame size={14} />
                  <span>Loot & Flash ({inspectedData.loots.length})</span>
                </button>
                <button
                  type="button"
                  className={`exec-cat-hub__dtab ${drawerTab === 'coupons' ? 'exec-cat-hub__dtab--active' : ''}`}
                  onClick={() => setDrawerTab('coupons')}
                >
                  <Ticket size={14} />
                  <span>Coupons ({inspectedData.coupons.length})</span>
                </button>
                <button
                  type="button"
                  className={`exec-cat-hub__dtab ${drawerTab === 'stores' ? 'exec-cat-hub__dtab--active' : ''}`}
                  onClick={() => setDrawerTab('stores')}
                >
                  <Store size={14} />
                  <span>Stores ({inspectedData.stores.length})</span>
                </button>
              </div>

              {/* Drawer Search Filter */}
              <div className="exec-cat-hub__drawer-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={`Search deals, coupons, or stores inside ${inspectedItem.name}...`}
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                />
                {drawerSearch && (
                  <button type="button" onClick={() => setDrawerSearch('')}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Drawer Inventory Content */}
              <div className="exec-cat-hub__drawer-body">
                {/* 1. Deals Section */}
                {(drawerTab === 'all' || drawerTab === 'deals') && (
                  <div className="exec-cat-hub__drawer-section">
                    <div className="exec-cat-hub__drawer-sec-header">
                      <h4>
                        <Zap size={16} style={{ color: '#2F368C' }} />
                        <span>Standard Deals Categorized ({inspectedData.deals.length})</span>
                      </h4>
                    </div>

                    {inspectedData.deals.length === 0 ? (
                      <p className="exec-cat-hub__empty-hint">No standard deals currently mapped under this item.</p>
                    ) : (
                      <div className="exec-cat-hub__deals-list">
                        {inspectedData.deals.map((deal: any) => (
                          <div key={deal.id || deal._id} className="exec-cat-hub__deal-row">
                            <div className="exec-cat-hub__deal-img">
                              <img
                                src={deal.image || deal.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                                alt={deal.name || deal.title}
                              />
                            </div>
                            <div className="exec-cat-hub__deal-info">
                              <span className="exec-cat-hub__deal-title">{deal.name || deal.title}</span>
                              <div className="exec-cat-hub__deal-meta">
                                <span className="exec-cat-hub__deal-store">{deal.store || 'Store'}</span>
                                <span className="exec-cat-hub__deal-cat">{deal.category || inspectedItem.name}</span>
                                {deal.subCategory && <span className="exec-cat-hub__deal-subcat">{deal.subCategory}</span>}
                              </div>
                            </div>
                            <div className="exec-cat-hub__deal-pricing">
                              <span className="exec-cat-hub__deal-price">{deal.price?.toString().startsWith('₹') ? deal.price : `₹${deal.price}`}</span>
                              {deal.discount && <span className="exec-cat-hub__deal-disc">{deal.discount}</span>}
                            </div>
                            <div className="exec-cat-hub__deal-actions">
                              <a
                                href={deal.store?.toLowerCase() === 'amazon' ? '/brands/amazon' : `/product?id=${deal.id || deal._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="exec-cat-hub__btn-sm"
                              >
                                <span>Preview</span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Loot Deals Section */}
                {(drawerTab === 'all' || drawerTab === 'loot') && (
                  <div className="exec-cat-hub__drawer-section">
                    <div className="exec-cat-hub__drawer-sec-header">
                      <h4>
                        <Flame size={16} style={{ color: '#E31E25' }} />
                        <span>Flash & Loot Deals ({inspectedData.loots.length})</span>
                      </h4>
                    </div>

                    {inspectedData.loots.length === 0 ? (
                      <p className="exec-cat-hub__empty-hint">No loot deals currently mapped under this item.</p>
                    ) : (
                      <div className="exec-cat-hub__deals-list">
                        {inspectedData.loots.map((loot: any) => (
                          <div key={loot.id || loot._id} className="exec-cat-hub__deal-row">
                            <div className="exec-cat-hub__deal-img">
                              <img
                                src={loot.image || loot.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                                alt={loot.title}
                              />
                            </div>
                            <div className="exec-cat-hub__deal-info">
                              <span className="exec-cat-hub__deal-title">{loot.title}</span>
                              <div className="exec-cat-hub__deal-meta">
                                <span className="exec-cat-hub__deal-store">{loot.storeName || loot.store || 'Store'}</span>
                                <span className="exec-cat-hub__loot-badge">⚡ {loot.dealType || 'Flash Loot'}</span>
                              </div>
                            </div>
                            <div className="exec-cat-hub__deal-pricing">
                              <span className="exec-cat-hub__deal-price">{loot.currentPrice?.toString().startsWith('₹') ? loot.currentPrice : `₹${loot.currentPrice}`}</span>
                              {loot.discount && <span className="exec-cat-hub__deal-disc exec-cat-hub__deal-disc--loot">{loot.discount}</span>}
                            </div>
                            <div className="exec-cat-hub__deal-actions">
                              <a
                                href={loot.href || `/product?id=${loot.id || loot._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="exec-cat-hub__btn-sm"
                              >
                                <span>Preview</span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Coupons Section */}
                {(drawerTab === 'all' || drawerTab === 'coupons') && (
                  <div className="exec-cat-hub__drawer-section">
                    <div className="exec-cat-hub__drawer-sec-header">
                      <h4>
                        <Ticket size={16} style={{ color: '#8B5CF6' }} />
                        <span>Active Promo Codes & Coupons ({inspectedData.coupons.length})</span>
                      </h4>
                    </div>

                    {inspectedData.coupons.length === 0 ? (
                      <p className="exec-cat-hub__empty-hint">No promo codes currently mapped under this item.</p>
                    ) : (
                      <div className="exec-cat-hub__coupons-grid">
                        {inspectedData.coupons.map((coupon: any) => (
                          <div key={coupon.id || coupon._id || coupon.code} className="exec-cat-hub__coupon-box">
                            <div className="exec-cat-hub__coupon-head">
                              <span className="exec-cat-hub__coupon-store">{coupon.store || inspectedItem.name}</span>
                              <span className="exec-cat-hub__coupon-disc">{coupon.discount || 'Discount Code'}</span>
                            </div>
                            <div className="exec-cat-hub__coupon-code-wrap">
                              <code className="exec-cat-hub__coupon-code">{coupon.code}</code>
                              <button
                                type="button"
                                className="exec-cat-hub__coupon-copy"
                                onClick={() => handleCopyCode(coupon.code)}
                                title="Copy Code"
                              >
                                {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="exec-cat-hub__coupon-foot">
                              <span>Expires: {coupon.expiry || 'Limited Period'}</span>
                              <span>Usage: {coupon.usageCount || 0} clicks</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Stores Section */}
                {(drawerTab === 'all' || drawerTab === 'stores') && (
                  <div className="exec-cat-hub__drawer-section">
                    <div className="exec-cat-hub__drawer-sec-header">
                      <h4>
                        <Store size={16} style={{ color: '#10B981' }} />
                        <span>Partner Merchant Stores ({inspectedData.stores.length})</span>
                      </h4>
                    </div>

                    {inspectedData.stores.length === 0 ? (
                      <p className="exec-cat-hub__empty-hint">No specific stores mapped directly to this item.</p>
                    ) : (
                      <div className="exec-cat-hub__stores-grid">
                        {inspectedData.stores.map((s: any) => (
                          <div key={s.id || s._id || s.name} className="exec-cat-hub__store-box">
                            <span className="exec-cat-hub__store-name">{s.name}</span>
                            <span className="exec-cat-hub__store-cat">{s.category || 'Retail'}</span>
                            {s.reward && <span className="exec-cat-hub__store-reward">{s.reward}</span>}
                            <a
                              href={s.name.toLowerCase() === 'amazon' ? '/brands/amazon' : (s.href || `/stores#${s.slug || s.name.toLowerCase()}`)}
                              target="_blank"
                              rel="noreferrer"
                              className="exec-cat-hub__btn-sm"
                              style={{ marginTop: 8 }}
                            >
                              <span>View Store</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Item */}
        {isCreateModalOpen && (
          <div className="exec-cat-modal-overlay">
            <div className="exec-cat-modal">
              <div className="exec-cat-modal__header">
                <h2>Add New Category</h2>
                <button type="button" onClick={() => setIsCreateModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="exec-cat-modal__body">
                <div className="exec-cat-form-group">
                  <label>Directory Pillar</label>
                  <select
                    value={formData.pillar}
                    onChange={(e) => setFormData({ ...formData, pillar: e.target.value as any })}
                  >
                    <option value="subcategories">1. Catalog Subcategories</option>
                    <option value="stores">2. Stores Directory</option>
                    <option value="brands">3. Brands Directory</option>
                    <option value="banks">4. Banks & Payment Cards</option>
                    <option value="festivals">5. Festivals & Seasonal Sales</option>
                    <option value="travelling">6. Travelling & Flights</option>
                    <option value="cities-deals">7. Cities Deals Hub</option>
                  </select>
                </div>

                <div className="exec-cat-form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gaming Laptops, Crocs, Diwali Sale"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      setFormData({ ...formData, name, slug: formData.slug ? formData.slug : slug })
                    }}
                  />
                </div>

                <div className="exec-cat-form-group">
                  <label>Slug / URL Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. gaming-laptops"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="exec-cat-form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of this directory category..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="exec-cat-modal__footer">
                  <button type="button" className="exec-cat-hub__btn exec-cat-hub__btn--secondary" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="exec-cat-hub__btn exec-cat-hub__btn--primary">
                    Create Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Item */}
        {isEditModalOpen && selectedItem && (
          <div className="exec-cat-modal-overlay">
            <div className="exec-cat-modal">
              <div className="exec-cat-modal__header">
                <h2>Edit Category</h2>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="exec-cat-modal__body">
                <div className="exec-cat-form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="exec-cat-form-group">
                  <label>Slug / URL Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div className="exec-cat-form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="exec-cat-modal__footer">
                  <button type="button" className="exec-cat-hub__btn exec-cat-hub__btn--secondary" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="exec-cat-hub__btn exec-cat-hub__btn--primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {isDeleteModalOpen && selectedItem && (
          <div className="exec-cat-modal-overlay">
            <div className="exec-cat-modal exec-cat-modal--delete">
              <div className="exec-cat-modal__header">
                <h2>Confirm Deletion</h2>
                <button type="button" onClick={() => setIsDeleteModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="exec-cat-modal__body">
                <p>Are you sure you want to delete <strong>"{selectedItem.name}"</strong> from the taxonomy directory?</p>
              </div>
              <div className="exec-cat-modal__footer">
                <button type="button" className="exec-cat-hub__btn exec-cat-hub__btn--secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="exec-cat-hub__btn exec-cat-hub__btn--delete" onClick={handleDeleteConfirm}>
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}

export default ExecutiveCategoriesPage
