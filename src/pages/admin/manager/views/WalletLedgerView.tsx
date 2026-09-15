import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import type { TransactionItem } from '../types'

interface WalletLedgerViewProps {
  transactions: TransactionItem[]
  filteredTransactions: TransactionItem[]
  transactionTypeFilter: string
  setTransactionTypeFilter: (filter: string) => void
  onExportCSV: () => void
  onApproveTransaction: (txnId: string) => void
}

export const WalletLedgerView: React.FC<WalletLedgerViewProps> = ({
  transactions,
  filteredTransactions,
  transactionTypeFilter,
  setTransactionTypeFilter,
  onExportCSV,
  onApproveTransaction
}) => {
  return (
    <div className="view-wallet-admin">
      <div className="admin-table-section">
        <div className="table-toolbar">
          <div className="table-filter-pills">
            <label className="toolbar-filter-label" htmlFor="txn-type-select">
              Type:
            </label>
            <CustomDropdown
              id="txn-type-select"
              value={transactionTypeFilter}
              onChange={(val: string) => setTransactionTypeFilter(val)}
              options={[
                { value: 'All', label: 'All Transaction Types' },
                { value: 'Cashback', label: 'Cashback' },
                { value: 'Redemption', label: 'Redemption' },
                { value: 'Referral', label: 'Referral' }
              ]}
              variant="admin"
              size="sm"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="results-count">Showing {filteredTransactions.length} of {transactions.length} records</span>
            <button className="btn-secondary" onClick={onExportCSV}>Export CSV</button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td><code>{t.id}</code></td>
                  <td><strong>{t.user}</strong> ({t.email})</td>
                  <td><span className="badge-pill">{t.type}</span></td>
                  <td><strong>{t.amount}</strong></td>
                  <td><span className={`risk-pill ${t.status === 'Completed' ? 'low' : 'medium'}`}>{t.status}</span></td>
                  <td>{t.time}</td>
                  <td>
                    {t.status === 'Pending' && (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => onApproveTransaction(t.id)}
                      >
                        Approve Payout
                      </button>
                    )}
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
