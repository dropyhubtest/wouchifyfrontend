import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './ProfilePage.css'

interface UserInfo {
  name?: string
  fullName?: string
  email?: string
  mobile?: string
  avatar?: string
}

export const ProfilePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('userInfo')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const data = parsed?.user || parsed
        setUserInfo(data)
        setEditName(data.name || data.fullName || '')
        setEditPhone(data.mobile || '')
      } catch {}
    }
  }, [])

  const displayName = userInfo?.name || userInfo?.fullName || userInfo?.email?.split('@')[0] || 'User'

  const getInitial = () => {
    if (userInfo?.name) return userInfo.name.charAt(0).toUpperCase()
    if (userInfo?.fullName) return userInfo.fullName.charAt(0).toUpperCase()
    if (userInfo?.email) return userInfo.email.charAt(0).toUpperCase()
    return '?'
  }

  const handleSave = () => {
    const updated = { ...userInfo, name: editName, mobile: editPhone }
    localStorage.setItem('userInfo', JSON.stringify(updated))
    setUserInfo(updated)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const menuItems = [
    { icon: '👤', label: 'Profile', href: '/profile', active: true },
    { icon: '🛍️', label: 'My Orders', href: '/orders' },
    { icon: '💛', label: 'Favorites', href: '/favorites' },
    { icon: '👜', label: 'My Wallet', href: '/wallet' },
    { icon: '🔔', label: 'Notifications', href: '/notifications' },
    { icon: '🎁', label: 'Refer & Earn', href: '/refer' },
  ]

  return (
    <main className="profile-page">
      <div className="profile-page__header-bg" />
      <div className="profile-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-sidebar__avatar-wrap">
            <div className="profile-sidebar__avatar">{getInitial()}</div>
            <p className="profile-sidebar__name">{displayName}</p>
            <p className="profile-sidebar__email">{userInfo?.email}</p>
          </div>
          <nav className="profile-sidebar__nav">
            {menuItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`profile-sidebar__nav-item ${item.active ? 'active' : ''}`}
              >
                <span className="profile-sidebar__nav-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-card__header">
              <h1 className="profile-card__title">My Profile</h1>
              {!isEditing && (
                <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {saved && (
              <div className="profile-success-banner">✅ Profile updated successfully!</div>
            )}

            <div className="profile-fields">
              <div className="profile-field">
                <label className="profile-field__label">Full Name</label>
                {isEditing ? (
                  <input
                    className="profile-field__input"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="profile-field__value">{displayName}</p>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-field__label">Email Address</label>
                <p className="profile-field__value profile-field__value--muted">
                  {userInfo?.email || '—'}
                </p>
              </div>

              <div className="profile-field">
                <label className="profile-field__label">Phone Number</label>
                {isEditing ? (
                  <input
                    className="profile-field__input"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    type="tel"
                  />
                ) : (
                  <p className="profile-field__value">{userInfo?.mobile || '—'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="profile-card__actions">
                <button className="profile-save-btn" onClick={handleSave}>Save Changes</button>
                <button className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="profile-quick-links">
            <h2 className="profile-quick-links__title">Quick Access</h2>
            <div className="profile-quick-links__grid">
              {menuItems.filter(m => !m.active).map(item => (
                <a key={item.href} href={item.href} className="profile-quick-link-card">
                  <span className="profile-quick-link-card__icon">{item.icon}</span>
                  <span className="profile-quick-link-card__label">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </main>
  )
}

export default ProfilePage
