import mobileHeroAjio from '../assets/mobile/mobile-hero-ajio.png'
import promoAmazon from '../assets/store-promos/store-promo-amazon.png'
import promoFlipkart from '../assets/store-promos/store-promo-flipkart.png'
import promoFirstcry from '../assets/store-promos/store-promo-firstcry.png'

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
    href: '/stores#ajio',
  },
  {
    id: 'mobile-amazon-promo',
    name: 'Amazon',
    image: promoAmazon,
    alt: 'Amazon deals promotional banner',
    href: '/stores#amazon',
  },
  {
    id: 'mobile-flipkart-promo',
    name: 'Flipkart',
    image: promoFlipkart,
    alt: 'Flipkart discounts promotional banner',
    href: '/stores#flipkart',
  },
  {
    id: 'mobile-firstcry-promo',
    name: 'FirstCry',
    image: promoFirstcry,
    alt: 'FirstCry rewards promotional banner',
    href: '/stores#firstcry',
  },
]
