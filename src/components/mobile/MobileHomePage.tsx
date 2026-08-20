import { useState, type FormEvent } from 'react'
import { MobileHeader } from './MobileHeader'
import { MobilePromoHero } from './MobilePromoHero'
import { MobilePopularBrands } from './MobilePopularBrands'
import { MobileCategories } from './MobileCategories'
import { MobileRecentDeals } from './MobileRecentDeals'
import { MobileTrendingDeals } from './MobileTrendingDeals'
import { MobileFlashDeals } from './MobileFlashDeals'
import { MobileAdvertisement } from './MobileAdvertisement'
import { MobileFeaturedCreditCards } from './MobileFeaturedCreditCards'
import { MobileFooter } from './MobileFooter'
import './MobileHomePage.css'

export const MobileHomePage = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      console.log('Mobile Search for:', searchValue)
    }
  }

  return (
    <div className="mobile-root">
      <MobileHeader />

      <form
        role="search"
        className="mobile-search-wrapper"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="search"
          className="mobile-search-input"
          placeholder="Search deals, stores...."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-label="Search deals, stores"
        />
        <button
          type="submit"
          className="mobile-search__button"
          aria-label="Search deals and stores"
        />
      </form>

      <MobilePromoHero />

      <MobilePopularBrands />

      <MobileCategories />

      <MobileRecentDeals />

      <MobileTrendingDeals />

      <MobileFlashDeals />

      <MobileAdvertisement />

      <MobileFeaturedCreditCards />

      <MobileFooter />
    </div>
  )
}

export default MobileHomePage
