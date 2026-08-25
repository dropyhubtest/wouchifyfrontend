import { useState, useEffect } from 'react'
import mobileWouchifyLogo from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import favoriteIcon from '../../assets/mobile/navigation/favorite.svg'
import { NAV_LINKS } from '../../data/navigation'
import './MobileHeader.css'

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              {NAV_LINKS.map((item) => (
                <li key={item.id} className="mobile-drawer-item">
                  <a
                    href={item.href}
                    className={`mobile-drawer-link ${item.active ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                    {...(item.active ? { 'aria-current': 'page' } : {})}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}

export default MobileHeader
