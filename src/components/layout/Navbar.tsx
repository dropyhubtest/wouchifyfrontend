import React, { useState, useEffect } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { SearchOverlay } from '../search/SearchOverlay'
import { getWishlistCount } from '../../utils/wishlistManager'
import './Navbar.css'

import { NAV_LINKS, resolveActiveNav } from '../../data/navigation'

export interface NavbarProps {
  activeNav?: string
  transparent?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ activeNav, transparent = false }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const headerScale = useDesktopScale()

  // Auth state
  const [user, setUser] = useState<{ name?: string; fullName?: string; email?: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [wishlistCount, setWishlistCount] = useState<number>(() => getWishlistCount())

  // Scroll state for dynamic header transparency on pages with overlapping hero artwork
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleWishlistChange = () => {
      setWishlistCount(getWishlistCount())
    }
    window.addEventListener('wouchify_wishlist_updated', handleWishlistChange)
    window.addEventListener('storage', handleWishlistChange)
    return () => {
      window.removeEventListener('wouchify_wishlist_updated', handleWishlistChange)
      window.removeEventListener('storage', handleWishlistChange)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo)
        // Handle both old format {token, user:{...}} and new flat format {name, email}
        const userData = parsed?.user || parsed
        setUser(userData)
      } catch {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('just_logged_in')
    window.location.href = '/login'
  }

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase()
  }

  const displayName = user?.name || user?.fullName || user?.email?.split('@')[0] || 'User'


  return (
    <>
      {!transparent && (
        <div 
          className="wouchify-header-spacer"
          aria-hidden="true" 
        />
      )}
      <header
        className={`wouchify-header ${transparent ? 'wouchify-header--transparent' : ''} ${isScrolled ? 'is-scrolled' : ''}`}
        role="banner"
      >
        <div className="wouchify-navbar-inner">
          {/* Logo */}
          <div className="navbar-brand">
            <a href="/" className="navbar-logo-link" aria-label="Wouchify Home">
              <img
                src={logo}
                alt="Wouchify"
                className="navbar-logo-img"
              />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="navbar-nav" aria-label="Main Navigation">
            <ul className="nav-list">
              {NAV_LINKS.map((item) => {
                const currentActive = resolveActiveNav(activeNav)
                const isActive = currentActive === item.id.toLowerCase()

                return (
                  <li key={item.id} className={`nav-item nav-item-${item.id}`}>
                    <a
                      href={item.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      {...(isActive ? { 'aria-current': 'page' } : {})}
                    >
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Header Actions: Expandable Search, Wishlist, Wallet, Account */}
          <div className="navbar-actions">
            {/* Expandable Hover Search Bar */}
            <form
              className="navbar-search-tile"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.querySelector('input') as HTMLInputElement
                if (input && input.value.trim()) {
                  window.location.href = `/deals?search=${encodeURIComponent(input.value.trim())}`
                } else {
                  setIsSearchOpen(true)
                }
              }}
            >
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search deals, stores..."
                aria-label="Search deals and stores"
              />
              <button
                type="submit"
                className="navbar-search-btn"
                aria-label="Search"
                onClick={(e) => {
                  const form = e.currentTarget.closest('form')
                  const input = form?.querySelector('input') as HTMLInputElement
                  if (!input || !input.value.trim()) {
                    setIsSearchOpen(true)
                  }
                }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1E1E1E"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

            {/* Wishlist Button */}
            <a
              href="/favorites"
              className="navbar-action-tile wishlist-btn"
              aria-label="Wishlist / Favorites"
              style={{ position: 'relative' }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E1E1E"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="action-icon-svg"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '999px',
                    background: '#E31E25',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(227, 30, 37, 0.4)',
                    lineHeight: '1'
                  }}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </a>

            {/* Wallet Button */}
            <a
              href="/wallet"
              className="wallet-btn"
              aria-label="My Wallet"
            >
              <div className="wallet-pill">
                <div className="wallet-anim-container">
                  <div className="falling-coin coin-1">₹</div>
                  <div className="falling-coin coin-2">₹</div>
                  <div className="falling-coin coin-3">₹</div>
                  <svg className="wallet-purse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                  </svg>
                </div>
                <span className="wallet-balance">1,250</span>
              </div>
            </a>

            {/* Account / Auth Button */}
            {user ? (
              <div className="navbar-user-wrap">
                <button
                  type="button"
                  className="navbar-user-btn"
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="Account Menu"
                >
                  <div className="navbar-avatar">{getInitials(user.name || user.fullName || user.email?.split('@')[0])}</div>
                  <span className="navbar-user-name">{displayName}</span>
                  <svg className="navbar-chevron" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {showUserMenu && (
                  <div className="navbar-user-menu">
                    <div className="navbar-user-menu__header">
                      <div className="navbar-avatar navbar-avatar--lg">{getInitials(user.name || user.fullName || user.email?.split('@')[0])}</div>
                      <div>
                        <p className="navbar-user-menu__name">{displayName}</p>
                        <p className="navbar-user-menu__email">{user.email}</p>
                      </div>
                    </div>
                    <div className="navbar-user-menu__divider" />
                    <a className="navbar-user-menu__link" href="/profile">👤 My Profile</a>
                    <a className="navbar-user-menu__link" href="/orders">🛍️ My Orders</a>
                    <a className="navbar-user-menu__link" href="/wallet">💰 My Wallet</a>
                    <a className="navbar-user-menu__link" href="/notifications">🔔 Notifications</a>
                    <a className="navbar-user-menu__link" href="/refer">🎁 Refer &amp; Earn</a>
                    <div className="navbar-user-menu__divider" />
                    <button className="navbar-user-menu__logout" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="navbar-login-btn" aria-label="Login">
                Login
              </a>
            )}
          </div>
        </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} headerScale={headerScale} />
    </>
  )
}

export default Navbar
