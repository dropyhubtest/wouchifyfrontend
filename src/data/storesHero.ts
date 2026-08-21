import ajioLogo from '../assets/brand-logos/ajio-logo.png'
import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import bigbasketLogo from '../assets/brand-logos/bigbasket-logo.png'
import firstcryLogo from '../assets/brand-logos/firstcry-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import jiomartLogo from '../assets/brand-logos/jiomart-logo.png'
import meeshoLogo from '../assets/brand-logos/meesho-logo.png'
import myntraLogo from '../assets/brand-logos/myntra-logo.png'
import nykaaLogo from '../assets/brand-logos/nykaa-logo.png'
import pepperfryLogo from '../assets/brand-logos/pepperfry-logo.png'
import snapdealLogo from '../assets/brand-logos/snapdeal-logo.png'
import swiggyLogo from '../assets/brand-logos/swiggy-logo.png'
import relianceDigitalLogo from '../assets/brand-logos/reliance-digital-logo.png'
import tataCliqLogo from '../assets/brand-logos/tata-cliq-logo.png'
import udaanLogo from '../assets/brand-logos/udaan-logo.png'
import voonikLogo from '../assets/brand-logos/voonik-logo.png'
import yepmeLogo from '../assets/brand-logos/yepme-logo.png'
import zivameLogo from '../assets/brand-logos/zivame-logo.png'
import zeptoLogo from '../assets/brand-logos/zepto-logo.png'
import zomatoLogo from '../assets/brand-logos/zomato-logo.png'

/* ==========================================================================
   Stores Hero Data
   ========================================================================== */

export interface StoresHeroData {
  badge: string
  heading: string
  description: string
  ctaText: string
  ctaHref: string
}

export const STORES_HERO_DATA: StoresHeroData = {
  badge: 'Top Stores',
  heading: 'Shop at\n100+ Verified Stores',
  description: 'Exclusive coupons from all your\nfavourite Indian stores.',
  ctaText: 'Explore Stores Now!!',
  ctaHref: '/stores#favourite-stores',
}

/* ==========================================================================
   Favourite Stores Data
   ========================================================================== */

export interface StoreItem {
  id: string
  name: string
  slug: string
  logo: string
  category: string
  reward: string
  description: string
  cardBg: string
  badgeBg: string
}

export const STORE_CATEGORIES = [
  'All Stores',
  'B2B',
  'Beauty',
  'Electronics',
  'Fashion',
  'Food',
  'Grocery',
  'Home',
  'Other',
] as const

export const FAVOURITE_STORES: StoreItem[] = [
  {
    id: 'ajio',
    name: 'Ajio',
    slug: 'ajio',
    logo: ajioLogo,
    category: 'Fashion',
    reward: 'Upto 5% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#ECF4FF',
    badgeBg: '#D3E0F2',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    slug: 'amazon',
    logo: amazonLogo,
    category: 'Electronics',
    reward: 'Upto 6.8% rewards',
    description: '5000+ Live deals & Coupons',
    cardBg: '#FFE6D3',
    badgeBg: '#FFB67C',
  },
  {
    id: 'bigbasket',
    name: 'Big Basket',
    slug: 'bigbasket',
    logo: bigbasketLogo,
    category: 'Grocery',
    reward: 'Upto 20% off',
    description: 'Trending fashion Collections',
    cardBg: '#EFFFBF',
    badgeBg: '#D1F170',
  },
  {
    id: 'firstcry',
    name: 'Firstcry',
    slug: 'firstcry',
    logo: firstcryLogo,
    category: 'Fashion',
    reward: 'Upto 5% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFEDF8',
    badgeBg: '#FCA7E1',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    logo: flipkartLogo,
    category: 'Fashion',
    reward: 'Upto 15% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#E8F5FF',
    badgeBg: '#B3DCFA',
  },
  {
    id: 'jiomart',
    name: 'Jio Mart',
    slug: 'jiomart',
    logo: jiomartLogo,
    category: 'Grocery',
    reward: 'Upto 15% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFDCDE',
    badgeBg: '#FFB0B4',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    slug: 'meesho',
    logo: meeshoLogo,
    category: 'Fashion',
    reward: 'Upto 20% off',
    description: 'Trending fashion Collections',
    cardBg: '#FFE3F9',
    badgeBg: '#FFB0EA',
  },
  {
    id: 'myntra',
    name: 'Myntra',
    slug: 'myntra',
    logo: myntraLogo,
    category: 'Fashion',
    reward: 'Upto 6.8% rewards',
    description: '5000+ Live deals & Coupons',
    cardBg: '#E8F5FF',
    badgeBg: '#B3DCFA',
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    slug: 'nykaa',
    logo: nykaaLogo,
    category: 'Beauty',
    reward: 'Upto 6% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFD9E8',
    badgeBg: '#FFB0C8',
  },
  {
    id: 'pepperfry',
    name: 'Pepperfry',
    slug: 'pepperfry',
    logo: pepperfryLogo,
    category: 'Home',
    reward: 'Upto 15% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFDED9',
    badgeBg: '#FFB5AB',
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    slug: 'snapdeal',
    logo: snapdealLogo,
    category: 'Electronics',
    reward: 'Upto 6.8% rewards',
    description: '5000+ Live deals & Coupons',
    cardBg: '#E8F5FF',
    badgeBg: '#B3DCFA',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logo: swiggyLogo,
    category: 'Food',
    reward: 'Upto 20% off',
    description: 'Trending fashion Collections',
    cardBg: '#FFF0BF',
    badgeBg: '#FFE07A',
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    logo: relianceDigitalLogo,
    category: 'Electronics',
    reward: 'Upto 20% off',
    description: 'Trending fashion Collections',
    cardBg: '#DFF4FF',
    badgeBg: '#A8E0FF',
  },
  {
    id: 'tata-cliq',
    name: 'Tata Cliq',
    slug: 'tata-cliq',
    logo: tataCliqLogo,
    category: 'Fashion',
    reward: 'Upto 9.2% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#E7D2D7',
    badgeBg: '#D4B0B9',
  },
  {
    id: 'udaan',
    name: 'Udaan',
    slug: 'udaan',
    logo: udaanLogo,
    category: 'B2B',
    reward: 'Upto 9% rewards',
    description: 'Bulk Discounts',
    cardBg: '#FFE7E8',
    badgeBg: '#FFC0C2',
  },
  {
    id: 'voonik',
    name: 'Voonik',
    slug: 'voonik',
    logo: voonikLogo,
    category: 'Fashion',
    reward: 'Upto 15% off',
    description: 'Trending fashion Collections',
    cardBg: '#D5D3D7',
    badgeBg: '#B8B5BC',
  },
  {
    id: 'yepme',
    name: 'Yep Me',
    slug: 'yepme',
    logo: yepmeLogo,
    category: 'Grocery',
    reward: 'Upto 20% off',
    description: 'Trending fashion Collections',
    cardBg: '#DFF4FF',
    badgeBg: '#A8E0FF',
  },
  {
    id: 'zivame',
    name: 'Zivame',
    slug: 'zivame',
    logo: zivameLogo,
    category: 'Fashion',
    reward: 'Upto 15% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFCFC8',
    badgeBg: '#FFA89D',
  },
  {
    id: 'zepto',
    name: 'Zepto',
    slug: 'zepto',
    logo: zeptoLogo,
    category: 'Food',
    reward: 'Upto 9% rewards',
    description: '5000+ Live deals & Coupons',
    cardBg: '#F0D3FF',
    badgeBg: '#DCA8FF',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    slug: 'zomato',
    logo: zomatoLogo,
    category: 'Food',
    reward: 'Upto 15% rewards',
    description: 'Trending fashion Collections',
    cardBg: '#FFD5E1',
    badgeBg: '#FFAAC0',
  },
]
