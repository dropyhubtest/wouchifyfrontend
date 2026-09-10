import React, { useState, useEffect } from 'react'
import mobileWouchifyLogo from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import favoriteIcon from '../../assets/mobile/navigation/favorite.svg'
import accountIcon from '../../assets/navbar/account.svg'
import { NAV_LINKS, resolveActiveNav } from '../../data/navigation'
import { SearchOverlay } from '../search/SearchOverlay'
import './MobileHeader.css'

export interface MobileHeaderProps {
  activeNav?: string
  variant?: 'default' | 'minimal'
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ activeNav, variant = 'default' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name?: string; fullName?: string; email?: string } | null>(null)
  const currentActiveNav = resolveActiveNav(activeNav)

  useEffect(() => {
    const raw = localStorage.getItem('userInfo')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Handle both old format {token, user:{...}} and new flat format {name, email}
        const userData = parsed?.user || parsed
        setUserInfo(userData)
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const getInitial = () => {
    if (userInfo?.fullName) return userInfo.fullName.charAt(0).toUpperCase()
    if (userInfo?.name) return userInfo.name.charAt(0).toUpperCase()
    if (userInfo?.email) return userInfo.email.charAt(0).toUpperCase()
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('just_logged_in')
    window.location.href = '/login'
  }

  const displayName = userInfo?.fullName || userInfo?.name || userInfo?.email?.split('@')[0] || 'User'

  return (
    <>
      <div aria-hidden="true" style={{ height: '64px', width: '100%', flexShrink: 0 }} />
      <header className="mobile-header">
        <div className="mobile-header__inner">
          <div className="mobile-header__left">
            <button
              type="button"
              className="mobile-header__menu"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>

            <a href="/" className="mobile-header__logo-link" aria-label="Wouchify Home">
              <img
                className="mobile-header__logo"
                src={mobileWouchifyLogo}
                alt="Wouchify"
                width="130"
                height="38"
              />
            </a>
          </div>

          {/* Right-side action icons */}
          <div className="mobile-header__actions">
            {/* Search icon */}
            {variant !== 'minimal' && (
              <button
                type="button"
                className="mobile-header__action-btn"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2A3189" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            )}

            <a className="mobile-header__action-btn" href="/favorites" aria-label="View favourites">
              <img src={favoriteIcon} alt="" aria-hidden="true" />
            </a>

          {variant !== 'minimal' && (
            userInfo ? (
              <div className="mobile-header__user-wrap" style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="mobile-header__action-btn mobile-header__avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="My Profile"
                  style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                >
                  {getInitial() ? (
                    <span className="mobile-header__avatar-initial">{getInitial()}</span>
                  ) : (
                    <img src={accountIcon} alt="" aria-hidden="true" />
                  )}
                </button>

                {showUserMenu && (
                  <div className="mobile-header__user-menu">
                    <div className="mobile-header__user-menu-header">
                      <div className="mobile-header__avatar-initial mobile-header__avatar-initial--lg">{getInitial()}</div>
                      <div>
                        <p className="mobile-header__user-menu-name">{displayName}</p>
                        <p className="mobile-header__user-menu-email">{userInfo.email}</p>
                      </div>
                    </div>
                    <div className="mobile-header__user-menu-divider" />
                    <a href="/profile" className="mobile-header__user-menu-item">My Profile</a>
                    <a href="/wallet" className="mobile-header__user-menu-item">My Wallet</a>
                    <a href="/orders" className="mobile-header__user-menu-item">My Orders</a>
                    <a href="/favorites" className="mobile-header__user-menu-item">Saved Items</a>
                    <div className="mobile-header__user-menu-divider" />
                    <button
                      type="button"
                      className="mobile-header__user-menu-item mobile-header__user-menu-item--danger"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a className="mobile-header__action-btn mobile-header__avatar" href="/login" aria-label="Sign In">
                <img src={accountIcon} alt="" aria-hidden="true" />
              </a>
            )
          )}
        </div>
      </div>

        {isMenuOpen && (
          <>
            <div
              className="mobile-drawer-backdrop"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <nav
              id="mobile-nav-drawer"
              className="mobile-nav-drawer"
              aria-label="Mobile Navigation"
            >
              <div className="mobile-drawer-header">
                <a href="/" aria-label="Wouchify Home" onClick={() => setIsMenuOpen(false)}>
                  <img
                    src={mobileWouchifyLogo}
                    alt="Wouchify"
                    className="mobile-drawer-logo"
                  />
                </a>
                <button
                  type="button"
                  className="mobile-drawer-close-btn"
                  aria-label="Close navigation menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  &times;
                </button>
              </div>
              <ul className="mobile-drawer-list">
                {NAV_LINKS.map((item) => {
                  const isActive = currentActiveNav === item.id.toLowerCase()
                  return (
                    <li key={item.id} className="mobile-drawer-item">
                      <a
                        href={item.href}
                        className={`mobile-drawer-link ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                        {...(isActive ? { 'aria-current': 'page' } : {})}
                      >
                        {item.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </>
        )}
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default MobileHeader

