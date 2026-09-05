import React from 'react'
import { Navbar } from '../components/layout'
import { LootDealsHero } from '../components/loot'
import { DealsFavouriteStores, BestSellingDeals } from '../components/deals'
import { FooterSection } from '../components/footer'
import { useDesktopScale } from '../hooks/useDesktopScale'
import './LootDealsPage.css'

export const LootDealsPage: React.FC = () => {
  const scale = useDesktopScale()

  return (
    <div className="loot-deals-page" style={{ '--deals-scale': scale } as React.CSSProperties}>
      {/* 1. Header Background Layer (#EEEFFF, height: 131px) */}
      <div
        className="loot-deals-page__header-bg"
        style={{ height: `${131 * scale}px` }}
        aria-hidden="true"
      />

      {/* 2. Top Navigation (LOOT DEALS = active/red) */}
      <div className="loot-deals-page__navbar-wrapper">
        <Navbar activeNav="loot-deals" />
      </div>

      {/* 3. Hero — Loot Deals Hero */}
      <LootDealsHero />

      {/* 4. Reused Deals Favourite Stores Section (Configured for Loot Deals) */}
      <DealsFavouriteStores
        title="Search Loot Deals"
        searchPlaceholder="Search Store, Code or Discount"
        singleCardMode={true}
      />

      {/* 5. Reused Best Selling Deal Picks Section (Configured for Loot Deals Empty State) */}
      <BestSellingDeals
        title="Best Selling Deal Picks"
        topPillText="Top Deals"
        showEmptyState={true}
        emptyStateTitle="No loot deals found"
        emptyStateSubtitle="Try adjusting your filters"
      />

      {/* 6. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default LootDealsPage
