import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ProfileHero } from '../components/profile/ProfileHero'

import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import editIcon from '../assets/profile/edit.png'

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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Arushi Shetty',
    fullName: 'Arushi Shetty',
    email: 'arushi123@gmail.com',
    mobile: '—',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('Arushi Shetty')
  const [editEmail, setEditEmail] = useState('arushi123@gmail.com')
  const [editPhone, setEditPhone] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('userInfo')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const data = parsed?.user || parsed
        const finalName = data.name || data.fullName || 'Arushi Shetty'
        const finalEmail = data.email || 'arushi123@gmail.com'
        const finalPhone = data.mobile || '—'
        setUserInfo({
          ...data,
          name: finalName,
          fullName: finalName,
          email: finalEmail,
          mobile: finalPhone,
        })
        setEditName(finalName)
        setEditEmail(finalEmail)
        setEditPhone(finalPhone === '—' ? '' : finalPhone)
      } catch {}
    }
  }, [])

  const displayName = userInfo.fullName || userInfo.name || 'Arushi Shetty'
  const firstName = displayName.split(' ')[0] || 'Arushi'
  const displayEmail = userInfo.email || 'arushi123@gmail.com'
  const displayPhone = userInfo.mobile || '—'

  const handleSave = () => {
    const updated = {
      ...userInfo,
      name: editName.trim() || 'Arushi Shetty',
      fullName: editName.trim() || 'Arushi Shetty',
      email: editEmail.trim() || 'arushi123@gmail.com',
      mobile: editPhone.trim() || '—',
    }
    localStorage.setItem('userInfo', JSON.stringify(updated))
    setUserInfo(updated)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setEditName(displayName)
    setEditEmail(displayEmail)
    setEditPhone(displayPhone === '—' ? '' : displayPhone)
    setIsEditing(false)
  }

  return (
    <div className="profile-page">
      {/* 1. Top Navbar */}
      {isMobile ? <MobileHeader /> : <Navbar activeNav="profile" />}

      {/* 2. Animated Profile Hero Section with Top-to-Bottom Sweep */}
      <ProfileHero
        name={firstName}
        email={displayEmail}
        onEditClick={() => setIsEditing(true)}
      />

      {/* 3. Main Body Container */}
      <main className="profile-main">
        <div className="profile-main__container">
          {/* Left Column: Stack of Pill Navigation Buttons + Quick Access */}
          <ProfileSidebar activeTab="profile" showQuickAccess={true} />

          {/* Right Column: User Information Form Cards */}
          <section className="profile-content" aria-label="User Profile Details">
            {saved && (
              <div className="profile-saved-banner" role="alert">
                Profile updated successfully!
              </div>
            )}

            <div className="profile-form-grid">
              {/* Field 1: Full Name */}
              <div className="profile-field-group">
                <label className="profile-field-label">Full Name:</label>
                <div className="profile-field-card" onClick={() => !isEditing && setIsEditing(true)}>
                  {isEditing ? (
                    <input
                      type="text"
                      className="profile-field-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter Full Name"
                      autoFocus
                    />
                  ) : (
                    <span className="profile-field-value">{displayName}</span>
                  )}
                  <button
                    type="button"
                    className="profile-field-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    aria-label="Edit Full Name"
                  >
                    <img src={editIcon} alt="Edit" className="profile-field-edit-img" />
                  </button>
                </div>
              </div>

              {/* Field 2: Email Id */}
              <div className="profile-field-group">
                <label className="profile-field-label">Email Id:</label>
                <div className="profile-field-card" onClick={() => !isEditing && setIsEditing(true)}>
                  {isEditing ? (
                    <input
                      type="email"
                      className="profile-field-input"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Enter Email Address"
                    />
                  ) : (
                    <span className="profile-field-value">{displayEmail}</span>
                  )}
                  <button
                    type="button"
                    className="profile-field-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    aria-label="Edit Email Id"
                  >
                    <img src={editIcon} alt="Edit" className="profile-field-edit-img" />
                  </button>
                </div>
              </div>

              {/* Field 3: Phone Number */}
              <div className="profile-field-group">
                <label className="profile-field-label">Phone Number:</label>
                <div className="profile-field-card" onClick={() => !isEditing && setIsEditing(true)}>
                  {isEditing ? (
                    <input
                      type="tel"
                      className="profile-field-input"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  ) : (
                    <span className="profile-field-value">{displayPhone}</span>
                  )}
                  <button
                    type="button"
                    className="profile-field-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                    aria-label="Edit Phone Number"
                  >
                    <img src={editIcon} alt="Edit" className="profile-field-edit-img" />
                  </button>
                </div>
              </div>

              {/* Editing Action Buttons */}
              {isEditing && (
                <div className="profile-form-actions">
                  <button type="button" className="profile-save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 4. Global Desktop Footer */}
      <FooterSection />
    </div>
  )
}

export default ProfilePage

