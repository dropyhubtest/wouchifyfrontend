import React, { useState, useMemo, useEffect } from 'react'
import wouchifyLogo from '../../assets/navbar/wouchify-logo.png'
import { FAVOURITE_STORES } from '../../data/storesHero'
import { CATEGORIES_DATA } from '../../data/categories'
import { FLASH_LOOT_DEALS, type FlashLootDealItem } from '../../data/flashLootDeals'
import { EXCLUSIVE_LOOT_DEALS, type ExclusiveLootDealItem } from '../../data/exclusiveLootDeals'
import { adminApi } from '../../services/adminApi'
import { CustomDropdown } from '../../components/common/CustomDropdown'
import { DEAL_PRODUCT_PRESETS, convertGoogleDriveUrl } from '../../data/dealsPage'
import './AdminDashboardPage.css'

// ── Icons (Clean SVG primitives matching Wouchify styling) ───────────────────
const IconUpload = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconDashboard = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconDeals = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)
const IconCoupons = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
    <path d="M12 12v4m0-8v4" />
  </svg>
)
const IconStores = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const IconWallet = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 12V8H6a2 2 0 01-2-2V4a2 2 0 012-2h14v4" />
    <path d="M4 6v12a2 2 0 002 2h14v-4" />
    <circle cx="18" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
)
const IconLogout = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
const IconTrend = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconBell = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
)
const IconSearch = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)
const IconPlus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconDownload = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)
const IconExternal = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconCopy = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconLayers = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)
const IconCategories = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconFlame = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </svg>
)

// ── Types & Initial Datasets ─────────────────────────────────────────────────
interface DealItem {
  id: number | string
  _id?: string
  name: string
  store: string
  category: string
  price: string
  originalPrice: string
  discount: string
  status: 'active' | 'pending' | 'expired'
  expiry: string
  productImage?: string
  storeLogo?: string
  ctaText?: string
  ctaHref?: string
  dealTag?: string
  rating?: string
  isBestSelling?: boolean
  sectionPlacement?: 'favourite' | 'best_selling' | 'both'
}

interface CouponItem {
  id: number
  code: string
  store: string
  discount: string
  category: string
  usageCount: number
  usageLimit: number
  status: 'active' | 'expired'
  expiry: string
}

interface TransactionItem {
  id: string
  user: string
  email: string
  type: 'Cashback' | 'Redemption' | 'Referral'
  amount: string
  status: 'Completed' | 'Pending' | 'Processing'
  time: string
}

interface LootDealAdminItem {
  id: string
  title: string
  storeName: string
  category: string
  discount: string
  currentPrice: string
  originalPrice: string
  dealType: 'flash' | 'exclusive'
  status: 'active' | 'inactive'
  href: string
}

const INITIAL_LOOT_DEALS: LootDealAdminItem[] = [
  ...FLASH_LOOT_DEALS.map((d: FlashLootDealItem) => ({
    id: d.id,
    title: d.title,
    storeName: d.storeName,
    category: d.category,
    discount: d.discount,
    currentPrice: d.currentPrice,
    originalPrice: d.originalPrice,
    dealType: 'flash' as const,
    status: 'active' as const,
    href: d.href
  })),
  ...EXCLUSIVE_LOOT_DEALS.map((d: ExclusiveLootDealItem) => ({
    id: d.id,
    title: d.title,
    storeName: d.storeName,
    category: d.category,
    discount: d.discount,
    currentPrice: d.currentPrice,
    originalPrice: d.originalPrice,
    dealType: 'exclusive' as const,
    status: 'active' as const,
    href: d.href
  }))
]

interface UserItem {
  id: number
  name: string
  email: string
  walletBalance: string
  totalCashback: string
  joinedDate: string
  status: 'active' | 'verified' | 'suspended'
}

const INITIAL_DEALS: DealItem[] = [
  { id: 'deal-1', name: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN', store: 'Amazon', category: 'Electronics', price: '₹37,998', originalPrice: '₹62,999', discount: '40% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 10, name: 'Milton Rapid Electric Kettle 1.8L [Trending]', store: 'Amazon', category: 'Electronics', price: '₹604', originalPrice: '₹1,499', discount: '60% OFF', status: 'active', expiry: 'Sep 28, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 1, name: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium', store: 'Amazon', category: 'Electronics', price: '₹1,19,900', originalPrice: '₹1,34,900', discount: '11% OFF', status: 'active', expiry: 'Sep 25, 2026', isBestSelling: true, sectionPlacement: 'best_selling' },
  { id: 2, name: 'Nike Air Max Men Sneaker Shoes', store: 'Myntra', category: 'Fashion', price: '₹5,499', originalPrice: '₹9,995', discount: '45% OFF', status: 'active', expiry: 'Sep 18, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 3, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', store: 'Flipkart', category: 'Electronics', price: '₹26,990', originalPrice: '₹34,990', discount: '23% OFF', status: 'active', expiry: 'Sep 22, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 4, name: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders', store: 'Swiggy', category: 'Food', price: '₹250', originalPrice: '₹500', discount: '50% OFF', status: 'pending', expiry: 'Sep 12, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 5, name: 'Zomato Gold 12-Month Dining Membership', store: 'Zomato', category: 'Food', price: '₹499', originalPrice: '₹999', discount: '50% OFF', status: 'expired', expiry: 'Sep 02, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 6, name: 'Nykaa Beauty Mega Sale - MAC & Clinique Combos', store: 'Nykaa', category: 'Beauty', price: '₹1,890', originalPrice: '₹3,500', discount: '46% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 7, name: 'Fresh Organic Produce Combo Pack (5kg)', store: 'Big Basket', category: 'Grocery', price: '₹399', originalPrice: '₹650', discount: '38% OFF', status: 'active', expiry: 'Sep 15, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 8, name: '10-Minute Grocery Rush Flash Pass', store: 'Zepto', category: 'Grocery', price: '₹99', originalPrice: '₹299', discount: '67% OFF', status: 'active', expiry: 'Sep 14, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 9, name: 'Oval Up Down LED Wall Light 2W [Flash Loot]', store: 'Amazon', category: 'Electronics', price: '₹179', originalPrice: '₹1,899', discount: '91% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
]

const INITIAL_COUPONS: CouponItem[] = [
  { id: 1, code: 'WOUCH50', store: 'Swiggy', discount: '50% OFF', category: 'Food', usageCount: 1420, usageLimit: 2000, status: 'active', expiry: 'Sep 30, 2026' },
  { id: 2, code: 'MYNTRA20', store: 'Myntra', discount: '20% OFF', category: 'Fashion', usageCount: 890, usageLimit: 1500, status: 'active', expiry: 'Sep 28, 2026' },
  { id: 3, code: 'AMZTECH1000', store: 'Amazon', discount: '₹1000 Flat', category: 'Electronics', usageCount: 2310, usageLimit: 2500, status: 'active', expiry: 'Sep 20, 2026' },
  { id: 4, code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', usageCount: 3100, usageLimit: 5000, status: 'active', expiry: 'Oct 05, 2026' },
  { id: 5, code: 'ZOMATOEATS', store: 'Zomato', discount: '60% OFF', category: 'Food', usageCount: 4200, usageLimit: 4200, status: 'expired', expiry: 'Sep 01, 2026' },
  { id: 6, code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 OFF', category: 'Fashion', usageCount: 650, usageLimit: 1000, status: 'active', expiry: 'Oct 15, 2026' },
]

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: 'TXN-9021', user: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', type: 'Cashback', amount: '₹250', status: 'Completed', time: '5 mins ago' },
  { id: 'TXN-9020', user: 'Priya Patel', email: 'priya.patel@outlook.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '18 mins ago' },
  { id: 'TXN-9019', user: 'Amit Kumar', email: 'amit.k@gmail.com', type: 'Cashback', amount: '₹120', status: 'Completed', time: '1 hr ago' },
  { id: 'TXN-9018', user: 'Sneha Verma', email: 'sneha.v@yahoo.com', type: 'Redemption', amount: '₹1,200', status: 'Completed', time: '2 hrs ago' },
  { id: 'TXN-9017', user: 'Vikram Mehta', email: 'v.mehta@gmail.com', type: 'Referral', amount: '₹150', status: 'Completed', time: '4 hrs ago' },
  { id: 'TXN-9016', user: 'Ananya Roy', email: 'ananya.roy@gmail.com', type: 'Cashback', amount: '₹340', status: 'Completed', time: '6 hrs ago' },
  { id: 'TXN-9015', user: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', type: 'Redemption', amount: '₹750', status: 'Pending', time: '8 hrs ago' },
]

const INITIAL_USERS: UserItem[] = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', walletBalance: '₹850', totalCashback: '₹4,250', joinedDate: 'Aug 12, 2026', status: 'verified' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@outlook.com', walletBalance: '₹1,240', totalCashback: '₹6,180', joinedDate: 'Jul 24, 2026', status: 'verified' },
  { id: 3, name: 'Amit Kumar', email: 'amit.k@gmail.com', walletBalance: '₹320', totalCashback: '₹1,900', joinedDate: 'Aug 29, 2026', status: 'active' },
  { id: 4, name: 'Sneha Verma', email: 'sneha.v@yahoo.com', walletBalance: '₹2,450', totalCashback: '₹12,400', joinedDate: 'Jun 10, 2026', status: 'verified' },
  { id: 5, name: 'Vikram Mehta', email: 'v.mehta@gmail.com', walletBalance: '₹150', totalCashback: '₹890', joinedDate: 'Sep 01, 2026', status: 'active' },
  { id: 6, name: 'Karan Malhotra', email: 'karan.m@gmail.com', walletBalance: '₹0', totalCashback: '₹0', joinedDate: 'Sep 06, 2026', status: 'suspended' },
]

export const AdminDashboardPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deals, setDeals] = useState<DealItem[]>(() => {
    try {
      const cached = localStorage.getItem('wouchify_public_deals')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cachedIds = new Set(parsed.map((d: any) => String(d._id || d.id)))
          const cachedNames = new Set(parsed.map((d: any) => String(d.name).toLowerCase().trim()))
          const missingDefaults = INITIAL_DEALS.filter(
            (d) => !cachedIds.has(String(d._id || d.id)) && !cachedNames.has(d.name.toLowerCase().trim())
          )
          return [...parsed, ...missingDefaults]
        }
      }
    } catch {}
    return INITIAL_DEALS
  })
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS)
  const [lootDeals, setLootDeals] = useState<LootDealAdminItem[]>(INITIAL_LOOT_DEALS)
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS)
  const [users] = useState<UserItem[]>(INITIAL_USERS)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true)

  // Load live data from Backend API on mount
  useEffect(() => {
    let isMounted = true
    const fetchLiveData = async () => {
      try {
        const [dealsRes, couponsRes, lootRes, txnsRes] = await Promise.allSettled([
          adminApi.getDeals(),
          adminApi.getCoupons(),
          adminApi.getLootDeals(),
          adminApi.getTransactions()
        ])
        if (!isMounted) return

        if (dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value) && dealsRes.value.length > 0) {
          setDeals((prevDeals) => {
            const backendDeals = dealsRes.value
            const backendIds = new Set(backendDeals.map((d: any) => String(d._id || d.id)))
            const backendNames = new Set(backendDeals.map((d: any) => String(d.name).toLowerCase().trim()))

            // Retain any custom deals created by the user locally that backend might not have yet
            const locallyCreated = prevDeals.filter(
              (d) => !backendIds.has(String(d._id || d.id)) && !backendNames.has(d.name.toLowerCase().trim())
            )

            // Auto-sync any local custom deals to backend so backend persists them too!
            if (locallyCreated.length > 0) {
              locallyCreated.forEach((deal) => {
                adminApi.createDeal(deal).catch(() => {})
              })
            }

            const merged = [...locallyCreated, ...backendDeals]
            try {
              localStorage.setItem('wouchify_public_deals', JSON.stringify(merged))
            } catch {}
            return merged
          })
        }
        if (couponsRes.status === 'fulfilled' && Array.isArray(couponsRes.value) && couponsRes.value.length > 0) {
          setCoupons(couponsRes.value)
        }
        if (lootRes.status === 'fulfilled' && Array.isArray(lootRes.value) && lootRes.value.length > 0) {
          setLootDeals(lootRes.value)
        }
        if (txnsRes.status === 'fulfilled' && Array.isArray(txnsRes.value) && txnsRes.value.length > 0) {
          setTransactions(txnsRes.value)
        }
        setIsBackendConnected(true)
      } catch (err) {
        if (isMounted) setIsBackendConnected(false)
      }
    }
    fetchLiveData()
    return () => { isMounted = false }
  }, [])

  // Filters
  const [dealCategoryFilter, setDealCategoryFilter] = useState('All')
  const [dealStatusFilter, setDealStatusFilter] = useState('All')
  const [lootDealTypeFilter, setLootDealTypeFilter] = useState<'All' | 'flash' | 'exclusive'>('All')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('All')
  const [dashboardSectionTab, setDashboardSectionTab] = useState<'all' | 'deals' | 'coupons' | 'stores' | 'categories'>('all')

  // Modals
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false)
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Form states
  const [newDeal, setNewDeal] = useState<{
    name: string
    store: string
    category: string
    price: string
    originalPrice: string
    discount: string
    expiry: string
    status: 'active' | 'pending' | 'expired'
    productImage: string
    ctaText: string
    ctaHref: string
    dealTag: string
    isBestSelling: boolean
    sectionPlacement: 'favourite' | 'best_selling' | 'both'
  }>({
    name: '',
    store: 'Amazon',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    discount: '',
    expiry: 'Sep 30, 2026',
    status: 'active',
    productImage: '',
    ctaText: 'GRAB DEAL',
    ctaHref: '',
    dealTag: 'Deal',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  })

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    store: 'Amazon',
    discount: '20% OFF',
    category: 'Electronics',
    usageLimit: 1000,
    expiry: 'Oct 31, 2026'
  })

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || '{}')
    } catch {
      return {}
    }
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3200)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.history.pushState({}, '', '/admin/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    showToast(`Coupon code "${text}" copied to clipboard!`)
    window.setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStoreLogo = (storeName: string): string | null => {
    const s = FAVOURITE_STORES.find(
      (item) => item.name.toLowerCase().trim() === storeName.toLowerCase().trim()
    )
    return s ? s.logo : null
  }

  // ── Filtered Datasets ──────────────────────────────────────────────────────
  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.store.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = dealCategoryFilter === 'All' || d.category.toLowerCase() === dealCategoryFilter.toLowerCase()
      const matchesStatus = dealStatusFilter === 'All' || d.status.toLowerCase() === dealStatusFilter.toLowerCase()
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [deals, searchQuery, dealCategoryFilter, dealStatusFilter])

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      return (
        searchQuery.trim() === '' ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.store.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [coupons, searchQuery])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = transactionTypeFilter === 'All' || t.type.toLowerCase() === transactionTypeFilter.toLowerCase()
      return matchesSearch && matchesType
    })
  }, [transactions, searchQuery, transactionTypeFilter])

  const filteredStores = useMemo(() => {
    return FAVOURITE_STORES.filter((s) => {
      return (
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery])

  const filteredLootDeals = useMemo(() => {
    return lootDeals.filter((l) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = lootDealTypeFilter === 'All' || l.dealType === lootDealTypeFilter
      return matchesSearch && matchesType
    })
  }, [lootDeals, searchQuery, lootDealTypeFilter])

  const filteredCategories = useMemo(() => {
    return CATEGORIES_DATA.filter((c) => {
      return (
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subcategories.some((sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  }, [searchQuery])

  // ── Dynamic Live Stats Computed from Datasets ─────────────────────────────
  const liveStats = useMemo(() => {
    const activeDealsCount = deals.filter((d) => d.status === 'active').length
    const activeCouponsCount = coupons.filter((c) => c.status === 'active').length
    const activeLootDealsCount = lootDeals.filter((l) => l.status === 'active').length
    const totalDisbursed = transactions
      .filter((t) => t.status === 'Completed')
      .reduce((acc, curr) => {
        const numeric = parseInt(curr.amount.replace(/[^0-9]/g, ''), 10) || 0
        return acc + numeric
      }, 0)
    const baseDisbursed = 214500
    const formattedDisbursed = `₹${(baseDisbursed + totalDisbursed).toLocaleString('en-IN')}`

    return {
      activeDealsCount,
      activeCouponsCount,
      activeLootDealsCount,
      partnerStoresCount: FAVOURITE_STORES.length,
      categoriesCount: CATEGORIES_DATA.length,
      disbursedCashback: formattedDisbursed,
      pendingRequestsCount: transactions.filter((t) => t.status === 'Pending').length,
    }
  }, [deals, coupons, lootDeals, transactions])


  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDeleteDeal = async (id: string | number) => {
    setDeals((prev) => {
      const updated = prev.filter((d) => d.id !== id && d._id !== String(id))
      try {
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updated))
        window.dispatchEvent(new Event('wouchify_deals_updated'))
      } catch {}
      return updated
    })
    try {
      await adminApi.deleteDeal(id)
    } catch {
      // Handled gracefully in local state
    }
    showToast('Deal deleted successfully.')
  }

  const handleToggleDealStatus = async (id: string | number) => {
    setDeals((prev) => {
      const updated = prev.map((d) => {
        if (d.id === id || d._id === String(id)) {
          const nextStatus: 'active' | 'pending' = d.status === 'active' ? 'pending' : 'active'
          showToast(`Deal marked as ${nextStatus.toUpperCase()}`)
          return { ...d, status: nextStatus }
        }
        return d
      })
      try {
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updated))
        window.dispatchEvent(new Event('wouchify_deals_updated'))
      } catch {}
      return updated
    })
    try {
      await adminApi.toggleDealStatus(id)
    } catch {
      // Handled gracefully in local state
    }
  }

  const handleDeleteLootDeal = async (id: string) => {
    setLootDeals((prev) => prev.filter((d) => d.id !== id))
    try {
      await adminApi.deleteLootDeal(id)
    } catch {
      // Handled gracefully in local state
    }
    showToast('Loot deal removed from catalog.')
  }

  const handleToggleLootDealStatus = async (id: string) => {
    setLootDeals((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = d.status === 'active' ? 'inactive' : 'active'
          showToast(`Loot deal is now ${next.toUpperCase()}`)
          return { ...d, status: next }
        }
        return d
      })
    )
    try {
      await adminApi.toggleLootDealStatus(id)
    } catch {
      // Handled gracefully in local state
    }
  }

  const handleApproveTransaction = async (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          showToast(`Transaction ${id} approved & paid!`)
          return { ...t, status: 'Completed' }
        }
        return t
      })
    )
    try {
      await adminApi.approveTransaction(id)
    } catch {
      // Handled gracefully in local state
    }
  }

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 6 * 1024 * 1024) {
      showToast('Image file should be under 6MB for optimal browser speed')
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setNewDeal((prev) => ({ ...prev, productImage: dataUrl }))
      showToast(`Image "${file.name}" uploaded from local storage!`)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (rawUrl: string) => {
    const converted = convertGoogleDriveUrl(rawUrl)
    setNewDeal((prev) => ({ ...prev, productImage: converted }))
    if (rawUrl.includes('drive.google.com') && converted !== rawUrl) {
      showToast('Converted Google Drive link into direct CDN image URL!')
    }
  }

  const handleToggleBestSelling = async (id: string | number) => {
    let toggledState = false
    setDeals((prev) => {
      const updated = prev.map((d) => {
        if (d.id === id || d._id === String(id)) {
          const next = !d.isBestSelling
          toggledState = next
          const nextPlacement: 'favourite' | 'best_selling' | 'both' = next
            ? (d.sectionPlacement === 'favourite' ? 'both' : 'best_selling')
            : 'favourite'
          showToast(next ? '⭐ Deal added to Best Selling Deal Picks!' : 'Deal removed from Best Selling')
          return { ...d, isBestSelling: next, sectionPlacement: nextPlacement }
        }
        return d
      })
      try {
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updated))
        window.dispatchEvent(new Event('wouchify_deals_updated'))
      } catch {}
      return updated
    })
    try {
      await adminApi.updateDeal(id, {
        isBestSelling: toggledState,
        sectionPlacement: toggledState ? 'both' : 'favourite'
      })
    } catch {
      // Local state and storage fallback
    }
  }

  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeal.name || !newDeal.price) return

    // Auto-calculate discount if not provided
    let discountStr = newDeal.discount
    if (!discountStr && newDeal.originalPrice && newDeal.price) {
      const orig = Number(newDeal.originalPrice.replace(/[^0-9.]/g, ''))
      const cur = Number(newDeal.price.replace(/[^0-9.]/g, ''))
      if (orig > cur && orig > 0) {
        discountStr = `${Math.round(((orig - cur) / orig) * 100)}% OFF`
      }
    }

    const isBest = Boolean(
      newDeal.isBestSelling ||
      newDeal.sectionPlacement === 'best_selling' ||
      newDeal.sectionPlacement === 'both'
    )

    const dealId = Date.now()
    const created: DealItem = {
      id: dealId,
      _id: String(dealId),
      name: newDeal.name,
      store: newDeal.store,
      category: newDeal.category,
      price: newDeal.price.startsWith('₹') ? newDeal.price : `₹${newDeal.price}`,
      originalPrice: newDeal.originalPrice ? (newDeal.originalPrice.startsWith('₹') ? newDeal.originalPrice : `₹${newDeal.originalPrice}`) : '',
      discount: discountStr || '20% OFF',
      status: newDeal.status,
      expiry: newDeal.expiry,
      productImage: convertGoogleDriveUrl(newDeal.productImage || ''),
      ctaText: newDeal.ctaText || 'GRAB DEAL',
      ctaHref: newDeal.ctaHref || `/stores#${newDeal.store.toLowerCase().replace(/\s+/g, '-')}`,
      dealTag: newDeal.dealTag || 'Deal',
      isBestSelling: isBest,
      sectionPlacement: newDeal.sectionPlacement || 'favourite'
    }

    setDeals((prev) => {
      const updated = [created, ...prev]
      try {
        localStorage.setItem('wouchify_public_deals', JSON.stringify(updated))
        window.dispatchEvent(new Event('wouchify_deals_updated'))
      } catch {}
      return updated
    })
    setIsAddDealModalOpen(false)
    setNewDeal({
      name: '',
      store: 'Amazon',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      discount: '',
      expiry: 'Sep 30, 2026',
      status: 'active',
      productImage: '',
      ctaText: 'GRAB DEAL',
      ctaHref: '',
      dealTag: 'Deal',
      isBestSelling: false,
      sectionPlacement: 'favourite'
    })
    try {
      adminApi.createDeal(created)
    } catch {
      // Handled gracefully in local state
    }
    showToast(`New deal for ${created.store} published live!`)
  }

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoupon.code) return

    const created: CouponItem = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      store: newCoupon.store,
      discount: newCoupon.discount,
      category: newCoupon.category,
      usageCount: 0,
      usageLimit: Number(newCoupon.usageLimit) || 1000,
      status: 'active',
      expiry: newCoupon.expiry
    }

    setCoupons([created, ...coupons])
    setIsAddCouponModalOpen(false)
    setNewCoupon({
      code: '',
      store: 'Amazon',
      discount: '20% OFF',
      category: 'Electronics',
      usageLimit: 1000,
      expiry: 'Oct 31, 2026'
    })
    try {
      adminApi.createCoupon(created)
    } catch {
      // Handled gracefully in local state
    }
    showToast(`Coupon code ${created.code} activated!`)
  }

  const exportCSVReport = () => {
    const csvContent =
      'Transaction ID,User,Email,Type,Amount,Status,Time\n' +
      transactions
        .map((t) => `"${t.id}","${t.user}","${t.email}","${t.type}","${t.amount}","${t.status}","${t.time}"`)
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `wouchify-transactions-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Transaction report exported as CSV.')
  }

  // Navigation Items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, badge: null },
    { key: 'deals', label: 'Deals Management', icon: <IconDeals />, badge: deals.length },
    { key: 'loot-deals', label: 'Loot Deals', icon: <IconFlame />, badge: lootDeals.length },
    { key: 'coupons', label: 'Verified Coupons', icon: <IconCoupons />, badge: coupons.length },
    { key: 'categories', label: 'Categories Studio', icon: <IconCategories />, badge: CATEGORIES_DATA.length },
    { key: 'stores', label: 'Partner Stores', icon: <IconStores />, badge: FAVOURITE_STORES.length },
    { key: 'users', label: 'Users Directory', icon: <IconUsers />, badge: users.length },
    { key: 'wallet', label: 'Wallet & Payouts', icon: <IconWallet />, badge: null }
  ]

  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast" role="status">
          <IconCheck />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-logo-card" title="View Live Storefront">
              <img src={wouchifyLogo} alt="Wouchify" className="sidebar-brand-logo" />
            </a>
            {sidebarOpen && (
              <span className="sidebar-studio-badge">
                <span className="studio-pulse-dot" />
                STUDIO
              </span>
            )}
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transform: sidebarOpen ? 'none' : 'rotate(180deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">{sidebarOpen && 'Navigation'}</div>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeNav === item.key ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.key)
                setMobileMenuOpen(false)
              }}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {sidebarOpen && item.badge !== null && (
                <span className="nav-count-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer with Live Store & Logout */}
        <div className="sidebar-footer">
          <a
            href="/"
            className="nav-item live-store-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Wouchify Storefront"
          >
            <span className="nav-icon"><IconExternal /></span>
            {sidebarOpen && <span className="nav-label">Live Storefront</span>}
          </a>

          <button className="nav-item logout-btn" onClick={handleLogout} title="Sign out of Admin">
            <span className="nav-icon"><IconLogout /></span>
            {sidebarOpen && <span className="nav-label">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <div className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>

            {/* Global Search Pill */}
            <div className="topbar-search">
              <IconSearch />
              <input
                type="text"
                placeholder={
                  activeNav === 'stores'
                    ? 'Search partner stores by name or category...'
                    : activeNav === 'deals'
                    ? 'Search deals by title or store...'
                    : activeNav === 'loot-deals'
                    ? 'Search flash loot and exclusive deals...'
                    : activeNav === 'categories'
                    ? 'Search categories or subcategories...'
                    : activeNav === 'coupons'
                    ? 'Search coupon codes...'
                    : activeNav === 'users'
                    ? 'Search user accounts...'
                    : 'Search across Wouchify platform...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <IconClose />
                </button>
              )}
            </div>
          </div>

          <div className="topbar-right">
            {/* Live Indicator Pill */}
            <div className="live-status-pill">
              <span className="live-pulse" />
              <span>{isBackendConnected ? 'Production Sync' : 'Offline Cache'}</span>
            </div>

            {/* Notifications Bell */}
            <div className="notifications-wrapper">
              <button
                className="topbar-btn notif-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
              >
                <IconBell />
                <span className="notif-badge">3</span>
              </button>

              {isNotificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Platform Alerts</h4>
                    <button
                      className="mark-read-btn"
                      onClick={() => {
                        setIsNotificationsOpen(false)
                        showToast('All notifications marked as read.')
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="notifications-list">
                    <div className="notif-item unread">
                      <span className="notif-dot red" />
                      <div className="notif-content">
                        <strong>New Deal Submission</strong>
                        <p>Swiggy added "Gourmet Feast Flat 50% Off"</p>
                        <small>10 mins ago</small>
                      </div>
                    </div>
                    <div className="notif-item unread">
                      <span className="notif-dot navy" />
                      <div className="notif-content">
                        <strong>Cashback Payout Pending</strong>
                        <p>Priya Patel requested ₹500 wallet withdrawal</p>
                        <small>25 mins ago</small>
                      </div>
                    </div>
                    <div className="notif-item">
                      <span className="notif-dot green" />
                      <div className="notif-content">
                        <strong>Store Synced</strong>
                        <p>20 verified stores active with zero latency</p>
                        <small>1 hour ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="topbar-user" onClick={handleLogout} title="Click to logout">
              <div className="user-avatar">
                {(adminUser.email || 'A')[0].toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">Wouchify Admin</span>
                <span className="user-email">{adminUser.email || 'admin@wouchify.com'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <main className="admin-content">
          {/* Section Breadcrumbs / Header */}
          <div className="content-header">
            <div className="content-heading-group">
              <div className="heading-accent-dot" aria-hidden="true" />
              <div>
                <h1>
                  {activeNav === 'dashboard' && 'Dashboard Overview'}
                  {activeNav === 'deals' && 'Deals Management Studio'}
                  {activeNav === 'loot-deals' && 'Loot & Flash Deals Studio'}
                  {activeNav === 'coupons' && 'Verified Coupons Hub'}
                  {activeNav === 'categories' && 'Categories & Taxonomy Studio'}
                  {activeNav === 'stores' && 'Partner Stores Directory'}
                  {activeNav === 'users' && 'User Accounts & Wallets'}
                  {activeNav === 'wallet' && 'Cashback & Payout Ledger'}
                </h1>
                <p>
                  {activeNav === 'dashboard' && 'Real-time performance metrics, live deal statuses, and user reward redemptions.'}
                  {activeNav === 'deals' && 'Create, edit, and control discount promotions rendered on user-facing storefronts.'}
                  {activeNav === 'loot-deals' && 'Curate high-urgency Flash Loot and Exclusive Loot promotions with steep discounts (>80% off).'}
                  {activeNav === 'coupons' && 'Manage coupon codes, usage limits, and store discount vouchers.'}
                  {activeNav === 'categories' && 'Explore all product retail verticals, manage subcategories, and monitor active listing counts.'}
                  {activeNav === 'stores' && 'Verify and manage 20 official brand partners and reward tiers.'}
                  {activeNav === 'users' && 'Monitor customer accounts, verified reward balances, and tier privileges.'}
                  {activeNav === 'wallet' && 'Manage cashback approvals, transaction records, and financial reconciliation.'}
                </p>
              </div>
            </div>

            {/* Contextual Header Actions */}
            <div className="content-actions">
              <button className="btn-secondary" onClick={exportCSVReport}>
                <IconDownload />
                <span>Export Report</span>
              </button>

              {activeNav === 'deals' || activeNav === 'dashboard' ? (
                <button className="btn-primary" onClick={() => setIsAddDealModalOpen(true)}>
                  <IconPlus />
                  <span>Add New Deal</span>
                </button>
              ) : activeNav === 'loot-deals' ? (
                <a href="/loot-deals" target="_blank" className="btn-primary" rel="noreferrer">
                  <IconExternal />
                  <span>View Live Loot</span>
                </a>
              ) : activeNav === 'categories' ? (
                <a href="/categories" target="_blank" className="btn-primary" rel="noreferrer">
                  <IconExternal />
                  <span>Live Taxonomy</span>
                </a>
              ) : activeNav === 'coupons' ? (
                <button className="btn-primary" onClick={() => setIsAddCouponModalOpen(true)}>
                  <IconPlus />
                  <span>Create Coupon</span>
                </button>
              ) : (
                <a href="/" target="_blank" className="btn-primary" rel="noreferrer">
                  <IconExternal />
                  <span>Browse Store</span>
                </a>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 1: DASHBOARD
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'dashboard' && (
            <div className="view-dashboard">
              {/* Top 4 KPI Metrics - Dynamically computed */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Registered Customers</span>
                    <div className="admin-stat-icon icon-users"><IconUsers /></div>
                  </div>
                  <div className="admin-stat-middle">
                    <h2 className="admin-stat-value">{(users.length * 2140 + 3).toLocaleString('en-IN')}</h2>
                  </div>
                  <div className="admin-stat-footer">
                    <span className="admin-stat-trend positive">
                      <IconTrend /> +8.2%
                    </span>
                    <span className="admin-stat-period">vs last month</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Active Published Deals</span>
                    <div className="admin-stat-icon icon-deals"><IconDeals /></div>
                  </div>
                  <div className="admin-stat-middle">
                    <h2 className="admin-stat-value">{liveStats.activeDealsCount} Active</h2>
                  </div>
                  <div className="admin-stat-footer">
                    <span className="admin-stat-trend positive">
                      <IconTrend /> +14%
                    </span>
                    <span className="admin-stat-period">{deals.length} total deals</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Verified Brand Partners</span>
                    <div className="admin-stat-icon icon-stores"><IconStores /></div>
                  </div>
                  <div className="admin-stat-middle">
                    <h2 className="admin-stat-value">{liveStats.partnerStoresCount} Stores</h2>
                  </div>
                  <div className="admin-stat-footer">
                    <span className="admin-stat-trend positive">
                      <span className="stat-live-dot" /> 100% Online
                    </span>
                    <span className="admin-stat-period">20 verified</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Cashback Disbursed</span>
                    <div className="admin-stat-icon icon-wallet"><IconWallet /></div>
                  </div>
                  <div className="admin-stat-middle">
                    <h2 className="admin-stat-value">{liveStats.disbursedCashback}</h2>
                  </div>
                  <div className="admin-stat-footer">
                    <span className="admin-stat-trend positive">
                      <IconTrend /> +5.8%
                    </span>
                    <span className="admin-stat-period">live ledger balance</span>
                  </div>
                </div>
              </div>

              {/* Live Section Filter Tabs */}
              <div className="dashboard-section-tabs-bar">
                <div className="section-tabs-label">
                  <IconLayers />
                  <span>Storefront Live Sections:</span>
                </div>
                <div className="section-tabs-list">
                  <button
                    type="button"
                    className={`section-tab-pill ${dashboardSectionTab === 'all' ? 'active' : ''}`}
                    onClick={() => setDashboardSectionTab('all')}
                  >
                    All Sections
                  </button>
                  <button
                    type="button"
                    className={`section-tab-pill ${dashboardSectionTab === 'deals' ? 'active' : ''}`}
                    onClick={() => setDashboardSectionTab('deals')}
                  >
                    Deals & Loot ({deals.length})
                  </button>
                  <button
                    type="button"
                    className={`section-tab-pill ${dashboardSectionTab === 'coupons' ? 'active' : ''}`}
                    onClick={() => setDashboardSectionTab('coupons')}
                  >
                    Coupons ({coupons.length})
                  </button>
                  <button
                    type="button"
                    className={`section-tab-pill ${dashboardSectionTab === 'stores' ? 'active' : ''}`}
                    onClick={() => setDashboardSectionTab('stores')}
                  >
                    Partner Brands ({FAVOURITE_STORES.length})
                  </button>
                  <button
                    type="button"
                    className={`section-tab-pill ${dashboardSectionTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setDashboardSectionTab('categories')}
                  >
                    Categories ({CATEGORIES_DATA.length})
                  </button>
                </div>
              </div>

              {/* Two-Column Grid: Left Multi-Section Live Feed + Right Activity Ledger */}
              <div className="dashboard-grid">
                {/* Left Panel: Sections Live Data */}
                <div className="dashboard-main-col">
                  {/* Section: Live Deals & Loot Offers */}
                  {(dashboardSectionTab === 'all' || dashboardSectionTab === 'deals') && (
                    <div className="panel section-panel">
                      <div className="panel-header">
                        <div className="panel-title-wrap">
                          <span className="panel-dot red" />
                          <h3>Live Deals & Loot Offers</h3>
                          <span className="section-count-badge">{deals.length} Live Items</span>
                        </div>
                        <button className="panel-link" onClick={() => setActiveNav('deals')}>
                          Full Deals Studio →
                        </button>
                      </div>

                      <div className="table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Deal Item</th>
                              <th>Store</th>
                              <th>Price / Discount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deals.slice(0, 6).map((deal) => {
                              const storeLogo = getStoreLogo(deal.store)
                              return (
                                <tr key={deal.id}>
                                  <td className="deal-name-cell">
                                    <div className="deal-title-row">
                                      <span className="deal-title">{deal.name}</span>
                                      {deal.isBestSelling && (
                                        <span className="table-best-seller-pill" title="Featured in Best Selling Deal Picks">⭐ Best Seller</span>
                                      )}
                                    </div>
                                    <span className="deal-sub">{deal.category} • Expiry: {deal.expiry}</span>
                                  </td>
                                  <td>
                                    <div className="table-store-pill">
                                      {storeLogo && (
                                        <img src={storeLogo} alt={deal.store} className="table-store-logo" />
                                      )}
                                      <span>{deal.store}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="deal-price-wrapper">
                                      <strong className="deal-price">{deal.price}</strong>
                                      <span className="discount-badge">{deal.discount}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`status-badge status-${deal.status}`}>
                                      {deal.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="action-btns">
                                      <button
                                        type="button"
                                        className={`best-seller-btn ${deal.isBestSelling ? 'active' : ''}`}
                                        onClick={() => handleToggleBestSelling(deal.id)}
                                        title={deal.isBestSelling ? 'Featured in Best Selling (Click to remove)' : 'Feature in Best Selling Deal Picks'}
                                      >
                                        <IconStar />
                                      </button>
                                      <button
                                        type="button"
                                        className={`status-switch ${deal.status === 'active' ? 'active' : 'paused'}`}
                                        onClick={() => handleToggleDealStatus(deal.id)}
                                        title={deal.status === 'active' ? 'Click to Pause Deal' : 'Click to Activate Deal'}
                                      >
                                        <span className="switch-track">
                                          <span className="switch-thumb" />
                                        </span>
                                        <span className="switch-text">{deal.status === 'active' ? 'Active' : 'Paused'}</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="table-delete-btn"
                                        onClick={() => handleDeleteDeal(deal.id)}
                                        title="Delete Deal"
                                      >
                                        <IconTrash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Section: Verified Coupons Spotlight */}
                  {(dashboardSectionTab === 'all' || dashboardSectionTab === 'coupons') && (
                    <div className="panel section-panel">
                      <div className="panel-header">
                        <div className="panel-title-wrap">
                          <span className="panel-dot navy" />
                          <h3>Verified Coupons Spotlight</h3>
                          <span className="section-count-badge">{coupons.length} Active Vouchers</span>
                        </div>
                        <button className="panel-link" onClick={() => setActiveNav('coupons')}>
                          Coupons Hub →
                        </button>
                      </div>

                      <div className="overview-coupons-strip">
                        {coupons.slice(0, 3).map((coupon) => (
                          <div className="overview-coupon-card" key={coupon.id}>
                            <div className="overview-coupon-top">
                              <div className="coupon-code-wrap">
                                <span className="coupon-code">{coupon.code}</span>
                                <button
                                  type="button"
                                  className="copy-coupon-btn"
                                  onClick={() => copyToClipboard(coupon.code)}
                                  title="Copy Code"
                                >
                                  {copiedCode === coupon.code ? <IconCheck /> : <IconCopy />}
                                </button>
                              </div>
                              <span className={`status-badge status-${coupon.status}`}>
                                {coupon.status}
                              </span>
                            </div>

                            <div className="overview-coupon-meta">
                              <div>
                                <span className="overview-meta-store">{coupon.store}</span>
                                <span className="overview-meta-discount red-text">{coupon.discount}</span>
                              </div>
                              <span className="overview-meta-expiry">Exp: {coupon.expiry}</span>
                            </div>

                            <div className="coupon-progress-section">
                              <div className="progress-labels">
                                <span>Redemptions</span>
                                <strong>{coupon.usageCount} / {coupon.usageLimit}</strong>
                              </div>
                              <div className="progress-bar-bg">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Official Partner Stores Strip */}
                  {(dashboardSectionTab === 'all' || dashboardSectionTab === 'stores') && (
                    <div className="panel section-panel">
                      <div className="panel-header">
                        <div className="panel-title-wrap">
                          <span className="panel-dot amber" />
                          <h3>Official Partner Brands & Stores</h3>
                          <span className="section-count-badge">20 Verified Partners</span>
                        </div>
                        <button className="panel-link" onClick={() => setActiveNav('stores')}>
                          All 20 Stores →
                        </button>
                      </div>

                      <div className="overview-stores-strip">
                        {FAVOURITE_STORES.slice(0, 6).map((store) => (
                          <div className="overview-store-pill-card" key={store.id}>
                            <div className="overview-store-logo-box">
                              <img src={store.logo} alt={store.name} className="overview-store-img" />
                            </div>
                            <div className="overview-store-info">
                              <strong className="overview-store-name">{store.name}</strong>
                              <span className="overview-store-reward">{store.reward}</span>
                            </div>
                            <span className="overview-online-dot" title="Online & verified" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section: Category Distribution */}
                  {(dashboardSectionTab === 'all' || dashboardSectionTab === 'categories') && (
                    <div className="panel section-panel">
                      <div className="panel-header">
                        <div className="panel-title-wrap">
                          <span className="panel-dot emerald" />
                          <h3>Storefront Categories Distribution</h3>
                          <span className="section-count-badge">{CATEGORIES_DATA.length} Retail Categories</span>
                        </div>
                        <a href="/categories" target="_blank" rel="noreferrer" className="panel-link">
                          Customer View ↗
                        </a>
                      </div>

                      <div className="overview-categories-grid">
                        {CATEGORIES_DATA.map((cat) => (
                          <div className="overview-category-chip" key={cat.id}>
                            <div className="category-chip-accent" style={{ background: cat.color }} />
                            <div className="category-chip-details">
                              <span className="category-chip-name">{cat.name}</span>
                              <span className="category-chip-sub">
                                {cat.subcategories.length} subcategories • {cat.count} deals
                              </span>
                            </div>
                            <span className="category-live-tag">Live</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Panel: Recent Wallet & Activity Ledger */}
                <div className="panel transactions-panel">
                  <div className="panel-header">
                    <div className="panel-title-wrap">
                      <span className="panel-dot navy" />
                      <h3>Reward Activity</h3>
                    </div>
                    <button className="panel-link" onClick={() => setActiveNav('wallet')}>
                      Ledger →
                    </button>
                  </div>

                  <div className="transaction-list">
                    {transactions.slice(0, 7).map((txn) => (
                      <div className="txn-item" key={txn.id}>
                        <div className="txn-avatar">{txn.user[0]}</div>
                        <div className="txn-info">
                          <span className="txn-user">{txn.user}</span>
                          <span className="txn-email">{txn.email}</span>
                          <span className="txn-id-sub">{txn.id}</span>
                        </div>
                        <div className="txn-right">
                          <span className={`txn-type txn-type-${txn.type.toLowerCase()}`}>
                            {txn.type}
                          </span>
                          <span className="txn-amount">{txn.amount}</span>
                          {txn.status === 'Pending' ? (
                            <button
                              type="button"
                              className="action-btn-approve-quick"
                              onClick={() => handleApproveTransaction(txn.id)}
                              title="Approve & Disburse Payout"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="txn-time">{txn.time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="wallet-quick-stats">
                    <div className="quick-stat">
                      <span>Pending Approvals</span>
                      <strong className="amber-text">
                        {liveStats.pendingRequestsCount} requests
                      </strong>
                    </div>
                    <div className="quick-stat">
                      <span>Average Cashback</span>
                      <strong>₹285 / order</strong>
                    </div>
                    <div className="quick-stat">
                      <span>Sync Status</span>
                      <strong className="emerald-text">100% Real-time</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 2: DEALS MANAGEMENT
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'deals' && (
            <div className="view-deals panel">
              {/* Filter Row */}
              <div className="table-toolbar">
                <div className="filter-group">
                  <label htmlFor="category-select">Category:</label>
                  <CustomDropdown
                    id="category-select"
                    value={dealCategoryFilter}
                    onChange={(val) => setDealCategoryFilter(val)}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Electronics', label: 'Electronics' },
                      { value: 'Fashion', label: 'Fashion' },
                      { value: 'Food', label: 'Food & Dining' },
                      { value: 'Grocery', label: 'Grocery' },
                      { value: 'Beauty', label: 'Beauty' },
                    ]}
                    variant="admin"
                    size="sm"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="status-select">Status:</label>
                  <CustomDropdown
                    id="status-select"
                    value={dealStatusFilter}
                    onChange={(val) => setDealStatusFilter(val)}
                    options={[
                      { value: 'All', label: 'All Statuses' },
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'expired', label: 'Expired' },
                    ]}
                    variant="admin"
                    size="sm"
                  />
                </div>

                <div className="toolbar-count">
                  Showing <strong>{filteredDeals.length}</strong> deals
                </div>
              </div>

              {/* Deals Table */}
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Deal Title</th>
                      <th>Partner Store</th>
                      <th>Category</th>
                      <th>Offer Price</th>
                      <th>Discount</th>
                      <th>Status</th>
                      <th>Expiry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.length > 0 ? (
                      filteredDeals.map((deal) => {
                        const storeLogo = getStoreLogo(deal.store)
                        return (
                          <tr key={deal.id}>
                            <td className="deal-name-cell">
                              <div className="deal-title-row">
                                <strong className="deal-title">{deal.name}</strong>
                                {deal.isBestSelling && (
                                  <span className="table-best-seller-pill" title="Featured in Best Selling Deal Picks on storefront">
                                    ⭐ Best Seller Pick
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="table-store-pill">
                                {storeLogo && (
                                  <img src={storeLogo} alt={deal.store} className="table-store-logo" />
                                )}
                                <span>{deal.store}</span>
                              </div>
                            </td>
                            <td>
                              <span className="category-chip">{deal.category}</span>
                            </td>
                            <td>
                              <span className="deal-price">{deal.price}</span>
                              {deal.originalPrice && <s className="deal-original-price">{deal.originalPrice}</s>}
                            </td>
                            <td>
                              <span className="discount-badge">{deal.discount}</span>
                            </td>
                            <td>
                              <span className={`status-badge status-${deal.status}`}>
                                {deal.status}
                              </span>
                            </td>
                            <td className="expiry-date">{deal.expiry}</td>
                            <td>
                              <div className="action-btns">
                                <button
                                  type="button"
                                  className={`best-seller-btn ${deal.isBestSelling ? 'active' : ''}`}
                                  onClick={() => handleToggleBestSelling(deal.id)}
                                  title={deal.isBestSelling ? 'Featured in Best Selling Deal Picks (Click to remove)' : 'Feature this deal in Best Selling Deal Picks'}
                                >
                                  <IconStar />
                                  <span>{deal.isBestSelling ? 'Best Seller' : 'Feature'}</span>
                                </button>
                                <button
                                  type="button"
                                  className={`status-switch ${deal.status === 'active' ? 'active' : 'paused'}`}
                                  onClick={() => handleToggleDealStatus(deal.id)}
                                  title={deal.status === 'active' ? 'Click to Pause Deal' : 'Click to Activate Deal'}
                                >
                                  <span className="switch-track">
                                    <span className="switch-thumb" />
                                  </span>
                                  <span className="switch-text">{deal.status === 'active' ? 'Active' : 'Paused'}</span>
                                </button>
                                <button
                                  type="button"
                                  className="table-delete-btn"
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  title="Delete"
                                >
                                  <IconTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="empty-table-cell">
                          No deals matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 3: COUPONS MANAGEMENT
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'coupons' && (
            <div className="view-coupons">
              <div className="coupons-grid">
                {filteredCoupons.map((coupon) => (
                  <div className="coupon-admin-card" key={coupon.id}>
                    <div className="coupon-card-top">
                      <div className="coupon-code-wrap">
                        <span className="coupon-code">{coupon.code}</span>
                        <button
                          className="copy-coupon-btn"
                          onClick={() => copyToClipboard(coupon.code)}
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? <IconCheck /> : <IconCopy />}
                        </button>
                      </div>
                      <span className={`status-badge status-${coupon.status}`}>
                        {coupon.status}
                      </span>
                    </div>

                    <div className="coupon-details">
                      <div className="coupon-row">
                        <span className="detail-label">Partner Store:</span>
                        <strong className="detail-value">{coupon.store}</strong>
                      </div>
                      <div className="coupon-row">
                        <span className="detail-label">Discount Benefit:</span>
                        <strong className="detail-value red-text">{coupon.discount}</strong>
                      </div>
                      <div className="coupon-row">
                        <span className="detail-label">Expires On:</span>
                        <span className="detail-value">{coupon.expiry}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Usage */}
                    <div className="coupon-progress-section">
                      <div className="progress-labels">
                        <span>Redemptions</span>
                        <strong>{coupon.usageCount} / {coupon.usageLimit}</strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 4: PARTNER STORES
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'stores' && (
            <div className="view-stores">
              <div className="stores-admin-grid">
                {filteredStores.map((store) => (
                  <div className="store-admin-card" key={store.id}>
                    <div className="store-card-header">
                      <div className="store-logo-box">
                        <img src={store.logo} alt={store.name} className="admin-store-logo" />
                      </div>
                      <span className="store-status-active">
                        <span className="status-live-dot" /> Active Partner
                      </span>
                    </div>

                    <div className="store-info-box">
                      <span className="store-category-label">{store.category.toUpperCase()}</span>
                      <h3 className="store-admin-name">{store.name}</h3>
                      <div className="store-reward-pill">{store.reward}</div>
                      <p className="store-desc">{store.description}</p>
                    </div>

                    <div className="store-card-actions">
                      <a href={`/stores#store-${store.slug}`} target="_blank" rel="noreferrer" className="store-live-link">
                        <span>View on Storefront</span>
                        <IconExternal />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 5: USERS DIRECTORY
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'users' && (
            <div className="view-users panel">
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Joined Date</th>
                      <th>Current Wallet</th>
                      <th>Total Cashback</th>
                      <th>Account Status</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="user-avatar-circle">{u.name[0]}</div>
                            <div>
                              <strong className="user-fullname">{u.name}</strong>
                              <span className="user-email-text">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{u.joinedDate}</td>
                        <td><strong className="wallet-amount">{u.walletBalance}</strong></td>
                        <td><span className="cashback-amount">{u.totalCashback}</span></td>
                        <td>
                          <span className={`status-badge status-${u.status}`}>
                            {u.status}
                          </span>
                        </td>
                        <td><span className="role-tag">Customer</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 6: WALLET & PAYOUTS
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'wallet' && (
            <div className="view-wallet">
              {/* Quick Summary Strip */}
              <div className="wallet-kpi-strip">
                <div className="wallet-kpi-box">
                  <span>Total Cashback Disbursed</span>
                  <strong>₹2,14,500</strong>
                </div>
                <div className="wallet-kpi-box">
                  <span>Pending Redemptions</span>
                  <strong className="amber-text">₹1,250</strong>
                </div>
                <div className="wallet-kpi-box">
                  <span>Reserve Float</span>
                  <strong>₹5,00,000</strong>
                </div>
              </div>
              {/* Transactions Ledger Panel */}
              <div className="panel">
                <div className="table-toolbar">
                  <div className="filter-group">
                    <label htmlFor="tx-type-select">Transaction Type:</label>
                    <CustomDropdown
                      id="tx-type-select"
                      value={transactionTypeFilter}
                      onChange={(val) => setTransactionTypeFilter(val)}
                      options={[
                        { value: 'All', label: 'All Types' },
                        { value: 'Cashback', label: 'Cashback Earned' },
                        { value: 'Redemption', label: 'Redemption Payout' },
                        { value: 'Referral', label: 'Referral Bonus' },
                      ]}
                      variant="admin"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id}>
                          <td><code>{tx.id}</code></td>
                          <td>
                            <strong>{tx.user}</strong>
                            <div className="deal-sub">{tx.email}</div>
                          </td>
                          <td>
                            <span className={`txn-type txn-type-${tx.type.toLowerCase()}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td><strong className="deal-price">{tx.amount}</strong></td>
                          <td>
                            <span className={`status-badge status-${tx.status.toLowerCase()}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="expiry-date">{tx.time}</td>
                          <td>
                            {tx.status === 'Pending' ? (
                              <button
                                className="action-btn-approve"
                                onClick={() => handleApproveTransaction(tx.id)}
                              >
                                Approve Payout
                              </button>
                            ) : (
                              <span className="settled-label">Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 7: LOOT & FLASH DEALS STUDIO
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'loot-deals' && (
            <div className="view-loot-deals">
              {/* Loot KPI Banner */}
              <div className="loot-kpi-banner">
                <div className="loot-kpi-card">
                  <div className="loot-kpi-icon-wrap flash">
                    <IconFlame />
                  </div>
                  <div>
                    <span className="loot-kpi-label">Active Flash Deals</span>
                    <strong className="loot-kpi-value">
                      {lootDeals.filter((l) => l.dealType === 'flash' && l.status === 'active').length}
                    </strong>
                  </div>
                </div>

                <div className="loot-kpi-card">
                  <div className="loot-kpi-icon-wrap exclusive">
                    <IconFlame />
                  </div>
                  <div>
                    <span className="loot-kpi-label">Exclusive Loot Deals</span>
                    <strong className="loot-kpi-value">
                      {lootDeals.filter((l) => l.dealType === 'exclusive' && l.status === 'active').length}
                    </strong>
                  </div>
                </div>

                <div className="loot-kpi-card">
                  <div className="loot-kpi-icon-wrap discount">
                    <span className="loot-kpi-pct">%</span>
                  </div>
                  <div>
                    <span className="loot-kpi-label">Max Active Discount</span>
                    <strong className="loot-kpi-value red-text">91% OFF</strong>
                  </div>
                </div>

                <div className="loot-kpi-card">
                  <div className="loot-kpi-icon-wrap link">
                    <IconExternal />
                  </div>
                  <div>
                    <span className="loot-kpi-label">Live User Route</span>
                    <a
                      href="/loot-deals"
                      target="_blank"
                      rel="noreferrer"
                      className="loot-route-link"
                    >
                      /loot-deals ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Loot Deals Table Panel */}
              <div className="panel">
                <div className="table-toolbar">
                  <div className="filter-group">
                    <label htmlFor="loot-type-select">Loot Type:</label>
                    <CustomDropdown
                      id="loot-type-select"
                      value={lootDealTypeFilter}
                      onChange={(val) => setLootDealTypeFilter(val as 'All' | 'flash' | 'exclusive')}
                      options={[
                        { value: 'All', label: 'All Loot Promotions' },
                        { value: 'flash', label: 'Flash Loot Deals' },
                        { value: 'exclusive', label: 'Exclusive Loot Deals' },
                      ]}
                      variant="admin"
                      size="sm"
                    />
                  </div>

                  <span className="results-count">
                    Showing {filteredLootDeals.length} of {lootDeals.length} loot promotions
                  </span>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Deal Title & Product</th>
                        <th>Type</th>
                        <th>Store</th>
                        <th>Category</th>
                        <th>Discount</th>
                        <th>Loot Price</th>
                        <th>Original MRP</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLootDeals.map((item) => {
                        const logoUrl = getStoreLogo(item.storeName)
                        return (
                          <tr key={item.id}>
                            <td className="deal-name-cell">
                              <span className="deal-title">{item.title}</span>
                              <span className="deal-sub">ID: {item.id}</span>
                            </td>
                            <td>
                              <span className={`loot-type-pill ${item.dealType}`}>
                                {item.dealType === 'flash' ? '⚡ Flash Loot' : '💎 Exclusive'}
                              </span>
                            </td>
                            <td>
                              <div className="table-store-pill">
                                {logoUrl && (
                                  <img src={logoUrl} alt={item.storeName} className="table-store-logo" />
                                )}
                                <span>{item.storeName}</span>
                              </div>
                            </td>
                            <td>
                              <span className="category-chip">{item.category}</span>
                            </td>
                            <td>
                              <span className="discount-badge">{item.discount} OFF</span>
                            </td>
                            <td>
                              <strong className="deal-price red-price">₹{item.currentPrice}</strong>
                            </td>
                            <td>
                              <span className="deal-original-price">₹{item.originalPrice}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`status-switch ${item.status === 'active' ? 'active' : 'paused'}`}
                                onClick={() => handleToggleLootDealStatus(item.id)}
                                title={item.status === 'active' ? 'Click to Pause Deal' : 'Click to Activate Deal'}
                              >
                                <span className="switch-track">
                                  <span className="switch-thumb" />
                                </span>
                                <span className="switch-text">{item.status === 'active' ? 'Active' : 'Paused'}</span>
                              </button>
                            </td>
                            <td>
                              <div className="action-btns">
                                <a
                                  href={item.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="table-delete-btn"
                                  style={{ color: '#2563EB' }}
                                  title="View on Storefront"
                                >
                                  <IconExternal />
                                </a>
                                <button
                                  type="button"
                                  className="table-delete-btn"
                                  onClick={() => handleDeleteLootDeal(item.id)}
                                  title="Delete from Catalog"
                                >
                                  <IconTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 8: CATEGORIES & TAXONOMY STUDIO
              ══════════════════════════════════════════════════════════════════ */}
          {activeNav === 'categories' && (
            <div className="view-categories-admin">
              {/* Category KPIs */}
              <div className="categories-kpi-strip">
                <div className="cat-kpi-card">
                  <span className="cat-kpi-label">Primary Verticals</span>
                  <strong className="cat-kpi-value">{CATEGORIES_DATA.length}</strong>
                  <span className="cat-kpi-sub">Retail departments</span>
                </div>
                <div className="cat-kpi-card">
                  <span className="cat-kpi-label">Total Subcategories</span>
                  <strong className="cat-kpi-value">
                    {CATEGORIES_DATA.reduce((acc, curr) => acc + curr.subcategories.length, 0)}
                  </strong>
                  <span className="cat-kpi-sub">Curated taxonomy tags</span>
                </div>
                <div className="cat-kpi-card">
                  <span className="cat-kpi-label">Catalog Deals Linked</span>
                  <strong className="cat-kpi-value">
                    {CATEGORIES_DATA.reduce((acc, curr) => acc + curr.count, 0).toLocaleString('en-IN')}
                  </strong>
                  <span className="cat-kpi-sub">Active deals mapped</span>
                </div>
                <div className="cat-kpi-card">
                  <span className="cat-kpi-label">Storefront Page</span>
                  <a
                    href="/categories"
                    target="_blank"
                    rel="noreferrer"
                    className="cat-kpi-link"
                  >
                    Open /categories ↗
                  </a>
                  <span className="cat-kpi-sub">User-facing page</span>
                </div>
              </div>

              {/* Categories Cards Grid */}
              <div className="categories-admin-grid">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="category-admin-card"
                    style={{ borderTop: `4px solid ${cat.color}` }}
                  >
                    <div className="cat-card-header">
                      <div className="cat-header-title-box">
                        <span
                          className="cat-color-dot"
                          style={{ backgroundColor: cat.color }}
                          aria-hidden="true"
                        />
                        <h3 className="cat-admin-name">{cat.name}</h3>
                      </div>
                      <span
                        className="cat-deals-pill"
                        style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
                      >
                        {cat.count} Deals
                      </span>
                    </div>

                    <p className="cat-admin-desc">{cat.description}</p>

                    <div className="cat-subcategories-section">
                      <div className="subcat-header">
                        <span>Subcategories ({cat.subcategories.length})</span>
                      </div>
                      <div className="subcat-chips-wrap">
                        {cat.subcategories.map((sub) => (
                          <span key={sub.id} className="subcat-admin-chip">
                            {sub.name}
                            {sub.itemCount !== undefined && (
                              <small className="subcat-chip-count">{sub.itemCount}</small>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="cat-card-footer">
                      <div className="cat-slug-info">
                        <span className="slug-label">Slug:</span>
                        <code>/{cat.slug}</code>
                      </div>
                      <a
                        href={`/categories#${cat.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="cat-view-live-btn"
                        title={`View ${cat.name} on user storefront`}
                      >
                        <span>Storefront</span>
                        <IconExternal />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Add Deal Modal ── */}
      {isAddDealModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddDealModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Add New Promotional Deal</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7E86B8' }}>
                  Provide all details to render high-conversion promotional cards on the live Deals storefront.
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddDealModalOpen(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleAddDealSubmit} className="modal-form">
              {/* Product Title */}
              <div className="form-group">
                <label>Deal Title / Product Name <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Apple iPhone 16 Pro (128 GB) - Natural Titanium"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  required
                />
              </div>

              {/* Store & Category */}
              <div className="modal-form-row">
                <div className="form-group">
                  <label>Partner Store</label>
                  <CustomDropdown
                    value={newDeal.store}
                    onChange={(val) => setNewDeal({ ...newDeal, store: val })}
                    options={FAVOURITE_STORES.map((s) => ({ value: s.name, label: s.name }))}
                    variant="admin"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <CustomDropdown
                    value={newDeal.category}
                    onChange={(val) => setNewDeal({ ...newDeal, category: val })}
                    options={[
                      { value: 'Electronics', label: 'Electronics' },
                      { value: 'Fashion', label: 'Fashion' },
                      { value: 'Food', label: 'Food & Dining' },
                      { value: 'Grocery', label: 'Grocery' },
                      { value: 'Beauty', label: 'Beauty & Personal Care' },
                      { value: 'Home', label: 'Home & Living' },
                    ]}
                    variant="admin"
                  />
                </div>
              </div>

              {/* Price, MRP, Discount */}
              <div className="modal-form-row modal-form-row--3">
                <div className="form-group">
                  <label>Offer Price (₹) <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. 18990"
                    value={newDeal.price}
                    onChange={(e) => {
                      const p = e.target.value
                      let autoDisc = newDeal.discount
                      if (newDeal.originalPrice && p) {
                        const orig = Number(newDeal.originalPrice.replace(/[^0-9.]/g, ''))
                        const cur = Number(p.replace(/[^0-9.]/g, ''))
                        if (orig > cur && orig > 0) autoDisc = `${Math.round(((orig - cur) / orig) * 100)}% OFF`
                      }
                      setNewDeal({ ...newDeal, price: p, discount: autoDisc })
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (MRP) (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. 24900"
                    value={newDeal.originalPrice}
                    onChange={(e) => {
                      const origVal = e.target.value
                      let autoDisc = newDeal.discount
                      if (origVal && newDeal.price) {
                        const orig = Number(origVal.replace(/[^0-9.]/g, ''))
                        const cur = Number(newDeal.price.replace(/[^0-9.]/g, ''))
                        if (orig > cur && orig > 0) autoDisc = `${Math.round(((orig - cur) / orig) * 100)}% OFF`
                      }
                      setNewDeal({ ...newDeal, originalPrice: origVal, discount: autoDisc })
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. 25% OFF"
                    value={newDeal.discount}
                    onChange={(e) => setNewDeal({ ...newDeal, discount: e.target.value })}
                  />
                </div>
              </div>

              {/* Product Image: Multi-Source Support (Device / Local Storage, Google Drive Link, Presets) */}
              <div className="form-group">
                <div className="image-field-header">
                  <label>Product Image</label>
                  <span className="image-field-sub">Choose from Local Device, Google Drive, or Quick Presets</span>
                </div>

                <div className="image-upload-control-row">
                  <label htmlFor="deal-image-file-input" className="upload-device-btn">
                    <IconUpload />
                    <span>Upload from Device</span>
                    <input
                      id="deal-image-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageFileUpload}
                    />
                  </label>

                  <div className="image-url-input-wrap">
                    <input
                      type="text"
                      placeholder="Paste Google Drive share link or Web image URL..."
                      value={newDeal.productImage}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                    {newDeal.productImage && (
                      <div className="modal-image-thumb" title="Image preview">
                        <img src={newDeal.productImage} alt="Thumbnail preview" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Drive Tip Banner */}
                <div className="drive-tip-banner">
                  <span className="drive-tip-icon">💡</span>
                  <span>
                    <strong>Google Drive Support:</strong> Paste any Google Drive link (e.g. <code>drive.google.com/file/d/.../view</code>) — it automatically converts to Google's direct CDN image stream.
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="preset-chips-row">
                  <span className="preset-label">Quick Presets:</span>
                  {DEAL_PRODUCT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`preset-chip ${newDeal.productImage === preset.image ? 'active' : ''}`}
                      onClick={() => setNewDeal({ ...newDeal, productImage: preset.image })}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal Tag, CTA Text, Destination Link */}
              <div className="modal-form-row modal-form-row--3">
                <div className="form-group">
                  <label>Deal Tag / Badge</label>
                  <CustomDropdown
                    value={newDeal.dealTag}
                    onChange={(val) => setNewDeal({ ...newDeal, dealTag: val })}
                    options={[
                      { value: 'Deal', label: '• Deal' },
                      { value: 'Best Seller', label: '⭐ Best Seller' },
                      { value: 'Hot Pick', label: '🔥 Hot Pick' },
                      { value: 'Flash Loot', label: '⚡ Flash Loot' },
                      { value: 'Exclusive', label: '⭐ Exclusive' },
                      { value: 'Limited Time', label: '⏳ Limited Time' },
                    ]}
                    variant="admin"
                  />
                </div>

                <div className="form-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. GRAB DEAL"
                    value={newDeal.ctaText}
                    onChange={(e) => setNewDeal({ ...newDeal, ctaText: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Destination Deal Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /stores#amazon or external URL"
                    value={newDeal.ctaHref}
                    onChange={(e) => setNewDeal({ ...newDeal, ctaHref: e.target.value })}
                  />
                </div>
              </div>

              {/* Placement Section: Deals from Favourite Stores vs Best Selling Deal Picks */}
              <div className="form-group">
                <label>Storefront Placement Section</label>
                <CustomDropdown
                  value={newDeal.sectionPlacement || 'favourite'}
                  onChange={(val) => setNewDeal({
                    ...newDeal,
                    sectionPlacement: val as 'favourite' | 'best_selling' | 'both',
                    isBestSelling: val === 'best_selling' || val === 'both'
                  })}
                  options={[
                    { value: 'favourite', label: 'Deals from Favourite Stores (Main Grid)' },
                    { value: 'best_selling', label: '⭐ Best Selling Deal Picks (Featured Horizontal Row)' },
                    { value: 'both', label: '🔥 Feature in Both Sections (Maximum Storefront Exposure)' },
                  ]}
                  variant="admin"
                />
              </div>

              {/* Expiry & Status */}
              <div className="modal-form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Sep 30, 2026"
                    value={newDeal.expiry}
                    onChange={(e) => setNewDeal({ ...newDeal, expiry: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Publication Status</label>
                  <CustomDropdown
                    value={newDeal.status}
                    onChange={(val) => setNewDeal({ ...newDeal, status: val as 'active' | 'pending' | 'expired' })}
                    options={[
                      { value: 'active', label: 'Active (Visible on Storefront)' },
                      { value: 'pending', label: 'Pending Review (Hidden)' },
                      { value: 'expired', label: 'Expired' },
                    ]}
                    variant="admin"
                  />
                </div>
              </div>

              {/* Live Storefront Card Preview Box */}
              <div className="modal-card-preview-section">
                <div className="preview-heading">
                  <span>Live Storefront Card Preview</span>
                  <span className="preview-sub">Matches user-facing /deals card styling</span>
                </div>
                <div className="preview-card-wrapper">
                  <div className="preview-deal-card">
                    <div className="preview-deal-image-container">
                      {newDeal.productImage ? (
                        <img src={newDeal.productImage} alt="Product preview" className="preview-deal-image" />
                      ) : (
                        <div className="preview-image-placeholder">No image chosen (Default illustration will show)</div>
                      )}
                    </div>
                    <div className="preview-deal-content">
                      <div className="preview-store-row">
                        <div className="preview-store-left">
                          <img src={getStoreLogo(newDeal.store) || ''} alt={newDeal.store} className="preview-store-logo" />
                          <span className="preview-verified-badge">
                            <span className="preview-verified-dot" /> verified store
                          </span>
                        </div>
                        <span className="preview-deal-tag">
                          <span className="preview-deal-dot" /> {newDeal.dealTag || 'Deal'}
                        </span>
                      </div>
                      <span className="preview-category">{(newDeal.category || 'Electronics').toUpperCase()}</span>
                      <h4 className="preview-title">{newDeal.name || 'Your Deal Title Here'}</h4>
                      <div className="preview-price-row">
                        <span className="preview-price">₹{newDeal.price || '0'}</span>
                        {newDeal.originalPrice && <span className="preview-original-price">₹{newDeal.originalPrice}</span>}
                        {newDeal.discount && <span className="preview-discount-pill">{newDeal.discount}</span>}
                      </div>
                      <button type="button" className="preview-grab-btn">{newDeal.ctaText || 'GRAB DEAL'}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddDealModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Deal Live 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Coupon Modal ── */}
      {isAddCouponModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddCouponModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Verified Coupon Code</h3>
              <button className="modal-close-btn" onClick={() => setIsAddCouponModalOpen(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleAddCouponSubmit} className="modal-form">
              <div className="form-group">
                <label>Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVAL50"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label>Partner Store</label>
                  <CustomDropdown
                    value={newCoupon.store}
                    onChange={(val) => setNewCoupon({ ...newCoupon, store: val })}
                    options={FAVOURITE_STORES.map((s) => ({ value: s.name, label: s.name }))}
                    variant="admin"
                  />
                </div>

                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="text"
                    placeholder="e.g. 30% OFF or ₹200 Flat"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label>Total Redemptions Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Valid Till</label>
                  <input
                    type="text"
                    value={newCoupon.expiry}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddCouponModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
