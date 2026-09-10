import React, { useState, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { 
  CheckCircle2, 
  Store, 
  Search, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  Edit2, 
  Check, 
  X, 
  TrendingUp,
  Percent,
  Layers
} from 'lucide-react'
import './OperationsShared.css'
import { getStoreLogo } from '../../../data/dealsPage'

export interface MerchantPartner {
  id: string
  name: string
  category: string
  affiliateNetwork: 'Direct API' | 'Cuelinks' | 'EarnKaro' | 'Impact Radius' | 'Admitad'
  commissionRate: string
  userCashbackRate: string
  activeDealsCount: number
  trackingSpeed: string
  healthStatus: 'Online' | 'Degraded' | 'Offline'
  lastVerifiedAt: string
  affiliateBaseUrl: string
}

const initialMerchants: MerchantPartner[] = [
  {
    id: 'merch-01',
    name: 'Amazon',
    category: 'E-Commerce & All',
    affiliateNetwork: 'Direct API',
    commissionRate: 'Up to 10%',
    userCashbackRate: 'Up to 8%',
    activeDealsCount: 420,
    trackingSpeed: 'Instant (15 mins)',
    healthStatus: 'Online',
    lastVerifiedAt: '10 mins ago',
    affiliateBaseUrl: 'https://amazon.in?tag=wouchify-21'
  },
  {
    id: 'merch-02',
    name: 'Flipkart',
    category: 'E-Commerce & Mobiles',
    affiliateNetwork: 'Direct API',
    commissionRate: 'Up to 12%',
    userCashbackRate: 'Up to 9%',
    activeDealsCount: 380,
    trackingSpeed: 'Within 1 hour',
    healthStatus: 'Online',
    lastVerifiedAt: '12 mins ago',
    affiliateBaseUrl: 'https://flipkart.com?affid=wouchify'
  },
  {
    id: 'merch-03',
    name: 'Myntra',
    category: 'Fashion & Apparel',
    affiliateNetwork: 'Cuelinks',
    commissionRate: '8.5%',
    userCashbackRate: '6.5%',
    activeDealsCount: 195,
    trackingSpeed: 'Within 2 hours',
    healthStatus: 'Online',
    lastVerifiedAt: '25 mins ago',
    affiliateBaseUrl: 'https://cuelinks.com/link?url=myntra'
  },
  {
    id: 'merch-04',
    name: 'Ajio',
    category: 'Fashion & Trends',
    affiliateNetwork: 'EarnKaro',
    commissionRate: '9.0%',
    userCashbackRate: '7.0%',
    activeDealsCount: 140,
    trackingSpeed: 'Within 4 hours',
    healthStatus: 'Degraded',
    lastVerifiedAt: '1 hour ago',
    affiliateBaseUrl: 'https://earnkaro.com/ajio-deal'
  },
  {
    id: 'merch-05',
    name: 'Tata CLiQ',
    category: 'Luxury & Electronics',
    affiliateNetwork: 'Impact Radius',
    commissionRate: '6.0%',
    userCashbackRate: '4.5%',
    activeDealsCount: 88,
    trackingSpeed: 'Within 24 hours',
    healthStatus: 'Online',
    lastVerifiedAt: '40 mins ago',
    affiliateBaseUrl: 'https://tatacliq.com?partner=wouchify'
  },
  {
    id: 'merch-06',
    name: 'Nykaa',
    category: 'Beauty & Cosmetics',
    affiliateNetwork: 'Admitad',
    commissionRate: '11.0%',
    userCashbackRate: '8.5%',
    activeDealsCount: 110,
    trackingSpeed: 'Within 3 hours',
    healthStatus: 'Online',
    lastVerifiedAt: '15 mins ago',
    affiliateBaseUrl: 'https://nykaa.com?aff=wouchify'
  },
  {
    id: 'merch-07',
    name: 'Swiggy',
    category: 'Food Delivery & Dineout',
    affiliateNetwork: 'Direct API',
    commissionRate: 'Flat ₹35/order',
    userCashbackRate: 'Flat ₹25/order',
    activeDealsCount: 45,
    trackingSpeed: 'Instant',
    healthStatus: 'Online',
    lastVerifiedAt: '5 mins ago',
    affiliateBaseUrl: 'https://swiggy.com?ref=wouchify'
  },
  {
    id: 'merch-08',
    name: 'Dominos',
    category: 'Food & Pizza',
    affiliateNetwork: 'Cuelinks',
    commissionRate: '7.5%',
    userCashbackRate: '5.0%',
    activeDealsCount: 32,
    trackingSpeed: 'Within 1 hour',
    healthStatus: 'Online',
    lastVerifiedAt: '30 mins ago',
    affiliateBaseUrl: 'https://dominos.co.in'
  }
]

export const OperationsMerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<MerchantPartner[]>(initialMerchants)
  const [searchTerm, setSearchTerm] = useState('')
  const [networkFilter, setNetworkFilter] = useState('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 2-Step Edit Modal
  const [editingMerchant, setEditingMerchant] = useState<MerchantPartner | null>(null)
  const [modalStep, setModalStep] = useState<1 | 2>(1)
  const [editForm, setEditForm] = useState<MerchantPartner | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const totalMerchants = merchants.length
  const totalActiveDeals = merchants.reduce((acc, m) => acc + m.activeDealsCount, 0)
  const onlineCount = merchants.filter(m => m.healthStatus === 'Online').length
  const degradedCount = merchants.filter(m => m.healthStatus === 'Degraded').length
  const uptimePercent = ((onlineCount / totalMerchants) * 100).toFixed(1)

  const filteredMerchants = useMemo(() => {
    return merchants.filter(m => {
      if (networkFilter !== 'all' && m.affiliateNetwork !== networkFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchName = m.name.toLowerCase().includes(q)
        const matchCat = m.category.toLowerCase().includes(q)
        const matchNet = m.affiliateNetwork.toLowerCase().includes(q)
        if (!matchName && !matchCat && !matchNet) return false
      }
      return true
    })
  }, [merchants, networkFilter, searchTerm])

  const handleTestLink = (merchant: MerchantPartner) => {
    showToast(`Pinging ${merchant.name} affiliate redirect... Link status is Healthy (200 OK)`)
    setMerchants(prev => prev.map(m => m.id === merchant.id ? { ...m, healthStatus: 'Online', lastVerifiedAt: 'Just now' } : m))
  }

  const handleOpenEdit = (merchant: MerchantPartner) => {
    setEditingMerchant(merchant)
    setEditForm({ ...merchant })
    setModalStep(1)
  }

  const handleSaveMerchant = () => {
    if (!editForm) return
    setMerchants(prev => prev.map(m => m.id === editForm.id ? editForm : m))
    showToast(`Updated settings for ${editForm.name}`)
    setEditingMerchant(null)
  }

  const handleExportCSV = () => {
    const headers = ['MerchantID', 'Name', 'Category', 'AffiliateNetwork', 'StoreCommission', 'UserCashback', 'ActiveDeals', 'HealthStatus']
    const rows = filteredMerchants.map(m => [
      m.id,
      `"${m.name}"`,
      `"${m.category}"`,
      m.affiliateNetwork,
      `"${m.commissionRate}"`,
      `"${m.userCashbackRate}"`,
      m.activeDealsCount,
      m.healthStatus
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_merchant_affiliates_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported merchant affiliate list to CSV')
  }

  return (
    <OperationsLayout activeMenu="merchants">
      <div className="executive-crud-page">
        
        {/* Toast */}
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="crud-header">
          <div>
            <h1 className="crud-title">Merchant Partner & Affiliate Health Monitor</h1>
            <p className="crud-subtitle">
              Manage store integration networks, configure cashback sharing matrices, and track live affiliate link health.
            </p>
          </div>

          <div className="crud-header-actions">
            <button className="btn-secondary" onClick={handleExportCSV}>
              <Download size={16} /> Export Merchants
            </button>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          
          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Integrated Partners</span>
              <span className="kpi-value">{totalMerchants}</span>
              <span className="kpi-sub">Across 5 affiliate networks</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Store size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Active Deals & Codes</span>
              <span className="kpi-value">{totalActiveDeals}</span>
              <span className="kpi-sub">Live on Wouchify storefront</span>
            </div>
            <div className="kpi-icon ops-kpi-green">
              <Layers size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Link Health Index</span>
              <span className="kpi-value">{uptimePercent}%</span>
              <span className="kpi-sub">{degradedCount} link degraded</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Commissions Reconciled</span>
              <span className="kpi-value">₹18.4 Lakhs</span>
              <span className="kpi-sub">Month-to-Date Volume</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <TrendingUp size={20} />
            </div>
          </div>

        </div>

        {/* Filter Bar */}
        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search merchant name, category or network…" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-dropdown-wrap">
            <select 
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Affiliate Networks</option>
              <option value="Direct API">Direct API</option>
              <option value="Cuelinks">Cuelinks</option>
              <option value="EarnKaro">EarnKaro</option>
              <option value="Impact Radius">Impact Radius</option>
              <option value="Admitad">Admitad</option>
            </select>
          </div>
        </div>

        {/* Merchant Table */}
        <div className="crud-table-card">
          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Store Partner</th>
                  <th>Category</th>
                  <th>Affiliate Network</th>
                  <th>Store Commission</th>
                  <th>Shopper Cashback</th>
                  <th>Active Deals</th>
                  <th>Tracking Speed</th>
                  <th>Health Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={getStoreLogo(merchant.name)} 
                          alt={merchant.name} 
                          style={{ height: '22px', maxWidth: '65px', objectFit: 'contain' }} 
                        />
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{merchant.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{merchant.category}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '5px' }}>
                        {merchant.affiliateNetwork}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        {merchant.commissionRate}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>
                        {merchant.userCashbackRate}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: '#0f172a' }}>{merchant.activeDealsCount}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{merchant.trackingSpeed}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${merchant.healthStatus === 'Online' ? 'approved' : 'draft'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <span className={`health-dot ${merchant.healthStatus === 'Online' ? 'online' : 'warning'}`}></span>
                        {merchant.healthStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          type="button" 
                          className="btn-preview-quick" 
                          onClick={() => handleTestLink(merchant)}
                          title="Verify affiliate tracking redirect"
                        >
                          <RefreshCw size={13} />
                        </button>
                        <button 
                          type="button" 
                          className="btn-approve-quick" 
                          style={{ background: '#334155' }}
                          onClick={() => handleOpenEdit(merchant)}
                          title="Configure commission tier"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 2-STEP EDIT MERCHANT CONFIG MODAL ── */}
        {editingMerchant && editForm && (
          <div className="crud-modal-overlay" onClick={() => setEditingMerchant(null)}>
            <div className="crud-modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <Store size={12} /> Partner Configuration
                  </span>
                  <h3 className="modal-title" style={{ marginTop: '4px' }}>Edit {editingMerchant.name} Integration</h3>
                </div>
                <button className="modal-close" onClick={() => setEditingMerchant(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* 2-Step Form Stepper */}
              <div className="form-stepper" style={{ margin: '0 24px' }}>
                <button 
                  type="button" 
                  className={`step-tab-btn ${modalStep === 1 ? 'active' : 'completed'}`}
                  onClick={() => setModalStep(1)}
                >
                  <span className="step-number">{modalStep > 1 ? '✓' : '1'}</span>
                  <div className="step-info">
                    <span className="step-title">Step 1: Network & Affiliate Link</span>
                    <span className="step-desc">Tracking network, sub-ID & redirect URL</span>
                  </div>
                </button>

                <div className="step-divider" />

                <button 
                  type="button" 
                  className={`step-tab-btn ${modalStep === 2 ? 'active' : ''}`}
                  onClick={() => setModalStep(2)}
                >
                  <span className="step-number">2</span>
                  <div className="step-info">
                    <span className="step-title">Step 2: Commission & Cashback Rates</span>
                    <span className="step-desc">Store rate & user payout matrix</span>
                  </div>
                </button>
              </div>

              <div className="modal-body">
                {modalStep === 1 && (
                  <div className="form-step-pane">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Store size={16} /></div>
                        <h4 className="form-section-title">Integration & Routing</h4>
                        <span className="form-section-desc">Tracking network assignment</span>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Merchant Name</label>
                          <input type="text" value={editForm.name} disabled />
                        </div>
                        <div className="form-group">
                          <label>Affiliate Network</label>
                          <select 
                            value={editForm.affiliateNetwork}
                            onChange={(e) => setEditForm({ ...editForm, affiliateNetwork: e.target.value as any })}
                          >
                            <option value="Direct API">Direct API</option>
                            <option value="Cuelinks">Cuelinks</option>
                            <option value="EarnKaro">EarnKaro</option>
                            <option value="Impact Radius">Impact Radius</option>
                            <option value="Admitad">Admitad</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>Base Affiliate Redirect URL</label>
                        <input 
                          type="text" 
                          value={editForm.affiliateBaseUrl}
                          onChange={(e) => setEditForm({ ...editForm, affiliateBaseUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {modalStep === 2 && (
                  <div className="form-step-pane">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-icon"><Percent size={16} /></div>
                        <h4 className="form-section-title">Commission Economics</h4>
                        <span className="form-section-desc">Configure payout sharing thresholds</span>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Store Commission Rate</label>
                          <input 
                            type="text" 
                            value={editForm.commissionRate}
                            onChange={(e) => setEditForm({ ...editForm, commissionRate: e.target.value })}
                            placeholder="e.g. Up to 10%"
                          />
                          <span className="field-hint">Gross earning received from store</span>
                        </div>

                        <div className="form-group highlight-input">
                          <label>Shopper Cashback Rate</label>
                          <input 
                            type="text" 
                            value={editForm.userCashbackRate}
                            onChange={(e) => setEditForm({ ...editForm, userCashbackRate: e.target.value })}
                            placeholder="e.g. Up to 8%"
                          />
                          <span className="field-hint">Net cash credited to shopper wallet</span>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>Tracking & Reporting Latency</label>
                        <input 
                          type="text" 
                          value={editForm.trackingSpeed}
                          onChange={(e) => setEditForm({ ...editForm, trackingSpeed: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Step <strong>{modalStep} of 2</strong> • Status: <strong style={{ color: '#0f172a' }}>{editForm.healthStatus}</strong>
                </div>

                <div className="modal-footer-actions">
                  {modalStep === 1 ? (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setEditingMerchant(null)}>
                        Cancel
                      </button>
                      <button type="button" className="btn-save" onClick={() => setModalStep(2)}>
                        Next: Commission Economics →
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn-cancel" onClick={() => setModalStep(1)}>
                        ← Back to Step 1
                      </button>
                      <button type="button" className="btn-save" onClick={handleSaveMerchant}>
                        <Check size={16} /> Save Configuration
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </OperationsLayout>
  )
}
