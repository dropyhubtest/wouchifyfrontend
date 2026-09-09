import React, { useState, useMemo } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
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
  Gift,
  Percent,
  ExternalLink,
  Banknote,
  Shield,
  Sparkles,
  Tag,
} from 'lucide-react'
import './ExecutiveShared.css'
import { ImageUploadField } from './ImageUploadField'

/* ============================================================
   Types
   ============================================================ */

type CardStatus = 'active' | 'inactive' | 'featured' | 'discontinued'
type CardNetwork = 'Visa' | 'Mastercard' | 'Rupay' | 'Amex' | 'Diners'
type CardTier = 'Entry' | 'Classic' | 'Premium' | 'Super Premium' | 'Infinite'

interface CreditCard {
  id: string
  cardName: string
  bank: string
  network: CardNetwork
  tier: CardTier
  imageUrl: string
  bankLogoUrl: string

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
  isFeatured: boolean
  isVerified: boolean
  applyCount: number
  viewCount: number
  addedOn: string
}

/* ============================================================
   Constants
   ============================================================ */

const BANKS = ['ICICI Bank', 'HDFC Bank', 'SBI Card', 'Axis Bank', 'Kotak Mahindra', 'IndusInd Bank', 'Yes Bank', 'RBL Bank', 'American Express', 'Standard Chartered']
const NETWORKS: CardNetwork[] = ['Visa', 'Mastercard', 'Rupay', 'Amex', 'Diners']
const TIERS: CardTier[] = ['Entry', 'Classic', 'Premium', 'Super Premium', 'Infinite']

const NETWORK_COLOR: Record<CardNetwork, string> = {
  Visa: '#1a1f71',
  Mastercard: '#eb001b',
  Rupay: '#007233',
  Amex: '#006fcf',
  Diners: '#004a97',
}

/* ============================================================
   Seed mock data
   ============================================================ */

const MOCK_CARDS: CreditCard[] = [
  {
    id: 'icici-platinum', cardName: 'ICICI Platinum Chip', bank: 'ICICI Bank',
    network: 'Visa', tier: 'Classic', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: '₹1000 Amazon Gift Card on joining', rewardRate: '5% Cashback on Amazon',
    keyBenefits: 'Fuel surcharge waiver, Lounge access ×2/qtr',
    partnerBrands: 'Amazon, Flipkart, Swiggy',
    affiliateLink: 'https://icicibank.com/?affid=wouchify',
    annualFee: '₹999', joiningFee: '₹999', feeWaiver: 'Spend ₹1L/year',
    offerStartDate: '2026-01-01', offerExpiryDate: '2026-12-31', lastUpdated: '2026-09-01',
    status: 'featured', isFeatured: true, isVerified: true, applyCount: 3200, viewCount: 18400, addedOn: '2026-01-01',
  },
  {
    id: 'hdfc-regalia', cardName: 'HDFC Regalia Gold', bank: 'HDFC Bank',
    network: 'Visa', tier: 'Premium', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: '2500 Reward Points on first swipe', rewardRate: '4 Reward Points / ₹150',
    keyBenefits: 'Airport lounge ×8/qtr, Golf access, Concierge',
    partnerBrands: 'Marriott, Taj, Swiggy, Amazon',
    affiliateLink: 'https://hdfcbank.com/?affid=wouchify',
    annualFee: '₹2500', joiningFee: '₹2500', feeWaiver: 'Spend ₹3L/year',
    offerStartDate: '2026-01-01', offerExpiryDate: '2026-09-30', lastUpdated: '2026-09-05',
    status: 'active', isFeatured: false, isVerified: true, applyCount: 2800, viewCount: 14200, addedOn: '2026-02-10',
  },
  {
    id: 'sbi-simplyclick', cardName: 'SBI SimplyCLICK', bank: 'SBI Card',
    network: 'Visa', tier: 'Entry', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: '₹500 Amazon Gift Card on joining', rewardRate: '10X Points on select partners',
    keyBenefits: 'Online shopping rewards, Cleartrip voucher',
    partnerBrands: 'Amazon, BookMyShow, Cleartrip, Lenskart',
    affiliateLink: 'https://sbicard.com/?affid=wouchify',
    annualFee: '₹499', joiningFee: '₹499', feeWaiver: 'Spend ₹1L/year',
    offerStartDate: '2026-03-01', offerExpiryDate: '2026-09-11', lastUpdated: '2026-09-07',
    status: 'active', isFeatured: false, isVerified: true, applyCount: 5100, viewCount: 24000, addedOn: '2026-03-01',
  },
  {
    id: 'axis-ace', cardName: 'Axis Ace Credit Card', bank: 'Axis Bank',
    network: 'Visa', tier: 'Classic', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: 'Flat ₹500 cashback on first txn', rewardRate: 'Flat 2% Cashback on all spends',
    keyBenefits: 'Unlimited cashback, GPay 5% extra, Swiggy 5%',
    partnerBrands: 'Google Pay, Swiggy, Ola',
    affiliateLink: 'https://axisbank.com/?affid=wouchify',
    annualFee: '₹499', joiningFee: '₹0', feeWaiver: 'Spend ₹2L/year',
    offerStartDate: '2026-04-01', offerExpiryDate: '2026-10-31', lastUpdated: '2026-09-01',
    status: 'active', isFeatured: true, isVerified: true, applyCount: 4400, viewCount: 21000, addedOn: '2026-04-01',
  },
  {
    id: 'kotak-zen', cardName: 'Kotak Zen Signature', bank: 'Kotak Mahindra',
    network: 'Visa', tier: 'Premium', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: '2000 Zen Points + ₹250 BookMyShow voucher', rewardRate: 'Zen Points on every ₹100',
    keyBenefits: 'Fuel surcharge waiver, 8 Lounge passes/year',
    partnerBrands: 'BookMyShow, Myntra, Zomato',
    affiliateLink: 'https://kotak.com/?affid=wouchify',
    annualFee: '₹1499', joiningFee: '₹1499', feeWaiver: 'Spend ₹1.5L/year',
    offerStartDate: '2026-05-01', offerExpiryDate: '2026-11-30', lastUpdated: '2026-09-02',
    status: 'inactive', isFeatured: false, isVerified: false, applyCount: 980, viewCount: 5600, addedOn: '2026-05-01',
  },
  {
    id: 'amex-mrcc', cardName: 'Amex Membership Rewards', bank: 'American Express',
    network: 'Amex', tier: 'Super Premium', imageUrl: '', bankLogoUrl: '',
    welcomeOffer: '4000 Bonus Points on ₹15000 spend in 90 days', rewardRate: '1 MR Point / ₹50',
    keyBenefits: 'Taj Epicure, ITC, Priority Pass lounge',
    partnerBrands: 'Taj Hotels, Amazon, Flipkart, Uber',
    affiliateLink: 'https://americanexpress.com/?affid=wouchify',
    annualFee: '₹4500', joiningFee: '₹4500', feeWaiver: 'Spend ₹4.5L/year',
    offerStartDate: '2026-06-01', offerExpiryDate: '2027-06-30', lastUpdated: '2026-09-03',
    status: 'featured', isFeatured: true, isVerified: true, applyCount: 1200, viewCount: 9800, addedOn: '2026-06-01',
  },
]

const EMPTY_FORM: Partial<CreditCard> = {
  cardName: '', bank: BANKS[0], network: 'Visa', tier: 'Classic',
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
          {card.bankLogoUrl
            ? <img src={card.bankLogoUrl as string} alt="" style={{ height: isLg ? 22 : 12, objectFit: 'contain', filter: 'brightness(10)' }} />
            : <span style={{ fontSize: isLg ? '0.65rem' : '0.45rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{card.bank}</span>
          }
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
   Customer Preview Modal
   ============================================================ */

const CardPreviewModal: React.FC<{ card: CreditCard; onClose: () => void }> = ({ card, onClose }) => {
  const days = daysLeft(card.offerExpiryDate)
  const pill = expiryPill(days)
  const sc = statusCfg(card.status)
  const tc = TIER_COLOR[card.tier]

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 500, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title"><Eye size={18} style={{ marginRight: 8 }} />Customer View</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Card visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CardVisual card={card} size="lg" />
          </div>

          {/* Card info */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ background: `${tc}18`, color: tc, borderRadius: 6, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{card.tier}</span>
              <span style={{ background: sc.bg, color: sc.color, borderRadius: 6, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{sc.label}</span>
              <span style={{ background: pill.bg, color: pill.color, borderRadius: 6, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>⏰ {pill.label}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{card.cardName}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>{card.bank} · {card.network}</div>
          </div>

          {/* Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: <Gift size={16} />, label: 'Welcome Offer', value: card.welcomeOffer, color: '#f59e0b' },
              { icon: <Percent size={16} />, label: 'Reward Rate', value: card.rewardRate, color: '#6366f1' },
              { icon: <Banknote size={16} />, label: 'Annual Fee', value: card.annualFee, color: '#3b82f6' },
              { icon: <Shield size={16} />, label: 'Fee Waiver', value: card.feeWaiver || 'No waiver', color: '#22c55e' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: item.color, marginBottom: 4 }}>
                  {item.icon}
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Key benefits */}
          {card.keyBenefits && (
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Benefits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {card.keyBenefits.split(',').map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: '#0f172a' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                    <span>{b.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partner brands */}
          {card.partnerBrands && (
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Partner Brands</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {card.partnerBrands.split(',').map(b => (
                  <span key={b} style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: 6, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }}>{b.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Applied', value: card.applyCount.toLocaleString() },
              { label: 'Views', value: card.viewCount.toLocaleString() },
              { label: 'Offer Ends', value: card.offerExpiryDate },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <a href={card.affiliateLink} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}
          >
            <ExternalLink size={15} /> Apply Now
          </a>
          <button className="btn-save" onClick={onClose}>Close</button>
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
  const [form, setForm] = useState<Partial<CreditCard>>(editing ? { ...editing } : { ...EMPTY_FORM })
  const set = (k: keyof CreditCard, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.cardName?.trim()) return alert('Card name is required')
    if (!form.bank?.trim()) return alert('Bank name is required')
    if (!form.offerExpiryDate?.trim()) return alert('Offer Expiry Date is mandatory')
    const now = new Date().toISOString().split('T')[0]
    onSave({
      id: editing?.id ?? `card-${Date.now()}`,
      cardName: form.cardName!,
      bank: form.bank!,
      network: (form.network as CardNetwork) ?? 'Visa',
      tier: (form.tier as CardTier) ?? 'Classic',
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

  return (
    <div className="crud-modal-overlay">
      <div className="crud-modal" style={{ maxWidth: 860, width: '95vw' }}>
        <div className="modal-header">
          <h3 className="modal-title"><CardIcon size={20} style={{ marginRight: 8, color: '#6366f1' }} />{editing ? 'Edit Credit Card' : 'Add New Credit Card'}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Scrollable body */}
        <div className="modal-body">
          {/* Two-column layout: scrollable form + sticky preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'start' }}>

          {/* ── Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Card Name */}
            <div className="form-group">
              <label>Card Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" placeholder="e.g., HDFC Regalia Gold" value={form.cardName ?? ''} onChange={e => set('cardName', e.target.value)} />
            </div>

            {/* Bank + Network + Tier */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Bank <span style={{ color: '#ef4444' }}>*</span></label>
                <select value={form.bank ?? BANKS[0]} onChange={e => set('bank', e.target.value)}>
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

            {/* Card Image */}
            <ImageUploadField label="Card Image" placeholder="https://bank.com/card.png" value={form.imageUrl as string ?? ''} onChange={v => set('imageUrl', v)} />

            {/* Bank Logo */}
            <ImageUploadField label="Bank Logo" placeholder="https://bank.com/logo.png" value={form.bankLogoUrl as string ?? ''} onChange={v => set('bankLogoUrl', v)} />

            {/* Welcome Offer + Reward Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Welcome Offer</label>
                <input type="text" placeholder="₹1000 Amazon Gift Card on joining" value={form.welcomeOffer ?? ''} onChange={e => set('welcomeOffer', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Reward Rate</label>
                <input type="text" placeholder="5% Cashback on Amazon" value={form.rewardRate ?? ''} onChange={e => set('rewardRate', e.target.value)} />
              </div>
            </div>

            {/* Key Benefits */}
            <div className="form-group">
              <label>Key Benefits <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(comma-separated)</span></label>
              <input type="text" placeholder="Fuel surcharge waiver, 2 Lounge passes/qtr, Golf access" value={form.keyBenefits ?? ''} onChange={e => set('keyBenefits', e.target.value)} />
            </div>

            {/* Partner Brands */}
            <div className="form-group">
              <label>Partner Brands <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>(comma-separated)</span></label>
              <input type="text" placeholder="Amazon, Flipkart, Swiggy" value={form.partnerBrands ?? ''} onChange={e => set('partnerBrands', e.target.value)} />
            </div>

            {/* Fees */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label>Annual Fee</label>
                <input type="text" placeholder="₹999" value={form.annualFee ?? ''} onChange={e => set('annualFee', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Joining Fee</label>
                <input type="text" placeholder="₹999 or ₹0" value={form.joiningFee ?? ''} onChange={e => set('joiningFee', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fee Waiver</label>
                <input type="text" placeholder="Spend ₹1L/year" value={form.feeWaiver ?? ''} onChange={e => set('feeWaiver', e.target.value)} />
              </div>
            </div>

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
                <label>
                  Offer Expiry Date <span style={{ color: '#ef4444' }}>*</span>
                  <span style={{ fontSize: '0.68rem', color: '#ef4444', marginLeft: 4 }}>(Mandatory)</span>
                </label>
                <input
                  type="date"
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
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {([['isVerified', '✓ Verified'], ['isFeatured', '⭐ Featured']] as [keyof CreditCard, string][]).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: '#475569' }}>
                  <input type="checkbox" checked={(form[key] as boolean) ?? false} onChange={e => set(key, e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* ── Live Preview (sticky) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</div>
            {/* Card visual — fills 240px column, no overflow */}
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: 16 }}>
              <CardVisual card={form} size="lg" />
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: 12, border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{form.cardName || 'Card Name'}</div>
              <div style={{ color: '#64748b' }}>{form.bank || 'Bank'} · {form.network || 'Visa'}</div>
              {form.rewardRate && <div style={{ color: '#6366f1', fontWeight: 600, marginTop: 6 }}>{form.rewardRate}</div>}
              {form.annualFee && <div style={{ color: '#94a3b8', marginTop: 4, fontSize: '0.72rem' }}>Annual: {form.annualFee}</div>}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>Reflects customer-facing card</div>
          </div>
          </div>{/* end two-column grid */}
        </div>{/* end modal-body */}

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Card'}</button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Main Page
   ============================================================ */

export const ExecutiveCreditCardsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>(MOCK_CARDS)
  const [search, setSearch] = useState('')
  const [filterBank, setFilterBank] = useState('All')
  const [filterStatus, setFilterStatus] = useState<'all' | CardStatus>('all')
  const [filterTier, setFilterTier] = useState<'all' | CardTier>('all')
  const [sortBy, setSortBy] = useState<'expiry' | 'applies' | 'views' | 'added'>('expiry')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<CreditCard | null>(null)
  const [previewing, setPreviewing] = useState<CreditCard | null>(null)

  const kpi = useMemo(() => ({
    total: cards.length,
    active: cards.filter(c => c.status === 'active').length,
    featured: cards.filter(c => c.status === 'featured').length,
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
    list.sort((a, b) => {
      if (sortBy === 'expiry') return a.offerExpiryDate.localeCompare(b.offerExpiryDate)
      if (sortBy === 'applies') return b.applyCount - a.applyCount
      if (sortBy === 'views') return b.viewCount - a.viewCount
      if (sortBy === 'added') return b.addedOn.localeCompare(a.addedOn)
      return 0
    })
    return list
  }, [cards, search, filterBank, filterStatus, filterTier, sortBy])

  const openAdd = () => { setEditing(null); setIsFormOpen(true) }
  const openEdit = (c: CreditCard) => { setEditing(c); setIsFormOpen(true) }

  const handleSave = (data: CreditCard) => {
    setCards(prev => editing ? prev.map(c => c.id === data.id ? data : c) : [data, ...prev])
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this credit card?')) setCards(prev => prev.filter(c => c.id !== id))
  }

  const hasFilters = search || filterBank !== 'All' || filterStatus !== 'all' || filterTier !== 'all'

  return (
    <ExecutiveLayout activeMenu="credit-cards">
      <div className="executive-crud-page">

        {/* Header */}
        <div className="crud-header">
          <div>
            <h2 className="crud-title">Credit Card Management</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Manage partner credit cards, affiliate links & offer validity
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
          {hasFilters && <button onClick={() => { setSearch(''); setFilterBank('All'); setFilterStatus('all'); setFilterTier('all'); setSortBy('expiry') }} className="action-btn"><RotateCcw size={15} /></button>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>{filtered.length} of {cards.length} cards</span>
        </div>

        {/* Table */}
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Card</th>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                    <CardIcon size={40} strokeWidth={1} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                    No cards match your filters
                  </td>
                </tr>
              ) : filtered.map(card => {
                const days = daysLeft(card.offerExpiryDate)
                const pill = expiryPill(days)
                const sc = statusCfg(card.status)
                const tc = TIER_COLOR[card.tier]
                const netColor = NETWORK_COLOR[card.network]

                return (
                  <tr key={card.id}>
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
                      <span style={{ background: sc.bg, color: sc.color, borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{sc.label}</span>
                    </td>
                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="action-btn" onClick={() => setPreviewing(card)} title="Preview"><Eye size={15} /></button>
                        <button className="action-btn" onClick={() => openEdit(card)} title="Edit"><Edit2 size={15} /></button>
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
      {previewing && <CardPreviewModal card={previewing} onClose={() => setPreviewing(null)} />}
    </ExecutiveLayout>
  )
}
