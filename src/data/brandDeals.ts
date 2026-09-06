import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import ajioLogo from '../assets/brand-logos/ajio-logo.png'
import firstcryLogo from '../assets/brand-logos/firstcry-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'
import myntraLogo from '../assets/brand-logos/myntra-logo.png'
import quikrjobsLogo from '../assets/brand-logos/quikrjobs-logo.png'
import relianceDigitalLogo from '../assets/brand-logos/reliance-digital-logo.png'
import snapdealLogo from '../assets/brand-logos/snapdeal-logo.png'
import nykaaLogo from '../assets/brand-logos/nykaa-logo.png'
import swiggyLogo from '../assets/brand-logos/swiggy-logo.png'
import bigbasketLogo from '../assets/brand-logos/bigbasket-logo.png'
import zomatoLogo from '../assets/brand-logos/zomato-logo.png'
import meeshoLogo from '../assets/brand-logos/meesho-logo.png'
import zeptoLogo from '../assets/brand-logos/zepto-logo.png'
import jiomartLogo from '../assets/brand-logos/jiomart-logo.png'
import pepperfryLogo from '../assets/brand-logos/pepperfry-logo.png'
import zivameLogo from '../assets/brand-logos/zivame-logo.png'

export type DealType = 'Coupon' | 'Deal' | 'Cashback' | 'Offer'
export type DealCategory = 'Fashion' | 'Electronics' | 'Food' | 'Grocery' | 'Beauty' | 'Home' | 'Kids' | 'Jobs' | 'All'

export interface BrandDeal {
  id: string
  title: string
  description: string
  code?: string
  discount: string
  type: DealType
  category: DealCategory
  expiresAt: string
  isVerified: boolean
  usedCount: number
}

export interface BrandPageData {
  slug: string
  name: string
  logoSrc: string
  logoBgColor?: string
  tagline: string
  rewardValue: string
  rewardLabel: string
  categories: DealCategory[]
  deals: BrandDeal[]
}

const BRANDS_DATA: Record<string, BrandPageData> = {
  amazon: {
    slug: 'amazon', name: 'Amazon', logoSrc: amazonLogo,
    tagline: 'India\'s biggest online marketplace',
    rewardValue: '10%', rewardLabel: 'REWARDS',
    categories: ['All', 'Electronics', 'Fashion', 'Grocery', 'Home'],
    deals: [
      { id: 'amz-1', title: '80% Off on Electronics', description: 'Get up to 80% off on selected electronics including laptops, phones, and accessories.', code: 'AMZTECH80', discount: '80%', type: 'Deal', category: 'Electronics', expiresAt: 'Sep 15, 2026', isVerified: true, usedCount: 4312 },
      { id: 'amz-2', title: '10% Extra Cashback via Wouchify', description: 'Earn 10% cashback rewards on every Amazon order placed through Wouchify.', discount: '10%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 8901 },
      { id: 'amz-3', title: '₹200 Off on Fashion Orders', description: 'Use code to get ₹200 instant off on fashion orders above ₹999.', code: 'AMZFASH200', discount: '₹200', type: 'Coupon', category: 'Fashion', expiresAt: 'Sep 10, 2026', isVerified: true, usedCount: 2145 },
      { id: 'amz-4', title: 'Free Delivery on Grocery', description: 'Get free delivery on all grocery orders above ₹499.', code: 'AMZGROC', discount: 'Free Del.', type: 'Offer', category: 'Grocery', expiresAt: 'Sep 20, 2026', isVerified: false, usedCount: 1233 },
      { id: 'amz-5', title: '30% Off Home & Kitchen', description: 'Up to 30% off on home and kitchen products.', code: 'AMZHOME30', discount: '30%', type: 'Deal', category: 'Home', expiresAt: 'Sep 12, 2026', isVerified: true, usedCount: 987 },
    ],
  },
  flipkart: {
    slug: 'flipkart', name: 'Flipkart', logoSrc: flipkartLogo,
    tagline: 'India\'s homegrown e-commerce giant',
    rewardValue: '6.2%', rewardLabel: 'REWARDS',
    categories: ['All', 'Electronics', 'Fashion', 'Home', 'Grocery'],
    deals: [
      { id: 'fk-1', title: 'Big Billion Day — 70% Off', description: 'Massive discounts across all categories during Big Billion Day sale.', discount: '70%', type: 'Deal', category: 'All', expiresAt: 'Sep 15, 2026', isVerified: true, usedCount: 15200 },
      { id: 'fk-2', title: '6.2% Wouchify Rewards', description: 'Earn 6.2% rewards on every Flipkart purchase via Wouchify.', discount: '6.2%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 7320 },
      { id: 'fk-3', title: '₹150 Off on Electronics', description: 'Use code for ₹150 instant discount on electronics above ₹1499.', code: 'FKELEC150', discount: '₹150', type: 'Coupon', category: 'Electronics', expiresAt: 'Sep 11, 2026', isVerified: true, usedCount: 3210 },
      { id: 'fk-4', title: '40% Off on Fashion', description: 'Up to 40% off on top fashion brands.', code: 'FKFASH40', discount: '40%', type: 'Deal', category: 'Fashion', expiresAt: 'Sep 18, 2026', isVerified: false, usedCount: 2100 },
    ],
  },
  myntra: {
    slug: 'myntra', name: 'Myntra', logoSrc: myntraLogo,
    tagline: 'India\'s fashion destination',
    rewardValue: '12%', rewardLabel: 'REWARDS',
    categories: ['All', 'Fashion', 'Beauty'],
    deals: [
      { id: 'myn-1', title: 'End of Season Sale — 50% Off', description: 'Up to 50% off on top fashion brands during EOSS.', discount: '50%', type: 'Deal', category: 'Fashion', expiresAt: 'Sep 20, 2026', isVerified: true, usedCount: 11300 },
      { id: 'myn-2', title: '12% Cashback via Wouchify', description: 'Earn 12% cashback on all Myntra orders placed via Wouchify.', discount: '12%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 5200 },
      { id: 'myn-3', title: '₹300 Off on Beauty', description: 'Get ₹300 off on beauty orders above ₹1999.', code: 'MYNBEAUTY', discount: '₹300', type: 'Coupon', category: 'Beauty', expiresAt: 'Sep 14, 2026', isVerified: true, usedCount: 1800 },
    ],
  },
  ajio: {
    slug: 'ajio', name: 'AJIO', logoSrc: ajioLogo,
    tagline: 'Style redefined. Shop top brands.',
    rewardValue: '5%', rewardLabel: 'CASHBACK',
    categories: ['All', 'Fashion'],
    deals: [
      { id: 'ajio-1', title: '30% Off Sitewide', description: 'Get 30% off on everything at AJIO.', code: 'AJIO30', discount: '30%', type: 'Deal', category: 'Fashion', expiresAt: 'Sep 12, 2026', isVerified: true, usedCount: 6700 },
      { id: 'ajio-2', title: '5% Cashback via Wouchify', description: 'Earn 5% cashback on every AJIO purchase.', discount: '5%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 3400 },
      { id: 'ajio-3', title: 'Flat ₹500 Off on ₹2999+', description: 'Use code to get flat ₹500 off.', code: 'AJIO500', discount: '₹500', type: 'Coupon', category: 'Fashion', expiresAt: 'Sep 8, 2026', isVerified: false, usedCount: 1200 },
    ],
  },
  nykaa: {
    slug: 'nykaa', name: 'Nykaa', logoSrc: nykaaLogo,
    tagline: 'Beauty & wellness, inside out',
    rewardValue: '8%', rewardLabel: 'REWARDS',
    categories: ['All', 'Beauty', 'Fashion'],
    deals: [
      { id: 'nyk-1', title: '40% Off on Skincare', description: 'Up to 40% off on top skincare brands.', discount: '40%', type: 'Deal', category: 'Beauty', expiresAt: 'Sep 18, 2026', isVerified: true, usedCount: 5400 },
      { id: 'nyk-2', title: '8% Rewards via Wouchify', description: 'Earn 8% rewards on all Nykaa purchases.', discount: '8%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 2900 },
      { id: 'nyk-3', title: 'Free Gift on ₹1499+', description: 'Get a free beauty gift on orders above ₹1499.', code: 'NYKAAGIFT', discount: 'Free Gift', type: 'Offer', category: 'Beauty', expiresAt: 'Sep 10, 2026', isVerified: true, usedCount: 3100 },
    ],
  },
  swiggy: {
    slug: 'swiggy', name: 'Swiggy', logoSrc: swiggyLogo,
    tagline: 'Delivering happiness to your doorstep',
    rewardValue: '12%', rewardLabel: 'CASHBACK',
    categories: ['All', 'Food'],
    deals: [
      { id: 'swg-1', title: '60% Off on First Order', description: 'Get 60% off on your first Swiggy order.', code: 'SWIGGY60', discount: '60%', type: 'Coupon', category: 'Food', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 22000 },
      { id: 'swg-2', title: '12% Cashback via Wouchify', description: 'Earn 12% cashback on every Swiggy order.', discount: '12%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 8800 },
      { id: 'swg-3', title: 'Free Delivery for 3 Months', description: 'Swiggy One membership — free delivery on all orders.', code: 'SWIGGY1', discount: 'Free Del.', type: 'Offer', category: 'Food', expiresAt: 'Sep 15, 2026', isVerified: true, usedCount: 5600 },
    ],
  },
  zomato: {
    slug: 'zomato', name: 'Zomato', logoSrc: zomatoLogo,
    tagline: 'Discover the best food & drinks',
    rewardValue: '10%', rewardLabel: 'CASHBACK',
    categories: ['All', 'Food'],
    deals: [
      { id: 'zmt-1', title: '50% Off on Zomato Gold', description: 'Get 50% off on Zomato Gold membership.', code: 'GOLD50', discount: '50%', type: 'Coupon', category: 'Food', expiresAt: 'Sep 20, 2026', isVerified: true, usedCount: 14500 },
      { id: 'zmt-2', title: '10% Cashback via Wouchify', description: 'Earn 10% cashback on every Zomato order.', discount: '10%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 6700 },
    ],
  },
  bigbasket: {
    slug: 'bigbasket', name: 'BigBasket', logoSrc: bigbasketLogo,
    tagline: 'Your online grocery superstore',
    rewardValue: '5%', rewardLabel: 'REWARDS',
    categories: ['All', 'Grocery'],
    deals: [
      { id: 'bb-1', title: '25% Off on Groceries', description: 'Get up to 25% off on all grocery orders.', code: 'BB25', discount: '25%', type: 'Deal', category: 'Grocery', expiresAt: 'Sep 12, 2026', isVerified: true, usedCount: 9200 },
      { id: 'bb-2', title: '5% Rewards via Wouchify', description: 'Earn 5% rewards on all BigBasket orders.', discount: '5%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 4100 },
      { id: 'bb-3', title: 'Free Delivery on ₹699+', description: 'Get free delivery on grocery orders above ₹699.', code: 'BBFREE', discount: 'Free Del.', type: 'Offer', category: 'Grocery', expiresAt: 'Sep 10, 2026', isVerified: false, usedCount: 7800 },
    ],
  },
  meesho: {
    slug: 'meesho', name: 'Meesho', logoSrc: meeshoLogo, logoBgColor: '#51004C',
    tagline: 'Fashion & lifestyle at lowest prices',
    rewardValue: '15%', rewardLabel: 'REWARDS',
    categories: ['All', 'Fashion', 'Home'],
    deals: [
      { id: 'msh-1', title: '70% Off Sitewide', description: 'Get up to 70% off across all categories on Meesho.', discount: '70%', type: 'Deal', category: 'All', expiresAt: 'Sep 18, 2026', isVerified: true, usedCount: 18000 },
      { id: 'msh-2', title: '15% Rewards via Wouchify', description: 'Earn 15% rewards on every Meesho purchase.', discount: '15%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 7200 },
    ],
  },
  zepto: {
    slug: 'zepto', name: 'Zepto', logoSrc: zeptoLogo,
    tagline: '10-minute grocery delivery',
    rewardValue: '8%', rewardLabel: 'CASHBACK',
    categories: ['All', 'Grocery', 'Food'],
    deals: [
      { id: 'zep-1', title: '35% Off First Order', description: 'Get 35% off on your very first Zepto order.', code: 'ZEPTO35', discount: '35%', type: 'Coupon', category: 'Grocery', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 12000 },
      { id: 'zep-2', title: '8% Cashback via Wouchify', description: 'Earn 8% cashback on every Zepto order.', discount: '8%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 5400 },
    ],
  },
  jiomart: {
    slug: 'jiomart', name: 'JioMart', logoSrc: jiomartLogo,
    tagline: 'Desh ki nayi dukaan',
    rewardValue: '7%', rewardLabel: 'REWARDS',
    categories: ['All', 'Grocery', 'Electronics'],
    deals: [
      { id: 'jm-1', title: '30% Off on Grocery', description: 'Get 30% off on grocery orders at JioMart.', code: 'JIOMART30', discount: '30%', type: 'Deal', category: 'Grocery', expiresAt: 'Sep 14, 2026', isVerified: true, usedCount: 6700 },
      { id: 'jm-2', title: '7% Rewards via Wouchify', description: 'Earn 7% rewards on every JioMart purchase.', discount: '7%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 3200 },
    ],
  },
  pepperfry: {
    slug: 'pepperfry', name: 'Pepperfry', logoSrc: pepperfryLogo,
    tagline: 'India\'s No.1 furniture marketplace',
    rewardValue: '10%', rewardLabel: 'REWARDS',
    categories: ['All', 'Home'],
    deals: [
      { id: 'pf-1', title: '45% Off on Furniture', description: 'Get up to 45% off on furniture and home décor.', discount: '45%', type: 'Deal', category: 'Home', expiresAt: 'Sep 16, 2026', isVerified: true, usedCount: 3400 },
      { id: 'pf-2', title: '10% Rewards via Wouchify', description: 'Earn 10% rewards on all Pepperfry orders.', discount: '10%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 1800 },
    ],
  },
  zivame: {
    slug: 'zivame', name: 'Zivame', logoSrc: zivameLogo,
    tagline: 'Shop lingerie & shapewear online',
    rewardValue: '12%', rewardLabel: 'REWARDS',
    categories: ['All', 'Fashion'],
    deals: [
      { id: 'zv-1', title: '55% Off Sitewide', description: 'Get up to 55% off on all products at Zivame.', discount: '55%', type: 'Deal', category: 'Fashion', expiresAt: 'Sep 14, 2026', isVerified: true, usedCount: 4100 },
      { id: 'zv-2', title: '12% Rewards via Wouchify', description: 'Earn 12% rewards on all Zivame orders.', discount: '12%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 2200 },
    ],
  },
  snapdeal: {
    slug: 'snapdeal', name: 'Snapdeal', logoSrc: snapdealLogo,
    tagline: 'Bajao Price Ki Ghanti',
    rewardValue: '6.2%', rewardLabel: 'REWARDS',
    categories: ['All', 'Electronics', 'Fashion', 'Home'],
    deals: [
      { id: 'sd-1', title: '25% Off Electronics', description: 'Get 25% off on all electronics at Snapdeal.', code: 'SDELEC25', discount: '25%', type: 'Deal', category: 'Electronics', expiresAt: 'Sep 15, 2026', isVerified: true, usedCount: 4500 },
      { id: 'sd-2', title: '6.2% Rewards via Wouchify', description: 'Earn 6.2% rewards on every Snapdeal order.', discount: '6.2%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 2300 },
    ],
  },
  'reliance-digital': {
    slug: 'reliance-digital', name: 'Reliance Digital', logoSrc: relianceDigitalLogo,
    tagline: 'India\'s largest electronics chain',
    rewardValue: '15%', rewardLabel: 'REWARDS',
    categories: ['All', 'Electronics'],
    deals: [
      { id: 'rd-1', title: '20% Off on Mobiles', description: 'Up to 20% off on mobiles and tablets.', code: 'RDMOBILE', discount: '20%', type: 'Deal', category: 'Electronics', expiresAt: 'Sep 13, 2026', isVerified: true, usedCount: 5600 },
      { id: 'rd-2', title: '15% Rewards via Wouchify', description: 'Earn 15% rewards on all Reliance Digital purchases.', discount: '15%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 3100 },
    ],
  },
  firstcry: {
    slug: 'firstcry', name: 'FirstCry', logoSrc: firstcryLogo,
    tagline: 'Asia\'s largest baby & kids store',
    rewardValue: '15%', rewardLabel: 'REWARDS',
    categories: ['All', 'Kids', 'Fashion'],
    deals: [
      { id: 'fc-1', title: '20% Off on Baby Products', description: 'Get 20% off on baby care and clothing.', discount: '20%', type: 'Deal', category: 'Kids', expiresAt: 'Sep 16, 2026', isVerified: true, usedCount: 6200 },
      { id: 'fc-2', title: '15% Rewards via Wouchify', description: 'Earn 15% rewards on all FirstCry purchases.', discount: '15%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 2900 },
      { id: 'fc-3', title: 'Flat ₹250 Off on ₹1499+', description: 'Use code to get ₹250 off on kids\' clothing.', code: 'FCKIDS250', discount: '₹250', type: 'Coupon', category: 'Kids', expiresAt: 'Sep 11, 2026', isVerified: true, usedCount: 1700 },
    ],
  },
  quikrjobs: {
    slug: 'quikrjobs', name: 'QuikrJobs', logoSrc: quikrjobsLogo,
    tagline: 'Find your next opportunity fast',
    rewardValue: '8%', rewardLabel: 'CASHBACK',
    categories: ['All', 'Jobs'],
    deals: [
      { id: 'qj-1', title: '30% Off Premium Membership', description: 'Get 30% off on QuikrJobs Premium subscription.', code: 'QJPREM30', discount: '30%', type: 'Coupon', category: 'Jobs', expiresAt: 'Sep 20, 2026', isVerified: true, usedCount: 2100 },
      { id: 'qj-2', title: '8% Cashback via Wouchify', description: 'Earn 8% cashback on QuikrJobs subscriptions.', discount: '8%', type: 'Cashback', category: 'All', expiresAt: 'Sep 30, 2026', isVerified: true, usedCount: 980 },
    ],
  },
}

export const getBrandData = (slug: string): BrandPageData | null => {
  return BRANDS_DATA[slug] ?? null
}

export const getAllBrandSlugs = (): string[] => Object.keys(BRANDS_DATA)
