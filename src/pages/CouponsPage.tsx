import React from 'react'
import { Navbar } from '../components/layout'
import { CouponsHero, AvailableCoupons } from '../components/coupons'
import { DealsFavouriteStores } from '../components/deals'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './CouponsPage.css'

export const CouponsPage: React.FC = () => {
  const scale = useDesktopScale()

  return (
    <div className="coupons-page" style={{ '--deals-scale': scale } as React.CSSProperties}>
      {/* 1. Header Background Layer (#EEEFFF, height: 131px) */}
      <div
        className="coupons-page__header-bg"
        style={{ height: `${131 * scale}px` }}
        aria-hidden="true"
      />

      {/* 2. Top Navigation (COUPONS = active/red) */}
      <div className="coupons-page__navbar-wrapper">
        <Navbar activeNav="coupons" transparent={true} />
      </div>

      {/* 3. Hero — Coupons Hero */}
      <CouponsHero />

      {/* 4. Search & Filter Bar with Store Brand Strip (Cards hidden as per Figma) */}
      <DealsFavouriteStores
        title="Search Loot Deals"
        searchPlaceholder="Search Deals"
        hideCards={true}
      />

      {/* 5. Available Coupons Section (Amazon Coupon Card) */}
      <AvailableCoupons />

      {/* 6. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default CouponsPage
