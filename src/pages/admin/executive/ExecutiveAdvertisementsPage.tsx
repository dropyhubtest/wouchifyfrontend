import React, { useState, useMemo, useRef } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Megaphone,
  Upload,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  DollarSign,
  MousePointer
} from 'lucide-react'
import './ExecutiveShared.css'

/* ============================================================
   Types & Config
   ============================================================ */

export type AdPlacementType =
  | 'sidebar-300x250'
  | 'leaderboard-728x90'
  | 'billboard-300x600'
  | 'store-card-360x180'
  | 'bottom-strip-full'
  | 'coupon-box-250x250'
  | 'popup-modal-500x350'
  | 'header-ribbon-1920x40'

export type AdStatus = 'active' | 'inactive' | 'paused' | 'scheduled'

export interface Advertisement {
  id: string
  title: string
  advertiser: string
  placement: AdPlacementType
  imageUrl: string
  targetLink: string
  ctaText: string
  badgeText: string
  pricingModel: 'CPM' | 'CPC' | 'Flat Monthly' | 'Affiliate'
  budgetOrRate: string
  status: AdStatus
  expiryDate: string       // Mandatory (YYYY-MM-DD)
  impressions: number
  clicks: number
  createdAt: string
}

export interface AdPlacementConfig {
  value: AdPlacementType
  label: string
  slotName: string
  recommendedSize: string
  aspectRatio: string
}

export const AD_PLACEMENTS: AdPlacementConfig[] = [
  {
    value: 'sidebar-300x250',
    label: 'Home & Deals Sidebar (300 × 250)',
    slotName: 'Medium Rectangle Sidebar',
    recommendedSize: '300 × 250 px',
    aspectRatio: '6:5'
  },
  {
    value: 'leaderboard-728x90',
    label: 'In-Feed Leaderboard (728 × 90)',
    slotName: 'Horizontal Feed Banner',
    recommendedSize: '728 × 90 px',
    aspectRatio: '8:1'
  },
  {
    value: 'billboard-300x600',
    label: 'Sticky Side Billboard (300 × 600)',
    slotName: 'Half Page Skyscraper',
    recommendedSize: '300 × 600 px',
    aspectRatio: '1:2'
  },
  {
    value: 'store-card-360x180',
    label: 'Sponsored Brand Card (360 × 180)',
    slotName: 'Stores Hub Spotlight',
    recommendedSize: '360 × 180 px',
    aspectRatio: '2:1'
  },
  {
    value: 'bottom-strip-full',
    label: 'Floating Bottom Strip (Full Width)',
    slotName: 'Sticky Bottom Bar',
    recommendedSize: '1200 × 80 px',
    aspectRatio: '15:1'
  },
  {
    value: 'coupon-box-250x250',
    label: 'Coupon Details Box (250 × 250)',
    slotName: 'Square Sponsor Tile',
    recommendedSize: '250 × 250 px',
    aspectRatio: '1:1'
  },
  {
    value: 'popup-modal-500x350',
    label: 'Exit-Intent Dialog Popup (500 × 350)',
    slotName: 'High Conversion Modal',
    recommendedSize: '500 × 350 px',
    aspectRatio: '10:7'
  },
  {
    value: 'header-ribbon-1920x40',
    label: 'Top Announcement Ribbon (1920 × 40)',
    slotName: 'Sitewide Header Strip',
    recommendedSize: '1920 × 40 px',
    aspectRatio: '48:1'
  }
]

function getPlacementConfig(val: AdPlacementType): AdPlacementConfig {
  return AD_PLACEMENTS.find(p => p.value === val) || AD_PLACEMENTS[0]
}

function daysLeft(expiryDate: string): number {
  if (!expiryDate) return 0
  const now = new Date()
  const exp = new Date(expiryDate)
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function expiryPill(days: number) {
  if (days < 0) return { label: 'Campaign Ended', bg: '#fee2e2', color: '#ef4444' }
  if (days === 0) return { label: 'Ends Today', bg: '#fef3c7', color: '#d97706' }
  if (days <= 3) return { label: `${days}d left (Ending)`, bg: '#fee2e2', color: '#dc2626' }
  if (days <= 7) return { label: `${days}d left`, bg: '#fef3c7', color: '#d97706' }
  return { label: `${days} days left`, bg: '#dcfce7', color: '#15803d' }
}

function statusConfig(status: AdStatus) {
  switch (status) {
    case 'active': return { label: 'Active', bg: '#dcfce7', color: '#16a34a' }
    case 'inactive': return { label: 'Inactive', bg: '#f1f5f9', color: '#64748b' }
    case 'paused': return { label: 'Paused', bg: '#fef3c7', color: '#d97706' }
    case 'scheduled': return { label: 'Scheduled', bg: '#e0f2fe', color: '#0284c7' }
  }
}

/* ============================================================
   Mock Seed Data
   ============================================================ */

const MOCK_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'SBI SimplyCLICK Card 10X Points Campaign',
    advertiser: 'SBI Cards',
    placement: 'sidebar-300x250',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    targetLink: '/executive/credit-cards',
    ctaText: 'Apply in 2 Mins',
    badgeText: 'SPONSORED',
    pricingModel: 'CPC',
    budgetOrRate: '₹18 / click',
    status: 'active',
    expiryDate: '2026-10-31',
    impressions: 54200,
    clicks: 4890,
    createdAt: '2026-09-01'
  },
  {
    id: 'ad-2',
    title: 'Amazon Great Indian Festival Early Access',
    advertiser: 'Amazon India',
    placement: 'leaderboard-728x90',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    targetLink: 'https://amazon.in',
    ctaText: 'Shop Prime Deals',
    badgeText: 'FEATURED PARTNER',
    pricingModel: 'CPM',
    budgetOrRate: '₹120 / CPM',
    status: 'active',
    expiryDate: '2026-11-15',
    impressions: 98000,
    clicks: 8120,
    createdAt: '2026-09-02'
  },
  {
    id: 'ad-3',
    title: 'Hostinger 75% Off Web Hosting + Free Domain',
    advertiser: 'Hostinger India',
    placement: 'billboard-300x600',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    targetLink: 'https://hostinger.in',
    ctaText: 'Claim 75% Off',
    badgeText: 'ADVERTISEMENT',
    pricingModel: 'Flat Monthly',
    budgetOrRate: '₹35,000 / mo',
    status: 'active',
    expiryDate: '2026-09-28',
    impressions: 32000,
    clicks: 2900,
    createdAt: '2026-09-03'
  },
  {
    id: 'ad-4',
    title: 'Swiggy Gourmet Flat ₹150 OFF Voucher',
    advertiser: 'Swiggy Gourmet',
    placement: 'popup-modal-500x350',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    targetLink: '/executive/coupons',
    ctaText: 'Order Food Now',
    badgeText: 'LIMITED SPONSOR',
    pricingModel: 'CPC',
    budgetOrRate: '₹14 / click',
    status: 'paused',
    expiryDate: '2026-10-10',
    impressions: 16400,
    clicks: 1420,
    createdAt: '2026-09-04'
  },
  {
    id: 'ad-5',
    title: 'Myntra End of Reason Sale Brand Showcase',
    advertiser: 'Myntra Fashion',
    placement: 'store-card-360x180',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
    targetLink: '/stores',
    ctaText: 'Explore Styles',
    badgeText: 'PROMOTED BRAND',
    pricingModel: 'Flat Monthly',
    budgetOrRate: '₹40,000 / mo',
    status: 'scheduled',
    expiryDate: '2026-12-25',
    impressions: 0,
    clicks: 0,
    createdAt: '2026-09-08'
  }
]

/* ============================================================
   Dynamic Live Ad Slot Preview Component
   ============================================================ */

export const AdSlotPreview: React.FC<{ ad: Partial<Advertisement> }> = ({ ad }) => {
  const placement = ad.placement || 'sidebar-300x250'
  const img = ad.imageUrl || 'https://via.placeholder.com/300x200?text=Ad+Creative+Image'
  const badge = ad.badgeText || 'SPONSORED'
  const cta = ad.ctaText || 'Learn More'

  // 1. Sidebar Rectangle (300 x 250)
  if (placement === 'sidebar-300x250') {
    return (
      <div style={{
        background: 'white',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px' }}>
            {badge}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ad.advertiser || 'Sponsor'}</span>
        </div>

        <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
          <img src={img} alt="Ad Creative" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', marginBottom: '8px', lineHeight: 1.25 }}>
          {ad.title || 'Sponsored Campaign Title'}
        </div>

        <div style={{
          background: '#ef4444',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {cta} →
        </div>
      </div>
    )
  }

  // 2. Leaderboard (728 x 90)
  if (placement === 'leaderboard-728x90') {
    return (
      <div style={{
        background: '#0f172a',
        borderRadius: '8px',
        padding: '10px 14px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={img} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>
              {badge} · {ad.advertiser || 'Brand'}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              {ad.title || 'Leaderboard Ad Headline'}
            </div>
          </div>
        </div>

        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          flexShrink: 0
        }}>
          {cta}
        </div>
      </div>
    )
  }

  // 3. Half-Page Sticky Billboard (300 x 600)
  if (placement === 'billboard-300x600') {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: '10px',
        padding: '14px',
        color: 'white',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '0.62rem', color: '#c7d2fe', fontWeight: 700, marginBottom: '8px' }}>
          {badge} · {ad.advertiser}
        </div>
        <div style={{ width: '100%', height: '110px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
          <img src={img} alt="Billboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '6px' }}>
          {ad.title}
        </div>
        <p style={{ fontSize: '0.72rem', color: '#e0e7ff', marginBottom: '12px' }}>
          Exclusive sponsor promotion for active desktop shoppers.
        </p>
        <div style={{
          background: '#4f46e5',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {cta}
        </div>
      </div>
    )
  }

  // 4. Popup Dialog Modal (500 x 350)
  if (placement === 'popup-modal-500x350') {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #ef4444',
        padding: '16px',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '10px' }}>
          {badge}
        </span>
        <div style={{ width: '100%', height: '90px', borderRadius: '6px', overflow: 'hidden', margin: '8px 0' }}>
          <img src={img} alt="Popup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
          {ad.title}
        </div>
        <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '10px' }}>
          Sponsored by {ad.advertiser || 'Partner'}
        </div>
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '0.82rem',
          fontWeight: 800
        }}>
          {cta}
        </div>
      </div>
    )
  }

  // 5. Default Card Simulation
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
        {badge} · {ad.advertiser || 'Sponsor'}
      </div>
      <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
        <img src={img} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '6px' }}>
        {ad.title}
      </div>
      <div style={{
        background: '#ef4444',
        color: 'white',
        textAlign: 'center',
        padding: '6px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 700
      }}>
        {cta}
      </div>
    </div>
  )
}

/* ============================================================
   Main Advertisements Management Component
   ============================================================ */

export const ExecutiveAdvertisementsPage: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>(MOCK_ADS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlacement, setFilterPlacement] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'clicks' | 'expiry' | 'impressions' | 'title'>('clicks')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [previewingAd, setPreviewingAd] = useState<Advertisement | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<Advertisement>>({
    title: '',
    advertiser: '',
    placement: 'sidebar-300x250',
    imageUrl: '',
    targetLink: '',
    ctaText: 'Shop Now',
    badgeText: 'SPONSORED',
    pricingModel: 'CPC',
    budgetOrRate: '',
    status: 'active',
    expiryDate: ''
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Top KPI Metrics
  const kpi = useMemo(() => {
    const total = ads.length
    const active = ads.filter(a => a.status === 'active').length
    const expiringSoon = ads.filter(a => {
      const d = daysLeft(a.expiryDate)
      return d >= 0 && d <= 7 && a.status === 'active'
    }).length
    const totalImpressions = ads.reduce((acc, a) => acc + a.impressions, 0)
    const totalClicks = ads.reduce((acc, a) => acc + a.clicks, 0)
    return { total, active, expiringSoon, totalImpressions, totalClicks }
  }, [ads])

  // Filtered List
  const filteredAds = useMemo(() => {
    let list = [...ads]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.advertiser.toLowerCase().includes(q) ||
        a.badgeText.toLowerCase().includes(q)
      )
    }

    if (filterPlacement !== 'all') {
      list = list.filter(a => a.placement === filterPlacement)
    }

    if (filterStatus !== 'all') {
      list = list.filter(a => a.status === filterStatus)
    }

    list.sort((a, b) => {
      if (sortBy === 'clicks') return b.clicks - a.clicks
      if (sortBy === 'impressions') return b.impressions - a.impressions
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      return 0
    })

    return list
  }, [ads, searchTerm, filterPlacement, filterStatus, sortBy])

  // Handlers
  const handleOpenAdd = () => {
    setEditingAd(null)
    const defaultExp = new Date()
    defaultExp.setDate(defaultExp.getDate() + 30)
    setFormData({
      title: '',
      advertiser: '',
      placement: 'sidebar-300x250',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
      targetLink: '',
      ctaText: 'Shop Now',
      badgeText: 'SPONSORED',
      pricingModel: 'CPC',
      budgetOrRate: '₹15 / click',
      status: 'active',
      expiryDate: defaultExp.toISOString().split('T')[0]
    })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    setFormData({ ...ad })
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ad campaign?')) {
      setAds(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const res = event.target?.result as string
      setFormData(prev => ({ ...prev, imageUrl: res }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title?.trim()) {
      alert('Campaign Title is required.')
      return
    }

    if (!formData.advertiser?.trim()) {
      alert('Advertiser / Brand Name is required.')
      return
    }

    if (!formData.expiryDate) {
      alert('Advertisement Campaign Expiry Date is mandatory.')
      return
    }

    if (editingAd) {
      setAds(prev => prev.map(a => a.id === editingAd.id ? { ...a, ...(formData as Advertisement) } : a))
    } else {
      const newAd: Advertisement = {
        id: `ad-${Date.now()}`,
        title: formData.title || 'New Ad Campaign',
        advertiser: formData.advertiser || 'Brand Partner',
        placement: formData.placement || 'sidebar-300x250',
        imageUrl: formData.imageUrl || '',
        targetLink: formData.targetLink || 'https://wouchify.com',
        ctaText: formData.ctaText || 'Shop Now',
        badgeText: formData.badgeText || 'SPONSORED',
        pricingModel: formData.pricingModel || 'CPC',
        budgetOrRate: formData.budgetOrRate || '₹10 / click',
        status: formData.status || 'active',
        expiryDate: formData.expiryDate || '',
        impressions: 0,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setAds(prev => [newAd, ...prev])
    }

    setIsFormOpen(false)
  }

  return (
    <ExecutiveLayout activeMenu="advertisements">
      <div className="executive-crud-page">
        {/* ── Header ── */}
        <div className="crud-header" style={{ marginBottom: '20px' }}>
          <div>
            <h2 className="crud-title">Advertisements Console</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Manage sponsored banner slots, affiliate creative placements, and client campaigns with mandatory expiry dates.
            </p>
          </div>
          <button className="crud-add-btn" onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Ad
          </button>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon" style={{ marginBottom: '24px' }}>
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Megaphone size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.total}</span>
              <span className="kpi-label">Total Campaigns</span>
              <span className="kpi-sub">Ad slots registered</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.active}</span>
              <span className="kpi-label">Active Ads</span>
              <span className="kpi-sub">Serving impressions</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Clock size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.expiringSoon}</span>
              <span className="kpi-label">Expiring Soon</span>
              <span className="kpi-sub">Within next 7 days</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <MousePointer size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{(kpi.totalClicks / 1000).toFixed(1)}k</span>
              <span className="kpi-label">Total Clicks</span>
              <span className="kpi-sub">Outbound referrals</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <DollarSign size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{(kpi.totalImpressions / 1000).toFixed(0)}k</span>
              <span className="kpi-label">Impressions</span>
              <span className="kpi-sub">Ad displays</span>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="crud-filters" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="crud-search" style={{ minWidth: '280px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by campaign title or advertiser..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterPlacement}
            onChange={(e) => setFilterPlacement(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.9rem',
              color: '#334155'
            }}
          >
            <option value="all">All Placement Slots</option>
            {AD_PLACEMENTS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.9rem',
              color: '#334155'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.9rem',
              color: '#334155'
            }}
          >
            <option value="clicks">Sort by Clicks (Highest)</option>
            <option value="expiry">Sort by Expiry Date (Closest)</option>
            <option value="impressions">Sort by Impressions</option>
            <option value="title">Sort by Title</option>
          </select>

          {(searchTerm || filterPlacement !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilterPlacement('all'); setFilterStatus('all'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Creative</th>
                <th>Campaign Title & Advertiser</th>
                <th>Placement Slot</th>
                <th>Target URL & CTA</th>
                <th>Pricing Model</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAds.map(ad => {
                const days = daysLeft(ad.expiryDate)
                const pill = expiryPill(days)
                const stat = statusConfig(ad.status)
                const placeCfg = getPlacementConfig(ad.placement)

                return (
                  <tr key={ad.id}>
                    <td>
                      <div style={{
                        width: '80px',
                        height: '50px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                      }}>
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                        {ad.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{ad.badgeText}</span>
                        {' · '}
                        <span>{ad.advertiser}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{
                        display: 'inline-block',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#334155'
                      }}>
                        {placeCfg.slotName}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                        {placeCfg.recommendedSize}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
                        CTA: {ad.ctaText}
                      </div>
                      <a
                        href={ad.targetLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.76rem',
                          color: '#3b82f6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          textDecoration: 'none',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ad.targetLink} <ExternalLink size={11} />
                      </a>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                        {ad.pricingModel}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                        {ad.budgetOrRate}
                      </div>
                    </td>

                    <td>
                      <div style={{
                        display: 'inline-block',
                        background: pill.bg,
                        color: pill.color,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        {pill.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        {ad.expiryDate}
                      </div>
                    </td>

                    <td>
                      <span style={{
                        display: 'inline-block',
                        background: stat.bg,
                        color: stat.color,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}>
                        {stat.label}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="action-btn"
                          title="Preview Ad"
                          onClick={() => setPreviewingAd(ad)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn"
                          title="Edit Ad"
                          onClick={() => handleOpenEdit(ad)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📢</div>
                    <div style={{ fontWeight: 600, color: '#475569' }}>No advertisement campaigns found</div>
                    <div style={{ fontSize: '0.85rem' }}>Try adjusting your filters or click "+ Add New Ad"</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ============================================================
            ADD / EDIT AD MODAL
            ============================================================ */}
        {isFormOpen && (
          <div className="crud-modal-overlay">
            <div className="crud-modal" style={{ maxWidth: '980px', width: '94%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <div>
                  <h3 className="modal-title">
                    {editingAd ? 'Edit Ad Campaign' : 'Create Advertisement Campaign'}
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Placement: <strong>{getPlacementConfig(formData.placement || 'sidebar-300x250').label}</strong>
                  </p>
                </div>
                <button className="modal-close" onClick={() => setIsFormOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="modal-body" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 320px',
                    gap: '24px',
                    alignItems: 'start'
                  }}>
                    {/* Left Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontWeight: 700, color: '#0f172a' }}>
                          Placement Slot *
                        </label>
                        <select
                          value={formData.placement || 'sidebar-300x250'}
                          onChange={(e) => setFormData(f => ({ ...f, placement: e.target.value as AdPlacementType }))}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontWeight: 600,
                            background: '#f8fafc',
                            fontSize: '0.92rem'
                          }}
                        >
                          {AD_PLACEMENTS.map(p => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label style={{ fontWeight: 700, color: '#0f172a' }}>
                            Campaign Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. SBI SimplyCLICK 10X Points"
                            value={formData.title || ''}
                            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontWeight: 700, color: '#0f172a' }}>
                            Advertiser / Brand Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. SBI Cards, Amazon, Myntra"
                            value={formData.advertiser || ''}
                            onChange={(e) => setFormData(f => ({ ...f, advertiser: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Sponsor Badge Tag</label>
                          <input
                            type="text"
                            placeholder="e.g. SPONSORED, PROMOTED"
                            value={formData.badgeText || ''}
                            onChange={(e) => setFormData(f => ({ ...f, badgeText: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>CTA Button Label *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Shop Now, Apply Now"
                            value={formData.ctaText || ''}
                            onChange={(e) => setFormData(f => ({ ...f, ctaText: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label style={{ fontWeight: 700, color: '#0f172a' }}>
                          Destination / Affiliate Link *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://brand.com/offer?utm_source=wouchify"
                          value={formData.targetLink || ''}
                          onChange={(e) => setFormData(f => ({ ...f, targetLink: e.target.value }))}
                        />
                      </div>

                      {/* Creative Image with URL + Upload */}
                      <div className="form-group">
                        <label style={{ fontWeight: 700, color: '#0f172a' }}>
                          Ad Creative Image (URL + File Upload) *
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="https://... or upload local image file"
                            value={formData.imageUrl || ''}
                            onChange={(e) => setFormData(f => ({ ...f, imageUrl: e.target.value }))}
                            style={{ flex: 1 }}
                          />
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              padding: '10px 14px',
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Upload size={15} /> Upload
                          </button>
                        </div>
                      </div>

                      {/* Pricing Model & Budget */}
                      <div className="form-row">
                        <div className="form-group">
                          <label>Billing Model</label>
                          <select
                            value={formData.pricingModel || 'CPC'}
                            onChange={(e) => setFormData(f => ({ ...f, pricingModel: e.target.value as any }))}
                          >
                            <option value="CPC">CPC (Cost Per Click)</option>
                            <option value="CPM">CPM (Cost Per 1000 Views)</option>
                            <option value="Flat Monthly">Flat Monthly Retainer</option>
                            <option value="Affiliate">Affiliate Commission</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Rate / Budget Info</label>
                          <input
                            type="text"
                            placeholder="e.g. ₹15 / click or ₹25,000 / mo"
                            value={formData.budgetOrRate || ''}
                            onChange={(e) => setFormData(f => ({ ...f, budgetOrRate: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Mandatory Expiry Date & Status */}
                      <div className="form-row" style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> Campaign Expiry Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.expiryDate || ''}
                            onChange={(e) => setFormData(f => ({ ...f, expiryDate: e.target.value }))}
                            style={{ borderColor: '#fca5a5' }}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Campaign Status</label>
                          <select
                            value={formData.status || 'active'}
                            onChange={(e) => setFormData(f => ({ ...f, status: e.target.value as AdStatus }))}
                          >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="inactive">Inactive</option>
                            <option value="scheduled">Scheduled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Right Sticky Preview */}
                    <div style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                        Live Ad Slot Render
                      </div>

                      <AdSlotPreview ad={formData} />

                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '0.78rem',
                        color: '#475569'
                      }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          Placement Technicals
                        </div>
                        <div>• <strong>Slot:</strong> {getPlacementConfig(formData.placement || 'sidebar-300x250').slotName}</div>
                        <div>• <strong>Dimensions:</strong> {getPlacementConfig(formData.placement || 'sidebar-300x250').recommendedSize}</div>
                        <div>• <strong>Days Left:</strong> {formData.expiryDate ? `${daysLeft(formData.expiryDate)} days` : 'Not configured'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ flexShrink: 0 }}>
                  <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingAd ? 'Update Advertisement' : 'Launch Ad Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            PREVIEW MODAL
            ============================================================ */}
        {previewingAd && (
          <div className="crud-modal-overlay">
            <div className="crud-modal" style={{ maxWidth: '650px', width: '90%' }}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">{previewingAd.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Advertiser: <strong>{previewingAd.advertiser}</strong> · {getPlacementConfig(previewingAd.placement).slotName}
                  </div>
                </div>
                <button className="modal-close" onClick={() => setPreviewingAd(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    AD PLACEMENT PREVIEW
                  </div>
                  <AdSlotPreview ad={previewingAd} />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>EXPIRY DATE</div>
                    <div style={{ fontWeight: 700, color: '#dc2626' }}>
                      {previewingAd.expiryDate} ({daysLeft(previewingAd.expiryDate)}d left)
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>IMPRESSIONS</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {previewingAd.impressions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>TOTAL CLICKS</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {previewingAd.clicks.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setPreviewingAd(null)}>
                  Close
                </button>
                <button
                  className="btn-save"
                  onClick={() => {
                    const a = previewingAd
                    setPreviewingAd(null)
                    handleOpenEdit(a)
                  }}
                >
                  <Edit2 size={16} /> Edit Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExecutiveLayout>
  )
}
