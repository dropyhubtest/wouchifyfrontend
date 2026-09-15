import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { IconClose } from '../icons'
import type { StaffItem } from '../types'

interface EditStaffModalProps {
  editingStaff: StaffItem | null
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  setEditingStaff: React.Dispatch<React.SetStateAction<StaffItem | null>>
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  editingStaff,
  onClose,
  onSubmit,
  setEditingStaff
}) => {
  if (!editingStaff) return null

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Edit Staff Member</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7E86B8' }}>
              Update credentials, role permissions, or vertical assignments for {editingStaff.name}.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-form-row">
            <div className="form-group">
              <label>Staff Full Name <span className="req">*</span></label>
              <input
                type="text"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Staff Official Email <span className="req">*</span></label>
              <input
                type="email"
                value={editingStaff.email}
                onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>System Role <span className="req">*</span></label>
              <CustomDropdown
                value={editingStaff.role}
                onChange={(val) => setEditingStaff({ ...editingStaff, role: val as any })}
                options={[
                  { value: 'executive', label: 'Content Executive (Deals, Coupons, Cards)' },
                  { value: 'operational_manager', label: 'Operational Manager (QA & Approvals)' },
                  { value: 'manager', label: 'Manager (Full Platform Admin)' }
                ]}
                variant="admin"
              />
            </div>

            <div className="form-group">
              <label>Assigned Domain</label>
              <input
                type="text"
                value={editingStaff.domain || ''}
                onChange={(e) => setEditingStaff({ ...editingStaff, domain: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>Presence Status</label>
              <CustomDropdown
                value={editingStaff.status}
                onChange={(val) => setEditingStaff({ ...editingStaff, status: val as any })}
                options={[
                  { value: 'Online', label: '🟢 Online' },
                  { value: 'Away', label: '🟡 Away' },
                  { value: 'Offline', label: '⚪ Offline' }
                ]}
                variant="admin"
              />
            </div>

            <div className="form-group">
              <label>Approval Rate Display</label>
              <input
                type="text"
                value={editingStaff.approvalRate || '98%'}
                onChange={(e) => setEditingStaff({ ...editingStaff, approvalRate: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
