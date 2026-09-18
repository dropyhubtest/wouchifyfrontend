import React, { useState, useMemo, useEffect } from 'react'
import wouchifyLogo from '../../assets/navbar/wouchify-logo.png'
import { FAVOURITE_STORES, type StoreItem } from '../../data/storesHero'
import { adminApi } from '../../services/adminApi'
import './AdminDashboardPage.css'
import { AdminApprovalsView } from './AdminApprovalsView'
import { AdminConfirmDialog } from '../../components/common/AdminDialog'

// Types
import type {
  StaffItem,
  DealItem,
  CouponItem,
  LootDealAdminItem,
  TransactionItem,
  UserItem,
  AlgorithmConfig,
  GovernanceAuditLog
} from './manager/types'

// Mock Data
import {
  INITIAL_GOVERNANCE_LOGS
} from './manager/mockData'

// Icons
import {
  IconDashboard,
  IconDeals,
  IconCoupons,
  IconStores,
  IconUsers,
  IconWallet,
  IconLogout,
  IconBell,
  IconSearch,
  IconPlus,
  IconDownload,
  IconExternal,
  IconCheck,
  IconClose,
  IconCategories,
  IconFlame,
  IconStaff,
  IconAlgorithm,
  IconShield
} from './manager/icons'

// Views
import { CommercialAnalyticsView } from './manager/views/CommercialAnalyticsView'
import { StaffManagementView } from './manager/views/StaffManagementView'
import { AlgorithmConfigView } from './manager/views/AlgorithmConfigView'
import { DataGovernanceView } from './manager/views/DataGovernanceView'
import { DealsManagementView } from './manager/views/DealsManagementView'
import { LootDealsView } from './manager/views/LootDealsView'
import { CouponsView } from './manager/views/CouponsView'
import { CategoriesView } from './manager/views/CategoriesView'
import { StoresView } from './manager/views/StoresView'
import { UsersView } from './manager/views/UsersView'
import { WalletLedgerView } from './manager/views/WalletLedgerView'

// Modals
import { AddDealModal } from './manager/modals/AddDealModal'
import { AddCouponModal } from './manager/modals/AddCouponModal'
import { AddStaffModal } from './manager/modals/AddStaffModal'
import { EditStaffModal } from './manager/modals/EditStaffModal'
import { BulkDataImportModal, type BulkImportModule } from './manager/modals/BulkDataImportModal'

export const AdminDashboardPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Core Datasets
  const [deals, setDeals] = useState<DealItem[]>([])
  const [coupons, setCoupons] = useState<CouponItem[]>([])
  const [lootDeals, setLootDeals] = useState<LootDealAdminItem[]>([])
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [stores, setStores] = useState<StoreItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffItem[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true)
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(0)

  // Bulk Import state
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [bulkImportModule, setBulkImportModule] = useState<BulkImportModule>('deals')

  const handleOpenBulkImport = (mod: BulkImportModule) => {
    setBulkImportModule(mod)
    setIsBulkImportOpen(true)
  }

  const handleBulkImportSuccess = async (mod: BulkImportModule, count: number) => {
    showToast(`Successfully imported & scheduled ${count} ${mod.toUpperCase()} records to MongoDB Atlas! 🚀`)
    try {
      if (mod === 'deals') {
        const liveDeals = await adminApi.getDeals({ all: true })
        if (Array.isArray(liveDeals)) setDeals(liveDeals)
      } else if (mod === 'loot') {
        const liveLoot = await adminApi.getLootDeals({ all: true })
        if (Array.isArray(liveLoot)) setLootDeals(liveLoot)
      } else if (mod === 'coupons') {
        const liveCoupons = await adminApi.getCoupons({ all: true })
        if (Array.isArray(liveCoupons)) setCoupons(liveCoupons)
      } else if (mod === 'stores') {
        const liveStores = await adminApi.getStores({ all: true })
        if (Array.isArray(liveStores)) setStores(liveStores)
      }
    } catch (err) {
      console.warn('Failed to refresh data after bulk import:', err)
    }
  }

  // Load live data from Backend API on mount
  useEffect(() => {
    let isMounted = true
    const fetchLiveData = async () => {
      try {
        const [dealsRes, couponsRes, lootRes, txnsRes, storesRes, catsRes, usersRes, staffRes, pendingStoresRes, pendingCouponsRes] = await Promise.allSettled([
          adminApi.getDeals(),
          adminApi.getCoupons(),
          adminApi.getLootDeals(),
          adminApi.getTransactions(),
          adminApi.getStores(),
          adminApi.getCategories(),
          adminApi.getUsers(),
          adminApi.getStaffMembers(),
          adminApi.getManagerPendingStores(),
          adminApi.getManagerPendingCoupons()
        ])
        if (!isMounted) return

        if (dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value)) {
          setDeals(dealsRes.value)
        }
        if (couponsRes.status === 'fulfilled' && Array.isArray(couponsRes.value)) {
          setCoupons(couponsRes.value)
        }
        if (lootRes.status === 'fulfilled' && Array.isArray(lootRes.value)) {
          setLootDeals(lootRes.value)
        }
        if (txnsRes.status === 'fulfilled' && Array.isArray(txnsRes.value)) {
          setTransactions(txnsRes.value)
        }
        if (storesRes.status === 'fulfilled' && Array.isArray(storesRes.value)) {
          setStores(storesRes.value)
        }
        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
          setCategories(catsRes.value)
        }
        if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
          setUsers(usersRes.value)
        }
        if (staffRes.status === 'fulfilled' && Array.isArray(staffRes.value)) {
          setStaffMembers(staffRes.value)
        }
        
        let managerCount = 0
        if (pendingStoresRes.status === 'fulfilled' && Array.isArray(pendingStoresRes.value)) {
          managerCount += pendingStoresRes.value.length
        }
        if (pendingCouponsRes.status === 'fulfilled' && Array.isArray(pendingCouponsRes.value)) {
          managerCount += pendingCouponsRes.value.length
        }
        setPendingApprovalsCount(managerCount)

        setIsBackendConnected(true)
      } catch (err) {
        if (isMounted) setIsBackendConnected(false)
      }
    }
    fetchLiveData()
    return () => { isMounted = false }
  }, [])

  const [algoConfig, setAlgoConfig] = useState<AlgorithmConfig>({
    trendingWeight: 1.5,
    flashLootBoost: 2.0,
    sponsoredBoost: 1.25,
    minDiscountThreshold: 20,
    activeCampaignName: 'Diwali Mega Cashback Bonanza',
    campaignTheme: 'Diwali Bonanza'
  })
  const [auditLogs, setAuditLogs] = useState<GovernanceAuditLog[]>(INITIAL_GOVERNANCE_LOGS)

  // Filters
  const [dealCategoryFilter, setDealCategoryFilter] = useState('All')
  const [dealStatusFilter, setDealStatusFilter] = useState('All')
  const [lootDealTypeFilter, setLootDealTypeFilter] = useState<'All' | 'flash' | 'exclusive'>('All')
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('All')
  const [staffRoleFilter, setStaffRoleFilter] = useState<'all' | 'executive' | 'operational_manager' | 'manager'>('all')
  const [staffStatusFilter, setStaffStatusFilter] = useState<string>('all')

  // Modals
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false)
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false)
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Form states
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'executive' as 'executive' | 'operational_manager' | 'manager',
    domain: 'Deals & Loot Deals',
    password: 'staff123',
    status: 'Online' as 'Online' | 'Away' | 'Offline'
  })

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
    discount: '20% OFF',
    expiry: 'Sep 30, 2026',
    status: 'active',
    productImage: '',
    ctaText: 'Grab Deal',
    ctaHref: 'https://amazon.in',
    dealTag: 'Trending',
    isBestSelling: true,
    sectionPlacement: 'both'
  })

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    store: 'Amazon',
    discount: '20% OFF',
    category: 'Electronics',
    usageLimit: 1000,
    expiry: 'Oct 31, 2026'
  })

  const [adminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('adminUser')
      return stored ? JSON.parse(stored) : { email: 'manager@wouchify.com', role: 'manager' }
    } catch {
      return { email: 'manager@wouchify.com', role: 'manager' }
    }
  })

  // Persist staff members
  useEffect(() => {
    localStorage.setItem('wouchify_staff_members', JSON.stringify(staffMembers))
  }, [staffMembers])

  // Sync deals with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wouchify_public_deals', JSON.stringify(deals))
      window.dispatchEvent(new Event('wouchify_deals_updated'))
    } catch {}
  }, [deals])

  // Computed Live Stats
  const liveStats = useMemo(() => {
    const totalUsers = users.length
    const activeDealsCount = deals.filter((d) => d.status === 'active').length
    const activeCouponsCount = coupons.filter((c) => c.status === 'active').length
    const activeLootCount = lootDeals.filter((l) => l.status === 'active').length
    const onlineStaffCount = staffMembers.filter((s) => s.status === 'Online').length
    
    // Sum real transactions
    const totalTxnAmount = transactions.reduce((sum, t) => {
      const num = parseInt(t.amount.replace(/[^0-9]/g, '')) || 0
      return sum + num
    }, 0)
    const disbursed = totalTxnAmount > 0 ? `₹${totalTxnAmount.toLocaleString('en-IN')}` : '₹0'

    return {
      totalUsers,
      activeDealsCount,
      activeCouponsCount,
      activeLootCount,
      staffCount: staffMembers.length,
      onlineStaffCount,
      disbursedCashback: disbursed,
      systemHealth: isBackendConnected ? '100% Operational' : 'Offline Mode'
    }
  }, [deals, coupons, lootDeals, users, staffMembers, transactions, isBackendConnected])

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3200)
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'deal' | 'loot' | 'staff'
    id: number | string
    title: string
    message: string
    confirmLabel: string
  } | null>(null)

  // Action Handlers
  const handleToggleDealStatus = (id: number | string) => {
    const updated = deals.map((d) => {
      if (d.id === id) {
        return { ...d, status: (d.status === 'active' ? 'pending' : 'active') as 'active' | 'pending' | 'expired' }
      }
      return d
    })
    setDeals(updated)
    try {
      adminApi.toggleDealStatus(String(id))
    } catch {}
    showToast('Deal status updated!')
  }

  const handleDeleteDeal = (id: number | string) => {
    setDeleteConfirm({
      type: 'deal',
      id,
      title: 'Delete Promotional Deal',
      message: 'Are you sure you want to permanently delete this deal from the platform?',
      confirmLabel: 'Delete Deal'
    })
  }

  const handleToggleLootDealStatus = (id: number | string) => {
    const updated = lootDeals.map((ld) => {
      if (ld.id === id) {
        return { ...ld, status: (ld.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
      }
      return ld
    })
    setLootDeals(updated)
    try {
      adminApi.toggleLootDealStatus(String(id))
    } catch {}
    showToast('Loot deal visibility toggled!')
  }

  const handleDeleteLootDeal = (id: number | string) => {
    setDeleteConfirm({
      type: 'loot',
      id,
      title: 'Delete Loot Drop',
      message: 'Are you sure you want to permanently delete this loot deal?',
      confirmLabel: 'Delete Loot Deal'
    })
  }

  const handleToggleStaffStatus = async (id: string) => {
    const statusCycle: ('Online' | 'Away' | 'Offline')[] = ['Online', 'Away', 'Offline']
    const member = staffMembers.find((s) => (s.id && s.id === id) || (s._id && s._id === id))
    const currIdx = member ? statusCycle.indexOf(member.status as any) : 0
    const nextStatus = statusCycle[(currIdx + 1) % statusCycle.length]

    setStaffMembers((prev) =>
      prev.map((s) => {
        if ((s.id && s.id === id) || (s._id && s._id === id)) {
          return { ...s, status: nextStatus }
        }
        return s
      })
    )
    try {
      await adminApi.toggleStaffStatus(id, nextStatus)
    } catch (err) {
      console.warn('Failed to persist staff status:', err)
    }
    showToast(`Staff status updated to ${nextStatus}.`)
  }

  const handleDeleteStaff = (id: string) => {
    setDeleteConfirm({
      type: 'staff',
      id,
      title: 'Remove Staff Account',
      message: 'Are you sure you want to deactivate and remove this staff account?',
      confirmLabel: 'Remove Staff'
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return
    const { type, id } = deleteConfirm
    if (type === 'deal') {
      const updated = deals.filter((d) => d.id !== id)
      setDeals(updated)
      try {
        adminApi.deleteDeal(String(id))
      } catch {}
      showToast('Deal deleted from platform.')
    } else if (type === 'loot') {
      const updated = lootDeals.filter((ld) => ld.id !== id)
      setLootDeals(updated)
      try {
        adminApi.deleteLootDeal(String(id))
      } catch {}
      showToast('Loot deal deleted.')
    } else if (type === 'staff') {
      setStaffMembers((prev) => prev.filter((s) => s.id !== id && s._id !== id))
      try {
        await adminApi.deleteStaffMember(String(id))
      } catch (err) {
        console.warn('Failed to delete staff member on server:', err)
      }
      showToast('Staff account deactivated.')
    }
    setDeleteConfirm(null)
  }

  const handleApproveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
    )
    try {
      adminApi.approveTransaction(id)
    } catch {}
    showToast(`Transaction ${id} marked as Completed & Disbursed!`)
  }

  const handleTriggerDatabaseBackup = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      platform: 'Wouchify Desktop Master DB',
      deals,
      coupons,
      lootDeals,
      staffMembers,
      algoConfig,
      auditLogs,
      transactions,
      users
    }
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wouchify-db-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    const newLog: GovernanceAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Manager (manager@wouchify.com)',
      role: 'System Manager',
      event: 'Manual Database Backup Triggered',
      riskLevel: 'Low',
      details: 'Exported full JSON snapshot containing all deals, coupons, staff, and transaction data.'
    }
    setAuditLogs([newLog, ...auditLogs])
    showToast('Database backup snapshot generated and downloaded!')
  }

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.name.trim() || !newStaff.email.trim()) return

    const staffPayload = {
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      role: newStaff.role,
      domain: newStaff.domain.trim() || (newStaff.role === 'operational_manager' ? 'Approvals & QA' : 'Deals & Loot Deals'),
      password: newStaff.password || 'staff123',
      status: newStaff.status
    }

    let createdStaff: StaffItem
    try {
      const serverCreated = await adminApi.createStaffMember(staffPayload)
      if (serverCreated && (serverCreated._id || serverCreated.id)) {
        createdStaff = serverCreated
      } else {
        createdStaff = {
          id: `staff-${Date.now()}`,
          _id: `staff-${Date.now()}`,
          ...staffPayload,
          submissionsToday: 0,
          totalSubmissions: 0,
          approvalRate: '100%',
          rejectionsCount: 0,
          avgTurnaround: '10m',
          createdAt: new Date().toISOString()
        }
      }
    } catch (err) {
      console.warn('Backend staff creation fallback:', err)
      createdStaff = {
        id: `staff-${Date.now()}`,
        _id: `staff-${Date.now()}`,
        ...staffPayload,
        submissionsToday: 0,
        totalSubmissions: 0,
        approvalRate: '100%',
        rejectionsCount: 0,
        avgTurnaround: '10m',
        createdAt: new Date().toISOString()
      }
    }

    const updated = [createdStaff, ...staffMembers]
    setStaffMembers(updated)
    setIsAddStaffModalOpen(false)
    setNewStaff({
      name: '',
      email: '',
      role: 'executive',
      domain: 'Deals & Loot Deals',
      password: 'staff123',
      status: 'Online'
    })

    const newLog: GovernanceAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Manager (manager@wouchify.com)',
      role: 'System Manager',
      event: 'Staff Access Provisioned',
      riskLevel: 'Medium',
      details: `Provisioned new ${createdStaff.role} account for ${createdStaff.name} (${createdStaff.email}).`
    }
    setAuditLogs([newLog, ...auditLogs])
    showToast(`Staff member ${createdStaff.name} successfully registered in MongoDB!`)
  }

  const handleEditStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStaff) return

    const targetId = editingStaff._id || editingStaff.id
    try {
      await adminApi.updateStaffMember(String(targetId), editingStaff)
    } catch (err) {
      console.warn('Failed to update staff on server:', err)
    }

    setStaffMembers((prev) =>
      prev.map((s) => (s.id === editingStaff.id || s._id === editingStaff._id ? editingStaff : s))
    )
    setEditingStaff(null)
    showToast(`Staff profile for ${editingStaff.name} updated!`)
  }

  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeal.name || !newDeal.price) return

    const created: DealItem = {
      id: Date.now(),
      name: newDeal.name,
      store: newDeal.store,
      category: newDeal.category,
      price: newDeal.price.startsWith('₹') ? newDeal.price : `₹${newDeal.price}`,
      originalPrice: newDeal.originalPrice ? (newDeal.originalPrice.startsWith('₹') ? newDeal.originalPrice : `₹${newDeal.originalPrice}`) : '',
      discount: newDeal.discount || 'Special Offer',
      status: newDeal.status,
      expiry: newDeal.expiry || 'Sep 30, 2026',
      productImage: newDeal.productImage || '',
      ctaText: newDeal.ctaText || 'Grab Deal',
      ctaHref: newDeal.ctaHref || 'https://amazon.in',
      dealTag: newDeal.dealTag || 'Trending',
      isBestSelling: newDeal.isBestSelling,
      sectionPlacement: newDeal.sectionPlacement
    }

    setDeals([created, ...deals])
    setIsAddDealModalOpen(false)
    setNewDeal({
      name: '',
      store: 'Amazon',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      discount: '20% OFF',
      expiry: 'Sep 30, 2026',
      status: 'active',
      productImage: '',
      ctaText: 'Grab Deal',
      ctaHref: 'https://amazon.in',
      dealTag: 'Trending',
      isBestSelling: true,
      sectionPlacement: 'both'
    })
    try {
      adminApi.createDeal(created)
    } catch {}
    showToast('New deal published live across the Wouchify platform!')
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
    } catch {}
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.history.pushState({}, '', '/manager/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    showToast(`Code "${text}" copied to clipboard!`)
    window.setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStoreLogo = (storeName: string): string | null => {
    const s = stores.find(
      (item) => item.name.toLowerCase().trim() === storeName.toLowerCase().trim()
    )
    if (s && s.logo) return s.logo
    const orig = FAVOURITE_STORES.find(
      (item) => item.name.toLowerCase().trim() === storeName.toLowerCase().trim()
    )
    return orig ? orig.logo : null
  }

  // Filtered Datasets
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
    return stores.filter((s) => {
      return (
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [stores, searchQuery])

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      return (
        searchQuery.trim() === '' ||
        (cat.name && cat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  }, [categories, searchQuery])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return (
        searchQuery.trim() === '' ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [users, searchQuery])

  const filteredLootDeals = useMemo(() => {
    return lootDeals.filter((ld) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        ld.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ld.storeName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = lootDealTypeFilter === 'All' || ld.dealType === lootDealTypeFilter
      return matchesSearch && matchesType
    })
  }, [lootDeals, searchQuery, lootDealTypeFilter])

  const filteredStaffMembers = useMemo(() => {
    return staffMembers.filter((s) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.domain && s.domain.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRole = staffRoleFilter === 'all' || s.role === staffRoleFilter
      const matchesStatus = staffStatusFilter === 'all' || s.status === staffStatusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staffMembers, searchQuery, staffRoleFilter, staffStatusFilter])

  // Navigation Items
  const navItems = [
    { key: 'dashboard', label: 'Commercial Analytics', icon: <IconDashboard />, badge: null },
    { key: 'approvals', label: 'Manager Approvals', icon: <IconCheck />, badge: pendingApprovalsCount },
    { key: 'staff', label: 'Staff & Team (RBAC)', icon: <IconStaff />, badge: staffMembers.length },
    { key: 'algorithms', label: 'Layout & Algorithm Config', icon: <IconAlgorithm />, badge: null },
    { key: 'governance', label: 'Data Governance & Audit', icon: <IconShield />, badge: auditLogs.length },
    { key: 'deals', label: 'Deals Management', icon: <IconDeals />, badge: deals.length },
    { key: 'loot-deals', label: 'Loot Deals Studio', icon: <IconFlame />, badge: lootDeals.length },
    { key: 'coupons', label: 'Verified Coupons', icon: <IconCoupons />, badge: coupons.length },
    { key: 'categories', label: 'Categories Studio', icon: <IconCategories />, badge: categories.length },
    { key: 'stores', label: 'Partner Stores', icon: <IconStores />, badge: stores.length },
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

      {/* ── Sidebar (275px wide, Deep Navy Wouchify Gradient) ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper">
            <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-logo-card" title="View Live Storefront">
              <img src={wouchifyLogo} alt="Wouchify" className="sidebar-brand-logo" />
            </a>
            {sidebarOpen && (
              <span className="sidebar-studio-badge">
                Manager Studio
              </span>
            )}
          </div>
          <button
            className="sidebar-mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>✕</span>
          </button>
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
          <div className="nav-section-label">{sidebarOpen && 'Administration & Platform'}</div>
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

          <button className="nav-item logout-btn" onClick={handleLogout} title="Sign out of Manager Console">
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
                    : activeNav === 'staff'
                    ? 'Search staff members by name, email, or domain...'
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
                {(adminUser.email || 'M')[0].toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">Manager</span>
                <span className="user-email">{adminUser.email || 'manager@wouchify.com'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <main className="admin-content">
          {/* Section Breadcrumbs / Header */}
          <div className="content-header">
            <div className="content-heading-group">
              <div>
                <h1>
                  {activeNav === 'dashboard' && 'Commercial Performance & Analytics'}
                  {activeNav === 'approvals' && 'Manager Approvals Queue'}
                  {activeNav === 'staff' && 'Staff & Team Access Studio (RBAC)'}
                  {activeNav === 'algorithms' && 'Global Layout & Algorithm Configuration'}
                  {activeNav === 'governance' && 'Data Governance & System Security'}
                  {activeNav === 'deals' && 'Deals Management Studio'}
                  {activeNav === 'loot-deals' && 'Loot & Flash Deals Studio'}
                  {activeNav === 'coupons' && 'Verified Coupons Hub'}
                  {activeNav === 'categories' && 'Categories & Taxonomy Studio'}
                  {activeNav === 'stores' && 'Partner Stores Directory'}
                  {activeNav === 'users' && 'User Accounts & Wallets'}
                  {activeNav === 'wallet' && 'Cashback & Financial Ledger'}
                </h1>
                <p>
                  {activeNav === 'dashboard' && 'Aggregated commercial metrics, outbound click-through rates (CTR), revenue generated per merchant, and traffic analytics.'}
                  {activeNav === 'approvals' && 'Review operations-approved items and publish them to live.'}
                  {activeNav === 'staff' && 'Provision, deactivate, and manage operational managers and content executives with assigned vertical permissions.'}
                  {activeNav === 'algorithms' && 'Fine-tune homepage recommendation formulas, trending deal boost multipliers, and scheduled event campaigns.'}
                  {activeNav === 'governance' && 'System-wide audit trail for high-risk actions, manual database snapshot triggering, and full catalog JSON/CSV exports.'}
                  {activeNav === 'deals' && 'Create, edit, feature, and control promotional discount offers visible on the live storefront.'}
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

              {activeNav === 'deals' ? (
                <button className="btn-primary" onClick={() => setIsAddDealModalOpen(true)}>
                  <IconPlus />
                  <span>Add New Deal</span>
                </button>
              ) : activeNav === 'staff' ? (
                <button className="btn-primary" onClick={() => setIsAddStaffModalOpen(true)}>
                  <IconPlus />
                  <span>Create Staff Member</span>
                </button>
              ) : activeNav === 'governance' ? (
                <button className="btn-primary" onClick={handleTriggerDatabaseBackup}>
                  <IconDownload />
                  <span>Trigger DB Backup</span>
                </button>
              ) : activeNav === 'coupons' ? (
                <button className="btn-primary" onClick={() => setIsAddCouponModalOpen(true)}>
                  <IconPlus />
                  <span>Create Coupon</span>
                </button>
              ) : (
                <a href="/" target="_blank" className="btn-primary" rel="noreferrer">
                  <IconExternal />
                  <span>Browse Storefront</span>
                </a>
              )}
            </div>
          </div>

          {/* Render Active View Subcomponent */}
          {activeNav === 'approvals' && (
            <AdminApprovalsView />
          )}
          {activeNav === 'dashboard' && (
            <CommercialAnalyticsView
              liveStats={liveStats}
              stores={stores}
              deals={deals}
              coupons={coupons}
              transactions={transactions}
            />
          )}

          {activeNav === 'staff' && (
            <StaffManagementView
              staffMembers={staffMembers}
              filteredStaffMembers={filteredStaffMembers}
              staffRoleFilter={staffRoleFilter}
              setStaffRoleFilter={setStaffRoleFilter}
              staffStatusFilter={staffStatusFilter}
              setStaffStatusFilter={setStaffStatusFilter}
              onToggleStaffStatus={handleToggleStaffStatus}
              onEditStaff={setEditingStaff}
              onDeleteStaff={handleDeleteStaff}
            />
          )}

          {activeNav === 'algorithms' && (
            <AlgorithmConfigView
              algoConfig={algoConfig}
              setAlgoConfig={setAlgoConfig}
              onPublishAlgorithms={() => showToast('Algorithm weights and festival campaign published live!')}
            />
          )}

          {activeNav === 'governance' && (
            <DataGovernanceView
              auditLogs={auditLogs}
              totalCatalogCount={deals.length + coupons.length + lootDeals.length}
              onTriggerBackup={handleTriggerDatabaseBackup}
            />
          )}

          {activeNav === 'deals' && (
            <DealsManagementView
              deals={deals}
              filteredDeals={filteredDeals}
              dealCategoryFilter={dealCategoryFilter}
              setDealCategoryFilter={setDealCategoryFilter}
              dealStatusFilter={dealStatusFilter}
              setDealStatusFilter={setDealStatusFilter}
              onToggleDealStatus={handleToggleDealStatus}
              onDeleteDeal={handleDeleteDeal}
              getStoreLogo={getStoreLogo}
              onOpenBulkImport={() => handleOpenBulkImport('deals')}
            />
          )}

          {activeNav === 'loot-deals' && (
            <LootDealsView
              filteredLootDeals={filteredLootDeals}
              lootDealTypeFilter={lootDealTypeFilter}
              setLootDealTypeFilter={setLootDealTypeFilter}
              onToggleLootDealStatus={handleToggleLootDealStatus}
              onDeleteLootDeal={handleDeleteLootDeal}
              onOpenBulkImport={() => handleOpenBulkImport('loot')}
            />
          )}

          {activeNav === 'coupons' && (
            <CouponsView
              filteredCoupons={filteredCoupons}
              copiedCode={copiedCode}
              onCopyCode={copyToClipboard}
              onOpenBulkImport={() => handleOpenBulkImport('coupons')}
            />
          )}

          {activeNav === 'categories' && (
            <CategoriesView filteredCategories={filteredCategories} />
          )}

          {activeNav === 'stores' && (
            <StoresView
              filteredStores={filteredStores}
              onOpenBulkImport={() => handleOpenBulkImport('stores')}
            />
          )}

          {activeNav === 'users' && (
            <UsersView filteredUsers={filteredUsers} />
          )}

          {activeNav === 'wallet' && (
            <WalletLedgerView
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              transactionTypeFilter={transactionTypeFilter}
              setTransactionTypeFilter={setTransactionTypeFilter}
              onExportCSV={exportCSVReport}
              onApproveTransaction={handleApproveTransaction}
            />
          )}
        </main>
      </div>

      {/* ── Subcomponent Modals ── */}
      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onSubmit={handleAddDealSubmit}
        newDeal={newDeal}
        setNewDeal={setNewDeal}
      />

      <AddCouponModal
        isOpen={isAddCouponModalOpen}
        onClose={() => setIsAddCouponModalOpen(false)}
        onSubmit={handleAddCouponSubmit}
        newCoupon={newCoupon}
        setNewCoupon={setNewCoupon}
      />

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSubmit={handleAddStaffSubmit}
        newStaff={newStaff}
        setNewStaff={setNewStaff}
      />

      <EditStaffModal
        editingStaff={editingStaff}
        onClose={() => setEditingStaff(null)}
        onSubmit={handleEditStaffSubmit}
        setEditingStaff={setEditingStaff}
      />

      {/* ── Bulk Data Import & Scheduled Publishing Modal ── */}
      <BulkDataImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        initialModule={bulkImportModule}
        onImportSuccess={handleBulkImportSuccess}
      />

      {/* ── CUSTOM CONFIRM DIALOG ── */}
      {deleteConfirm && (
        <AdminConfirmDialog
          isOpen={!!deleteConfirm}
          title={deleteConfirm.title}
          message={deleteConfirm.message}
          confirmLabel={deleteConfirm.confirmLabel}
          cancelLabel="Cancel"
          variant="danger"
          icon="trash"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboardPage
