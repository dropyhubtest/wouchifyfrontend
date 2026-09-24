import flashLootLamp from '../assets/flash-loot/flash-loot-lamp.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import tataCliqLogo from '../assets/brand-logos/tata-cliq-logo.png'

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
  {
    id: 'flash-sony-headphones',
    slug: 'flash-sony-headphones',
    title: 'Sony WH-CH520 Wireless Bluetooth Headphones with Mic (50H Battery)',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    storeLogo: flipkartLogo,
    storeName: 'Flipkart',
    category: 'Electronics',
    discount: '74%',
    currentPrice: '1,299',
    originalPrice: '4,990',
    href: '/deals/flash-sony-headphones',
  },
  {
    id: 'flash-milton-kettle',
    slug: 'flash-milton-kettle',
    title: 'Milton Rapid 1.8L Stainless Steel Electric Kettle with Auto Cut-off',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    storeLogo: amazonLogo,
    storeName: 'Amazon',
    category: 'Home & Kitchen',
    discount: '60%',
    currentPrice: '604',
    originalPrice: '1,499',
    href: '/deals/flash-milton-kettle',
  },
  {
    id: 'flash-boat-rockerz',
    slug: 'flash-boat-rockerz',
    title: 'boAt Rockerz 450 Bluetooth On Ear Headphones with Mic',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    storeLogo: tataCliqLogo,
    storeName: 'Tata CLiQ',
    category: 'Electronics',
    discount: '77%',
    currentPrice: '899',
    originalPrice: '3,990',
    href: '/deals/flash-boat-rockerz',
  }
]
