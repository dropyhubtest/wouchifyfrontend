import React, { useState, useEffect } from 'react'
import { OperationsLayout } from './OperationsLayout'
import { adminApi } from '../../../services/adminApi'
import { UsersView } from '../manager/views/UsersView'
import type { UserItem } from '../manager/types'
import { Search } from 'lucide-react'

export const OperationsUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers()
      setUsers(data || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    return (
      searchQuery.trim() === '' ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <OperationsLayout activeMenu="users">
      <div className="operations-crud-page">
        <header className="crud-header" style={{ marginBottom: '20px' }}>
          <div className="crud-header-left">
            <h1 className="crud-title">Customer Accounts</h1>
            <p className="crud-subtitle">View and manage registered user accounts on the platform</p>
          </div>
          
          <div className="crud-header-right">
             <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <Search size={16} color="#64748b" style={{ marginRight: '8px' }}/>
               <input
                 type="text"
                 placeholder="Search users..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{ border: 'none', outline: 'none', background: 'transparent' }}
               />
             </div>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <UsersView filteredUsers={filteredUsers} />
        )}
      </div>
    </OperationsLayout>
  )
}
