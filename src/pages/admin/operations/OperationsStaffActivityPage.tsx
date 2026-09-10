import React, { useState, useMemo } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { 
  CheckCircle2, 
  Users, 
  Activity, 
  Download, 
  Clock, 
  TrendingUp, 
  Zap,
  UserCheck
} from 'lucide-react'
import './OperationsShared.css'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  domain: string
  submissionsToday: number
  totalSubmissions: number
  approvalRate: number
  rejectionsCount: number
  avgTurnaround: string
  status: 'Online' | 'Away' | 'Offline'
}

export interface AuditLogEvent {
  id: string
  timestamp: string
  staffEmail: string
  staffName: string
  action: 'Created' | 'Modified' | 'Deleted' | 'Approved' | 'Rejected' | 'Published'
  entityType: 'Deal' | 'Loot Deal' | 'Coupon' | 'Banner' | 'Store' | 'Cashback'
  entityTitle: string
  details: string
}

const mockStaffMembers: StaffMember[] = [
  {
    id: 'stf-01',
    name: 'Rahul Sharma',
    email: 'rahul.executive@wouchify.com',
    role: 'Content Executive',
    domain: 'Electronics & Loot Deals',
    submissionsToday: 18,
    totalSubmissions: 420,
    approvalRate: 96.5,
    rejectionsCount: 15,
    avgTurnaround: '12 mins',
    status: 'Online'
  },
  {
    id: 'stf-02',
    name: 'Sneha Patel',
    email: 'sneha.deals@wouchify.com',
    role: 'Deals Executive',
    domain: 'Mobiles, Laptops & Appliances',
    submissionsToday: 12,
    totalSubmissions: 385,
    approvalRate: 98.2,
    rejectionsCount: 7,
    avgTurnaround: '18 mins',
    status: 'Online'
  },
  {
    id: 'stf-03',
    name: 'Arjun Verma',
    email: 'arjun.coupons@wouchify.com',
    role: 'Coupons Executive',
    domain: 'Fashion, Food & Travel',
    submissionsToday: 8,
    totalSubmissions: 290,
    approvalRate: 91.4,
    rejectionsCount: 25,
    avgTurnaround: '24 mins',
    status: 'Away'
  },
  {
    id: 'stf-04',
    name: 'Priya Sundaram',
    email: 'priya.media@wouchify.com',
    role: 'Creative Executive',
    domain: 'Hero Banners & Ads',
    submissionsToday: 4,
    totalSubmissions: 140,
    approvalRate: 97.8,
    rejectionsCount: 3,
    avgTurnaround: '35 mins',
    status: 'Online'
  }
]

const mockAuditLogs: AuditLogEvent[] = [
  {
    id: 'log-101',
    timestamp: '12 mins ago',
    staffEmail: 'rahul.executive@wouchify.com',
    staffName: 'Rahul Sharma',
    action: 'Created',
    entityType: 'Loot Deal',
    entityTitle: 'Sony WH-1000XM5 Wireless Headphones at ₹4,999',
    details: 'Submitted for operational review (83% Price Glitch).'
  },
  {
    id: 'log-102',
    timestamp: '25 mins ago',
    staffEmail: 'ops.manager@wouchify.com',
    staffName: 'Operational Manager',
    action: 'Approved',
    entityType: 'Deal',
    entityTitle: 'iPhone 15 Pro Max (Natural Titanium 256GB)',
    details: 'Published to live storefront and Telegram channel.'
  },
  {
    id: 'log-103',
    timestamp: '45 mins ago',
    staffEmail: 'sneha.deals@wouchify.com',
    staffName: 'Sneha Patel',
    action: 'Modified',
    entityType: 'Deal',
    entityTitle: 'Samsung Galaxy S24 Ultra 5G pricing math',
    details: 'Updated bank offer to ₹5,000 instant HDFC discount.'
  },
  {
    id: 'log-104',
    timestamp: '1 hour ago',
    staffEmail: 'arjun.coupons@wouchify.com',
    staffName: 'Arjun Verma',
    action: 'Created',
    entityType: 'Coupon',
    entityTitle: 'Myntra Flat ₹500 OFF (Code: MYNTRAPRO)',
    details: 'Added coupon code with expiry date 30-Sep-2026.'
  },
  {
    id: 'log-105',
    timestamp: '2 hours ago',
    staffEmail: 'ops.manager@wouchify.com',
    staffName: 'Operational Manager',
    action: 'Approved',
    entityType: 'Cashback',
    entityTitle: 'Claim #CB-9023 (₹3,250 Flipkart Cashback)',
    details: 'Authorized for batch banking payout disbursement.'
  },
  {
    id: 'log-106',
    timestamp: '3 hours ago',
    staffEmail: 'priya.media@wouchify.com',
    staffName: 'Priya Sundaram',
    action: 'Created',
    entityType: 'Banner',
    entityTitle: 'Diwali Mega Cashback Bonanza Hero Banner',
    details: 'Uploaded creative asset for Home page.'
  }
]

export const OperationsStaffActivityPage: React.FC = () => {
  const [staff] = useState<StaffMember[]>(mockStaffMembers)
  const [auditLogs] = useState<AuditLogEvent[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // KPIs
  const totalSubmissionsToday = staff.reduce((acc, s) => acc + s.submissionsToday, 0)
  const avgTeamApprovalRate = (staff.reduce((acc, s) => acc + s.approvalRate, 0) / staff.length).toFixed(1)

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return auditLogs
    const q = searchTerm.toLowerCase()
    return auditLogs.filter(log => 
      log.staffEmail.toLowerCase().includes(q) ||
      log.staffName.toLowerCase().includes(q) ||
      log.entityTitle.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q)
    )
  }, [auditLogs, searchTerm])

  const handleExportAuditCSV = () => {
    const headers = ['LogID', 'Timestamp', 'StaffName', 'StaffEmail', 'Action', 'EntityType', 'EntityTitle', 'Details']
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.staffName}"`,
      l.staffEmail,
      l.action,
      l.entityType,
      `"${l.entityTitle.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wouchify_staff_audit_log_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported audit log to CSV')
  }

  return (
    <OperationsLayout activeMenu="staff-activity">
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
            <h1 className="crud-title">Executive Staff Oversight & Audit Trail</h1>
            <p className="crud-subtitle">
              Monitor content executive output, track submission accuracy rates, measure SLA turnaround times, and audit platform changes.
            </p>
          </div>

          <div className="crud-header-actions">
            <button className="btn-secondary" onClick={handleExportAuditCSV}>
              <Download size={16} /> Export Audit Log
            </button>
          </div>
        </div>

        {/* ── KPI Ribbon ── */}
        <div className="kpi-ribbon">
          
          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Active Executives</span>
              <span className="kpi-value">{staff.filter(s => s.status === 'Online').length} / {staff.length}</span>
              <span className="kpi-sub">Currently online & posting</span>
            </div>
            <div className="kpi-icon ops-kpi-green">
              <UserCheck size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Submissions Today</span>
              <span className="kpi-value">{totalSubmissionsToday}</span>
              <span className="kpi-sub">Deals, coupons & banners</span>
            </div>
            <div className="kpi-icon ops-kpi-blue">
              <Zap size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Team Approval Rate</span>
              <span className="kpi-value">{avgTeamApprovalRate}%</span>
              <span className="kpi-sub">High quality threshold</span>
            </div>
            <div className="kpi-icon ops-kpi-purple">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-body">
              <span className="kpi-label">Avg Moderation SLA</span>
              <span className="kpi-value">18.4 mins</span>
              <span className="kpi-sub">Submission to live speed</span>
            </div>
            <div className="kpi-icon ops-kpi-orange">
              <Clock size={20} />
            </div>
          </div>

        </div>

        {/* ── EXECUTIVE TEAM DIRECTORY & PERFORMANCE ── */}
        <div className="crud-table-card" style={{ marginBottom: '24px' }}>
          <div className="card-header-styled" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: '#2563eb' }} /> Content Executive Performance Directory
            </h3>
          </div>

          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Executive Name & Email</th>
                  <th>Assigned Domain</th>
                  <th>Today's Output</th>
                  <th>Total Submissions</th>
                  <th>Approval Accuracy</th>
                  <th>Avg SLA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="submitter-avatar-xs" style={{ width: '28px', height: '28px', fontSize: '0.82rem', background: '#2563eb' }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>{member.name}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                        {member.domain}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.92rem', color: '#2563eb' }}>{member.submissionsToday}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}> items today</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: '#0f172a' }}>{member.totalSubmissions}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: member.approvalRate >= 95 ? '#16a34a' : '#ea580c', fontSize: '0.88rem' }}>
                          {member.approvalRate}%
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({member.rejectionsCount} rejections)</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                        {member.avgTurnaround}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${member.status.toLowerCase()}`}>
                        {member.status === 'Online' && <span className="health-dot online" style={{ marginRight: '4px' }}></span>}
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CHRONOLOGICAL AUDIT TRAIL ── */}
        <div className="crud-table-card">
          <div className="card-header-styled" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: '#7c3aed' }} /> Chronological System Audit Log
              </h3>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Real-time immutable trace of all content changes</span>
            </div>

            <div style={{ width: '260px' }}>
              <input 
                type="text" 
                placeholder="Filter logs…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
              />
            </div>
          </div>

          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Staff Member</th>
                  <th>Action</th>
                  <th>Entity Type</th>
                  <th>Target Headline / Item</th>
                  <th>Action Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{log.timestamp}</span>
                    </td>
                    <td>
                      <div className="submitter-chip">
                        <span className="submitter-avatar-xs">{log.staffName.charAt(0)}</span>
                        <span>{log.staffName}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase',
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: log.action === 'Approved' ? '#ecfdf5' : log.action === 'Created' ? '#eff6ff' : '#f8fafc',
                        color: log.action === 'Approved' ? '#15803d' : log.action === 'Created' ? '#1d4ed8' : '#334155'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                        {log.entityType}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a', maxWidth: '300px', display: 'block' }}>
                        {log.entityTitle}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {log.details}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </OperationsLayout>
  )
}
