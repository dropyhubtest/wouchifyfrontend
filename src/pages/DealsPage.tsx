import React from 'react'
import { Navbar } from '../components/layout'
import { DealsHero, DealsFavouriteStores, BestSellingDeals } from '../components/deals'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './DealsPage.css'

export const DealsPage: React.FC = () => {
  const scale = useDesktopScale()

  return (
    <div className="deals-page" style={{ '--deals-scale': scale } as React.CSSProperties}>
      {/* 1. Header Background Layer (#EEEFFF, height: 131px) */}
      <div
        className="deals-page__header-bg"
        style={{ height: `${131 * scale}px` }}
        aria-hidden="true"
      />

      {/* 2. Top Navigation */}
      <div className="deals-page__navbar-wrapper">
        <Navbar activeNav="deals" />
      </div>

      {/* 3. Static Layered Deals Hero Section */}
      <DealsHero />

      {/* 4. Deals from Favourite Stores Section */}
      <DealsFavouriteStores />

      {/* 5. Best Selling Deal Picks Section */}
      <BestSellingDeals />

      {/* 6. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default DealsPage
