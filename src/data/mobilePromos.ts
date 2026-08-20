import mobileHeroAjio from '../assets/mobile/mobile-hero-ajio.png'

export interface MobilePromo {
  id: string
  name: string
  image: string
  alt: string
  href: string
}

export const mobilePromos: MobilePromo[] = [
  {
    id: 'mobile-ajio-promo',
    name: 'AJIO',
    image: mobileHeroAjio,
    alt: 'AJIO rewards promotional banner',
    href: '/stores/ajio',
  },
]
