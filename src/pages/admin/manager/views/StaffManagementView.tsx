import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { IconEdit, IconTrash } from '../icons'
import type { StaffItem } from '../types'

interface StaffManagementViewProps {
  staffMembers: StaffItem[]
  filteredStaffMembers: StaffItem[]
  staffRoleFilter: 'all' | 'executive' | 'operational_manager' | 'manager'
  setStaffRoleFilter: (role: 'all' | 'executive' | 'operational_manager' | 'manager') => void
  staffStatusFilter: string
  setStaffStatusFilter: (status: string) => void
  onToggleStaffStatus: (staffId: string) => void
  onEditStaff: (staff: StaffItem) => void
  onDeleteStaff: (staffId: string) => void
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staffMembers,
  filteredStaffMembers,
  staffRoleFilter,
  setStaffRoleFilter,
  staffStatusFilter,
  setStaffStatusFilter,
  onToggleStaffStatus,
  onEditStaff,
  onDeleteStaff
}) => {
  return (
    <div className="view-staff-admin">
      {/* Staff KPI Summary Cards */}
      <div className="categories-kpi-strip">
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Total Staff Accounts</span>
          <strong className="cat-kpi-value">{staffMembers.length}</strong>
          <span className="cat-kpi-sub">Registered team members</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Operational Managers</span>
          <strong className="cat-kpi-value">
            {staffMembers.filter((s) => s.role === 'operational_manager').length}
          </strong>
          <span className="cat-kpi-sub">QA & Approvals Team</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Content Executives</span>
          <strong className="cat-kpi-value">
            {staffMembers.filter((s) => s.role === 'executive').length}
          </strong>
          <span className="cat-kpi-sub">Deals, Coupons & Cards</span>
        </div>
        <div className="cat-kpi-card">
          <span className="cat-kpi-label">Active Presence</span>
          <strong className="cat-kpi-value" style={{ color: '#16A34A' }}>
            {staffMembers.filter((s) => s.status === 'Online').length} Online
          </strong>
          <span className="cat-kpi-sub">Live in studio portal</span>
        </div>
      </div>

      {/* Staff Management Table Section */}
      <div className="admin-table-section">
        <div className="table-toolbar">
          <div className="table-filter-pills">
            <label className="toolbar-filter-label" htmlFor="staff-role-select">
              Role:
            </label>
            <CustomDropdown
              id="staff-role-select"
              value={staffRoleFilter}
              onChange={(val: string) => setStaffRoleFilter(val as any)}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'executive', label: 'Content Executives' },
                { value: 'operational_manager', label: 'Operational Managers' },
                { value: 'manager', label: 'System Managers' }
              ]}
              variant="admin"
              size="sm"
            />

            <label className="toolbar-filter-label" htmlFor="staff-status-select" style={{ marginLeft: '12px' }}>
              Status:
            </label>
            <CustomDropdown
              id="staff-status-select"
              value={staffStatusFilter}
              onChange={(val: string) => setStaffStatusFilter(val)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Online', label: '🟢 Online' },
                { value: 'Away', label: '🟡 Away' },
                { value: 'Offline', label: '⚪ Offline' }
              ]}
              variant="admin"
              size="sm"
            />
          </div>

          <span className="results-count">
            Showing {filteredStaffMembers.length} of {staffMembers.length} staff accounts
          </span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role & Access</th>
                <th>Assigned Domain</th>
                <th>Performance & Output</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffMembers.map((staff) => {
                const initials = staff.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                const roleLabel =
                  staff.role === 'operational_manager'
                    ? 'Operational Manager'
                    : staff.role === 'manager'
                    ? 'System Manager'
                    : 'Content Executive'

                return (
                  <tr key={staff.id || staff._id}>
                    <td>
                      <div className="staff-user-cell">
                        <div className={`staff-avatar-circle ${staff.role}`}>
                          {initials}
                        </div>
                        <div className="staff-user-details">
                          <strong className="staff-name">{staff.name}</strong>
                          <span className="staff-email">{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`staff-role-badge ${staff.role}`}>
                        {roleLabel}
                      </span>
                    </td>
                    <td>
                      <span className="staff-domain-text">
                        {staff.domain || 'General Platform Content'}
                      </span>
                    </td>
                    <td>
                      <div className="staff-metrics-box">
                        <span className="metric-pill">
                          <strong>{staff.totalSubmissions || 0}</strong> submissions
                        </span>
                        <span className="metric-pill approval">
                          <strong>{staff.approvalRate || '100%'}</strong> approval
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`staff-status-toggle ${staff.status.toLowerCase()}`}
                        onClick={() => onToggleStaffStatus(staff.id || staff._id || '')}
                        title="Click to cycle status (Online / Away / Offline)"
                      >
                        <span className="status-indicator-dot" />
                        <span>{staff.status}</span>
                      </button>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          type="button"
                          className="table-action-btn edit-btn"
                          onClick={() => onEditStaff(staff)}
                          title="Edit Staff Member"
                        >
                          <IconEdit />
                        </button>
                        {staff.email !== 'manager@wouchify.com' && (
                          <button
                            type="button"
                            className="table-delete-btn"
                            onClick={() => onDeleteStaff(staff.id || staff._id || '')}
                            title="Delete Staff Member"
                          >
                            <IconTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
