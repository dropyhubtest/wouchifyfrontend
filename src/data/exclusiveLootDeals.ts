import exclusiveLootLamp from '../assets/exclusive-loot/exclusive-loot-lamp.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import tataCliqLogo from '../assets/brand-logos/tata-cliq-logo.png'

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
    id: 'exclusive-coffee-box',
    slug: 'exclusive-coffee-box',
    title: 'Free Sample Coffee Tasting Box (3 Exotic Flavours 150g)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    storeLogo: tataCliqLogo,
    storeName: 'Tata CLiQ',
    category: 'Food & Dining',
    discount: '100% FREE',
    currentPrice: '0',
    originalPrice: '499',
    href: '/deals/exclusive-coffee-box',
  },
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
  {
    id: 'exclusive-wildcraft-backpack',
    slug: 'exclusive-wildcraft-backpack',
    title: 'Wildcraft 45L Casual Waterproof Travel Backpack with Rain Cover',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    storeLogo: flipkartLogo,
    storeName: 'Flipkart',
    category: 'Travel & Luggage',
    discount: '63%',
    currentPrice: '1,299',
    originalPrice: '3,499',
    href: '/deals/exclusive-wildcraft-backpack',
  },
  {
    id: 'exclusive-philips-bulb',
    slug: 'exclusive-philips-bulb',
    title: 'Philips Smart Wi-Fi 9W LED Color Changing Bulb with App & Voice Control',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=80',
    storeLogo: amazonLogo,
    storeName: 'Amazon',
    category: 'Home & Kitchen',
    discount: '67%',
    currentPrice: '499',
    originalPrice: '1,499',
    href: '/deals/exclusive-philips-bulb',
  }
]
