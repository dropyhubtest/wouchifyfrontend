import React from 'react'
import type { AffiliateNetworkItem } from '../types'

interface AffiliateNetworksViewProps {
  affiliates: AffiliateNetworkItem[]
  onPingGateways: () => void
  onTestSync: (networkName: string) => void
}

export const AffiliateNetworksView: React.FC<AffiliateNetworksViewProps> = ({
  affiliates,
  onPingGateways,
  onTestSync
}) => {
  return (
    <div className="view-affiliates-admin">
      <div className="admin-table-section">
        <div className="table-toolbar">
          <span className="toolbar-title">Connected Affiliate Networks & API Endpoints</span>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '7px 16px', fontSize: '13px' }}
            onClick={onPingGateways}
          >
            Ping All Gateways
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Affiliate Network</th>
                <th>API Key & Tracking SubID</th>
                <th>Postback Webhook</th>
                <th>Commission Model</th>
                <th>30D Clicks & Earnings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((net) => (
                <tr key={net.id}>
                  <td>
                    <strong>{net.name}</strong>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Tag: {net.tag}</div>
                  </td>
                  <td>
                    <code>{net.apiKey.slice(0, 8)}...****</code>
                    <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '2px' }}>
                      SubID: {net.subId}
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: '11px' }}>{net.postbackUrl}</code>
                  </td>
                  <td>
                    <span className="badge-pill">{net.defaultCommission}</span>
                  </td>
                  <td>
                    <div><strong>{net.totalClicks.toLocaleString()}</strong> clicks</div>
                    <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>{net.estEarnings}</div>
                  </td>
                  <td>
                    <span className="badge-connected">● {net.status}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11.5px' }}
                      onClick={() => onTestSync(net.name)}
                    >
                      Test Sync
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
