import React, { useState, useRef, useEffect } from 'react'
import logo from '../../assets/navbar/wouchify-logo.png'
import searchIcon from '../../assets/navbar/search.svg'
import cartIcon from '../../assets/navbar/cart.svg'
import accountIcon from '../../assets/navbar/account.svg'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './Navbar.css'

import { NAV_LINKS, resolveActiveNav } from '../../data/navigation'

export interface NavbarProps {
  activeNav?: string
  transparent?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ activeNav, transparent = false }) => {
  const [searchValue, setSearchValue] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const headerScale = useDesktopScale()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auth state
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try { setUser(JSON.parse(userInfo)) } catch {}
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

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User'

  const handleSearchFocus = () => {
    setIsSearchExpanded(true)
  }

  const handleSearchBlur = () => {
    if (!searchValue.trim()) {
      setIsSearchExpanded(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsSearchExpanded(false)
      inputRef.current?.blur()
    }
  }

  const triggerInputFocus = () => {
    setIsSearchExpanded(true)
    inputRef.current?.focus()
  }

  return (
    <>
      {!transparent && (
        <div 
          aria-hidden="true" 
          style={{ height: `${131 * headerScale}px`, width: '100%', flexShrink: 0 }} 
        />
      )}
      <header
        className={`wouchify-header ${transparent ? 'wouchify-header--transparent' : ''}`}
        role="banner"
        style={
          {
            '--header-scale': headerScale,
            height: `${131 * headerScale}px`,
          } as React.CSSProperties
        }
      >
      {/* 1920 x 131 Figma Reference Canvas */}
      <div className="wouchify-navbar-canvas">
        {/* Logo Layer: left: 7px, top: -20px, 401 x 207 (optically centered visible artwork) */}
        <div className="navbar-brand">
          <a href="/" className="navbar-logo-link" aria-label="Wouchify Home">
            <img
              src={logo}
              alt="Wouchify"
              className="navbar-logo-img"
              width="401"
              height="207"
            />
          </a>
        </div>

        {/* Navigation Row: left: 563px, top: 49px */}
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

        {/* Header Actions: Search, Cart, Account */}
        <div className="navbar-actions">
          {/* Search Component: left: 1440px, top: 38px, 235 x 58 */}
          <form
            role="search"
            className={`search-form ${isSearchExpanded ? 'expanded' : ''}`}
            onSubmit={handleSearchSubmit}
            onMouseEnter={() => setIsSearchExpanded(true)}
            onMouseLeave={() => {
              if (!inputRef.current || document.activeElement !== inputRef.current) {
                if (!searchValue.trim()) {
                  setIsSearchExpanded(false)
                }
              }
            }}
          >
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Search deals, stores..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onKeyDown={handleKeyDown}
              aria-label="Search site"
              tabIndex={0}
            />
            <button
              type="button"
              className="search-action-btn"
              aria-label="Search"
              onClick={triggerInputFocus}
            >
              <span className="search-icon-crop" aria-hidden="true">
                <img src={searchIcon} alt="" className="search-icon-img" />
              </span>
            </button>
          </form>

          {/* Cart Button: left: 1707px, top: 48px, 31 x 31 */}
          <button
            type="button"
            className="action-btn cart-btn"
            aria-label="Shopping Cart"
          >
            <img
              src={cartIcon}
              alt=""
              aria-hidden="true"
              className="action-icon-img"
              width="31"
              height="31"
            />
          </button>

          {/* Wallet Button */}
          <a
            href="/wallet"
            className="action-btn wallet-btn"
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
                <div className="navbar-avatar">{getInitials(user.fullName)}</div>
                <span className="navbar-user-name">{displayName}</span>
                <svg className="navbar-chevron" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {showUserMenu && (
                <div className="navbar-user-menu">
                  <div className="navbar-user-menu__header">
                    <div className="navbar-avatar navbar-avatar--lg">{getInitials(user.fullName)}</div>
                    <div>
                      <p className="navbar-user-menu__name">{displayName}</p>
                      <p className="navbar-user-menu__email">{user.email}</p>
                    </div>
                  </div>
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
    </>
  )
}

export default Navbar
