import banner1 from '../assets/recent-deals/banner_1.png'
import banner2 from '../assets/recent-deals/banner_2.png'

export interface MobileRecentDealItem {
  id: string
  image: string
  href: string
  alt: string
}

export const MOBILE_RECENT_DEALS: MobileRecentDealItem[] = [
  {
    id: 'kettle-604',
    image: banner1,
    href: '/deals/kettle-604',
    alt: 'Milton kettle deal for ₹604',
  },
  {
    id: 'kettle-700',
    image: banner2,
    href: '/deals/kettle-700',
    alt: 'Milton kettle deal for ₹700',
  },
]
