import React, { useState, useEffect, useRef } from 'react'
import {
  MOBILE_FOOTER_LOGO,
  MOBILE_FOOTER_ACCORDIONS,
  MOBILE_FOOTER_CONTACT,
  MOBILE_FOOTER_SOCIALS,
  MOBILE_BOTTOM_LEGAL_LINKS,
} from '../../data/mobileFooter'
import './MobileFooter.css'

export const MobileFooter: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  // Close dropdown if clicked outside the nav container
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [])

  return (
    <footer className="mobile-footer" aria-label="Site Footer">
      {/* Brand Logo & Description */}
      <img
        src={MOBILE_FOOTER_LOGO.src}
        alt={MOBILE_FOOTER_LOGO.alt}
        className="mobile-footer__logo"
        loading="lazy"
      />
      <p className="mobile-footer__description">{MOBILE_FOOTER_LOGO.description}</p>

      {/* Accordions / Dropdown Overlay Navigation */}
      <nav
        ref={navRef}
        className="mobile-footer__accordions"
        aria-label="Footer Navigation"
      >
        {MOBILE_FOOTER_ACCORDIONS.map((section) => {
          const isOpen = openDropdown === section.id
          return (
            <div key={section.id} className="mobile-footer-accordion__item">
              <button
                type="button"
                className="mobile-footer-accordion__button"
                onClick={() => toggleDropdown(section.id)}
                aria-expanded={isOpen}
                aria-controls={`footer-dropdown-${section.id}`}
              >
                <span>{section.title}</span>
                <span
                  className={`mobile-footer-accordion__arrow ${
                    isOpen ? 'mobile-footer-accordion__arrow--open' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Seamless 2-Way Dropdown Overlay */}
              <div
                id={`footer-dropdown-${section.id}`}
                className={`mobile-footer__dropdown-overlay ${
                  isOpen ? 'mobile-footer__dropdown-overlay--open' : ''
                }`}
                aria-hidden={!isOpen}
              >
                <ul className="mobile-footer__dropdown-list">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="mobile-footer__dropdown-link"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Contact Details */}
      <address className="mobile-footer__contact">
        <div className="mobile-footer__contact-row">
          <img
            src={MOBILE_FOOTER_CONTACT.emailIcon}
            alt=""
            className="mobile-footer__contact-icon"
            aria-hidden="true"
          />
          <a
            href={`mailto:${MOBILE_FOOTER_CONTACT.email}`}
            className="mobile-footer__contact-text mobile-footer__contact-text--link"
          >
            {MOBILE_FOOTER_CONTACT.email}
          </a>
        </div>
        <div className="mobile-footer__contact-row">
          <img
            src={MOBILE_FOOTER_CONTACT.locationIcon}
            alt=""
            className="mobile-footer__contact-icon"
            aria-hidden="true"
          />
          <span className="mobile-footer__contact-text">
            {MOBILE_FOOTER_CONTACT.location}
          </span>
        </div>
      </address>

      {/* Social Media Links */}
      <div className="mobile-footer__socials" aria-label="Social Media Channels">
        {MOBILE_FOOTER_SOCIALS.map((social) => (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-footer__social-link"
            aria-label={social.ariaLabel}
          >
            <img
              src={social.icon}
              alt={social.platform}
              className="mobile-footer__social-icon"
              loading="lazy"
            />
          </a>
        ))}
      </div>

      {/* Bottom Dashed Separator */}
      <div className="mobile-footer__bottom-separator" aria-hidden="true" />

      {/* Copyright */}
      <p className="mobile-footer__copyright">
        © 2026 WOUCHIFY. All rights reserved. Made with ❤️ in India.
      </p>

      {/* Bottom Legal Links Row */}
      <nav className="mobile-footer__legal-nav" aria-label="Legal Links">
        <ul className="mobile-footer__legal-list">
          {MOBILE_BOTTOM_LEGAL_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="mobile-footer__legal-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}

export default MobileFooter
