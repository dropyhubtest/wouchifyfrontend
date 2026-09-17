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
  CreditCard as CardIcon,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Star,
  Percent,
  ExternalLink,
  Sparkles,
  Tag,
  Copy,
  Check,
  } from 'lucide-react'
import './ExecutiveShared.css'
import { ImageUploadField } from './ImageUploadField'
import { AdminConfirmDialog, AdminAlertDialog } from '../../../components/common/AdminDialog'

import indusindLogo from '../../../assets/creditcardpage/indusind_bank.png'
import iciciLogo from '../../../assets/creditcardpage/ICICI_bank.png'
import idfcLogo from '../../../assets/creditcardpage/IDFC_back.png'
import tataNeuLogo from '../../../assets/creditcardpage/Tata_neu.svg'
import axisLogo from '../../../assets/creditcardpage/Axis_Bank.png'
import bajajLogo from '../../../assets/creditcardpage/Bajaj-Finsery.png'

/* ============================================================
   Types
   ============================================================ */

type CardStatus = 'active' | 'inactive' | 'featured' | 'discontinued'
type CardNetwork = 'Visa' | 'Mastercard' | 'Rupay' | 'Amex' | 'Diners'
type CardTier = 'Entry' | 'Classic' | 'Premium' | 'Super Premium' | 'Infinite'
type CardSection = 'premium' | 'lifetime-free'
type CardTheme = 'white-blue' | 'white-red' | 'red-card' | 'navy-card'

interface CreditCard {
  id: string
  cardName: string
  bank: string
  network: CardNetwork
  tier: CardTier
  imageUrl: string
  bankLogoUrl: string

  /* Section & Design Theme */
  section: CardSection
  cardTheme: CardTheme
  tagText: string
  keyBenefitLabel: string
  rewardsLabel: string

  /* Offers */
  welcomeOffer: string
  rewardRate: string         // "5% Cashback", "4X Points"
  keyBenefits: string        // comma-separated short bullets
  partnerBrands: string      // "Amazon, Flipkart, Swiggy"
  affiliateLink: string

  /* Fees */
  annualFee: string
  joiningFee: string
  feeWaiver: string          // "Spend ₹1.5L/year"

  /* Validity */
  offerStartDate: string
  offerExpiryDate: string    // MANDATORY
  lastUpdated: string

  /* Meta */
  status: CardStatus
  submissionStatus?: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  isFeatured: boolean
  isVerified: boolean
  applyCount: number
  viewCount: number
  addedOn: string
}

import { TableRowSkeleton, EmptyState } from '../../../components/common/Skeletons'

/* ============================================================
   Constants
   ============================================================ */

const BANKS = ['IndusInd Bank', 'ICICI Bank', 'IDFC First Bank', 'TataNeu', 'Axis Bank', 'HDFC Bank', 'SBI Card', 'Kotak Mahindra']
const NETWORKS: CardNetwork[] = ['Visa', 'Mastercard', 'Rupay', 'Amex', 'Diners']
const TIERS: CardTier[] = ['Entry', 'Classic', 'Premium', 'Super Premium', 'Infinite']

const NETWORK_COLOR: Record<CardNetwork, string> = {
  Visa: '#1a1f71',
  Mastercard: '#eb001b',
  Rupay: '#007233',
  Amex: '#006fcf',
  Diners: '#004a97',
}

const EMPTY_FORM: Partial<CreditCard> = {
  cardName: '', bank: BANKS[0], network: 'Visa', tier: 'Classic',
  section: 'premium',
  cardTheme: 'white-blue',
  tagText: '',
  keyBenefitLabel: 'TOP BENEFIT',
  rewardsLabel: 'REWARDS',
  imageUrl: '', bankLogoUrl: '',
  welcomeOffer: '', rewardRate: '', keyBenefits: '', partnerBrands: '', affiliateLink: '',
  annualFee: '', joiningFee: '', feeWaiver: '',
  offerStartDate: new Date().toISOString().split('T')[0],
  offerExpiryDate: '',
  lastUpdated: new Date().toISOString().split('T')[0],
  status: 'active', isFeatured: false, isVerified: false,
  applyCount: 0, viewCount: 0,
}

/* ============================================================
   Helpers
   ============================================================ */

function daysLeft(date: string): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

function expiryPill(days: number) {
  if (days < 0) return { label: 'Offer Expired', bg: '#fee2e2', color: '#ef4444' }
  if (days === 0) return { label: 'Expires Today!', bg: '#fef3c7', color: '#d97706' }
  if (days <= 7) return { label: `${days}d left`, bg: '#fef3c7', color: '#d97706' }
  if (days <= 30) return { label: `${days}d left`, bg: '#fef9c3', color: '#ca8a04' }
  return { label: `${days}d left`, bg: '#dcfce7', color: '#16a34a' }
}

function statusCfg(s: CardStatus) {
  const m: Record<CardStatus, { label: string; bg: string; color: string }> = {
    active: { label: 'Active', bg: '#dcfce7', color: '#16a34a' },
    featured: { label: 'Featured', bg: '#ede9fe', color: '#7c3aed' },
    inactive: { label: 'Inactive', bg: '#f1f5f9', color: '#64748b' },
    discontinued: { label: 'Discontinued', bg: '#fee2e2', color: '#ef4444' },
  }
  return m[s]
}

const TIER_COLOR: Record<CardTier, string> = {
  'Entry': '#64748b',
  'Classic': '#3b82f6',
  'Premium': '#f59e0b',
  'Super Premium': '#8b5cf6',
  'Infinite': '#ef4444',
}

/* ============================================================
   Mini Card Visual
   ============================================================ */

const CardVisual: React.FC<{ card: Partial<CreditCard>; size?: 'sm' | 'lg' }> = ({ card, size = 'sm' }) => {
  // lg: fills parent width at 8:5 card ratio; sm: fixed 120×76
  const isLg = size === 'lg'
  const h = isLg ? undefined : 76
  const netColor = NETWORK_COLOR[(card.network as CardNetwork) ?? 'Visa']
  return (
    <div style={{
      width: isLg ? '100%' : 120,
      height: isLg ? 0 : h,
      paddingBottom: isLg ? '63%' : 0,   // 8:5 aspect ratio for lg
      borderRadius: isLg ? 16 : 8,
      background: `linear-gradient(135deg, ${netColor}dd 0%, ${netColor}88 100%)`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      boxShadow: isLg ? '0 12px 40px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      {/* Shimmer circle */}
      <div style={{
        position: 'absolute', width: '140%', height: '140%',
        borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
        top: '-40%', right: '-40%',
      }} />
      {/* Card image overlay */}
      {card.imageUrl && (
        <img src={card.imageUrl as string} alt={card.cardName}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
      )}
      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, padding: isLg ? 18 : 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {card.bankLogoUrl ? (
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              padding: isLg ? '3px 8px' : '2px 4px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
            }}>
              <img src={card.bankLogoUrl as string} alt="" style={{ height: isLg ? 18 : 10, maxWidth: isLg ? 80 : 45, objectFit: 'contain' }} />
            </div>
          ) : (
            <span style={{ fontSize: isLg ? '0.65rem' : '0.45rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{card.bank}</span>
          )}
          <span style={{ fontSize: isLg ? '0.7rem' : '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{card.network}</span>
        </div>
        <div>
          {isLg && (
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', marginBottom: 4 }}>•••• •••• •••• 4242</div>
          )}
          <div style={{ fontSize: isLg ? '0.85rem' : '0.5rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {card.cardName || 'Card Name'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Deep Inspection Slide-Over Drawer
   ============================================================ */

interface CardDrawerProps {
  card: CreditCard
  onClose: () => void
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
  rawCoupons: any[]
  rawDeals: any[]
}

const CreditCardDrawer: React.FC<CardDrawerProps> = ({
  card,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
  rawCoupons,
  rawDeals,
}) => {
  const [drawerTab, setDrawerTab] = useState<'overview' | 'benefits' | 'bank_offers' | 'performance'>('overview')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const days = daysLeft(card.offerExpiryDate)
  const pill = expiryPill(days)
  const sc = statusCfg(card.status)
  const tc = TIER_COLOR[card.tier]

  // Cross-reference deals and coupons matching bank name
  const bankName = card.bank.toLowerCase().replace(/bank/g, '').trim()
  const matchingDeals = useMemo(() => {
    return rawDeals.filter((d) => {
      const b = (d.store || d.brand || d.bankOffer || d.title || '').toLowerCase()
      return b.includes(bankName) || (card.partnerBrands && card.partnerBrands.toLowerCase().includes((d.store || '').toLowerCase()))
    })
  }, [rawDeals, bankName, card.partnerBrands])

  const matchingCoupons = useMemo(() => {
    return rawCoupons.filter((c) => {
      const b = (c.store || c.description || c.title || c.code || '').toLowerCase()
      return b.includes(bankName) || (card.partnerBrands && card.partnerBrands.toLowerCase().includes((c.store || '').toLowerCase()))
    })
  }, [rawCoupons, bankName, card.partnerBrands])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="exec-drawer-overlay" onClick={onClose}>
      <div className="exec-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="exec-drawer__header">
          <div className="exec-drawer__header-left">
            <div className="exec-drawer__avatar" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              {card.bankLogoUrl ? (
                <img src={card.bankLogoUrl} alt={card.bank} />
              ) : (
                <span><CardIcon size={20} color="#2F368C" /></span>
              )}
            </div>
            <div className="exec-drawer__header-info">
              <h3 className="exec-drawer__title">{card.cardName}</h3>
              <p className="exec-drawer__subtitle">{card.bank} · {card.network} · {card.tier}</p>
            </div>
          </div>
          <button className="exec-drawer__close" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="exec-drawer__stats">
          <div className="exec-drawer__stat">
            <div className="exec-drawer__stat-value" style={{ color: '#2F368C' }}>{card.applyCount.toLocaleString()}</div>
            <div className="exec-drawer__stat-label">Applications</div>
          </div>
          <div className="exec-drawer__stat">
            <div className="exec-drawer__stat-value" style={{ color: '#059669' }}>{card.rewardRate || 'N/A'}</div>
            <div className="exec-drawer__stat-label">Reward Rate</div>
          </div>
          <div className="exec-drawer__stat">
            <div className="exec-drawer__stat-value" style={{ color: '#E31E25' }}>{card.annualFee || '₹0'}</div>
            <div className="exec-drawer__stat-label">Annual Fee</div>
          </div>
          <div className="exec-drawer__stat">
            <div className="exec-drawer__stat-value" style={{ color: pill.color }}>{pill.label}</div>
            <div className="exec-drawer__stat-label">Offer Status</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="exec-drawer__tabs">
          <button
            className={`exec-drawer__tab ${drawerTab === 'overview' ? 'active' : ''}`}
            onClick={() => setDrawerTab('overview')}
          >
            Overview
          </button>
          <button
            className={`exec-drawer__tab ${drawerTab === 'benefits' ? 'active' : ''}`}
            onClick={() => setDrawerTab('benefits')}
          >
            Perks & Brands
          </button>
          <button
            className={`exec-drawer__tab ${drawerTab === 'bank_offers' ? 'active' : ''}`}
            onClick={() => setDrawerTab('bank_offers')}
          >
            Bank Offers <span className="exec-drawer__tab-count">{matchingDeals.length + matchingCoupons.length}</span>
          </button>
          <button
            className={`exec-drawer__tab ${drawerTab === 'performance' ? 'active' : ''}`}
            onClick={() => setDrawerTab('performance')}
          >
            Audit & Meta
          </button>
        </div>

        {/* Body Content */}
        <div className="exec-drawer__body">
          {drawerTab === 'overview' && (
            <div>
              {/* Card visual render */}
              <div style={{ marginBottom: 20 }}>
                <CardVisual card={card} size="lg" />
              </div>

              {/* Status and Tier Tags */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span className="status-badge active" style={{ background: `${tc}18`, color: tc, borderColor: `${tc}40` }}>
                  Tier: {card.tier}
                </span>
                {card.submissionStatus === 'pending_approval' ? (
                  <span className="status-badge" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
                    🟡 Awaiting Operational Manager Approval
                  </span>
                ) : card.submissionStatus === 'rejected' ? (
                  <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' }}>
                    🔴 Rejected by Ops Manager
                  </span>
                ) : (
                  <span className={`status-badge ${card.status}`}>
                    {sc.label}
                  </span>
                )}
                {card.isFeatured && (
                  <span className="status-badge" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
                    ★ Featured Card
                  </span>
                )}
                {card.isVerified && (
                  <span className="status-badge active">
                    ✓ Verified Partner
                  </span>
                )}
              </div>

              {/* Key Details Grid */}
              <div className="exec-drawer__section-title">Card Terms & Pricing</div>
              <div className="exec-drawer__detail-grid">
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Bank Institution</div>
                  <div className="exec-drawer__detail-value">{card.bank}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Card Network</div>
                  <div className="exec-drawer__detail-value">{card.network}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Joining Fee</div>
                  <div className="exec-drawer__detail-value">{card.joiningFee || '₹0'}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Annual Fee</div>
                  <div className="exec-drawer__detail-value">{card.annualFee || '₹0'}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Fee Waiver Condition</div>
                  <div className="exec-drawer__detail-value" style={{ color: '#059669' }}>{card.feeWaiver || 'None'}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Offer Expiry</div>
                  <div className="exec-drawer__detail-value">{card.offerExpiryDate}</div>
                </div>
              </div>

              {/* Welcome Offer Box */}
              {card.welcomeOffer && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 14, marginTop: 12 }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Welcome Benefit Offer</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#14532d', marginTop: 4 }}>{card.welcomeOffer}</div>
                </div>
              )}

              {/* Affiliate Apply Link */}
              {card.affiliateLink && (
                <a
                  href={card.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="exec-drawer__link-btn"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                >
                  <ExternalLink size={14} /> Open Partner Application Portal
                </a>
              )}
            </div>
          )}

          {drawerTab === 'benefits' && (
            <div>
              <div className="exec-drawer__section-title">Key Card Benefits</div>
              {card.keyBenefits ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {card.keyBenefits.split(',').map((b, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                      }}
                    >
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{b.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="exec-drawer__empty">
                  <p>No bullet points specified for this card.</p>
                </div>
              )}

              <div className="exec-drawer__section-title" style={{ marginTop: 24 }}>Partner & Merchant Cashback Tie-ups</div>
              {card.partnerBrands ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {card.partnerBrands.split(',').map((brand, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '6px 14px',
                        borderRadius: 9999,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {brand.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="exec-drawer__empty">
                  <p>No partner brand tags specified.</p>
                </div>
              )}
            </div>
          )}

          {drawerTab === 'bank_offers' && (
            <div>
              <div className="exec-drawer__section-title">Active Store Deals for {card.bank} ({matchingDeals.length})</div>
              {matchingDeals.length > 0 ? (
                matchingDeals.map((d: any, idx: number) => (
                  <div key={d._id || d.id || idx} className="exec-drawer__item">
                    <div className="exec-drawer__item-row">
                      {d.image && <img src={d.image} alt={d.title || d.name} className="exec-drawer__item-img" />}
                      <div className="exec-drawer__item-info">
                        <h4 className="exec-drawer__item-title">{d.title || d.name}</h4>
                        <div className="exec-drawer__item-meta">
                          <span className="exec-drawer__item-badge store">{d.store || 'Store'}</span>
                          <span className="exec-drawer__item-badge discount">{d.discount || d.discountLabel || 'Deal'}</span>
                          <span className="exec-drawer__item-badge price">{d.price || d.currentPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="exec-drawer__empty">
                  <p>No store deals currently mapped to {card.bank}.</p>
                </div>
              )}

              <div className="exec-drawer__section-title" style={{ marginTop: 20 }}>Bank Coupons & Codes ({matchingCoupons.length})</div>
              {matchingCoupons.length > 0 ? (
                matchingCoupons.map((c: any, idx: number) => (
                  <div key={c._id || c.id || idx} className="exec-drawer__item">
                    <div className="exec-drawer__item-row">
                      <div className="exec-drawer__item-info">
                        <h4 className="exec-drawer__item-title">{c.title || c.description || 'Bank Coupon'}</h4>
                        <div className="exec-drawer__coupon-row">
                          <span className="exec-drawer__coupon-code">{c.code}</span>
                          <button
                            className={`exec-drawer__copy-btn ${copiedCode === c.code ? 'copied' : ''}`}
                            onClick={() => handleCopy(c.code)}
                            title="Copy Code"
                          >
                            {copiedCode === c.code ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <span className="exec-drawer__item-badge discount">{c.discount || 'Discount'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="exec-drawer__empty">
                  <p>No coupon codes currently tied to {card.bank}.</p>
                </div>
              )}
            </div>
          )}

          {drawerTab === 'performance' && (
            <div>
              <div className="exec-drawer__section-title">Traffic & Application Analytics</div>
              <div className="exec-drawer__detail-grid">
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Total Applications</div>
                  <div className="exec-drawer__detail-value">{card.applyCount.toLocaleString()}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Total Page Views</div>
                  <div className="exec-drawer__detail-value">{card.viewCount.toLocaleString()}</div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Est. Conversion</div>
                  <div className="exec-drawer__detail-value" style={{ color: '#059669' }}>
                    {card.viewCount > 0 ? `${((card.applyCount / card.viewCount) * 100).toFixed(1)}%` : '—'}
                  </div>
                </div>
                <div className="exec-drawer__detail-cell">
                  <div className="exec-drawer__detail-label">Catalog Added On</div>
                  <div className="exec-drawer__detail-value">{card.addedOn}</div>
                </div>
              </div>

              <div className="exec-drawer__section-title" style={{ marginTop: 20 }}>Raw Data Payload</div>
              <pre
                style={{
                  background: '#0f172a',
                  color: '#94a3b8',
                  padding: 14,
                  borderRadius: 10,
                  fontSize: '0.74rem',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(card, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="exec-drawer__actions">
          <button className="exec-drawer__action-btn secondary" onClick={onEdit}>
            <Edit2 size={14} /> Edit Card
          </button>
          <button className="exec-drawer__action-btn secondary" onClick={onToggleStatus}>
            <RotateCcw size={14} /> {card.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          {card.affiliateLink && (
            <a
              href={card.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="exec-drawer__action-btn primary"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={14} /> Apply Portal
            </a>
          )}
          <button className="exec-drawer__action-btn danger" onClick={onDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Add / Edit Modal
   ============================================================ */

interface CardFormProps { editing: CreditCard | null; onClose: () => void; onSave: (c: CreditCard) => void }

const CardFormModal: React.FC<CardFormProps> = ({ editing, onClose, onSave }) => {
  const [formStep, setFormStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<Partial<CreditCard>>(editing ? { ...editing } : { ...EMPTY_FORM })
  const [formAlert, setFormAlert] = useState<{ title: string; message: string } | null>(null)
  const set = (k: keyof CreditCard, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.cardName?.trim()) {
      setFormAlert({ title: 'Missing Card Name', message: 'Credit card name is required.' })
      return
    }
    if (!form.bank?.trim()) {
      setFormAlert({ title: 'Missing Bank', message: 'Issuing bank name is required.' })
      return
    }
    if (!form.offerExpiryDate?.trim()) {
      setFormAlert({ title: 'Missing Expiry Date', message: 'Offer Expiry Date is mandatory.' })
      return
    }
    const now = new Date().toISOString().split('T')[0]
    onSave({
      id: editing?.id ?? `card-${Date.now()}`,
      cardName: form.cardName!,
      bank: form.bank!,
      network: (form.network as CardNetwork) ?? 'Visa',
      tier: (form.tier as CardTier) ?? 'Classic',
      section: (form.section as CardSection) ?? 'premium',
      cardTheme: (form.cardTheme as CardTheme) ?? (form.section === 'lifetime-free' ? 'red-card' : 'white-blue'),
      tagText: form.tagText || form.bank || '',
      keyBenefitLabel: form.keyBenefitLabel || 'TOP BENEFIT',
      rewardsLabel: form.rewardsLabel || 'REWARDS',
      imageUrl: form.imageUrl ?? '',
      bankLogoUrl: form.bankLogoUrl ?? '',
      welcomeOffer: form.welcomeOffer ?? '',
      rewardRate: form.rewardRate ?? '',
      keyBenefits: form.keyBenefits ?? '',
      partnerBrands: form.partnerBrands ?? '',
      affiliateLink: form.affiliateLink ?? '',
      annualFee: form.annualFee ?? '',
      joiningFee: form.joiningFee ?? '',
      feeWaiver: form.feeWaiver ?? '',
      offerStartDate: form.offerStartDate ?? now,
      offerExpiryDate: form.offerExpiryDate!,
      lastUpdated: now,
      status: (form.status as CardStatus) ?? 'active',
      isFeatured: form.isFeatured ?? false,
      isVerified: form.isVerified ?? false,
      applyCount: editing?.applyCount ?? 0,
      viewCount: editing?.viewCount ?? 0,
      addedOn: editing?.addedOn ?? now,
    })
  }

  const days = form.offerExpiryDate ? daysLeft(form.offerExpiryDate) : null
  const pill = days !== null ? expiryPill(days) : null

  // Mini preview tile styling matching theme
  const theme = form.cardTheme || (form.section === 'lifetime-free' ? 'red-card' : 'white-blue')
  const isSolid = theme === 'red-card' || theme === 'navy-card'
  const isRed = theme === 'red-card' || theme === 'white-red'
  const accentColor = isRed ? '#E31E25' : '#282D78'

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 940, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title"><CardIcon size={20} style={{ marginRight: 8, color: '#6366f1' }} />{editing ? 'Edit Credit Card' : 'Add New Credit Card'}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Stepper Header */}
        <div style={{ padding: '0 24px', marginTop: 16 }}>
          <div className="form-stepper" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 1 ? 'active' : ''} ${form.cardName && form.bank ? 'completed' : ''}`}
              onClick={() => setFormStep(1)}
            >
              <div className="step-number">1</div>
              <div className="step-info">
                <span className="step-title">Step 1: Section, Design & Perks</span>
                <span className="step-desc">Section layout, theme, bank, rewards & fees</span>
              </div>
            </button>
            <div className="step-divider">›</div>
            <button
              type="button"
              className={`step-tab-btn ${formStep === 2 ? 'active' : ''} ${form.offerExpiryDate ? 'completed' : ''}`}
              onClick={() => setFormStep(2)}
            >
              <div className="step-number">2</div>
              <div className="step-info">
                <span className="step-title">Step 2: Media, Expiry & Launch</span>
                <span className="step-desc">Logos, mandatory expiry date & affiliate link</span>
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="modal-body" style={{ paddingTop: 20 }}>
          {/* Two-column layout: scrollable form + sticky preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

          {/* ── Form Step Pane ── */}
          <div>
            {formStep === 1 && (
              <div className="form-step-pane">
                {/* 1. Target Webpage Section & Card Design Theme */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1.5px solid #e2e8f0', marginBottom: 16 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Sparkles size={16} color="#6366f1" /> Target Webpage Section & Card Design <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#64748b' }}>
                    Choose which webpage section this card belongs to and select its specific design layout theme:
                  </p>
                  
                  {/* Section Choice Radio Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div 
                      onClick={() => {
                        set('section', 'premium')
                        if (form.cardTheme !== 'white-blue' && form.cardTheme !== 'white-red') {
                          set('cardTheme', 'white-blue')
                        }
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: 10,
                        border: `2px solid ${form.section === 'premium' ? '#2F368C' : '#cbd5e1'}`,
                        background: form.section === 'premium' ? '#f0f4ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <input 
                          type="radio" 
                          name="sectionRadio" 
                          checked={form.section === 'premium'} 
                          onChange={() => {}} 
                          style={{ accentColor: '#2F368C' }} 
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>Section 1: Premium Shopping Cards</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', paddingLeft: 22 }}>
                        Clean white card layout with colored top tag & edge-to-edge highlight banner.
                      </p>
                    </div>

                    <div 
                      onClick={() => {
                        set('section', 'lifetime-free')
                        if (form.cardTheme !== 'red-card' && form.cardTheme !== 'navy-card') {
                          set('cardTheme', 'red-card')
                        }
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: 10,
                        border: `2px solid ${form.section === 'lifetime-free' ? '#E31E25' : '#cbd5e1'}`,
                        background: form.section === 'lifetime-free' ? '#fff1f2' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <input 
                          type="radio" 
                          name="sectionRadio" 
                          checked={form.section === 'lifetime-free'} 
                          onChange={() => {}} 
                          style={{ accentColor: '#E31E25' }} 
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>Section 2: Unlimited Lifetime Free</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', paddingLeft: 22 }}>
                        High-contrast solid colored background (Solid Crimson or Solid Deep Navy).
                      </p>
                    </div>
                  </div>

                  {/* Theme Selector based on chosen Section */}
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                      Design Color Theme:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {form.section === 'premium' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => set('cardTheme', 'white-blue')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: `1.5px solid ${form.cardTheme === 'white-blue' ? '#282D78' : '#cbd5e1'}`,
                              background: form.cardTheme === 'white-blue' ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ width: 18, height: 18, borderRadius: 4, background: '#282D78', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>White + Navy Blue</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>IndusInd style banner</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => set('cardTheme', 'white-red')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: `1.5px solid ${form.cardTheme === 'white-red' ? '#E31E25' : '#cbd5e1'}`,
                              background: form.cardTheme === 'white-red' ? '#fff1f2' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ width: 18, height: 18, borderRadius: 4, background: '#E31E25', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>White + Crimson Red</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>ICICI / IDFC style banner</div>
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => set('cardTheme', 'red-card')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: `1.5px solid ${form.cardTheme === 'red-card' ? '#E31E25' : '#cbd5e1'}`,
                              background: form.cardTheme === 'red-card' ? '#fff1f2' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ width: 18, height: 18, borderRadius: 4, background: '#E31E25', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Solid Crimson Red</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Tata Neu style card</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => set('cardTheme', 'navy-card')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: `1.5px solid ${form.cardTheme === 'navy-card' ? '#282D78' : '#cbd5e1'}`,
                              background: form.cardTheme === 'navy-card' ? '#eff6ff' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ width: 18, height: 18, borderRadius: 4, background: '#282D78', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Solid Deep Navy</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Axis Bank style card</div>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Name & Tag Text */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Card Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" placeholder="e.g., HDFC Regalia Gold" value={form.cardName ?? ''} onChange={e => set('cardName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Tag / Badge Text</label>
                    <input type="text" placeholder="e.g., HDFC Bank / TataNeu" value={form.tagText ?? ''} onChange={e => set('tagText', e.target.value)} />
                  </div>
                </div>

                {/* Bank + Network + Tier */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Bank <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={form.bank ?? BANKS[0]} onChange={e => {
                      set('bank', e.target.value)
                      if (!form.tagText) set('tagText', e.target.value)
                    }}>
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Network</label>
                    <select value={form.network ?? 'Visa'} onChange={e => set('network', e.target.value)}>
                      {NETWORKS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tier</label>
                    <select value={form.tier ?? 'Classic'} onChange={e => set('tier', e.target.value)}>
                      {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Key Benefit Label & Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Benefit Label</label>
                    <input type="text" placeholder="TOP BENEFIT" value={form.keyBenefitLabel ?? 'TOP BENEFIT'} onChange={e => set('keyBenefitLabel', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Benefit Value (Main Offer)</label>
                    <input type="text" placeholder="Upto 5% Cashback" value={form.welcomeOffer ?? ''} onChange={e => set('welcomeOffer', e.target.value)} />
                  </div>
                </div>

                {/* Rewards Label & Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Rewards Label</label>
                    <input type="text" placeholder="REWARDS" value={form.rewardsLabel ?? 'REWARDS'} onChange={e => set('rewardsLabel', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Rewards Value</label>
                    <input type="text" placeholder="Exclusive Rewards / Lifetime Free Offers" value={form.rewardRate ?? ''} onChange={e => set('rewardRate', e.target.value)} />
                  </div>
                </div>

                {/* Partner Brands */}
                <div className="form-group">
                  <label>Partner Brands / Suited For <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(comma-separated)</span></label>
                  <input type="text" placeholder="Shopping, Travel, Dining or Amazon, Flipkart, Swiggy" value={form.partnerBrands ?? ''} onChange={e => set('partnerBrands', e.target.value)} />
                </div>

                {/* Fees */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Annual Fee</label>
                    <input type="text" placeholder="₹0 or ₹999" value={form.annualFee ?? ''} onChange={e => set('annualFee', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Joining Fee</label>
                    <input type="text" placeholder="₹0 or ₹999" value={form.joiningFee ?? ''} onChange={e => set('joiningFee', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Fee Waiver</label>
                    <input type="text" placeholder="Lifetime Free or Spend ₹1L/yr" value={form.feeWaiver ?? ''} onChange={e => set('feeWaiver', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="form-step-pane">
                {/* Card Image */}
                <ImageUploadField label="Card Graphic / Image" placeholder="https://bank.com/card.png" value={form.imageUrl as string ?? ''} onChange={v => set('imageUrl', v)} />

                {/* Bank Logo */}
                <ImageUploadField label="Bank Logo (Optional)" placeholder="https://bank.com/logo.png" value={form.bankLogoUrl as string ?? ''} onChange={v => set('bankLogoUrl', v)} />

                {/* Affiliate Link */}
                <div className="form-group">
                  <label>Affiliate / Apply Link</label>
                  <input type="url" placeholder="https://bank.com/apply?affid=wouchify" value={form.affiliateLink ?? ''} onChange={e => set('affiliateLink', e.target.value)} />
                </div>

                {/* Dates — Expiry MANDATORY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label>Offer Start Date</label>
                    <input type="date" value={form.offerStartDate ?? ''} onChange={e => set('offerStartDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 800, color: '#dc2626' }}>
                      Offer Expiry Date *
                      <span style={{ fontSize: '0.68rem', color: '#ef4444', marginLeft: 4 }}>(Mandatory)</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={form.offerExpiryDate ?? ''}
                      onChange={e => set('offerExpiryDate', e.target.value)}
                      style={{ borderColor: !form.offerExpiryDate ? '#ef4444' : undefined }}
                    />
                    {pill && (
                      <span style={{ marginTop: 4, display: 'inline-block', background: pill.bg, color: pill.color, borderRadius: 6, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {pill.label}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status ?? 'active'} onChange={e => set('status', e.target.value)}>
                      <option value="active">Active</option>
                      <option value="featured">Featured</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  {([['isVerified', '✓ Verified Card'], ['isFeatured', '⭐ Featured Card']] as [keyof CreditCard, string][]).map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      <input type="checkbox" checked={(form[key] as boolean) ?? false} onChange={e => set(key, e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Live Preview of the Specific Webpage Card Tile (sticky) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Webpage Card Tile Preview
            </div>

            {/* Exact Webpage Design Replica */}
            <div 
              style={{
                width: '100%',
                borderRadius: 18,
                background: isSolid ? (theme === 'red-card' ? '#E31E25' : '#282D78') : '#FFFFFF',
                border: isSolid ? 'none' : '1.5px solid #D0D0D0',
                boxShadow: isSolid ? '0 10px 24px rgba(0,0,0,0.25)' : '0 8px 20px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                padding: '14px',
                color: isSolid ? '#FFFFFF' : '#000000',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: '0.74rem'
              }}
            >
              {/* Top Row: Tag + Name + Logo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span 
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      background: isSolid ? '#FFFFFF' : accentColor,
                      color: isSolid ? '#000000' : '#FFFFFF',
                      marginBottom: 4
                    }}
                  >
                    {form.tagText || form.bank || 'Banking Partner'}
                  </span>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: isSolid ? '#FFFFFF' : accentColor }}>
                    {form.cardName || 'Card Name'}
                  </div>
                </div>
                {form.bankLogoUrl ? (
                  <img src={form.bankLogoUrl as string} alt="" style={{ height: 20, maxWidth: 60, objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.8 }}>{form.network || 'VISA'}</span>
                )}
              </div>

              {/* Edge-to-Edge Middle Banner */}
              <div 
                style={{
                  margin: '0 -14px',
                  padding: '8px 14px',
                  background: isSolid ? '#FFFFFF' : accentColor,
                  color: isSolid ? accentColor : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, opacity: isSolid ? 0.7 : 0.8 }}>{form.keyBenefitLabel || 'TOP BENEFIT'}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>{form.welcomeOffer || 'Upto 5% Cashback'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, opacity: isSolid ? 0.7 : 0.8 }}>{form.rewardsLabel || 'REWARDS'}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>{form.rewardRate || (form.section === 'lifetime-free' ? 'Lifetime Free Offers' : 'Exclusive Rewards')}</div>
                </div>
              </div>

              {/* Verified Partners */}
              <div>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.5px', opacity: 0.8, marginBottom: 4 }}>
                  VERIFIED PARTNERS
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {((form.partnerBrands || 'Shopping, Travel, Dining').split(',')).slice(0, 3).map((p, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: isSolid ? 'rgba(255,255,255,0.22)' : accentColor,
                        color: '#FFFFFF'
                      }}
                    >
                      {p.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTop: isSolid ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e2e8f0', paddingTop: 8 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>+2.4k applied</span>
                <span 
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 14,
                    background: isSolid ? '#FFFFFF' : accentColor,
                    color: isSolid ? accentColor : '#FFFFFF'
                  }}
                >
                  Apply now &gt;&gt;
                </span>
              </div>
            </div>

            {/* Section Tag Indicator */}
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', border: '1px solid #e2e8f0', fontSize: '0.72rem' }}>
              <div style={{ fontWeight: 700, color: '#334155' }}>
                Assigned Section:
              </div>
              <div style={{ color: form.section === 'premium' ? '#2F368C' : '#E31E25', fontWeight: 800, marginTop: 2 }}>
                {form.section === 'premium' ? '🌟 Section 1: Premium Shopping Cards' : '⚡ Section 2: Unlimited Lifetime Free'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.68rem', marginTop: 2 }}>
                Theme: <span style={{ fontWeight: 600 }}>{theme}</span>
              </div>
            </div>
          </div>
          </div>{/* end two-column grid */}
        </div>{/* end modal-body */}

        <div className="modal-footer" style={{ justifyContent: 'space-between', display: 'flex' }}>
          {formStep === 1 ? (
            <>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-save"
                onClick={() => {
                  if (!form.cardName?.trim()) {
                    setFormAlert({ title: 'Missing Card Name', message: 'Credit card name is required.' })
                    return
                  }
                  if (!form.bank?.trim()) {
                    setFormAlert({ title: 'Missing Bank', message: 'Issuing bank name is required.' })
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
              <button type="button" className="btn-cancel" onClick={() => setFormStep(1)}>&larr; Back to Step 1</button>
              <button type="button" className="btn-save" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Card'}</button>
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

export const ExecutiveCreditCardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterBank, setFilterBank] = useState('All')
  const [filterStatus, setFilterStatus] = useState<'all' | CardStatus>('all')
  const [filterTier, setFilterTier] = useState<'all' | CardTier>('all')
  const [sortBy, setSortBy] = useState<'expiry' | 'applies' | 'views' | 'added'>('expiry')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<CreditCard | null>(null)
  const [inspectedCard, setInspectedCard] = useState<CreditCard | null>(null)
  const [rawCoupons, setRawCoupons] = useState<any[]>([])
  const [rawDeals, setRawDeals] = useState<any[]>([])
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const [filterSection, setFilterSection] = useState<'all' | CardSection>('all')

  const fetchLiveCards = async () => {
    setLoading(true)
    try {
      const resolveBankLogo = (bank: string, id: string, logoUrl?: string) => {
        if (logoUrl && typeof logoUrl === 'string' && (logoUrl.startsWith('data:') || logoUrl.startsWith('blob:') || logoUrl.startsWith('http'))) {
          return logoUrl
        }
        const b = (bank || '').toLowerCase()
        const i = (id || '').toLowerCase()
        if (b.includes('indusind') || i.includes('indusind')) return indusindLogo
        if (b.includes('icici') || i.includes('icici')) return iciciLogo
        if (b.includes('idfc') || i.includes('idfc')) return idfcLogo
        if (b.includes('tata') || i.includes('tata')) return tataNeuLogo
        if (b.includes('axis') || i.includes('axis')) return axisLogo
        if (b.includes('bajaj') || i.includes('bajaj')) return bajajLogo
        return logoUrl || indusindLogo
      }

      const [live, couponsRes, dealsRes] = await Promise.all([
        adminApi.getCreditCards({ all: 'true' }),
        adminApi.getCoupons({ all: 'true' }),
        adminApi.getDeals({ all: 'true' })
      ])

      setRawCoupons(Array.isArray(couponsRes) ? couponsRes : [])
      setRawDeals(Array.isArray(dealsRes) ? dealsRes : [])

      if (Array.isArray(live)) {
        const mapped: CreditCard[] = live.map((c: any, idx: number) => {
          const section: CardSection = c.section || (c.annualFee === '₹0' || String(c.annualFee || '').includes('free') ? 'lifetime-free' : 'premium')
          const cardTheme: CardTheme = c.cardTheme || (section === 'lifetime-free' ? (idx % 2 === 0 ? 'red-card' : 'navy-card') : (idx % 2 === 0 ? 'white-blue' : 'white-red'))

          return {
            id: String(c._id || c.id || `card-${idx}`),
            cardName: c.cardName || 'Credit Card',
            bank: c.bank || 'IndusInd Bank',
            network: (c.network || 'Visa') as any,
            tier: (c.tier || 'Classic') as any,
            section,
            cardTheme,
            tagText: c.tagText || c.bank || '',
            keyBenefitLabel: c.keyBenefitLabel || 'TOP BENEFIT',
            rewardsLabel: c.rewardsLabel || 'REWARDS',
            imageUrl: c.imageUrl || '',
            bankLogoUrl: resolveBankLogo(c.bank || '', c._id || c.id || '', c.bankLogoUrl),
            welcomeOffer: c.welcomeOffer || c.keyBenefitValue || 'Upto 5% Cashback',
            rewardRate: c.rewardRate || c.rewardsValue || (section === 'lifetime-free' ? 'Lifetime Free Offers' : 'Exclusive Rewards'),
            keyBenefits: Array.isArray(c.keyBenefits) ? c.keyBenefits.join(', ') : (c.keyBenefits || (Array.isArray(c.suitedFor) ? c.suitedFor.join(', ') : '')),
            partnerBrands: Array.isArray(c.partnerBrands) ? c.partnerBrands.join(', ') : (c.partnerBrands || (Array.isArray(c.suitedFor) ? c.suitedFor.join(', ') : '')),
            affiliateLink: c.affiliateLink || c.applyHref || '',
            annualFee: c.annualFee || '₹0',
            joiningFee: c.joiningFee || '₹0',
            feeWaiver: c.feeWaiver || 'Lifetime Free',
            offerStartDate: c.offerStartDate || new Date().toISOString().slice(0, 10),
            offerExpiryDate: c.offerExpiryDate || new Date(Date.now() + 86400000 * 60).toISOString().slice(0, 10),
            lastUpdated: c.lastUpdated || new Date().toISOString().slice(0, 10),
            status: (c.status || 'active') as any,
            submissionStatus: (c.submissionStatus || 'approved') as any,
            isFeatured: Boolean(c.isFeatured),
            isVerified: Boolean(c.isVerified !== false),
            applyCount: c.applyCount || (parseInt(String(c.userCount || '').replace(/[^0-9]/g, '')) * 100) || 0,
            viewCount: c.viewCount || 0,
            addedOn: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
          }
        })
        setCards(mapped)
      }
    } catch (err) {
      console.error('Failed to load credit cards:', err)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveCards()

    const handleSync = () => { fetchLiveCards() }
    window.addEventListener('wouchify_credit_cards_updated', handleSync)
    window.addEventListener('wouchify_coupons_updated', handleSync)
    window.addEventListener('wouchify_deals_updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('wouchify_credit_cards_updated', handleSync)
      window.removeEventListener('wouchify_coupons_updated', handleSync)
      window.removeEventListener('wouchify_deals_updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const kpi = useMemo(() => ({
    total: cards.length,
    active: cards.filter(c => (c.status === 'active' || c.status === 'featured') && c.submissionStatus !== 'pending_approval').length,
    featured: cards.filter(c => c.status === 'featured' || c.isFeatured).length,
    expiringSoon: cards.filter(c => daysLeft(c.offerExpiryDate) <= 7 && daysLeft(c.offerExpiryDate) >= 0).length,
    totalApplies: cards.reduce((a, c) => a + c.applyCount, 0),
    totalViews: cards.reduce((a, c) => a + c.viewCount, 0),
  }), [cards])

  const bankOptions = useMemo(() => ['All', ...Array.from(new Set(cards.map(c => c.bank)))], [cards])

  const filtered = useMemo(() => {
    let list = [...cards]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.cardName.toLowerCase().includes(q) || c.bank.toLowerCase().includes(q) ||
        c.welcomeOffer.toLowerCase().includes(q) || c.rewardRate.toLowerCase().includes(q)
      )
    }
    if (filterBank !== 'All') list = list.filter(c => c.bank === filterBank)
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus)
    if (filterTier !== 'all') list = list.filter(c => c.tier === filterTier)
    if (filterSection !== 'all') list = list.filter(c => c.section === filterSection)
    list.sort((a, b) => {
      if (sortBy === 'expiry') return a.offerExpiryDate.localeCompare(b.offerExpiryDate)
      if (sortBy === 'applies') return b.applyCount - a.applyCount
      if (sortBy === 'views') return b.viewCount - a.viewCount
      if (sortBy === 'added') return b.addedOn.localeCompare(a.addedOn)
      return 0
    })
    return list
  }, [cards, search, filterBank, filterStatus, filterTier, filterSection, sortBy])

  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (c: CreditCard) => { setEditing(c); setIsFormOpen(true) }

  const handleSave = (data: CreditCard) => {
    if (editing) {
      const updatedData: CreditCard = {
        ...data,
        submissionStatus: 'pending_approval'
      }
      adminApi.updateCreditCard(data.id, {
        cardName: data.cardName,
        bank: data.bank,
        network: data.network,
        tier: data.tier,
        section: data.section,
        cardTheme: data.cardTheme,
        tagText: data.tagText,
        keyBenefitLabel: data.keyBenefitLabel,
        rewardsLabel: data.rewardsLabel,
        imageUrl: data.imageUrl,
        bankLogoUrl: data.bankLogoUrl,
        welcomeOffer: data.welcomeOffer,
        rewardRate: data.rewardRate,
        keyBenefits: data.keyBenefits.split(',').map(s => s.trim()).filter(Boolean),
        partnerBrands: data.partnerBrands.split(',').map(s => s.trim()).filter(Boolean),
        affiliateLink: data.affiliateLink,
        annualFee: data.annualFee,
        joiningFee: data.joiningFee,
        feeWaiver: data.feeWaiver,
        offerExpiryDate: data.offerExpiryDate,
        status: data.status,
        isFeatured: data.isFeatured,
        isVerified: data.isVerified
      }).then(() => {
        fetchLiveCards()
      }).catch(console.warn)

      setCards(prev => prev.map(c => c.id === data.id ? updatedData : c))
    } else {
      const pendingData: CreditCard = {
        ...data,
        submissionStatus: 'pending_approval'
      }
      adminApi.createCreditCard({
        cardName: data.cardName,
        bank: data.bank,
        network: data.network,
        tier: data.tier,
        section: data.section,
        cardTheme: data.cardTheme,
        tagText: data.tagText,
        keyBenefitLabel: data.keyBenefitLabel,
        rewardsLabel: data.rewardsLabel,
        imageUrl: data.imageUrl,
        bankLogoUrl: data.bankLogoUrl,
        welcomeOffer: data.welcomeOffer,
        rewardRate: data.rewardRate,
        keyBenefits: data.keyBenefits.split(',').map(s => s.trim()).filter(Boolean),
        partnerBrands: data.partnerBrands.split(',').map(s => s.trim()).filter(Boolean),
        affiliateLink: data.affiliateLink,
        annualFee: data.annualFee,
        joiningFee: data.joiningFee,
        feeWaiver: data.feeWaiver,
        offerExpiryDate: data.offerExpiryDate,
        status: data.status,
        isFeatured: data.isFeatured,
        isVerified: data.isVerified
      }).then(res => {
        const createdId = res._id || res.id || res.entity?._id || data.id
        setCards(prev => [{ ...pendingData, id: String(createdId) }, ...prev.filter(c => c.id !== data.id)])
        fetchLiveCards()
      }).catch(err => {
        console.warn(err)
        fetchLiveCards()
      })

      setCards(prev => [pendingData, ...prev])
    }
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    setCardToDelete(id)
  }

  const confirmDeleteCard = () => {
    if (!cardToDelete) return
    const id = cardToDelete
    adminApi.deleteCreditCard(id).then(() => {
      fetchLiveCards()
    }).catch(console.warn)
    setCards(prev => prev.filter(c => c.id !== id))
    setCardToDelete(null)
  }

  const hasFilters = search || filterBank !== 'All' || filterStatus !== 'all' || filterTier !== 'all' || filterSection !== 'all'

  return (
    <ExecutiveLayout activeMenu="credit-cards">
      <div className="executive-crud-page">

        {/* Header */}
        <div className="crud-header">
          <div>
            <h2 className="crud-title">Credit Card Management</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Manage partner credit cards, target sections, layout designs & offer validity
            </p>
          </div>
          <button className="crud-add-btn" onClick={openAdd}><Plus size={18} /> Add New Card</button>
        </div>

        {/* KPI Ribbon */}
        <div className="kpi-ribbon" style={{ marginBottom: 24 }}>
          <div className="kpi-card" style={{ borderTop: '3px solid #6366f1' }}>
            <div className="kpi-icon" style={{ background: '#6366f118', color: '#6366f1' }}><CardIcon size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.total}</div><div className="kpi-label">Total Cards</div><div className="kpi-sub">In directory</div></div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #22c55e' }}>
            <div className="kpi-icon" style={{ background: '#22c55e18', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.active}</div><div className="kpi-label">Active</div><div className="kpi-sub">Live offers</div></div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #8b5cf6' }}>
            <div className="kpi-icon" style={{ background: '#8b5cf618', color: '#8b5cf6' }}><Sparkles size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.featured}</div><div className="kpi-label">Featured</div><div className="kpi-sub">Homepage spotlight</div></div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <div className="kpi-icon" style={{ background: '#f59e0b18', color: '#f59e0b' }}><AlertTriangle size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.expiringSoon}</div><div className="kpi-label">Expiring Soon</div><div className="kpi-sub">Within 7 days</div></div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #3b82f6' }}>
            <div className="kpi-icon" style={{ background: '#3b82f618', color: '#3b82f6' }}><TrendingUp size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.totalApplies.toLocaleString()}</div><div className="kpi-label">Total Applies</div><div className="kpi-sub">All-time</div></div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #10b981' }}>
            <div className="kpi-icon" style={{ background: '#10b98118', color: '#10b981' }}><Star size={20} /></div>
            <div className="kpi-body"><div className="kpi-value">{kpi.totalViews.toLocaleString()}</div><div className="kpi-label">Total Views</div><div className="kpi-sub">All-time</div></div>
          </div>
        </div>

        {/* Filters */}
        <div className="crud-filters" style={{ flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
          <div className="crud-search" style={{ minWidth: 240 }}>
            <Search size={18} />
            <input type="text" placeholder="Search card name, bank, offer…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="crud-filter-select">
            <Filter size={15} style={{ color: '#94a3b8' }} />
            <select value={filterSection} onChange={e => setFilterSection(e.target.value as any)}>
              <option value="all">All Webpage Sections</option>
              <option value="premium">🌟 Section 1: Premium Shopping</option>
              <option value="lifetime-free">⚡ Section 2: Lifetime Free</option>
            </select>
          </div>
          <div className="crud-filter-select">
            <Filter size={15} style={{ color: '#94a3b8' }} />
            <select value={filterBank} onChange={e => setFilterBank(e.target.value)}>
              {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="crud-filter-select">
            <Tag size={15} style={{ color: '#94a3b8' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | CardStatus)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="featured">Featured</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          <div className="crud-filter-select">
            <Sparkles size={15} style={{ color: '#94a3b8' }} />
            <select value={filterTier} onChange={e => setFilterTier(e.target.value as 'all' | CardTier)}>
              <option value="all">All Tiers</option>
              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="crud-filter-select">
            <Percent size={15} style={{ color: '#94a3b8' }} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
              <option value="expiry">Sort: Expiring Soonest</option>
              <option value="applies">Sort: Most Applied</option>
              <option value="views">Sort: Most Viewed</option>
              <option value="added">Sort: Newest First</option>
            </select>
          </div>
          {hasFilters && <button onClick={() => { setSearch(''); setFilterBank('All'); setFilterStatus('all'); setFilterTier('all'); setFilterSection('all'); setSortBy('expiry') }} className="action-btn"><RotateCcw size={15} /></button>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>{filtered.length} of {cards.length} cards</span>
        </div>

        {/* Table */}
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Card</th>
                <th>Target Section & Layout</th>
                <th>Bank</th>
                <th>Reward</th>
                <th>Fees</th>
                <th>Offer Expiry <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>*</span></th>
                <th>Applies / Views</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRowSkeleton columns={10} rows={5} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <EmptyState
                      icon="💳"
                      title="No credit cards found"
                      description={hasFilters ? "No cards match your filter criteria." : "No credit cards currently in the directory."}
                      actionLabel="+ Add New Card"
                      onAction={openAdd}
                    />
                  </td>
                </tr>
              ) : filtered.map(card => {
                const days = daysLeft(card.offerExpiryDate)
                const pill = expiryPill(days)
                const sc = statusCfg(card.status)
                const tc = TIER_COLOR[card.tier]
                const netColor = NETWORK_COLOR[card.network]

                const isPrem = card.section === 'premium'
                const themeName = 
                  card.cardTheme === 'white-blue' ? 'White + Navy' :
                  card.cardTheme === 'white-red' ? 'White + Red' :
                  card.cardTheme === 'red-card' ? 'Solid Crimson' :
                  card.cardTheme === 'navy-card' ? 'Solid Navy' : card.cardTheme

                return (
                  <tr 
                    key={card.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setInspectedCard(card)}
                  >
                    {/* Card */}
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <CardVisual card={card} size="sm" />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{card.cardName}</div>
                          <div style={{ fontSize: '0.72rem', color: netColor, fontWeight: 700, marginTop: 2 }}>{card.network}</div>
                        </div>
                      </div>
                    </td>

                    {/* Target Section & Layout */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                        <span 
                          style={{
                            background: isPrem ? '#f0f4ff' : '#fff1f2',
                            color: isPrem ? '#2F368C' : '#E31E25',
                            border: `1px solid ${isPrem ? '#c7d7fe' : '#fecdd3'}`,
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          {isPrem ? '🌟 Premium Shopping' : '⚡ Lifetime Free'}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                          🎨 {themeName}
                        </span>
                      </div>
                    </td>

                    {/* Bank */}
                    <td style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{card.bank}</td>
                    {/* Reward */}
                    <td>
                      <div style={{ fontWeight: 700, color: '#6366f1', fontSize: '0.85rem' }}>{card.rewardRate || '—'}</div>
                      {card.welcomeOffer && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.welcomeOffer}</div>}
                    </td>
                    {/* Fees */}
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{card.annualFee || '—'}/yr</div>
                      {card.feeWaiver && <div style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: 2 }}>{card.feeWaiver}</div>}
                    </td>
                    {/* Expiry — MANDATORY column */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{card.offerExpiryDate}</div>
                      <span style={{ display: 'inline-block', marginTop: 4, background: pill.bg, color: pill.color, borderRadius: 6, padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                        {pill.label}
                      </span>
                    </td>
                    {/* Stats */}
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>{card.applyCount.toLocaleString()} applied</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{card.viewCount.toLocaleString()} views</div>
                    </td>
                    {/* Tier */}
                    <td>
                      <span style={{ background: `${tc}18`, color: tc, borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{card.tier}</span>
                    </td>
                    {/* Status */}
                    <td>
                      {card.submissionStatus === 'pending_approval' ? (
                        <span style={{ background: '#fef3c7', color: '#b45309', borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #fde68a' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                          Pending Review
                        </span>
                      ) : card.submissionStatus === 'rejected' ? (
                        <span style={{ background: '#fee2e2', color: '#b91c1c', borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #fecaca' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                          Rejected
                        </span>
                      ) : (
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {sc.label}
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn view" onClick={() => setInspectedCard(card)} title="Inspect Card Details"><Eye size={15} /></button>
                        <button className="action-btn edit" onClick={() => openEdit(card)} title="Edit"><Edit2 size={15} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(card.id)} title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && <CardFormModal editing={editing} onClose={() => setIsFormOpen(false)} onSave={handleSave} />}
      {inspectedCard && (
        <CreditCardDrawer
          card={inspectedCard}
          onClose={() => setInspectedCard(null)}
          onEdit={() => {
            const c = inspectedCard
            setInspectedCard(null)
            openEdit(c)
          }}
          onToggleStatus={async () => {
            try {
              await adminApi.toggleCreditCardStatus(inspectedCard.id)
              setInspectedCard(null)
              fetchLiveCards()
            } catch (err) {
              console.error(err)
            }
          }}
          onDelete={() => {
            const id = inspectedCard.id
            setInspectedCard(null)
            handleDelete(id)
          }}
          rawCoupons={rawCoupons}
          rawDeals={rawDeals}
        />
      )}

      {/* ── CUSTOM CONFIRM DIALOG ── */}
      <AdminConfirmDialog
        isOpen={!!cardToDelete}
        title="Delete Credit Card"
        message="Are you sure you want to permanently delete this credit card listing? This cannot be undone."
        confirmLabel="Delete Card"
        cancelLabel="Cancel"
        variant="danger"
        icon="trash"
        onConfirm={confirmDeleteCard}
        onCancel={() => setCardToDelete(null)}
      />
    </ExecutiveLayout>
  )
}
