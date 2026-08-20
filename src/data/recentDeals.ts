import banner1 from '../assets/recent-deals/banner_1.png'
import banner2 from '../assets/recent-deals/banner_2.png'

export interface RecentDealItem {
  id: string
  name: string
  image: string
  href: string
  alt: string
  left: number
  top: number
  width: number
  height: number
}

export const RECENT_DEALS: RecentDealItem[] = [
  {
    id: 'kettle-604',
    name: 'Milton Kettle ₹604',
    image: banner1,
    href: '/deals/kettle-604',
    alt: 'Milton Rapid Electric Kettle 1.8L for ₹604 on Amazon',
    left: 115,
    top: 122,
    width: 422,
    height: 261,
  },
  {
    id: 'kettle-700',
    name: 'Milton Kettle ₹700',
    image: banner2,
    href: '/deals/kettle-700',
    alt: 'Milton Rapid Electric Kettle 1.8L for ₹700 on Amazon',
    left: 609,
    top: 122,
    width: 422,
    height: 261,
  },
]
