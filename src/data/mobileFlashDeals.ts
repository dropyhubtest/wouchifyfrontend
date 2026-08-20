import mobileFlashWallLightImg from '../assets/mobile/flash/mobile-flash-wall-light.png'

export interface MobileFlashDealItem {
  id: string
  name: string
  image: string
  href: string
  alt: string
}

export const MOBILE_FLASH_DEALS: MobileFlashDealItem[] = [
  {
    id: 'mobile-flash-wall-light',
    name: 'Flash Wall Light Deal',
    image: mobileFlashWallLightImg,
    href: '/deals/flash-wall-light',
    alt: '91 percent off wall light flash deal',
  },
]
