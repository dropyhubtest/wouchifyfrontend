import React from 'react'
import type { UserItem } from '../types'

interface UsersViewProps {
  filteredUsers: UserItem[]
}

export const UsersView: React.FC<UsersViewProps> = ({ filteredUsers }) => {
  return (
    <div className="view-users-admin">
      <div className="admin-table-section">
        <div className="table-toolbar">
          <span className="toolbar-title">Customer Accounts & Wallets</span>
          <span className="results-count">Showing {filteredUsers.length} users</span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Wallet Balance</th>
                <th>Total Cashback Earned</th>
                <th>Joined Date</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td><strong style={{ color: '#16A34A' }}>{user.walletBalance}</strong></td>
                  <td><strong>{user.totalCashback}</strong></td>
                  <td>{user.joinedDate}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'verified' ? '✓ Verified' : user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
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
