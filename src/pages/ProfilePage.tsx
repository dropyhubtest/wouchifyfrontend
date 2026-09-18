import React, { useState, useEffect } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ProfileHero } from '../components/profile/ProfileHero'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import editIcon from '../assets/profile/edit.png'

import myordersImg from '../assets/profile/myorders.png'
import wishlistImg from '../assets/profile/wishlist.png'
import mywalletImg from '../assets/profile/mywallet.png'
import notificationsImg from '../assets/profile/notification_img.png'
import referEarnImg from '../assets/profile/refer_earn.png'

import './ProfilePage.css'

interface UserInfo {
  name?: string
  fullName?: string
  email?: string
  mobile?: string
  avatar?: string
}

const QUICK_ACCESS_ITEMS = [
  {
    id: 'orders',
    title: 'My Orders',
    image: myordersImg,
    href: '/orders',
    alt: 'My Orders',
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    image: wishlistImg,
    href: '/favorites',
    alt: 'Wishlist',
  },
  {
    id: 'wallet',
    title: 'My wallet',
    image: mywalletImg,
    href: '/wallet',
    alt: 'My wallet',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    image: notificationsImg,
    href: '/notifications',
    alt: 'Notifications',
  },
  {
    id: 'refer',
    title: 'Refer & Earn',
    image: referEarnImg,
    href: '/refer',
    alt: 'Refer & Earn',
  },
]

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
      {isMobile ? <MobileHeader variant="minimal" /> : <Navbar activeNav="profile" />}

      {/* 2. Animated Profile Hero Section */}
      <ProfileHero
        name={firstName}
        email={displayEmail}
        onEditClick={() => setIsEditing(true)}
      />

      {/* 3. Main Body Container */}
      <main className="profile-main">
        <div className="profile-main__wrapper">
          {/* Top Form Section: Sidebar Navigation + Profile Form Cards */}
          <div className="profile-top-row">
            {/* Left Column: Stack of Pill Navigation Buttons */}
            <ProfileSidebar activeTab="profile" showQuickAccess={false} />

            {/* Right Column: User Information Form Cards (Wide & Tall matching Figma) */}
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

          {/* Quick Access Section (Matching Figma with 5 Cards, Deep Bottom Shadow & Inner Top Shadow) */}
          <section className="profile-quick-access-section" aria-label="Quick Access">
            <div className="profile-quick-access-header">
              <div className="profile-quick-access-indicator" aria-hidden="true" />
              <h2 className="profile-quick-access-title">Quick Access</h2>
            </div>

            <div className="profile-quick-access-grid">
              <div className="profile-quick-access-row-top">
                {QUICK_ACCESS_ITEMS.slice(0, 3).map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="profile-quick-card"
                    aria-label={`Go to ${item.title}`}
                  >
                    <div className="profile-quick-card__image-wrap">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="profile-quick-card__img"
                        loading="lazy"
                      />
                    </div>
                    <span className="profile-quick-card__label">{item.title}</span>
                  </a>
                ))}
              </div>

              <div className="profile-quick-access-row-bottom">
                {QUICK_ACCESS_ITEMS.slice(3, 5).map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="profile-quick-card"
                    aria-label={`Go to ${item.title}`}
                  >
                    <div className="profile-quick-card__image-wrap">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="profile-quick-card__img"
                        loading="lazy"
                      />
                    </div>
                    <span className="profile-quick-card__label">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 4. Footer Section (Desktop vs Mobile) */}
      {isMobile ? <MobileFooter /> : <FooterSection />}
    </div>
  )
}

export default ProfilePage

