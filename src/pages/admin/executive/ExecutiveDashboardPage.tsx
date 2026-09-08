import React, { useEffect, useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { Zap, Tag, MousePointerClick, Image as ImageIcon } from 'lucide-react'

export const ExecutiveDashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('staffUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return null

  const executiveStats = [
    { title: 'Deals Added (Today)', value: '45', change: '+12%', isPositive: true, icon: <Zap size={24} /> },
    { title: 'Coupons Uploaded (Today)', value: '12', change: 'Stable', isPositive: true, icon: <Tag size={24} /> },
    { title: 'My Deals Clicks', value: '2,840', change: '+24%', isPositive: true, icon: <MousePointerClick size={24} /> },
    { title: 'Active Banners', value: '6', change: 'Stable', isPositive: true, icon: <ImageIcon size={24} /> },
  ]

  const recentActivity = [
    { id: 1, action: 'You added a new Deal: Nike Shoes', time: '10 mins ago', type: 'deal', status: 'Success' },
    { id: 2, action: 'You uploaded 5 Coupons for Amazon', time: '1 hour ago', type: 'coupon', status: 'Success' },
    { id: 3, action: 'You updated Banner #4', time: '2 hours ago', type: 'banner', status: 'Success' },
  ]

  return (
    <ExecutiveLayout activeMenu="dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#333333' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>Executive Dashboard</h2>
          <p style={{ color: '#64748b' }}>Your personal content productivity and performance insights.</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {executiveStats.map((stat, idx) => (
            <div key={idx} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                <div style={{ 
                  backgroundColor: stat.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                  color: stat.isPositive ? '#10b981' : '#ef4444',
                  padding: '4px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' 
                }}>
                  {stat.isPositive ? '↗' : '↘'} {stat.change}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{stat.value}</div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>Your Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentActivity.map((activity) => (
              <li key={activity.id} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                  {activity.type === 'deal' && <Zap size={18} />}
                  {activity.type === 'coupon' && <Tag size={18} />}
                  {activity.type === 'banner' && <ImageIcon size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '500', color: '#334155' }}>{activity.action}</p>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{activity.time}</span>
                </div>
                <div style={{ 
                  padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981'
                }}>
                  {activity.status}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </ExecutiveLayout>
  )
}
