import flashLootLamp from '../assets/flash-loot/flash-loot-lamp.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'

export interface FlashLootDealItem {
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

export const FLASH_LOOT_DEALS: FlashLootDealItem[] = [
  {
    id: 'flash-wall-light',
    slug: 'flash-wall-light',
    title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
    image: flashLootLamp,
    storeLogo: amazonLogo,
    storeName: 'Amazon',
    category: 'Electronics',
    discount: '91%',
    currentPrice: '179',
    originalPrice: '1,899',
    href: '/deals/flash-wall-light',
  },
]
