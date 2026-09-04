import exclusiveLootLamp from '../assets/exclusive-loot/exclusive-loot-lamp.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'

export interface ExclusiveLootDealItem {
  id: string
  slug: string
  title: string
  image: string
  storeLogo: string
  storeName: string
  category: string
  discount: string
  currentPrice: string
  originalPrice: string
  href: string
}

export const EXCLUSIVE_LOOT_DEALS: ExclusiveLootDealItem[] = [
  {
    id: 'exclusive-wall-light',
    slug: 'exclusive-wall-light',
    title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
    image: exclusiveLootLamp,
    storeLogo: amazonLogo,
    storeName: 'Amazon',
    category: 'Electronics',
    discount: '91%',
    currentPrice: '179',
    originalPrice: '1,899',
    href: '/deals/exclusive-wall-light',
  },
]
