import React, { useState, useEffect, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { adminApi } from '../../../services/adminApi'
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Zap, 
  Flame, 
  Tag, 
  Store,
  Layers,
  Edit2,
  Trash2,
  Pause,
  Play,
  Plus,
  X
} from 'lucide-react'
import './OperationsShared.css'
import { PLACEHOLDER_DEAL_IMAGE } from '../../../data/dealsPage'

export const OperationsApprovedDataPage: React.FC = () => {
  // Predefined Schemas for rendering all input fields even if they are empty
  const schemas = {
    deals: [
      'name', 'title', 'store', 'brand', 'category', 'subCategory', 'asinOrSku', 'type', 
      'price', 'originalPrice', 'discount', 'discountLabel', 'discountValue', 'bankOffer', 
      'effectivePrice', 'code', 'cashback', 'stockStatus', 'rating', 'deliveryInfo', 
      'warranty', 'variantNote', 'howToClaim', 'highlights', 'status', 'submissionStatus', 
      'priority', 'expiry', 'postedAt', 'productImage', 'image', 'images', 'storeLogo', 
      'ctaText', 'ctaHref', 'link', 'badge', 'dealTag', 'verified', 'isVerified', 
      'isFeatured', 'isBestSelling', 'showOnHome', 'sectionPlacement', 'publishAt', 'expiresAt', 
      'description', 'terms', 'clicks'
    ],
    loot_deals: [
      'title', 'name', 'store', 'storeName', 'brand', 'category', 'lootType', 'dealType', 
      'badge', 'status', 'submissionStatus', 'priority', 'code', 'link', 'href', 
      'originalPrice', 'price', 'currentPrice', 'discount', 'discountLabel', 'discountValue', 
      'effectivePrice', 'cashback', 'stockClaimedPercent', 'quantityAlert', 'proofNote', 
      'trickSteps', 'terms', 'asinOrSku', 'deliveryInfo', 'rating', 'postedAt', 'image', 
      'images', 'telegramAlert', 'pushNotification', 'isFeatured', 'isVerified', 
      'isBestSelling', 'showOnHome', 'sectionPlacement', 'publishAt', 'expiresAt', 'clicks'
    ],
    stores: [
      'name', 'slug', 'category', 'logo', 'reward', 'description', 'cardBg', 'badgeBg', 
      'href', 'status', 'submissionStatus', 'isFeatured', 'showOnHome', 'opsManagerApproval', 'managerApproval', 
      'publishAt', 'expiresAt', 'submittedBy', 'clicks'
    ],
    coupons: [
      'title', 'description', 'store', 'category', 'code', 'couponType', 'discount', 
      'discountValue', 'minOrder', 'maxDiscount', 'affiliateLink', 'status', 
      'submissionStatus', 'opsManagerApproval', 'managerApproval', 'submittedBy', 
      'isExclusive', 'isFeatured', 'isVerified', 'showOnHome', 'telegramAlert', 'startDate', 
      'expiryDate', 'expiry', 'usageCount', 'usageLimit', 'totalUses', 'publishAt', 
      'expiresAt', 'clicks'
    ]
  }

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'deals' | 'loot_deals' | 'stores' | 'coupons'>('deals')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [deals, setDeals] = useState<any[]>([])
  const [lootDeals, setLootDeals] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  
  // Alert/Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [fetchedDeals, fetchedLootDeals, fetchedStores, fetchedCoupons] = await Promise.all([
        adminApi.getDeals({ all: true }),
        adminApi.getLootDeals({ all: true }),
        adminApi.getStores({ all: true }),
        adminApi.getCoupons({ all: true })
      ])
      
      const isNotDeleted = (item: any) => {
        const s = (item.status || '').toLowerCase()
        return s !== 'deleted'
      }

      setDeals(fetchedDeals.filter(isNotDeleted))
      setLootDeals(fetchedLootDeals.filter(isNotDeleted))
      setStores(fetchedStores.filter(isNotDeleted))
      setCoupons(fetchedCoupons.filter(isNotDeleted))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    let sourceData = []
    if (activeTab === 'deals') sourceData = deals
    else if (activeTab === 'loot_deals') sourceData = lootDeals
    else if (activeTab === 'stores') sourceData = stores
    else if (activeTab === 'coupons') sourceData = coupons

    if (!searchTerm.trim()) return sourceData

    const q = searchTerm.toLowerCase()
    return sourceData.filter(item => {
      const titleMatch = (item.title || item.name || item.storeName || '').toLowerCase().includes(q)
      const storeMatch = (item.store || item.brand || '').toLowerCase().includes(q)
      const codeMatch = (item.code || '').toLowerCase().includes(q)
      return titleMatch || storeMatch || codeMatch
    })
  }, [activeTab, deals, lootDeals, stores, coupons, searchTerm])

  const handleAddNew = () => {
    setIsEditing(false)
    
    // Default schemas based on type
    const defaultData: any = { status: 'Active' }
    if (activeTab === 'deals' || activeTab === 'loot_deals') {
      defaultData.title = ''
      defaultData.store = ''
      defaultData.price = ''
      defaultData.originalPrice = ''
      defaultData.link = ''
      defaultData.image = ''
    } else if (activeTab === 'stores') {
      defaultData.name = ''
      defaultData.category = ''
      defaultData.logo = ''
      defaultData.link = ''
    } else if (activeTab === 'coupons') {
      defaultData.title = ''
      defaultData.store = ''
      defaultData.code = ''
      defaultData.discount = ''
      defaultData.link = ''
    }
    
    setFormData(defaultData)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setIsEditing(true)
    setFormData({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      if (activeTab === 'deals') await adminApi.deleteDeal(id)
      else if (activeTab === 'loot_deals') await adminApi.deleteLootDeal(id)
      else if (activeTab === 'stores') await adminApi.deleteStore(id)
      else if (activeTab === 'coupons') await adminApi.deleteCoupon(id)
      
      showToast('Item deleted successfully')
      fetchData(true)
    } catch (err: any) {
      alert(`Error deleting item: ${err.message}`)
    }
  }

  const handleToggleStatus = async (item: any) => {
    const id = item.id || item._id
    if (!id) return
    
    try {
      // Toggle logic varies by model in backend, often it toggles between Active/Inactive
      if (activeTab === 'deals') await adminApi.toggleDealStatus(id)
      else if (activeTab === 'loot_deals') await adminApi.toggleLootDealStatus(id)
      else if (activeTab === 'stores') {
        // Manually update store status if toggle method doesn't exist
        const newStatus = (item.status || '').toLowerCase() === 'active' ? 'Inactive' : 'Active'
        await adminApi.updateStore(id, { ...item, status: newStatus })
      }
      else if (activeTab === 'coupons') await adminApi.toggleCreditCardStatus(id) // Note: Coupons might not have a direct toggle in API, fall back to update if needed
      
      showToast('Status toggled successfully')
      fetchData(true)
    } catch (err: any) {
      // Fallback for endpoints that don't have a direct status toggle
      try {
        const newStatus = (item.status || '').toLowerCase() === 'active' ? 'Inactive' : 'Active'
        if (activeTab === 'deals') await adminApi.updateDeal(id, { ...item, status: newStatus })
        else if (activeTab === 'loot_deals') await adminApi.updateLootDeal(id, { ...item, status: newStatus })
        else if (activeTab === 'coupons') await adminApi.updateCoupon(id, { ...item, status: newStatus })
        showToast('Status updated successfully')
        fetchData(true)
      } catch (fallbackErr: any) {
        alert(`Error toggling status: ${fallbackErr.message}`)
      }
    }
  }

  const handleToggleShowOnHome = async (item: any, isChecked: boolean) => {
    const id = item.id || item._id
    try {
      const newPlacement = isChecked ? (item.sectionPlacement === 'none' ? 'both' : (item.sectionPlacement || 'both')) : 'none'
      const payload: any = { showOnHome: isChecked }
      if (activeTab === 'deals' || activeTab === 'loot_deals') {
        payload.sectionPlacement = newPlacement
      }
      
      if (activeTab === 'deals') await adminApi.updateDeal(id, payload)
      else if (activeTab === 'loot_deals') await adminApi.updateLootDeal(id, payload)
      else if (activeTab === 'stores') await adminApi.updateStore(id, payload)
      else if (activeTab === 'coupons') await adminApi.updateCoupon(id, payload)
      showToast(isChecked ? 'Item visible on Homepage' : 'Item hidden from Homepage')
      fetchData(true)
    } catch (err: any) {
      alert(`Error updating homepage visibility: ${err.message}`)
    }
  }

  const handleSaveModal = async () => {
    setSaving(true)
    try {
      const id = formData.id || formData._id
      if (isEditing) {
        if (activeTab === 'deals') await adminApi.updateDeal(id, formData)
        else if (activeTab === 'loot_deals') await adminApi.updateLootDeal(id, formData)
        else if (activeTab === 'stores') await adminApi.updateStore(id, formData)
        else if (activeTab === 'coupons') await adminApi.updateCoupon(id, formData)
        showToast('Item updated successfully')
      } else {
        if (activeTab === 'deals') await adminApi.createDeal(formData)
        else if (activeTab === 'loot_deals') await adminApi.createLootDeal(formData)
        else if (activeTab === 'stores') await adminApi.createStore(formData)
        else if (activeTab === 'coupons') await adminApi.createCoupon(formData)
        showToast('Item created successfully')
      }
      setIsModalOpen(false)
      fetchData(true)
    } catch (err: any) {
      alert(`Error saving item: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Helper to determine if a field is internal/read-only
  const isHiddenField = (key: string) => {
    return ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'slug'].includes(key)
  }

  // Helper to render dynamic form inputs
  const renderFormFields = () => {
    // Get the predefined schema for the current tab
    const schemaKeys = schemas[activeTab] || Object.keys(formData)
    
    // Combine schema keys with any additional custom keys that might exist on formData
    const allKeys = Array.from(new Set([...schemaKeys, ...Object.keys(formData)]))

    return allKeys.filter(k => !isHiddenField(k)).map(key => {
      const value = formData[key]
      const type = typeof value

      // Infer type if it's currently undefined/null based on schema conventions
      let inputType = 'text'
      if (type === 'boolean' || key.startsWith('is') || key.endsWith('Alert') || key.endsWith('Notification')) inputType = 'checkbox'
      else if (type === 'number' || ['clicks', 'discountValue', 'stockClaimedPercent', 'usageCount', 'usageLimit', 'totalUses'].includes(key)) inputType = 'number'

      if (inputType === 'checkbox') {
        return (
          <div className="crud-form-group crud-form-group-checkbox" key={key}>
            <label>
              <input 
                type="checkbox" 
                checked={!!value} 
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} 
                style={{ marginRight: '8px' }}
              />
              {key}
            </label>
          </div>
        )
      }

      if (key === 'status') {
        return (
          <div className="crud-form-group" key={key}>
            <label>{key}</label>
            <select
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="crud-input"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="deleted">deleted</option>
            </select>
          </div>
        )
      }
      
      if (key === 'submissionStatus' || key === 'opsManagerApproval' || key === 'managerApproval') {
        return (
          <div className="crud-form-group" key={key}>
            <label>{key}</label>
            <select
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="crud-input"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="approved">approved</option>
              <option value="pending">pending</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
        )
      }

      if (key === 'description' || key === 'terms' || key === 'trickSteps' || key === 'howToClaim' || key === 'variantNote' || key === 'proofNote') {
        return (
          <div className="crud-form-group" key={key} style={{ gridColumn: '1 / -1' }}>
            <label>{key}</label>
            <textarea
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="crud-input"
              placeholder={`Enter ${key}`}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
        )
      }

      if (key === 'image' || key === 'productImage' || key === 'storeLogo' || key === 'logo') {
        return (
          <div className="crud-form-group" key={key}>
            <label>{key}</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {value && <img src={value} alt="Preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
              <input
                type="text"
                value={value || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="crud-input"
                placeholder={`Enter ${key} URL`}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        )
      }

      return (
        <div className="crud-form-group" key={key}>
          <label>{key}</label>
          <input
            type={inputType}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [key]: inputType === 'number' ? Number(e.target.value) : e.target.value })}
            className="crud-input"
            placeholder={`Enter ${key}`}
          />
        </div>
      )
    })
  }

  return (
    <OperationsLayout activeMenu="approved-data">
      <div className="executive-crud-page">
        
        {toastMessage && (
          <div className="crud-toast">
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="crud-header">
          <div>
            <h1 className="crud-title">Live Data Management</h1>
            <p className="crud-subtitle">
              Manage, edit, and create live data for the platform directly.
            </p>
          </div>
          <div className="crud-header-actions">
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={16} /> Add New {activeTab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          <div className="kpi-card" onClick={() => setActiveTab('deals')} style={{ cursor: 'pointer', border: activeTab === 'deals' ? '1.5px solid #2563eb' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Deals</span>
              <span className="kpi-value">{deals.length}</span>
              <span className="kpi-sub">Standard offers</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Zap size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setActiveTab('loot_deals')} style={{ cursor: 'pointer', border: activeTab === 'loot_deals' ? '1.5px solid #dc2626' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Loot Deals</span>
              <span className="kpi-value">{lootDeals.length}</span>
              <span className="kpi-sub">Flash & Price Errors</span>
            </div>
            <div className="kpi-icon ops-kpi-red">
              <Flame size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setActiveTab('stores')} style={{ cursor: 'pointer', border: activeTab === 'stores' ? '1.5px solid #0891b2' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Stores</span>
              <span className="kpi-value">{stores.length}</span>
              <span className="kpi-sub">Partner directories</span>
            </div>
            <div className="kpi-icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
              <Store size={20} />
            </div>
          </div>

          <div className="kpi-card" onClick={() => setActiveTab('coupons')} style={{ cursor: 'pointer', border: activeTab === 'coupons' ? '1.5px solid #7c3aed' : undefined }}>
            <div className="kpi-body">
              <span className="kpi-label">Coupons</span>
              <span className="kpi-value">{coupons.length}</span>
              <span className="kpi-sub">Promo codes</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <Tag size={20} />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="crud-filter-bar">
          <div className="filter-search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab.replace('_', ' ')} by title, store or code...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="crud-table-card">
          {loading ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <Clock size={36} style={{ color: '#2563eb', margin: '0 auto 12px', display: 'block', animation: 'spin 1.5s linear infinite' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Loading Data...</h3>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
              <Layers size={42} style={{ color: '#64748b', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>No Data Found</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                There are no items matching your criteria.
              </p>
            </div>
          ) : (
            <div className="crud-table-wrapper">
              <table className="crud-table">
                <thead>
                  <tr>
                    <th style={{ width: '44px', textAlign: 'center' }}>Image</th>
                    <th style={{ minWidth: '190px' }}>Details</th>
                    {activeTab !== 'stores' && <th style={{ width: '120px' }}>Store</th>}
                    {activeTab === 'coupons' && <th style={{ width: '100px' }}>Code</th>}
                    {(activeTab === 'deals' || activeTab === 'loot_deals') && <th style={{ width: '100px' }}>Price</th>}
                    <th style={{ width: '180px' }}>Audit Trail</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Home Page</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => {
                    const id = item.id || item._id
                    const isActive = (item.status || '').toLowerCase() === 'active' || (item.status || '').toLowerCase() === 'approved'

                    return (
                      <tr key={id || idx} style={{ opacity: isActive ? 1 : 0.6 }}>
                        <td style={{ width: '44px', textAlign: 'center' }}>
                          <div className="product-table-thumb-wrap">
                            <img 
                              src={item.image || item.imageUrl || item.logo || PLACEHOLDER_DEAL_IMAGE} 
                              alt={item.title || item.name || item.storeName || 'Item'} 
                              className="product-table-thumb"
                              onError={(e) => { (e.target as any).src = PLACEHOLDER_DEAL_IMAGE }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="submission-details-cell">
                            <div className="submission-title-text" style={{ whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.title || item.name || item.storeName || 'Untitled'}
                            </div>
                            <div className="submission-meta-row">
                              {item.category && <span className="submission-category-pill">{item.category}</span>}
                            </div>
                          </div>
                        </td>
                        {activeTab !== 'stores' && (
                          <td>
                            <div style={{ fontWeight: 600, color: '#334155' }}>
                              {item.store || item.brand || 'N/A'}
                            </div>
                          </td>
                        )}
                        {activeTab === 'coupons' && (
                          <td>
                            {item.code ? (
                              <span className="submission-code-pill" style={{ display: 'inline-block' }}>{item.code}</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>No Code</span>
                            )}
                          </td>
                        )}
                        {(activeTab === 'deals' || activeTab === 'loot_deals') && (
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.price || item.currentPrice || 'N/A'}</div>
                            {item.originalPrice && <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.75rem' }}>{item.originalPrice}</div>}
                          </td>
                        )}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {item.submittedByName ? (
                              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                                <strong>Created:</strong> {item.submittedByName}
                              </div>
                            ) : null}
                            {item.approvedByName ? (
                              <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                                <strong>Approved:</strong> {item.approvedByName}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: (item.showOnHome !== false && item.sectionPlacement !== 'none') ? '#15803d' : '#94a3b8' }}>
                            <input 
                              type="checkbox"
                              checked={item.showOnHome !== false && item.sectionPlacement !== 'none'}
                              onChange={(e) => handleToggleShowOnHome(item, e.target.checked)}
                              style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                            />
                            <span>{item.showOnHome !== false && item.sectionPlacement !== 'none' ? 'Visible' : 'Hidden'}</span>
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isActive ? '#059669' : '#94a3b8', fontWeight: 600, fontSize: '0.8rem' }}>
                            {isActive ? <CheckCircle2 size={14} /> : <Pause size={14} />} 
                            {item.status || 'Active'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleToggleStatus(item)}
                              title={isActive ? "Pause/Deactivate" : "Activate"}
                              style={{ color: isActive ? '#f59e0b' : '#10b981' }}
                            >
                              {isActive ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              style={{ color: '#3b82f6' }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleDelete(id)}
                              title="Delete"
                              style={{ color: '#ef4444' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Modal */}
      {isModalOpen && (
        <div className="admin-dialog-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-dialog-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-dialog-header">
              <h2 className="admin-dialog-title">
                {isEditing ? `Edit ${activeTab.replace('_', ' ')}` : `Create New ${activeTab.replace('_', ' ')}`}
              </h2>
              <button className="admin-dialog-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="admin-dialog-body" style={{ overflowY: 'auto', padding: '20px', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderFormFields()}
              
              {/* Add New Field utility for new schema elements */}
              <div className="crud-form-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Need a new field?</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    id="newFieldName"
                    className="crud-input" 
                    placeholder="New field name (e.g., expiryDate)" 
                    style={{ flex: 1 }}
                  />
                  <button 
                    className="btn-secondary"
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('newFieldName') as HTMLInputElement
                      if (input && input.value.trim()) {
                        setFormData({ ...formData, [input.value.trim()]: '' })
                        input.value = ''
                      }
                    }}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-dialog-footer" style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveModal} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </OperationsLayout>
  )
}
