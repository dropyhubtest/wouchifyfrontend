import React from 'react'
import wouchifyLogo from '../../assets/navbar/wouchify-logo.png'
import watermarkMain from '../../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../../assets/hero/hero-watermark-main-state-2.png'
import { WatermarkAnimation } from '../hero/WatermarkAnimation'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import {
  EXPLORE_LINKS,
  COMPANY_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
  CONTACT_DETAILS,
  BOTTOM_LEGAL_LINKS,
} from '../../data/footer'
import './FooterSection.css'

export const FooterSection: React.FC = () => {
  const sectionScale = useDesktopScale()

  const emailDetail = CONTACT_DETAILS.find((item) => item.type === 'email')
  const locationDetail = CONTACT_DETAILS.find((item) => item.type === 'location')

  return (
    <footer
      className="footer-section"
      aria-label="Footer"
      style={
        {
          '--footer-scale': sectionScale,
          height: `${1120 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 1120 Reference Canvas */}
      <div className="footer-canvas">
        {/* Top Footer Separator (Figma elongated Red Dashed Line) */}
        <svg
          className="footer__top-separator"
          width="1920"
          height="4"
          viewBox="0 0 1920 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="2"
            x2="1920"
            y2="2"
            stroke="#E31E25"
            strokeWidth="2.5"
            strokeDasharray="18 16"
          />
        </svg>

        {/* Brand Block with spacious 140px gap from top dashed line */}
        <div className="footer-brand-block">
          <img
            src={wouchifyLogo}
            alt="Wouchify - Save More Everyday"
            className="footer-logo"
          />
          <p className="footer-brand-description">
            India&apos;s #1 free deal discovery platform. Verified coupons,
            <br />
            loot deals, and rewards - all in one place, zero cost.
          </p>
          <div className="footer-pills-row">
            <a href="/deals" className="footer-tag-pill footer-tag-pill--verified">
              Verified Deals
            </a>
            <a href="/loot-deals" className="footer-tag-pill footer-tag-pill--instant">
              Instant Deals
            </a>
          </div>
        </div>

        {/* Animated W Watermark with less gap from top line than the logo */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className="footer-watermark-wrap"
        />

        {/* Footer Navigation Columns */}
        <nav aria-label="Footer Navigation">
          {/* Explore Column */}
          <h2 className="footer-column-heading footer-column-heading--explore">
            Explore
          </h2>
          <ul className="footer-link-list footer-link-list--explore">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.label} className="footer-link-item">
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Company Column */}
          <h2 className="footer-column-heading footer-column-heading--company">
            Company
          </h2>
          <ul className="footer-link-list footer-link-list--company">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label} className="footer-link-item">
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Legal Column */}
          <h2 className="footer-column-heading footer-column-heading--legal">
            Legal
          </h2>
          <ul className="footer-link-list footer-link-list--legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label} className="footer-link-item">
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Stay Updated Column */}
        <div className="footer-stay-updated-group">
          <h2 className="footer-column-heading footer-column-heading--stay-updated">
            Stay Updated
          </h2>
          <p className="footer-stay-updated-text">
            Get daily loot alerts &amp; exclusive codes
            <br />
            — join our Telegram!
          </p>
        </div>

        {/* Contact Information & Address */}
        <address className="footer-contact-address" style={{ fontStyle: 'normal' }}>
          {emailDetail && (
            <div className="footer-contact-item footer-contact-item--email">
              <img
                src={emailDetail.icon}
                alt=""
                className="footer-contact-icon--email"
                width="32"
                height="32"
              />
              <p className="footer-contact-text--email">
                <a href={emailDetail.href} className="footer-contact-link">
                  {emailDetail.text}
                </a>
              </p>
            </div>
          )}

          {locationDetail && (
            <div className="footer-contact-item footer-contact-item--location">
              <img
                src={locationDetail.icon}
                alt=""
                className="footer-contact-icon--location"
                width="40"
                height="40"
              />
              <p className="footer-contact-text--location">
                {locationDetail.text}
              </p>
            </div>
          )}
        </address>

        {/* Social Links */}
        <div className="footer-social-group">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.id}
              href={social.href}
              aria-label={`Visit our ${social.name} page`}
              className={`footer-social-link footer-social-link--${social.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={social.icon}
                alt={social.name}
                className="footer-social-icon"
                width="78"
                height="78"
              />
            </a>
          ))}
        </div>

        {/* Bottom Footer Bar (Default Dashed Line) */}
        <hr className="footer-divider-line" aria-hidden="true" />

        <p className="footer-copyright">
          © 2026 WOUCHIFY. All rights reserved. Made with ❤️ in India.
        </p>

        {/* Bottom Legal Links */}
        {BOTTOM_LEGAL_LINKS.map((link) => {
          const slug = link.label.toLowerCase().replace(/\s+/g, '-')
          return (
            <a
              key={link.label}
              href={link.href}
              className={`footer-bottom-link footer-bottom-link--${slug}`}
            >
              {link.label}
            </a>
          )
        })}
      </div>
    </footer>
  )
}

export default FooterSection
