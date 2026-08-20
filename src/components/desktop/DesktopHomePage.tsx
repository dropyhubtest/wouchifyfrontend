import { Navbar } from '../layout'
import { HeroSection } from '../hero'
import { AnnouncementMarquee } from '../marquee'
import { FluidTrustDivider } from '../divider'
import { PopularBrandsSection } from '../popular-brands'
import { TopStoresSection } from '../top-stores'
import { RecentDealsSection } from '../recent-deals'
import { TrendingDealsSection } from '../trending-deals'
import { FlashLootSection } from '../flash-loot'
import { AdvertisementSection } from '../advertisement'
import { ExclusiveLootSection } from '../exclusive-loot'
import { FeaturedCreditCardsSection } from '../featured-credit-cards'
import { FooterSection } from '../footer'

export const DesktopHomePage: React.FC = () => {
  return (
    <div id="app">
      <Navbar />
      <HeroSection />
      <AnnouncementMarquee />
      <FluidTrustDivider />
      <PopularBrandsSection />
      <TopStoresSection />
      <RecentDealsSection />
      <TrendingDealsSection />
      <FlashLootSection />
      <AdvertisementSection />
      <ExclusiveLootSection />
      <FeaturedCreditCardsSection />
      <FooterSection />
    </div>
  )
}

export default DesktopHomePage
