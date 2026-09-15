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
import udaanLogo from '../assets/brand-logos/udaan-logo.png'
import voonikLogo from '../assets/brand-logos/voonik-logo.png'
import yepmeLogo from '../assets/brand-logos/yepme-logo.png'
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
  firstcry: firstcryLogo,
  'first cry': firstcryLogo,
  jiomart: jiomartLogo,
  'jio mart': jiomartLogo,
  meesho: meeshoLogo,
  nykaa: nykaaLogo,
  pepperfry: pepperfryLogo,
  'reliance digital': relianceDigitalLogo,
  'reliance-digital': relianceDigitalLogo,
  reliance: relianceDigitalLogo,
  snapdeal: snapdealLogo,
  swiggy: swiggyLogo,
  'tata cliq': tataCliqLogo,
  'tata-cliq': tataCliqLogo,
  tatacliq: tataCliqLogo,
  udaan: udaanLogo,
  voonik: voonikLogo,
  yepme: yepmeLogo,
  'yep me': yepmeLogo,
  zepto: zeptoLogo,
  zivame: zivameLogo,
  zomato: zomatoLogo,
}

export const PLACEHOLDER_DEAL_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23f1f5f9"><rect width="100" height="100" rx="12" fill="%23f1f5f9"/><path d="M30 65l12-16 10 12 14-18 16 22H30z" fill="%23cbd5e1"/><circle cx="42" cy="38" r="6" fill="%23cbd5e1"/><text x="50%25" y="88%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="600" fill="%2394a3b8">WOUCHIFY</text></svg>`

export const PLACEHOLDER_STORE_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="30" viewBox="0 0 80 30" fill="%23ffffff"><rect width="80" height="30" rx="4" fill="%23f8fafc" stroke="%23e2e8f0"/><text x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2364748b">STORE</text></svg>`

export function getStoreLogo(storeName?: string): string {
  if (!storeName) return amazonLogo
  const key = storeName.toLowerCase().trim().replace(/[-_]/g, ' ')
  const keySlug = storeName.toLowerCase().trim()
  return STORE_LOGOS_MAP[key] || STORE_LOGOS_MAP[keySlug] || amazonLogo
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

export function normalizeLootToCard(loot: any, index: number = 0): DealCardItem {
  const store = loot.storeName || loot.store || 'Amazon'
  let prodImg = loot.image || loot.productImage
  if (!prodImg) {
    prodImg = index % 2 === 0 ? deal1 : deal2
  } else {
    prodImg = convertGoogleDriveUrl(prodImg)
  }
  const isBestSelling = Boolean(
    loot.isBestSelling ||
    loot.sectionPlacement === 'best_selling' ||
    loot.sectionPlacement === 'both' ||
    (loot.badge && loot.badge.toLowerCase().includes('best seller'))
  )
  return {
    id: String(loot._id || loot.id || `loot-${index}`),
    title: loot.title || loot.name || 'Special Promotional Loot Deal',
    category: (loot.category || 'Electronics').toUpperCase(),
    store: store,
    storeLogo: loot.storeLogo || getStoreLogo(store),
    productImage: prodImg,
    price: String(loot.currentPrice || loot.price || '179').replace(/[^0-9.]/g, ''),
    originalPrice: loot.originalPrice ? String(loot.originalPrice).replace(/[^0-9.]/g, '') : undefined,
    discountPercentage: loot.discount || loot.discountLabel || '80% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: loot.href || loot.link || `/stores#${store.toLowerCase().replace(/\s+/g, '-')}`,
    dealTag: loot.badge || 'Loot Deal',
    status: loot.status || 'active',
    rating: loot.rating || '4.8',
    isBestSelling,
    sectionPlacement: loot.sectionPlacement || (isBestSelling ? 'best_selling' : 'favourite')
  }
}

export const DEALS_CARD_ITEMS: DealCardItem[] = [
  {
    id: 'deal-1',
    title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal1,
    price: '37998',
    originalPrice: '62999',
    discountPercentage: '40% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
    dealTag: 'Hot Deal',
    status: 'active',
    rating: '4.5',
    isBestSelling: true,
    sectionPlacement: 'both'
  },
  {
    id: 'deal-2',
    title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    price: '119900',
    originalPrice: '134900',
    discountPercentage: '11% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
    dealTag: 'Best Seller',
    status: 'active',
    rating: '4.9',
    isBestSelling: true,
    sectionPlacement: 'both'
  },
  {
    id: 'deal-3',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'ELECTRONICS',
    store: 'Flipkart',
    storeLogo: flipkartLogo,
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    price: '26990',
    originalPrice: '34990',
    discountPercentage: '23% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#flipkart',
    dealTag: 'Top Audio Deal',
    status: 'active',
    rating: '4.8',
    isBestSelling: true,
    sectionPlacement: 'both'
  },
  {
    id: 'deal-4',
    title: 'Milton Rapid 1.8L Stainless Steel Electric Kettle',
    category: 'HOME & LIFESTYLE',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: deal2,
    price: '604',
    originalPrice: '1499',
    discountPercentage: '60% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
    dealTag: 'Flash Price Drop',
    status: 'active',
    rating: '4.4',
    isBestSelling: true,
    sectionPlacement: 'both'
  },
  {
    id: 'deal-5',
    title: 'Nike Air Max Men Lightweight Running Sneaker Shoes',
    category: 'FASHION & APPAREL',
    store: 'Myntra',
    storeLogo: myntraLogo,
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    price: '5499',
    originalPrice: '9995',
    discountPercentage: '45% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#myntra',
    dealTag: 'Myntra Exclusive',
    status: 'active',
    rating: '4.7',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-6',
    title: 'LEGO Batman Batmobile 1989 Collectors Edition',
    category: 'HOME & LIFESTYLE',
    store: 'Zepto',
    storeLogo: zeptoLogo,
    productImage: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80',
    price: '6999',
    originalPrice: '8499',
    discountPercentage: '18% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#zepto',
    dealTag: '10-Min Delivery',
    status: 'active',
    rating: '4.9',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-7',
    title: 'Nykaa Luxe MAC & Clinique Skincare Essentials Combo Box',
    category: 'BEAUTY & WELLNESS',
    store: 'Nykaa',
    storeLogo: nykaaLogo,
    productImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    price: '1890',
    originalPrice: '3500',
    discountPercentage: '46% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#nykaa',
    dealTag: 'Festive Glam',
    status: 'active',
    rating: '4.8',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-8',
    title: 'Fresh Organic Produce & Seasonal Fruits Combo Pack (5kg)',
    category: 'QUICK GROCERY',
    store: 'Big Basket',
    storeLogo: bigbasketLogo,
    productImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    price: '399',
    originalPrice: '650',
    discountPercentage: '38% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#big-basket',
    dealTag: 'Daily Saver',
    status: 'active',
    rating: '4.6',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-9',
    title: 'Samsung 108 cm (43 inch) Crystal 4K Dynamic UHD Smart TV',
    category: 'ELECTRONICS',
    store: 'Flipkart',
    storeLogo: flipkartLogo,
    productImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    price: '28990',
    originalPrice: '44900',
    discountPercentage: '35% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#flipkart',
    dealTag: 'Bestseller TV',
    status: 'active',
    rating: '4.6',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-10',
    title: 'OnePlus 12R 5G (16GB RAM, 256GB Storage, Cool Blue)',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    price: '39999',
    originalPrice: '45999',
    discountPercentage: '13% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
    dealTag: 'Flagship Killer',
    status: 'active',
    rating: '4.7',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-11',
    title: 'Puma Smashic Unisex Lifestyle Casual Sneakers',
    category: 'FASHION & APPAREL',
    store: 'Ajio',
    storeLogo: ajioLogo,
    productImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    price: '1749',
    originalPrice: '3999',
    discountPercentage: '56% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#ajio',
    dealTag: 'Huge 56% Drop',
    status: 'active',
    rating: '4.5',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  },
  {
    id: 'deal-12',
    title: 'Boat Airdopes 141 ANC TWS Earbuds with 42H Playtime',
    category: 'ELECTRONICS',
    store: 'Amazon',
    storeLogo: amazonLogo,
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    price: '1299',
    originalPrice: '4490',
    discountPercentage: '71% OFF',
    ctaText: 'GRAB DEAL',
    ctaHref: '/stores#amazon',
    dealTag: 'Steal Deal',
    status: 'active',
    rating: '4.3',
    isBestSelling: false,
    sectionPlacement: 'favourite'
  }
]

export const BEST_SELLING_DEAL_ITEMS: DealCardItem[] = DEALS_CARD_ITEMS.filter(d => Boolean(d.isBestSelling))

/* ==========================================================================
   Master Executive Deals (Unified 16-Deal Dataset: 12 Active + 2 Expired + 2 Pending)
   ========================================================================== */

export interface MasterDealItem {
  id: string
  title: string
  store: string
  brand: string
  category: string
  subCategory?: string
  asinOrSku?: string
  type: 'deal' | 'loot' | 'flash' | 'daily'
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Expired'
  priority: 'Normal' | 'High' | 'Critical'
  badge: string
  code: string
  link: string
  originalPrice: string
  price: string
  discountLabel: string
  discountValue: number
  bankOffer?: string
  effectivePrice?: string
  cashback?: string
  stockStatus?: 'In Stock' | 'Limited Stock' | 'Lightning Deal (85% Claimed)' | 'Out of Stock'
  rating?: string
  deliveryInfo?: string
  warranty?: string
  variantNote?: string
  howToClaim?: string
  highlights?: string[]
  isFeatured?: boolean
  isVerified?: boolean
  isBestSelling?: boolean
  sectionPlacement?: 'favourite' | 'best_selling' | 'both'
  postedAt: string
  expiresAt: string
  description: string
  terms?: string
  image: string
  images: string[]
  clicks?: number
}

export const MASTER_EXECUTIVE_DEALS: MasterDealItem[] = [
  {
    id: 'deal-1',
    title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV',
    store: 'Amazon',
    brand: 'Xiaomi',
    category: 'Electronics',
    subCategory: 'Smart Televisions',
    asinOrSku: 'B0CHX1W1XY',
    type: 'deal',
    status: 'Approved',
    priority: 'High',
    badge: 'Hot Deal',
    code: 'XIAOMI1500',
    link: '/stores#amazon',
    originalPrice: '₹62,999',
    price: '₹37,998',
    discountLabel: '40% OFF',
    discountValue: 40,
    bankOffer: 'Flat ₹1,500 Instant Discount on HDFC Credit Cards',
    effectivePrice: '₹36,498',
    cashback: '+ 5% Wouchify Cashback',
    stockStatus: 'In Stock',
    rating: '4.5 ★ (14.2k)',
    deliveryInfo: 'Prime 1-Day Delivery',
    warranty: '2 Years Comprehensive Brand Warranty',
    variantNote: '55-inch QLED 4K Display',
    howToClaim: 'Click Grab Deal, apply coupon on product page, and checkout using HDFC card for extra discount.',
    highlights: ['Quantum Dot 4K Display with Dolby Vision', 'Fire TV OS with Alexa Voice Remote', '30W Dolby Audio Speakers'],
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    postedAt: 'Today, 10:30 AM',
    expiresAt: '2026-11-30T23:59:59.000Z',
    description: 'Experience cinema-grade entertainment with 4K QLED clarity and vibrant Dolby Vision colours.',
    terms: 'Valid on online prepaid orders. Limited period promotional offer.',
    image: deal1,
    images: [deal1],
    clicks: 1420
  },
  {
    id: 'deal-2',
    title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
    store: 'Amazon',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Flagship Smartphones',
    asinOrSku: 'B0DGHX8811',
    type: 'deal',
    status: 'Approved',
    priority: 'Critical',
    badge: 'Best Seller',
    code: 'IPHONE5K',
    link: '/stores#amazon',
    originalPrice: '₹1,34,900',
    price: '₹1,19,900',
    discountLabel: '11% OFF',
    discountValue: 11,
    bankOffer: '₹5,000 Instant Cashback on ICICI Bank Cards',
    effectivePrice: '₹1,14,900',
    cashback: '+ ₹1,200 Wouchify Cash',
    stockStatus: 'Limited Stock',
    rating: '4.9 ★ (32.8k)',
    deliveryInfo: 'Free Express Delivery',
    warranty: '1 Year Apple India Warranty',
    variantNote: 'Natural Titanium 128GB',
    howToClaim: 'Click Grab Deal, select ICICI Bank credit card at checkout to get ₹5,000 instant discount.',
    highlights: ['A18 Pro Chip with 6-core GPU', 'Camera Control Button & 48MP Fusion Camera', 'Grade 5 Titanium Design'],
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    postedAt: 'Today, 11:15 AM',
    expiresAt: '2026-12-15T23:59:59.000Z',
    description: 'The ultimate iPhone with pro camera system, A18 Pro silicon, and titanium enclosure.',
    terms: 'Offer valid till stocks last. Maximum 1 unit per customer.',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'],
    clicks: 2890
  },
  {
    id: 'deal-3',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    store: 'Flipkart',
    brand: 'Sony',
    category: 'Electronics',
    subCategory: 'Premium Audio',
    asinOrSku: 'FSNSON8921',
    type: 'deal',
    status: 'Approved',
    priority: 'High',
    badge: 'Top Audio Deal',
    code: 'SONYANC20',
    link: '/stores#flipkart',
    originalPrice: '₹34,990',
    price: '₹26,990',
    discountLabel: '23% OFF',
    discountValue: 23,
    bankOffer: '10% Instant Discount up to ₹2,000 on SBI Cards',
    effectivePrice: '₹24,990',
    cashback: '+ ₹500 Wouchify Cash',
    stockStatus: 'In Stock',
    rating: '4.8 ★ (18.6k)',
    deliveryInfo: 'Next Day Delivery',
    warranty: '1 Year Official Sony India Warranty',
    variantNote: 'Silver & Midnight Black Available',
    howToClaim: 'Collect deal on Flipkart and pay with SBI Credit Card for maximum savings.',
    highlights: ['Industry-leading Active Noise Cancellation', '30-Hour Battery Life with Quick Charge', 'Speak-to-Chat & Multipoint Connection'],
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    postedAt: 'Today, 09:45 AM',
    expiresAt: '2026-12-10T23:59:59.000Z',
    description: 'Industry leading noise cancellation with two processors and 8 microphones for flawless audio clarity.',
    terms: 'Valid on Flipkart partner seller transactions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    clicks: 1980
  },
  {
    id: 'deal-4',
    title: 'Milton Rapid 1.8L Stainless Steel Electric Kettle',
    store: 'Amazon',
    brand: 'Milton',
    category: 'Home & Lifestyle',
    subCategory: 'Kitchen Appliances',
    asinOrSku: 'B089XYZ332',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Flash Price Drop',
    code: 'KETTLE60',
    link: '/stores#amazon',
    originalPrice: '₹1,499',
    price: '₹604',
    discountLabel: '60% OFF',
    discountValue: 60,
    bankOffer: 'Extra 5% off with Amazon Pay ICICI Card',
    effectivePrice: '₹574',
    cashback: '+ 5% Cashback',
    stockStatus: 'In Stock',
    rating: '4.4 ★ (28.4k)',
    deliveryInfo: 'Free Delivery',
    warranty: '1 Year Milton Warranty',
    variantNote: '1.8 Litre Stainless Steel 1500W',
    howToClaim: 'Click Grab Deal and add to cart on Amazon with 60% instant price drop.',
    highlights: ['1500 Watts Fast Boiling Technology', 'Automatic Cut-off & Boil-Dry Protection', '360-Degree Swivel Base'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    postedAt: 'Today, 08:20 AM',
    expiresAt: '2026-11-25T23:59:59.000Z',
    description: 'Fast-boiling durable 1.8L stainless steel electric kettle perfect for tea, coffee, and noodles.',
    terms: 'Applicable on 1.8L classic metallic variant.',
    image: deal2,
    images: [deal2],
    clicks: 1530
  },
  {
    id: 'deal-5',
    title: 'Nike Air Max Men Lightweight Running Sneaker Shoes',
    store: 'Myntra',
    brand: 'Nike',
    category: 'Fashion & Apparel',
    subCategory: "Men's Footwear",
    asinOrSku: 'MYNNIK8812',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Myntra Exclusive',
    code: 'NIKE45',
    link: '/stores#myntra',
    originalPrice: '₹9,995',
    price: '₹5,499',
    discountLabel: '45% OFF',
    discountValue: 45,
    bankOffer: '10% Instant Off on Axis Bank Credit Cards',
    effectivePrice: '₹4,949',
    cashback: '+ 8% Wouchify Cashback',
    stockStatus: 'In Stock',
    rating: '4.7 ★ (9.3k)',
    deliveryInfo: 'Free Shipping & 14-Day Returns',
    warranty: '6 Months Brand Warranty',
    variantNote: 'Sizes UK 6 to 11 Available',
    howToClaim: 'Use coupon NIKE45 on Myntra checkout page.',
    highlights: ['Max Air Cushioning Unit in Heel', 'Breathable Mesh Upper', 'Durable Traction Rubber Outsole'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Yesterday, 06:40 PM',
    expiresAt: '2026-12-05T23:59:59.000Z',
    description: 'Iconic Air Max comfort designed for daily jogging, marathon training, and street style.',
    terms: 'Sizes subject to availability.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    clicks: 1120
  },
  {
    id: 'deal-6',
    title: 'LEGO Batman Batmobile 1989 Collectors Edition',
    store: 'Zepto',
    brand: 'LEGO',
    category: 'Home & Lifestyle',
    subCategory: 'Collectibles & Toys',
    asinOrSku: 'ZEPLEG9910',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: '10-Min Delivery',
    code: 'BATMAN18',
    link: '/stores#zepto',
    originalPrice: '₹8,499',
    price: '₹6,999',
    discountLabel: '18% OFF',
    discountValue: 18,
    bankOffer: '₹500 Instant Cashback via Simpl Pay Later',
    effectivePrice: '₹6,499',
    cashback: '+ ₹200 Wallet Cash',
    stockStatus: 'Limited Stock',
    rating: '4.9 ★ (4.8k)',
    deliveryInfo: '10-Min Flash Delivery',
    warranty: '100% Genuine Certified LEGO Set',
    variantNote: 'Includes 3 Exclusive Minifigures',
    howToClaim: 'Order via Zepto for instant 10-minute doorstep delivery.',
    highlights: ['3,306 Authentic LEGO Pieces', 'Slide-open Cockpit & Concealed Machine Guns', 'Rotating Display Turntable Base'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Yesterday, 03:15 PM',
    expiresAt: '2026-11-28T23:59:59.000Z',
    description: 'Faithful brick replica of the classic Batmobile from Tim Burton\'s 1989 movie.',
    terms: 'Limited quantities available per zone.',
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80'],
    clicks: 890
  },
  {
    id: 'deal-7',
    title: 'Nykaa Luxe MAC & Clinique Skincare Essentials Combo Box',
    store: 'Nykaa',
    brand: 'Nykaa Luxe',
    category: 'Beauty & Wellness',
    subCategory: 'Luxury Beauty',
    asinOrSku: 'NYKMAC3340',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Festive Glam',
    code: 'NYKAALUXE',
    link: '/stores#nykaa',
    originalPrice: '₹3,500',
    price: '₹1,890',
    discountLabel: '46% OFF',
    discountValue: 46,
    bankOffer: '15% Instant Off on HDFC Credit Cards',
    effectivePrice: '₹1,606',
    cashback: '+ 6% Wouchify Cashback',
    stockStatus: 'In Stock',
    rating: '4.8 ★ (12.1k)',
    deliveryInfo: 'Express Delivery in 2 Days',
    warranty: '100% Authentic & Fresh Batch Guaranteed',
    variantNote: 'Combo includes 4 Full-size Skincare Essentials',
    howToClaim: 'Apply code NYKAALUXE during checkout on Nykaa app or website.',
    highlights: ['MAC Prep+Prime + Clinique Moisture Surge 50ml', 'Dermatologist Tested & Non-comedogenic', 'Complimentary Luxury Velvet Pouch'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 14, 2026, 05:30 PM',
    expiresAt: '2026-12-01T23:59:59.000Z',
    description: 'Curated luxury skincare package designed for deep hydration and radiant glow.',
    terms: 'Free shipping on orders above ₹499.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80'],
    clicks: 1340
  },
  {
    id: 'deal-8',
    title: 'Fresh Organic Produce & Seasonal Fruits Combo Pack (5kg)',
    store: 'Big Basket',
    brand: 'Fresho',
    category: 'Quick Grocery',
    subCategory: 'Organic Staples',
    asinOrSku: 'BBORG7711',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Daily Saver',
    code: 'BBORGANIC',
    link: '/stores#big-basket',
    originalPrice: '₹650',
    price: '₹399',
    discountLabel: '38% OFF',
    discountValue: 38,
    bankOffer: 'Flat ₹50 Cashback on Paytm UPI',
    effectivePrice: '₹349',
    cashback: '+ 5% BB Wallet Cash',
    stockStatus: 'In Stock',
    rating: '4.6 ★ (15.7k)',
    deliveryInfo: 'Next Morning 7 AM Slot',
    warranty: '100% Freshness Guarantee or Instant Return',
    variantNote: '5kg Farm Assorted Organic Box',
    howToClaim: 'Order on BigBasket before 11 PM for morning fresh harvest delivery.',
    highlights: ['Directly Sourced from Certified Organic Farms', 'Zero Pesticides & Naturally Ripened', 'Eco-friendly Recyclable Box Packaging'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 14, 2026, 02:15 PM',
    expiresAt: '2026-11-20T23:59:59.000Z',
    description: 'Handpicked organic vegetables and seasonal fruits delivered fresh at dawn.',
    terms: 'Delivery slots subject to pincode availability.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
    clicks: 960
  },
  {
    id: 'deal-9',
    title: 'Samsung 108 cm (43 inch) Crystal 4K Dynamic UHD Smart TV',
    store: 'Flipkart',
    brand: 'Samsung',
    category: 'Electronics',
    subCategory: 'Smart Televisions',
    asinOrSku: 'FSNSAM43K99',
    type: 'deal',
    status: 'Approved',
    priority: 'High',
    badge: 'Bestseller TV',
    code: 'SAMSUNCTV2K',
    link: '/stores#flipkart',
    originalPrice: '₹44,900',
    price: '₹28,990',
    discountLabel: '35% OFF',
    discountValue: 35,
    bankOffer: '₹2,000 Instant Discount on ICICI Bank Cards',
    effectivePrice: '₹26,990',
    cashback: '+ ₹600 Wouchify Cash',
    stockStatus: 'In Stock',
    rating: '4.6 ★ (21.3k)',
    deliveryInfo: 'Free Standard Delivery & Installation',
    warranty: '3 Years Comprehensive Warranty',
    variantNote: 'Crystal 4K Processor with OTS Lite Audio',
    howToClaim: 'Collect instant Flipkart coupon and checkout with ICICI bank card.',
    highlights: ['PurColor & Dynamic Crystal Color', 'Q-Symphony Audio Integration', 'Smart Hub & SolarCell Remote'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 14, 2026, 11:00 AM',
    expiresAt: '2026-12-20T23:59:59.000Z',
    description: 'Crystal clear 4K visuals with lifelike colors and bezel-less minimalist design.',
    terms: 'Standard wall-mount installation free within 48 hours.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80'],
    clicks: 1750
  },
  {
    id: 'deal-10',
    title: 'OnePlus 12R 5G (16GB RAM, 256GB Storage, Cool Blue)',
    store: 'Amazon',
    brand: 'OnePlus',
    category: 'Electronics',
    subCategory: 'Flagship Smartphones',
    asinOrSku: 'B0CQPPY21W',
    type: 'deal',
    status: 'Approved',
    priority: 'High',
    badge: 'Flagship Killer',
    code: '1PLUS12R',
    link: '/stores#amazon',
    originalPrice: '₹45,999',
    price: '₹39,999',
    discountLabel: '13% OFF',
    discountValue: 13,
    bankOffer: 'Flat ₹2,250 Instant Discount on OneCard',
    effectivePrice: '₹37,749',
    cashback: '+ ₹800 Wouchify Cash',
    stockStatus: 'In Stock',
    rating: '4.7 ★ (16.9k)',
    deliveryInfo: 'Prime 1-Day Delivery',
    warranty: '1 Year OnePlus Manufacturer Warranty',
    variantNote: '16GB RAM + 256GB Cool Blue',
    howToClaim: 'Click Grab Deal and apply OneCard instant discount at payment selection.',
    highlights: ['Snapdragon 8 Gen 2 Flagship Processor', '100W SUPERVOOC Fast Charge & 5500mAh Battery', '120Hz ProXDR Display with LTPO 4.0'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 14, 2026, 09:30 AM',
    expiresAt: '2026-12-18T23:59:59.000Z',
    description: 'Powerhouse performance with cutting-edge cooling and flagship dual cryo-velocity system.',
    terms: 'Maximum 1 unit per customer account.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'],
    clicks: 2150
  },
  {
    id: 'deal-11',
    title: 'Puma Smashic Unisex Lifestyle Casual Sneakers',
    store: 'Ajio',
    brand: 'Puma',
    category: 'Fashion & Apparel',
    subCategory: 'Casual Footwear',
    asinOrSku: 'AJIPUM7712',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Huge 56% Drop',
    code: 'PUMA56',
    link: '/stores#ajio',
    originalPrice: '₹3,999',
    price: '₹1,749',
    discountLabel: '56% OFF',
    discountValue: 56,
    bankOffer: 'Extra ₹200 Off on prepaid orders via Mobikwik',
    effectivePrice: '₹1,549',
    cashback: '+ 7% Wouchify Rewards',
    stockStatus: 'In Stock',
    rating: '4.5 ★ (7.8k)',
    deliveryInfo: 'Standard Delivery in 3-4 Days',
    warranty: '3 Months Brand Warranty',
    variantNote: 'White/Black Classic Contrast',
    howToClaim: 'Apply coupon PUMA56 on Ajio cart.',
    highlights: ['SoftFoam+ Comfort Sockliner', 'Clean Court Silhouette with Puma Formstrip', 'Durable Rubber Cupsole'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 13, 2026, 07:15 PM',
    expiresAt: '2026-12-12T23:59:59.000Z',
    description: 'Timeless tennis-inspired sneaker engineered for all-day comfort and versatile styling.',
    terms: 'Standard return policy applies.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'],
    clicks: 1040
  },
  {
    id: 'deal-12',
    title: 'Boat Airdopes 141 ANC TWS Earbuds with 42H Playtime',
    store: 'Amazon',
    brand: 'Boat',
    category: 'Electronics',
    subCategory: 'Wireless Audio & TWS',
    asinOrSku: 'B09N3ZNHTY',
    type: 'deal',
    status: 'Approved',
    priority: 'Normal',
    badge: 'Steal Deal',
    code: 'BOATANC100',
    link: '/stores#amazon',
    originalPrice: '₹4,490',
    price: '₹1,299',
    discountLabel: '71% OFF',
    discountValue: 71,
    bankOffer: 'Flat ₹100 Cashback with Amazon Pay UPI',
    effectivePrice: '₹1,199',
    cashback: '+ ₹100 Wouchify Cashback',
    stockStatus: 'In Stock',
    rating: '4.3 ★ (45.2k)',
    deliveryInfo: 'Prime Same-Day Delivery',
    warranty: '1 Year Replacement Warranty',
    variantNote: 'Active Noise Cancellation up to 32dB',
    howToClaim: 'Click Grab Deal on Amazon, clip ₹100 coupon on page.',
    highlights: ['32dB Active Noise Cancellation', 'ENx Quad Mics for Crystal Clear Calls', 'ASAP Charge (10 mins = 150 mins playtime)'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Sep 13, 2026, 04:30 PM',
    expiresAt: '2026-11-28T23:59:59.000Z',
    description: 'Immersive sound with 32dB active noise cancellation and monster battery endurance.',
    terms: 'Valid on select color variants.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'],
    clicks: 3120
  },
  {
    id: 'deal-13',
    title: 'Zomato Gold 3-Month Membership 50% Off Flash Promo',
    store: 'Zomato',
    brand: 'Zomato',
    category: 'Food & Dining',
    subCategory: 'Dining Memberships',
    asinOrSku: 'ZOMGLD9901',
    type: 'flash',
    status: 'Expired',
    priority: 'Normal',
    badge: 'Offer Expired',
    code: 'GOLD50',
    link: '/stores#zomato',
    originalPrice: '₹999',
    price: '₹499',
    discountLabel: '50% OFF',
    discountValue: 50,
    bankOffer: 'Free Delivery with Gold membership',
    effectivePrice: '₹499',
    cashback: '+ ₹50 Zomato Cash',
    stockStatus: 'Out of Stock',
    rating: '4.2 ★ (8.9k)',
    deliveryInfo: 'Instant Activation',
    warranty: '3-Month Plan Duration',
    variantNote: '3-Month All-India Plan',
    howToClaim: 'Offer closed on Aug 15, 2026.',
    highlights: ['Free Delivery on orders above ₹199', 'Up to 40% Off on dining out', 'VIP Customer Support'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Aug 1, 2026, 10:00 AM',
    expiresAt: '2026-08-15T23:59:59.000Z',
    description: 'Unlimited free delivery and exclusive dining discounts at 10,000+ top partner restaurants.',
    terms: 'This promotional campaign has ended.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'],
    clicks: 1840
  },
  {
    id: 'deal-14',
    title: 'Zepto Pass Annual Quick Grocery Delivery Pass',
    store: 'Zepto',
    brand: 'Zepto',
    category: 'Quick Grocery',
    subCategory: 'Membership Plans',
    asinOrSku: 'ZEPPASS12',
    type: 'flash',
    status: 'Expired',
    priority: 'Normal',
    badge: 'Campaign Ended',
    code: 'ZEPTOPASS99',
    link: '/stores#zepto',
    originalPrice: '₹499',
    price: '₹99',
    discountLabel: '80% OFF',
    discountValue: 80,
    bankOffer: 'Extra ₹20 Off on UPI',
    effectivePrice: '₹79',
    cashback: '+ ₹20 Wallet Cash',
    stockStatus: 'Out of Stock',
    rating: '4.5 ★ (19.4k)',
    deliveryInfo: 'Instant Plan Activation',
    warranty: '1 Year Plan Validity',
    variantNote: 'Annual Super Saver Pass',
    howToClaim: 'Offer closed on Aug 20, 2026.',
    highlights: ['Zero Delivery Fee on orders above ₹99', 'Extra 10% Off on Zepto Cafe', 'Priority 8-Min Delivery during peak hours'],
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Aug 5, 2026, 12:00 PM',
    expiresAt: '2026-08-20T23:59:59.000Z',
    description: 'Annual free grocery delivery pass with instant priority access during rain and peak hours.',
    terms: 'Promotional rate valid for limited signups only.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
    clicks: 2310
  },
  {
    id: 'deal-15',
    title: 'Philips 1000W Heavy Weight Dry Iron (Black)',
    store: 'Amazon',
    brand: 'Philips',
    category: 'Home & Lifestyle',
    subCategory: 'Home Appliances',
    asinOrSku: 'B08HGTY911',
    type: 'deal',
    status: 'Pending Approval',
    priority: 'Normal',
    badge: 'Pending Approval',
    code: 'PHILIPS10',
    link: '/stores#amazon',
    originalPrice: '₹1,895',
    price: '₹1,299',
    discountLabel: '31% OFF',
    discountValue: 31,
    bankOffer: '10% Instant Discount on HDFC Cards',
    effectivePrice: '₹1,169',
    cashback: '+ 5% Cashback',
    stockStatus: 'In Stock',
    rating: '4.4 ★ (31.2k)',
    deliveryInfo: 'Standard Delivery',
    warranty: '2 Years Manufacturer Warranty',
    variantNote: '1.6kg Heavy Soleplate for Crisp Ironing',
    howToClaim: 'Awaiting Ops Manager Approval before publishing.',
    highlights: ['Heavy Weight 1.6kg Body', 'Golden American Heritage Non-stick Soleplate', 'Easy Grip Fabric Selector Knob'],
    isFeatured: false,
    isVerified: false,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Today, 12:30 PM',
    expiresAt: '2026-11-20T23:59:59.000Z',
    description: 'Heavy duty dry iron that removes stubborn creases effortlessly with uniform heat distribution.',
    terms: 'Standard warranty terms apply.',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80'],
    clicks: 0
  },
  {
    id: 'deal-16',
    title: 'Croma 1.5 Ton 3 Star Inverter Split AC (Copper Condenser)',
    store: 'Reliance Digital',
    brand: 'Croma',
    category: 'Electronics',
    subCategory: 'Air Conditioners',
    asinOrSku: 'RELAC7781',
    type: 'deal',
    status: 'Pending Approval',
    priority: 'High',
    badge: 'Pending Approval',
    code: 'CROMAAC2K',
    link: '/stores#reliance-digital',
    originalPrice: '₹48,000',
    price: '₹28,990',
    discountLabel: '40% OFF',
    discountValue: 40,
    bankOffer: '₹2,500 Instant Cashback on ICICI Credit Cards',
    effectivePrice: '₹26,490',
    cashback: '+ ₹1,000 Wouchify Cash',
    stockStatus: 'In Stock',
    rating: '4.3 ★ (5.6k)',
    deliveryInfo: 'Free Express Delivery & Standard Installation at ₹999',
    warranty: '1 Year Comprehensive + 10 Years Compressor Warranty',
    variantNote: '100% Copper Condenser with Blue Fin Protection',
    howToClaim: 'Awaiting Ops Manager Approval.',
    highlights: ['4-in-1 Convertible Inverter Cooling', 'PM 2.5 Anti-bacterial Filter', 'Self Diagnosis & Hidden LED Display'],
    isFeatured: false,
    isVerified: false,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    postedAt: 'Today, 01:15 PM',
    expiresAt: '2026-11-25T23:59:59.000Z',
    description: 'Energy efficient fast cooling inverter air conditioner designed for harsh Indian summers up to 54°C.',
    terms: 'Installation service coordinated within 48 hours of delivery.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'],
    clicks: 0
  }
]

/* ==========================================================================
   Master Executive Loot Deals (Synchronized across Executive and Loot Deals Page)
   ========================================================================== */

export interface MasterLootDealItem {
  id: string
  title: string
  store: string
  brand: string
  category: string
  lootType: 'glitch' | 'flash' | 'steal' | 'under99' | 'under199' | 'freebie'
  badge: string
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Expired'
  priority: 'Normal' | 'High' | 'Critical'
  code: string
  link: string
  originalPrice: string
  price: string
  discountLabel: string
  discountValue: number
  effectivePrice?: string
  cashback?: string
  stockClaimedPercent: number
  quantityAlert?: string
  proofNote?: string
  trickSteps?: string
  terms?: string
  asinOrSku?: string
  deliveryInfo?: string
  rating?: string
  postedAt: string
  expiresAt: string
  image: string
  images: string[]
  telegramAlert: boolean
  pushNotification: boolean
  isFeatured: boolean
  isVerified: boolean
  isBestSelling?: boolean
  sectionPlacement?: 'favourite' | 'best_selling' | 'both'
  clicks: number
}

export const MASTER_EXECUTIVE_LOOT_DEALS: MasterLootDealItem[] = [
  {
    id: 'loot-1',
    title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
    store: 'Amazon',
    brand: 'Wipro',
    category: 'Electronics',
    lootType: 'flash',
    badge: '⚡ 91% FLASH LOOT',
    status: 'Approved',
    priority: 'Critical',
    code: 'LOOT91',
    link: '/stores#amazon',
    originalPrice: '₹1,899',
    price: '₹179',
    discountLabel: '91% OFF',
    discountValue: 91,
    effectivePrice: '₹179',
    cashback: '+ ₹20 Wouchify Cash',
    stockClaimedPercent: 96,
    quantityAlert: 'Hurry! Flash window open — 96% units claimed',
    proofNote: 'Verified flash loot drop on Amazon India.',
    trickSteps: '1. Click "Grab Loot" to go to Amazon product page.\n2. Apply the 91% coupon checkbox if shown.\n3. Complete checkout via UPI for instant dispatch.',
    terms: 'Limited time lightning flash price. 1 unit per customer.',
    asinOrSku: 'B0CHOVAL2W',
    deliveryInfo: 'Prime 1-Day Free Delivery',
    rating: '4.8 ★ (12k)',
    postedAt: 'Today, 11:15 AM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: deal1,
    images: [deal1, deal2],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    clicks: 7890
  },
  {
    id: 'loot-2',
    title: 'Exclusive Oval Architectural LED Outdoor Fixture (Warm White Dual Ray)',
    store: 'Amazon',
    brand: 'Philips',
    category: 'Electronics',
    lootType: 'steal',
    badge: '💎 EXCLUSIVE STEAL',
    status: 'Approved',
    priority: 'High',
    code: 'STEAL91',
    link: '/stores#amazon',
    originalPrice: '₹1,899',
    price: '₹179',
    discountLabel: '91% OFF',
    discountValue: 91,
    effectivePrice: '₹179',
    cashback: '+ 5% Wouchify Cashback',
    stockClaimedPercent: 89,
    quantityAlert: 'Exclusive pricing locked for Wouchify members',
    proofNote: 'Exclusive partner deal negotiated directly with manufacturer.',
    trickSteps: '1. Click "Grab Loot" to activate exclusive pricing.\n2. Proceed to checkout on Amazon.\n3. Extra ₹20 cashback credited to Wouchify wallet.',
    terms: 'Exclusive to registered Wouchify users.',
    asinOrSku: 'B0CHEXCL2W',
    deliveryInfo: 'Free Delivery with Prime',
    rating: '4.7 ★ (8.5k)',
    postedAt: 'Today, 10:45 AM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: deal2,
    images: [deal2, deal1],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    clicks: 5410
  },
  {
    id: 'loot-3',
    title: 'Milton Rapid Electric Kettle 1.8L Stainless Steel Fast Boil',
    store: 'Amazon',
    brand: 'Milton',
    category: 'Home',
    lootType: 'glitch',
    badge: '💥 68% PRICE GLITCH',
    status: 'Approved',
    priority: 'Critical',
    code: 'KETTLE604',
    link: '/stores#amazon',
    originalPrice: '₹1,899',
    price: '₹604',
    discountLabel: '68% OFF',
    discountValue: 68,
    effectivePrice: '₹554',
    cashback: '+ ₹50 Wouchify Cash',
    stockClaimedPercent: 92,
    quantityAlert: 'Price error live! May expire anytime',
    proofNote: 'Seller algorithmic error discount confirmed active.',
    trickSteps: '1. Click Grab Loot immediately.\n2. Add to cart & apply coupon checkbox on Amazon.\n3. Complete payment before seller rectifies price.',
    terms: 'Price may change without prior notice.',
    asinOrSku: 'B0CHMILT18',
    deliveryInfo: 'Prime Same-Day / 1-Day Delivery',
    rating: '4.5 ★ (34k)',
    postedAt: 'Today, 09:30 AM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: deal2,
    images: [deal2],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    clicks: 9200
  },
  {
    id: 'loot-4',
    title: 'Xiaomi 55" 4K Ultra HD Smart Google TV with Dolby Vision & Atmos',
    store: 'Flipkart',
    brand: 'Xiaomi',
    category: 'Electronics',
    lootType: 'flash',
    badge: '⚡ 50% MEGA DROP',
    status: 'Approved',
    priority: 'High',
    code: 'TVSAVE',
    link: '/stores#flipkart',
    originalPrice: '₹49,999',
    price: '₹24,999',
    discountLabel: '50% OFF',
    discountValue: 50,
    effectivePrice: '₹23,499',
    cashback: '+ ₹1,500 Bank Discount',
    stockClaimedPercent: 85,
    quantityAlert: 'Limited flash sale units remaining',
    proofNote: 'Flipkart Big Billion Days preview drop.',
    trickSteps: '1. Click Grab Loot to open Flipkart app/web.\n2. Use HDFC/SBI card for extra ₹1,500 discount.\n3. Free wall-mount installation included.',
    terms: '1 unit per account. 1 Year comprehensive warranty.',
    asinOrSku: 'FSNXIAOMI55',
    deliveryInfo: 'Free Express Scheduled Delivery',
    rating: '4.6 ★ (62k)',
    postedAt: 'Today, 08:45 AM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: deal1,
    images: [deal1],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: true,
    isVerified: true,
    isBestSelling: true,
    sectionPlacement: 'both',
    clicks: 11400
  },
  {
    id: 'loot-5',
    title: 'Portronics 65W Fast USB-C Braided Cable (2 Metres)',
    store: 'Amazon',
    brand: 'Portronics',
    category: 'Electronics',
    lootType: 'under99',
    badge: '🏷️ UNDER ₹99 LOOT',
    status: 'Approved',
    priority: 'High',
    code: '',
    link: '/stores#amazon',
    originalPrice: '₹899',
    price: '₹79',
    discountLabel: '91% OFF',
    discountValue: 91,
    effectivePrice: '₹79',
    cashback: '+ 8% Wouchify Cashback',
    stockClaimedPercent: 65,
    quantityAlert: 'Fast charging supported on all USB-C devices',
    proofNote: 'Amazon lightning loot deal.',
    trickSteps: '1. Click Grab Loot.\n2. Add to cart & checkout.',
    terms: 'Valid while supplies last.',
    asinOrSku: 'B0PORT01',
    deliveryInfo: 'Prime 1-Day Delivery',
    rating: '4.4 ★ (18.6k)',
    postedAt: 'Yesterday, 06:40 PM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: false,
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    clicks: 1980
  },
  {
    id: 'loot-6',
    title: 'The Man Company Charcoal Grooming Kit (5-Piece Gift Set)',
    store: 'Flipkart',
    brand: 'The Man Company',
    category: 'Beauty',
    lootType: 'under199',
    badge: '🏷️ UNDER ₹199',
    status: 'Approved',
    priority: 'Normal',
    code: 'GROOM100',
    link: '/stores#flipkart',
    originalPrice: '₹1,899',
    price: '₹189',
    discountLabel: '90% OFF',
    discountValue: 90,
    effectivePrice: '₹189',
    cashback: '+ ₹25 Cashback',
    stockClaimedPercent: 91,
    quantityAlert: 'Lightning Deal (91% Claimed)',
    proofNote: 'Flash kit sale verified on Flipkart seller portal.',
    trickSteps: '1. Add 1 set to cart.\n2. Coupon GROOM100 auto-applies.\n3. Complete payment before flash sale expires.',
    terms: 'Valid on single box per customer.',
    asinOrSku: 'FSNTMC9018',
    deliveryInfo: 'Free Delivery above ₹149',
    rating: '4.5 ★ (9.1k)',
    postedAt: 'Yesterday, 02:15 PM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop'],
    telegramAlert: false,
    pushNotification: false,
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    clicks: 1420
  },
  {
    id: 'loot-7',
    title: 'Free Sample Coffee Tasting Box (3 Exotic Flavours 150g)',
    store: 'Tata CLiQ',
    brand: 'Tata Coffee',
    category: 'Grocery',
    lootType: 'freebie',
    badge: '🎁 100% FREEBIE',
    status: 'Pending Approval',
    priority: 'High',
    code: 'SAMPLEFREE',
    link: '/stores#tata-cliq',
    originalPrice: '₹450',
    price: '₹0',
    discountLabel: '100% FREE',
    discountValue: 100,
    effectivePrice: '₹0 (Pay ₹49 Shipping)',
    cashback: '₹49 Wouchify Cash Refund',
    stockClaimedPercent: 96,
    quantityAlert: 'Almost sold out! 96% claimed',
    proofNote: 'Official trial sample program by Tata Consumer Products.',
    trickSteps: '1. Register new email on trial landing page.\n2. Apply code SAMPLEFREE.\n3. Pay ₹49 nominal shipping which is refunded as Wouchify wallet cash.',
    terms: '1 box per household delivery address.',
    asinOrSku: 'TATASAMP01',
    deliveryInfo: 'Delivered in 3-5 Business Days',
    rating: '4.7 ★ (12k)',
    postedAt: 'Today, 08:30 AM',
    expiresAt: '2026-12-31T23:59:59.000Z',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop'],
    telegramAlert: true,
    pushNotification: true,
    isFeatured: false,
    isVerified: true,
    isBestSelling: false,
    sectionPlacement: 'favourite',
    clicks: 5210
  }
]

