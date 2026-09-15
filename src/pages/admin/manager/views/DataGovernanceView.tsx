import React from 'react'
import type { GovernanceAuditLog } from '../types'

interface DataGovernanceViewProps {
  auditLogs: GovernanceAuditLog[]
  totalCatalogCount: number
  onTriggerBackup: () => void
}

export const DataGovernanceView: React.FC<DataGovernanceViewProps> = ({
  auditLogs,
  totalCatalogCount,
  onTriggerBackup
}) => {
  return (
    <div className="view-governance-admin">
      <div className="categories-kpi-strip">
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Security Audit Entries</span>
          <strong className="cat-kpi-value">{auditLogs.length}</strong>
          <span className="cat-kpi-sub">High-risk actions tracked</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Last Cold Backup</span>
          <strong className="cat-kpi-value">Today</strong>
          <span className="cat-kpi-sub">Auto-sync /data/dev_store.json</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Catalog Records</span>
          <strong className="cat-kpi-value">{totalCatalogCount.toLocaleString()}</strong>
          <span className="cat-kpi-sub">Indexed across MongoDB & Memory</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Backup Engine</span>
          <button type="button" className="cat-kpi-link" onClick={onTriggerBackup}>
            Download Snapshot ↗
          </button>
          <span className="cat-kpi-sub">JSON Full Export</span>
        </div>
      </div>

      <div className="admin-table-section">
        <div className="table-toolbar">
          <span className="toolbar-title">Security & Audit Event Log</span>
          <span className="results-count">Showing last {auditLogs.length} events</span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor & Role</th>
                <th>Event Name</th>
                <th>Risk Level</th>
                <th>Event Description</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', color: '#64748B' }}>{log.timestamp}</td>
                  <td>
                    <strong>{log.actor}</strong>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{log.role}</div>
                  </td>
                  <td>
                    <strong style={{ color: '#1E2460' }}>{log.event}</strong>
                  </td>
                  <td>
                    <span className={`risk-pill ${log.riskLevel.toLowerCase()}`}>
                      {log.riskLevel}
                    </span>
                  </td>
                  <td style={{ color: '#334155', fontSize: '12.5px' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
