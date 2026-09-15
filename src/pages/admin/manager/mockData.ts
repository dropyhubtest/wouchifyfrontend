import { FLASH_LOOT_DEALS, type FlashLootDealItem } from '../../../data/flashLootDeals'
import { EXCLUSIVE_LOOT_DEALS, type ExclusiveLootDealItem } from '../../../data/exclusiveLootDeals'
import type {
  StaffItem,
  AffiliateNetworkItem,
  GovernanceAuditLog,
  LootDealAdminItem,
  DealItem,
  CouponItem,
  TransactionItem,
  UserItem
} from './types'

export const INITIAL_STAFF: StaffItem[] = [
  {
    id: 'staff-balaji',
    _id: 'staff-balaji',
    name: 'Balaji',
    email: 'balaji@wouchify.com',
    role: 'executive',
    domain: 'Deals & Loot Deals',
    status: 'Online',
    submissionsToday: 12,
    totalSubmissions: 145,
    approvalRate: '98%',
    rejectionsCount: 3,
    avgTurnaround: '10m',
    createdAt: '2026-06-01T00:00:00.000Z'
  },
  {
    id: 'staff-jayanth',
    _id: 'staff-jayanth',
    name: 'Jayanth',
    email: 'jayanth@wouchify.com',
    role: 'executive',
    domain: 'Coupons & Credit Cards',
    status: 'Online',
    submissionsToday: 9,
    totalSubmissions: 120,
    approvalRate: '97%',
    rejectionsCount: 4,
    avgTurnaround: '12m',
    createdAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'staff-ops-manager',
    _id: 'staff-ops-manager',
    name: 'Operational Manager',
    email: 'ops.manager@wouchify.com',
    role: 'operational_manager',
    domain: 'Approvals & Quality Assurance',
    status: 'Online',
    submissionsToday: 21,
    totalSubmissions: 580,
    approvalRate: '99%',
    rejectionsCount: 7,
    avgTurnaround: '8m',
    createdAt: '2026-05-01T00:00:00.000Z'
  },
  {
    id: 'staff-manager',
    _id: 'staff-manager',
    name: 'Manager',
    email: 'manager@wouchify.com',
    role: 'manager',
    domain: 'Platform Administration & Team Management',
    status: 'Online',
    submissionsToday: 0,
    totalSubmissions: 940,
    approvalRate: '100%',
    rejectionsCount: 0,
    avgTurnaround: '5m',
    createdAt: '2026-04-01T00:00:00.000Z'
  }
]

export const INITIAL_AFFILIATES: AffiliateNetworkItem[] = [
  {
    id: 'net-1',
    name: 'CueLinks Network',
    tag: 'cuelinks',
    apiKey: 'cue_live_98a76d54f3e2b1c0',
    subId: 'wouchify_sub_main',
    postbackUrl: 'https://wouchify.com/api/postback/cuelinks',
    defaultCommission: '8.5% RevShare',
    status: 'Connected',
    totalClicks: 42800,
    estEarnings: '₹1,84,500'
  },
  {
    id: 'net-2',
    name: 'Amazon Associates India',
    tag: 'amazon_aff',
    apiKey: 'amz_assoc_wouchify-21',
    subId: 'wouchify-21',
    postbackUrl: 'https://wouchify.com/api/postback/amazon',
    defaultCommission: 'Up to 9.0%',
    status: 'Connected',
    totalClicks: 89400,
    estEarnings: '₹4,12,000'
  },
  {
    id: 'net-3',
    name: 'Impact Radius Global',
    tag: 'impact',
    apiKey: 'imp_sec_3498bfe19ac77021',
    subId: 'wouchify_imp_track',
    postbackUrl: 'https://wouchify.com/api/postback/impact',
    defaultCommission: '12.0% Fixed CPA',
    status: 'Connected',
    totalClicks: 21500,
    estEarnings: '₹95,200'
  },
  {
    id: 'net-4',
    name: 'vCommission Media',
    tag: 'vcom',
    apiKey: 'vcom_live_7726cb314',
    subId: 'wouch_vcom_01',
    postbackUrl: 'https://wouchify.com/api/postback/vcom',
    defaultCommission: '7.0% Tier 1',
    status: 'Connected',
    totalClicks: 16200,
    estEarnings: '₹68,400'
  }
]

export const INITIAL_GOVERNANCE_LOGS: GovernanceAuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '10 mins ago',
    actor: 'Manager (manager@wouchify.com)',
    role: 'System Manager',
    event: 'Staff Access Provisioned',
    riskLevel: 'Low',
    details: 'Provisioned Content Executive role for Jayanth (jayanth@wouchify.com).'
  },
  {
    id: 'aud-102',
    timestamp: '45 mins ago',
    actor: 'Manager (manager@wouchify.com)',
    role: 'System Manager',
    event: 'Affiliate API Key Rotated',
    riskLevel: 'Medium',
    details: 'Rotated CueLinks production tracking token subID: wouchify_sub_main.'
  },
  {
    id: 'aud-103',
    timestamp: '2 hours ago',
    actor: 'Operational Manager',
    role: 'Ops Manager',
    event: 'Moderation Batch Approval',
    riskLevel: 'Low',
    details: 'Batch approved 12 deals submitted by Balaji (balaji@wouchify.com).'
  },
  {
    id: 'aud-104',
    timestamp: '5 hours ago',
    actor: 'System Automation',
    role: 'Database Daemon',
    event: 'Daily Cold Snapshot Backup',
    riskLevel: 'Low',
    details: 'Automated disk snapshot saved to /data/dev_store.json (1.4MB).'
  }
]

export const INITIAL_LOOT_DEALS: LootDealAdminItem[] = [
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

export const INITIAL_DEALS: DealItem[] = [
  { id: 'deal-1', name: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN', store: 'Amazon', category: 'Electronics', price: '₹37,998', originalPrice: '₹62,999', discount: '40% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 10, name: 'Milton Rapid Electric Kettle 1.8L [Trending]', store: 'Amazon', category: 'Electronics', price: '₹604', originalPrice: '₹1,499', discount: '60% OFF', status: 'active', expiry: 'Sep 28, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 1, name: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium', store: 'Amazon', category: 'Electronics', price: '₹1,19,900', originalPrice: '₹1,34,900', discount: '11% OFF', status: 'active', expiry: 'Sep 25, 2026', isBestSelling: true, sectionPlacement: 'best_selling' },
  { id: 2, name: 'Nike Air Max Men Sneaker Shoes', store: 'Myntra', category: 'Fashion', price: '₹5,499', originalPrice: '₹9,995', discount: '45% OFF', status: 'active', expiry: 'Sep 18, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 3, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', store: 'Flipkart', category: 'Electronics', price: '₹26,990', originalPrice: '₹34,990', discount: '23% OFF', status: 'active', expiry: 'Sep 22, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 4, name: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders', store: 'Swiggy', category: 'Food', price: '₹250', originalPrice: '₹500', discount: '50% OFF', status: 'pending', expiry: 'Sep 12, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 5, name: 'Zomato Gold 12-Month Dining Membership', store: 'Zomato', category: 'Food', price: '₹499', originalPrice: '₹999', discount: '50% OFF', status: 'expired', expiry: 'Sep 02, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 6, name: 'Nykaa Beauty Mega Sale - MAC & Clinique Combos', store: 'Nykaa', category: 'Beauty', price: '₹1,890', originalPrice: '₹3,500', discount: '46% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 7, name: 'Fresh Organic Produce Combo Pack (5kg)', store: 'Big Basket', category: 'Grocery', price: '₹399', originalPrice: '₹650', discount: '38% OFF', status: 'active', expiry: 'Sep 15, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { id: 8, name: 'Boat Airdopes 141 ANC with 42H Playtime', store: 'Amazon', category: 'Electronics', price: '₹1,299', originalPrice: '₹4,490', discount: '71% OFF', status: 'active', expiry: 'Sep 24, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { id: 9, name: 'Lakme Absolute Skin Gloss Gel Creme 50g', store: 'Nykaa', category: 'Beauty', price: '₹475', originalPrice: '₹650', discount: '27% OFF', status: 'active', expiry: 'Sep 29, 2026', isBestSelling: false, sectionPlacement: 'favourite' }
]

export const INITIAL_COUPONS: CouponItem[] = [
  { id: 1, code: 'AMAZON10', store: 'Amazon', discount: '10% OFF', category: 'Electronics', usageCount: 2840, usageLimit: 5000, status: 'active', expiry: 'Sep 18, 2026' },
  { id: 2, code: 'MYNTRA20', store: 'Myntra', discount: '20% OFF', category: 'Fashion', usageCount: 419, usageLimit: 500, status: 'active', expiry: 'Sep 25, 2026' },
  { id: 3, code: 'FLIPKART15', store: 'Flipkart', discount: '15% OFF', category: 'Electronics', usageCount: 3950, usageLimit: 8000, status: 'active', expiry: 'Sep 28, 2026' },
  { id: 4, code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', usageCount: 934, usageLimit: 2000, status: 'active', expiry: 'Oct 15, 2026' },
  { id: 5, code: 'ZOMATOEATS', store: 'Zomato', discount: '60% OFF', category: 'Food', usageCount: 1540, usageLimit: 2000, status: 'active', expiry: 'Sep 20, 2026' },
  { id: 6, code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 OFF', category: 'Fashion', usageCount: 312, usageLimit: 800, status: 'active', expiry: 'Sep 28, 2026' }
]

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: 'TXN-8491', user: 'Rahul Sharma', email: 'rahul.s@gmail.com', type: 'Cashback', amount: '₹1,240', status: 'Completed', time: '2 mins ago' },
  { id: 'TXN-8490', user: 'Priya Patel', email: 'priya.p@outlook.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '14 mins ago' },
  { id: 'TXN-8489', user: 'Vikram Mehta', email: 'vikram.m@yahoo.com', type: 'Referral', amount: '₹150', status: 'Completed', time: '1 hour ago' },
  { id: 'TXN-8488', user: 'Ananya Roy', email: 'ananya.roy@gmail.com', type: 'Cashback', amount: '₹890', status: 'Completed', time: '2 hours ago' },
  { id: 'TXN-8487', user: 'Suresh Iyer', email: 'suresh.i@gmail.com', type: 'Redemption', amount: '₹2,000', status: 'Processing', time: '3 hours ago' },
  { id: 'TXN-8486', user: 'Divya Nair', email: 'divya.n@gmail.com', type: 'Cashback', amount: '₹340', status: 'Completed', time: '5 hours ago' },
  { id: 'TXN-8485', user: 'Arjun Das', email: 'arjun.das@gmail.com', type: 'Referral', amount: '₹300', status: 'Completed', time: '6 hours ago' }
]

export const INITIAL_USERS: UserItem[] = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@gmail.com', walletBalance: '₹3,420', totalCashback: '₹14,500', joinedDate: 'Jan 15, 2026', status: 'verified' },
  { id: 2, name: 'Priya Patel', email: 'priya.p@outlook.com', walletBalance: '₹890', totalCashback: '₹8,200', joinedDate: 'Feb 03, 2026', status: 'active' },
  { id: 3, name: 'Vikram Mehta', email: 'vikram.m@yahoo.com', walletBalance: '₹150', totalCashback: '₹3,400', joinedDate: 'Mar 12, 2026', status: 'active' },
  { id: 4, name: 'Ananya Roy', email: 'ananya.roy@gmail.com', walletBalance: '₹1,240', totalCashback: '₹19,800', joinedDate: 'Dec 20, 2025', status: 'verified' },
  { id: 5, name: 'Suresh Iyer', email: 'suresh.i@gmail.com', walletBalance: '₹4,500', totalCashback: '₹27,300', joinedDate: 'Nov 11, 2025', status: 'verified' },
  { id: 6, name: 'Divya Nair', email: 'divya.n@gmail.com', walletBalance: '₹0', totalCashback: '₹1,200', joinedDate: 'Apr 05, 2026', status: 'suspended' }
]
