import banner1 from '../assets/recent-deals/banner_1.png'
import banner2 from '../assets/recent-deals/banner_2.png'

export interface MobileTrendingDealItem {
  id: string
  image: string
  href: string
  rank: number
  alt: string
}

export const MOBILE_TRENDING_DEALS: MobileTrendingDealItem[] = [
  {
    id: 'kettle-604',
    image: banner1,
    href: '/deals/kettle-604',
    rank: 1,
    alt: 'Milton kettle deal for ₹604',
  },
  {
    id: 'kettle-700',
    image: banner2,
    href: '/deals/kettle-700',
    rank: 2,
    alt: 'Milton kettle deal for ₹700',
  },
]
