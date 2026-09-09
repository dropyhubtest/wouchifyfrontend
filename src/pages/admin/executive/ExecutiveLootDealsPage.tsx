import React, { useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
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
  Flame,
  Layers,
  Calendar,
  SendHorizontal,
  Bell,
  TrendingDown
} from 'lucide-react'
import './ExecutiveShared.css'
import { DEAL_PRODUCT_PRESETS, getStoreLogo, convertGoogleDriveUrl } from '../../../data/dealsPage'
import { FAVOURITE_STORES } from '../../../data/storesHero'
import { CATEGORIES_DATA } from '../../../data/categories'
import { ImageUploadField } from './ImageUploadField'

export interface LootDeal {
  id: string
  title: string
  store: string
  brand: string
  category: string
  lootType: 'glitch' | 'flash' | 'steal' | 'under99' | 'under199' | 'freebie'
  badge: string
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Expired'
  priority: 'Normal' | 'High' | 'Critical'
  code: string
  link: string
  originalPrice: string
  price: string
  discountLabel: string
  discountValue: number
  effectivePrice?: string
  cashback?: string
  stockClaimedPercent: number
  quantityAlert?: string
  proofNote?: string
  trickSteps?: string
  terms?: string
  asinOrSku?: string
  deliveryInfo?: string
  rating?: string
  postedAt: string
  expiresAt: string
  image: string
  images: string[]
  telegramAlert: boolean
  pushNotification: boolean
  isFeatured: boolean
  isVerified: boolean
  clicks: number
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
    if (isNaN(target)) return { text: 'Valid Loot', status: 'normal' }
    const now = Date.now()
    const diff = target - now
    if (diff <= 0) {
      return { text: 'Loot Ended', status: 'expired' }
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
    return { text: `${mins}m left! (Glitch ends soon)`, status: 'urgent' }
  } catch {
    return { text: 'Valid Loot', status: 'normal' }
  }
}

const initialLootDeals: LootDeal[] = [
  {
    id: 'loot-101',
    title: 'Philips Bluetooth Soundbar 120W with Deep Bass Subwoofer',
    store: 'Amazon',
    brand: 'Philips',
    category: 'Electronics',
    lootType: 'glitch',
    badge: '💥 PRICE ERROR',
    status: 'Approved',
    priority: 'Critical',
    code: 'LOOT90',
    link: 'https://amazon.in/dp/B0CH9871',
    originalPrice: '₹14,990',
    price: '₹1,499',
    discountLabel: '90% OFF',
    discountValue: 90,
    effectivePrice: '₹1,299',
    cashback: '+ ₹100 Wouchify Cash',
    stockClaimedPercent: 94,
    quantityAlert: 'Hurry! Only 3 units left at this price',
    proofNote: 'Verified seller pricing error. Orders dispatching from Cloudtail warehouse.',
    trickSteps: '1. Click "Grab Loot" to go to Amazon product page.\n2. Apply the ₹500 instant coupon checkbox.\n3. Enter promo code LOOT90 on the payment checkout page.\n4. Pay via UPI for extra ₹200 instant bank discount.',
    terms: 'Price may revert back to MRP any minute. Cash on delivery or instant card pay supported.',
    asinOrSku: 'B0CH9871XY',
    deliveryInfo: 'Prime 1-Day Free Delivery',
    rating: '4.6 ★ (28k)',
    postedAt: 'Today, 11:15 AM',
    expiresAt: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[0]?.image || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[0]?.image || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    clicks: 4890
  },
  {
    id: 'loot-102',
    title: 'boAt Airdopes 141 ANC with 42H Playtime & Low Latency',
    store: 'Flipkart',
    brand: 'boAt',
    category: 'Electronics',
    lootType: 'flash',
    badge: '⚡ FLASH DROP',
    status: 'Approved',
    priority: 'High',
    code: 'AIR50',
    link: 'https://flipkart.com/boat-airdopes',
    originalPrice: '₹4,490',
    price: '₹499',
    discountLabel: '89% OFF',
    discountValue: 89,
    effectivePrice: '₹449',
    cashback: '+ 5% Wouchify Cashback',
    stockClaimedPercent: 88,
    quantityAlert: 'Limited flash window (88% claimed)',
    proofNote: 'Flipkart Super Flash Sale drop valid for top 500 buyers.',
    trickSteps: '1. Add product to cart immediately.\n2. Use SuperCoins on Flipkart checkout to deduct ₹50.\n3. Make payment via UPI or RuPay Card.',
    terms: 'Maximum 1 unit per customer account.',
    asinOrSku: 'FSNAIR141B',
    deliveryInfo: 'Free Flipkart Assured Delivery',
    rating: '4.3 ★ (45k)',
    postedAt: 'Today, 10:45 AM',
    expiresAt: new Date(Date.now() + 3600000 * 5).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[1]?.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[1]?.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    clicks: 3410
  },
  {
    id: 'loot-103',
    title: 'Portronics 65W Fast USB-C Braided Cable (2 Metres)',
    store: 'Amazon',
    brand: 'Portronics',
    category: 'Electronics',
    lootType: 'under99',
    badge: '🏷️ UNDER ₹99 LOOT',
    status: 'Approved',
    priority: 'High',
    code: '',
    link: 'https://amazon.in/dp/B0PORT01',
    originalPrice: '₹899',
    price: '₹79',
    discountLabel: '91% OFF',
    discountValue: 91,
    effectivePrice: '₹79',
    cashback: '+ ₹10 Wallet Cash',
    stockClaimedPercent: 78,
    quantityAlert: 'Selling fast! Stock limited',
    proofNote: 'Lightning Under ₹99 store price drop.',
    trickSteps: '1. Direct price drop active on Amazon.\n2. Click Grab Loot and proceed directly to buy now.\n3. Free delivery for Prime members.',
    terms: 'Valid until stock runs out.',
    asinOrSku: 'B0PORT0165W',
    deliveryInfo: 'Prime Free Delivery',
    rating: '4.2 ★ (8.2k)',
    postedAt: 'Today, 09:20 AM',
    expiresAt: new Date(Date.now() + 3600000 * 18).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[2]?.image || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[2]?.image || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop'],
    telegramAlert: false,
    pushNotification: true,
    isFeatured: false,
    isVerified: true,
    clicks: 2150
  },
  {
    id: 'loot-104',
    title: 'Puma Men Running Sports Shoes - Ultra Breathable Mesh',
    store: 'Myntra',
    brand: 'Puma',
    category: 'Footwear',
    lootType: 'steal',
    badge: '🔥 83% OFF STEAL',
    status: 'Approved',
    priority: 'Normal',
    code: 'PUMA80',
    link: 'https://myntra.com/puma-shoes',
    originalPrice: '₹4,999',
    price: '₹849',
    discountLabel: '83% OFF',
    discountValue: 83,
    effectivePrice: '₹799',
    cashback: '+ 8% Wouchify Cashback',
    stockClaimedPercent: 65,
    quantityAlert: 'Sizes 7, 8, 9 & 10 in stock',
    proofNote: 'Myntra End of Reason Steal Deal.',
    trickSteps: '1. Select shoe size on Myntra.\n2. Enter coupon code PUMA80 at checkout.\n3. Pay with any UPI app for extra 5% instant discount.',
    terms: '14-Day Free Returns supported.',
    asinOrSku: 'MYNPUMA892',
    deliveryInfo: 'Free Delivery on Myntra',
    rating: '4.4 ★ (18.6k)',
    postedAt: 'Yesterday, 06:40 PM',
    expiresAt: new Date(Date.now() + 3600000 * 48).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[3]?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[3]?.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: false,
    isFeatured: false,
    isVerified: true,
    clicks: 1980
  },
  {
    id: 'loot-105',
    title: 'The Man Company Charcoal Grooming Kit (5-Piece Gift Set)',
    store: 'Flipkart',
    brand: 'The Man Company',
    category: 'Beauty',
    lootType: 'under199',
    badge: '🏷️ UNDER ₹199',
    status: 'Approved',
    priority: 'Normal',
    code: 'GROOM100',
    link: 'https://flipkart.com/the-man-company',
    originalPrice: '₹1,899',
    price: '₹189',
    discountLabel: '90% OFF',
    discountValue: 90,
    effectivePrice: '₹189',
    cashback: '+ ₹25 Cashback',
    stockClaimedPercent: 91,
    quantityAlert: 'Lightning Deal (91% Claimed)',
    proofNote: 'Flash kit sale verified on Flipkart seller portal.',
    trickSteps: '1. Add 1 set to cart.\n2. Coupon GROOM100 auto-applies.\n3. Complete payment before flash sale expires.',
    terms: 'Valid on single box per customer.',
    asinOrSku: 'FSNTMC9018',
    deliveryInfo: 'Free Delivery above ₹149',
    rating: '4.5 ★ (9.1k)',
    postedAt: 'Yesterday, 02:15 PM',
    expiresAt: new Date(Date.now() + 3600000 * 12).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[4]?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[4]?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop'],
    telegramAlert: false,
    pushNotification: false,
    isFeatured: false,
    isVerified: true,
    clicks: 1420
  },
  {
    id: 'loot-106',
    title: 'Free Sample Coffee Tasting Box (3 Exotic Flavours 150g)',
    store: 'Tata CLiQ',
    brand: 'Tata Coffee',
    category: 'Grocery',
    lootType: 'freebie',
    badge: '🎁 100% FREEBIE',
    status: 'Pending Approval',
    priority: 'High',
    code: 'SAMPLEFREE',
    link: 'https://tatacliq.com/free-sample',
    originalPrice: '₹450',
    price: '₹0',
    discountLabel: '100% FREE',
    discountValue: 100,
    effectivePrice: '₹0 (Pay ₹49 Shipping)',
    cashback: '₹49 Wouchify Cash Refund',
    stockClaimedPercent: 96,
    quantityAlert: 'Almost sold out! 96% claimed',
    proofNote: 'Official trial sample program by Tata Consumer Products.',
    trickSteps: '1. Register new email on trial landing page.\n2. Apply code SAMPLEFREE.\n3. Pay ₹49 nominal shipping which is refunded as Wouchify wallet cash.',
    terms: '1 box per household delivery address.',
    asinOrSku: 'TATASAMP01',
    deliveryInfo: 'Delivered in 3-5 Business Days',
    rating: '4.7 ★ (12k)',
    postedAt: 'Today, 08:30 AM',
    expiresAt: new Date(Date.now() + 3600000 * 3).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[5]?.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
    images: [DEAL_PRODUCT_PRESETS[5]?.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    clicks: 5210
  }
]

export const ExecutiveLootDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<LootDeal[]>(initialLootDeals)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedDealIds, setSelectedDealIds] = useState<string[]>([])
  
  // Modals & Previews
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<LootDeal | null>(null)
  const [previewDeal, setPreviewDeal] = useState<LootDeal | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedLootType, setSelectedLootType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortOption, setSortOption] = useState<string>('recent')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Form State
  const emptyLootDeal: LootDeal = {
    id: '',
    title: '',
    store: 'Amazon',
    brand: '',
    category: 'Electronics',
    lootType: 'glitch',
    badge: '💥 PRICE ERROR',
    status: 'Approved',
    priority: 'Critical',
    code: '',
    link: '',
    originalPrice: '',
    price: '',
    discountLabel: '90% OFF',
    discountValue: 90,
    effectivePrice: '',
    cashback: '+ ₹50 Wouchify Cash',
    stockClaimedPercent: 85,
    quantityAlert: 'Hurry! Only 5 units left',
    proofNote: 'Price drop verified on official store app.',
    trickSteps: '1. Click "Grab Loot" to open partner store.\n2. Apply any visible instant coupons on page.\n3. Pay with UPI/Net Banking for maximum instant price drop.',
    terms: 'Price may revert anytime. Fast checkout recommended.',
    asinOrSku: '',
    deliveryInfo: 'Free Fast Delivery',
    rating: '4.5 ★ (10k)',
    postedAt: `Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
    expiresAt: new Date(Date.now() + 3600000 * 3).toISOString().slice(0, 16),
    image: DEAL_PRODUCT_PRESETS[0]?.image || '',
    images: [DEAL_PRODUCT_PRESETS[0]?.image || ''],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    clicks: 0
  }
  const [form, setForm] = useState<LootDeal>(emptyLootDeal)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPI Metrics Calculation
  const kpiStats = useMemo(() => {
    const total = deals.length
    const active = deals.filter(d => d.status === 'Approved').length
    const glitches = deals.filter(d => d.lootType === 'glitch').length
    const under199 = deals.filter(d => d.lootType === 'under99' || d.lootType === 'under199').length
    const expired = deals.filter(d => d.status === 'Expired').length
    const totalClicks = deals.reduce((acc, d) => acc + (d.clicks || 0), 0)
    return { total, active, glitches, under199, expired, totalClicks }
  }, [deals])

  // Filtered & Sorted Deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = deal.title.toLowerCase().includes(q)
        const matchStore = deal.store.toLowerCase().includes(q)
        const matchBrand = (deal.brand || '').toLowerCase().includes(q)
        const matchCat = deal.category.toLowerCase().includes(q)
        const matchCode = (deal.code || '').toLowerCase().includes(q)
        const matchSku = (deal.asinOrSku || '').toLowerCase().includes(q)
        if (!matchTitle && !matchStore && !matchBrand && !matchCat && !matchCode && !matchSku) return false
      }

      // Store
      if (selectedStore !== 'all' && deal.store.toLowerCase() !== selectedStore.toLowerCase()) {
        return false
      }

      // Category
      if (selectedCategory !== 'all' && deal.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // Loot Type
      if (selectedLootType !== 'all' && deal.lootType !== selectedLootType) {
        return false
      }

      // Status
      if (selectedStatus !== 'all' && deal.status !== selectedStatus) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortOption === 'expiry-soon') {
        const timeA = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity
        const timeB = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity
        return timeA - timeB
      }
      if (sortOption === 'discount-high') {
        return (b.discountValue || 0) - (a.discountValue || 0)
      }
      if (sortOption === 'claimed-high') {
        return (b.stockClaimedPercent || 0) - (a.stockClaimedPercent || 0)
      }
      if (sortOption === 'price-low') {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
        return pA - pB
      }
      if (sortOption === 'clicks-high') {
        return (b.clicks || 0) - (a.clicks || 0)
      }
      if (sortOption === 'store-az') {
        return a.store.localeCompare(b.store)
      }
      // default: recent (descending id / newest)
      return b.id.localeCompare(a.id)
    })
  }, [deals, searchTerm, selectedStore, selectedCategory, selectedLootType, selectedStatus, sortOption])

  // Pagination slicing
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredDeals.slice(start, start + itemsPerPage)
  }, [filteredDeals, currentPage, itemsPerPage])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm.trim()) count++
    if (selectedStore !== 'all') count++
    if (selectedCategory !== 'all') count++
    if (selectedLootType !== 'all') count++
    if (selectedStatus !== 'all') count++
    if (sortOption !== 'recent') count++
    return count
  }, [searchTerm, selectedStore, selectedCategory, selectedLootType, selectedStatus, sortOption])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedStore('all')
    setSelectedCategory('all')
    setSelectedLootType('all')
    setSelectedStatus('all')
    setSortOption('recent')
    setCurrentPage(1)
    showToast('Reset all filters')
  }

  // Quick Expiry Preset Handler
  const handleSetExpiryPreset = (hoursToAdd: number | null) => {
    if (hoursToAdd === null) {
      setForm(prev => ({ ...prev, expiresAt: '' }))
      return
    }
    const targetDate = new Date(Date.now() + hoursToAdd * 3600000)
    const localIso = new Date(targetDate.getTime() - targetDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    setForm(prev => ({ ...prev, expiresAt: localIso }))
  }

  // Deal Form Actions
  const handleAddDeal = () => {
    setEditingDeal(null)
    setForm(emptyLootDeal)
    setIsModalOpen(true)
  }

  const handleEditDeal = (deal: LootDeal) => {
    setEditingDeal(deal)
    setForm({
      ...deal,
      image: deal.image || deal.images[0] || '',
      images: deal.images?.length ? deal.images : [deal.image || '']
    })
    setIsModalOpen(true)
  }

  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this loot deal?')) {
      setDeals(deals.filter(d => d.id !== id))
      setSelectedDealIds(selectedDealIds.filter(selId => selId !== id))
      showToast('Loot deal removed')
    }
  }

  const handleToggleStatus = (id: string) => {
    setDeals(deals.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'Approved' ? 'Draft' : 'Approved'
        showToast(`Status changed to ${nextStatus}`)
        return { ...d, status: nextStatus }
      }
      return d
    }))
  }

  // Bulk Actions
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedDeals.map(d => d.id)
    const allSelected = pageIds.every(id => selectedDealIds.includes(id))
    if (allSelected) {
      setSelectedDealIds(selectedDealIds.filter(id => !pageIds.includes(id)))
    } else {
      setSelectedDealIds(Array.from(new Set([...selectedDealIds, ...pageIds])))
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
    showToast(`Approved ${selectedDealIds.length} loot deals`)
    setSelectedDealIds([])
  }

  const handleBulkDraft = () => {
    setDeals(deals.map(d => selectedDealIds.includes(d.id) ? { ...d, status: 'Draft' } : d))
    showToast(`Moved ${selectedDealIds.length} deals to Draft`)
    setSelectedDealIds([])
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedDealIds.length} selected loot deals permanently?`)) {
      setDeals(deals.filter(d => !selectedDealIds.includes(d.id)))
      showToast(`Deleted ${selectedDealIds.length} loot deals`)
      setSelectedDealIds([])
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Brand', 'Store', 'Category', 'LootType', 'Price', 'OriginalMRP', 'Discount', 'ClaimedPercent', 'PostedAt', 'ExpiresAt', 'Status', 'Clicks']
    const rows = filteredDeals.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.brand || ''}"`,
      d.store,
      d.category,
      d.lootType,
      d.price,
      d.originalPrice,
      d.discountLabel,
      `${d.stockClaimedPercent}%`,
      `"${d.postedAt}"`,
      d.expiresAt,
      d.status,
      d.clicks
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_loot_deals_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported loot deals to CSV')
  }

  // Price calculations
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

  const handleSave = (statusToSet: 'Draft' | 'Pending Approval' | 'Approved') => {
    if (!form.title.trim()) {
      alert('Please enter a Loot Deal Title')
      return
    }
    if (!form.price.trim()) {
      alert('Please enter an Offer Price')
      return
    }

    const finalImage = form.image || form.images[0] || (DEAL_PRODUCT_PRESETS[0]?.image || '')
    const dealToSave: LootDeal = {
      ...form,
      id: editingDeal ? editingDeal.id : `loot-${Date.now()}`,
      status: statusToSet,
      image: finalImage,
      images: [finalImage]
    }

    if (editingDeal) {
      setDeals(deals.map(d => d.id === editingDeal.id ? dealToSave : d))
      showToast('Loot deal updated successfully')
    } else {
      setDeals([dealToSave, ...deals])
      showToast('New loot deal created successfully')
    }
    setIsModalOpen(false)
  }

  const storeOptions = FAVOURITE_STORES.map(s => s.name)
  const categoryOptions = CATEGORIES_DATA.map(c => c.name)

  return (
    <ExecutiveLayout activeMenu="loot-deals">
      <div className="executive-crud-page">
        
        {/* Page Top Header */}
        <div className="crud-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="modal-badge" style={{ background: '#fef2f2', color: 'var(--color-red, #E31E25)' }}>
                <Flame size={12} /> Live Loot Radar
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• Instant price drop & glitch monitoring active</span>
            </div>
            <h2 className="crud-title">Loot Deals Management Console</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b' }}>
              Publish, verify, broadcast, and manage flash drops, price errors, and budget steals across Wouchify.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-cancel" 
              onClick={handleExportCSV}
              title="Export loot deals to CSV"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Export CSV
            </button>
            <button className="crud-add-btn" onClick={handleAddDeal}>
              <Plus size={18} /> Add New Loot Deal
            </button>
          </div>
        </div>

        {/* KPI Ribbon */}
        <div className="deals-kpi-ribbon">
          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Total Loots</span>
              <span className="deals-kpi-val">{kpiStats.total}</span>
            </div>
            <div className="deals-kpi-icon blue">
              <Layers size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Active / Live</span>
              <span className="deals-kpi-val" style={{ color: '#10b981' }}>{kpiStats.active}</span>
            </div>
            <div className="deals-kpi-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Price Glitches</span>
              <span className="deals-kpi-val" style={{ color: '#db2777' }}>{kpiStats.glitches}</span>
            </div>
            <div className="deals-kpi-icon red">
              <Flame size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Under ₹199 Steals</span>
              <span className="deals-kpi-val" style={{ color: '#047857' }}>{kpiStats.under199}</span>
            </div>
            <div className="deals-kpi-icon orange">
              <TrendingDown size={20} />
            </div>
          </div>

          <div className="deals-kpi-card">
            <div className="deals-kpi-info">
              <span className="deals-kpi-label">Total Clicks</span>
              <span className="deals-kpi-val">{kpiStats.totalClicks.toLocaleString()}</span>
            </div>
            <div className="deals-kpi-icon red">
              <Eye size={20} />
            </div>
          </div>
        </div>

        {/* Advanced Filter Toolbar */}
        <div className="advanced-filter-panel">
          {/* Top Row */}
          <div className="filter-row-top">
            <div className="crud-search" style={{ maxWidth: '420px', flex: 1 }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search loot by title, brand, store, coupon, SKU..." 
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
                    padding: '0 12px'
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
                  <option value="recent">Posted: Newest First</option>
                  <option value="expiry-soon">Expiring Soonest (Urgent Drops)</option>
                  <option value="discount-high">Highest Discount % (90%+)</option>
                  <option value="claimed-high">Most Claimed Stock %</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="clicks-high">Most Engaged Clicks</option>
                  <option value="store-az">Store Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
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

          {/* Bottom Row */}
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

              {/* Loot Type */}
              <select 
                className="filter-select-input"
                value={selectedLootType}
                onChange={(e) => { setSelectedLootType(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Loot Types</option>
                <option value="glitch">💥 Price Glitch / Error</option>
                <option value="flash">⚡ Flash Loot Drop</option>
                <option value="steal">🔥 80%+ Steal Deal</option>
                <option value="under99">🏷️ Under ₹99 Store</option>
                <option value="under199">🏷️ Under ₹199 Store</option>
                <option value="freebie">🎁 100% Freebie / Cashback</option>
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
                <option value="Expired">Expired / Ended</option>
              </select>
            </div>

            <span className="filter-results-badge">
              {filteredDeals.length} {filteredDeals.length === 1 ? 'loot' : 'loots'} shown
            </span>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedDealIds.length > 0 && (
          <div className="bulk-action-bar">
            <div className="bulk-action-info">
              <span>{selectedDealIds.length} loot deals selected</span>
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
                    <th>Loot Title & Tag</th>
                    <th>Store</th>
                    <th>Pricing & Discount</th>
                    <th>Claimed Progress</th>
                    <th>Posted Date</th>
                    <th>Expiry Date</th>
                    <th>Channels</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeals.map((deal) => {
                    const isSelected = selectedDealIds.includes(deal.id)
                    const countdown = getExpiryCountdown(deal.expiresAt)
                    const isUrgentClaim = deal.stockClaimedPercent >= 85
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
                            src={deal.image || deal.images[0] || 'https://via.placeholder.com/50'} 
                            alt={deal.title} 
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/48?text=Loot' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span className={`loot-type-badge ${deal.lootType}`}>
                              {deal.badge || deal.lootType.toUpperCase()}
                            </span>
                            {deal.isVerified && (
                              <span className="verified-badge" title="Verified Loot">✓ Verified</span>
                            )}
                          </div>
                          <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {deal.title}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            {deal.brand && <strong style={{ color: 'var(--color-red, #E31E25)' }}>{deal.brand}</strong>}
                            <span>• {deal.category}</span>
                            {deal.code && (
                              <span style={{ fontFamily: 'monospace', background: '#fef2f2', padding: '1px 5px', borderRadius: '3px', color: 'var(--color-red, #E31E25)', fontWeight: 700 }}>
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
                              onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/60x20?text=' + deal.store }}
                            />
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span className="deal-table-price">{formatPriceWithRupee(deal.price)}</span>
                            {deal.originalPrice && (
                              <span className="deal-table-mrp">{formatPriceWithRupee(deal.originalPrice)}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span className="discount-pill" style={{ background: '#fef2f2', color: 'var(--color-red, #E31E25)' }}>
                              {deal.discountLabel}
                            </span>
                            {deal.effectivePrice && (
                              <span className="effective-price-chip" title="Price after coin/card offer">
                                Eff: {formatPriceWithRupee(deal.effectivePrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="loot-claimed-meter">
                            <div className="loot-claimed-header">
                              <span style={{ color: isUrgentClaim ? '#dc2626' : '#334155' }}>
                                {isUrgentClaim ? '🔥 ' : '⚡ '}
                                {deal.stockClaimedPercent}% Claimed
                              </span>
                            </div>
                            <div className="loot-claimed-bar">
                              <div 
                                className={`loot-claimed-fill ${deal.stockClaimedPercent >= 85 ? 'high' : deal.stockClaimedPercent >= 50 ? 'med' : 'low'}`} 
                                style={{ width: `${Math.min(deal.stockClaimedPercent, 100)}%` }} 
                              />
                            </div>
                            {deal.quantityAlert && (
                              <span style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 600 }}>
                                {deal.quantityAlert}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                            <Clock size={13} className="posted-clock-icon" />
                            <span className="posted-date-text">
                              {deal.postedAt || 'Today, 10:30 AM'}
                            </span>
                          </div>
                        </td>
                        <td>
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
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {deal.telegramAlert && (
                              <span className="broadcast-pill telegram" title="Broadcasted to Telegram Loot Channel">
                                <SendHorizontal size={11} /> Telegram
                              </span>
                            )}
                            {deal.pushNotification && (
                              <span className="broadcast-pill push" title="Sent as high-priority app push">
                                <Bell size={11} /> App Push
                              </span>
                            )}
                            {!deal.telegramAlert && !deal.pushNotification && (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Standard Web</span>
                            )}
                          </div>
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
                              title="Preview Customer Loot Page"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="action-btn edit" 
                              onClick={() => handleEditDeal(deal)} 
                              title="Edit Loot Deal"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDeleteDeal(deal.id)} 
                              title="Delete Loot Deal"
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
                        No loot deals found matching your selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-wrap">
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing <strong>{filteredDeals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredDeals.length)}</strong> of <strong>{filteredDeals.length}</strong> loot deals
              </div>

              <div className="pagination-controls">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', padding: '0 8px' }}>
                  Page {currentPage} of {totalPages}
                </span>

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
                const countdown = getExpiryCountdown(deal.expiresAt)
                return (
                  <div key={deal.id} className="deal-card-manage" style={{ borderColor: isSelected ? 'var(--color-red, #E31E25)' : undefined }}>
                    <input 
                      type="checkbox" 
                      className="deal-card-checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectDeal(deal.id)}
                    />

                    <div className="deal-card-manage-thumb">
                      <img 
                        src={deal.image || deal.images[0] || 'https://via.placeholder.com/280x160'} 
                        alt={deal.title} 
                        onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/280x160?text=Loot' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 4, display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span className={`loot-type-badge ${deal.lootType}`}>
                          {deal.badge || deal.lootType.toUpperCase()}
                        </span>
                      </div>
                    </div>

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
                          <span className={`status-badge ${deal.status === 'Approved' ? 'active' : deal.status === 'Pending Approval' ? 'pending' : 'draft'}`}>
                            {deal.status}
                          </span>
                        </button>
                      </div>

                      {deal.brand && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-red, #E31E25)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '6px' }}>
                          {deal.brand}
                        </span>
                      )}

                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '2px 0 0', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, lineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {deal.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-red, #E31E25)' }}>{formatPriceWithRupee(deal.price)}</span>
                        {deal.originalPrice && (
                          <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPriceWithRupee(deal.originalPrice)}</span>
                        )}
                        <span style={{ marginLeft: 'auto', color: 'var(--color-red, #E31E25)', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.78rem' }}>
                          {deal.discountLabel}
                        </span>
                      </div>

                      {/* Claimed progress */}
                      <div className="loot-claimed-meter" style={{ marginTop: '8px' }}>
                        <div className="loot-claimed-header">
                          <span style={{ fontSize: '0.72rem', color: '#475569' }}>🔥 {deal.stockClaimedPercent}% Claimed</span>
                          {deal.quantityAlert && <span style={{ fontSize: '0.68rem', color: '#dc2626' }}>{deal.quantityAlert}</span>}
                        </div>
                        <div className="loot-claimed-bar">
                          <div 
                            className={`loot-claimed-fill ${deal.stockClaimedPercent >= 85 ? 'high' : deal.stockClaimedPercent >= 50 ? 'med' : 'low'}`} 
                            style={{ width: `${Math.min(deal.stockClaimedPercent, 100)}%` }} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#64748b', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} className="posted-clock-icon" />
                          <span>{deal.postedAt}</span>
                        </div>
                        <span className={`expiry-pill ${countdown.status}`} title={`Expires: ${formatExpiryDate(deal.expiresAt)}`}>
                          {countdown.status === 'expired' && '⛔ '}
                          {countdown.status === 'urgent' && '🔥 '}
                          {countdown.status === 'warning' && '⏳ '}
                          {countdown.status === 'normal' && '📅 '}
                          {countdown.text}
                        </span>
                      </div>
                    </div>

                    <div className="deal-card-manage-actions">
                      <button className="action-btn view" onClick={() => setPreviewDeal(deal)} title="Preview Deal">
                        <Eye size={16} />
                      </button>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn edit" onClick={() => handleEditDeal(deal)} title="Edit Deal">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteDeal(deal.id)} title="Delete Deal">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pagination-wrap" style={{ borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing <strong>{filteredDeals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredDeals.length)}</strong> of <strong>{filteredDeals.length}</strong> loot deals
              </div>
              <div className="pagination-controls">
                <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 1: ADD / EDIT LOOT DEAL ── */}
        {isModalOpen && (
          <div className="crud-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="crud-modal" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#fef2f2', color: 'var(--color-red, #E31E25)' }}>
                    <Flame size={12} /> {editingDeal ? 'Modify Loot Deal' : 'Publish New Loot Deal'}
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>
                    {editingDeal ? `Edit: ${editingDeal.title}` : 'Create High-Velocity Loot Deal'}
                  </h3>
                </div>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                
                {/* Section 1: Core Loot Details & Identity */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon" style={{ background: '#fee2e2', color: 'var(--color-red, #E31E25)' }}><Flame size={16} /></div>
                    <h4 className="form-section-title">Loot Deal Identity & Store</h4>
                    <span className="form-section-desc">Headline, store & classification</span>
                  </div>

                  <div className="form-group">
                    <label>Loot Deal Headline / Title <span className="required-star">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. 92% OFF: Philips Wireless Bluetooth Speaker at ₹199 only" 
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                    <span className="field-hint">High-converting catchy title emphasizing massive discount</span>
                  </div>

                  <div className="form-row-3" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Store Partner <span className="required-star">*</span></label>
                      <select 
                        value={form.store}
                        onChange={(e) => setForm({ ...form, store: e.target.value })}
                      >
                        {storeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Product Brand</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Philips, boAt, Apple" 
                        value={form.brand || ''}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row-3" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Loot Classification <span className="required-star">*</span></label>
                      <select 
                        value={form.lootType}
                        onChange={(e) => {
                          const val = e.target.value as LootDeal['lootType']
                          let defaultBadge = '💥 PRICE ERROR'
                          if (val === 'flash') defaultBadge = '⚡ FLASH DROP'
                          if (val === 'steal') defaultBadge = '🔥 80%+ STEAL'
                          if (val === 'under99') defaultBadge = '🏷️ UNDER ₹99 LOOT'
                          if (val === 'under199') defaultBadge = '🏷️ UNDER ₹199 LOOT'
                          if (val === 'freebie') defaultBadge = '🎁 100% FREEBIE'
                          setForm({ ...form, lootType: val, badge: defaultBadge })
                        }}
                      >
                        <option value="glitch">💥 Price Glitch / Error</option>
                        <option value="flash">⚡ Flash Loot Drop</option>
                        <option value="steal">🔥 80%+ Steal Deal</option>
                        <option value="under99">🏷️ Under ₹99 Store</option>
                        <option value="under199">🏷️ Under ₹199 Store</option>
                        <option value="freebie">🎁 100% Freebie / Cashback</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Storefront Badge Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 💥 PRICE ERROR, ⚡ FLASH DROP" 
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>ASIN / SKU / FSN</label>
                      <input 
                        type="text" 
                        placeholder="e.g. B0CH9871XY" 
                        value={form.asinOrSku || ''}
                        onChange={(e) => setForm({ ...form, asinOrSku: e.target.value.toUpperCase() })}
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label>Destination Affiliate URL <span className="required-star">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://amazon.in/dp/... or https://flipkart.com/..." 
                      value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      required
                    />
                    <span className="field-hint">Users will be redirected directly to this 1-click cart/product page</span>
                  </div>
                </div>

                {/* Section 2: Pricing, Loot Math & Financials */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><Zap size={16} /></div>
                    <h4 className="form-section-title">Pricing, Loot Math & Financials</h4>
                    <span className="form-section-desc">Discount calculations & wallet rewards</span>
                  </div>

                  <div className="form-row-3">
                    <div className="form-group highlight-input">
                      <label>Loot Selling Price (₹) <span className="required-star">*</span></label>
                      <div className="input-with-symbol">
                        <span className="input-symbol">₹</span>
                        <input 
                          type="text" 
                          placeholder="199" 
                          value={form.price.replace('₹', '')}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          required
                        />
                      </div>
                      <span className="field-hint">Lowest drop price</span>
                    </div>

                    <div className="form-group">
                      <label>Original MRP (₹) <span className="required-star">*</span></label>
                      <div className="input-with-symbol">
                        <span className="input-symbol">₹</span>
                        <input 
                          type="text" 
                          placeholder="2,499" 
                          value={form.originalPrice.replace('₹', '')}
                          onChange={(e) => handleMrpChange(e.target.value)}
                        />
                      </div>
                      <span className="field-hint">Regular retail MRP</span>
                    </div>

                    <div className="form-group">
                      <label>Discount Badge</label>
                      <input 
                        type="text" 
                        placeholder="92% OFF" 
                        value={form.discountLabel}
                        onChange={(e) => setForm({ ...form, discountLabel: e.target.value })}
                      />
                      <span className="field-hint">Auto-calculated or custom</span>
                    </div>
                  </div>

                  <div className="form-row-3" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Effective Price after Coins/Cashback</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹149 (with SuperCoins)" 
                        value={form.effectivePrice || ''}
                        onChange={(e) => setForm({ ...form, effectivePrice: e.target.value.startsWith('₹') ? e.target.value : `₹${e.target.value}` })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Coupon Code (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. LOOT90" 
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Extra Wouchify Cashback / Rewards</label>
                      <input 
                        type="text" 
                        placeholder="e.g. + ₹50 Instant Cash" 
                        value={form.cashback || ''}
                        onChange={(e) => setForm({ ...form, cashback: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Stock Claimed, Urgency & Expiry */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><Clock size={16} /></div>
                    <h4 className="form-section-title">Stock Claimed, Urgency & Expiry</h4>
                    <span className="form-section-desc">Countdown timers & claimed meter controls</span>
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Stock Claimed % (0 - 100)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={form.stockClaimedPercent}
                        onChange={(e) => setForm({ ...form, stockClaimedPercent: Number(e.target.value) || 50 })}
                      />
                      <span className="field-hint">Renders visual urgency progress bar</span>
                    </div>

                    <div className="form-group">
                      <label>Quantity Alert Badge</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hurry! Only 4 units left" 
                        value={form.quantityAlert || ''}
                        onChange={(e) => setForm({ ...form, quantityAlert: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Loot Priority Level</label>
                      <select 
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value as LootDeal['priority'] })}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Critical">🔥 Critical (Top Banner)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Deal Posted Date & Time</label>
                      <input 
                        type="text" 
                        value={form.postedAt}
                        onChange={(e) => setForm({ ...form, postedAt: e.target.value })}
                      />
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
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(1)}>+1h (Glitch)</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(3)}>+3h</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(6)}>+6h</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(12)}>+12h</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(24)}>+24h</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(72)}>+3 Days</button>
                        <button type="button" className="quick-preset-btn" onClick={() => handleSetExpiryPreset(null)} style={{ color: '#ef4444' }}>Clear</button>
                      </div>
                      <span className="field-hint">Offer end schedule for countdown timers</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: "Trick to Grab" (Instructions & Terms) */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><FileText size={16} /></div>
                    <h4 className="form-section-title">"Trick to Grab" & Steps</h4>
                    <span className="form-section-desc">Instructions for price glitch or coupon tricks</span>
                  </div>

                  <div className="form-group">
                    <label>Step-by-Step Trick Instructions</label>
                    <textarea 
                      rows={3}
                      placeholder={`1. Click "Grab Loot" to open partner store.\n2. Apply coupon LOOT90 at payment page.\n3. Pay via UPI for instant extra discount.`}
                      value={form.trickSteps || ''}
                      onChange={(e) => setForm({ ...form, trickSteps: e.target.value })}
                    />
                    <span className="field-hint">Displayed as clear step-by-step numbered cards on the buyer deal page</span>
                  </div>

                  <div className="form-row-2" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Price Proof Note / Verification</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Price drop verified on official store app" 
                        value={form.proofNote || ''}
                        onChange={(e) => setForm({ ...form, proofNote: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Disclaimer & Terms</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Price may revert anytime. Fast checkout recommended." 
                        value={form.terms || ''}
                        onChange={(e) => setForm({ ...form, terms: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Broadcast & Channel Controls */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><SendHorizontal size={16} /></div>
                    <h4 className="form-section-title">Broadcast & Notification Controls</h4>
                    <span className="form-section-desc">Multi-channel instant blast</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.telegramAlert} 
                        onChange={(e) => setForm({ ...form, telegramAlert: e.target.checked })} 
                      />
                      <div>
                        <div>✈️ Broadcast to Telegram Loot Channel</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>Instantly alerts 50,000+ subscribers</div>
                      </div>
                    </label>

                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.pushNotification} 
                        onChange={(e) => setForm({ ...form, pushNotification: e.target.checked })} 
                      />
                      <div>
                        <div>🔔 Send Mobile App Push Alert</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>High-priority drop ping to mobile app users</div>
                      </div>
                    </label>

                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.isFeatured} 
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} 
                      />
                      <div>
                        <div>🌟 Feature in Top Flash Loot Banner</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>Pinned to top storefront carousel</div>
                      </div>
                    </label>

                    <label className="feature-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={form.isVerified} 
                        onChange={(e) => setForm({ ...form, isVerified: e.target.checked })} 
                      />
                      <div>
                        <div>✓ Verified Loot Seal (Blue Tick)</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>Shows verified authentic badge</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 6: Media & Live Card Preview */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-icon"><ImageIcon size={16} /></div>
                    <h4 className="form-section-title">Product Image</h4>
                    <span className="form-section-desc">Image URL & quick presets</span>
                  </div>

                  <ImageUploadField
                    label="Main Product Image"
                    placeholder="Paste URL or upload from device…"
                    value={form.image}
                    onChange={(val) => handleImageUrlChange(val)}
                  />

                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Quick Sample Presets:</span>
                    <div className="image-preset-list">
                      {DEAL_PRODUCT_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          className={`image-preset-chip ${form.image === preset.image ? 'active' : ''}`}
                          onClick={() => handleImageUrlChange(preset.image)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview Strip */}
                <div className="form-section" style={{ background: '#f8fafc' }}>
                  <div className="deal-live-preview-box">
                    <span className="preview-header-text">Live Storefront Card Preview</span>
                    <div className="preview-deal-card">
                      <div className="preview-deal-image-wrap">
                        <img 
                          src={form.image || 'https://via.placeholder.com/320x150?text=Loot+Image'} 
                          alt="Live Preview" 
                          onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/320x150?text=Image+Preview' }}
                        />
                      </div>
                      <div className="preview-deal-body">
                        <div className="preview-store-strip">
                          <div className="preview-store-name" title={form.store}>
                            <img src={getStoreLogo(form.store)} alt={form.store} style={{ height: '18px', maxWidth: '65px', objectFit: 'contain' }} />
                          </div>
                          <span className={`loot-type-badge ${form.lootType}`}>
                            {form.badge || '💥 PRICE ERROR'}
                          </span>
                        </div>

                        {form.brand && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-red, #E31E25)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                            {form.brand}
                          </div>
                        )}

                        <h5 className="preview-deal-title" style={{ margin: '2px 0 6px' }}>{form.title || 'Loot Title Will Appear Here'}</h5>
                        
                        <div className="preview-price-strip">
                          <span className="preview-offer-price" style={{ color: 'var(--color-red, #E31E25)' }}>{form.price || '₹0'}</span>
                          {form.originalPrice && <span className="preview-mrp-price">{form.originalPrice}</span>}
                          {form.discountLabel && <span className="preview-discount-badge" style={{ background: '#fef2f2', color: 'var(--color-red, #E31E25)' }}>{form.discountLabel}</span>}
                        </div>

                        {/* Claimed progress preview */}
                        <div className="loot-claimed-meter" style={{ margin: '6px 0' }}>
                          <div className="loot-claimed-header">
                            <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>🔥 {form.stockClaimedPercent}% Claimed</span>
                            {form.quantityAlert && <span style={{ fontSize: '0.68rem', color: '#dc2626' }}>{form.quantityAlert}</span>}
                          </div>
                          <div className="loot-claimed-bar">
                            <div className="loot-claimed-fill high" style={{ width: `${form.stockClaimedPercent}%` }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#64748b', margin: '4px 0 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} style={{ color: 'var(--color-red, #E31E25)' }} />
                            <span>{form.postedAt || 'Today'}</span>
                          </div>
                          {form.expiresAt && (
                            <span className={`expiry-pill ${getExpiryCountdown(form.expiresAt).status}`}>
                              ⏳ {getExpiryCountdown(form.expiresAt).text}
                            </span>
                          )}
                        </div>
                        <button type="button" className="preview-cta-btn" style={{ background: 'linear-gradient(135deg, #e31e25 0%, #b91c1c 100%)' }}>GRAB LOOT DEAL</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Status: <strong style={{ color: '#0f172a' }}>{editingDeal ? editingDeal.status : 'New Loot (Draft)'}</strong>
                </div>
                <div className="modal-footer-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn-draft" onClick={() => handleSave('Draft')}>
                    <Save size={16} /> Save as Draft
                  </button>
                  <button type="button" className="btn-save" onClick={() => handleSave('Approved')}>
                    <Send size={16} /> Publish / Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: CUSTOMER LOOT PAGE PREVIEW MODAL ── */}
        {previewDeal && (
          <div className="crud-modal-overlay" onClick={() => setPreviewDeal(null)}>
            <div className="deal-product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="deal-product-top-bar">
                <div className="deal-product-breadcrumb">
                  <span>Home</span>
                  <span>/</span>
                  <span>Loot Deals</span>
                  <span>/</span>
                  <span>{previewDeal.category}</span>
                  <span>/</span>
                  <strong style={{ color: '#0f172a' }}>{previewDeal.brand || previewDeal.store}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                      onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/56x18?text=' + previewDeal.store }}
                    />
                  </div>

                  <span className={`loot-type-badge ${previewDeal.lootType}`}>
                    {previewDeal.badge || '🔥 LOOT DEAL'}
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

              <div className="deal-product-modal-body">
                <div className="deal-product-main-grid">
                  
                  {/* Left Column: Media & Urgency Meter */}
                  <div className="deal-product-media-col">
                    <div className="deal-product-main-img-card">
                      <img 
                        src={previewDeal.image || previewDeal.images[0]} 
                        alt={previewDeal.title} 
                        onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/350x250?text=Loot+Image' }}
                      />
                      {previewDeal.discountLabel && (
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                          <span className="deal-save-badge" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            {previewDeal.discountLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock Urgency Meter */}
                    <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#991b1b', marginBottom: '6px' }}>
                        <span>⚡ {previewDeal.stockClaimedPercent}% Claimed</span>
                        <span style={{ fontSize: '0.74rem', color: '#dc2626' }}>{previewDeal.quantityAlert || 'Hurry! Limited stock'}</span>
                      </div>
                      <div style={{ height: '8px', background: '#fee2e2', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${previewDeal.stockClaimedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #f87171, #dc2626)', borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Proof note if available */}
                    {previewDeal.proofNote && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.76rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🛡️</span>
                        <span>{previewDeal.proofNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Buying Content & Pricing */}
                  <div className="deal-product-info-col">
                    <div className="deal-product-brand-row">
                      {previewDeal.brand && (
                        <span className="deal-brand-tag">{previewDeal.brand}</span>
                      )}
                      {previewDeal.asinOrSku && (
                        <span className="deal-asin-badge">SKU: {previewDeal.asinOrSku}</span>
                      )}
                    </div>

                    <h2 className="deal-product-title-large">{previewDeal.title}</h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="deal-rating-badge">
                        {previewDeal.rating || '4.5 ★ (15,200 reviews)'}
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#db2777', background: '#fdf2f8', padding: '2px 8px', borderRadius: '4px' }}>
                        {previewDeal.badge || '💥 PRICE ERROR'}
                      </span>
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="deal-price-card">
                      <div className="deal-price-numbers">
                        <span className="deal-huge-price" style={{ color: 'var(--color-red, #E31E25)' }}>{previewDeal.price}</span>
                        {previewDeal.originalPrice && (
                          <span className="deal-strikethrough-mrp">M.R.P.: {previewDeal.originalPrice}</span>
                        )}
                        {previewDeal.discountLabel && (
                          <span className="deal-save-badge">{previewDeal.discountLabel}</span>
                        )}
                      </div>

                      {previewDeal.effectivePrice && (
                        <div className="deal-effective-banner">
                          <span>🔥 <strong>Effective Final Price:</strong> {previewDeal.effectivePrice}</span>
                        </div>
                      )}

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
                            Applicable Loot Coupon
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

                    {/* Timing & Expiry Banner */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748b' }}>
                        <Clock size={13} style={{ color: 'var(--color-red, #E31E25)' }} />
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
                      style={{ background: 'linear-gradient(135deg, #e31e25 0%, #b91c1c 100%)' }}
                    >
                      GRAB LOOT ON {previewDeal.store.toUpperCase()} ↗
                    </a>
                  </div>
                </div>

                {/* Trick to grab step-by-step */}
                {previewDeal.trickSteps && (
                  <div className="deal-content-tabs-section" style={{ marginTop: '20px' }}>
                    <div className="deal-section-block">
                      <h4 className="deal-section-block-title" style={{ color: 'var(--color-red, #E31E25)' }}>
                        <Sparkles size={16} /> How to Avail / Grab this Loot Price
                      </h4>
                      <div className="deal-steps-grid">
                        {previewDeal.trickSteps.split('\n').filter(s => s.trim().length > 0).map((step, idx) => (
                          <div key={idx} className="deal-step-card">
                            <span className="deal-step-number">{idx + 1}</span>
                            <span className="deal-step-text">{step.replace(/^[0-9]+[.)]\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {previewDeal.terms && (
                      <div className="deal-section-block" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                        <h4 className="deal-section-block-title" style={{ fontSize: '0.8rem', color: '#991b1b' }}>
                          ⚠️ Loot Disclaimer & Important Notice
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.45 }}>
                          {previewDeal.terms}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ justifyContent: 'space-between', padding: '12px 24px' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Loot ID: <strong style={{ fontFamily: 'monospace' }}>#{previewDeal.id}</strong> • Priority: <strong>{previewDeal.priority}</strong>
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
                    <Edit2 size={14} /> Edit Loot Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
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
