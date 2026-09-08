import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './NotFoundPage.css'

export const NotFoundPage: React.FC = () => {
  const scale = useDesktopScale()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div
      className="not-found-page"
      style={{ '--page-scale': scale } as React.CSSProperties}
    >
      {isMobile ? <MobileHeader /> : <Navbar />}

      <main className="not-found-page__content">
        <div className="not-found-page__inner" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          <h1 className="not-found-page__title">404</h1>
          <h2 className="not-found-page__subtitle">Oops! We couldn't find that page.</h2>
          <p className="not-found-page__desc">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="not-found-page__actions">
            <a href="/" className="not-found-page__btn not-found-page__btn--primary">
              Go to Home
            </a>
            <a href="/deals" className="not-found-page__btn not-found-page__btn--secondary">
              Browse Deals
            </a>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  )
}

export default NotFoundPage
