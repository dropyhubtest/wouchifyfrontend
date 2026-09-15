import React, { useState, useEffect, useMemo } from 'react'
import { adminApi } from '../../services/adminApi'
import { Check, X, Eye, ShieldAlert, AlertCircle, Clock } from 'lucide-react'
import './AdminDashboardPage.css' // Reuse the same CSS

interface ModerationItem {
  id: string
  type: 'store' | 'coupon'
  title: string
  store: string
  submittedBy: string
  submittedAt: string
  status: 'Pending Manager Approval'
}

export const AdminApprovalsView: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const fetchItems = async () => {
    try {
      const storesRes = await adminApi.getManagerPendingStores()
      const couponsRes = await adminApi.getManagerPendingCoupons()
      
      const mappedStores = (storesRes || []).map((s: any) => ({
        id: s._id || s.id,
        type: 'store' as const,
        title: s.name,
        store: s.name,
        submittedBy: s.submittedBy || 'executive@wouchify.com',
        submittedAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Just now',
        status: 'Pending Manager Approval' as const
      }))

      const mappedCoupons = (couponsRes || []).map((c: any) => ({
        id: c._id || c.id,
        type: 'coupon' as const,
        title: c.code || 'Coupon',
        store: c.store,
        submittedBy: c.submittedBy || 'executive@wouchify.com',
        submittedAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now',
        status: 'Pending Manager Approval' as const
      }))

      setItems([...mappedStores, ...mappedCoupons])
    } catch (err) {
      console.error('Failed to fetch manager pending items', err)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleApprove = async (id: string, type: 'store' | 'coupon') => {
    try {
      if (type === 'store') await adminApi.approveManagerStore(id)
      if (type === 'coupon') await adminApi.approveManagerCoupon(id)
      setItems(prev => prev.filter(i => i.id !== id))
      showToast(`${type.toUpperCase()} approved! It is now ACTIVE on the main website.`)
    } catch (err) {
      showToast('Error approving item.')
    }
  }

  const handleReject = async (id: string, type: 'store' | 'coupon') => {
    try {
      if (type === 'store') await adminApi.rejectManagerStore(id)
      if (type === 'coupon') await adminApi.rejectManagerCoupon(id)
      setItems(prev => prev.filter(i => i.id !== id))
      showToast(`${type.toUpperCase()} rejected.`)
    } catch (err) {
      showToast('Error rejecting item.')
    }
  }

  return (
    <div className="view-approvals" style={{ padding: '2rem' }}>
      {toastMessage && (
        <div className="admin-toast" role="status">
          <Check />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Manager Approvals Queue</h2>
        <p style={{ color: 'var(--color-text-light)' }}>
          Review items approved by the Operations Manager. Final approval here publishes them to the live storefront.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {items.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            <Check size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <h3>All Caught Up!</h3>
            <p>There are no items awaiting Manager approval.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Store</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Submitted By</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: item.type === 'store' ? 'var(--color-yellow-light)' : 'var(--color-blue-light)',
                      color: item.type === 'store' ? 'var(--color-yellow-dark)' : 'var(--color-blue-dark)'
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--color-navy)' }}>{item.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text)' }}>{item.store}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>{item.submittedBy}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>{item.submittedAt}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleApprove(item.id, item.type)}
                        style={{ 
                          padding: '6px 12px', 
                          background: '#22c55e', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}>
                        <Check size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(item.id, item.type)}
                        style={{ 
                          padding: '6px 12px', 
                          background: '#fee2e2', 
                          color: '#dc2626', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}>
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
