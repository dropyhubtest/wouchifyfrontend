import React, { useEffect, useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { getStoreLogo, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
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
import { TableRowSkeleton, EmptyState } from '../../../components/common/Skeletons'
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

// Day-wise velocity for chart
export const ExecutiveDashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null)
  const [greeting, setGreeting] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [rawLoot, setRawLoot] = useState<any[]>([])
  const [rawCoupons, setRawCoupons] = useState<any[]>([])
  const [rawStores, setRawStores] = useState<any[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  // Filter States
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeType>('today')
  const [activeType, setActiveType] = useState<EntityType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType>('all')
  const [sortOption, setSortOption] = useState<SortOption>('recent')

  const [globalStats, setGlobalStats] = useState({
    deals: 0,
    loot: 0,
    stores: 0,
    coupons: 0,
    clicks: 0,
    pending: 0,
    expired: 0
  })

  const loadLiveData = async () => {
    setLoadingSubmissions(true)
    try {
      const [dealsRes, lootRes, couponsRes, storesRes, subsRes] = await Promise.all([
        adminApi.getDeals().catch(() => []),
        adminApi.getLootDeals().catch(() => []),
        adminApi.getCoupons().catch(() => []),
        adminApi.getStores().catch(() => []),
        adminApi.getSubmissions().catch(() => [])
      ])

      const deals = Array.isArray(dealsRes) ? dealsRes : []
      const loot = Array.isArray(lootRes) ? lootRes : []
      const coupons = Array.isArray(couponsRes) ? couponsRes : []
      const stores = Array.isArray(storesRes) ? storesRes : []
      const subs = Array.isArray(subsRes) ? subsRes : []

      setRawDeals(deals)
      setRawLoot(loot)
      setRawCoupons(coupons)
      setRawStores(stores)

      const dealClicks = deals.reduce((sum: number, d: any) => sum + (parseInt(String(d.clicks || 0)) || 0), 0)
      const lootClicks = loot.reduce((sum: number, d: any) => sum + (parseInt(String(d.clicks || 0)) || 0), 0)
      const couponClicks = coupons.reduce((sum: number, c: any) => sum + (parseInt(String(c.usageCount || c.clicks || 0)) || 0), 0)
      const storeClicks = stores.reduce((sum: number, s: any) => sum + (parseInt(String(s.clicks || 0)) || 0), 0)
      const totalClicks = dealClicks + lootClicks + couponClicks + storeClicks

      const pendingCount = subs.filter((s: any) => s.status === 'Pending Approval' || s.status === 'Pending Review' || s.status === 'pending').length
      const expiredCount = deals.filter((d: any) => d.status === 'expired').length + coupons.filter((c: any) => c.status === 'expired').length

      setGlobalStats({
        deals: deals.length,
        loot: loot.length,
        stores: stores.length,
        coupons: coupons.length,
        clicks: totalClicks,
        pending: pendingCount,
        expired: expiredCount
      })

      // Build unified live submissions & activity items
      const mappedSubs: SubmissionItem[] = subs.map((s: any, idx: number) => {
        const subDate = s.submittedAt || s.createdAt ? new Date(s.submittedAt || s.createdAt) : new Date()
        const now = new Date()
        const diffHours = (now.getTime() - subDate.getTime()) / (1000 * 60 * 60)
        let tf: 'today' | 'yesterday' | 'week' | 'month' | 'older' = 'today'
        if (diffHours > 24 && diffHours <= 48) tf = 'yesterday'
        else if (diffHours > 48 && diffHours <= 168) tf = 'week'
        else if (diffHours > 168 && diffHours <= 720) tf = 'month'
        else if (diffHours > 720) tf = 'older'

        return {
          id: s.id || s._id || `sub-live-${idx}`,
          title: s.title || s.dataSnapshot?.title || s.dataSnapshot?.name || 'Untitled Item',
          type: (s.entityType === 'loot_deal' ? 'loot' : s.entityType === 'coupon' ? 'coupon' : 'deal') as 'deal' | 'loot' | 'coupon',
          store: s.store || s.dataSnapshot?.store || s.dataSnapshot?.storeName || 'Partner Store',
          category: s.category || s.dataSnapshot?.category || 'General',
          price: s.dataSnapshot?.price || s.dataSnapshot?.currentPrice || s.dataSnapshot?.reward || '',
          originalPrice: s.dataSnapshot?.originalPrice || '',
          discount: s.dataSnapshot?.discount || 'Special Offer',
          postedAt: subDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          timeframe: tf,
          status: (s.status === 'Approved' ? 'Approved' : s.status === 'Rejected' ? 'Draft' : 'Pending Review') as 'Approved' | 'Pending Review' | 'Draft',
          clicks: s.dataSnapshot?.clicks || 0,
          link: s.entityType === 'loot_deal' ? '/executive/loot-deals' : s.entityType === 'coupon' ? '/executive/coupons' : '/executive/deals'
        }
      })

      // Also merge active published deals, loots, and coupons
      const publishedDealItems: SubmissionItem[] = deals.map((d: any, idx: number) => {
        const itemDate = d.createdAt ? new Date(d.createdAt) : new Date()
        const diffHours = (Date.now() - itemDate.getTime()) / (1000 * 60 * 60)
        let tf: 'today' | 'yesterday' | 'week' | 'month' | 'older' = 'today'
        if (diffHours > 24 && diffHours <= 48) tf = 'yesterday'
        else if (diffHours > 48 && diffHours <= 168) tf = 'week'
        else if (diffHours > 168 && diffHours <= 720) tf = 'month'
        else if (diffHours > 720) tf = 'older'

        return {
          id: String(d._id || d.id || `deal-${idx}`),
          title: d.name || d.title || 'Deal Item',
          type: 'deal' as const,
          store: d.store || 'Amazon',
          category: d.category || 'Electronics',
          price: d.price || '₹999',
          originalPrice: d.originalPrice || '',
          discount: d.discount || 'Special Offer',
          postedAt: itemDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          timeframe: tf,
          status: (d.status === 'active' ? 'Approved' : d.status === 'pending' ? 'Pending Review' : 'Draft') as 'Approved' | 'Pending Review' | 'Draft',
          clicks: d.clicks || 0,
          link: '/executive/deals'
        }
      })

      const publishedLootItems: SubmissionItem[] = loot.map((l: any, idx: number) => {
        const itemDate = l.createdAt ? new Date(l.createdAt) : new Date()
        const diffHours = (Date.now() - itemDate.getTime()) / (1000 * 60 * 60)
        let tf: 'today' | 'yesterday' | 'week' | 'month' | 'older' = 'today'
        if (diffHours > 24 && diffHours <= 48) tf = 'yesterday'
        else if (diffHours > 48 && diffHours <= 168) tf = 'week'
        else if (diffHours > 168 && diffHours <= 720) tf = 'month'
        else if (diffHours > 720) tf = 'older'

        return {
          id: String(l._id || l.id || `loot-${idx}`),
          title: l.title || 'Flash Loot Offer',
          type: 'loot' as const,
          store: l.storeName || l.store || 'Amazon',
          category: l.category || 'Electronics',
          price: l.currentPrice || l.price || '₹499',
          originalPrice: l.originalPrice || '',
          discount: l.discount || '80% OFF',
          postedAt: itemDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          timeframe: tf,
          status: (l.status === 'active' ? 'Approved' : 'Draft') as 'Approved' | 'Pending Review' | 'Draft',
          clicks: l.clicks || 0,
          link: '/executive/loot-deals'
        }
      })

      const publishedCouponItems: SubmissionItem[] = coupons.map((c: any, idx: number) => {
        const itemDate = c.createdAt ? new Date(c.createdAt) : new Date()
        const diffHours = (Date.now() - itemDate.getTime()) / (1000 * 60 * 60)
        let tf: 'today' | 'yesterday' | 'week' | 'month' | 'older' = 'today'
        if (diffHours > 24 && diffHours <= 48) tf = 'yesterday'
        else if (diffHours > 48 && diffHours <= 168) tf = 'week'
        else if (diffHours > 168 && diffHours <= 720) tf = 'month'
        else if (diffHours > 720) tf = 'older'

        return {
          id: String(c._id || c.id || `coupon-${idx}`),
          title: `${c.store || 'Store'} Promo Code: ${c.code || 'COUPON'}`,
          type: 'coupon' as const,
          store: c.store || 'Amazon',
          category: c.category || 'General',
          price: c.code || 'CODE',
          originalPrice: '',
          discount: c.discount || 'Special Discount',
          postedAt: itemDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          timeframe: tf,
          status: (c.status === 'active' ? 'Approved' : 'Draft') as 'Approved' | 'Pending Review' | 'Draft',
          clicks: c.usageCount || c.clicks || 0,
          link: '/executive/coupons'
        }
      })

      // Combine and deduplicate
      const allPublished = [...publishedDealItems, ...publishedLootItems, ...publishedCouponItems]
      const combined = [...mappedSubs, ...allPublished.filter(p => !mappedSubs.some(s => s.id === p.id))]
      setSubmissions(combined)
    } catch (e) {
      console.error('Failed to load dashboard data:', e)
      setSubmissions([])
    } finally {
      setLoadingSubmissions(false)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('staffUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    loadLiveData()

    const handleSync = () => {
      loadLiveData()
    }

    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('wouchify_loot_deals_updated', handleSync)
    window.addEventListener('wouchify_coupons_updated', handleSync)
    window.addEventListener('wouchify_stores_updated', handleSync)
    window.addEventListener('wouchify_deal_clicked', handleSync)
    window.addEventListener('wouchify_store_clicked', handleSync)
    window.addEventListener('wouchify_coupon_clicked', handleSync)
    window.addEventListener('wouchify_credit_card_clicked', handleSync)
    window.addEventListener('wouchify_banner_clicked', handleSync)
    window.addEventListener('wouchify_ad_clicked', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('wouchify_loot_deals_updated', handleSync)
      window.removeEventListener('wouchify_coupons_updated', handleSync)
      window.removeEventListener('wouchify_stores_updated', handleSync)
      window.removeEventListener('wouchify_deal_clicked', handleSync)
      window.removeEventListener('wouchify_store_clicked', handleSync)
      window.removeEventListener('wouchify_coupon_clicked', handleSync)
      window.removeEventListener('wouchify_credit_card_clicked', handleSync)
      window.removeEventListener('wouchify_banner_clicked', handleSync)
      window.removeEventListener('wouchify_ad_clicked', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const totalDealsGlobal = globalStats.deals
  const totalLootGlobal = globalStats.loot
  const totalStoresGlobal = globalStats.stores
  const totalCouponsGlobal = globalStats.coupons
  const totalClicksGlobal = globalStats.clicks

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
  }, [submissions, activeTimeframe, activeType, statusFilter, searchTerm, sortOption])

  // Dynamically computed weekly velocity data
  const dynamicWeeklyPostingData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const result = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dayName = i === 0 ? 'Today' : days[d.getDay()]
      const isToday = i === 0

      // Match items created on that day
      const dealsCount = rawDeals.filter(item => {
        if (!item.createdAt) return i === 0 // default to today if no date
        const itemDate = new Date(item.createdAt)
        return itemDate.toDateString() === d.toDateString()
      }).length

      const lootCount = rawLoot.filter(item => {
        if (!item.createdAt) return i === 0
        const itemDate = new Date(item.createdAt)
        return itemDate.toDateString() === d.toDateString()
      }).length

      const couponsCount = rawCoupons.filter(item => {
        if (!item.createdAt) return i === 0
        const itemDate = new Date(item.createdAt)
        return itemDate.toDateString() === d.toDateString()
      }).length

      result.push({
        day: dayName,
        deals: dealsCount,
        loot: lootCount,
        coupons: couponsCount,
        isToday
      })
    }
    return result
  }, [rawDeals, rawLoot, rawCoupons])

  // Dynamically computed top stores breakdown from live deals and loot
  const dynamicTopStoresBreakdown = useMemo(() => {
    const storeCountMap: Record<string, number> = {}
    
    // Count from deals
    rawDeals.forEach((d: any) => {
      const storeName = d.store || 'Amazon'
      storeCountMap[storeName] = (storeCountMap[storeName] || 0) + 1
    })

    // Count from loot
    rawLoot.forEach((l: any) => {
      const storeName = l.storeName || l.store || 'Amazon'
      storeCountMap[storeName] = (storeCountMap[storeName] || 0) + 1
    })

    // Count from stores list if not already present
    rawStores.forEach((s: any) => {
      if (!storeCountMap[s.name]) {
        storeCountMap[s.name] = s.totalDeals || 0
      }
    })

    const entries = Object.entries(storeCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const maxCount = Math.max(...entries.map(e => e.count), 1)
    const colors = ['#f97316', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6']

    return entries.map((st, idx) => ({
      ...st,
      fill: Math.round((st.count / maxCount) * 100),
      color: colors[idx % colors.length]
    }))
  }, [rawDeals, rawLoot, rawStores])

  const totalExpiredGlobal = globalStats.expired
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
              {dynamicWeeklyPostingData.map((item) => {
                const maxVal = Math.max(...dynamicWeeklyPostingData.flatMap(d => [d.deals, d.loot, d.coupons]), 5)
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
              {dynamicTopStoresBreakdown.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No store offers recorded yet
                </div>
              ) : dynamicTopStoresBreakdown.map((st) => (
                <div key={st.name} className="breakdown-row">
                  <div className="breakdown-row-header">
                    <div className="breakdown-store-name">
                      <img 
                        src={getStoreLogo(st.name)} 
                        alt={st.name} 
                        style={{ height: '14px', maxWidth: '30px', objectFit: 'contain' }} 
                        onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                      />
                      <span>{st.name}</span>
                    </div>
                    <span className="breakdown-count-badge">{st.count} offers</span>
                  </div>
                  <div className="breakdown-progress-track">
                    <div 
                      className="breakdown-progress-fill" 
                      style={{ width: `${Math.max(st.fill, 8)}%`, backgroundColor: st.color }} 
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
                {loadingSubmissions ? (
                  <TableRowSkeleton columns={8} rows={5} />
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px' }}>
                      <EmptyState
                        icon="📋"
                        title="No submissions found"
                        description={searchTerm || activeType !== 'all' || statusFilter !== 'all' ? "No submissions match your filter criteria." : "No submissions logged for this timeframe."}
                      />
                    </td>
                  </tr>
                ) : filteredSubmissions.map((sub) => (
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
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ExecutiveLayout>
  )
}
