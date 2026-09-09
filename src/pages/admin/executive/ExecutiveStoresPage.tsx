import React, { useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
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
import { FAVOURITE_STORES, STORE_CATEGORIES } from '../../../data/storesHero'
import { ImageUploadField } from './ImageUploadField'

/* ============================================================
   Types
   ============================================================ */

type StoreStatus = 'active' | 'inactive' | 'featured'
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
  addedOn: string
}

/* ============================================================
   Seed data from FAVOURITE_STORES
   ============================================================ */

const CATEGORY_LIST: StoreCategory[] = [...STORE_CATEGORIES]

function buildMockStores(): ManagedStore[] {
  return FAVOURITE_STORES.map((s, i) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logo as unknown as string,
    category: s.category as StoreCategory,
    reward: s.reward,
    description: s.description,
    affiliateLink: `https://${s.slug}.com/?affid=wouchify`,
    cardBg: s.cardBg,
    badgeBg: s.badgeBg,
    status: i % 5 === 2 ? 'inactive' : i % 7 === 0 ? 'featured' : 'active',
    isFeatured: i % 7 === 0,
    clicks: Math.floor(Math.random() * 9000) + 500,
    totalDeals: Math.floor(Math.random() * 120) + 5,
    addedOn: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }))
}

const INITIAL_STORES = buildMockStores()

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
  return 'Active'
}
function statusClass(s: StoreStatus) {
  if (s === 'featured') return 'loot-badge-glitch'
  if (s === 'inactive') return 'status-badge inactive'
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

const StorePreviewCard: React.FC<{ store: Partial<ManagedStore> }> = ({ store }) => (
  <div
    className="store-preview-card"
    style={{ background: store.cardBg || '#E8F5FF' }}
  >
    <div className="store-preview-badge" style={{ background: store.badgeBg || '#B3DCFA' }}>
      <Tag size={10} />
      <span>{store.category || 'Category'}</span>
    </div>
    <div className="store-preview-logo-wrap">
      {store.logoUrl ? (
        <img src={store.logoUrl as string} alt={store.name} className="store-preview-logo" />
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

  const set = (key: keyof ManagedStore, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = () => {
    if (!form.name?.trim()) return alert('Store name is required')
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
                    alert('Store name is required')
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
      </div>
    </div>
  )
}

/* ============================================================
   Customer Preview Modal
   ============================================================ */

const CustomerPreviewModal: React.FC<{
  store: ManagedStore
  onClose: () => void
}> = ({ store, onClose }) => {
  const [copied, setCopied] = useState(false)

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 480, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title"><Eye size={18} style={{ marginRight: 8 }} />Customer View</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Large preview card */}
          <div
            style={{
              width: '100%', maxWidth: 360,
              borderRadius: 20, padding: '28px 24px',
              background: store.cardBg,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}
          >
            <div style={{
              background: store.badgeBg, borderRadius: 20,
              padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700,
              color: '#0f172a', display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Tag size={10} />{store.category}
            </div>
            <div style={{
              width: 90, height: 90, borderRadius: 18,
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              {store.logoUrl ? (
                <img src={store.logoUrl as string} alt={store.name} style={{ width: 70, height: 70, objectFit: 'contain' }} />
              ) : (
                <StoreIcon size={36} color="#94a3b8" />
              )}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{store.name}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444' }}>{store.reward}</div>
            <div style={{ fontSize: '0.82rem', color: '#475569', textAlign: 'center' }}>{store.description}</div>
            <div style={{
              marginTop: 6, background: '#0f172a', color: 'white',
              borderRadius: 10, padding: '10px 28px', fontWeight: 700, fontSize: '0.9rem',
            }}>
              Shop at {store.name} →
            </div>
          </div>

          {/* Affiliate link */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Affiliate Link</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, background: '#f8fafc', borderRadius: 8, padding: '8px 12px',
                fontSize: '0.8rem', color: '#3b82f6', overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', border: '1px solid #e2e8f0',
              }}>
                {store.affiliateLink}
              </div>
              <button
                onClick={() => copyToClipboard(store.affiliateLink, setCopied)}
                style={{
                  padding: '8px 14px', background: copied ? '#22c55e' : '#0f172a',
                  color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 5, fontSize: '0.8rem', transition: 'background 0.2s',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            {[
              { label: 'Total Clicks', value: store.clicks.toLocaleString() },
              { label: 'Active Deals', value: store.totalDeals },
              { label: 'Status', value: statusLabel(store.status) },
            ].map(item => (
              <div key={item.label} style={{
                flex: 1, background: '#f8fafc', borderRadius: 10, padding: '12px',
                textAlign: 'center', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{item.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <a href={store.affiliateLink} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#3b82f6', color: 'white', border: 'none',
              borderRadius: 8, padding: '10px 18px', fontWeight: 600, textDecoration: 'none',
            }}
          >
            <ExternalLink size={16} /> Open Link
          </a>
          <button className="btn-save" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
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
}> = ({ store, onEdit, onDelete, onPreview }) => (
  <div className="store-grid-card" style={{ borderTop: `4px solid ${store.badgeBg}` }}>
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
      width: 64, height: 64, borderRadius: 14,
      background: store.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 10px',
    }}>
      {store.logoUrl ? (
        <img src={store.logoUrl as string} alt={store.name}
          style={{ width: 52, height: 52, objectFit: 'contain' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <StoreIcon size={28} color="#94a3b8" />
      )}
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

    <div style={{ display: 'flex', gap: 6 }}>
      <button className="action-btn" onClick={onPreview} title="Preview" style={{ flex: 1 }}><Eye size={15} /></button>
      <button className="action-btn" onClick={onEdit} title="Edit" style={{ flex: 1 }}><Edit2 size={15} /></button>
      <button className="action-btn delete" onClick={onDelete} title="Delete" style={{ flex: 1 }}><Trash2 size={15} /></button>
    </div>
  </div>
)

/* ============================================================
   Main Page
   ============================================================ */

export const ExecutiveStoresPage: React.FC = () => {
  const [stores, setStores] = useState<ManagedStore[]>(INITIAL_STORES)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<StoreCategory | 'All Stores'>('All Stores')
  const [filterStatus, setFilterStatus] = useState<'all' | StoreStatus>('all')
  const [sortBy, setSortBy] = useState<'name' | 'clicks' | 'deals' | 'added'>('clicks')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<ManagedStore | null>(null)
  const [previewing, setPreviewing] = useState<ManagedStore | null>(null)

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
      if (sortBy === 'added') return b.addedOn.localeCompare(a.addedOn)
      return 0
    })
    return list
  }, [stores, search, filterCategory, filterStatus, sortBy])

  /* Actions */
  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (s: ManagedStore) => { setEditing(s); setIsFormOpen(true) }

  const handleSave = (data: ManagedStore) => {
    setStores(prev =>
      editing ? prev.map(s => s.id === data.id ? data : s) : [data, ...prev]
    )
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this store? This cannot be undone.')) {
      setStores(prev => prev.filter(s => s.id !== id))
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
              <option value="featured">Featured</option>
              <option value="inactive">Inactive</option>
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
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                <StoreIcon size={48} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.4 }} />
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>No stores found</div>
                <div style={{ fontSize: '0.85rem', marginTop: 4 }}>Try adjusting filters or add a new store</div>
              </div>
            ) : (
              <div className="stores-grid">
                {filtered.map(store => (
                  <StoreGridCard
                    key={store.id}
                    store={store}
                    onEdit={() => openEdit(store)}
                    onDelete={() => handleDelete(store.id)}
                    onPreview={() => setPreviewing(store)}
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No stores match your filters
                    </td>
                  </tr>
                ) : filtered.map(store => (
                  <tr key={store.id}>
                    {/* Store logo + name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                          background: store.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {store.logoUrl ? (
                            <img src={store.logoUrl as string} alt={store.name}
                              style={{ width: 32, height: 32, objectFit: 'contain' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : <StoreIcon size={18} color="#94a3b8" />}
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
                    <td style={{ maxWidth: 180 }}>
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
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn" onClick={() => setPreviewing(store)} title="Preview">
                          <Eye size={15} />
                        </button>
                        <button className="action-btn" onClick={() => openEdit(store)} title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(store.id)} title="Delete">
                          <Trash2 size={15} />
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
      {previewing && (
        <CustomerPreviewModal
          store={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}
    </ExecutiveLayout>
  )
}
