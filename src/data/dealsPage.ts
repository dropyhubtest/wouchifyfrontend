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
import relianceDigitalLogo from '../assets/brand-logos/reliance-digital-logo.png'
import snapdealLogo from '../assets/brand-logos/snapdeal-logo.png'
import swiggyLogo from '../assets/brand-logos/swiggy-logo.png'
import tataCliqLogo from '../assets/brand-logos/tata-cliq-logo.png'
import zeptoLogo from '../assets/brand-logos/zepto-logo.png'
import zivameLogo from '../assets/brand-logos/zivame-logo.png'
import zomatoLogo from '../assets/brand-logos/zomato-logo.png'

import deal1 from '../assets/deals/deal1.png'
import deal2 from '../assets/deals/deal2.png'

/* ==========================================================================
   Deals Hero Data
   ========================================================================== */

export interface DealsHeroData {
  badge: string
  heading: string
  subHeadingPill: string
  ctaText: string
  ctaHref: string
}

export const DEALS_HERO_DATA: DealsHeroData = {
  badge: 'Top Picks',
  heading: 'Best Deals Today!',
  subHeadingPill: 'All verified deals updated in real-time.',
  ctaText: 'Explore Deals Now!!',
  ctaHref: '#deals-favourite-stores',
}

/* ==========================================================================
   Filter Categories
   ========================================================================== */

export const DEALS_FILTER_CATEGORIES = [
  'Products',
  'Stores',
  'Brands',
  'Festivals',
  'Banks',
  'Cities',
  'Travel',
  'Trending',
] as const

/* ==========================================================================
   Favourite Stores Strip Data (Expanded Popular Store Cards with Discount Badges)
   ========================================================================== */

export interface DealsFavouriteStoreItem {
  id: string
  name: string
  slug: string
  logo: string
  discountBadge: string
  badgeBg?: string
  cardBg?: string
  logoScale?: number
  href: string
}

export const DEALS_FAVOURITE_STORES: DealsFavouriteStoreItem[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    slug: 'amazon',
    logo: amazonLogo,
    discountBadge: '80% off',
    badgeBg: '#D1E8FF',
    href: '/brands/amazon',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    slug: 'ajio',
    logo: ajioLogo,
    discountBadge: '30% off',
    badgeBg: '#D1E8FF',
    href: '/stores#ajio',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    logo: flipkartLogo,
    discountBadge: '15% off',
    badgeBg: '#D1E8FF',
    href: '/stores#flipkart',
  },
  {
    id: 'pepperfry',
    name: 'Pepperfry',
    slug: 'pepperfry',
    logo: pepperfryLogo,
    discountBadge: '15% off',
    badgeBg: '#D1E8FF',
    href: '/stores#pepperfry',
  },
  {
    id: 'bigbasket',
    name: 'Big Basket',
    slug: 'bigbasket',
    logo: bigbasketLogo,
    logoScale: 0.95,
    discountBadge: '60% off',
    badgeBg: '#D1E8FF',
    href: '/stores#bigbasket',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    slug: 'meesho',
    logo: meeshoLogo,
    cardBg: '#5B0C43',
    discountBadge: '22% off',
    badgeBg: '#D1E8FF',
    href: '/stores#meesho',
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    slug: 'nykaa',
    logo: nykaaLogo,
    logoScale: 0.95,
    discountBadge: '10% off',
    badgeBg: '#D1E8FF',
    href: '/stores#nykaa',
  },
  {
    id: 'myntra',
    name: 'Myntra',
    slug: 'myntra',
    logo: myntraLogo,
    discountBadge: '20% off',
    badgeBg: '#D1E8FF',
    href: '/stores#myntra',
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logo: swiggyLogo,
    discountBadge: '40% off',
    badgeBg: '#D1E8FF',
    href: '/stores#swiggy',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    slug: 'zomato',
    logo: zomatoLogo,
    discountBadge: '50% off',
    badgeBg: '#D1E8FF',
    href: '/stores#zomato',
  },
  {
    id: 'zepto',
    name: 'Zepto',
    slug: 'zepto',
    logo: zeptoLogo,
    discountBadge: '25% off',
    badgeBg: '#D1E8FF',
    href: '/stores#zepto',
  },
  {
    id: 'firstcry',
    name: 'FirstCry',
    slug: 'firstcry',
    logo: firstcryLogo,
    discountBadge: '35% off',
    badgeBg: '#D1E8FF',
    href: '/stores#firstcry',
  },
  {
    id: 'tata-cliq',
    name: 'Tata CLiQ',
    slug: 'tata-cliq',
    logo: tataCliqLogo,
    discountBadge: '45% off',
    badgeBg: '#D1E8FF',
    href: '/stores#tata-cliq',
  },
  {
    id: 'reliance-digital',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    logo: relianceDigitalLogo,
    discountBadge: '18% off',
    badgeBg: '#D1E8FF',
    href: '/stores#reliance-digital',
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    slug: 'jiomart',
    logo: jiomartLogo,
    logoScale: 1.3,
    discountBadge: '30% off',
    badgeBg: '#D1E8FF',
    href: '/stores#jiomart',
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    slug: 'snapdeal',
    logo: snapdealLogo,
    discountBadge: '55% off',
    badgeBg: '#D1E8FF',
    href: '/stores#snapdeal',
  },
  {
    id: 'zivame',
    name: 'Zivame',
    slug: 'zivame',
    logo: zivameLogo,
    discountBadge: '28% off',
    badgeBg: '#D1E8FF',
    href: '/stores#zivame',
  },
]

/* ==========================================================================
   Deal Card Items & Mapping Helpers
   ========================================================================== */

export interface DealCardItem {
  id: string
  title: string
  category: string
  store: string
  storeLogo: string
  productImage: string
  price: string
  originalPrice?: string
  discountPercentage?: string
  ctaText: string
  ctaHref: string
  dealTag?: string
  status?: string
  rating?: string
  isBestSelling?: boolean
  sectionPlacement?: 'favourite' | 'best_selling' | 'both'
}

export const STORE_LOGOS_MAP: Record<string, string> = {
  amazon: amazonLogo,
  flipkart: flipkartLogo,
  myntra: myntraLogo,
  ajio: ajioLogo,
  'big basket': bigbasketLogo,
  bigbasket: bigbasketLogo,
  nykaa: nykaaLogo,
  zepto: zeptoLogo,
  swiggy: swiggyLogo,
  zomato: zomatoLogo,
  pepperfry: pepperfryLogo,
  'reliance digital': relianceDigitalLogo,
  'tata cliq': tataCliqLogo,
  meesho: meeshoLogo,
  jiomart: jiomartLogo,
  snapdeal: snapdealLogo,
  firstcry: firstcryLogo,
  zivame: zivameLogo,
}

export function getStoreLogo(storeName?: string): string {
  if (!storeName) return amazonLogo
  const key = storeName.toLowerCase().trim()
  return STORE_LOGOS_MAP[key] || amazonLogo
}

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  // Match /file/d/<ID>
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`
  }
  // Match id=<ID>
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`
  }
  return trimmed
}

export const DEAL_PRODUCT_PRESETS = [
  { label: 'Xiaomi 55" 4K Smart TV', image: deal1 },
  { label: 'Milton 1.8L Electric Kettle', image: deal2 },
  { label: 'Smartwatch / Fitness Band', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { label: 'Wireless Noise Cancelling Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Running Sneaker Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Organic Groceries / Food Combo', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Beauty & Skincare Gift Box', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80' },
  { label: 'Smart Laptop / Tablet', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80' }
]

export function normalizeDealToCard(deal: any, index: number = 0): DealCardItem {
  const title = deal.name || deal.title || 'Special Promotional Deal'
  const store = deal.store || 'Amazon'
  const category = (deal.category || 'Electronics').toUpperCase()

  // Clean prices (keep numbers only for DealCard component layout)
  let rawPrice = String(deal.price || '999').replace(/[^0-9.]/g, '')
  if (!rawPrice) rawPrice = '999'

  let rawOrig = deal.originalPrice ? String(deal.originalPrice).replace(/[^0-9.]/g, '') : ''

  // Fallback image
  let prodImg = deal.productImage
  if (!prodImg) {
    if (index % 2 === 0) prodImg = deal1
    else prodImg = deal2
  } else {
    prodImg = convertGoogleDriveUrl(prodImg)
  }

  // Calculate discount if missing
  let discount = deal.discount || deal.discountPercentage
  if (!discount && rawOrig && Number(rawOrig) > Number(rawPrice)) {
    discount = `${Math.round(((Number(rawOrig) - Number(rawPrice)) / Number(rawOrig)) * 100)}% OFF`
  }

  const isBestSelling = Boolean(
    deal.isBestSelling ||
    deal.sectionPlacement === 'best_selling' ||
    deal.sectionPlacement === 'both' ||
    (deal.dealTag && deal.dealTag.toLowerCase().includes('best seller'))
  )

  return {
    id: String(deal._id || deal.id || `deal-${index}`),
    title,
    category,
    store,
    storeLogo: deal.storeLogo || getStoreLogo(store),
    productImage: prodImg,
    price: rawPrice,
    originalPrice: rawOrig || undefined,
    discountPercentage: discount || undefined,
    ctaText: deal.ctaText || 'GRAB DEAL',
    ctaHref: deal.ctaHref || `/stores#${store.toLowerCase().replace(/\s+/g, '-')}`,
    dealTag: deal.dealTag || 'Deal',
    status: deal.status || 'active',
    rating: deal.rating || '4.8',
    isBestSelling,
    sectionPlacement: deal.sectionPlacement || (isBestSelling ? 'best_selling' : 'favourite')
  }
}

export const DEALS_CARD_ITEMS: DealCardItem[] = [
  {
    id: 'deal-1',
    title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal1,
    price: '37998',
    originalPrice: '62999',
    discountPercentage: '40% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
  },
  {
    id: 'deal-2',
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable Electric..',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal2,
    price: '604',
    originalPrice: '1499',
    discountPercentage: '60% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
  },
]

export const BEST_SELLING_DEAL_ITEMS: DealCardItem[] = [
  {
    id: 'best-1',
    title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV L55MB-FPIN',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal1,
    price: '37998',
    originalPrice: '62999',
    discountPercentage: '40% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
  },
  {
    id: 'best-2',
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable Electric..',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal2,
    price: '604',
    originalPrice: '1499',
    discountPercentage: '60% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
  },
]
