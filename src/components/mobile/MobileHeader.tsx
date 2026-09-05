import React, { useState, useEffect } from 'react'
import mobileWouchifyLogo from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import favoriteIcon from '../../assets/mobile/navigation/favorite.svg'
import { NAV_LINKS, resolveActiveNav } from '../../data/navigation'
import './MobileHeader.css'

export interface MobileHeaderProps {
  activeNav?: string
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ activeNav }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentActiveNav = resolveActiveNav(activeNav)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <>
      <div aria-hidden="true" style={{ height: '64px', width: '100%', flexShrink: 0 }} />
      <header className="mobile-header">
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

      <a href="/" aria-label="Wouchify Home">
        <img
          className="mobile-header__logo"
          src={mobileWouchifyLogo}
          alt="Wouchify"
          width="164"
          height="48"
        />
      </a>

      <a
        className="mobile-header__favorite"
        href="/favorites"
        aria-label="View favourites"
      >
        <img src={favoriteIcon} alt="" aria-hidden="true" />
      </a>

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
              <span className="mobile-drawer-title">Navigation</span>
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
    </>
  )
}

export default MobileHeader
