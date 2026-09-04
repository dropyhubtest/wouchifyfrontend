import mobileFlashLampImg from '../assets/mobile/flash/mobile-flash-lamp.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'

export interface MobileFlashDealItem {
  id: string
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

export const MOBILE_FLASH_DEALS: MobileFlashDealItem[] = [
  {
    id: 'mobile-flash-wall-light',
    title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
    image: mobileFlashLampImg,
    storeLogo: amazonLogo,
    storeName: 'Amazon',
    category: 'Electronics',
    discount: '91%',
    currentPrice: '179',
    originalPrice: '1,899',
    href: '/deals/flash-wall-light',
  },
]
