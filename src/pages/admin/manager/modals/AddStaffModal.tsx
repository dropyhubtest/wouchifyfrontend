import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import { IconClose } from '../icons'

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  newStaff: {
    name: string
    email: string
    role: 'executive' | 'operational_manager' | 'manager'
    domain: string
    password?: string
    status: 'Online' | 'Away' | 'Offline'
  }
  setNewStaff: React.Dispatch<React.SetStateAction<any>>
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newStaff,
  setNewStaff
}) => {
  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Create New Staff Member</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#7E86B8' }}>
              Assign role, credentials, and domain access for operational managers and content executives.
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
                placeholder="e.g. Balaji, Jayanth"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Staff Official Email <span className="req">*</span></label>
              <input
                type="email"
                placeholder="e.g. balaji@wouchify.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>System Role <span className="req">*</span></label>
              <CustomDropdown
                value={newStaff.role}
                onChange={(val) => {
                  const role = val as 'executive' | 'operational_manager' | 'manager'
                  let defaultDomain = newStaff.domain
                  if (role === 'operational_manager') defaultDomain = 'Approvals & Quality Assurance'
                  else if (role === 'executive') defaultDomain = 'Deals & Loot Deals'
                  else defaultDomain = 'Platform Administration & Team Management'
                  setNewStaff({ ...newStaff, role, domain: defaultDomain })
                }}
                options={[
                  { value: 'executive', label: 'Content Executive (Deals, Coupons, Cards)' },
                  { value: 'operational_manager', label: 'Operational Manager (QA & Approvals)' },
                  { value: 'manager', label: 'Manager (Full Platform Admin)' }
                ]}
                variant="admin"
              />
            </div>

            <div className="form-group">
              <label>Assigned Domain / Verticals</label>
              <input
                type="text"
                placeholder="e.g. Deals & Loot Deals, Coupons & Cards"
                value={newStaff.domain}
                onChange={(e) => setNewStaff({ ...newStaff, domain: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="form-group">
              <label>Portal Login Password</label>
              <input
                type="text"
                placeholder="staff123"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Initial Presence Status</label>
              <CustomDropdown
                value={newStaff.status}
                onChange={(val) => setNewStaff({ ...newStaff, status: val as 'Online' | 'Away' | 'Offline' })}
                options={[
                  { value: 'Online', label: '🟢 Online' },
                  { value: 'Away', label: '🟡 Away' },
                  { value: 'Offline', label: '⚪ Offline' }
                ]}
                variant="admin"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Staff Account 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
