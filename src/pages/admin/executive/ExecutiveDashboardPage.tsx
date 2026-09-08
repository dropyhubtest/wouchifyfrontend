import React, { useEffect, useState } from 'react'
import { ExecutiveLayout } from './ExecutiveLayout'
import { 
  Zap, 
  Tag, 
  Store, 
  Image as ImageIcon, 
  CreditCard,
  Flame,
  Megaphone,
  TrendingUp,
  Activity
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import './ExecutiveDashboardPage.css'

const dealPerformanceData = [
  { name: 'Mon', deals: 40, clicks: 240 },
  { name: 'Tue', deals: 30, clicks: 139 },
  { name: 'Wed', deals: 20, clicks: 980 },
  { name: 'Thu', deals: 27, clicks: 390 },
  { name: 'Fri', deals: 18, clicks: 480 },
  { name: 'Sat', deals: 23, clicks: 380 },
  { name: 'Sun', deals: 34, clicks: 430 },
]

export const ExecutiveDashboardPage: React.FC = () => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('staffUser')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return null

  const topStats = [
    { title: "Today's Deals", value: '45', change: '+12% vs yesterday', isPositive: true, icon: <Zap size={24} />, color: 'blue' },
    { title: 'Loot Deals Active', value: '12', change: '+2 new', isPositive: true, icon: <Flame size={24} />, color: 'red' },
    { title: 'Coupons Uploaded', value: '124', change: 'Stable', isPositive: true, icon: <Tag size={24} />, color: 'green' },
    { title: 'Total Clicks Today', value: '2,840', change: '+24% vs yesterday', isPositive: true, icon: <Activity size={24} />, color: 'purple' },
  ]

  const componentBreakdown = [
    { label: 'Stores Managed', count: '142', icon: <Store size={18} /> },
    { label: 'Credit Cards Active', count: '18', icon: <CreditCard size={18} /> },
    { label: 'Hero Banners', count: '6', icon: <ImageIcon size={18} /> },
    { label: 'Advertisements', count: '4', icon: <Megaphone size={18} /> },
  ]

  const recentActivity = [
    { id: 1, action: 'You added a new Deal: Nike Shoes 50% Off', time: '10 mins ago', icon: <Zap size={18} /> },
    { id: 2, action: 'You uploaded 5 Coupons for Amazon', time: '1 hour ago', icon: <Tag size={18} /> },
    { id: 3, action: 'You updated Home Page Banner #4', time: '2 hours ago', icon: <ImageIcon size={18} /> },
    { id: 4, action: 'Loot Deal "iPhone 15" expired', time: '4 hours ago', icon: <Flame size={18} /> },
  ]

  return (
    <ExecutiveLayout activeMenu="dashboard">
      <div className="executive-dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Executive Overview</h2>
          <p className="dashboard-subtitle">Analytics and performance data across all your components.</p>
        </div>

        {/* Top Stats */}
        <div className="stats-grid">
          {topStats.map((stat, idx) => (
            <div className="stat-card" key={idx}>
              <div className="stat-info">
                <span className="stat-title">{stat.title}</span>
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.isPositive ? 'positive' : 'neutral'}`}>
                  {stat.isPositive && stat.change !== 'Stable' && <TrendingUp size={14} style={{ marginRight: '4px' }} />}
                  {stat.change}
                </span>
              </div>
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content-grid">
          {/* Charts Section */}
          <div className="dashboard-left-col">
            <div className="dashboard-card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h3 className="card-title">Deals Performance (7 Days)</h3>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dealPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDeals)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Clicks by Day</h3>
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dealPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="clicks" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar Components */}
          <div className="dashboard-right-col">
            <div className="dashboard-card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h3 className="card-title">Components Overview</h3>
              </div>
              <div className="breakdown-list">
                {componentBreakdown.map((item, idx) => (
                  <div className="breakdown-item" key={idx}>
                    <div className="breakdown-label">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="breakdown-count">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              <div className="activity-feed">
                {recentActivity.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-icon">
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExecutiveLayout>
  )
}
