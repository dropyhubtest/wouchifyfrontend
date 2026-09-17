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
  LayoutGrid,
  List,
  Store as StoreIcon,
  CheckCircle2,
  XCircle,
  Filter,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Globe,
  Percent,
  ShoppingBag,
  RotateCcw,
  Star,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react'
import './ExecutiveShared.css'
import { STORE_CATEGORIES } from '../../../data/storesHero'
import { getStoreLogo } from '../../../data/dealsPage'
import { ImageUploadField } from './ImageUploadField'
import { TableRowSkeleton, StoreCardSkeleton, EmptyState } from '../../../components/common/Skeletons'
import { AdminConfirmDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

/* ============================================================
   Types
   ============================================================ */

type StoreStatus = 'active' | 'inactive' | 'featured' | 'pending' | 'rejected'
type StoreCategory = typeof STORE_CATEGORIES[number]

interface ManagedStore {
  id: string
  name: string
  slug: string
  logoUrl: string
  category: StoreCategory
  reward: string
  description: string
  affiliateLink: string
  cardBg: string
  badgeBg: string
  status: StoreStatus
  isFeatured: boolean
  clicks: number
  totalDeals: number
  addedOn?: string
  createdAt?: string
  _id?: string
}

const CATEGORY_LIST: StoreCategory[] = [...STORE_CATEGORIES]

const EMPTY_FORM: Partial<ManagedStore> = {
  name: '',
  slug: '',
  logoUrl: '',
  category: 'Fashion',
  reward: '',
  description: '',
  affiliateLink: '',
  cardBg: '#E8F5FF',
  badgeBg: '#B3DCFA',
  status: 'active',
  isFeatured: false,
}

/* ============================================================
   Helpers
   ============================================================ */

function statusLabel(s: StoreStatus) {
  if (s === 'featured') return 'Featured'
  if (s === 'inactive') return 'Inactive'
  if (s === 'pending') return 'Pending'
  if (s === 'rejected') return 'Rejected'
  return 'Active'
}
function statusClass(s: StoreStatus) {
  if (s === 'featured') return 'loot-badge-glitch'
  if (s === 'inactive') return 'status-badge inactive'
  if (s === 'pending') return 'status-badge pending'
  if (s === 'rejected') return 'status-badge inactive'
  return 'status-badge active'
}

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  })
}

/* ============================================================
   Sub-components
   ============================================================ */

const KpiCard: React.FC<{
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color: string
}> = ({ label, value, sub, icon, color }) => (
  <div className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="kpi-icon" style={{ background: `${color}18`, color }}>{icon}</div>
    <div className="kpi-body">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  </div>
)

/* ============================================================
   Live Preview Card (customer-facing mini card)
   ============================================================ */

const StorePreviewCard: React.FC<{ store: Partial<ManagedStore> }> = ({ store }) => {
  const logoSrc = store.logoUrl || (store.name || store.slug ? getStoreLogo(store.slug || store.name) : '')

  return (
    <div
      className="store-preview-card"
      style={{ background: store.cardBg || '#E8F5FF' }}
    >
      <div className="store-preview-badge" style={{ background: store.badgeBg || '#B3DCFA' }}>
        <Tag size={10} />
        <span>{store.category || 'Category'}</span>
      </div>
      <div className="store-preview-logo-wrap">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={store.name || 'Store Logo'}
            className="store-preview-logo"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getStoreLogo(store.slug || store.name)
            }}
          />
        ) : (
          <div className="store-preview-logo-placeholder">
            <ImageIcon size={28} color="#94a3b8" />
          </div>
        )}
      </div>
      <div className="store-preview-name">{store.name || 'Store Name'}</div>
      <div className="store-preview-reward">{store.reward || 'Reward Info'}</div>
      <div className="store-preview-desc">{store.description || 'Store description goes here'}</div>
      <div className="store-preview-cta">Shop Now →</div>
    </div>
  )
}

/* ============================================================
   Add / Edit Modal
   ============================================================ */

interface StoreFormModalProps {
  editing: ManagedStore | null
  onClose: () => void
  onSave: (data: ManagedStore) => void
}

const COLOR_PRESETS = [
  { card: '#E8F5FF', badge: '#B3DCFA', label: 'Sky Blue' },
  { card: '#FFE6D3', badge: '#FFB67C', label: 'Orange' },
  { card: '#EFFFBF', badge: '#D1F170', label: 'Lime' },
  { card: '#FFEDF8', badge: '#FCA7E1', label: 'Pink' },
  { card: '#DFF4FF', badge: '#A8E0FF', label: 'Cyan' },
  { card: '#FFD9E8', badge: '#FFB0C8', label: 'Rose' },
  { card: '#FFE3F9', badge: '#FFB0EA', label: 'Lavender' },
  { card: '#FFF0BF', badge: '#FFE07A', label: 'Yellow' },
  { card: '#E7D2D7', badge: '#D4B0B9', label: 'Mauve' },
  { card: '#F0D3FF', badge: '#DCA8FF', label: 'Purple' },
]

const StoreFormModal: React.FC<StoreFormModalProps> = ({ editing, onClose, onSave }) => {
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<Partial<ManagedStore>>(
    editing ? { ...editing } : { ...EMPTY_FORM }
  )
  const [formAlert, setFormAlert] = useState<{ title: string; message: string } | null>(null)

  const set = (key: keyof ManagedStore, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = () => {
    if (!form.name?.trim()) {
      setFormAlert({ title: 'Missing Store Name', message: 'Store name is required.' })
      return
    }
    const now = new Date().toISOString().split('T')[0]
    onSave({
      id: editing?.id ?? `store-${Date.now()}`,
      name: form.name ?? '',
      slug: form.slug || (form.name ?? '').toLowerCase().replace(/\s+/g, '-'),
      logoUrl: form.logoUrl ?? '',
      category: (form.category as StoreCategory) ?? 'Fashion',
      reward: form.reward ?? '',
      description: form.description ?? '',
      affiliateLink: form.affiliateLink ?? '',
      cardBg: form.cardBg ?? '#E8F5FF',
      badgeBg: form.badgeBg ?? '#B3DCFA',
      status: (form.status as StoreStatus) ?? 'active',
      isFeatured: form.isFeatured ?? false,
      clicks: editing?.clicks ?? 0,
      totalDeals: editing?.totalDeals ?? 0,
      addedOn: editing?.addedOn ?? now,
    })
  }

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 880, width: '95vw' }}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            <StoreIcon size={20} style={{ marginRight: 8 }} />
            {editing ? 'Edit Store' : 'Add New Store'}
          </h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Stepper Header */}
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <div className="form-stepper" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 1 ? 'active' : ''} ${form.name ? 'completed' : ''}`}
              onClick={() => setFormStep(1)}
            >
              <div className="step-number">1</div>
              <div className="step-info">
                <span className="step-title">Step 1: Store Details & Links</span>
                <span className="step-desc">Name, category, offer text & link</span>
              </div>
            </button>
            <div className="step-divider">›</div>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 2 ? 'active' : ''} ${form.logoUrl ? 'completed' : ''}`}
              onClick={() => setFormStep(2)}
            >
              <div className="step-number">2</div>
              <div className="step-info">
                <span className="step-title">Step 2: Branding & Appearance</span>
                <span className="step-desc">Logo upload, color theme & status</span>
              </div>
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, paddingTop: 20 }}>
          {/* Form column */}
          <div>
            {formStep === 1 && (
              <div className="form-step-pane">
                {/* Row: Name + Slug */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Store Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      type="text"
                      placeholder="e.g., Amazon"
                      value={form.name ?? ''}
                      onChange={e => set('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL Slug</label>
                    <input
                      type="text"
                      placeholder="auto-generated"
                      value={form.slug ?? ''}
                      onChange={e => set('slug', e.target.value)}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>Store Category</label>
                  <select value={form.category ?? 'Fashion'} onChange={e => set('category', e.target.value)}>
                    {CATEGORY_LIST.filter(c => c !== 'All Stores').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Reward + Description */}
                <div className="form-group">
                  <label>Reward / Offer Text</label>
                  <input
                    type="text"
                    placeholder="e.g., Upto 6.8% rewards"
                    value={form.reward ?? ''}
                    onChange={e => set('reward', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Short Tagline / Description</label>
                  <input
                    type="text"
                    placeholder="e.g., 5000+ Live deals & Coupons"
                    value={form.description ?? ''}
                    onChange={e => set('description', e.target.value)}
                  />
                </div>

                {/* Affiliate Link */}
                <div className="form-group">
                  <label>Affiliate / Tracking Link</label>
                  <input
                    type="url"
                    placeholder="https://amazon.in/?tag=wouchify"
                    value={form.affiliateLink ?? ''}
                    onChange={e => set('affiliateLink', e.target.value)}
                  />
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="form-step-pane">
                {/* Logo Upload */}
                <ImageUploadField
                  label="Store Logo"
                  placeholder="https://logo.clearbit.com/amazon.com"
                  value={form.logoUrl as string ?? ''}
                  onChange={val => set('logoUrl', val)}
                />

                {/* Status */}
                <div className="form-group">
                  <label>Store Status</label>
                  <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="featured">Featured</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Color Presets */}
                <div className="form-group">
                  <label>Card Color Theme</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {COLOR_PRESETS.map(p => (
                      <button
                        key={p.label}
                        title={p.label}
                        type="button"
                        onClick={() => { set('cardBg', p.card); set('badgeBg', p.badge) }}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: p.card, border: form.cardBg === p.card
                            ? '3px solid #0f172a' : '2px solid #e2e8f0',
                          cursor: 'pointer', flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <input
                    type="checkbox"
                    id="store-featured"
                    checked={form.isFeatured ?? false}
                    onChange={e => set('isFeatured', e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#ef4444' }}
                  />
                  <label htmlFor="store-featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                    Mark as Featured Store on Wouchify
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Live Preview
            </div>
            <StorePreviewCard store={form} />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>
              Reflects how it appears to customers
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between', display: 'flex' }}>
          {formStep === 1 ? (
            <>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-save"
                onClick={() => {
                  if (!form.name?.trim()) {
                    setFormAlert({ title: 'Missing Store Name', message: 'Store name is required.' })
                    return
                  }
                  setFormStep(2)
                }}
              >
                Next: Branding & Theme &rarr;
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-cancel" onClick={() => setFormStep(1)}>&larr; Back to Step 1</button>
              <button type="button" className="btn-save" onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Store'}
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
   Deep Inspection Drawer
   ============================================================ */

const StoreDrawer: React.FC<{
  store: ManagedStore
  onClose: () => void
  onEdit: () => void
  onToggleStatus: () => void
  rawDeals: any[]
  rawLoots: any[]
  rawCoupons: any[]
}> = ({ store, onClose, onEdit, onToggleStatus, rawDeals, rawLoots, rawCoupons }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'loots' | 'coupons'>('overview')
  const [copied, setCopied] = useState(false)

  const storeDeals = useMemo(() => {
    return rawDeals.filter(d => d.store?.toLowerCase() === store.name.toLowerCase() || d.storeName?.toLowerCase() === store.name.toLowerCase())
  }, [rawDeals, store.name])

  const storeLoots = useMemo(() => {
    return rawLoots.filter(l => l.store?.toLowerCase() === store.name.toLowerCase() || l.storeName?.toLowerCase() === store.name.toLowerCase())
  }, [rawLoots, store.name])

  const storeCoupons = useMemo(() => {
    return rawCoupons.filter(c => c.store?.toLowerCase() === store.name.toLowerCase() || c.storeName?.toLowerCase() === store.name.toLowerCase())
  }, [rawCoupons, store.name])

  return (
    <>
      <div className="exec-drawer-overlay" onClick={onClose} />
      <div className="exec-drawer">
        <div className="exec-drawer__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="exec-drawer__avatar" style={{ background: store.cardBg || '#ffffff', padding: 8 }}>
              <img 
                src={store.logoUrl || getStoreLogo(store.slug || store.name)} 
                alt={store.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = getStoreLogo(store.slug || store.name) }}
              />
            </div>
            <div>
              <div className="exec-drawer__title">{store.name}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span style={{
                  background: store.badgeBg, borderRadius: 12,
                  padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, color: '#0f172a',
                }}>{store.category}</span>
                <span className={statusClass(store.status)} style={{ fontSize: '0.7rem' }}>
                  {statusLabel(store.status)}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>{store.reward}</span>
              </div>
            </div>
          </div>
          <button className="exec-drawer__close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="exec-drawer__stats">
          <div className="stat-box">
            <div className="stat-value">{storeDeals.length}</div>
            <div className="stat-label">Deals</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{storeLoots.length}</div>
            <div className="stat-label">Loot Deals</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{storeCoupons.length}</div>
            <div className="stat-label">Coupons</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{store.clicks.toLocaleString()}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
        </div>

        <div className="exec-drawer__tabs">
          <button className={`exec-drawer__tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`exec-drawer__tab ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')}>Deals ({storeDeals.length})</button>
          <button className={`exec-drawer__tab ${activeTab === 'loots' ? 'active' : ''}`} onClick={() => setActiveTab('loots')}>Loot Deals ({storeLoots.length})</button>
          <button className={`exec-drawer__tab ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>Coupons ({storeCoupons.length})</button>
        </div>

        <div className="exec-drawer__body">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="exec-drawer__item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Store Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Category</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{store.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Reward</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444' }}>{store.reward}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Status</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{statusLabel(store.status)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Date Added</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{store.addedOn || 'Recently'}</div>
                  </div>
                </div>
              </div>

              <div className="exec-drawer__item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>Affiliate Link</div>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <div style={{
                    flex: 1, background: '#f1f5f9', borderRadius: 6, padding: '8px 12px',
                    fontSize: '0.8rem', color: '#3b82f6', overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', border: '1px solid #e2e8f0',
                  }}>
                    {store.affiliateLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(store.affiliateLink, setCopied)}
                    style={{
                      padding: '8px 14px', background: copied ? '#22c55e' : '#0f172a',
                      color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex',
                      alignItems: 'center', gap: 5, fontSize: '0.8rem', transition: 'background 0.2s',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              
              <div className="exec-drawer__item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>Card Background Preview</div>
                <div style={{ display: 'flex', gap: 16 }}>
                   <div style={{ width: 40, height: 40, borderRadius: 8, background: store.cardBg, border: '1px solid #e2e8f0' }} title="Card Bg" />
                   <div style={{ width: 40, height: 40, borderRadius: 8, background: store.badgeBg, border: '1px solid #e2e8f0' }} title="Badge Bg" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {storeDeals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: '0.9rem' }}>No active deals found for this store.</div>
              ) : (
                storeDeals.map(d => (
                  <div key={d._id || d.id} className="exec-drawer__item">
                    <img src={d.imageUrl || d.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{d.price || d.dealPrice} <span style={{ textDecoration: 'line-through', color: '#cbd5e1', marginLeft: 4 }}>₹{d.originalPrice || d.mrp}</span></div>
                    </div>
                    {d.discount && (
                      <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>
                        {d.discount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'loots' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {storeLoots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: '0.9rem' }}>No active loot deals found for this store.</div>
              ) : (
                storeLoots.map(l => (
                  <div key={l._id || l.id} className="exec-drawer__item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{l.lootPrice || l.price} <span style={{ textDecoration: 'line-through', color: '#cbd5e1', marginLeft: 4 }}>₹{l.originalPrice || l.mrp}</span></div>
                    </div>
                    {l.lootType && (
                      <span className="loot-badge-glitch" style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem' }}>
                        {l.lootType}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'coupons' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
             {storeCoupons.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: '0.9rem' }}>No active coupons found for this store.</div>
             ) : (
               storeCoupons.map(c => (
                 <div key={c._id || c.id} className="exec-drawer__item">
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{c.code}</div>
                     <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>{c.discount || c.offerText}</div>
                     {c.expiryDate && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>Expires: {new Date(c.expiryDate).toLocaleDateString()}</div>}
                   </div>
                   <button 
                     onClick={() => navigator.clipboard.writeText(c.code)}
                     className="action-btn" title="Copy Code"
                   >
                     <Copy size={14} />
                   </button>
                 </div>
               ))
             )}
           </div>
          )}
        </div>

        <div className="exec-drawer__actions">
          <button className="btn-cancel" onClick={onToggleStatus}>
            {store.status === 'active' ? 'Deactivate' : 'Activate'} Store
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href={store.affiliateLink} target="_blank" rel="noopener noreferrer" className="btn-save" style={{ background: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={16} /> Open Store
            </a>
            <button className="btn-save" onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ============================================================
   Store Grid Card
   ============================================================ */

const StoreGridCard: React.FC<{
  store: ManagedStore
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
}> = ({ store, onEdit, onDelete, onPreview }) => {
  const logoSrc = store.logoUrl || getStoreLogo(store.slug || store.name)

  return (
    <div 
      className="store-grid-card" 
      style={{ borderTop: `4px solid ${store.badgeBg}`, cursor: 'pointer' }}
      onClick={onPreview}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          background: store.badgeBg, borderRadius: 16, padding: '3px 10px',
          fontSize: '0.7rem', fontWeight: 700, color: '#0f172a',
        }}>
          {store.category}
        </div>
        <span className={statusClass(store.status)} style={{ fontSize: '0.68rem' }}>
          {statusLabel(store.status)}
        </span>
      </div>

      <div style={{
        width: 84, height: 46, borderRadius: 10,
        background: store.cardBg || '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 10px', padding: '4px 8px', border: '1px solid rgba(0,0,0,0.06)'
      }}>
        <img
          src={logoSrc}
          alt={store.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={e => { (e.currentTarget as HTMLImageElement).src = getStoreLogo(store.slug || store.name) }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{store.name}</div>
        <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, marginTop: 2 }}>{store.reward}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{store.description}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{store.clicks.toLocaleString()}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Clicks</div>
        </div>
        <div style={{ width: 1, background: '#e2e8f0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{store.totalDeals}</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Deals</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
        <button className="action-btn" onClick={onPreview} title="Preview" style={{ flex: 1 }}><Eye size={15} /></button>
        <button className="action-btn" onClick={onEdit} title="Edit" style={{ flex: 1 }}><Edit2 size={15} /></button>
        <button className="action-btn delete" onClick={onDelete} title="Delete" style={{ flex: 1 }}><Trash2 size={15} /></button>
      </div>
    </div>
  )
}

/* ============================================================
   Main Page
   ============================================================ */

export const ExecutiveStoresPage: React.FC = () => {
  const [stores, setStores] = useState<ManagedStore[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<StoreCategory | 'All Stores'>('All Stores')
  const [filterStatus, setFilterStatus] = useState<'all' | StoreStatus>('all')
  const [sortBy, setSortBy] = useState<'name' | 'clicks' | 'deals' | 'added'>('clicks')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<ManagedStore | null>(null)
  const [inspectedStore, setInspectedStore] = useState<ManagedStore | null>(null)

  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [rawLoots, setRawLoots] = useState<any[]>([])
  const [rawCoupons, setRawCoupons] = useState<any[]>([])

  const fetchLiveStores = async () => {
    setLoading(true)
    try {
      const [res, dealsRes, lootsRes, couponsRes] = await Promise.all([
        adminApi.getStores(),
        adminApi.getDeals().catch(() => []),
        adminApi.getLootDeals().catch(() => []),
        adminApi.getCoupons().catch(() => [])
      ])
      
      if (Array.isArray(res)) {
        const mapped: ManagedStore[] = res.map((s: any) => ({
          id: String(s._id || s.id),
          _id: String(s._id || s.id),
          name: s.name,
          slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
          logoUrl: s.logoUrl || s.logo || getStoreLogo(s.slug || s.name),
          category: (s.category as StoreCategory) || 'Fashion',
          reward: s.reward || 'Upto 5% rewards',
          description: s.description || `${s.name} online deals & cashback`,
          affiliateLink: s.affiliateLink || `https://${(s.slug || s.name).toLowerCase().replace(/\s+/g, '')}.com/?tag=wouchify`,
          cardBg: s.cardBg || '#E8F5FF',
          badgeBg: s.badgeBg || '#B3DCFA',
          status: (s.status as StoreStatus) || 'active',
          isFeatured: Boolean(s.isFeatured),
          clicks: s.clicks || 0,
          totalDeals: s.totalDeals || 0,
          addedOn: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'Recently'
        }))
        setStores(mapped)
      } else {
        setStores([])
      }

      setRawDeals(Array.isArray(dealsRes) ? dealsRes : (dealsRes as any).data || [])
      setRawLoots(Array.isArray(lootsRes) ? lootsRes : (lootsRes as any).data || [])
      setRawCoupons(Array.isArray(couponsRes) ? couponsRes : (couponsRes as any).data || [])
    } catch (err) {
      console.warn('Data fetch error:', err)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveStores()

    const handleSync = () => { fetchLiveStores() }
    window.addEventListener('wouchify_store_clicked', handleSync)
    window.addEventListener('wouchify_stores_updated', handleSync)
    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('wouchify_loot_deals_updated', handleSync)
    window.addEventListener('wouchify_coupons_updated', handleSync)
    return () => {
      window.removeEventListener('wouchify_store_clicked', handleSync)
      window.removeEventListener('wouchify_stores_updated', handleSync)
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('wouchify_loot_deals_updated', handleSync)
      window.removeEventListener('wouchify_coupons_updated', handleSync)
    }
  }, [])

  /* KPI stats */
  const kpi = useMemo(() => ({
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    featured: stores.filter(s => s.status === 'featured').length,
    inactive: stores.filter(s => s.status === 'inactive').length,
    totalClicks: stores.reduce((a, s) => a + s.clicks, 0),
    totalDeals: stores.reduce((a, s) => a + s.totalDeals, 0),
  }), [stores])

  /* Filtered + sorted stores */
  const filtered = useMemo(() => {
    let list = [...stores]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.reward.toLowerCase().includes(q)
      )
    }
    if (filterCategory !== 'All Stores') list = list.filter(s => s.category === filterCategory)
    if (filterStatus !== 'all') list = list.filter(s => s.status === filterStatus)
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'clicks') return b.clicks - a.clicks
      if (sortBy === 'deals') return b.totalDeals - a.totalDeals
      if (sortBy === 'added') return (b.addedOn || '').localeCompare(a.addedOn || '')
      return 0
    })
    return list
  }, [stores, search, filterCategory, filterStatus, sortBy])

  /* Actions */
  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (s: ManagedStore) => { setEditing(s); setIsFormOpen(true) }
  const [storeAlert, setStoreAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'danger' | 'info' | 'success' } | null>(null)

  const handleSave = async (data: ManagedStore) => {
    try {
      const payload = { ...data, logo: data.logoUrl }
      if (editing && (editing._id || editing.id)) {
        await adminApi.updateStore(editing._id || editing.id, payload)
      } else {
        await adminApi.createStore(payload)
      }
      fetchLiveStores()
      setIsFormOpen(false)
    } catch (err: any) {
      console.error('Failed to save store', err)
      const errorMsg = err.response?.data?.message || 'Failed to save store'
      setStoreAlert({ title: 'Save Failed', message: errorMsg, variant: 'danger' })
    }
  }

  const [storeToDelete, setStoreToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setStoreToDelete(id)
  }

  const confirmDelete = async () => {
    if (!storeToDelete) return
    try {
      await adminApi.deleteStore(storeToDelete)
      fetchLiveStores()
    } catch (err) {
      console.error('Failed to delete store', err)
    } finally {
      setStoreToDelete(null)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setFilterCategory('All Stores')
    setFilterStatus('all')
    setSortBy('clicks')
  }

  const hasActiveFilters = search || filterCategory !== 'All Stores' || filterStatus !== 'all'

  return (
    <ExecutiveLayout activeMenu="stores">
      <div className="executive-crud-page">

        {/* ── Page Header ── */}
        <div className="crud-header">
          <div>
            <h2 className="crud-title">Store Management</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Manage all partner stores, affiliate links & brand visibility
            </p>
          </div>
          <button className="crud-add-btn" onClick={openAdd}>
            <Plus size={18} /> Add New Store
          </button>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon" style={{ marginBottom: 24 }}>
          <KpiCard label="Total Stores" value={kpi.total} sub="In directory" icon={<StoreIcon size={20} />} color="#6366f1" />
          <KpiCard label="Active" value={kpi.active} sub="Serving users" icon={<CheckCircle2 size={20} />} color="#22c55e" />
          <KpiCard label="Featured" value={kpi.featured} sub="Homepage spotlight" icon={<Star size={20} />} color="#f59e0b" />
          <KpiCard label="Inactive" value={kpi.inactive} sub="Hidden from users" icon={<XCircle size={20} />} color="#ef4444" />
          <KpiCard label="Total Clicks" value={kpi.totalClicks.toLocaleString()} sub="All-time" icon={<TrendingUp size={20} />} color="#3b82f6" />
          <KpiCard label="Total Deals" value={kpi.totalDeals} sub="Across all stores" icon={<ShoppingBag size={20} />} color="#8b5cf6" />
        </div>

        {/* ── Filters Bar ── */}
        <div className="crud-filters" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div className="crud-search" style={{ minWidth: 220 }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search stores…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="crud-filter-select">
            <Filter size={15} style={{ color: '#94a3b8' }} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as StoreCategory | 'All Stores')}>
              {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status filter */}
          <div className="crud-filter-select">
            <Globe size={15} style={{ color: '#94a3b8' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | StoreStatus)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
              <option value="inactive">Inactive</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort */}
          <div className="crud-filter-select">
            <Percent size={15} style={{ color: '#94a3b8' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="clicks">Sort: Most Clicks</option>
              <option value="deals">Sort: Most Deals</option>
              <option value="name">Sort: A → Z</option>
              <option value="added">Sort: Newest First</option>
            </select>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="action-btn" title="Reset filters" style={{ flexShrink: 0 }}>
              <RotateCcw size={15} />
            </button>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Result count */}
          <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
            {filtered.length} of {stores.length} stores
          </span>

          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`view-toggle-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* ── Grid View ── */}
        {viewMode === 'grid' && (
          <>
            {loading ? (
              <div className="skeletons-grid-stores" style={{ padding: '20px 0' }}>
                {[...Array(8)].map((_, i) => (
                  <StoreCardSkeleton key={`store-skel-${i}`} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No Stores Found"
                message="No stores match your filters in the database."
                actionText="Add New Store"
                onAction={openAdd}
              />
            ) : (
              <div className="stores-grid">
                {filtered.map(store => (
                  <StoreGridCard
                    key={store.id}
                    store={store}
                    onEdit={() => openEdit(store)}
                    onDelete={() => handleDeleteClick(store._id || store.id)}
                    onPreview={() => setInspectedStore(store)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Table View ── */}
        {viewMode === 'table' && (
          <div className="crud-table-container">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Category</th>
                  <th>Reward</th>
                  <th>Affiliate Link</th>
                  <th>Clicks</th>
                  <th>Deals</th>
                  <th>Status</th>
                  <th>Added</th>
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
                        title="No Stores Found"
                        message="No stores match your filters in the database."
                        actionText="Add New Store"
                        onAction={openAdd}
                      />
                    </td>
                  </tr>
                ) : filtered.map(store => (
                  <tr 
                    key={store.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setInspectedStore(store)}
                  >
                    {/* Store logo + name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 50, height: 32, borderRadius: 8, flexShrink: 0,
                          background: store.cardBg || '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '2px 4px', border: '1px solid #e2e8f0'
                        }}>
                          <img
                            src={store.logoUrl || getStoreLogo(store.slug || store.name)}
                            alt={store.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={e => { (e.currentTarget as HTMLImageElement).src = getStoreLogo(store.slug || store.name) }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{store.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{store.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: store.badgeBg, borderRadius: 12,
                        padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a',
                      }}>{store.category}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>{store.reward}</td>
                    <td style={{ maxWidth: 180 }} onClick={e => e.stopPropagation()}>
                      <a
                        href={store.affiliateLink} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none',
                          display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {store.affiliateLink}
                      </a>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{store.clicks.toLocaleString()}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{store.totalDeals}</td>
                    <td>
                      <span className={statusClass(store.status)} style={{ fontSize: '0.72rem' }}>
                        {statusLabel(store.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{store.addedOn}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn" onClick={() => setInspectedStore(store)} title="Preview">
                          <Eye size={15} />
                        </button>
                        <button className="action-btn" onClick={() => openEdit(store)} title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button className="crud-action-btn delete" onClick={() => handleDeleteClick(store._id || store.id)} title="Delete Store">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ── Modals ── */}
      {isFormOpen && (
        <StoreFormModal
          editing={editing}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
      {inspectedStore && (
        <StoreDrawer
          store={inspectedStore}
          onClose={() => setInspectedStore(null)}
          onEdit={() => {
            setInspectedStore(null)
            openEdit(inspectedStore)
          }}
          onToggleStatus={() => {
            const newStatus = inspectedStore.status === 'active' ? 'inactive' : 'active'
            handleSave({ ...inspectedStore, status: newStatus })
            setInspectedStore({ ...inspectedStore, status: newStatus })
          }}
          rawDeals={rawDeals}
          rawLoots={rawLoots}
          rawCoupons={rawCoupons}
        />
      )}

      {/* ── CUSTOM CONFIRM DIALOG ── */}
      <AdminConfirmDialog
        isOpen={!!storeToDelete}
        title="Delete Store"
        message="Are you sure you want to delete this store? This action cannot be undone and will remove it from all portals."
        confirmLabel="Delete Store"
        cancelLabel="Cancel"
        variant="danger"
        icon="trash"
        onConfirm={confirmDelete}
        onCancel={() => setStoreToDelete(null)}
      />

      {/* ── CUSTOM ALERT DIALOG ── */}
      {storeAlert && (
        <AdminAlertDialog
          isOpen={!!storeAlert}
          title={storeAlert.title}
          message={storeAlert.message}
          variant={storeAlert.variant || 'warning'}
          buttonLabel="Understood"
          onClose={() => setStoreAlert(null)}
        />
      )}
    </ExecutiveLayout>
  )
}
