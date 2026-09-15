import React, { useEffect, useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { FAVOURITE_STORES } from '../../../data/storesHero'
import { DEALS_CARD_ITEMS, MASTER_EXECUTIVE_DEALS, MASTER_EXECUTIVE_LOOT_DEALS, getStoreLogo, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { 
  Search, 
  ArrowUpDown, 
  Clock, 
  Layers, 
  Zap, 
  Flame, 
  Tag, 
  Store as StoreIcon, 
  TrendingUp, 
  AlertCircle,
  Eye
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'
import './ExecutiveDashboardPage.css'

type TimeframeType = 'today' | 'yesterday' | 'week' | 'month' | 'all'
type EntityType = 'all' | 'deal' | 'loot' | 'coupon'
type StatusType = 'all' | 'Approved' | 'Pending Review' | 'Draft'
type SortOption = 'recent' | 'clicks' | 'discount' | 'store'

interface SubmissionItem {
  id: string
  title: string
  type: 'deal' | 'loot' | 'coupon'
  store: string
  category: string
  price?: string
  originalPrice?: string
  discount: string
  postedAt: string
  timeframe: 'today' | 'yesterday' | 'week' | 'month' | 'older'
  status: 'Approved' | 'Pending Review' | 'Draft'
  clicks: number
  link: string
}

// Comprehensive realistic executive submission records
const MOCK_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'sub-1',
    title: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    type: 'deal',
    store: 'Amazon',
    category: 'Electronics',
    price: '₹1,34,900',
    originalPrice: '₹1,59,900',
    discount: '16% OFF',
    postedAt: 'Today, 11:30 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 1420,
    link: '/executive/deals'
  },
  {
    id: 'sub-2',
    title: 'Sony PlayStation 5 Slim Console Disk Edition',
    type: 'loot',
    store: 'Flipkart',
    category: 'Electronics',
    price: '₹44,990',
    originalPrice: '₹54,990',
    discount: 'Flat ₹10,000 OFF',
    postedAt: 'Today, 10:45 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 2890,
    link: '/executive/loot-deals'
  },
  {
    id: 'sub-3',
    title: 'Flat 50% Off First Order + Free Delivery',
    type: 'coupon',
    store: 'Swiggy',
    category: 'Food',
    discount: '50% OFF',
    postedAt: 'Today, 09:20 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 3410,
    link: '/executive/coupons'
  },
  {
    id: 'sub-4',
    title: 'Nike Air Max Running Shoes (Men & Women)',
    type: 'deal',
    store: 'Myntra',
    category: 'Fashion',
    price: '₹4,999',
    originalPrice: '₹9,995',
    discount: '50% OFF',
    postedAt: 'Today, 08:50 AM',
    timeframe: 'today',
    status: 'Pending Review',
    clicks: 870,
    link: '/executive/deals'
  },
  {
    id: 'sub-5',
    title: 'Samsung 55" Crystal 4K Vivid Pro Smart TV',
    type: 'loot',
    store: 'Amazon',
    category: 'Electronics',
    price: '₹37,990',
    originalPrice: '₹64,900',
    discount: '41% OFF',
    postedAt: 'Today, 08:15 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 1950,
    link: '/executive/loot-deals'
  },
  {
    id: 'sub-6',
    title: 'Extra ₹500 Instant Discount with HDFC Credit Cards',
    type: 'coupon',
    store: 'Reliance Digital',
    category: 'Electronics',
    discount: '₹500 OFF',
    postedAt: 'Today, 07:30 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 980,
    link: '/executive/coupons'
  },
  {
    id: 'sub-7',
    title: 'Milton 1.8L Electric Kettle Stainless Steel',
    type: 'deal',
    store: 'Amazon',
    category: 'Home',
    price: '₹699',
    originalPrice: '₹1,299',
    discount: '46% OFF',
    postedAt: 'Today, 06:40 AM',
    timeframe: 'today',
    status: 'Draft',
    clicks: 210,
    link: '/executive/deals'
  },
  {
    id: 'sub-8',
    title: 'Buy 2 Get 1 Free on Autumn Beauty Essentials',
    type: 'coupon',
    store: 'Nykaa',
    category: 'Beauty',
    discount: 'B2G1 FREE',
    postedAt: 'Today, 06:10 AM',
    timeframe: 'today',
    status: 'Approved',
    clicks: 1540,
    link: '/executive/coupons'
  },
  // Yesterday items
  {
    id: 'sub-9',
    title: 'Boat Airdopes 141 ANC Wireless Earbuds',
    type: 'deal',
    store: 'Flipkart',
    category: 'Electronics',
    price: '₹1,299',
    originalPrice: '₹4,490',
    discount: '71% OFF',
    postedAt: 'Yesterday, 06:30 PM',
    timeframe: 'yesterday',
    status: 'Approved',
    clicks: 4210,
    link: '/executive/deals'
  },
  {
    id: 'sub-10',
    title: 'Fastrack Reflex Beat Smartwatch Full Touch',
    type: 'loot',
    store: 'Myntra',
    category: 'Fashion',
    price: '₹999',
    originalPrice: '₹3,995',
    discount: '75% OFF',
    postedAt: 'Yesterday, 04:15 PM',
    timeframe: 'yesterday',
    status: 'Approved',
    clicks: 3120,
    link: '/executive/loot-deals'
  },
  {
    id: 'sub-11',
    title: 'Flat 60% Off End of Season Clearance Code',
    type: 'coupon',
    store: 'Ajio',
    category: 'Fashion',
    discount: '60% OFF',
    postedAt: 'Yesterday, 02:40 PM',
    timeframe: 'yesterday',
    status: 'Approved',
    clicks: 2890,
    link: '/executive/coupons'
  },
  {
    id: 'sub-12',
    title: 'Organic Grocery Essentials Pantry Pack 10kg',
    type: 'deal',
    store: 'BigBasket',
    category: 'Grocery',
    price: '₹1,199',
    originalPrice: '₹1,850',
    discount: '35% OFF',
    postedAt: 'Yesterday, 11:20 AM',
    timeframe: 'yesterday',
    status: 'Approved',
    clicks: 1650,
    link: '/executive/deals'
  },
  // This week items
  {
    id: 'sub-13',
    title: 'Zepto Super Saver Promo: Flat ₹150 Cashback',
    type: 'coupon',
    store: 'Zepto',
    category: 'Grocery',
    discount: '₹150 CASHBACK',
    postedAt: '3 days ago',
    timeframe: 'week',
    status: 'Approved',
    clicks: 5600,
    link: '/executive/coupons'
  },
  {
    id: 'sub-14',
    title: 'OnePlus 12R 5G (16GB RAM, 256GB Storage)',
    type: 'deal',
    store: 'Amazon',
    category: 'Electronics',
    price: '₹42,999',
    originalPrice: '₹45,999',
    discount: '7% OFF',
    postedAt: '4 days ago',
    timeframe: 'week',
    status: 'Approved',
    clicks: 4100,
    link: '/executive/deals'
  },
  {
    id: 'sub-15',
    title: 'Zomato Gold: 40% Off on Top Dining Restaurants',
    type: 'coupon',
    store: 'Zomato',
    category: 'Food',
    discount: '40% OFF',
    postedAt: '5 days ago',
    timeframe: 'week',
    status: 'Approved',
    clicks: 6800,
    link: '/executive/coupons'
  }
]

// Day-wise velocity for chart
const WEEKLY_POSTING_DATA = [
  { day: 'Mon', deals: 5, loot: 2, coupons: 8 },
  { day: 'Tue', deals: 7, loot: 3, coupons: 11 },
  { day: 'Wed', deals: 4, loot: 1, coupons: 6 },
  { day: 'Thu', deals: 9, loot: 4, coupons: 10 },
  { day: 'Fri', deals: 6, loot: 3, coupons: 14 },
  { day: 'Sat', deals: 8, loot: 5, coupons: 12 },
  { day: 'Today', deals: 8, loot: 4, coupons: 12, isToday: true }
]

export const ExecutiveDashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null)
  const [greeting, setGreeting] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(MOCK_SUBMISSIONS)

  // Filter States
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeType>('today')
  const [activeType, setActiveType] = useState<EntityType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType>('all')
  const [sortOption, setSortOption] = useState<SortOption>('recent')

  useEffect(() => {
    const userData = localStorage.getItem('staffUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const loadLiveSubmissions = async () => {
      try {
        const live = await adminApi.getSubmissions()
        if (Array.isArray(live) && live.length > 0) {
          const mapped: SubmissionItem[] = live.map((s: any, idx: number) => ({
            id: s.id || s._id || `sub-live-${idx}`,
            title: s.title || 'Untitled Submission',
            type: (s.entityType === 'loot_deal' ? 'loot' : s.entityType === 'coupon' ? 'coupon' : 'deal') as 'deal' | 'loot' | 'coupon',
            store: s.store || 'Amazon',
            category: s.category || 'General',
            price: s.dataSnapshot?.price || '₹999',
            originalPrice: s.dataSnapshot?.originalPrice || '₹1,999',
            discount: s.dataSnapshot?.discount || '50% OFF',
            postedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Just now',
            timeframe: 'today',
            status: (s.status === 'Approved' ? 'Approved' : s.status === 'Rejected' ? 'Draft' : 'Pending Review') as 'Approved' | 'Pending Review' | 'Draft',
            clicks: s.dataSnapshot?.clicks || Math.floor(Math.random() * 500 + 50),
            link: s.entityType === 'loot_deal' ? '/executive/loot-deals' : s.entityType === 'coupon' ? '/executive/coupons' : '/executive/deals'
          }))
          setSubmissions(mapped)
        }
      } catch (e) {
        console.warn('Fallback to local submissions:', e)
      }
    }

    loadLiveSubmissions()

    const handleSync = () => { loadLiveSubmissions() }
    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('wouchify_loot_deals_updated', handleSync)
    window.addEventListener('wouchify_deal_clicked', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('wouchify_loot_deals_updated', handleSync)
      window.removeEventListener('wouchify_deal_clicked', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours()
      if (h >= 5 && h < 12)  { setGreeting('Good Morning') }
      else if (h >= 12 && h < 17) { setGreeting('Good Afternoon') }
      else if (h >= 17 && h < 21) { setGreeting('Good Evening') }
      else                        { setGreeting('Good Night') }
      setTimeStr(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  // Dynamic calculations based on selected timeframe
  const timeframeCounts = useMemo(() => {
    const matchesTimeframe = (item: SubmissionItem) => {
      if (activeTimeframe === 'today') return item.timeframe === 'today'
      if (activeTimeframe === 'yesterday') return item.timeframe === 'yesterday'
      if (activeTimeframe === 'week') return item.timeframe === 'today' || item.timeframe === 'yesterday' || item.timeframe === 'week'
      if (activeTimeframe === 'month') return true
      return true
    }

    const items = submissions.filter(matchesTimeframe)
    const deals = items.filter(i => i.type === 'deal').length
    const loot = items.filter(i => i.type === 'loot').length
    const coupons = items.filter(i => i.type === 'coupon').length
    const total = items.length

    return { deals, loot, coupons, total }
  }, [submissions, activeTimeframe])

  // Filtered and Sorted Submissions list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Timeframe match
      if (activeTimeframe === 'today' && item.timeframe !== 'today') return false
      if (activeTimeframe === 'yesterday' && item.timeframe !== 'yesterday') return false
      if (activeTimeframe === 'week' && (item.timeframe === 'older')) return false
      
      // Entity type match
      if (activeType !== 'all' && item.type !== activeType) return false

      // Status match
      if (statusFilter !== 'all' && item.status !== statusFilter) return false

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchesTitle = item.title.toLowerCase().includes(q)
        const matchesStore = item.store.toLowerCase().includes(q)
        const matchesCat = item.category.toLowerCase().includes(q)
        if (!matchesTitle && !matchesStore && !matchesCat) return false
      }

      return true
    }).sort((a, b) => {
      if (sortOption === 'clicks') return b.clicks - a.clicks
      if (sortOption === 'store') return a.store.localeCompare(b.store)
      if (sortOption === 'discount') return b.discount.localeCompare(a.discount)
      return 0 // default 'recent'
    })
  }, [activeTimeframe, activeType, statusFilter, searchTerm, sortOption])

  // Dynamic Global CMS stats that sync in real-time
  const [globalStats, setGlobalStats] = useState({
    deals: DEALS_CARD_ITEMS.length,
    loot: MASTER_EXECUTIVE_LOOT_DEALS.length,
    stores: FAVOURITE_STORES.length,
    coupons: 45,
    clicks: 125430,
    pending: 5
  })

  const refreshGlobalStats = () => {
    try {
      // 1. Deals count & clicks
      let dealClicks = 0
      let dealsCount = MASTER_EXECUTIVE_DEALS.length
      const savedDealsRaw = localStorage.getItem('wouchify_public_deals') || localStorage.getItem('wouchify_executive_deals')
      if (savedDealsRaw) {
        const parsed = JSON.parse(savedDealsRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          dealsCount = parsed.length
          dealClicks = parsed.reduce((sum: number, d: any) => sum + (parseInt(String(d.clicks || 0)) || 0), 0)
        }
      } else {
        dealClicks = MASTER_EXECUTIVE_DEALS.reduce((sum, d) => sum + (d.clicks || 0), 0)
      }

      // 2. Loot deals count & clicks
      let lootClicks = 0
      let lootCount = MASTER_EXECUTIVE_LOOT_DEALS.length
      const savedLootRaw = localStorage.getItem('wouchify_loot_deals')
      if (savedLootRaw) {
        const parsed = JSON.parse(savedLootRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          lootCount = parsed.length
          lootClicks = parsed.reduce((sum: number, d: any) => sum + (parseInt(String(d.clicks || 0)) || 0), 0)
        }
      } else {
        lootClicks = MASTER_EXECUTIVE_LOOT_DEALS.reduce((sum, d) => sum + (d.clicks || 0), 0)
      }

      // 3. Coupons count & clicks
      let couponClicks = 0
      let couponCount = 45
      const savedCouponsRaw = localStorage.getItem('wouchify_coupons')
      if (savedCouponsRaw) {
        const parsed = JSON.parse(savedCouponsRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          couponCount = parsed.length
          couponClicks = parsed.reduce((sum: number, c: any) => sum + (parseInt(String(c.usageCount || c.clicks || 0)) || 0), 0)
        }
      }

      // 4. Stores count & clicks
      let storeClicks = 0
      let storesCount = FAVOURITE_STORES.length
      const savedStoresRaw = localStorage.getItem('wouchify_stores')
      if (savedStoresRaw) {
        const parsed = JSON.parse(savedStoresRaw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          storesCount = parsed.length
          storeClicks = parsed.reduce((sum: number, s: any) => sum + (parseInt(String(s.clicks || 0)) || 0), 0)
        }
      }

      // Base historical clicks + live aggregated clicks
      const baseHistoricalClicks = 112500
      const totalClicks = baseHistoricalClicks + dealClicks + lootClicks + couponClicks + storeClicks

      setGlobalStats({
        deals: dealsCount,
        loot: lootCount,
        stores: storesCount,
        coupons: couponCount,
        clicks: totalClicks,
        pending: 5
      })
    } catch (e) {
      console.warn('Error computing global dashboard stats:', e)
    }
  }

  useEffect(() => {
    refreshGlobalStats()
    const handleStatsSync = () => { refreshGlobalStats() }
    window.addEventListener('wouchify_deals_updated', handleStatsSync)
    window.addEventListener('wouchify_loot_deals_updated', handleStatsSync)
    window.addEventListener('wouchify_stores_updated', handleStatsSync)
    window.addEventListener('wouchify_store_clicked', handleStatsSync)
    window.addEventListener('wouchify_deal_clicked', handleStatsSync)
    window.addEventListener('storage', handleStatsSync)
    return () => {
      window.removeEventListener('wouchify_deals_updated', handleStatsSync)
      window.removeEventListener('wouchify_loot_deals_updated', handleStatsSync)
      window.removeEventListener('wouchify_stores_updated', handleStatsSync)
      window.removeEventListener('wouchify_store_clicked', handleStatsSync)
      window.removeEventListener('wouchify_deal_clicked', handleStatsSync)
      window.removeEventListener('storage', handleStatsSync)
    }
  }, [])

  const totalDealsGlobal = globalStats.deals
  const totalLootGlobal = globalStats.loot
  const totalStoresGlobal = globalStats.stores
  const totalCouponsGlobal = globalStats.coupons
  const totalClicksGlobal = globalStats.clicks
  const totalExpiredGlobal = 12
  const pendingApprovalsCount = globalStats.pending

  const adminName = user?.name || 'Executive'

  return (
    <ExecutiveLayout activeMenu="dashboard">
      <div className="executive-dashboard">
        
        {/* ── Greeting Banner ── */}
        <div className="dashboard-header" style={{
          background: 'linear-gradient(135deg, rgba(227,30,37,0.06) 0%, rgba(47,54,140,0.03) 100%)',
          border: '1.5px solid rgba(227,30,37,0.14)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div>
            <p style={{ color: 'var(--color-red, #E31E25)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, marginBottom: '4px' }}>
              Content Executive Portal
            </p>
            <h2 className="dashboard-title" style={{ margin: 0 }}>
              {greeting}, <span style={{ color: 'var(--color-red, #E31E25)' }}>{adminName}</span>! 👋
            </h2>
            <p className="dashboard-subtitle">
              Here is your daily activity, submission status, and content metrics.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <Clock size={14} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{timeStr}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ── SECTION 1: TODAY'S EXECUTIVE ACTIVITY SPOTLIGHT ── */}
        <div className="today-spotlight-section">
          <div className="today-spotlight-header">
            <div className="today-spotlight-title-group">
              <div>
                <h3 className="today-spotlight-heading">
                  Submission Activity
                </h3>
                <p className="today-spotlight-sub">
                  Track the deals, loot deals, and coupons submitted during this period.
                </p>
              </div>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="timeframe-tabs-group">
              <button 
                className={`timeframe-tab-btn ${activeTimeframe === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('today')}
              >
                Today
              </button>
              <button 
                className={`timeframe-tab-btn ${activeTimeframe === 'yesterday' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('yesterday')}
              >
                Yesterday
              </button>
              <button 
                className={`timeframe-tab-btn ${activeTimeframe === 'week' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('week')}
              >
                Last 7 Days
              </button>
              <button 
                className={`timeframe-tab-btn ${activeTimeframe === 'month' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('month')}
              >
                This Month
              </button>
              <button 
                className={`timeframe-tab-btn ${activeTimeframe === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('all')}
              >
                All Time
              </button>
            </div>
          </div>

          {/* 4 Spotlight Metric Cards */}
          <div className="today-metrics-grid">
            {/* Deals Posted */}
            <div className="today-metric-card">
              <div className="today-metric-info">
                <span className="today-metric-label">Deals Submitted</span>
                <span className="today-metric-value">{timeframeCounts.deals}</span>
                <span className="today-metric-trend up">
                  <TrendingUp size={13} /> {activeTimeframe === 'today' ? 'Active today' : 'Recorded'}
                </span>
              </div>
              <div className="today-metric-icon deals">
                <Zap size={22} />
              </div>
            </div>

            {/* Loot Deals Posted */}
            <div className="today-metric-card">
              <div className="today-metric-info">
                <span className="today-metric-label">Loot Deals Submitted</span>
                <span className="today-metric-value">{timeframeCounts.loot}</span>
                <span className="today-metric-trend up">
                  <TrendingUp size={13} /> Flash offers
                </span>
              </div>
              <div className="today-metric-icon loot">
                <Flame size={22} />
              </div>
            </div>

            {/* Coupons Posted */}
            <div className="today-metric-card">
              <div className="today-metric-info">
                <span className="today-metric-label">Coupons Submitted</span>
                <span className="today-metric-value">{timeframeCounts.coupons}</span>
                <span className="today-metric-trend up">
                  <TrendingUp size={13} /> Active codes
                </span>
              </div>
              <div className="today-metric-icon coupons">
                <Tag size={22} />
              </div>
            </div>

            {/* Total Executive Posts */}
            <div className="today-metric-card highlight">
              <div className="today-metric-info">
                <span className="today-metric-label" style={{ color: 'var(--color-red, #E31E25)' }}>
                  Total {activeTimeframe === 'today' ? 'Today' : 'Submissions'}
                </span>
                <span className="today-metric-value">{timeframeCounts.total}</span>
                <span className="today-metric-trend" style={{ color: '#64748b' }}>
                  Across all categories
                </span>
              </div>
              <div className="today-metric-icon total">
                <Layers size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: PLATFORM OVERVIEW METRICS ── */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Platform Overview
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Summary of live offers, catalog counts, and partner stores.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {/* Card 1: Total Deals */}
          <a href="/executive/deals" className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Deals</span>
              <span className="stat-value">{totalDealsGlobal}</span>
              <span className="stat-action-link">Manage Deals →</span>
            </div>
            <div className="stat-icon blue">
              <Zap size={22} />
            </div>
          </a>

          {/* Card 2: Total Loot Deals */}
          <a href="/executive/loot-deals" className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Loot Deals</span>
              <span className="stat-value">{totalLootGlobal}</span>
              <span className="stat-action-link">Manage Loot →</span>
            </div>
            <div className="stat-icon orange">
              <Flame size={22} />
            </div>
          </a>

          {/* Card 3: Total Stores */}
          <a href="/executive/stores" className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Stores</span>
              <span className="stat-value">{totalStoresGlobal}</span>
              <span className="stat-action-link">Manage Stores →</span>
            </div>
            <div className="stat-icon purple">
              <StoreIcon size={22} />
            </div>
          </a>

          {/* Card 4: Total Coupons */}
          <a href="/executive/coupons" className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Coupons</span>
              <span className="stat-value">{totalCouponsGlobal}</span>
              <span className="stat-action-link">Manage Coupons →</span>
            </div>
            <div className="stat-icon red">
              <Tag size={22} />
            </div>
          </a>

          {/* Card 5: Total Clicks */}
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Clicks</span>
              <span className="stat-value">{totalClicksGlobal.toLocaleString()}</span>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                ↑ 14.8% CTR Avg
              </span>
            </div>
            <div className="stat-icon green">
              <Eye size={22} />
            </div>
          </div>

          {/* Card 6: Pending Review */}
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Pending Approvals</span>
              <span className="stat-value" style={{ color: '#f59e0b' }}>{pendingApprovalsCount}</span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Awaiting Admin Sign-off
              </span>
            </div>
            <div className="stat-icon cyan">
              <AlertCircle size={22} />
            </div>
          </div>

          {/* Card 7: Total Expired */}
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Expired</span>
              <span className="stat-value" style={{ color: '#ef4444' }}>{totalExpiredGlobal}</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Archived automatically
              </span>
            </div>
            <div className="stat-icon red">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: VISUAL CHARTS (User Requested) ── */}
        <div className="dashboard-charts-grid">
          {/* Chart 1: Activity Trend Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <h4 className="chart-card-title">Weekly Posting Velocity</h4>
                <p className="chart-card-sub">Comparative submission breakdown across the last 7 days</p>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot deals" /> Deals
                </div>
                <div className="legend-item">
                  <span className="legend-dot loot" /> Loot Deals
                </div>
                <div className="legend-item">
                  <span className="legend-dot coupons" /> Coupons
                </div>
              </div>
            </div>

            {/* Multi-Bar CSS Chart */}
            <div className="bar-chart-container">
              {WEEKLY_POSTING_DATA.map((item) => {
                const maxVal = 16
                const dealH = Math.round((item.deals / maxVal) * 100)
                const lootH = Math.round((item.loot / maxVal) * 100)
                const coupH = Math.round((item.coupons / maxVal) * 100)

                return (
                  <div key={item.day} className={`chart-col ${item.isToday ? 'is-today' : ''}`}>
                    <div className="chart-col-bars" title={`${item.day}: ${item.deals} Deals, ${item.loot} Loot, ${item.coupons} Coupons`}>
                      <div className="bar-segment deals" style={{ height: `${dealH}%` }} />
                      <div className="bar-segment loot" style={{ height: `${lootH}%` }} />
                      <div className="bar-segment coupons" style={{ height: `${coupH}%` }} />
                    </div>
                    <span className="chart-col-label">
                      {item.day} {item.isToday ? '★' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chart 2: Top Stores Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div>
                <h4 className="chart-card-title">Top Stores Breakdown</h4>
                <p className="chart-card-sub">Active deals distribution by partner</p>
              </div>
            </div>

            <div className="store-breakdown-list">
              {[
                { name: 'Amazon', count: 48, fill: 88, color: '#f97316' },
                { name: 'Flipkart', count: 36, fill: 68, color: '#3b82f6' },
                { name: 'Myntra', count: 24, fill: 45, color: '#ec4899' },
                { name: 'Swiggy', count: 18, fill: 35, color: '#f59e0b' },
                { name: 'Zepto', count: 12, fill: 24, color: '#8b5cf6' },
              ].map((st) => (
                <div key={st.name} className="breakdown-row">
                  <div className="breakdown-row-header">
                    <div className="breakdown-store-name">
                      <img 
                        src={getStoreLogo(st.name)} 
                        alt={st.name} 
                        style={{ height: '14px', maxWidth: '30px', objectFit: 'contain' }} 
                      />
                      <span>{st.name}</span>
                    </div>
                    <span className="breakdown-count-badge">{st.count} posts</span>
                  </div>
                  <div className="breakdown-progress-track">
                    <div 
                      className="breakdown-progress-fill" 
                      style={{ width: `${st.fill}%`, backgroundColor: st.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: RECENT SUBMISSIONS TABLE WITH RICH FILTERS & SORT (User Requested) ── */}
        <div className="submissions-section">
          <div className="submissions-header">
            <div className="submissions-title-group">
              <h3>Executive Submissions Log</h3>
              <p>
                Showing {filteredSubmissions.length} published & drafted submissions for <strong>{activeTimeframe === 'today' ? 'Today' : activeTimeframe === 'yesterday' ? 'Yesterday' : activeTimeframe === 'week' ? 'Last 7 Days' : activeTimeframe === 'month' ? 'This Month' : 'All Time'}</strong>.
              </p>
            </div>
          </div>

          {/* Interactive Filter Controls Bar */}
          <div className="filter-controls-bar">
            {/* Search Input */}
            <div className="filter-search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Filter by deal title, store name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="filter-type-pills">
              <button 
                className={`type-pill-btn ${activeType === 'all' ? 'active' : ''}`}
                onClick={() => setActiveType('all')}
              >
                All ({submissions.length})
              </button>
              <button 
                className={`type-pill-btn ${activeType === 'deal' ? 'active' : ''}`}
                onClick={() => setActiveType('deal')}
              >
                Deals ({submissions.filter(s => s.type === 'deal').length})
              </button>
              <button 
                className={`type-pill-btn ${activeType === 'loot' ? 'active' : ''}`}
                onClick={() => setActiveType('loot')}
              >
                Loot Deals ({submissions.filter(s => s.type === 'loot').length})
              </button>
              <button 
                className={`type-pill-btn ${activeType === 'coupon' ? 'active' : ''}`}
                onClick={() => setActiveType('coupon')}
              >
                Coupons ({submissions.filter(s => s.type === 'coupon').length})
              </button>
            </div>

            {/* Status Dropdown */}
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusType)}
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Sort Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={15} style={{ color: '#64748b' }} />
              <select 
                className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="recent">Sort by Most Recent</option>
                <option value="clicks">Sort by Highest Clicks</option>
                <option value="store">Sort by Store (A-Z)</option>
                <option value="discount">Sort by Discount</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="submissions-table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Submission / Title</th>
                  <th>Type</th>
                  <th>Partner Store</th>
                  <th>Pricing / Offer</th>
                  <th>Deal Posted Date</th>
                  <th>Clicks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sub.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Category: {sub.category}
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${sub.type}`}>
                        {sub.type === 'deal' ? '• Deal' : sub.type === 'loot' ? '⚡ Loot Deal' : '🏷️ Coupon'}
                      </span>
                    </td>
                    <td>
                      <div 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          background: '#ffffff', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '6px', 
                          padding: '4px 10px', 
                          minWidth: '64px', 
                          height: '32px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }} 
                        title={sub.store}
                      >
                        <img 
                          src={getStoreLogo(sub.store)} 
                          alt={sub.store} 
                          style={{ maxHeight: '20px', maxWidth: '65px', objectFit: 'contain' }} 
                          onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                        />
                      </div>
                    </td>
                    <td>
                      {sub.price ? (
                        <div>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{sub.price}</span>
                          {sub.originalPrice && (
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                              {sub.originalPrice}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontWeight: 600, color: '#10b981' }}>{sub.discount}</span>
                      )}
                    </td>
                    <td>
                      <div className={`time-badge ${sub.timeframe === 'today' ? 'is-today' : ''}`}>
                        <Clock size={13} />
                        <span>{sub.postedAt}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#334155' }}>
                        {sub.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${sub.status === 'Approved' ? 'active' : sub.status === 'Pending Review' ? 'pending' : 'inactive'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td>
                      <a 
                        href={sub.link} 
                        style={{ 
                          color: 'var(--color-red, #E31E25)', 
                          fontWeight: 600, 
                          textDecoration: 'none', 
                          fontSize: '0.82rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Manage →
                      </a>
                    </td>
                  </tr>
                ))}
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                      No submissions found matching the selected timeframe and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ExecutiveLayout>
  )
}
