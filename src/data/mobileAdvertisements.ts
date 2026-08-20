import saleBannerImg from '../assets/advertisement/image-7.png'

export interface MobileAdvertisementItem {
  id: string
  title: string
  image: string
  href: string
  alt: string
}

export const MOBILE_ADVERTISEMENTS: MobileAdvertisementItem[] = [
  {
    id: 'mobile-wouchify-sale',
    title: 'Wouchify Sale',
    image: saleBannerImg,
    href: '/offers/sale',
    alt: 'Wouchify sale banner',
  },
]
