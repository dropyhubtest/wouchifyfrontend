import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Tag, 
  Zap, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Save, 
  Send, 
  Clock, 
  Copy, 
  Eye, 
  Check, 
  Download, 
  Filter, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  Calendar
} from 'lucide-react'
import './ExecutiveShared.css'
import { MASTER_EXECUTIVE_DEALS, DEAL_PRODUCT_PRESETS, getStoreLogo, convertGoogleDriveUrl, PLACEHOLDER_DEAL_IMAGE, PLACEHOLDER_STORE_LOGO } from '../../../data/dealsPage'
import { FAVOURITE_STORES } from '../../../data/storesHero'
import { CATEGORIES_DATA } from '../../../data/categories'
import { ImageUploadField } from './ImageUploadField'

export interface Deal {
  id: string
  title: string
  store: string
  brand: string
  category: string
  subCategory?: string
  asinOrSku?: string
  type: 'deal' | 'loot' | 'flash' | 'daily'
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Expired'
  priority: 'Normal' | 'High' | 'Critical'
  badge: string
  code: string
  link: string
  originalPrice: string
  price: string
  discountLabel: string
  discountValue: number
  bankOffer?: string
  effectivePrice?: string
  cashback?: string
  stockStatus?: 'In Stock' | 'Limited Stock' | 'Lightning Deal (85% Claimed)' | 'Out of Stock'
  rating?: string
  deliveryInfo?: string
  warranty?: string
  variantNote?: string
  howToClaim?: string
  highlights?: string[]
  isFeatured?: boolean
  isVerified?: boolean
  isBestSelling?: boolean
  sectionPlacement?: 'favourite' | 'best_selling' | 'both'
  postedAt: string
  expiresAt: string
  description: string
  terms?: string
  image: string
  images: string[]
  clicks?: number
}

export const formatPriceWithRupee = (val: string | number | undefined): string => {
  if (!val && val !== 0) return ''
  const str = String(val).trim()
  const num = parseInt(str.replace(/[^0-9]/g, ''), 10)
  if (isNaN(num)) return str.startsWith('₹') ? str : `₹${str}`
  return `₹${num.toLocaleString('en-IN')}`
}

export const formatExpiryDate = (isoStr?: string): string => {
  if (!isoStr) return 'No Expiry Set'
  try {
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return isoStr
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return isoStr
  }
}

export const getExpiryCountdown = (isoStr?: string): { text: string; status: 'expired' | 'urgent' | 'warning' | 'normal' } => {
  if (!isoStr) return { text: 'No Expiry Set', status: 'normal' }
  try {
    const target = new Date(isoStr).getTime()
    if (isNaN(target)) return { text: 'Valid Offer', status: 'normal' }
    const now = Date.now()
    const diff = target - now
    if (diff <= 0) {
      return { text: 'Offer Expired', status: 'expired' }
    }
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days >= 2) {
      return { text: `${days} days left`, status: days <= 3 ? 'warning' : 'normal' }
    }
    if (hours >= 1) {
      const remMins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return { text: `${hours}h ${remMins}m left`, status: 'urgent' }
    }
    const mins = Math.max(1, Math.floor(diff / (1000 * 60)))
    return { text: `${mins}m left (Ends soon)`, status: 'urgent' }
  } catch {
    return { text: 'Valid Offer', status: 'normal' }
  }
}

const mapInitialDealsToFullSchema = (): Deal[] => {
  try {
    const cached = localStorage.getItem('wouchify_public_deals')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length >= 12) {
        return parsed.map((d: any, idx: number) => {
          const matchingMaster = MASTER_EXECUTIVE_DEALS.find(m => m.id === String(d._id || d.id))
          return {
            id: String(d._id || d.id || `deal-${idx + 1}`),
            title: d.name || d.title || matchingMaster?.title || 'Untitled Deal',
            store: d.store || matchingMaster?.store || 'Amazon',
            brand: d.brand || matchingMaster?.brand || '',
            category: d.category || matchingMaster?.category || 'Electronics',
            subCategory: d.subCategory || matchingMaster?.subCategory || '',
            asinOrSku: d.asinOrSku || matchingMaster?.asinOrSku || '',
            type: (d.type || matchingMaster?.type || 'deal') as any,
            status: (d.status === 'expired' || d.status === 'Expired' ? 'Expired' : d.status === 'pending' || d.status === 'Pending Approval' || d.submissionStatus === 'pending_approval' ? 'Pending Approval' : d.status === 'draft' || d.status === 'Draft' ? 'Draft' : 'Approved') as any,
            priority: (d.priority || matchingMaster?.priority || 'Normal') as any,
            badge: d.dealTag || d.badge || matchingMaster?.badge || 'Deal',
            code: d.code || matchingMaster?.code || '',
            link: d.ctaHref || d.link || matchingMaster?.link || '',
            originalPrice: d.originalPrice || matchingMaster?.originalPrice || '',
            price: d.price || matchingMaster?.price || '₹0',
            discountLabel: d.discount || d.discountLabel || matchingMaster?.discountLabel || '',
            discountValue: parseInt(String(d.discount || d.discountLabel || matchingMaster?.discountValue || '0').replace(/[^0-9]/g, '')) || 0,
            bankOffer: d.bankOffer || matchingMaster?.bankOffer || '',
            effectivePrice: d.effectivePrice || matchingMaster?.effectivePrice || d.price || '',
            cashback: d.cashback || matchingMaster?.cashback || '',
            stockStatus: d.stockStatus || matchingMaster?.stockStatus || 'In Stock',
            rating: d.rating || matchingMaster?.rating || '4.8',
            deliveryInfo: d.deliveryInfo || matchingMaster?.deliveryInfo || 'Free Express Delivery',
            warranty: d.warranty || matchingMaster?.warranty || '1 Year Brand Warranty',
            variantNote: d.variantNote || matchingMaster?.variantNote || '',
            howToClaim: d.howToClaim || matchingMaster?.howToClaim || '',
            highlights: d.highlights || matchingMaster?.highlights || ['100% Verified Deal'],
            isBestSelling: Boolean(d.isBestSelling || d.sectionPlacement === 'best_selling' || d.sectionPlacement === 'both'),
            sectionPlacement: (d.sectionPlacement || (d.isBestSelling ? 'best_selling' : 'favourite')) as any,
            isFeatured: Boolean(d.isFeatured ?? matchingMaster?.isFeatured),
            isVerified: Boolean(d.isVerified ?? matchingMaster?.isVerified ?? true),
            postedAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : (d.postedAt || matchingMaster?.postedAt || 'Recently'),
            expiresAt: d.expiry || d.expiresAt || matchingMaster?.expiresAt || '',
            description: d.description || matchingMaster?.description || 'Handpicked verified e-commerce deal.',
            terms: d.terms || matchingMaster?.terms || '',
            image: convertGoogleDriveUrl(d.productImage || d.image || matchingMaster?.image || ''),
            images: d.images?.length ? d.images.map(convertGoogleDriveUrl) : [convertGoogleDriveUrl(d.productImage || d.image || matchingMaster?.image || '')],
            clicks: typeof d.clicks === 'number' ? d.clicks : (parseInt(d.clicks) || matchingMaster?.clicks || 0)
          }
        })
      }
    }
  } catch {}

  return [...MASTER_EXECUTIVE_DEALS]
}

export const ExecutiveDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(mapInitialDealsToFullSchema())
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [dealsTab, setDealsTab] = useState<'active' | 'expired'>('active')
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>([])
  
  // Modals & Previews
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [previewDeal, setPreviewDeal] = useState<Deal | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchLiveDeals = async () => {
      try {
        const liveDeals = await adminApi.getDeals()
        if (!isMounted) return
        if (Array.isArray(liveDeals) && liveDeals.length > 0) {
          const mapped: Deal[] = liveDeals.map((d: any, idx: number) => {
            const matchingMaster = MASTER_EXECUTIVE_DEALS.find(m => m.id === String(d._id || d.id))
            return {
              id: String(d._id || d.id || `deal-${idx + 1}`),
              title: d.name || d.title || matchingMaster?.title || 'Untitled Deal',
              store: d.store || matchingMaster?.store || 'Amazon',
              brand: d.brand || matchingMaster?.brand || '',
              category: d.category || matchingMaster?.category || 'Electronics',
              subCategory: d.subCategory || matchingMaster?.subCategory || '',
              asinOrSku: d.asinOrSku || matchingMaster?.asinOrSku || '',
              type: (d.type || matchingMaster?.type || 'deal') as any,
              status: (d.status === 'expired' || d.status === 'Expired' ? 'Expired' : d.status === 'pending' || d.status === 'Pending Approval' || d.submissionStatus === 'pending_approval' ? 'Pending Approval' : d.status === 'draft' || d.status === 'Draft' ? 'Draft' : 'Approved') as any,
              priority: (d.priority || matchingMaster?.priority || 'Normal') as any,
              badge: d.dealTag || d.badge || matchingMaster?.badge || 'Deal',
              code: d.code || matchingMaster?.code || '',
              link: d.ctaHref || d.link || matchingMaster?.link || '',
              originalPrice: d.originalPrice || matchingMaster?.originalPrice || '',
              price: d.price || matchingMaster?.price || '₹0',
              discountLabel: d.discount || d.discountLabel || matchingMaster?.discountLabel || '',
              discountValue: parseInt(String(d.discount || d.discountLabel || matchingMaster?.discountValue || '0').replace(/[^0-9]/g, '')) || 0,
              bankOffer: d.bankOffer || matchingMaster?.bankOffer || '',
              effectivePrice: d.effectivePrice || matchingMaster?.effectivePrice || d.price || '',
              cashback: d.cashback || matchingMaster?.cashback || '',
              stockStatus: d.stockStatus || matchingMaster?.stockStatus || 'In Stock',
              rating: d.rating || matchingMaster?.rating || '4.8',
              deliveryInfo: d.deliveryInfo || matchingMaster?.deliveryInfo || 'Free Express Delivery',
              warranty: d.warranty || matchingMaster?.warranty || '1 Year Brand Warranty',
              variantNote: d.variantNote || matchingMaster?.variantNote || '',
              howToClaim: d.howToClaim || matchingMaster?.howToClaim || '',
              highlights: d.highlights || matchingMaster?.highlights || ['100% Verified Deal'],
              isBestSelling: Boolean(d.isBestSelling || d.sectionPlacement === 'best_selling' || d.sectionPlacement === 'both'),
              sectionPlacement: (d.sectionPlacement || (d.isBestSelling ? 'best_selling' : 'favourite')) as any,
              isFeatured: Boolean(d.isFeatured ?? matchingMaster?.isFeatured),
              isVerified: Boolean(d.isVerified ?? matchingMaster?.isVerified ?? true),
              postedAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : (d.postedAt || matchingMaster?.postedAt || 'Recently'),
              expiresAt: d.expiry || d.expiresAt || matchingMaster?.expiresAt || '',
              description: d.description || matchingMaster?.description || 'Handpicked verified e-commerce deal.',
              terms: d.terms || matchingMaster?.terms || '',
              image: convertGoogleDriveUrl(d.productImage || d.image || matchingMaster?.image || ''),
              images: d.images?.length ? d.images.map(convertGoogleDriveUrl) : [convertGoogleDriveUrl(d.productImage || d.image || matchingMaster?.image || '')],
              clicks: typeof d.clicks === 'number' ? d.clicks : (parseInt(d.clicks) || matchingMaster?.clicks || 0)
            }
          })
          setDeals(mapped)
        }
      } catch (err) {
        console.warn('Deals fallback to local store:', err)
      }
    }

    fetchLiveDeals()

    const handleSync = () => {
      fetchLiveDeals()
    }

    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('wouchify_deal_clicked', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      isMounted = false
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('wouchify_deal_clicked', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [showBestSellingOnly, setShowBestSellingOnly] = useState(false)
  const [sortOption, setSortOption] = useState<string>('recent')

  // Pagination - default to 50 so all deals are visible at once
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  // Form State
  const emptyDeal: Deal = {
    id: '',
    title: '',
    store: 'Amazon',
    brand: '',
    category: 'Electronics',
    subCategory: '',
    asinOrSku: '',
    type: 'deal',
    status: 'Draft',
    priority: 'Normal',
    badge: 'Hot Deal',
    code: '',
    link: '',
    originalPrice: '',
    price: '',
    discountLabel: '',
    discountValue: 0,
    bankOffer: '',
    effectivePrice: '',
    cashback: '+ 5% Wouchify Cashback',
    stockStatus: 'In Stock',
    rating: '4.4 ★ (12.5k)',
    deliveryInfo: 'Free Delivery',
    warranty: '1 Year Brand Warranty • 7 Days Replacement',
    variantNote: '',
    howToClaim: '1. Click "Grab Deal" to open partner store.\n2. Check coupon checkbox if available on product page.\n3. Complete checkout using eligible bank card.',
    highlights: [
      '100% Original Brand Product',
      'Full Manufacturer Warranty Included'
    ],
    isFeatured: false,
    isVerified: true,
    postedAt: `Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16),
    description: '',
    terms: 'Valid on select variants. Cannot be combined with other ongoing promotions.',
    image: DEAL_PRODUCT_PRESETS[0]?.image || '',
    images: [DEAL_PRODUCT_PRESETS[0]?.image || ''],
    clicks: 0
  }
  const [form, setForm] = useState<Deal>(emptyDeal)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPI Metrics Calculation
  const kpiStats = useMemo(() => {
    const total = deals.length
    const approved = deals.filter(d => d.status === 'Approved').length
    const pending = deals.filter(d => d.status === 'Pending Approval').length
    const loot = deals.filter(d => d.type === 'loot').length
    const expired = deals.filter(d => d.status === 'Expired' || (d.expiresAt && new Date(d.expiresAt).getTime() < Date.now())).length
    const bestSelling = deals.filter(d => d.isBestSelling).length
    const totalClicks = deals.reduce((acc, d) => acc + (d.clicks || 0), 0)
    return { total, approved, pending, loot, expired, bestSelling, totalClicks }
  }, [deals])

  // Helper: is a deal truly expired (by status OR by expiry date)
  const isDealExpired = (deal: Deal): boolean => {
    if (deal.status === 'Expired') return true
    if (deal.expiresAt) {
      const expTime = new Date(deal.expiresAt).getTime()
      if (!isNaN(expTime) && expTime < Date.now()) return true
    }
    return false
  }

  // Base filtered list (no tab split yet, applies search + filters)
  const baseFilteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = deal.title.toLowerCase().includes(q)
        const matchStore = deal.store.toLowerCase().includes(q)
        const matchBrand = (deal.brand || '').toLowerCase().includes(q)
        const matchCat = deal.category.toLowerCase().includes(q)
        const matchCode = deal.code.toLowerCase().includes(q)
        const matchSku = (deal.asinOrSku || '').toLowerCase().includes(q)
        if (!matchTitle && !matchStore && !matchBrand && !matchCat && !matchCode && !matchSku) return false
      }

      // Category
      if (selectedCategory !== 'all' && deal.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // Store
      if (selectedStore !== 'all' && deal.store.toLowerCase() !== selectedStore.toLowerCase()) {
        return false
      }

      // Type
      if (selectedType !== 'all' && deal.type !== selectedType) {
        return false
      }

      // Status filter (only applies in active tab context)
      if (selectedStatus !== 'all' && deal.status !== selectedStatus) {
        return false
      }

      // Priority
      if (selectedPriority !== 'all' && deal.priority !== selectedPriority) {
        return false
      }

      // Best Selling filter
      if (showBestSellingOnly && !deal.isBestSelling) {
        return false
      }

      return true
    }).sort((a, b) => {
      // Best selling deals always surface first when filter is on
      if (showBestSellingOnly) {
        return (b.isBestSelling ? 1 : 0) - (a.isBestSelling ? 1 : 0)
      }
      if (sortOption === 'posted-oldest') {
        return a.id.localeCompare(b.id)
      }
      if (sortOption === 'price-low') {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
        return pA - pB
      }
      if (sortOption === 'price-high') {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
        return pB - pA
      }
      if (sortOption === 'discount-high') {
        return (b.discountValue || 0) - (a.discountValue || 0)
      }
      if (sortOption === 'clicks-high') {
        return (b.clicks || 0) - (a.clicks || 0)
      }
      if (sortOption === 'store-az') {
        return a.store.localeCompare(b.store)
      }
      if (sortOption === 'expiry-soon') {
        const timeA = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity
        const timeB = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity
        return timeA - timeB
      }
      // default: recent (descending id / newest posted)
      return b.id.localeCompare(a.id)
    })
  }, [deals, searchTerm, selectedCategory, selectedStore, selectedType, selectedStatus, selectedPriority, sortOption, showBestSellingOnly])

  // Tab-split: active deals vs expired deals
  const activeDeals = useMemo(() => baseFilteredDeals.filter(d => !isDealExpired(d)), [baseFilteredDeals])
  const expiredDeals = useMemo(() => baseFilteredDeals.filter(d => isDealExpired(d)), [baseFilteredDeals])
  const filteredDeals = dealsTab === 'active' ? activeDeals : expiredDeals

  // Pagination slicing
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredDeals.slice(start, start + itemsPerPage)
  }, [filteredDeals, currentPage, itemsPerPage])

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedStore !== 'all',
    selectedType !== 'all',
    selectedStatus !== 'all',
    selectedPriority !== 'all',
    showBestSellingOnly,
    searchTerm.trim().length > 0
  ].filter(Boolean).length

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedStore('all')
    setSelectedType('all')
    setSelectedStatus('all')
    setSelectedPriority('all')
    setShowBestSellingOnly(false)
    setSortOption('recent')
    setCurrentPage(1)
    showToast('Filters reset')
  }

  // Deal Form Actions
  const handleSetExpiryPreset = (hoursToAdd: number | null) => {
    if (hoursToAdd === null) {
      setForm(prev => ({ ...prev, expiresAt: '' }))
      return
    }
    const targetDate = new Date(Date.now() + hoursToAdd * 3600000)
    const localIso = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setForm(prev => ({ ...prev, expiresAt: localIso }))
  }

  const handleAddDeal = () => {
    setEditingDeal(null)
    setFormStep(1)
    setForm(emptyDeal)
    setIsModalOpen(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setFormStep(1)
    setForm({
      ...deal,
      image: deal.image || deal.images[0] || '',
      images: deal.images?.length ? deal.images : [deal.image || ''],
    })
    setIsModalOpen(true)
  }

  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== id))
      setSelectedDealIds(selectedDealIds.filter(selId => selId !== id))
      showToast('Deal removed successfully')
      adminApi.deleteDeal(id).catch(console.warn)
    }
  }

  const handleToggleStatus = (id: string) => {
    const target = deals.find(d => d.id === id)
    if (!target) return
    const nextStatus = target.status === 'Approved' ? 'Draft' : 'Approved'
    const nextDbStatus = nextStatus === 'Approved' ? 'active' : 'pending'

    setDeals(deals.map(d => {
      if (d.id === id) {
        return { ...d, status: nextStatus }
      }
      return d
    }))

    showToast(`Status changed to ${nextStatus}`)

    adminApi.updateDeal(id, {
      status: nextDbStatus,
      submissionStatus: nextStatus === 'Approved' ? 'approved' : 'draft'
    }).catch(console.warn)
  }

  const handleSectionPlacementChange = (id: string, placement: 'both' | 'favourite' | 'best_selling') => {
    const target = deals.find(d => d.id === id)
    if (!target) return
    const isBest = placement === 'best_selling' || placement === 'both'

    const updated = deals.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          isBestSelling: isBest,
          sectionPlacement: placement
        }
      }
      return d
    })
    setDeals(updated)

    const labelMap: Record<string, string> = {
      favourite: 'Section 1 (Main Deals Only)',
      best_selling: 'Section 2 (Best Selling Picks Only)',
      both: 'Both Sections (Section 1 & Section 2)'
    }
    showToast(`Storefront Section updated to: ${labelMap[placement]}`)

    adminApi.updateDeal(id, {
      isBestSelling: isBest,
      sectionPlacement: placement
    }).catch(console.warn)
  }

  // Bulk Actions
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedDeals.map(d => d.id)
    const allSelected = pageIds.every(id => selectedDealIds.includes(id))
    if (allSelected) {
      setSelectedDealIds(selectedDealIds.filter(id => !pageIds.includes(id)))
    } else {
      const newSelected = Array.from(new Set([...selectedDealIds, ...pageIds]))
      setSelectedDealIds(newSelected)
    }
  }

  const handleToggleSelectDeal = (id: string) => {
    if (selectedDealIds.includes(id)) {
      setSelectedDealIds(selectedDealIds.filter(d => d !== id))
    } else {
      setSelectedDealIds([...selectedDealIds, id])
    }
  }

  const handleBulkApprove = () => {
    setDeals(deals.map(d => selectedDealIds.includes(d.id) ? { ...d, status: 'Approved' } : d))
    selectedDealIds.forEach(id => {
      adminApi.updateDeal(id, { status: 'active', submissionStatus: 'approved' }).catch(console.warn)
    })
    showToast(`Approved ${selectedDealIds.length} deals`)
    setSelectedDealIds([])
  }

  const handleBulkDraft = () => {
    setDeals(deals.map(d => selectedDealIds.includes(d.id) ? { ...d, status: 'Draft' } : d))
    selectedDealIds.forEach(id => {
      adminApi.updateDeal(id, { status: 'pending', submissionStatus: 'draft' }).catch(console.warn)
    })
    showToast(`Moved ${selectedDealIds.length} deals to Draft`)
    setSelectedDealIds([])
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedDealIds.length} selected deals permanently?`)) {
      const idsToDelete = [...selectedDealIds]
      setDeals(deals.filter(d => !idsToDelete.includes(d.id)))
      idsToDelete.forEach(id => {
        adminApi.deleteDeal(id).catch(console.warn)
      })
      showToast(`Deleted ${idsToDelete.length} deals`)
      setSelectedDealIds([])
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Brand', 'Store', 'Category', 'ASIN_SKU', 'Type', 'Price', 'OriginalPrice', 'EffectivePrice', 'Discount', 'BankOffer', 'Cashback', 'StockStatus', 'Rating', 'DeliveryInfo', 'Warranty', 'DealPostedDate', 'Status', 'ExpiresAt', 'Clicks']
    const rows = filteredDeals.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.brand || ''}"`,
      d.store,
      d.category,
      d.asinOrSku || '',
      d.type,
      d.price,
      d.originalPrice || '',
      d.effectivePrice || '',
      d.discountLabel,
      `"${(d.bankOffer || '').replace(/"/g, '""')}"`,
      `"${d.cashback || ''}"`,
      d.stockStatus || 'In Stock',
      `"${d.rating || ''}"`,
      `"${d.deliveryInfo || ''}"`,
      `"${d.warranty || ''}"`,
      `"${d.postedAt || ''}"`,
      d.status,
      d.expiresAt,
      d.clicks || 0
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_deals_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported deals to CSV')
  }

  // Form Field Handlers
  const handlePriceChange = (priceVal: string) => {
    const cleanPrice = priceVal.startsWith('₹') ? priceVal : priceVal ? `₹${priceVal}` : ''
    const mrpNum = parseInt(form.originalPrice.replace(/[^0-9]/g, '')) || 0
    const currNum = parseInt(cleanPrice.replace(/[^0-9]/g, '')) || 0
    let disc = 0
    let label = form.discountLabel
    if (mrpNum > currNum && mrpNum > 0 && currNum > 0) {
      disc = Math.round(((mrpNum - currNum) / mrpNum) * 100)
      label = `${disc}% OFF`
    }
    setForm(prev => ({
      ...prev,
      price: cleanPrice,
      discountValue: disc,
      discountLabel: label
    }))
  }

  const handleMrpChange = (mrpVal: string) => {
    const cleanMrp = mrpVal.startsWith('₹') ? mrpVal : mrpVal ? `₹${mrpVal}` : ''
    const mrpNum = parseInt(cleanMrp.replace(/[^0-9]/g, '')) || 0
    const currNum = parseInt(form.price.replace(/[^0-9]/g, '')) || 0
    let disc = 0
    let label = form.discountLabel
    if (mrpNum > currNum && mrpNum > 0 && currNum > 0) {
      disc = Math.round(((mrpNum - currNum) / mrpNum) * 100)
      label = `${disc}% OFF`
    }
    setForm(prev => ({
      ...prev,
      originalPrice: cleanMrp,
      discountValue: disc,
      discountLabel: label
    }))
  }

  const handleImageUrlChange = (url: string) => {
    const converted = convertGoogleDriveUrl(url)
    setForm(prev => ({
      ...prev,
      image: converted,
      images: [converted]
    }))
  }

  const handleSave = (statusToSet: 'Draft' | 'Pending Approval') => {
    if (!form.title.trim()) {
      alert('Please enter a Deal Title')
      return
    }
    if (!form.price.trim()) {
      alert('Please enter an Offer Price')
      return
    }

    const finalImage = form.image || form.images[0] || (DEAL_PRODUCT_PRESETS[0]?.image || '')
    const dealToSave: Deal = {
      ...form,
      id: editingDeal ? editingDeal.id : Date.now().toString(),
      status: statusToSet,
      image: finalImage,
      images: [finalImage]
    }

    if (editingDeal) {
      adminApi.updateDeal(dealToSave.id, {
        name: dealToSave.title,
        title: dealToSave.title,
        store: dealToSave.store,
        brand: dealToSave.brand,
        category: dealToSave.category,
        subCategory: dealToSave.subCategory,
        asinOrSku: dealToSave.asinOrSku,
        type: dealToSave.type,
        price: dealToSave.price,
        originalPrice: dealToSave.originalPrice,
        discount: dealToSave.discountLabel,
        discountLabel: dealToSave.discountLabel,
        bankOffer: dealToSave.bankOffer,
        effectivePrice: dealToSave.effectivePrice,
        code: dealToSave.code,
        cashback: dealToSave.cashback,
        stockStatus: dealToSave.stockStatus,
        rating: dealToSave.rating,
        deliveryInfo: dealToSave.deliveryInfo,
        warranty: dealToSave.warranty,
        productImage: dealToSave.image,
        image: dealToSave.image,
        images: dealToSave.images,
        ctaHref: dealToSave.link,
        link: dealToSave.link,
        badge: dealToSave.badge,
        dealTag: dealToSave.badge,
        priority: dealToSave.priority,
        status: statusToSet === 'Pending Approval' ? 'pending' : statusToSet === 'Draft' ? 'draft' : 'active',
        submissionStatus: statusToSet === 'Pending Approval' ? 'pending_approval' : statusToSet === 'Draft' ? 'draft' : 'approved',
        isBestSelling: Boolean(dealToSave.isBestSelling),
        sectionPlacement: dealToSave.sectionPlacement || (dealToSave.isBestSelling ? 'best_selling' : 'favourite'),
        isFeatured: Boolean(dealToSave.isFeatured),
        isVerified: Boolean(dealToSave.isVerified),
        expiry: dealToSave.expiresAt,
        expiresAt: dealToSave.expiresAt,
        description: dealToSave.description,
        terms: dealToSave.terms
      }).catch(console.warn)

      setDeals(deals.map(d => d.id === editingDeal.id ? dealToSave : d))
      showToast('Deal updated successfully')
    } else {
      adminApi.createDeal({
        name: dealToSave.title,
        title: dealToSave.title,
        store: dealToSave.store,
        brand: dealToSave.brand,
        category: dealToSave.category,
        subCategory: dealToSave.subCategory,
        asinOrSku: dealToSave.asinOrSku,
        type: dealToSave.type,
        price: dealToSave.price,
        originalPrice: dealToSave.originalPrice,
        discount: dealToSave.discountLabel,
        discountLabel: dealToSave.discountLabel,
        bankOffer: dealToSave.bankOffer,
        effectivePrice: dealToSave.effectivePrice,
        code: dealToSave.code,
        cashback: dealToSave.cashback,
        stockStatus: dealToSave.stockStatus,
        rating: dealToSave.rating,
        deliveryInfo: dealToSave.deliveryInfo,
        warranty: dealToSave.warranty,
        productImage: dealToSave.image,
        image: dealToSave.image,
        images: dealToSave.images,
        ctaHref: dealToSave.link,
        link: dealToSave.link,
        badge: dealToSave.badge,
        dealTag: dealToSave.badge,
        priority: dealToSave.priority,
        status: statusToSet === 'Pending Approval' ? 'pending' : statusToSet === 'Draft' ? 'draft' : 'active',
        submissionStatus: statusToSet === 'Pending Approval' ? 'pending_approval' : statusToSet === 'Draft' ? 'draft' : 'approved',
        isBestSelling: Boolean(dealToSave.isBestSelling),
        sectionPlacement: dealToSave.sectionPlacement || (dealToSave.isBestSelling ? 'best_selling' : 'favourite'),
        isFeatured: Boolean(dealToSave.isFeatured),
        isVerified: Boolean(dealToSave.isVerified),
        expiry: dealToSave.expiresAt,
        expiresAt: dealToSave.expiresAt,
        description: dealToSave.description,
        terms: dealToSave.terms
      }).then(res => {
        if (statusToSet === 'Pending Approval') {
          adminApi.createSubmission({
            entityType: 'deal',
            entityId: res._id || res.id || dealToSave.id,
            action: 'create',
            title: dealToSave.title,
            store: dealToSave.store,
            category: dealToSave.category,
            priority: dealToSave.priority,
            submittedBy: localStorage.getItem('staffUser') ? JSON.parse(localStorage.getItem('staffUser')!).email : 'executive@wouchify.com',
            dataSnapshot: dealToSave
          }).catch(console.warn)
        }
      }).catch(console.warn)

      setDeals([dealToSave, ...deals])
      showToast(statusToSet === 'Pending Approval' ? 'Submitted for Ops Manager Approval!' : 'New deal saved to drafts')
    }
    setIsModalOpen(false)
  }

  const storeOptions = FAVOURITE_STORES.map(s => s.name)
  const categoryOptions = CATEGORIES_DATA.map(c => c.name)

  return (
    <ExecutiveLayout activeMenu="deals">
      <div className="executive-crud-page">
        
        {/* Page Top Header */}
        <div className="crud-header">
          <div>
            <h2 className="crud-title">Deals</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b' }}>
              Manage, filter, and organize promotional deals across partner stores.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-cancel" 
              onClick={handleExportCSV}
              title="Export filtered deals to CSV"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Export CSV
            </button>
            <button className="crud-add-btn" onClick={handleAddDeal}>
              <Plus size={18} /> Add Deal
            </button>
          </div>
        </div>

        {/* KPI Ribbon */}
        <div className="deals-kpi-ribbon">
          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Total Deals</span>
              <span className="deals-kpi-val">{kpiStats.total}</span>
            </div>
            <div className="deals-kpi-icon blue">
              <Layers size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Active / Live</span>
              <span className="deals-kpi-val" style={{ color: '#10b981' }}>{kpiStats.approved}</span>
            </div>
            <div className="deals-kpi-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Pending Review</span>
              <span className="deals-kpi-val" style={{ color: '#d97706' }}>{kpiStats.pending}</span>
            </div>
            <div className="deals-kpi-icon orange">
              <Clock size={20} />
            </div>
          </div>

          <div
            className="deals-kpi-card"
            style={{ cursor: 'pointer', borderColor: showBestSellingOnly ? 'var(--color-navy, #2F368C)' : undefined, background: showBestSellingOnly ? '#eef0ff' : undefined }}
            onClick={() => { setShowBestSellingOnly(v => !v); setCurrentPage(1); }}
            title={showBestSellingOnly ? 'Click to clear Best Selling filter' : 'Click to show only Best Selling deals'}
          >
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">⭐ Best Selling</span>
              <span className="deals-kpi-val" style={{ color: 'var(--color-navy, #2F368C)' }}>{kpiStats.bestSelling}</span>
            </div>
            <div className="deals-kpi-icon blue">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Expired Deals</span>
              <span className="deals-kpi-val" style={{ color: '#ef4444' }}>{kpiStats.expired}</span>
            </div>
            <div className="deals-kpi-icon red">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Total Engagements</span>
              <span className="deals-kpi-val" style={{ color: '#0284c7' }}>{kpiStats.totalClicks.toLocaleString('en-IN')}</span>
            </div>
            <div className="deals-kpi-icon blue">
              <Eye size={20} />
            </div>
          </div>
        </div>

        {/* Active / Expired Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', borderBottom: '2px solid #e2e8f0', margin: '0 0 20px 0' }}>
          <button
            onClick={() => { setDealsTab('active'); setCurrentPage(1); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: dealsTab === 'active' ? '3px solid var(--color-red, #E31E25)' : '3px solid transparent',
              marginBottom: '-2px',
              padding: '12px 24px',
              fontWeight: dealsTab === 'active' ? 700 : 500,
              color: dealsTab === 'active' ? 'var(--color-red, #E31E25)' : '#64748b',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} />
            Active Deals
            <span style={{ background: dealsTab === 'active' ? 'var(--color-red, #E31E25)' : '#e2e8f0', color: dealsTab === 'active' ? '#fff' : '#64748b', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', minWidth: '20px', textAlign: 'center' }}>
              {activeDeals.length}
            </span>
          </button>
          <button
            onClick={() => { setDealsTab('expired'); setCurrentPage(1); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: dealsTab === 'expired' ? '3px solid #ef4444' : '3px solid transparent',
              marginBottom: '-2px',
              padding: '12px 24px',
              fontWeight: dealsTab === 'expired' ? 700 : 500,
              color: dealsTab === 'expired' ? '#ef4444' : '#64748b',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertTriangle size={15} />
            Expired Deals
            {kpiStats.expired > 0 && (
              <span style={{ background: dealsTab === 'expired' ? '#ef4444' : '#fee2e2', color: dealsTab === 'expired' ? '#fff' : '#ef4444', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', minWidth: '20px', textAlign: 'center' }}>
                {kpiStats.expired}
              </span>
            )}
          </button>
          {dealsTab === 'expired' && (
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#ef4444', fontStyle: 'italic', padding: '0 16px', fontWeight: 500 }}>
              ⚠️ These deals are no longer live. Review or remove them.
            </span>
          )}
        </div>

        {/* Advanced Filter Toolbar */}
        <div className="advanced-filter-panel">
          {/* Top Row: Search + Sort + Reset + View Mode */}
          <div className="filter-row-top">
            <div className="crud-search" style={{ maxWidth: '420px', flex: 1 }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search deals by title, brand, store, ASIN, coupon..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={handleResetFilters}
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    borderRadius: '8px',
                    color: 'var(--color-red, #E31E25)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    height: '38px',
                    padding: '0 12px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Reset all search queries and active filters"
                >
                  <RotateCcw size={14} /> Reset ({activeFiltersCount})
                </button>
              )}

              {/* Sort Dropdown */}
              <div className="filter-sort-wrap">
                <span className="filter-sort-label">Sort:</span>
                <select 
                  className="filter-select-input sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recent">Posted Date: Newest First</option>
                  <option value="posted-oldest">Posted Date: Oldest First</option>
                  <option value="expiry-soon">Expiring Soonest (Urgent Deals)</option>
                  <option value="discount-high">Highest Discount %</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="clicks-high">Most Clicks</option>
                  <option value="store-az">Store Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle (Table / Grid) */}
              <div className="view-toggle-group">
                <button 
                  className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <List size={16} /> Table
                </button>
                <button 
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid / Card View"
                >
                  <LayoutGrid size={16} /> Cards
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Faceted Filters + Results Counter */}
          <div className="filter-row-bottom">
            <div className="filter-dropdowns-group">
              <span className="filter-pill-label">
                <Filter size={14} /> Filters:
              </span>

              {/* Store */}
              <select 
                className="filter-select-input"
                value={selectedStore}
                onChange={(e) => { setSelectedStore(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Stores</option>
                {storeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Category */}
              <select 
                className="filter-select-input"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Categories</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Deal Type */}
              <select 
                className="filter-select-input"
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Deal Types</option>
                <option value="deal">Standard Deals</option>
                <option value="loot">⚡ Loot Deals</option>
              </select>

              {/* Status */}
              <select 
                className="filter-select-input"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Statuses</option>
                <option value="Approved">Approved / Live</option>
                <option value="Pending Approval">Pending Review</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>

              {/* Priority */}
              <select 
                className="filter-select-input"
                value={selectedPriority}
                onChange={(e) => { setSelectedPriority(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <span className="filter-results-badge">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} shown
            </span>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedDealIds.length > 0 && (
          <div className="bulk-action-bar">
            <div className="bulk-action-info">
              <span>{selectedDealIds.length} deals selected</span>
              <button 
                onClick={() => setSelectedDealIds([])}
                style={{ background: 'none', border: 'none', color: '#991b1b', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                Clear Selection
              </button>
            </div>

            <div className="bulk-action-buttons">
              <button className="bulk-btn approve" onClick={handleBulkApprove}>
                <Check size={14} /> Approve Selected
              </button>
              <button className="bulk-btn draft" onClick={handleBulkDraft}>
                Move to Draft
              </button>
              <button className="bulk-btn delete" onClick={handleBulkDelete}>
                <Trash2 size={14} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW 1: TABLE VIEW ── */}
        {viewMode === 'table' ? (
          <div className="crud-table-card">
            <div className="crud-table-container">
              <table className="crud-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={paginatedDeals.length > 0 && paginatedDeals.every(d => selectedDealIds.includes(d.id))}
                      onChange={handleSelectAllOnPage}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th>Image</th>
                  <th>Product & Brand</th>
                  <th>Store</th>
                  <th>Classification & Stock</th>
                  <th>Pricing</th>
                  <th style={{ minWidth: '220px' }}>Discount & Offers</th>
                  <th style={{ minWidth: '150px' }}>Storefront Section</th>
                  <th>Deal Posted Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeals.map((deal) => {
                  const isSelected = selectedDealIds.includes(deal.id)
                  return (
                    <tr key={deal.id} style={{ backgroundColor: isSelected ? '#fef2f2' : undefined }}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleToggleSelectDeal(deal.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ width: '56px' }}>
                        <img 
                          src={deal.image || deal.images[0] || PLACEHOLDER_DEAL_IMAGE} 
                          alt={deal.title} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                          onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                        />
                      </td>
                      <td>
                        {deal.brand && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-red, #E31E25)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                            {deal.brand}
                          </span>
                        )}
                        <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {deal.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span>{deal.category}</span>
                          {deal.asinOrSku && (
                            <span style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px', color: '#475569', fontSize: '0.7rem', fontWeight: 600 }}>
                              {deal.asinOrSku}
                            </span>
                          )}
                          {deal.code && (
                            <span style={{ fontFamily: 'monospace', background: '#fef2f2', padding: '1px 5px', borderRadius: '3px', color: 'var(--color-red, #E31E25)', fontWeight: 600 }}>
                              {deal.code}
                            </span>
                          )}
                        </div>
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
                          title={deal.store}
                        >
                          <img 
                            src={getStoreLogo(deal.store)} 
                            alt={deal.store} 
                            style={{ maxHeight: '20px', maxWidth: '65px', objectFit: 'contain' }} 
                            onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            <span className={`type-badge ${deal.type}`}>
                              {deal.type === 'loot' ? '⚡ Loot' : deal.type === 'flash' ? '⚡ Flash' : deal.type === 'daily' ? '🌟 Daily' : '🏷️ Deal'}
                            </span>
                            {deal.stockStatus && (
                              <span className={`stock-pill ${deal.stockStatus.includes('Lightning') ? 'lightning' : deal.stockStatus.includes('Limited') ? 'limited' : 'instock'}`}>
                                <span className="stock-dot" /> {deal.stockStatus}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            {deal.badge && (
                              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                                {deal.badge}
                              </span>
                            )}
                            {deal.isVerified && (
                              <span className="verified-badge" title="Verified Deal">✓ Verified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span className="deal-table-price">{formatPriceWithRupee(deal.price)}</span>
                          {deal.originalPrice && (
                            <span className="deal-table-mrp">{formatPriceWithRupee(deal.originalPrice)}</span>
                          )}
                        </div>
                        {deal.effectivePrice && deal.effectivePrice !== deal.price && (
                          <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                            Eff: {formatPriceWithRupee(deal.effectivePrice)}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span className="deal-table-discount">{deal.discountLabel}</span>
                          {deal.bankOffer && (
                            <span style={{ fontSize: '0.72rem', color: '#4338ca', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                              💳 {deal.bankOffer}
                            </span>
                          )}
                          {deal.cashback && (
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                              💰 {deal.cashback}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <select
                          value={deal.sectionPlacement || (deal.isBestSelling ? 'best_selling' : 'both')}
                          onChange={(e) => handleSectionPlacementChange(deal.id, e.target.value as any)}
                          title="Choose which section on the storefront /deals page this card appears in"
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: deal.sectionPlacement === 'best_selling' ? '#fef3c7' : deal.sectionPlacement === 'both' ? '#eff6ff' : '#f8fafc',
                            color: deal.sectionPlacement === 'best_selling' ? '#92400e' : deal.sectionPlacement === 'both' ? '#1e40af' : '#334155',
                            cursor: 'pointer',
                            minWidth: '135px',
                            outline: 'none'
                          }}
                        >
                          <option value="both">Both (Sec 1 &amp; 2)</option>
                          <option value="favourite">Section 1 (Main)</option>
                          <option value="best_selling">Section 2 (Best Seller)</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#475569' }}>
                          <Clock size={12} className="posted-clock-icon" />
                          <span>{deal.postedAt}</span>
                        </div>
                      </td>
                      <td>
                        {(() => {
                          const countdown = getExpiryCountdown(deal.expiresAt)
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#334155', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                <Calendar size={12} style={{ color: countdown.status === 'expired' ? '#ef4444' : countdown.status === 'urgent' ? '#ea580c' : '#64748b' }} />
                                <span>{formatExpiryDate(deal.expiresAt)}</span>
                              </div>
                              <span className={`expiry-pill ${countdown.status}`}>
                                {countdown.status === 'expired' && '⛔ '}
                                {countdown.status === 'urgent' && '🔥 '}
                                {countdown.status === 'warning' && '⏳ '}
                                {countdown.status === 'normal' && '📅 '}
                                {countdown.text}
                              </span>
                            </div>
                          )
                        })()}
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleStatus(deal.id)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex' }}
                          title="Click to toggle status"
                        >
                          <span className={`status-badge ${deal.status === 'Approved' ? 'active' : deal.status === 'Pending Approval' ? 'pending' : deal.status === 'Draft' ? 'draft' : 'expired'}`}>
                            <span className="status-dot" /> {deal.status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            className="action-btn view" 
                            onClick={() => setPreviewDeal(deal)} 
                            title="Preview Customer Deal Page"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="action-btn edit" 
                            onClick={() => handleEditDeal(deal)} 
                            title="Edit Deal"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => handleDeleteDeal(deal.id)} 
                            title="Delete Deal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {paginatedDeals.length === 0 && (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                      <AlertTriangle size={24} style={{ color: '#f59e0b', margin: '0 auto 8px auto', display: 'block' }} />
                      No promotional deals found matching your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-wrap">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem', color: '#64748b' }}>
                <span>
                  Showing <strong>{filteredDeals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredDeals.length)}</strong> of <strong>{filteredDeals.length}</strong> deals
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem' }}>Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={1000}>All</option>
                  </select>
                </div>
              </div>

              <div className="pagination-controls">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    className={`page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── VIEW 2: GRID / CARD VIEW ── */
          <div>
            <div className="deals-grid-container">
              {paginatedDeals.map((deal) => {
                const isSelected = selectedDealIds.includes(deal.id)
                return (
                  <div key={deal.id} className="deal-card-manage" style={{ borderColor: isSelected ? 'var(--color-red, #E31E25)' : undefined }}>
                    {/* Checkbox */}
                    <input 
                      type="checkbox" 
                      className="deal-card-checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectDeal(deal.id)}
                    />

                    {/* Image Thumbnail */}
                    <div className="deal-card-manage-thumb">
                      <img 
                        src={deal.image || deal.images[0] || PLACEHOLDER_DEAL_IMAGE} 
                        alt={deal.title} 
                        onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                      />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 4, display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {deal.isBestSelling && (
                          <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: '4px', fontSize: '10px', fontWeight: 800, padding: '2px 5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            ⭐ Best Seller
                          </span>
                        )}
                        <span className={`type-badge ${deal.type}`}>
                          {deal.type === 'loot' ? '⚡ Loot' : deal.type === 'flash' ? '⚡ Flash' : deal.type === 'daily' ? '🌟 Daily' : '• Deal'}
                        </span>
                        {deal.isVerified && (
                          <span style={{ background: '#ffffff', color: '#0284c7', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} title="Verified Deal">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="deal-card-manage-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            background: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '6px', 
                            padding: '3px 8px', 
                            height: '26px' 
                          }} 
                          title={deal.store}
                        >
                          <img src={getStoreLogo(deal.store)} alt={deal.store} style={{ maxHeight: '16px', maxWidth: '55px', objectFit: 'contain' }} />
                        </div>
                        <button 
                          onClick={() => handleToggleStatus(deal.id)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <span className={`status-badge ${deal.status === 'Approved' ? 'active' : deal.status === 'Pending Approval' ? 'pending' : 'inactive'}`}>
                            {deal.status}
                          </span>
                        </button>
                      </div>

                      {deal.brand && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-red, #E31E25)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px' }}>
                          {deal.brand}
                        </span>
                      )}

                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '2px 0 0', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {deal.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{formatPriceWithRupee(deal.price)}</span>
                        {deal.originalPrice && (
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPriceWithRupee(deal.originalPrice)}</span>
                        )}
                        {deal.discountLabel && (
                          <span style={{ marginLeft: 'auto', color: '#10b981', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                            {deal.discountLabel}
                          </span>
                        )}
                      </div>

                      {/* E-Commerce Offer Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {deal.effectivePrice && (
                          <span className="effective-price-chip" title="Price with card offer">
                            Eff: {formatPriceWithRupee(deal.effectivePrice)}
                          </span>
                        )}
                        {deal.cashback && (
                          <span className="cashback-chip" title={deal.cashback}>
                            💰 {deal.cashback}
                          </span>
                        )}
                        {deal.stockStatus && (
                          <span className={`stock-pill ${deal.stockStatus.includes('Lightning') ? 'lightning' : deal.stockStatus.includes('Limited') ? 'limited' : 'instock'}`}>
                            <span className="stock-dot" /> {deal.stockStatus}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#64748b', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} className="posted-clock-icon" />
                          <span>{deal.postedAt}</span>
                        </div>
                        {(() => {
                          const countdown = getExpiryCountdown(deal.expiresAt)
                          return (
                            <span className={`expiry-pill ${countdown.status}`} title={`Expires: ${formatExpiryDate(deal.expiresAt)}`}>
                              {countdown.status === 'expired' && '⛔ '}
                              {countdown.status === 'urgent' && '🔥 '}
                              {countdown.status === 'warning' && '⏳ '}
                              {countdown.status === 'normal' && '📅 '}
                              {countdown.text}
                            </span>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="deal-card-manage-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select
                        value={deal.sectionPlacement || (deal.isBestSelling ? 'best_selling' : 'both')}
                        onChange={(e) => handleSectionPlacementChange(deal.id, e.target.value as any)}
                        title="Choose storefront section placement"
                        style={{
                          padding: '4px 6px',
                          borderRadius: '6px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: deal.sectionPlacement === 'best_selling' ? '#fef3c7' : deal.sectionPlacement === 'both' ? '#eff6ff' : '#f8fafc',
                          color: deal.sectionPlacement === 'best_selling' ? '#92400e' : deal.sectionPlacement === 'both' ? '#1e40af' : '#334155',
                          cursor: 'pointer',
                          maxWidth: '125px',
                          outline: 'none'
                        }}
                      >
                        <option value="both">Both (Sec 1 &amp; 2)</option>
                        <option value="favourite">Section 1 (Main)</option>
                        <option value="best_selling">Section 2 (Best Seller)</option>
                      </select>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button className="action-btn view" onClick={() => setPreviewDeal(deal)} title="Preview Deal">
                          <Eye size={15} />
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditDeal(deal)} title="Edit Deal">
                          <Edit2 size={15} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteDeal(deal.id)} title="Delete Deal">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-wrap" style={{ borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem', color: '#64748b' }}>
                <span>
                  Showing <strong>{filteredDeals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredDeals.length)}</strong> of <strong>{filteredDeals.length}</strong> deals
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem' }}>Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={1000}>All</option>
                  </select>
                </div>
              </div>

              <div className="pagination-controls">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    className={`page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 1: ADD / EDIT DEAL MODAL ── */}
        {isModalOpen && (
          <div className="crud-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="crud-modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-header-content">
                  <h3 className="modal-title">
                    {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                  </h3>
                  <p className="modal-subtitle">
                    Enter pricing, partner store details, and product information.
                  </p>
                </div>
                <button className="modal-close" onClick={() => setIsModalOpen(false)} title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* Form Stepper Header */}
                <div className="form-stepper" style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    className={`step-tab-btn ${formStep === 1 ? 'active' : ''} ${form.title && form.price ? 'completed' : ''}`}
                    onClick={() => setFormStep(1)}
                  >
                    <div className="step-number">1</div>
                    <div className="step-info">
                      <span className="step-title">Step 1: Product, Store & Pricing</span>
                      <span className="step-desc">Title, store, ASIN, price & discounts</span>
                    </div>
                  </button>
                  <div className="step-divider">›</div>
                  <button
                    type="button"
                    className={`step-tab-btn ${formStep === 2 ? 'active' : ''} ${form.image ? 'completed' : ''}`}
                    onClick={() => setFormStep(2)}
                  >
                    <div className="step-number">2</div>
                    <div className="step-info">
                      <span className="step-title">Step 2: Media, Expiry & Specs</span>
                      <span className="step-desc">Images, expiry countdown & guidance</span>
                    </div>
                  </button>
                </div>

                {formStep === 1 && (
                  <div className="form-step-pane">
                    {/* Section 1: Product & Store Information (Amazon & Flipkart style) */}
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Tag size={16} /></div>
                        <h4 className="form-section-title">Product & Store Identifiers</h4>
                        <span className="form-section-desc">Platform affiliation & product details</span>
                      </div>

                  <div className="form-group">
                    <label>
                      Deal Title / Product Name <span className="required-star">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apple iPhone 15 Pro Max (256GB, Natural Titanium)" 
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Partner Store <span className="required-star">*</span></label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                          value={form.store} 
                          onChange={(e) => setForm({ ...form, store: e.target.value })}
                          required
                          style={{ flex: 1 }}
                        >
                          {storeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div 
                          style={{ 
                            width: '46px', 
                            height: '38px', 
                            background: '#ffffff', 
                            border: '1.5px solid #cbd5e1', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: '2px 4px',
                            flexShrink: 0
                          }}
                          title={`Store logo: ${form.store}`}
                        >
                          <img 
                            src={getStoreLogo(form.store)} 
                            alt={form.store} 
                            style={{ maxHeight: '20px', maxWidth: '38px', objectFit: 'contain' }} 
                            onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Brand Name <span className="required-star">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Apple, Sony, Samsung, Nike" 
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category <span className="required-star">*</span></label>
                      <select 
                        value={form.category} 
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                      >
                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Sub-Category / Department</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Smartphones & Audio, Men's Footwear" 
                        value={form.subCategory || ''}
                        onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>ASIN / Product SKU / FSN Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. B0CHX1W1XY or FSNMOB8923" 
                        value={form.asinOrSku || ''}
                        onChange={(e) => setForm({ ...form, asinOrSku: e.target.value.toUpperCase() })}
                        style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Deal Destination Link / Affiliate URL <span className="required-star">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://amazon.in/dp/... or /stores#amazon" 
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      required
                    />
                    <span className="field-hint">Users will be redirected to this link when clicking Grab Deal</span>
                  </div>
                </div>

                {/* Section 2: Pricing, Discounts & Financial Incentives */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><Zap size={16} /></div>
                    <h4 className="form-section-title">Pricing, Bank Offers & Cashback</h4>
                    <span className="form-section-desc">E-commerce price breakdown</span>
                  </div>

                  <div className="form-row-3">
                    <div className="form-group highlight-input">
                      <label>Offer Price <span className="required-star">*</span></label>
                      <div className="input-with-symbol">
                        <span className="input-symbol">₹</span>
                        <input 
                          type="text" 
                          placeholder="1,049" 
                          value={form.price.replace('₹', '')}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          required
                        />
                      </div>
                      <span className="field-hint">Selling price on store</span>
                    </div>

                    <div className="form-group">
                      <label>Original MRP</label>
                      <div className="input-with-symbol">
                        <span className="input-symbol">₹</span>
                        <input 
                          type="text" 
                          placeholder="1,299" 
                          value={form.originalPrice.replace('₹', '')}
                          onChange={(e) => handleMrpChange(e.target.value)}
                        />
                      </div>
                      <span className="field-hint">MRP before discount</span>
                    </div>

                    <div className="form-group">
                      <label>Discount Badge</label>
                      <input 
                        type="text" 
                        placeholder="Save 19%" 
                        value={form.discountLabel}
                        onChange={(e) => setForm({ ...form, discountLabel: e.target.value })}
                      />
                      <span className="field-hint">Auto-calculated or custom</span>
                    </div>
                  </div>

                  <div className="form-row-3" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Bank / Card Instant Discount</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Flat ₹1,500 Instant Discount on HDFC Cards" 
                        value={form.bankOffer || ''}
                        onChange={(e) => setForm({ ...form, bankOffer: e.target.value })}
                      />
                      <span className="field-hint">Additional card discount shown on product page</span>
                    </div>

                    <div className="form-group">
                      <label>Effective Final Price</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹49,999 (Price after bank offer)" 
                        value={form.effectivePrice || ''}
                        onChange={(e) => setForm({ ...form, effectivePrice: e.target.value.startsWith('₹') ? e.target.value : `₹${e.target.value}` })}
                      />
                      <span className="field-hint">Lowest price after applying bank/coupon offers</span>
                    </div>

                    <div className="form-group">
                      <label>Coupon Code (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. SAVE20" 
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        style={{ fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}
                      />
                      <span className="field-hint">Enter code if coupon is required</span>
                    </div>
                  </div>

                  <div className="form-row-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Extra Wouchify Cashback / Rewards</label>
                      <input 
                        type="text" 
                        placeholder="e.g. + 5% Wouchify Cashback or + ₹150 Wallet Cash" 
                        value={form.cashback || ''}
                        onChange={(e) => setForm({ ...form, cashback: e.target.value })}
                      />
                      <span className="field-hint">Extra earnings users receive for purchasing via Wouchify</span>
                    </div>

                    <div className="form-group">
                      <label>Stock / Inventory Status</label>
                      <select 
                        value={form.stockStatus || 'In Stock'} 
                        onChange={(e) => setForm({ ...form, stockStatus: e.target.value as any })}
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock (Hurry!)</option>
                        <option value="Lightning Deal (85% Claimed)">⚡ Lightning Deal (85% Claimed)</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                      <span className="field-hint">Displayed as an urgency badge to shoppers</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="form-step-pane">
                    {/* Section 3: Urgency, Timing & Storefront Placement */}
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Clock size={16} /></div>
                        <h4 className="form-section-title">Schedule, Badging & Placement</h4>
                        <span className="form-section-desc">Publishing rules & priority</span>
                      </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Deal Classification</label>
                      <select 
                        value={form.type} 
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      >
                        <option value="deal">Standard Deal</option>
                        <option value="loot">⚡ Loot Deal (Massive Discount)</option>
                        <option value="flash">⚡ Flash / Lightning Deal</option>
                        <option value="daily">🌟 Deal of the Day</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Storefront Badge / Tag</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Amazon's Choice, Lowest in 30 Days" 
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Priority Level</label>
                      <select 
                        value={form.priority} 
                        onChange={(e) => setForm({ ...form, priority: e.target.value as Deal['priority'] })}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Product Rating & Reviews</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 4.5 ★ (14,250 reviews)" 
                        value={form.rating || ''}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      />
                      <span className="field-hint">Star rating & review count shown on product badge</span>
                    </div>

                    <div className="form-group">
                      <label>Warranty & Return Policy</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1 Year Brand Warranty • 7 Days Replacement" 
                        value={form.warranty || ''}
                        onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                      />
                      <span className="field-hint">Trust terms displayed on storefront</span>
                    </div>
                  </div>

                  <div className="form-row-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Deal Posted Date & Time <span className="required-star">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Today, 11:30 AM or Sep 9, 2026, 11:30 AM" 
                        value={form.postedAt}
                        onChange={(e) => setForm({ ...form, postedAt: e.target.value })}
                        required
                      />
                      <span className="field-hint">Published date shown on badges and executive reporting</span>
                    </div>

                    <div className="form-group">
                      <label>Expiry Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={form.expiresAt}
                        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      />
                      <div className="quick-preset-wrap">
                        <span style={{ fontSize: '0.72rem', color: '#64748b', alignSelf: 'center', marginRight: '2px' }}>Presets:</span>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(24)}>+24h</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(72)}>+3 Days</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(168)}>+7 Days</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(720)}>+30 Days</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(null)} style={{ color: '#ef4444' }}>Clear</button>
                      </div>
                      <span className="field-hint">Offer end schedule for countdown timers & automatic deal expiration</span>
                    </div>
                  </div>

                  {/* Granular Section Placement Dropdown */}
                  <div className="form-group" style={{ marginTop: '14px' }}>
                    <label>Storefront Section Placement <span className="required-star">*</span></label>
                    <select
                      value={form.sectionPlacement || (form.isBestSelling ? 'best_selling' : 'both')}
                      onChange={(e) => {
                        const val = e.target.value as 'both' | 'favourite' | 'best_selling'
                        setForm({
                          ...form,
                          sectionPlacement: val,
                          isBestSelling: val === 'best_selling' || val === 'both'
                        })
                      }}
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        padding: '0 12px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="both">Both (Section 1 - Main Deals &amp; Section 2 - Best Selling Picks)</option>
                      <option value="favourite">Section 1 (Main Deals / Favourite Stores Catalog Only)</option>
                      <option value="best_selling">Section 2 (Best Selling Deals Picks Only)</option>
                    </select>
                    <span className="field-hint">Choose whether this deal appears in Section 1, Section 2, or Both sections on the Deals storefront page.</span>
                  </div>

                  {/* Feature Checkbox Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.isFeatured || false} 
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} 
                      />
                      <div>
                        <div>Feature on Homepage Hero Carousel</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>Pinned to top storefront banners</div>
                      </div>
                    </label>

                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.isVerified ?? true} 
                        onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} 
                      />
                      <div>
                        <div>Verified Executive Deal (Blue Tick)</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>Shows verified authentic seal to users</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 4: Product Media & Gallery */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><ImageIcon size={16} /></div>
                    <h4 className="form-section-title">Product Media & Gallery</h4>
                    <span className="form-section-desc">Upload from device / local storage, paste URL or Google Drive link</span>
                  </div>

                  <ImageUploadField
                    label="Primary Deal Image *"
                    placeholder="Paste URL, Google Drive link, or click Upload from device..."
                    value={form.image}
                    onChange={(val) => handleImageUrlChange(val)}
                  />

                  <div className="form-group" style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Quick Sample Image Presets (Click to Select):</label>
                    <div className="image-preset-list">
                      {DEAL_PRODUCT_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          className={`image-preset-chip ${form.image === preset.image ? 'active' : ''}`}
                          onClick={() => {
                            setForm(prev => ({ ...prev, image: preset.image, images: [preset.image] }))
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label>Additional Gallery Images (Comma-separated URLs)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://.../photo2.jpg, https://.../photo3.jpg" 
                      value={(form.images || []).slice(1).join(', ')}
                      onChange={(e) => {
                        const extras = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        setForm(prev => ({
                          ...prev,
                          images: [prev.image || prev.images[0] || '', ...extras]
                        }))
                      }}
                    />
                    <span className="field-hint">Extra product photos shown in the customer image gallery</span>
                  </div>
                </div>

                {/* Section 5: Buying Guidance & Product Content (Amazon/Flipkart Content) */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><FileText size={16} /></div>
                    <h4 className="form-section-title">Product Content & Buying Instructions</h4>
                    <span className="form-section-desc">Key highlights and steps to claim</span>
                  </div>

                  <div className="form-group">
                    <label>Key Product Highlights & Specifications (One feature per line)</label>
                    <textarea 
                      rows={3} 
                      placeholder="e.g.&#10;• 6.7-inch Super Retina XDR display with ProMotion&#10;• A17 Pro chip with 6-core GPU&#10;• 48MP Main camera with 5x telephoto zoom&#10;• Up to 29 hours all-day video playback" 
                      value={(form.highlights || []).join('\n')}
                      onChange={(e) => setForm({ 
                        ...form, 
                        highlights: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) 
                      })}
                    />
                    <span className="field-hint">Bullet point specifications shown prominently on the deal product page</span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Variant / Size / Color Note</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Valid on Titanium Grey, 128GB variant only" 
                        value={form.variantNote || ''}
                        onChange={(e) => setForm({ ...form, variantNote: e.target.value })}
                      />
                      <span className="field-hint">Notes on which specific variants carry the discount</span>
                    </div>

                    <div className="form-group">
                      <label>Delivery & Shipping Info</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Free Delivery or Prime 1-Day Delivery" 
                        value={form.deliveryInfo || ''}
                        onChange={(e) => setForm({ ...form, deliveryInfo: e.target.value })}
                      />
                      <span className="field-hint">Shipping conditions</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Step-by-Step "How to Avail / Claim Deal"</label>
                    <textarea 
                      rows={3} 
                      placeholder="e.g. 1. Click Grab Deal. 2. Apply the 10% coupon box on Amazon. 3. Pay with HDFC card."
                      value={form.howToClaim || ''}
                      onChange={(e) => setForm({ ...form, howToClaim: e.target.value })}
                    />
                    <span className="field-hint">Instructions for customers to unlock the maximum savings</span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Deal Description</label>
                      <textarea 
                        rows={3} 
                        placeholder="Provide details about features, warranty, or coupon instructions..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Terms & Conditions</label>
                      <textarea 
                        rows={3} 
                        placeholder="Offer restrictions, valid categories, or maximum redemption limits..."
                        value={form.terms || ''}
                        onChange={(e) => setForm({ ...form, terms: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Live Storefront Card Preview */}
                <div className="form-section" style={{ background: '#f8fafc' }}>
                  <div className="deal-live-preview-box">
                    <span className="preview-header-text">Live Storefront Card Preview</span>
                    <div className="preview-deal-card">
                      <div className="preview-deal-image-wrap">
                        <img 
                          src={form.image || form.images[0] || PLACEHOLDER_DEAL_IMAGE} 
                          alt="Live Preview" 
                          onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                        />
                      </div>
                      <div className="preview-deal-body">
                        <div className="preview-store-strip">
                          <div className="preview-store-name" title={form.store}>
                            <img src={getStoreLogo(form.store)} alt={form.store} style={{ height: '18px', maxWidth: '65px', objectFit: 'contain' }} />
                          </div>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <span className="preview-deal-badge">{form.badge || 'Hot Deal'}</span>
                            {form.isVerified && (
                              <span style={{ color: '#0284c7', fontSize: '12px', fontWeight: 800 }}>✓ Verified</span>
                            )}
                          </div>
                        </div>

                        {form.brand && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-red, #E31E25)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                            {form.brand}
                          </div>
                        )}

                        <h5 className="preview-deal-title" style={{ margin: '2px 0 6px' }}>{form.title || 'Product Title Will Appear Here'}</h5>
                        
                        <div className="preview-price-strip">
                          <span className="preview-offer-price">{form.price || '₹0'}</span>
                          {form.originalPrice && <span className="preview-mrp-price">{form.originalPrice}</span>}
                          {form.discountLabel && <span className="preview-discount-badge">{form.discountLabel}</span>}
                        </div>

                        {form.bankOffer && (
                          <div style={{ fontSize: '0.74rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '3px 6px', margin: '6px 0 4px', fontWeight: 600 }}>
                            💳 {form.bankOffer}
                          </div>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0 8px' }}>
                          {form.effectivePrice && (
                            <span className="effective-price-chip">Effective: {form.effectivePrice}</span>
                          )}
                          {form.cashback && (
                            <span className="cashback-chip">💰 {form.cashback}</span>
                          )}
                          {form.stockStatus && (
                            <span className="stock-pill instock">{form.stockStatus}</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#64748b', margin: '4px 0 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} style={{ color: 'var(--color-red, #E31E25)' }} />
                            <span>Posted: <strong style={{ color: '#334155' }}>{form.postedAt || 'Today'}</strong></span>
                          </div>
                          {form.expiresAt && (
                            <span className={`expiry-pill ${getExpiryCountdown(form.expiresAt).status}`}>
                              ⏳ {getExpiryCountdown(form.expiresAt).text}
                            </span>
                          )}
                        </div>
                        <button type="button" className="preview-cta-btn">GRAB DEAL</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between', display: 'flex' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Status: <strong style={{ color: '#0f172a' }}>{editingDeal ? editingDeal.status : 'New Deal (Draft)'}</strong>
            </div>
            <div className="modal-footer-actions">
              {formStep === 1 ? (
                <>
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={() => {
                      if (!form.title.trim()) {
                        showToast('Please enter a Deal Title')
                        return
                      }
                      if (!form.price.trim()) {
                        showToast('Please enter Offer Price')
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
                  <button type="button" className="btn-draft" onClick={() => handleSave('Draft')}>
                    <Save size={16} /> Save as Draft
                  </button>
                  <button type="button" className="btn-save" onClick={() => handleSave('Pending Approval')}>
                    <Send size={16} /> Submit for Review
                  </button>
                </>
              )}
            </div>
          </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: E-COMMERCE DEAL PAGE PRODUCT CONTENT MODAL ── */}
        {previewDeal && (
          <div className="crud-modal-overlay" onClick={() => setPreviewDeal(null)}>
            <div className="deal-product-modal" onClick={(e) => e.stopPropagation()}>
              
              {/* Top Navigation & Breadcrumb Bar */}
              <div className="deal-product-top-bar">
                <div className="deal-product-breadcrumb">
                  <span>Home</span>
                  <span>/</span>
                  <span>Deals</span>
                  <span>/</span>
                  <span>{previewDeal.category}</span>
                  <span>/</span>
                  <strong style={{ color: '#0f172a' }}>{previewDeal.brand || previewDeal.store}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Store logo only chip - no text */}
                  <div 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: '#ffffff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      padding: '3px 8px', 
                      height: '28px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)' 
                    }}
                    title={previewDeal.store}
                  >
                    <img 
                      src={getStoreLogo(previewDeal.store)} 
                      alt={previewDeal.store} 
                      style={{ maxHeight: '18px', maxWidth: '56px', objectFit: 'contain' }} 
                      onError={(e) => { (e.target as any).src = PLACEHOLDER_STORE_LOGO }}
                    />
                  </div>

                  <span className={`type-badge ${previewDeal.type}`}>
                    {previewDeal.type === 'loot' ? '⚡ LOOT DEAL' : previewDeal.type === 'flash' ? '⚡ FLASH DEAL' : previewDeal.type === 'daily' ? '🌟 DEAL OF THE DAY' : '• SPECIAL DEAL'}
                  </span>

                  {previewDeal.isVerified && (
                    <span style={{ color: '#0284c7', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  )}

                  <button className="modal-close" onClick={() => setPreviewDeal(null)} title="Close">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Main Product Content Body */}
              <div className="deal-product-modal-body">
                <div className="deal-product-main-grid">
                  
                  {/* Left Column: Product Media & Trust Badges */}
                  <div className="deal-product-media-col">
                    <div className="deal-product-main-img-card">
                      <img 
                        src={previewDeal.image || previewDeal.images[0] || PLACEHOLDER_DEAL_IMAGE} 
                        alt={previewDeal.title} 
                        onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                      />
                      {previewDeal.discountLabel && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                          <span className="deal-save-badge">{previewDeal.discountLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Gallery Thumbnails if available */}
                    {previewDeal.images && previewDeal.images.length > 1 && (
                      <div className="deal-product-thumbs">
                        {previewDeal.images.map((imgUrl, i) => (
                          <div key={i} className="deal-product-thumb active">
                            <img src={imgUrl} alt={`Thumb ${i+1}`} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stock Urgency Meter */}
                    {previewDeal.stockStatus && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#991b1b', marginBottom: '6px' }}>
                          <span>⚡ {previewDeal.stockStatus}</span>
                          <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>Hurry! Selling Fast</span>
                        </div>
                        <div style={{ height: '6px', background: '#fee2e2', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: previewDeal.stockStatus.includes('Lightning') ? '85%' : previewDeal.stockStatus.includes('Limited') ? '65%' : '40%', height: '100%', background: 'linear-gradient(90deg, #f87171, #dc2626)', borderRadius: '999px' }} />
                        </div>
                      </div>
                    )}

                    {/* Trust Badges Strip */}
                    <div className="deal-trust-badges-strip">
                      <div className="deal-trust-item">
                        <span>🚚</span>
                        <span>{previewDeal.deliveryInfo || 'Free Fast Delivery'}</span>
                      </div>
                      <div className="deal-trust-item">
                        <span>🛡️</span>
                        <span>{previewDeal.warranty || '1 Year Brand Warranty'}</span>
                      </div>
                      <div className="deal-trust-item">
                        <span>🔄</span>
                        <span>7 Days Replacement</span>
                      </div>
                      <div className="deal-trust-item">
                        <span>🔒</span>
                        <span>100% Genuine Product</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Buying Content & Pricing Math */}
                  <div className="deal-product-info-col">
                    <div className="deal-product-brand-row">
                      {previewDeal.brand && (
                        <span className="deal-brand-tag">{previewDeal.brand}</span>
                      )}
                      {previewDeal.asinOrSku && (
                        <span className="deal-asin-badge">ASIN/SKU: {previewDeal.asinOrSku}</span>
                      )}
                    </div>

                    <h2 className="deal-product-title-large">{previewDeal.title}</h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="deal-rating-badge">
                        {previewDeal.rating || '4.4 ★ (12,500 reviews)'}
                      </span>
                      {previewDeal.badge && (
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4338ca', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>
                          {previewDeal.badge}
                        </span>
                      )}
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="deal-price-card">
                      <div className="deal-price-numbers">
                        <span className="deal-huge-price">{previewDeal.price}</span>
                        {previewDeal.originalPrice && (
                          <span className="deal-strikethrough-mrp">M.R.P.: {previewDeal.originalPrice}</span>
                        )}
                        {previewDeal.discountLabel && (
                          <span className="deal-save-badge">{previewDeal.discountLabel}</span>
                        )}
                      </div>

                      {/* Bank / Card Offer */}
                      {previewDeal.bankOffer && (
                        <div style={{ fontSize: '0.8rem', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '6px 10px', fontWeight: 600 }}>
                          💳 <strong>Bank Offer:</strong> {previewDeal.bankOffer}
                        </div>
                      )}

                      {/* Effective Price Banner */}
                      {previewDeal.effectivePrice && (
                        <div className="deal-effective-banner">
                          <span>🔥 <strong>Effective Final Price:</strong> {previewDeal.effectivePrice}</span>
                          <span style={{ fontSize: '0.74rem', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>After Bank Discount</span>
                        </div>
                      )}

                      {/* Cashback Pill */}
                      {previewDeal.cashback && (
                        <div style={{ fontSize: '0.8rem', color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 10px', fontWeight: 700 }}>
                          💰 <strong>Extra Wouchify Rewards:</strong> {previewDeal.cashback}
                        </div>
                      )}
                    </div>

                    {/* Coupon Code Clip Box */}
                    {previewDeal.code && (
                      <div className="deal-voucher-coupon-box">
                        <div>
                          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                            Applicable Coupon Code
                          </div>
                          <div className="deal-coupon-code-text">{previewDeal.code}</div>
                        </div>
                        <button 
                          type="button" 
                          className="deal-copy-coupon-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(previewDeal.code)
                            showToast(`Copied coupon code ${previewDeal.code}!`)
                          }}
                        >
                          <Copy size={13} /> Copy Code
                        </button>
                      </div>
                    )}

                    {/* Variant Note */}
                    {previewDeal.variantNote && (
                      <div style={{ fontSize: '0.78rem', color: '#475569', background: '#f1f5f9', borderLeft: '3px solid #64748b', padding: '6px 10px', borderRadius: '0 4px 4px 0' }}>
                        ℹ️ <strong>Variant Info:</strong> {previewDeal.variantNote}
                      </div>
                    )}

                    {/* Deal Timing & Expiry Banner */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                        <Clock size={13} style={{ color: previewDeal.postedAt?.startsWith('Today') ? 'var(--color-red, #E31E25)' : '#94a3b8' }} />
                        <span>Posted: <strong style={{ color: '#1e293b' }}>{previewDeal.postedAt}</strong></span>
                      </div>
                      {(() => {
                        const countdown = getExpiryCountdown(previewDeal.expiresAt)
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Expires:</span>
                            <span className={`expiry-pill ${countdown.status}`}>
                              {countdown.status === 'expired' && '⛔ '}
                              {countdown.status === 'urgent' && '🔥 '}
                              {countdown.status === 'warning' && '⏳ '}
                              {countdown.status === 'normal' && '📅 '}
                              {countdown.text} ({formatExpiryDate(previewDeal.expiresAt)})
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Primary Grab Deal Action Button */}
                    <a 
                      href={previewDeal.link || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="deal-grab-primary-btn"
                    >
                      GRAB DEAL ON {previewDeal.store.toUpperCase()} ↗
                    </a>
                  </div>
                </div>

                {/* Lower Product Content Tabs / Sections */}
                <div className="deal-content-tabs-section">
                  
                  {/* Highlights */}
                  {previewDeal.highlights && previewDeal.highlights.length > 0 && (
                    <div className="deal-section-block">
                      <h4 className="deal-section-block-title">
                        <Sparkles size={16} style={{ color: 'var(--color-red, #E31E25)' }} /> Key Product Highlights & Features
                      </h4>
                      <ul className="deal-highlights-list">
                        {previewDeal.highlights.map((h, i) => (
                          <li key={i}>
                            <span className="deal-highlight-check">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Step-by-step How to Claim */}
                  {previewDeal.howToClaim && (
                    <div className="deal-section-block">
                      <h4 className="deal-section-block-title">
                        <Layers size={16} style={{ color: '#2563eb' }} /> How to Avail / Claim this Deal
                      </h4>
                      <div className="deal-steps-grid">
                        {previewDeal.howToClaim.split('\n').filter(s => s.trim().length > 0).map((step, idx) => (
                          <div key={idx} className="deal-step-card">
                            <span className="deal-step-number">{idx + 1}</span>
                            <span className="deal-step-text">{step.replace(/^[0-9]+[.)]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Executive Review / Description */}
                  {previewDeal.description && (
                    <div className="deal-section-block">
                      <h4 className="deal-section-block-title">
                        <FileText size={16} style={{ color: '#059669' }} /> Executive Deal Review & Details
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                        {previewDeal.description}
                      </p>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  {previewDeal.terms && (
                    <div className="deal-section-block" style={{ background: '#ffffff', borderColor: '#cbd5e1' }}>
                      <h4 className="deal-section-block-title" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Terms & Conditions / Disclaimer
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45 }}>
                        {previewDeal.terms}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ justifyContent: 'space-between', padding: '12px 24px' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Deal ID: <strong style={{ fontFamily: 'monospace' }}>#{previewDeal.id}</strong> • Priority: <strong>{previewDeal.priority}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-cancel" onClick={() => setPreviewDeal(null)}>
                    Close
                  </button>
                  <button 
                    className="btn-save" 
                    onClick={() => {
                      const d = previewDeal
                      setPreviewDeal(null)
                      handleEditDeal(d)
                    }}
                  >
                    <Edit2 size={14} /> Edit Deal
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TOAST NOTIFICATION ── */}
        {toastMessage && (
          <div className="toast-message">
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </ExecutiveLayout>
  )
}
