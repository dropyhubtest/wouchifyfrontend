import React, { useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
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
  Percent
} from 'lucide-react'
import './ExecutiveShared.css'
import { FAVOURITE_STORES } from '../../../data/storesHero'
import { CATEGORIES_DATA } from '../../../data/categories'

/* ============================================================
   Types
   ============================================================ */

type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled'
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
  addedOn: string
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
  const now = new Date()
  const exp = new Date(expiryDate)
  return Math.ceil((exp.getTime() - now.getTime()) / 86400000)
}

function expiryPill(days: number) {
  if (days < 0) return { label: 'Expired', bg: '#fee2e2', color: '#ef4444' }
  if (days === 0) return { label: 'Expires Today!', bg: '#fef3c7', color: '#d97706' }
  if (days <= 3) return { label: `${days}d left`, bg: '#fef3c7', color: '#d97706' }
  if (days <= 7) return { label: `${days}d left`, bg: '#fef9c3', color: '#ca8a04' }
  return { label: `${days}d left`, bg: '#dcfce7', color: '#16a34a' }
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1', title: 'Flat 50% Off on First Order', description: 'Valid for new users only. No minimum order required.',
    store: 'Swiggy', category: 'Food', code: 'WELCOME50', couponType: 'percent',
    discount: '50% OFF', discountValue: 50, minOrder: 'No minimum', maxDiscount: 'Max ₹100',
    affiliateLink: 'https://swiggy.com/?affid=wouchify', status: 'active',
    isExclusive: true, isFeatured: true, isVerified: true, telegramAlert: true,
    startDate: '2026-09-01', expiryDate: '2026-12-31', usageCount: 1240, totalUses: 0, addedOn: '2026-09-01',
  },
  {
    id: 'c2', title: '₹500 Off on Electronics', description: 'Valid on electronics above ₹2999.',
    store: 'Amazon', category: 'Electronics', code: 'ELEC500', couponType: 'flat',
    discount: '₹500 OFF', discountValue: 500, minOrder: 'Min ₹2999', maxDiscount: '',
    affiliateLink: 'https://amazon.in/?tag=wouchify', status: 'active',
    isExclusive: false, isFeatured: true, isVerified: true, telegramAlert: false,
    startDate: '2026-09-05', expiryDate: '2026-10-15', usageCount: 892, totalUses: 1000, addedOn: '2026-09-05',
  },
  {
    id: 'c3', title: 'Buy 1 Get 1 Free on Fashion', description: 'T&C apply. Select styles only.',
    store: 'Myntra', category: 'Fashion', code: 'BOGO', couponType: 'bogo',
    discount: 'Buy 1 Get 1', discountValue: 0, minOrder: 'Min ₹599', maxDiscount: '',
    affiliateLink: 'https://myntra.com/?affid=wouchify', status: 'inactive',
    isExclusive: false, isFeatured: false, isVerified: false, telegramAlert: false,
    startDate: '2026-08-01', expiryDate: '2026-09-30', usageCount: 301, totalUses: 500, addedOn: '2026-08-01',
  },
  {
    id: 'c4', title: '₹200 Grocery Cashback', description: 'Cashback via Paytm wallet.',
    store: 'Big Basket', category: 'Grocery', code: 'FRESH200', couponType: 'cashback',
    discount: '₹200 Cashback', discountValue: 200, minOrder: 'Min ₹1000', maxDiscount: '',
    affiliateLink: 'https://bigbasket.com/?affid=wouchify', status: 'active',
    isExclusive: true, isFeatured: false, isVerified: true, telegramAlert: true,
    startDate: '2026-09-08', expiryDate: '2026-09-11', usageCount: 88, totalUses: 200, addedOn: '2026-09-08',
  },
  {
    id: 'c5', title: 'HDFC 10% Off on Flipkart', description: 'HDFC credit/debit card offer.',
    store: 'Flipkart', category: 'Electronics', code: 'HDFC10', couponType: 'bank',
    discount: '10% OFF', discountValue: 10, minOrder: 'Min ₹3000', maxDiscount: 'Max ₹1500',
    affiliateLink: 'https://flipkart.com/?affid=wouchify', status: 'scheduled',
    isExclusive: false, isFeatured: false, isVerified: true, telegramAlert: false,
    startDate: '2026-09-15', expiryDate: '2026-09-20', usageCount: 0, totalUses: 0, addedOn: '2026-09-09',
  },
  {
    id: 'c6', title: 'Free Delivery on Zepto', description: 'No delivery charge on first 5 orders.',
    store: 'Zepto', category: 'Food', code: 'ZEPTO0DEL', couponType: 'freebie',
    discount: 'Free Delivery', discountValue: 0, minOrder: 'No minimum', maxDiscount: '',
    affiliateLink: 'https://zeptonow.com/?affid=wouchify', status: 'active',
    isExclusive: true, isFeatured: true, isVerified: true, telegramAlert: true,
    startDate: '2026-09-01', expiryDate: '2026-10-01', usageCount: 654, totalUses: 1000, addedOn: '2026-09-01',
  },
  {
    id: 'c7', title: '30% Off on Nykaa Beauty', description: 'Valid on skin care range.',
    store: 'Nykaa', category: 'Beauty', code: 'GLOW30', couponType: 'percent',
    discount: '30% OFF', discountValue: 30, minOrder: 'Min ₹499', maxDiscount: 'Max ₹250',
    affiliateLink: 'https://nykaa.com/?affid=wouchify', status: 'expired',
    isExclusive: false, isFeatured: false, isVerified: false, telegramAlert: false,
    startDate: '2026-08-15', expiryDate: '2026-09-05', usageCount: 1100, totalUses: 0, addedOn: '2026-08-15',
  },
  {
    id: 'c8', title: '₹300 Off on Pepperfry Furniture', description: 'Home & furniture category.',
    store: 'Pepperfry', category: 'Home', code: 'HOME300', couponType: 'flat',
    discount: '₹300 OFF', discountValue: 300, minOrder: 'Min ₹2000', maxDiscount: '',
    affiliateLink: 'https://pepperfry.com/?affid=wouchify', status: 'active',
    isExclusive: false, isFeatured: false, isVerified: true, telegramAlert: false,
    startDate: '2026-09-06', expiryDate: '2026-11-06', usageCount: 210, totalUses: 0, addedOn: '2026-09-06',
  },
]

const CATEGORY_OPTIONS = ['All', ...Array.from(new Set(MOCK_COUPONS.map(c => c.category)))]

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
   Customer Preview Modal
   ============================================================ */

const CouponPreviewModal: React.FC<{ coupon: Coupon; onClose: () => void }> = ({ coupon, onClose }) => {
  const [copied, setCopied] = useState(false)
  const days = daysLeft(coupon.expiryDate)
  const pill = expiryPill(days)
  const typeColor = couponTypeColor(coupon.couponType)

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 460, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title"><Eye size={18} style={{ marginRight: 8 }} />Customer View</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Coupon card */}
          <div style={{
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            {/* Top colour band */}
            <div style={{ background: typeColor, padding: '20px 24px', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {couponTypeLabel(coupon.couponType)} · {coupon.store}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.2 }}>{coupon.discount}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: 4, opacity: 0.9 }}>{coupon.title}</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: 10,
                  padding: '6px 12px', fontSize: '0.72rem', fontWeight: 700,
                  backdropFilter: 'blur(4px)',
                }}>
                  {coupon.isExclusive ? '⭐ Exclusive' : '🏷 Coupon'}
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', marginLeft: -10, flexShrink: 0 }} />
              <div style={{ flex: 1, borderTop: '2px dashed #e2e8f0' }} />
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', marginRight: -10, flexShrink: 0 }} />
            </div>

            {/* Bottom section */}
            <div style={{ background: '#f8fafc', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Code + Copy */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  flex: 1, background: 'white', border: '2px dashed #cbd5e1',
                  borderRadius: 10, padding: '10px 16px',
                  fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem',
                  letterSpacing: '3px', color: '#0f172a', textAlign: 'center',
                }}>
                  {coupon.code}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1600)
                  }}
                  style={{
                    background: copied ? '#22c55e' : typeColor,
                    color: 'white', border: 'none', borderRadius: 10,
                    padding: '10px 18px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem',
                    transition: 'background 0.2s',
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Details row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.76rem', color: '#475569' }}>
                {coupon.minOrder && <div>🛒 {coupon.minOrder}</div>}
                {coupon.maxDiscount && <div>🔒 {coupon.maxDiscount}</div>}
                <div style={{ color: pill.color, fontWeight: 600 }}>⏰ {pill.label}</div>
                <div>👁 {coupon.usageCount.toLocaleString()} used</div>
              </div>

              {coupon.description && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                  {coupon.description}
                </div>
              )}

              <a href={coupon.affiliateLink} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#0f172a', color: 'white', borderRadius: 10,
                  padding: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
                }}
              >
                <ExternalLink size={14} /> Shop Now at {coupon.store}
              </a>
            </div>
          </div>

          {/* Meta badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {coupon.isVerified && <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>✓ Verified</span>}
            {coupon.isExclusive && <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>⭐ Exclusive</span>}
            {coupon.isFeatured && <span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>🔥 Featured</span>}
            {coupon.telegramAlert && <span style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>📨 Telegram</span>}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-save" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Add / Edit Modal
   ============================================================ */

interface CouponFormProps {
  editing: Coupon | null
  onClose: () => void
  onSave: (c: Coupon) => void
}

const CouponFormModal: React.FC<CouponFormProps> = ({ editing, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<Coupon>>(editing ? { ...editing } : { ...EMPTY_FORM })
  const set = (k: keyof Coupon, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title?.trim()) return alert('Coupon title is required')
    if (!form.code?.trim())  return alert('Coupon code is required')
    if (!form.expiryDate)    return alert('Expiry date is required')
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

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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

          {/* Row: Min Order + Max Discount + Affiliate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Min Order</label>
              <input type="text" placeholder="e.g., Min ₹999 or No minimum"
                value={form.minOrder ?? ''} onChange={e => set('minOrder', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Max Discount Cap</label>
              <input type="text" placeholder="e.g., Max ₹300"
                value={form.maxDiscount ?? ''} onChange={e => set('maxDiscount', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Affiliate / Tracking Link</label>
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
              <label>Expiry Date <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="date" value={form.expiryDate ?? ''} onChange={e => set('expiryDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="form-group">
              <label>Usage Cap (0 = ∞)</label>
              <input type="number" min={0} placeholder="0"
                value={form.totalUses ?? 0} onChange={e => set('totalUses', Number(e.target.value))} />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {([
              ['isVerified',   '✓ Verified'],
              ['isExclusive',  '⭐ Exclusive'],
              ['isFeatured',   '🔥 Featured'],
              ['telegramAlert','📨 Telegram Alert'],
            ] as [keyof Coupon, string][]).map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: '#475569' }}>
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

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {editing ? 'Save Changes' : 'Add Coupon'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Main Page
   ============================================================ */

export const ExecutiveCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | CouponStatus>('all')
  const [filterType, setFilterType] = useState<'all' | CouponType>('all')
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'expiry' | 'discount' | 'usage' | 'added'>('expiry')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [previewing, setPreviewing] = useState<Coupon | null>(null)

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
      if (sortBy === 'added')    return b.addedOn.localeCompare(a.addedOn)
      return 0
    })
    return list
  }, [coupons, search, filterStatus, filterType, filterCategory, sortBy])

  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (c: Coupon) => { setEditing(c); setIsFormOpen(true) }

  const handleSave = (data: Coupon) => {
    setCoupons(prev =>
      editing ? prev.map(c => c.id === data.id ? data : c) : [data, ...prev]
    )
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this coupon permanently?')) {
      setCoupons(prev => prev.filter(c => c.id !== id))
    }
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                    <Ticket size={40} strokeWidth={1} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    No coupons match your filters
                  </td>
                </tr>
              ) : filtered.map(coupon => {
                const days = daysLeft(coupon.expiryDate)
                const pill = expiryPill(days)
                const pct = usagePct(coupon)
                const tColor = couponTypeColor(coupon.couponType)
                const sc = statusConfig(coupon.status)

                return (
                  <tr key={coupon.id}>
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
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn" onClick={() => setPreviewing(coupon)} title="Preview"><Eye size={15} /></button>
                        <button className="action-btn" onClick={() => openEdit(coupon)} title="Edit"><Edit2 size={15} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(coupon.id)} title="Delete"><Trash2 size={15} /></button>
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
      {previewing && (
        <CouponPreviewModal coupon={previewing} onClose={() => setPreviewing(null)} />
      )}
    </ExecutiveLayout>
  )
}
