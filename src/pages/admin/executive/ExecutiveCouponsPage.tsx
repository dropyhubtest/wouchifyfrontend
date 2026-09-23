import React, { useState, useEffect, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Copy,
  Check,
  Tag,
  Filter,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Ticket,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Star,
  ShoppingBag,
  Percent,
  Clock
} from 'lucide-react'
import './ExecutiveShared.css'
import { FAVOURITE_STORES } from '../../../data/storesHero'
import { CATEGORIES_DATA } from '../../../data/categories'
import { AdminConfirmDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

/* ============================================================
   Types
   ============================================================ */

type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled' | 'pending' | 'rejected'
type CouponType = 'percent' | 'flat' | 'bogo' | 'freebie' | 'cashback' | 'bank'

interface Coupon {
  id: string
  title: string
  description: string
  store: string
  category: string
  code: string
  couponType: CouponType
  discount: string          // "50% OFF", "₹500 OFF", etc.
  discountValue: number     // numeric for sorting
  minOrder: string          // "Min order ₹999"
  maxDiscount: string       // "Max ₹300"
  affiliateLink: string
  status: CouponStatus
  isExclusive: boolean
  isFeatured: boolean
  isVerified: boolean
  telegramAlert: boolean
  startDate: string
  expiryDate: string
  usageCount: number
  totalUses: number         // cap (0 = unlimited)
  addedOn?: string
  createdAt?: string
  _id?: string
}

/* ============================================================
   Seed data
   ============================================================ */

const STORE_NAMES = FAVOURITE_STORES.map(s => s.name)

const COUPON_TYPES: { value: CouponType; label: string; color: string }[] = [
  { value: 'percent',  label: '% Off',     color: '#6366f1' },
  { value: 'flat',     label: 'Flat Off',  color: '#3b82f6' },
  { value: 'bogo',     label: 'BOGO',      color: '#f59e0b' },
  { value: 'freebie',  label: 'Freebie',   color: '#10b981' },
  { value: 'cashback', label: 'Cashback',  color: '#8b5cf6' },
  { value: 'bank',     label: 'Bank Offer',color: '#ef4444' },
]

function couponTypeColor(t: CouponType) {
  return COUPON_TYPES.find(c => c.value === t)?.color ?? '#64748b'
}
function couponTypeLabel(t: CouponType) {
  return COUPON_TYPES.find(c => c.value === t)?.label ?? t
}

function daysLeft(expiryDate: string): number {
  if (!expiryDate) return 30
  const now = new Date()
  const exp = new Date(expiryDate)
  if (isNaN(exp.getTime())) return 30
  return Math.ceil((exp.getTime() - now.getTime()) / 86400000)
}

function expiryPill(days: number) {
  if (days < 0) return { label: 'Expired', bg: '#fee2e2', color: '#ef4444' }
  if (days === 0) return { label: 'Expires Today!', bg: '#fef3c7', color: '#d97706' }
  if (days <= 3) return { label: `${days}d left`, bg: '#fef3c7', color: '#d97706' }
  if (days <= 7) return { label: `${days}d left`, bg: '#fef9c3', color: '#ca8a04' }
  return { label: `${days}d left`, bg: '#dcfce7', color: '#16a34a' }
}

import { TableRowSkeleton, EmptyState } from '../../../components/common/Skeletons'

const CATEGORY_OPTIONS = [
  'All',
  'Electronics',
  'Fashion',
  'Food & Dining',
  'Grocery',
  'Beauty & Personal Care',
  'Home & Lifestyle',
  'Travel',
  'Recharge & Bills'
]

const EMPTY_FORM: Partial<Coupon> = {
  title: '', description: '', store: STORE_NAMES[0] ?? 'Amazon',
  category: 'Electronics', code: '', couponType: 'percent',
  discount: '', discountValue: 0, minOrder: '', maxDiscount: '',
  affiliateLink: '', status: 'active', isExclusive: false, isFeatured: false,
  isVerified: true, telegramAlert: false,
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: '', usageCount: 0, totalUses: 0,
}

/* ============================================================
   Helpers
   ============================================================ */

function statusConfig(s: CouponStatus) {
  const map: Record<CouponStatus, { label: string; bg: string; color: string }> = {
    active:    { label: 'Active',     bg: '#dcfce7', color: '#16a34a' },
    inactive:  { label: 'Inactive',   bg: '#f1f5f9', color: '#64748b' },
    expired:   { label: 'Expired',    bg: '#fee2e2', color: '#ef4444' },
    scheduled: { label: 'Scheduled',  bg: '#e0f2fe', color: '#0284c7' },
    pending:   { label: 'Pending',    bg: '#fef3c7', color: '#d97706' },
    rejected:  { label: 'Rejected',   bg: '#fee2e2', color: '#ef4444' },
  }
  return map[s]
}

function usagePct(c: Coupon) {
  if (!c.totalUses) return null
  return Math.min(100, Math.round((c.usageCount / c.totalUses) * 100))
}

/* ============================================================
   CouponCode chip with copy
   ============================================================ */

const CodeChip: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        background: '#f1f5f9', border: '1px dashed #cbd5e1',
        borderRadius: 6, padding: '3px 10px',
        fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem',
        letterSpacing: '1.5px', color: '#0f172a',
      }}>
        {code}
      </span>
      <button
        onClick={copy}
        title="Copy code"
        style={{
          border: 'none', background: 'none', cursor: 'pointer', padding: 2,
          color: copied ? '#22c55e' : '#94a3b8', display: 'flex',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  )
}

/* ============================================================
   Customer Preview Modal Removed (Replaced by Drawer)
   ============================================================ */

/* ============================================================
   Add / Edit Modal
   ============================================================ */

interface CouponFormProps {
  editing: Coupon | null
  onClose: () => void
  onSave: (c: Coupon) => void
}

const CouponFormModal: React.FC<CouponFormProps> = ({ editing, onClose, onSave }) => {
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<Partial<Coupon>>(editing ? { ...editing } : { ...EMPTY_FORM })
  const [formAlert, setFormAlert] = useState<{ title: string; message: string } | null>(null)
  const set = (k: keyof Coupon, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title?.trim()) {
      setFormAlert({ title: 'Missing Title', message: 'Coupon title is required.' })
      return
    }
    if (!form.code?.trim()) {
      setFormAlert({ title: 'Missing Code', message: 'Coupon code is required.' })
      return
    }
    if (!form.expiryDate) {
      setFormAlert({ title: 'Missing Expiry Date', message: 'Expiry date is required.' })
      return
    }
    const now = new Date().toISOString().split('T')[0]
    onSave({
      id: editing?.id ?? `coupon-${Date.now()}`,
      title: form.title!,
      description: form.description ?? '',
      store: form.store ?? STORE_NAMES[0],
      category: form.category ?? 'Electronics',
      code: (form.code ?? '').toUpperCase(),
      couponType: (form.couponType as CouponType) ?? 'percent',
      discount: form.discount ?? '',
      discountValue: Number(form.discountValue ?? 0),
      minOrder: form.minOrder ?? '',
      maxDiscount: form.maxDiscount ?? '',
      affiliateLink: form.affiliateLink ?? '',
      status: (form.status as CouponStatus) ?? 'active',
      isExclusive: form.isExclusive ?? false,
      isFeatured: form.isFeatured ?? false,
      isVerified: form.isVerified ?? true,
      telegramAlert: form.telegramAlert ?? false,
      startDate: form.startDate ?? now,
      expiryDate: form.expiryDate!,
      usageCount: editing?.usageCount ?? 0,
      totalUses: Number(form.totalUses ?? 0),
      addedOn: editing?.addedOn ?? now,
    })
  }

  const typeColor = couponTypeColor((form.couponType as CouponType) ?? 'percent')

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 780, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Ticket size={20} style={{ marginRight: 8, color: typeColor }} />
            {editing ? 'Edit Coupon' : 'Add New Coupon'}
          </h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Stepper Header */}
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <div className="form-stepper" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 1 ? 'active' : ''} ${form.title && form.code ? 'completed' : ''}`}
              onClick={() => setFormStep(1)}
            >
              <div className="step-number">1</div>
              <div className="step-info">
                <span className="step-title">Step 1: Offer & Code Details</span>
                <span className="step-desc">Title, store, discount & promo code</span>
              </div>
            </button>
            <div className="step-divider">›</div>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 2 ? 'active' : ''} ${form.expiryDate ? 'completed' : ''}`}
              onClick={() => setFormStep(2)}
            >
              <div className="step-number">2</div>
              <div className="step-info">
                <span className="step-title">Step 2: Validity, Links & Tags</span>
                <span className="step-desc">Expiry date, tracking link & badges</span>
              </div>
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 20 }}>
          {formStep === 1 && (
            <div className="form-step-pane">
              {/* Title */}
              <div className="form-group">
                <label>Coupon Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="e.g., Flat 50% Off on First Order"
                  value={form.title ?? ''} onChange={e => set('title', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description / Terms</label>
                <textarea rows={2} placeholder="e.g., Valid for new users only. No minimum order."
                  value={form.description ?? ''}
                  onChange={e => set('description', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', outline: 'none', width: '100%' }}
                />
              </div>

              {/* Row: Store + Category + Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Store <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={form.store ?? ''} onChange={e => set('store', e.target.value)}>
                    {STORE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category ?? 'Electronics'} onChange={e => set('category', e.target.value)}>
                    {(CATEGORIES_DATA ?? [{ name: 'Electronics' }]).map((c: { name: string }) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Coupon Type</label>
                  <select value={form.couponType ?? 'percent'} onChange={e => set('couponType', e.target.value)}>
                    {COUPON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row: Code + Discount text + Discount value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
                <div className="form-group">
                  <label>Coupon Code <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="e.g., WELCOME50"
                    value={form.code ?? ''} style={{ fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}
                    onChange={e => set('code', e.target.value.toUpperCase())} />
                </div>
                <div className="form-group">
                  <label>Discount Label</label>
                  <input type="text" placeholder="e.g., 50% OFF"
                    value={form.discount ?? ''} onChange={e => set('discount', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input type="number" placeholder="50"
                    value={form.discountValue ?? ''} onChange={e => set('discountValue', Number(e.target.value))} />
                </div>
              </div>

              {/* Row: Min Order + Max Discount */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Min Order Requirement</label>
                  <input type="text" placeholder="e.g., Min ₹999 or No minimum"
                    value={form.minOrder ?? ''} onChange={e => set('minOrder', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Max Discount Cap</label>
                  <input type="text" placeholder="e.g., Max ₹300"
                    value={form.maxDiscount ?? ''} onChange={e => set('maxDiscount', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="form-step-pane">
              <div className="form-group">
                <label>Affiliate / Destination Link</label>
                <input type="url" placeholder="https://swiggy.com/?affid=wouchify"
                  value={form.affiliateLink ?? ''} onChange={e => set('affiliateLink', e.target.value)} />
              </div>

              {/* Row: Start + Expiry + Status + Cap */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.startDate ?? ''} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 800, color: '#dc2626' }}>Expiry Date *</label>
                  <input type="date" required value={form.expiryDate ?? ''} onChange={e => set('expiryDate', e.target.value)} style={{ borderColor: '#fca5a5' }} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Usage Cap (0 = ∞)</label>
                  <input type="number" min={0} placeholder="0"
                    value={form.totalUses ?? 0} onChange={e => set('totalUses', Number(e.target.value))} />
                </div>
              </div>

              {/* Toggles */}
              <div className="form-group">
                <label style={{ marginBottom: 8 }}>Badge & Visibility Tags</label>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  {([
                    ['isVerified',   '✓ Verified'],
                    ['isExclusive',  '⭐ Exclusive'],
                    ['isFeatured',   '🔥 Featured'],
                    ['telegramAlert','📨 Telegram Alert'],
                  ] as [keyof Coupon, string][]).map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={(form[key] as boolean) ?? false}
                        onChange={e => set(key, e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: typeColor }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', display: 'flex' }}>
          {formStep === 1 ? (
            <>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-save"
                onClick={() => {
                  if (!form.title?.trim()) {
                    setFormAlert({ title: 'Missing Title', message: 'Coupon title is required.' })
                    return
                  }
                  if (!form.code?.trim()) {
                    setFormAlert({ title: 'Missing Code', message: 'Coupon code is required.' })
                    return
                  }
                  setFormStep(2)
                }}
              >
                Next: Validity & Tags &rarr;
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-cancel" onClick={() => setFormStep(1)}>&larr; Back to Step 1</button>
              <button type="button" className="btn-save" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Coupon'}
              </button>
            </>
          )}
        </div>

        {formAlert && (
          <AdminAlertDialog
            isOpen={!!formAlert}
            title={formAlert.title}
            message={formAlert.message}
            variant="warning"
            buttonLabel="Understood"
            onClose={() => setFormAlert(null)}
          />
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Main Page
   ============================================================ */

export const ExecutiveCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | CouponStatus>('all')
  const [filterType, setFilterType] = useState<'all' | CouponType>('all')
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'expiry' | 'discount' | 'usage' | 'added'>('expiry')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [inspectedCoupon, setInspectedCoupon] = useState<Coupon | null>(null)
  const [drawerTab, setDrawerTab] = useState<string>('overview')
  const [rawStores, setRawStores] = useState<any[]>([])
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)
  const [couponAlert, setCouponAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'danger' | 'info' | 'success' } | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [liveCoupons, liveStores, liveDeals] = await Promise.all([
        adminApi.getCoupons({ all: true }),
        adminApi.getStores({ all: true }),
        adminApi.getDeals({ all: true })
      ])

      if (Array.isArray(liveCoupons)) {
        const mapped: Coupon[] = liveCoupons.map((c: any, idx: number) => ({
          id: String(c._id || c.id || `cpn-${idx}`),
          _id: String(c._id || c.id || `cpn-${idx}`),
          title: c.title || `${c.discount || 'Special'} Discount at ${c.store || 'Store'}`,
          description: c.description || 'Verified promo discount code.',
          store: c.store || 'Amazon',
          category: c.category || 'Electronics',
          code: (c.code || 'AMAZON10').toUpperCase(),
          couponType: (c.couponType || (String(c.discount || '').includes('%') ? 'percent' : String(c.discount || '').toLowerCase().includes('free') ? 'freebie' : 'flat')) as any,
          discount: c.discount || '10% off',
          discountValue: parseInt(String(c.discount || '0').replace(/[^0-9]/g, '')) || 10,
          minOrder: c.minOrder || 'Min Order: 499',
          maxDiscount: c.maxDiscount || 'Max ₹250',
          affiliateLink: c.affiliateLink || `https://${String(c.store || 'store').toLowerCase().replace(/\s+/g, '')}.com/?tag=wouchify`,
          status: (c.status || 'active') as any,
          isExclusive: Boolean(c.isExclusive !== false),
          isFeatured: Boolean(c.isFeatured !== false),
          isVerified: true,
          telegramAlert: Boolean(c.telegramAlert),
          startDate: c.startDate || new Date().toISOString().slice(0, 10),
          expiryDate: c.expiry || c.expiryDate || new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
          usageCount: c.usageCount || 0,
          totalUses: c.usageLimit || 5000,
          addedOn: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        }))
        setCoupons(mapped)
      } else {
        setCoupons([])
      }

      if (Array.isArray(liveStores)) setRawStores(liveStores)
      if (Array.isArray(liveDeals)) setRawDeals(liveDeals)

    } catch (err) {
      console.warn('Data fetch error:', err)
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
    const handleUpdate = () => fetchAllData()
    window.addEventListener('wouchify_coupons_updated', handleUpdate)
    window.addEventListener('wouchify_stores_updated', handleUpdate)
    window.addEventListener('wouchify_deals_updated', handleUpdate)
    return () => {
      window.removeEventListener('wouchify_coupons_updated', handleUpdate)
      window.removeEventListener('wouchify_stores_updated', handleUpdate)
      window.removeEventListener('wouchify_deals_updated', handleUpdate)
    }
  }, [])
  /* KPI stats */
  const kpi = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter(c => c.status === 'active').length,
    expiringSoon: coupons.filter(c => c.status === 'active' && daysLeft(c.expiryDate) <= 3).length,
    expired: coupons.filter(c => c.status === 'expired').length,
    exclusive: coupons.filter(c => c.isExclusive).length,
    totalUsed: coupons.reduce((a, c) => a + c.usageCount, 0),
  }), [coupons])

  /* Filtered list */
  const filtered = useMemo(() => {
    let list = [...coupons]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.store.toLowerCase().includes(q) ||
        c.discount.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus)
    if (filterType !== 'all')   list = list.filter(c => c.couponType === filterType)
    if (filterCategory !== 'All') list = list.filter(c => c.category === filterCategory)
    list.sort((a, b) => {
      if (sortBy === 'expiry')   return a.expiryDate.localeCompare(b.expiryDate)
      if (sortBy === 'discount') return b.discountValue - a.discountValue
      if (sortBy === 'usage')    return b.usageCount - a.usageCount
      if (sortBy === 'added')    return (b.addedOn || '').localeCompare(a.addedOn || '')
      return 0
    })
    return list
  }, [coupons, search, filterStatus, filterType, filterCategory, sortBy])

  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (c: Coupon) => { setEditing(c); setIsFormOpen(true) }

  const handleSave = (data: Coupon) => {
    if (editing) {
      adminApi.updateCoupon(data.id, {
        code: data.code,
        store: data.store,
        discount: data.discount,
        category: data.category,
        expiry: data.expiryDate,
        status: data.status,
        description: data.description,
        minOrder: data.minOrder,
        maxDiscount: data.maxDiscount
      }).catch(console.warn)

      setCoupons(prev => prev.map(c => c.id === data.id ? data : c))
    } else {
      adminApi.createCoupon({
        code: data.code,
        store: data.store,
        discount: data.discount,
        category: data.category,
        expiry: data.expiryDate,
        status: data.status,
        description: data.description,
        minOrder: data.minOrder,
        maxDiscount: data.maxDiscount
      }).catch(console.warn)

      setCoupons(prev => [data, ...prev])
    }
    setIsFormOpen(false)
  }

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon)
  }

  const confirmDeleteCoupon = async () => {
    if (!couponToDelete) return
    const coupon = couponToDelete
    await adminApi.deleteCoupon(String(coupon._id || coupon.id)).catch(console.warn)
    setCoupons(prev => prev.filter(c => c.id !== coupon.id && c.code !== coupon.code && c._id !== coupon._id))
    setCouponToDelete(null)
  }

  const resetFilters = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterType('all')
    setFilterCategory('All')
    setSortBy('expiry')
  }

  const hasActiveFilters = search || filterStatus !== 'all' || filterType !== 'all' || filterCategory !== 'All'

  return (
    <ExecutiveLayout activeMenu="coupons">
      <div className="executive-crud-page">

        {/* ── Header ── */}
        <div className="crud-header">
          <div>
            <h2 className="crud-title">Coupon Management</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Manage promo codes, discount coupons & affiliate offers
            </p>
          </div>
          <button className="crud-add-btn" onClick={openAdd}>
            <Plus size={18} /> Add New Coupon
          </button>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon" style={{ marginBottom: 24 }}>
          <div className="kpi-card" style={{ borderTop: '3px solid #6366f1' }}>
            <div className="kpi-icon" style={{ background: '#6366f118', color: '#6366f1' }}><Ticket size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.total}</div>
              <div className="kpi-label">Total Coupons</div>
              <div className="kpi-sub">In database</div>
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #22c55e' }}>
            <div className="kpi-icon" style={{ background: '#22c55e18', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.active}</div>
              <div className="kpi-label">Active</div>
              <div className="kpi-sub">Live right now</div>
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <div className="kpi-icon" style={{ background: '#f59e0b18', color: '#f59e0b' }}><AlertTriangle size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.expiringSoon}</div>
              <div className="kpi-label">Expiring Soon</div>
              <div className="kpi-sub">Within 3 days</div>
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #ef4444' }}>
            <div className="kpi-icon" style={{ background: '#ef444418', color: '#ef4444' }}><XCircle size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.expired}</div>
              <div className="kpi-label">Expired</div>
              <div className="kpi-sub">Needs cleanup</div>
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <div className="kpi-icon" style={{ background: '#f59e0b18', color: '#f59e0b' }}><Star size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.exclusive}</div>
              <div className="kpi-label">Exclusive</div>
              <div className="kpi-sub">Wouchify-only</div>
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #3b82f6' }}>
            <div className="kpi-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}><TrendingUp size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-value">{kpi.totalUsed.toLocaleString()}</div>
              <div className="kpi-label">Total Uses</div>
              <div className="kpi-sub">All-time</div>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="crud-filters" style={{ flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
          <div className="crud-search" style={{ minWidth: 240 }}>
            <Search size={18} />
            <input type="text" placeholder="Search title, code, store…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="crud-filter-select">
            <Filter size={15} style={{ color: '#94a3b8' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | CouponStatus)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="crud-filter-select">
            <Tag size={15} style={{ color: '#94a3b8' }} />
            <select value={filterType} onChange={e => setFilterType(e.target.value as 'all' | CouponType)}>
              <option value="all">All Types</option>
              {COUPON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="crud-filter-select">
            <ShoppingBag size={15} style={{ color: '#94a3b8' }} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="crud-filter-select">
            <Percent size={15} style={{ color: '#94a3b8' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="expiry">Sort: Expiring Soonest</option>
              <option value="discount">Sort: Highest Discount</option>
              <option value="usage">Sort: Most Used</option>
              <option value="added">Sort: Newest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="action-btn" title="Reset filters">
              <RotateCcw size={15} />
            </button>
          )}

          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
            {filtered.length} of {coupons.length} coupons
          </span>
        </div>

        {/* ── Table ── */}
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Coupon</th>
                <th>Store</th>
                <th>Code</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Flags</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRowSkeleton cols={6} rows={6} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '32px 16px' }}>
                    <EmptyState
                      title="No Coupons Found"
                      message="No active coupons found matching your criteria in the database."
                      actionText="Add New Coupon"
                      onAction={openAdd}
                    />
                  </td>
                </tr>
              ) : filtered.map(coupon => {
                const days = daysLeft(coupon.expiryDate)
                const pill = expiryPill(days)
                const pct = usagePct(coupon)
                const tColor = couponTypeColor(coupon.couponType)
                const sc = statusConfig(coupon.status)

                return (
                  <tr 
                    key={coupon.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setInspectedCoupon(coupon)}
                  >
                    {/* Coupon */}
                    <td style={{ minWidth: 200 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 8, borderRadius: 99, background: tColor,
                          alignSelf: 'stretch', flexShrink: 0, minHeight: 36,
                        }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.3 }}>{coupon.title}</div>
                          <div style={{
                            display: 'inline-block', marginTop: 4,
                            background: `${tColor}18`, color: tColor,
                            borderRadius: 5, padding: '1px 8px',
                            fontSize: '0.68rem', fontWeight: 700,
                          }}>
                            {couponTypeLabel(coupon.couponType)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Store */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{coupon.store}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{coupon.category}</div>
                    </td>

                    {/* Code */}
                    <td><CodeChip code={coupon.code} /></td>

                    {/* Discount */}
                    <td>
                      <div style={{ fontWeight: 800, color: tColor, fontSize: '0.92rem' }}>{coupon.discount}</div>
                      {coupon.minOrder && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>{coupon.minOrder}</div>}
                    </td>

                    {/* Usage */}
                    <td style={{ minWidth: 100 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                        {coupon.usageCount.toLocaleString()}{coupon.totalUses ? ` / ${coupon.totalUses}` : ''}
                      </div>
                      {pct !== null && (
                        <div style={{ marginTop: 4, height: 4, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%', borderRadius: 99,
                            background: pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e',
                            transition: 'width 0.3s',
                          }} />
                        </div>
                      )}
                    </td>

                    {/* Expiry */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{coupon.expiryDate}</div>
                      <span style={{
                        display: 'inline-block', marginTop: 4,
                        background: pill.bg, color: pill.color,
                        borderRadius: 6, padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700,
                      }}>
                        {pill.label}
                      </span>
                    </td>

                    {/* Flags */}
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {coupon.isVerified   && <span title="Verified"  style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#16a34a', borderRadius: 4, padding: '1px 5px' }}>✓</span>}
                        {coupon.isExclusive  && <span title="Exclusive" style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#d97706', borderRadius: 4, padding: '1px 5px' }}>⭐</span>}
                        {coupon.isFeatured   && <span title="Featured"  style={{ fontSize: '0.72rem', background: '#ede9fe', color: '#7c3aed', borderRadius: 4, padding: '1px 5px' }}>🔥</span>}
                        {coupon.telegramAlert && <span title="Telegram" style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0284c7', borderRadius: 4, padding: '1px 5px' }}>📨</span>}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span style={{
                        background: sc.bg, color: sc.color,
                        borderRadius: 8, padding: '3px 10px',
                        fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        {sc.label}
                      </span>
                      {coupon.status === 'active' && ((coupon as any).approvedByName || (coupon as any).approvedBy || (coupon as any).approvedByRole) && (
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', marginTop: 3, fontWeight: 600 }}>
                          ✓ by {((coupon as any).approvedByName || (coupon as any).approvedByRole || (coupon as any).approvedBy).split('@')[0]}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn" onClick={() => setInspectedCoupon(coupon)} title="Preview"><Eye size={15} /></button>
                        <button className="action-btn" onClick={() => openEdit(coupon)} title="Edit"><Edit2 size={15} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(coupon)} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      {isFormOpen && (
        <CouponFormModal editing={editing} onClose={() => setIsFormOpen(false)} onSave={handleSave} />
      )}
      
      {/* ── Deep Inspection Drawer ── */}
      {inspectedCoupon && (
        <div className="exec-drawer-overlay" onClick={() => setInspectedCoupon(null)}>
          <div className="exec-drawer" onClick={e => e.stopPropagation()}>
            <div className="exec-drawer__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="exec-drawer__avatar" style={{ background: '#f1f5f9', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {(() => {
                      const st = rawStores.find(s => s.name === inspectedCoupon.store)
                      if (st?.logoUrl) return <img src={st.logoUrl} alt={st.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                      return <Tag size={24} style={{ color: couponTypeColor(inspectedCoupon.couponType) }} />
                   })()}
                </div>
                <div>
                  <h3 className="exec-drawer__title" style={{ fontSize: '1.1rem', marginBottom: 4, lineHeight: 1.2 }}>{inspectedCoupon.title}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                     <span style={{ fontSize: '0.72rem', fontWeight: 600, color: couponTypeColor(inspectedCoupon.couponType), background: `${couponTypeColor(inspectedCoupon.couponType)}15`, padding: '2px 8px', borderRadius: 12 }}>
                        {couponTypeLabel(inspectedCoupon.couponType)}
                     </span>
                     <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>• {inspectedCoupon.store}</span>
                     <span style={{ fontSize: '0.72rem', color: statusConfig(inspectedCoupon.status).color, background: statusConfig(inspectedCoupon.status).bg, padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>
                        {statusConfig(inspectedCoupon.status).label}
                     </span>
                  </div>
                </div>
              </div>
              <button className="exec-drawer__close" onClick={() => setInspectedCoupon(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="exec-drawer__stats">
              <div className="exec-drawer__stat-card">
                <div className="label">Discount</div>
                <div className="value" style={{ color: couponTypeColor(inspectedCoupon.couponType), fontSize: '1.2rem' }}>{inspectedCoupon.discount}</div>
              </div>
              <div className="exec-drawer__stat-card">
                <div className="label">Usage Count</div>
                <div className="value" style={{ fontSize: '1.2rem' }}>{inspectedCoupon.usageCount.toLocaleString()}</div>
              </div>
              <div className="exec-drawer__stat-card">
                <div className="label">Days Left</div>
                <div className="value" style={{ fontSize: '1.2rem' }}>{(() => {
                  const d = daysLeft(inspectedCoupon.expiryDate)
                  return d < 0 ? 'Expired' : d
                })()}</div>
              </div>
              <div className="exec-drawer__stat-card">
                <div className="label">Total Uses</div>
                <div className="value" style={{ fontSize: '1.2rem' }}>{inspectedCoupon.totalUses > 0 ? inspectedCoupon.totalUses : '∞'}</div>
              </div>
            </div>

            <div className="exec-drawer__tabs">
              <button className={`exec-drawer__tab ${drawerTab === 'overview' ? 'active' : ''}`} onClick={() => setDrawerTab('overview')}>Overview</button>
              <button className={`exec-drawer__tab ${drawerTab === 'store' ? 'active' : ''}`} onClick={() => setDrawerTab('store')}>Store Context</button>
              <button className={`exec-drawer__tab ${drawerTab === 'deals' ? 'active' : ''}`} onClick={() => setDrawerTab('deals')}>Related Deals</button>
            </div>

            <div className="exec-drawer__body">
               {drawerTab === 'overview' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="exec-drawer__item" style={{ background: '#f8fafc', padding: '20px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: 12 }}>
                       <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12, fontWeight: 700, letterSpacing: '0.5px' }}>COUPON CODE</div>
                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '1.6rem', fontFamily: 'monospace', fontWeight: 900, letterSpacing: '3px', color: '#0f172a' }}>{inspectedCoupon.code}</span>
                          <button onClick={() => {
                             navigator.clipboard.writeText(inspectedCoupon.code)
                             setCopiedCode(true)
                             setTimeout(() => setCopiedCode(false), 2000)
                          }} className="action-btn" title="Copy Code" style={{ background: 'white', padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                             {copiedCode ? <Check size={18} style={{ color: '#10b981' }} /> : <Copy size={18} style={{ color: '#3b82f6' }} />}
                          </button>
                       </div>
                    </div>
                    
                    <div className="exec-drawer__item" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px', padding: 16, borderRadius: 12 }}>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Min Purchase</div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{inspectedCoupon.minOrder || 'None'}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Max Discount</div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{inspectedCoupon.maxDiscount || 'None'}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>Created Date</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>{inspectedCoupon.addedOn || inspectedCoupon.createdAt || 'N/A'}</div>
                       </div>
                       <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                             <Clock size={12} /> Expiry Date
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444' }}>{inspectedCoupon.expiryDate}</div>
                       </div>
                    </div>

                    <div className="exec-drawer__item" style={{ padding: 16, borderRadius: 12 }}>
                       <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#334155' }}>Terms & Conditions / Description</div>
                       <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {inspectedCoupon.description || 'No specific terms provided.'}
                       </div>
                    </div>

                    <div className="exec-drawer__item" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 12 }}>
                       <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Verification Status</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {inspectedCoupon.isVerified ? (
                             <div style={{ background: '#dcfce7', padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <CheckCircle2 size={16} style={{ color: '#16a34a' }} /> 
                                <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>Verified & Working</span>
                             </div>
                          ) : (
                             <div style={{ background: '#fef3c7', padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <AlertTriangle size={16} style={{ color: '#d97706' }} /> 
                                <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>Unverified</span>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
               )}

               {drawerTab === 'store' && (() => {
                 const storeObj = rawStores.find(s => s.name === inspectedCoupon.store)
                 const otherCoupons = coupons.filter(c => c.store === inspectedCoupon.store && c.id !== inspectedCoupon.id)
                 return (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {storeObj ? (
                        <div className="exec-drawer__item" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, borderRadius: 12 }}>
                           {storeObj.logoUrl ? (
                              <img src={storeObj.logoUrl} alt={storeObj.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'contain', background: 'white', border: '1px solid #e2e8f0', padding: 4 }} />
                           ) : (
                              <div style={{ width: 72, height: 72, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <ShoppingBag size={28} style={{ color: '#94a3b8' }} />
                              </div>
                           )}
                           <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#0f172a' }}>{storeObj.name}</h4>
                              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{storeObj.category || 'Various'}</div>
                              {storeObj.cashbackRate && (
                                 <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: 6, marginBottom: 8 }}>
                                    Up to {storeObj.cashbackRate} Cashback
                                 </div>
                              )}
                              <div>
                                 <a href={inspectedCoupon.affiliateLink || storeObj.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 700, background: '#eff6ff', padding: '6px 12px', borderRadius: 8 }}>
                                    Visit Store <ExternalLink size={14} />
                                 </a>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="exec-drawer__item" style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px', borderRadius: 12 }}>
                           <ShoppingBag size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                           <div style={{ fontWeight: 600 }}>Store details not found</div>
                           <div style={{ fontSize: '0.85rem', marginTop: 4 }}>No extra store information for "{inspectedCoupon.store}"</div>
                        </div>
                      )}
                      
                      <div>
                         <h4 style={{ fontSize: '0.95rem', color: '#334155', margin: '8px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Ticket size={16} /> Other Coupons from {inspectedCoupon.store}
                         </h4>
                         {otherCoupons.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                               {otherCoupons.slice(0, 5).map(c => (
                                  <div key={c.id} className="exec-drawer__item" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setInspectedCoupon(c)} title="View Coupon">
                                     <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', fontFamily: 'monospace', letterSpacing: '1px' }}>{c.code}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>{c.discount}</div>
                                     </div>
                                     <div style={{ fontSize: '0.75rem', color: c.status === 'active' ? '#16a34a' : '#ef4444', fontWeight: 700, background: c.status === 'active' ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: 8 }}>
                                        {c.status.toUpperCase()}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         ) : (
                            <div className="exec-drawer__item" style={{ fontSize: '0.85rem', color: '#94a3b8', padding: 20, textAlign: 'center', borderRadius: 12 }}>
                               No other coupons found.
                            </div>
                         )}
                      </div>
                   </div>
                 )
               })()}

               {drawerTab === 'deals' && (() => {
                 const storeDeals = rawDeals.filter(d => d.store === inspectedCoupon.store && d.status === 'active')
                 return (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {storeDeals.length > 0 ? (
                         storeDeals.map(d => (
                           <div key={d._id || d.id} className="exec-drawer__item" style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                              <img src={d.imageUrl || 'https://via.placeholder.com/80'} alt="" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', background: '#f1f5f9' }} />
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 8 }}>{d.title}</div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>₹{d.dealPrice}</span>
                                    {d.originalPrice && <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>₹{d.originalPrice}</span>}
                                    {d.discount && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, fontWeight: 800 }}>{d.discount} OFF</span>}
                                 </div>
                              </div>
                           </div>
                         ))
                      ) : (
                         <div className="exec-drawer__item" style={{ textAlign: 'center', color: '#64748b', padding: '40px 20px', borderRadius: 12 }}>
                           <Tag size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                           <div style={{ fontWeight: 600 }}>No active deals</div>
                           <div style={{ fontSize: '0.85rem', marginTop: 4 }}>No live deals found for {inspectedCoupon.store}</div>
                         </div>
                      )}
                   </div>
                 )
               })()}
            </div>

            <div className="exec-drawer__actions">
               <button className="btn-cancel" onClick={() => setInspectedCoupon(null)} style={{ background: '#f1f5f9', border: 'none', color: '#475569' }}>Close</button>
               <div style={{ display: 'flex', gap: 12 }}>
                 {!inspectedCoupon.isVerified && (
                   <button className="action-btn" style={{ background: '#dcfce7', color: '#16a34a', borderColor: '#dcfce7', padding: '8px 16px', fontWeight: 700 }}
                     onClick={() => {
                        if ((adminApi as any).verifyCoupon) {
                           (adminApi as any).verifyCoupon(inspectedCoupon.id).then(() => {
                              fetchAllData()
                              setInspectedCoupon({ ...inspectedCoupon, isVerified: true })
                              setCouponAlert({ title: 'Coupon Verified', message: `Coupon ${inspectedCoupon.code} has been successfully validated.`, variant: 'success' })
                           }).catch(console.warn)
                        } else {
                           setCouponAlert({ title: 'Verification Notice', message: 'Verification API is not configured.', variant: 'info' })
                        }
                     }}
                   >
                     <CheckCircle2 size={16} /> Verify
                   </button>
                 )}
                 <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => { setInspectedCoupon(null); openEdit(inspectedCoupon) }}>
                   <Edit2 size={16} /> Edit Coupon
                 </button>
                 <button className="action-btn" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={() => {
                    handleDelete(inspectedCoupon)
                    setInspectedCoupon(null)
                 }}>
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM CONFIRM DIALOG ── */}
      <AdminConfirmDialog
        isOpen={!!couponToDelete}
        title="Delete Coupon"
        message={couponToDelete ? `Are you sure you want to permanently delete coupon "${couponToDelete.code}"?` : ''}
        confirmLabel="Delete Coupon"
        cancelLabel="Cancel"
        variant="danger"
        icon="trash"
        onConfirm={confirmDeleteCoupon}
        onCancel={() => setCouponToDelete(null)}
      />

      {/* ── CUSTOM ALERT DIALOG ── */}
      {couponAlert && (
        <AdminAlertDialog
          isOpen={!!couponAlert}
          title={couponAlert.title}
          message={couponAlert.message}
          variant={couponAlert.variant || 'warning'}
          buttonLabel="Understood"
          onClose={() => setCouponAlert(null)}
        />
      )}
    </ExecutiveLayout>
  )
}
