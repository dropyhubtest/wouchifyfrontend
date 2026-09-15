export interface StaffItem {
  id: string
  _id?: string
  name: string
  email: string
  role: 'executive' | 'operational_manager' | 'manager'
  domain?: string
  status: 'Online' | 'Away' | 'Offline'
  submissionsToday?: number
  totalSubmissions?: number
  approvalRate?: string
  rejectionsCount?: number
  avgTurnaround?: string
  password?: string
  createdAt?: string
}

export interface DealItem {
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

export interface CouponItem {
  id: number | string
  code: string
  store: string
  discount: string
  category: string
  usageCount: number
  usageLimit: number
  status: 'active' | 'expired'
  expiry: string
}

export interface LootDealAdminItem {
  id: number | string
  _id?: string
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

export interface TransactionItem {
  id: string
  user: string
  email: string
  type: string
  amount: string
  status: 'Completed' | 'Pending' | 'Processing'
  time: string
}

export interface UserItem {
  id: number
  name: string
  email: string
  walletBalance: string
  totalCashback: string
  joinedDate: string
  status: 'active' | 'verified' | 'suspended'
}

export interface AffiliateNetworkItem {
  id: string
  name: string
  tag: string
  apiKey: string
  subId: string
  postbackUrl: string
  defaultCommission: string
  status: 'Connected' | 'Pending Sync' | 'Error'
  totalClicks: number
  estEarnings: string
}

export interface AlgorithmConfig {
  trendingWeight: number
  flashLootBoost: number
  sponsoredBoost: number
  minDiscountThreshold: number
  activeCampaignName: string
  campaignTheme: string
}

export interface GovernanceAuditLog {
  id: string
  timestamp: string
  actor: string
  role: string
  event: string
  riskLevel: 'High' | 'Medium' | 'Low'
  details: string
}
