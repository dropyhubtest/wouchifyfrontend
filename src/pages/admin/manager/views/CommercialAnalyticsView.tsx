import React from 'react'
import { IconWallet, IconDeals, IconTrend, IconStaff } from '../icons'

interface CommercialAnalyticsViewProps {
  liveStats: {
    disbursedCashback: string
    activeDealsCount: number
    staffCount: number
    onlineStaffCount: number
  }
}

export const CommercialAnalyticsView: React.FC<CommercialAnalyticsViewProps> = ({ liveStats }) => {
  return (
    <div className="view-dashboard">
      {/* Top 4 KPI Metrics */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="stat-label">Platform Gross Revenue</span>
            <span className="stat-icon-wrap navy"><IconWallet /></span>
          </div>
          <strong className="stat-value">{liveStats.disbursedCashback}</strong>
          <div className="stat-footer positive">
            <IconTrend />
            <span>+14.8% vs last month</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="stat-label">Active Published Deals</span>
            <span className="stat-icon-wrap red"><IconDeals /></span>
          </div>
          <strong className="stat-value">{liveStats.activeDealsCount}</strong>
          <div className="stat-footer positive">
            <IconTrend />
            <span>Live across 20 Partner Stores</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="stat-label">Average Outbound CTR</span>
            <span className="stat-icon-wrap blue"><IconTrend /></span>
          </div>
          <strong className="stat-value">8.42%</strong>
          <div className="stat-footer positive">
            <IconTrend />
            <span>Highest in Electronics (11.2%)</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="stat-label">Staff Team Members</span>
            <span className="stat-icon-wrap green"><IconStaff /></span>
          </div>
          <strong className="stat-value">{liveStats.staffCount}</strong>
          <div className="stat-footer positive">
            <span>🟢 {liveStats.onlineStaffCount} Online in Portal</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel & Top Merchant Revenue Breakdown */}
      <div className="dashboard-grid-split">
        {/* Merchant Commercial Performance */}
        <div className="admin-card">
          <div className="card-header-row">
            <h3>Merchant Commercial Performance</h3>
            <span className="badge-pill">Outbound & RevShare</span>
          </div>
          <div className="merchant-analytics-list">
            <div className="merchant-row">
              <div className="m-info">
                <strong>Amazon India</strong>
                <span>89,400 Clicks • 8.6% CTR</span>
              </div>
              <div className="m-rev">
                <strong>₹4,12,000</strong>
                <span className="rev-sub">9.0% Commission</span>
              </div>
            </div>
            <div className="merchant-row">
              <div className="m-info">
                <strong>Flipkart</strong>
                <span>54,200 Clicks • 7.9% CTR</span>
              </div>
              <div className="m-rev">
                <strong>₹2,85,400</strong>
                <span className="rev-sub">8.0% Commission</span>
              </div>
            </div>
            <div className="merchant-row">
              <div className="m-info">
                <strong>Myntra</strong>
                <span>38,900 Clicks • 6.8% CTR</span>
              </div>
              <div className="m-rev">
                <strong>₹1,94,200</strong>
                <span className="rev-sub">7.5% Commission</span>
              </div>
            </div>
            <div className="merchant-row">
              <div className="m-info">
                <strong>Swiggy & Zomato</strong>
                <span>44,100 Clicks • 9.4% CTR</span>
              </div>
              <div className="m-rev">
                <strong>₹1,45,600</strong>
                <span className="rev-sub">₹50 Flat / Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="admin-card">
          <div className="card-header-row">
            <h3>Top Converting Categories</h3>
            <span className="badge-pill">Revenue Share</span>
          </div>
          <div className="category-bars-list">
            <div className="cat-bar-item">
              <div className="cat-bar-header">
                <span>Electronics & Mobiles</span>
                <strong>38% (₹4.2 Lakhs)</strong>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: '38%', background: '#2563EB' }} /></div>
            </div>
            <div className="cat-bar-item">
              <div className="cat-bar-header">
                <span>Fashion & Apparel</span>
                <strong>28% (₹3.1 Lakhs)</strong>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: '28%', background: '#E31E25' }} /></div>
            </div>
            <div className="cat-bar-item">
              <div className="cat-bar-header">
                <span>Food & Dining</span>
                <strong>18% (₹2.0 Lakhs)</strong>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: '18%', background: '#F59E0B' }} /></div>
            </div>
            <div className="cat-bar-item">
              <div className="cat-bar-header">
                <span>Beauty & Personal Care</span>
                <strong>16% (₹1.8 Lakhs)</strong>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: '16%', background: '#10B981' }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
