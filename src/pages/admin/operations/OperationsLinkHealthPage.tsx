import React, { useState } from 'react'
import { OperationsLayout } from './OperationsLayout'
import {
  ShieldCheck,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Upload,
  Download,
  Copy,
  Check,
  Zap,
  Tag,
  Lock,
  FileSpreadsheet
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'
import './OperationsShared.css'

interface SingleVerificationResult {
  url: string
  isValid: boolean
  statusCode: number
  statusText: string
  latencyMs: number
  isHttps: boolean
  sslStatus: string
  domain: string
  storeName: string
  hasAffiliateTag: boolean
  affiliateTag: string
  destinationUrl: string
  redirectHops: number
  checkedAt: string
}

interface CouponValidationResult {
  code: string
  store: string
  discount: string
  expiryDate: string
  daysRemaining: number
  isExpired: boolean
  regexValid: boolean
  verdict: 'VALID' | 'WARNING' | 'EXPIRED' | 'INVALID'
  verdictMessage: string
  storeMatched: boolean
  checkedAt: string
}

const PRESET_LINKS = [
  { label: 'Amazon India Deal', url: 'https://amazon.in/dp/B09XS7JWHH?tag=wouchify-21' },
  { label: 'Flipkart Big Saver', url: 'https://flipkart.com/deal-item?affid=wouchify_app&affExtParam1=exec_feed' },
  { label: 'Myntra Fashion Glitch', url: 'https://myntra.com/puma-speedcat?utm_source=wouchify' },
  { label: 'Swiggy Food Coupon', url: 'https://swiggy.com/restaurants/special?subid=wouchify_cashback' },
  { label: 'Broken / Expired Link', url: 'https://broken-store.in/discount-expired-product?tag=none' }
]

const STORES_LIST = [
  'Amazon',
  'Flipkart',
  'Myntra',
  'Swiggy',
  'Zomato',
  'Ajio',
  'Nykaa',
  'Zepto',
  'BigBasket',
  'Tata CLiQ',
  'Reliance Digital',
  'Domino\'s'
]

export const OperationsLinkHealthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'links' | 'coupons'>('links')

  // ── Tab 1: Single Link State ──
  const [singleUrl, setSingleUrl] = useState('https://amazon.in/dp/B09XS7JWHH?tag=wouchify-21')
  const [isVerifyingLink, setIsVerifyingLink] = useState(false)
  const [linkResult, setLinkResult] = useState<SingleVerificationResult | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // ── Tab 1: Batch Testing State ──
  const [batchInput, setBatchInput] = useState(
    `https://amazon.in/dp/B09XS7JWHH?tag=wouchify-21\nhttps://flipkart.com/item-1293?affid=wouchify_app\nhttps://myntra.com/sneakers?utm_source=wouchify\nhttps://broken-store-partner.com/product-expired`
  )
  const [isBatchTesting, setIsBatchTesting] = useState(false)
  const [batchResults, setBatchResults] = useState<SingleVerificationResult[]>([])

  // ── Tab 2: Coupon Validator State ──
  const [couponCode, setCouponCode] = useState('MYNTRAPRO')
  const [selectedStore, setSelectedStore] = useState('Myntra')
  const [expiryDate, setExpiryDate] = useState('2026-10-31')
  const [discountLabel, setDiscountLabel] = useState('Flat ₹500 OFF')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null)
  const [validationHistory, setValidationHistory] = useState<CouponValidationResult[]>([])

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // ── Actions: Link Inspection ──
  const handleVerifySingleLink = async (urlToTest?: string) => {
    const target = urlToTest || singleUrl
    if (!target.trim()) return

    setIsVerifyingLink(true)
    try {
      const res = await adminApi.verifyLink(target)
      setLinkResult(res)
    } catch (e) {
      console.error(e)
    } finally {
      setIsVerifyingLink(false)
    }
  }

  // ── Actions: Batch Link Testing ──
  const handleRunBatchVerification = async () => {
    const urls = batchInput
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0)

    if (urls.length === 0) return

    setIsBatchTesting(true)
    const results: SingleVerificationResult[] = []

    for (const u of urls) {
      try {
        const res = await adminApi.verifyLink(u)
        results.push(res)
      } catch (err) {
        results.push({
          url: u,
          isValid: false,
          statusCode: 500,
          statusText: '500 Verification Error',
          latencyMs: 350,
          isHttps: false,
          sslStatus: 'Unknown',
          domain: 'unknown',
          storeName: 'Unknown',
          hasAffiliateTag: false,
          affiliateTag: 'None',
          destinationUrl: u,
          redirectHops: 0,
          checkedAt: new Date().toISOString()
        })
      }
    }

    setBatchResults(results)
    setIsBatchTesting(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      const content = (event.target?.result as string) || ''
      // Extract links from lines
      const lines = content.split(/\r?\n/).filter(l => l.includes('http'))
      if (lines.length > 0) {
        setBatchInput(lines.join('\n'))
      } else {
        setBatchInput(content)
      }
    }
    reader.readAsText(file)
  }

  const handleExportBatchCSV = () => {
    if (batchResults.length === 0) return
    const headers = ['URL', 'Domain', 'Store', 'Status Code', 'Status Text', 'Latency (ms)', 'SSL Status', 'Affiliate Tag Verified', 'Affiliate Tag Value']
    const rows = batchResults.map(r => [
      `"${r.url.replace(/"/g, '""')}"`,
      r.domain,
      r.storeName,
      r.statusCode,
      r.statusText,
      r.latencyMs,
      r.sslStatus,
      r.hasAffiliateTag ? 'YES' : 'NO',
      `"${r.affiliateTag}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encoded = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encoded)
    link.setAttribute('download', `wouchify_link_verification_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ── Actions: Coupon Validation ──
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return

    setIsValidatingCoupon(true)
    try {
      const res = await adminApi.verifyCoupon(couponCode, selectedStore, expiryDate, discountLabel)
      setCouponResult(res)
      setValidationHistory((prev: CouponValidationResult[]) => [res, ...prev.filter((h: CouponValidationResult) => h.code !== res.code)])
    } catch (e) {
      console.error(e)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  return (
    <OperationsLayout activeMenu="link-health">
      <div className="executive-crud-page">
        {/* Header */}
        <div className="crud-header" style={{ marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '6px' }}>
              <ShieldCheck size={14} /> QUALITY & REDIRECT ASSURANCE
            </div>
            <h1 className="crud-title">Affiliate Affiliate Link Health Checker Suite</h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
              Trace redirect hops, inspect affiliate sub-IDs, test HTTP status codes, and analyze coupon expiry algorithms.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'links' ? '#E31E25' : '#64748b',
              borderBottom: activeTab === 'links' ? '3px solid #E31E25' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            <LinkIcon size={17} /> Tab 1: Live Affiliate Link & Redirect Tracer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'coupons' ? '#E31E25' : '#64748b',
              borderBottom: activeTab === 'coupons' ? '3px solid #E31E25' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            <Tag size={17} /> Tab 2: Coupon Code & Expiry Validator
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: LIVE AFFILIATE LINK & REDIRECT TRACER
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Single Link Inspector */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    Single Affiliate URL Inspector
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Inspect redirect headers, latency, SSL authenticity, and check if Wouchify tracking parameter is properly appended.
                  </p>
                </div>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>Test Presets:</span>
                {PRESET_LINKS.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setSingleUrl(p.url)
                      handleVerifySingleLink(p.url)
                    }}
                    style={{
                      padding: '4px 10px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Input & Action */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
                  <input
                    type="url"
                    placeholder="Enter full affiliate link e.g. https://amazon.in/dp/...?tag=wouchify-21"
                    value={singleUrl}
                    onChange={e => setSingleUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifySingleLink()}
                  disabled={isVerifyingLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: '#1E2460',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isVerifyingLink ? 'not-allowed' : 'pointer',
                    opacity: isVerifyingLink ? 0.7 : 1
                  }}
                >
                  {isVerifyingLink ? <RefreshCw size={16} className="spin-animation" /> : <ShieldCheck size={16} />}
                  <span>{isVerifyingLink ? 'Inspecting...' : 'Inspect Link'}</span>
                </button>
              </div>

              {/* Inspection Result Card */}
              {linkResult && (
                <div
                  style={{
                    marginTop: '20px',
                    background: linkResult.isValid ? '#f0fdf4' : '#fef2f2',
                    border: `1.5px solid ${linkResult.isValid ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: `1px solid ${linkResult.isValid ? '#dcfce7' : '#fee2e2'}`, paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: linkResult.isValid ? '#16a34a' : '#dc2626',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {linkResult.isValid ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: linkResult.isValid ? '#166534' : '#991b1b' }}>
                            {linkResult.statusText}
                          </span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: linkResult.latencyMs < 150 ? '#dcfce7' : linkResult.latencyMs < 300 ? '#fef3c7' : '#fee2e2',
                              color: linkResult.latencyMs < 150 ? '#15803d' : linkResult.latencyMs < 300 ? '#b45309' : '#b91c1c'
                            }}
                          >
                            ⚡ {linkResult.latencyMs}ms Latency
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                          Domain: <strong>{linkResult.domain}</strong> • Store Partner: <strong>{linkResult.storeName}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={linkResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={13} /> Open Live URL
                      </a>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        SSL & Security Status
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: linkResult.isHttps ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>
                        <Lock size={14} />
                        <span>{linkResult.sslStatus}</span>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Affiliate Sub-ID Tracking
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: linkResult.hasAffiliateTag ? '#16a34a' : '#d97706', fontWeight: 700, fontSize: '0.85rem' }}>
                        <Tag size={14} />
                        <span>{linkResult.hasAffiliateTag ? `Verified (${linkResult.affiliateTag})` : 'Tag Missing'}</span>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Redirect Hops
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: '#1e293b', fontWeight: 700, fontSize: '0.85rem' }}>
                        <ArrowRight size={14} />
                        <span>{linkResult.redirectHops} Hops (Clean Chain)</span>
                      </div>
                    </div>
                  </div>

                  {/* Traced Destination Link */}
                  <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Resolved Merchant Landing URL:
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(linkResult.destinationUrl, 'dest-url')}
                        style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedField === 'dest-url' ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedField === 'dest-url' ? 'Copied' : 'Copy Destination'}</span>
                      </button>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#0f172a', wordBreak: 'break-all' }}>
                      {linkResult.destinationUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Batch URL Tester */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={18} style={{ color: '#16a34a' }} />
                    Batch Affiliate URL Validator
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Paste multiple URLs (one per line) or upload a CSV file from merchant affiliate networks.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={14} /> Upload CSV
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>

                  {batchResults.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportBatchCSV}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={14} /> Export Results
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={4}
                value={batchInput}
                onChange={e => setBatchInput(e.target.value)}
                placeholder="Paste affiliate links here (one link per row)..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '12px'
                }}
              />

              <button
                type="button"
                onClick={handleRunBatchVerification}
                disabled={isBatchTesting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#E31E25',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: isBatchTesting ? 'not-allowed' : 'pointer',
                  opacity: isBatchTesting ? 0.7 : 1
                }}
              >
                {isBatchTesting ? <RefreshCw size={15} className="spin-animation" /> : <Zap size={15} />}
                <span>{isBatchTesting ? 'Validating Batch...' : 'Run Batch Validation'}</span>
              </button>

              {/* Batch Results Table */}
              {batchResults.length > 0 && (
                <div style={{ marginTop: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Batch Test Summary: {batchResults.filter(r => r.isValid).length} Healthy / {batchResults.length} Total Checked
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {batchResults.filter(r => r.hasAffiliateTag).length} Tag Verified
                    </span>
                  </div>

                  <div className="crud-table-wrapper" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <table className="crud-table" style={{ minWidth: '850px' }}>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Store & Domain</th>
                          <th>Affiliate Tag Status</th>
                          <th>Latency</th>
                          <th>Destination URL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchResults.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: item.isValid ? '#dcfce7' : '#fee2e2',
                                  color: item.isValid ? '#15803d' : '#dc2626'
                                }}
                              >
                                {item.isValid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                {item.statusCode}
                              </span>
                            </td>
                            <td>
                              <div>
                                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{item.storeName}</strong>
                                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>{item.domain}</span>
                              </div>
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: item.hasAffiliateTag ? '#166534' : '#b45309',
                                  background: item.hasAffiliateTag ? '#f0fdf4' : '#fffbeb',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  border: `1px solid ${item.hasAffiliateTag ? '#bbf7d0' : '#fde68a'}`
                                }}
                              >
                                {item.hasAffiliateTag ? `✓ Tag: ${item.affiliateTag}` : '⚠ Missing Tag'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.latencyMs < 200 ? '#16a34a' : '#ea580c' }}>
                                {item.latencyMs}ms
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', maxWidth: '300px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.destinationUrl}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: COUPON CODE & EXPIRY VALIDATOR
           ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'coupons' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  Coupon Code & Expiry Validator
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Run algorithm checks on promo code casing, character set syntax, merchant rules, and calculate exact expiration countdowns.
                </p>
              </div>

              {/* Input Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Coupon Code <span className="required-star">*</span></label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MYNTRAPRO"
                    style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Store Partner <span className="required-star">*</span></label>
                  <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
                    {STORES_LIST.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Offer Expiry Date <span className="required-star">*</span></label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Discount Label</label>
                  <input
                    type="text"
                    value={discountLabel}
                    onChange={e => setDiscountLabel(e.target.value)}
                    placeholder="e.g. Flat ₹500 OFF"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleValidateCoupon}
                disabled={isValidatingCoupon}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: '#1E2460',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isValidatingCoupon ? 'not-allowed' : 'pointer'
                }}
              >
                {isValidatingCoupon ? <RefreshCw size={16} className="spin-animation" /> : <Tag size={16} />}
                <span>Validate Coupon</span>
              </button>

              {/* Coupon Validation Verdict */}
              {couponResult && (
                <div
                  style={{
                    marginTop: '24px',
                    background:
                      couponResult.verdict === 'VALID'
                        ? '#f0fdf4'
                        : couponResult.verdict === 'WARNING'
                        ? '#fffbeb'
                        : '#fef2f2',
                    border: `1.5px solid ${
                      couponResult.verdict === 'VALID'
                        ? '#bbf7d0'
                        : couponResult.verdict === 'WARNING'
                        ? '#fde68a'
                        : '#fecaca'
                    }`,
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background:
                            couponResult.verdict === 'VALID'
                              ? '#16a34a'
                              : couponResult.verdict === 'WARNING'
                              ? '#d97706'
                              : '#dc2626',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {couponResult.verdict === 'VALID' ? (
                          <CheckCircle2 size={22} />
                        ) : couponResult.verdict === 'WARNING' ? (
                          <AlertTriangle size={22} />
                        ) : (
                          <XCircle size={22} />
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                          Validation Verdict: {couponResult.verdict}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                          {couponResult.verdictMessage}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: couponResult.daysRemaining > 0 ? '#16a34a' : '#dc2626'
                      }}
                    >
                      ⏱ {couponResult.daysRemaining > 0 ? `${couponResult.daysRemaining} Days Remaining` : 'Offer Expired'}
                    </div>
                  </div>

                  {/* Criteria Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Coupon Code</span>
                      <strong style={{ display: 'block', fontSize: '1rem', fontFamily: 'monospace', color: '#0f172a', marginTop: '2px' }}>
                        {couponResult.code}
                      </strong>
                    </div>

                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Format & Regex</span>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: couponResult.regexValid ? '#16a34a' : '#dc2626', marginTop: '4px' }}>
                        {couponResult.regexValid ? '✓ Standard Alphanumeric' : '✗ Invalid Format'}
                      </span>
                    </div>

                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Store Alignment</span>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {couponResult.store} (Verified)
                      </span>
                    </div>

                    <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Discount Config</span>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                        {couponResult.discount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation History */}
              {validationHistory.length > 0 && (
                <div style={{ marginTop: '24px', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      Recent Coupon Validations ({validationHistory.length})
                    </span>
                  </div>
                  <div className="crud-table-wrapper">
                    <table className="crud-table" style={{ minWidth: '700px' }}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Store</th>
                          <th>Discount</th>
                          <th>Expiry Date</th>
                          <th>Verdict</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validationHistory.map((h, i) => (
                          <tr key={i}>
                            <td>
                              <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{h.code}</strong>
                            </td>
                            <td>{h.store}</td>
                            <td>{h.discount}</td>
                            <td>{h.expiryDate}</td>
                            <td>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  background: h.verdict === 'VALID' ? '#dcfce7' : h.verdict === 'WARNING' ? '#fef3c7' : '#fee2e2',
                                  color: h.verdict === 'VALID' ? '#15803d' : h.verdict === 'WARNING' ? '#b45309' : '#b91c1c'
                                }}
                              >
                                {h.verdict}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </OperationsLayout>
  )
}
