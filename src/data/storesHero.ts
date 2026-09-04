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
  logoPanelBg?: string
  mobileCategory?: string
  mobileReward?: string
  mobileDescription?: string
  mobileBadgeBg?: string
  mobileLogoWidth?: number
  mobileLogoHeight?: number
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
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 5% rewards',
    mobileDescription: 'Trending/Fashion Collections',
    mobileLogoWidth: 71,
    mobileLogoHeight: 40,
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
    mobileCategory: 'E-COMMERCE',
    mobileReward: 'Upto 6.8% rewards',
    mobileDescription: '5000+ Live deals & Coupons',
    mobileLogoWidth: 81,
    mobileLogoHeight: 36,
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
    mobileCategory: 'GROCERIES',
    mobileReward: 'Upto 20% rewards',
    mobileDescription: 'Daily Fresh groceries',
    mobileLogoWidth: 64,
    mobileLogoHeight: 18,
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
    mobileCategory: 'KIDS FASHION',
    mobileReward: 'Upto 5% rewards',
    mobileDescription: 'Trending Fashion Collection',
    mobileLogoWidth: 61,
    mobileLogoHeight: 22,
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
    mobileCategory: 'E-COMMERCE',
    mobileReward: 'Upto 10% rewards',
    mobileDescription: 'Mega Savings Day',
    mobileLogoWidth: 66,
    mobileLogoHeight: 37,
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
    mobileCategory: 'GROCERY',
    mobileReward: 'Upto 5% rewards',
    mobileDescription: 'Everything on Discount',
    mobileLogoWidth: 46,
    mobileLogoHeight: 23,
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
    logoPanelBg: '#580A46',
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 20% off',
    mobileDescription: 'Mega Savings Day',
    mobileLogoWidth: 42,
    mobileLogoHeight: 24,
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
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Top Fashion Labels',
    mobileLogoWidth: 68,
    mobileLogoHeight: 38,
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
    mobileCategory: 'BEAUTY',
    mobileReward: 'Upto 5% rewards',
    mobileDescription: 'Beauty Bonanza',
    mobileLogoWidth: 58,
    mobileLogoHeight: 20,
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
    mobileCategory: 'E-COMMERCE',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Value Deals',
    mobileLogoWidth: 74,
    mobileLogoHeight: 16,
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
    mobileCategory: 'ELECTRONICS',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Value Deals',
    mobileLogoWidth: 72,
    mobileLogoHeight: 20,
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
    mobileCategory: 'E-COMMERCE',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Value Deals',
    mobileLogoWidth: 76,
    mobileLogoHeight: 19,
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
    mobileCategory: 'FOOD',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Craving Saver',
    mobileLogoWidth: 64,
    mobileLogoHeight: 36,
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
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Value Deals',
    mobileLogoWidth: 64,
    mobileLogoHeight: 36,
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
    mobileCategory: 'B2B',
    mobileReward: 'Upto 8% rewards',
    mobileDescription: 'Bulk Discounts',
    mobileLogoWidth: 68,
    mobileLogoHeight: 23,
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
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 15% off',
    mobileDescription: 'Women Fashion',
    mobileLogoWidth: 70,
    mobileLogoHeight: 41,
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
    mobileCategory: 'GROCERY',
    mobileReward: 'Flat ₹50 off',
    mobileDescription: '10 Minute Delivery',
    mobileLogoWidth: 71,
    mobileLogoHeight: 18,
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
    mobileCategory: 'FASHION',
    mobileReward: 'Flat ₹50 off',
    mobileDescription: '10 Minute Delivery',
    mobileLogoWidth: 69,
    mobileLogoHeight: 23,
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
    mobileCategory: 'FASHION',
    mobileReward: 'Upto 15% rewards',
    mobileDescription: 'Fashion Wear',
    mobileLogoWidth: 72,
    mobileLogoHeight: 24,
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
    mobileCategory: 'FOOD',
    mobileReward: 'Flat 50 off',
    mobileDescription: 'Food Delivery',
    mobileLogoWidth: 78,
    mobileLogoHeight: 44,
  },
]
