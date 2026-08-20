import banner1 from '../assets/recent-deals/banner_1.png'
import banner2 from '../assets/recent-deals/banner_2.png'

export interface TrendingDealItem {
  id: string
  rank: number
  name: string
  image: string
  href: string
  alt: string
  left: number
  top: number
  badgeLeft: number
  badgeTop: number
}

export const TRENDING_DEALS: TrendingDealItem[] = [
  {
    id: 'trending-kettle-604',
    rank: 1,
    name: 'Milton Rapid Electric Kettle 1.8L for ₹604',
    image: banner1,
    href: '/deals/kettle-604',
    alt: 'Milton Rapid Electric Kettle 1.8L for ₹604 on Amazon',
    left: 115,
    top: 200,
    badgeLeft: 45,
    badgeTop: 163,
  },
  {
    id: 'trending-kettle-700',
    rank: 2,
    name: 'Milton Rapid Electric Kettle 1.8L for ₹700',
    image: banner2,
    href: '/deals/kettle-700',
    alt: 'Milton Rapid Electric Kettle 1.8L for ₹700 on Amazon',
    left: 719,
    top: 200,
    badgeLeft: 649,
    badgeTop: 163,
  },
]
