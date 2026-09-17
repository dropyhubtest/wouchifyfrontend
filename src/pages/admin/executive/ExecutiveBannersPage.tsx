import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Image as ImageIcon,
  Upload,
  Calendar,
  Sparkles,
  ExternalLink,
  Flame,
  Zap,
  Store,
  Tag,
  CreditCard,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw,
  TrendingUp,
  Sliders,
  Palette
} from 'lucide-react'
import './ExecutiveShared.css'
import { AdminConfirmDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

import heroImage from '../../../assets/deals/hero/hero_image.png'
import { PLACEHOLDER_DEAL_IMAGE } from '../../../data/dealsPage'

/* ============================================================
   Types & Enums
   ============================================================ */

export type TargetPageType = 
  | 'home-hero'
  | 'stores-hero'
  | 'deals-hero'
  | 'loot-hero'
  | 'coupons-hero'
  | 'cards-hero'
  | 'festival-hero'
  | 'header-strip'

export type BannerStatus = 'active' | 'inactive' | 'scheduled'

export interface Banner {
  id: string
  title: string
  targetPage: TargetPageType
  badgeText: string
  headingLine1: string
  headingLine2: string
  headingLine3: string
  description: string
  ctaText: string
  targetLink: string
  primaryImage: string       // Main hero graphic / shopper / product
  secondaryImage?: string     // Cart graphic / secondary art / icon
  backgroundImage?: string    // Canvas backdrop / texture
  dealChip1?: string
  dealChip2?: string
  themeColor?: string        // Custom accent or gradient
  priority: number           // 1 - 10
  status: BannerStatus
  expiryDate: string         // Mandatory expiry date (YYYY-MM-DD)
  views: number
  clicks: number
  createdAt: string
}

/* ============================================================
   Target Page Meta Config
   ============================================================ */

interface TargetPageConfig {
  value: TargetPageType
  label: string
  pageName: string
  recommendedSize: string
  icon: React.ReactNode
  accentColor: string
}

export const TARGET_PAGES: TargetPageConfig[] = [
  {
    value: 'home-hero',
    label: 'Home Page Hero',
    pageName: 'Landing Page (Main)',
    recommendedSize: '1920 × 640 px',
    icon: <Sparkles size={16} />,
    accentColor: '#E31E25'
  },
  {
    value: 'stores-hero',
    label: 'Stores Page Hero',
    pageName: 'Stores Hub & Directory',
    recommendedSize: '1920 × 590 px',
    icon: <Store size={16} />,
    accentColor: '#f59e0b'
  },
  {
    value: 'deals-hero',
    label: 'Deals Page Top Banner',
    pageName: 'Deals Directory',
    recommendedSize: '1400 × 380 px',
    icon: <Zap size={16} />,
    accentColor: '#3b82f6'
  },
  {
    value: 'loot-hero',
    label: 'Loot Deals Flash Spotlight',
    pageName: 'Flash Loot Deals',
    recommendedSize: '1400 × 400 px',
    icon: <Flame size={16} />,
    accentColor: '#ef4444'
  },
  {
    value: 'coupons-hero',
    label: 'Coupons Directory Hero',
    pageName: 'Coupons & Vouchers',
    recommendedSize: '1400 × 360 px',
    icon: <Tag size={16} />,
    accentColor: '#10b981'
  },
  {
    value: 'cards-hero',
    label: 'Credit Cards Rewards Hero',
    pageName: 'Credit Cards & Banks',
    recommendedSize: '1400 × 380 px',
    icon: <CreditCard size={16} />,
    accentColor: '#8b5cf6'
  },
  {
    value: 'festival-hero',
    label: 'Festivals / Mega Sale Banner',
    pageName: 'Seasonal Campaigns',
    recommendedSize: '1920 × 500 px',
    icon: <Palette size={16} />,
    accentColor: '#ec4899'
  },
  {
    value: 'header-strip',
    label: 'Header Announcement Strip',
    pageName: 'Global Top Ribbon',
    recommendedSize: '1920 × 44 px',
    icon: <Sliders size={16} />,
    accentColor: '#0f172a'
  }
]

function getTargetConfig(type: TargetPageType): TargetPageConfig {
  return TARGET_PAGES.find(p => p.value === type) || TARGET_PAGES[0]
}

/* ============================================================
   Helper Functions
   ============================================================ */

function daysLeft(expiryDate: string): number {
  if (!expiryDate) return 0
  const now = new Date()
  const exp = new Date(expiryDate)
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function expiryPill(days: number) {
  if (days < 0) return { label: 'Expired', bg: '#fee2e2', color: '#ef4444' }
  if (days === 0) return { label: 'Expires Today', bg: '#fef3c7', color: '#d97706' }
  if (days <= 3) return { label: `${days}d left (Urgent)`, bg: '#fee2e2', color: '#dc2626' }
  if (days <= 7) return { label: `${days}d left`, bg: '#fef3c7', color: '#d97706' }
  return { label: `${days} days left`, bg: '#dcfce7', color: '#15803d' }
}

function statusConfig(status: BannerStatus) {
  switch (status) {
    case 'active': return { label: 'Active', bg: '#dcfce7', color: '#16a34a' }
    case 'inactive': return { label: 'Inactive', bg: '#f1f5f9', color: '#64748b' }
    case 'scheduled': return { label: 'Scheduled', bg: '#e0f2fe', color: '#0284c7' }
  }
}

import { TableRowSkeleton, EmptyState } from '../../../components/common/Skeletons'

/* ============================================================
   Realistic Live Hero Section Preview Component
   ============================================================ */

interface HeroPreviewProps {
  banner: Partial<Banner>
  scale?: number
}

export const HeroLivePreview: React.FC<HeroPreviewProps> = ({ banner }) => {
  const target = banner.targetPage || 'home-hero'
  const primaryImg = banner.primaryImage || heroImage || PLACEHOLDER_DEAL_IMAGE
  const accent = banner.themeColor || '#E31E25'

  // 1. Home Page Hero Simulation
  if (target === 'home-hero') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)',
        borderRadius: '12px',
        padding: '20px 16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.1)',
        minHeight: '220px'
      }}>
        {/* Subtle Watermark Glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: `${accent}22`,
          border: `1px solid ${accent}55`,
          color: accent,
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '10px'
        }}>
          <Sparkles size={11} /> {banner.badgeText || "INDIA'S #1 PLATFORM"}
        </div>

        {/* Dynamic Headings */}
        <div style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '6px' }}>
          <div>{banner.headingLine1 || "India's #1"}</div>
          <div style={{ color: accent }}>{banner.headingLine2 || 'Deal Hunt'}</div>
          {banner.headingLine3 && <div>{banner.headingLine3}</div>}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.75rem',
          color: '#cbd5e1',
          lineHeight: 1.35,
          marginBottom: '14px',
          maxWidth: '85%'
        }}>
          {banner.description || 'Find verified coupons & loot deals from 500+ top brands.'}
        </p>

        {/* Deal Chips & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            background: accent,
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {banner.ctaText || 'Explore Deals'}
          </div>

          {banner.dealChip1 && (
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              color: '#f8fafc'
            }}>
              ⚡ {banner.dealChip1}
            </div>
          )}
        </div>

        {/* Hero Character / Product Visual */}
        {banner.primaryImage && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            width: '95px',
            height: '95px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <img src={primaryImg} alt="Hero Visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    )
  }

  // 2. Stores Page Hero Simulation (Cream Palette with Shopper & Cart)
  if (target === 'stores-hero') {
    return (
      <div style={{
        background: '#FFF7E1',
        borderRadius: '12px',
        padding: '20px 16px',
        color: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        border: '1px solid #fed7aa',
        minHeight: '220px'
      }}>
        {/* Soft Wave Background Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '45%',
          background: 'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ffedd5',
          border: '1px solid #fdba74',
          color: '#c2410c',
          fontSize: '0.68rem',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px'
        }}>
          <Store size={11} /> {banner.badgeText || 'EXPLORE BRAND HUBS'}
        </div>

        {/* Heading */}
        <div style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '6px' }}>
          <div>{banner.headingLine1 || 'Shop at'}</div>
          <div style={{ color: '#ea580c' }}>{banner.headingLine2 || '100+ Verified Stores'}</div>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.75rem',
          color: '#475569',
          lineHeight: 1.35,
          marginBottom: '14px',
          maxWidth: '65%'
        }}>
          {banner.description || 'Verified coupons and real-time cashbacks from leading brands.'}
        </p>

        {/* CTA */}
        <div style={{
          background: '#ea580c',
          color: 'white',
          padding: '6px 14px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {banner.ctaText || 'Explore Stores'}
        </div>

        {/* Shopper / Cart Visual Overlay */}
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px' }}>
          {banner.secondaryImage && (
            <div style={{ width: '45px', height: '45px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #fed7aa' }}>
              <img src={banner.secondaryImage} alt="Cart" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {banner.primaryImage && (
            <div style={{ width: '85px', height: '95px', borderRadius: '8px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src={primaryImg} alt="Shopper" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>
    )
  }

  // 3. Loot Deals Flash Hero Simulation
  if (target === 'loot-hero') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #450a0a 100%)',
        borderRadius: '12px',
        padding: '20px 16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #7f1d1d',
        minHeight: '220px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ef4444',
          color: 'white',
          fontSize: '0.68rem',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '20px',
          marginBottom: '8px'
        }}>
          <Flame size={12} /> {banner.badgeText || '⚡ FLASH LOOT DROP'}
        </div>

        <div style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '6px' }}>
          <div style={{ color: '#fca5a5' }}>{banner.headingLine1 || 'Up to 90% Off'}</div>
          <div>{banner.headingLine2 || 'Mega Price Meltdown'}</div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.35, marginBottom: '14px', maxWidth: '75%' }}>
          {banner.description || 'Handpicked price drop glitches and lightning loot.'}
        </p>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            background: '#ef4444',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            {banner.ctaText || 'Grab Loot'}
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: '#fef08a',
            fontWeight: 700,
            background: 'rgba(239, 68, 68, 0.25)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(254, 240, 138, 0.3)'
          }}>
            ⏱ Exp: {banner.expiryDate || 'Limited Time'}
          </div>
        </div>

        {banner.primaryImage && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '90px',
            height: '90px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #ef4444',
            boxShadow: '0 0 16px rgba(239,68,68,0.4)'
          }}>
            <img src={primaryImg} alt="Loot Graphic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    )
  }

  // 4. Header Top Announcement Strip Simulation
  if (target === 'header-strip') {
    return (
      <div style={{
        background: '#0f172a',
        borderRadius: '8px',
        padding: '12px 14px',
        color: 'white',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{
            background: '#ef4444',
            color: 'white',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {banner.badgeText || 'LIVE'}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {banner.headingLine1 || 'Flash Promo Banner Announcement'}
          </span>
        </div>
        <span style={{
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '4px',
          flexShrink: 0
        }}>
          {banner.ctaText || 'Claim →'}
        </span>
      </div>
    )
  }

  // 5. Generic Category / Deals / Cards / Festival Hero Simulation
  return (
    <div style={{
      background: `linear-gradient(135deg, #1e1b4b 0%, ${accent} 100%)`,
      borderRadius: '12px',
      padding: '20px 16px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      minHeight: '220px'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        fontSize: '0.68rem',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: '20px',
        marginBottom: '8px'
      }}>
        <Sparkles size={11} /> {banner.badgeText || 'SPECIAL CAMPAIGN'}
      </div>

      <div style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '6px' }}>
        <div>{banner.headingLine1 || 'Exclusive Rewards'}</div>
        <div style={{ opacity: 0.9 }}>{banner.headingLine2 || 'Best Verified Offers'}</div>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#e0e7ff', lineHeight: 1.35, marginBottom: '14px', maxWidth: '75%' }}>
        {banner.description || 'Exclusive discounts, voucher savings and promotional gifts.'}
      </p>

      <div style={{
        background: 'white',
        color: '#0f172a',
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {banner.ctaText || 'Shop Now'}
      </div>

      {banner.primaryImage && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          width: '90px',
          height: '90px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <img src={primaryImg} alt="Hero Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Main Executive Banners Management Page Component
   ============================================================ */

export const ExecutiveBannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPage, setFilterPage] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'priority' | 'expiry' | 'views' | 'title'>('priority')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [inspectedBanner, setInspectedBanner] = useState<Banner | null>(null)
  const [drawerTab, setDrawerTab] = useState<string>('preview')
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  const [bannerAlert, setBannerAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'danger' | 'info' | 'success' } | null>(null)

  const fetchLiveBanners = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getBanners()
      if (Array.isArray(res)) {
        const mapped: Banner[] = res.map((b: any, index: number) => ({
          id: b._id || b.id || `ban-${index + 1}`,
          title: b.title || 'Hero Banner',
          targetPage: b.targetPage || 'home-hero',
          badgeText: b.badgeText || '',
          headingLine1: b.headingLine1 || '',
          headingLine2: b.headingLine2 || '',
          headingLine3: b.headingLine3 || '',
          description: b.description || '',
          ctaText: b.ctaText || 'Explore Deals',
          targetLink: b.targetLink || '/deals',
          primaryImage: b.primaryImage || '',
          secondaryImage: b.secondaryImage || '',
          backgroundImage: b.backgroundImage || '',
          dealChip1: b.dealChip1 || '',
          dealChip2: b.dealChip2 || '',
          themeColor: b.themeColor || '#E31E25',
          priority: Number(b.priority) || 5,
          status: (b.status as BannerStatus) || 'active',
          expiryDate: b.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          views: b.views || 0,
          clicks: b.clicks || 0,
          createdAt: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }))
        setBanners(mapped)
      }
    } catch (err) {
      console.error('Failed to load banners:', err)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveBanners()

    const handleSync = () => { fetchLiveBanners() }
    window.addEventListener('wouchify_banners_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_banners_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  // Form State
  const [formData, setFormData] = useState<Partial<Banner>>({
    targetPage: 'home-hero',
    badgeText: '',
    headingLine1: '',
    headingLine2: '',
    headingLine3: '',
    description: '',
    ctaText: 'Explore Deals',
    targetLink: '/deals',
    primaryImage: '',
    secondaryImage: '',
    backgroundImage: '',
    dealChip1: '',
    dealChip2: '',
    themeColor: '#E31E25',
    priority: 5,
    status: 'active',
    expiryDate: ''
  })

  // File Upload Refs
  const primaryFileRef = useRef<HTMLInputElement | null>(null)
  const secondaryFileRef = useRef<HTMLInputElement | null>(null)

  // Top KPI Metrics
  const kpi = useMemo(() => {
    const total = banners.length
    const active = banners.filter(b => b.status === 'active').length
    const expiringSoon = banners.filter(b => {
      const d = daysLeft(b.expiryDate)
      return d >= 0 && d <= 7 && b.status === 'active'
    }).length
    const totalViews = banners.reduce((acc, b) => acc + b.views, 0)
    const totalClicks = banners.reduce((acc, b) => acc + b.clicks, 0)
    return { total, active, expiringSoon, totalViews, totalClicks }
  }, [banners])

  // Filtered & Sorted Banners
  const filteredBanners = useMemo(() => {
    let list = [...banners]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.headingLine1.toLowerCase().includes(q) ||
        b.headingLine2.toLowerCase().includes(q) ||
        b.badgeText.toLowerCase().includes(q)
      )
    }

    if (filterPage !== 'all') {
      list = list.filter(b => b.targetPage === filterPage)
    }

    if (filterStatus !== 'all') {
      list = list.filter(b => b.status === filterStatus)
    }

    list.sort((a, b) => {
      if (sortBy === 'priority') return b.priority - a.priority
      if (sortBy === 'views') return b.views - a.views
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'expiry') return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      return 0
    })

    return list
  }, [banners, searchTerm, filterPage, filterStatus, sortBy])

  // Handlers
  const handleOpenAdd = () => {
    setEditingBanner(null)
    setFormStep(1)
    const defaultExp = new Date()
    defaultExp.setDate(defaultExp.getDate() + 30)
    setFormData({
      title: '',
      targetPage: 'home-hero',
      badgeText: "INDIA'S #1 PLATFORM",
      headingLine1: "India's #1",
      headingLine2: 'Deal Hunt',
      headingLine3: 'Platform',
      description: 'Find verified coupons, loot deals & credit card rewards from 500+ top brands.',
      ctaText: 'Explore Deals',
      targetLink: '/deals',
      primaryImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80',
      secondaryImage: '',
      backgroundImage: '',
      dealChip1: 'Instant Deals',
      dealChip2: 'Flat 90% Off',
      themeColor: '#E31E25',
      priority: 5,
      status: 'active',
      expiryDate: defaultExp.toISOString().split('T')[0]
    })
    setIsFormOpen(true)
  }

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b)
    setFormStep(1)
    setFormData({ ...b })
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setBannerToDelete(id)
  }

  const confirmDeleteBanner = () => {
    if (!bannerToDelete) return
    const id = bannerToDelete
    adminApi.deleteBanner(id).catch(console.warn)
    setBanners(prev => prev.filter(b => b.id !== id))
    setBannerToDelete(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'primaryImage' | 'secondaryImage') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setFormData(prev => ({ ...prev, [field]: result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title?.trim()) {
      setBannerAlert({ title: 'Validation Error', message: 'Banner Title is required.', variant: 'warning' })
      return
    }

    if (!formData.expiryDate) {
      setBannerAlert({ title: 'Validation Error', message: 'Banner Expiry Date is mandatory. Please set a valid expiry date.', variant: 'warning' })
      return
    }

    if (editingBanner) {
      const updatedBanner: Banner = { ...editingBanner, ...(formData as Banner) }
      adminApi.updateBanner(updatedBanner.id, updatedBanner).catch(console.warn)
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? updatedBanner : b))
    } else {
      const newBanner: Banner = {
        id: `ban-${Date.now()}`,
        title: formData.title || 'New Hero Banner',
        targetPage: formData.targetPage || 'home-hero',
        badgeText: formData.badgeText || '',
        headingLine1: formData.headingLine1 || '',
        headingLine2: formData.headingLine2 || '',
        headingLine3: formData.headingLine3 || '',
        description: formData.description || '',
        ctaText: formData.ctaText || 'Explore Now',
        targetLink: formData.targetLink || '/deals',
        primaryImage: formData.primaryImage || '',
        secondaryImage: formData.secondaryImage || '',
        backgroundImage: formData.backgroundImage || '',
        dealChip1: formData.dealChip1 || '',
        dealChip2: formData.dealChip2 || '',
        themeColor: formData.themeColor || '#E31E25',
        priority: Number(formData.priority) || 5,
        status: formData.status || 'active',
        expiryDate: formData.expiryDate || '',
        views: 0,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }

      adminApi.createBanner(newBanner).then((res: any) => {
        adminApi.createSubmission({
          entityType: 'banner',
          entityId: res._id || res.id || newBanner.id,
          action: 'create',
          title: newBanner.title,
          store: newBanner.targetPage,
          category: 'Banner Media',
          priority: newBanner.priority >= 8 ? 'High' : 'Normal',
          submittedBy: localStorage.getItem('staffUser') ? JSON.parse(localStorage.getItem('staffUser')!).email : 'executive@wouchify.com',
          dataSnapshot: newBanner
        }).catch(console.warn)
      }).catch(console.warn)

      setBanners(prev => [newBanner, ...prev])
    }

    setIsFormOpen(false)
  }

  const handleTargetPageChange = (newTarget: TargetPageType) => {
    const cfg = getTargetConfig(newTarget)
    setFormData(prev => ({
      ...prev,
      targetPage: newTarget,
      themeColor: cfg.accentColor,
      badgeText: newTarget === 'stores-hero' ? 'EXPLORE BRAND HUBS' : 
                 newTarget === 'loot-hero' ? '⚡ FLASH LOOT DROP' :
                 newTarget === 'cards-hero' ? 'BANK REWARDS & CASHBACK' :
                 newTarget === 'home-hero' ? "INDIA'S #1 PLATFORM" : 'SPECIAL OFFER',
      headingLine1: newTarget === 'stores-hero' ? 'Shop at' :
                    newTarget === 'loot-hero' ? 'Up to 90% Off' :
                    newTarget === 'cards-hero' ? 'Maximize Savings with' :
                    newTarget === 'home-hero' ? "India's #1" : 'Exclusive Deals',
      headingLine2: newTarget === 'stores-hero' ? '100+ Verified Stores' :
                    newTarget === 'loot-hero' ? 'Mega Price Meltdown' :
                    newTarget === 'cards-hero' ? 'Top Credit Cards' :
                    newTarget === 'home-hero' ? 'Deal Hunt' : 'Big Savings Today',
      headingLine3: newTarget === 'home-hero' ? 'Platform' : '',
      ctaText: newTarget === 'stores-hero' ? 'Explore Stores' :
               newTarget === 'loot-hero' ? 'Grab Loot Now' :
               newTarget === 'cards-hero' ? 'Compare Cards' : 'Explore All Deals',
      targetLink: newTarget === 'stores-hero' ? '/stores' :
                  newTarget === 'loot-hero' ? '/loot-deals' :
                  newTarget === 'cards-hero' ? '/credit-cards' : '/deals'
    }))
  }

  return (
    <ExecutiveLayout activeMenu="banners">
      <div className="executive-crud-page">
        {/* ── Header Title & Add Button ── */}
        <div className="crud-header" style={{ marginBottom: '20px' }}>
          <div>
            <h2 className="crud-title">Hero Banners Console</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Customize and update heroic banners, headings, badges, and visuals across every page of Wouchify.
            </p>
          </div>
          <button className="crud-add-btn" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Hero Banner
          </button>
        </div>

        {/* ── KPI Header Ribbon ── */}
        <div className="kpi-ribbon" style={{ marginBottom: '24px' }}>
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Layers size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.total}</span>
              <span className="kpi-label">Total Banners</span>
              <span className="kpi-sub">Across all hero slots</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{kpi.active}</span>
              <span className="kpi-label">Active Heroes</span>
              <span className="kpi-sub">Live on customer site</span>
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
              <Eye size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{(kpi.totalViews / 1000).toFixed(1)}k</span>
              <span className="kpi-label">Hero Impressions</span>
              <span className="kpi-sub">Total views recorded</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: '#fdf4ff', color: '#c026d3' }}>
              <TrendingUp size={20} />
            </div>
            <div className="kpi-body">
              <span className="kpi-value">{(kpi.totalClicks / 1000).toFixed(1)}k</span>
              <span className="kpi-label">CTA Clicks</span>
              <span className="kpi-sub">Traffic generated</span>
            </div>
          </div>
        </div>

        {/* ── Filters & Search ── */}
        <div className="crud-filters" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="crud-search" style={{ minWidth: '280px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title, badge, or heading..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.9rem',
              color: '#334155'
            }}
          >
            <option value="all">All Page Slots (Any)</option>
            {TARGET_PAGES.map(p => (
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
            <option value="priority">Sort by Priority (High to Low)</option>
            <option value="expiry">Sort by Expiry Date (Closest)</option>
            <option value="views">Sort by Views</option>
            <option value="title">Sort by Title</option>
          </select>

          {(searchTerm || filterPage !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilterPage('all'); setFilterStatus('all'); }}
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

        {/* ── Banners Table ── */}
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Hero Visual</th>
                <th>Banner Name & Headings</th>
                <th>Target Hero Slot</th>
                <th>CTA & Link</th>
                <th>Priority</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRowSkeleton columns={8} rows={5} />
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <EmptyState
                      icon="🖼️"
                      title="No hero banners found"
                      description={searchTerm || filterPage !== 'all' || filterStatus !== 'all' ? "Try adjusting your filters." : "No hero banners currently in the directory."}
                      actionLabel="+ Add Hero Banner"
                      onAction={handleOpenAdd}
                    />
                  </td>
                </tr>
              ) : filteredBanners.map(banner => {
                const days = daysLeft(banner.expiryDate)
                const pill = expiryPill(days)
                const stat = statusConfig(banner.status)
                const pageCfg = getTargetConfig(banner.targetPage)

                return (
                  <tr 
                    key={banner.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setInspectedBanner(banner); setDrawerTab('preview'); }}
                  >
                    <td>
                      <div style={{
                        width: '110px',
                        height: '56px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                      }}>
                        {banner.primaryImage ? (
                          <img
                            src={banner.primaryImage}
                            alt={banner.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8'
                          }}>
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <span style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: '3px'
                        }}>
                          P{banner.priority}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                        {banner.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        <span style={{ color: banner.themeColor || '#E31E25', fontWeight: 600 }}>
                          {banner.badgeText || 'Hero Section'}
                        </span>
                        {' · '}
                        <span>{banner.headingLine1} {banner.headingLine2}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#334155'
                      }}>
                        {pageCfg.icon}
                        <span>{pageCfg.label}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                        {pageCfg.recommendedSize}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                        {banner.ctaText}
                      </div>
                      <a
                        href={banner.targetLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.78rem',
                          color: '#3b82f6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          textDecoration: 'none'
                        }}
                      >
                        {banner.targetLink} <ExternalLink size={11} />
                      </a>
                    </td>

                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: banner.priority >= 8 ? '#fee2e2' : '#f1f5f9',
                        color: banner.priority >= 8 ? '#dc2626' : '#475569'
                      }}>
                        Level {banner.priority}
                      </span>
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
                        {banner.expiryDate}
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

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="action-btn"
                          title="Preview Hero"
                          onClick={() => { setInspectedBanner(banner); setDrawerTab('preview'); }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn"
                          title="Edit Banner"
                          onClick={() => handleOpenEdit(banner)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ============================================================
            ADD / EDIT BANNER FORM MODAL WITH DYNAMIC LIVE PREVIEW
            ============================================================ */}
        {isFormOpen && (
          <div className="crud-modal-overlay">
            <div className="crud-modal" style={{ maxWidth: '1020px', width: '94%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <div>
                  <h3 className="modal-title">
                    {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Target slot: <strong style={{ color: '#0f172a' }}>{getTargetConfig(formData.targetPage || 'home-hero').label}</strong> ({getTargetConfig(formData.targetPage || 'home-hero').recommendedSize})
                  </p>
                </div>
                <button className="modal-close" onClick={() => setIsFormOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div className="modal-body" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px' }}>
                  {/* Form Stepper Header */}
                  <div className="form-stepper">
                    <button
                      type="button"
                      className={`step-tab-btn ${formStep === 1 ? 'active' : ''} ${formData.title ? 'completed' : ''}`}
                      onClick={() => setFormStep(1)}
                    >
                      <div className="step-number">1</div>
                      <div className="step-info">
                        <span className="step-title">Step 1: Hero Identity & Copy</span>
                        <span className="step-desc">Target slot, headings, subtitle & CTA</span>
                      </div>
                    </button>
                    <div className="step-divider">›</div>
                    <button
                      type="button"
                      className={`step-tab-btn ${formStep === 2 ? 'active' : ''} ${formData.expiryDate ? 'completed' : ''}`}
                      onClick={() => setFormStep(2)}
                    >
                      <div className="step-number">2</div>
                      <div className="step-info">
                        <span className="step-title">Step 2: Media, Expiry & Launch</span>
                        <span className="step-desc">Creatives, mandatory expiry & status</span>
                      </div>
                    </button>
                  </div>

                  {/* Two Column Layout: Left Step Pane + Right Sticky Dynamic Hero Preview */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 340px',
                    gap: '24px',
                    alignItems: 'start'
                  }}>
                    {/* ── LEFT STEP CONTENT ── */}
                    <div>
                      {formStep === 1 && (
                        <div className="form-step-pane">
                          {/* Target Page Slot Selector */}
                          <div className="form-group">
                            <label style={{ fontWeight: 700, color: '#0f172a' }}>
                              Target Page & Hero Slot *
                            </label>
                            <select
                              value={formData.targetPage || 'home-hero'}
                              onChange={(e) => handleTargetPageChange(e.target.value as TargetPageType)}
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
                              {TARGET_PAGES.map(p => (
                                <option key={p.value} value={p.value}>
                                  {p.label} — ({p.recommendedSize})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Banner Name */}
                          <div className="form-group">
                            <label style={{ fontWeight: 700, color: '#0f172a' }}>
                              Internal Banner Title *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Diwali Mega Sale Hero 2026"
                              value={formData.title || ''}
                              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                            />
                          </div>

                          {/* Badge Text & Accent Theme Color */}
                          <div className="form-row">
                            <div className="form-group">
                              <label>Hero Top Badge / Tag</label>
                              <input
                                type="text"
                                placeholder="e.g. INDIA'S #1 PLATFORM or ⚡ FLASH DROP"
                                value={formData.badgeText || ''}
                                onChange={(e) => setFormData(f => ({ ...f, badgeText: e.target.value }))}
                              />
                            </div>
                            <div className="form-group">
                              <label>Accent Brand Color</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="color"
                                  value={formData.themeColor || '#E31E25'}
                                  onChange={(e) => setFormData(f => ({ ...f, themeColor: e.target.value }))}
                                  style={{ width: '44px', height: '38px', padding: '2px', borderRadius: '6px', cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  value={formData.themeColor || '#E31E25'}
                                  onChange={(e) => setFormData(f => ({ ...f, themeColor: e.target.value }))}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Headings */}
                          <div className="form-row">
                            <div className="form-group">
                              <label>Heading Line 1 *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. India's #1 or Shop at"
                                value={formData.headingLine1 || ''}
                                onChange={(e) => setFormData(f => ({ ...f, headingLine1: e.target.value }))}
                              />
                            </div>
                            <div className="form-group">
                              <label>Heading Line 2 (Highlighted) *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Deal Hunt or 100+ Verified Stores"
                                value={formData.headingLine2 || ''}
                                onChange={(e) => setFormData(f => ({ ...f, headingLine2: e.target.value }))}
                              />
                            </div>
                          </div>

                          {/* Optional Heading Line 3 */}
                          {formData.targetPage === 'home-hero' && (
                            <div className="form-group">
                              <label>Heading Line 3 (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g. Platform"
                                value={formData.headingLine3 || ''}
                                onChange={(e) => setFormData(f => ({ ...f, headingLine3: e.target.value }))}
                              />
                            </div>
                          )}

                          {/* Description / Subheading */}
                          <div className="form-group">
                            <label>Hero Description / Subtitle</label>
                            <textarea
                              rows={2}
                              placeholder="Find verified coupons, loot deals & credit card rewards from 500+ top brands."
                              value={formData.description || ''}
                              onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem'
                              }}
                            />
                          </div>

                          {/* CTA Button Text & Destination URL */}
                          <div className="form-row">
                            <div className="form-group">
                              <label>CTA Button Label *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Explore Deals"
                                value={formData.ctaText || ''}
                                onChange={(e) => setFormData(f => ({ ...f, ctaText: e.target.value }))}
                              />
                            </div>
                            <div className="form-group">
                              <label>Destination Target Link *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. /deals or https://..."
                                value={formData.targetLink || ''}
                                onChange={(e) => setFormData(f => ({ ...f, targetLink: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {formStep === 2 && (
                        <div className="form-step-pane">
                          {/* Primary Hero Graphic Image (URL + File Upload) */}
                          <div className="form-group">
                            <label style={{ fontWeight: 700, color: '#0f172a' }}>
                              Primary Hero Graphic / Character Image
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="https://... or upload local image"
                                value={formData.primaryImage || ''}
                                onChange={(e) => setFormData(f => ({ ...f, primaryImage: e.target.value }))}
                                style={{ flex: 1 }}
                              />
                              <input
                                type="file"
                                ref={primaryFileRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, 'primaryImage')}
                              />
                              <button
                                type="button"
                                onClick={() => primaryFileRef.current?.click()}
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

                          {/* Secondary Graphic (Stores Cart / Backdrop / Deals Icon) */}
                          {(formData.targetPage === 'stores-hero' || formData.targetPage === 'home-hero') && (
                            <div className="form-group">
                              <label>
                                {formData.targetPage === 'stores-hero' ? 'Secondary Cart / Backdrop Graphic' : 'Secondary Graphic Element'}
                              </label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="text"
                                  placeholder="https://... or upload image"
                                  value={formData.secondaryImage || ''}
                                  onChange={(e) => setFormData(f => ({ ...f, secondaryImage: e.target.value }))}
                                  style={{ flex: 1 }}
                                />
                                <input
                                  type="file"
                                  ref={secondaryFileRef}
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileUpload(e, 'secondaryImage')}
                                />
                                <button
                                  type="button"
                                  onClick={() => secondaryFileRef.current?.click()}
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
                          )}

                          {/* Deal Chips (For Home Hero) */}
                          {formData.targetPage === 'home-hero' && (
                            <div className="form-row">
                              <div className="form-group">
                                <label>Floating Deal Chip 1</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Instant Deals"
                                  value={formData.dealChip1 || ''}
                                  onChange={(e) => setFormData(f => ({ ...f, dealChip1: e.target.value }))}
                                />
                              </div>
                              <div className="form-group">
                                <label>Floating Deal Chip 2</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Flat 90% Off"
                                  value={formData.dealChip2 || ''}
                                  onChange={(e) => setFormData(f => ({ ...f, dealChip2: e.target.value }))}
                                />
                              </div>
                            </div>
                          )}

                          {/* Mandatory Expiry Date, Priority & Status */}
                          <div className="form-row" style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} /> Mandatory Expiry Date *
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
                              <label>Display Priority (1 - 10)</label>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={formData.priority || 5}
                                onChange={(e) => setFormData(f => ({ ...f, priority: parseInt(e.target.value) || 1 }))}
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label>Status</label>
                              <select
                                value={formData.status || 'active'}
                                onChange={(e) => setFormData(f => ({ ...f, status: e.target.value as BannerStatus }))}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="scheduled">Scheduled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── RIGHT COLUMN: STICKY DYNAMIC HERO PREVIEW ── */}
                    <div style={{
                      position: 'sticky',
                      top: '0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Live Hero Section Preview
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          background: '#f1f5f9',
                          color: '#64748b',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          Real-time
                        </span>
                      </div>

                      {/* Live Rendering based on chosen hero section */}
                      <HeroLivePreview banner={formData} />

                      {/* Technical Specs Card */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '0.78rem',
                        color: '#475569'
                      }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          Hero Slot Information
                        </div>
                        <div>• <strong>Slot:</strong> {getTargetConfig(formData.targetPage || 'home-hero').label}</div>
                        <div>• <strong>Recommended:</strong> {getTargetConfig(formData.targetPage || 'home-hero').recommendedSize}</div>
                        <div>• <strong>Expiry:</strong> {formData.expiryDate ? `${formData.expiryDate} (${daysLeft(formData.expiryDate)}d left)` : 'Not set'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ flexShrink: 0, justifyContent: 'space-between', display: 'flex' }}>
                  {formStep === 1 ? (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setIsFormOpen(false)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-save"
                        onClick={() => {
                          if (!formData.title?.trim()) {
                            setBannerAlert({ title: 'Validation Error', message: 'Please enter a Banner Title before proceeding.', variant: 'warning' })
                            return
                          }
                          setFormStep(2)
                        }}
                      >
                        Next: Media & Expiry &rarr;
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setFormStep(1)}>
                        &larr; Back to Step 1
                      </button>
                      <button type="submit" className="btn-save">
                        {editingBanner ? 'Update Hero Banner' : 'Save & Publish Hero'}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            DEEP INSPECTION DRAWER (SLIDE-OVER)
            ============================================================ */}
        {inspectedBanner && (
          <div className="exec-drawer-overlay" onClick={() => setInspectedBanner(null)}>
            <div className="exec-drawer" onClick={e => e.stopPropagation()}>
              <div className="exec-drawer__header">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div className="exec-drawer__avatar" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    {inspectedBanner.primaryImage ? (
                       <img src={inspectedBanner.primaryImage} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                       <ImageIcon size={24} color="#94a3b8" />
                    )}
                  </div>
                  <div>
                    <h3 className="exec-drawer__title">{inspectedBanner.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        {getTargetConfig(inspectedBanner.targetPage).label}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: statusConfig(inspectedBanner.status).bg, color: statusConfig(inspectedBanner.status).color, padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        {statusConfig(inspectedBanner.status).label}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                        Priority P{inspectedBanner.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="exec-drawer__close" onClick={() => setInspectedBanner(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="exec-drawer__stats">
                <div className="stat-box">
                  <div className="stat-label">Impressions</div>
                  <div className="stat-value">{inspectedBanner.views.toLocaleString()}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">CTA Clicks</div>
                  <div className="stat-value">{inspectedBanner.clicks.toLocaleString()}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">CTR</div>
                  <div className="stat-value">{inspectedBanner.views > 0 ? ((inspectedBanner.clicks / inspectedBanner.views) * 100).toFixed(1) : '0.0'}%</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Expires In</div>
                  <div className="stat-value" style={{ color: daysLeft(inspectedBanner.expiryDate) <= 3 ? '#dc2626' : 'inherit' }}>
                    {daysLeft(inspectedBanner.expiryDate)}d
                  </div>
                </div>
              </div>

              <div className="exec-drawer__tabs">
                <button className={`exec-drawer__tab ${drawerTab === 'preview' ? 'active' : ''}`} onClick={() => setDrawerTab('preview')}>
                  Visual Preview
                </button>
                <button className={`exec-drawer__tab ${drawerTab === 'content' ? 'active' : ''}`} onClick={() => setDrawerTab('content')}>
                  Content
                </button>
                <button className={`exec-drawer__tab ${drawerTab === 'siblings' ? 'active' : ''}`} onClick={() => setDrawerTab('siblings')}>
                  Slot Siblings
                </button>
                <button className={`exec-drawer__tab ${drawerTab === 'performance' ? 'active' : ''}`} onClick={() => setDrawerTab('performance')}>
                  Performance
                </button>
              </div>

              <div className="exec-drawer__body">
                {drawerTab === 'preview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                        CUSTOMER-FACING HERO RENDER
                      </div>
                      <HeroLivePreview banner={inspectedBanner} />
                    </div>
                    {inspectedBanner.secondaryImage && (
                       <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                         <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                           SECONDARY GRAPHIC / ART
                         </div>
                         <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                           <img src={inspectedBanner.secondaryImage} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                         </div>
                       </div>
                    )}
                  </div>
                )}

                {drawerTab === 'content' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div className="detail-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Heading Copy</label>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a' }}>
                        <div><strong>L1:</strong> {inspectedBanner.headingLine1 || 'N/A'}</div>
                        <div><strong>L2:</strong> {inspectedBanner.headingLine2 || 'N/A'}</div>
                        <div><strong>L3:</strong> {inspectedBanner.headingLine3 || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="detail-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Description</label>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a' }}>
                        {inspectedBanner.description || 'N/A'}
                      </div>
                    </div>
                    <div className="detail-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Badge & Chips</label>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a' }}>
                        <div><strong>Badge:</strong> {inspectedBanner.badgeText || 'N/A'}</div>
                        <div><strong>Chip 1:</strong> {inspectedBanner.dealChip1 || 'N/A'}</div>
                        <div><strong>Chip 2:</strong> {inspectedBanner.dealChip2 || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="detail-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Call to Action (CTA)</label>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a' }}>
                        <div><strong>Label:</strong> {inspectedBanner.ctaText}</div>
                        <div><strong>Link:</strong> {inspectedBanner.targetLink}</div>
                      </div>
                    </div>
                    <div className="detail-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Targeting & Schedule</label>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#0f172a' }}>
                        <div><strong>Slot:</strong> {getTargetConfig(inspectedBanner.targetPage).label}</div>
                        <div><strong>Priority:</strong> {inspectedBanner.priority}</div>
                        <div><strong>Status:</strong> <span style={{textTransform: 'capitalize'}}>{inspectedBanner.status}</span></div>
                        <div><strong>Expiry:</strong> {inspectedBanner.expiryDate}</div>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'siblings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px 0' }}>
                      Other banners competing for the <strong>{getTargetConfig(inspectedBanner.targetPage).label}</strong> slot.
                    </p>
                    {banners.filter(b => b.targetPage === inspectedBanner.targetPage && b.id !== inspectedBanner.id).length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                        No other banners in this slot.
                      </div>
                    ) : (
                      banners.filter(b => b.targetPage === inspectedBanner.targetPage && b.id !== inspectedBanner.id)
                        .sort((a,b) => b.priority - a.priority)
                        .map(sibling => (
                        <div key={sibling.id} className="exec-drawer__item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{sibling.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                              Priority: P{sibling.priority} · {statusConfig(sibling.status).label}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{sibling.clicks.toLocaleString()}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Clicks</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {drawerTab === 'performance' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Impressions</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{inspectedBanner.views.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CTA Clicks</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{inspectedBanner.clicks.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Click-Through Rate (CTR)</span>
                        <span style={{ fontWeight: 800, color: '#3b82f6' }}>
                          {inspectedBanner.views > 0 ? ((inspectedBanner.clicks / inspectedBanner.views) * 100).toFixed(1) : '0.0'}%
                        </span>
                      </div>
                      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Created Date</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{inspectedBanner.createdAt}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Expiry Date</span>
                        <span style={{ fontWeight: 600, color: '#dc2626' }}>{inspectedBanner.expiryDate} ({daysLeft(inspectedBanner.expiryDate)}d)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Current Status</span>
                        <span style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{inspectedBanner.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="exec-drawer__actions">
                <button
                  className="drawer-btn primary"
                  onClick={() => {
                    const b = inspectedBanner
                    setInspectedBanner(null)
                    handleOpenEdit(b)
                  }}
                >
                  <Edit2 size={16} /> Edit Banner
                </button>
                <button
                  className="drawer-btn secondary"
                  onClick={() => {
                    const newStatus = inspectedBanner.status === 'active' ? 'inactive' : 'active';
                    adminApi.updateBanner(inspectedBanner.id, { status: newStatus }).then(() => {
                      setBanners(prev => prev.map(b => b.id === inspectedBanner.id ? { ...b, status: newStatus } : b));
                      setInspectedBanner(prev => prev ? { ...prev, status: newStatus } : null);
                    }).catch(console.warn);
                  }}
                >
                  <RotateCcw size={16} /> Toggle Status
                </button>
                <button
                  className="drawer-btn secondary"
                  onClick={() => {
                    window.open(inspectedBanner.targetLink, '_blank')
                  }}
                >
                  <ExternalLink size={16} /> Open Link
                </button>
                <button
                  className="drawer-btn danger"
                  onClick={() => {
                    handleDelete(inspectedBanner.id)
                    setInspectedBanner(null)
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOM CONFIRM DIALOG ── */}
        <AdminConfirmDialog
          isOpen={!!bannerToDelete}
          title="Delete Hero Banner"
          message="Are you sure you want to permanently delete this hero banner? This cannot be undone."
          confirmLabel="Delete Banner"
          cancelLabel="Cancel"
          variant="danger"
          icon="trash"
          onConfirm={confirmDeleteBanner}
          onCancel={() => setBannerToDelete(null)}
        />

        {/* ── CUSTOM ALERT DIALOG ── */}
        {bannerAlert && (
          <AdminAlertDialog
            isOpen={!!bannerAlert}
            title={bannerAlert.title}
            message={bannerAlert.message}
            variant={bannerAlert.variant || 'warning'}
            buttonLabel="Understood"
            onClose={() => setBannerAlert(null)}
          />
        )}
      </div>
    </ExecutiveLayout>
  )
}
