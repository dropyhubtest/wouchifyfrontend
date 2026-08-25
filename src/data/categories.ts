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
import quikrjobsLogo from '../assets/brand-logos/quikrjobs-logo.png'
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

export interface Subcategory {
  id: string
  name: string
  slug: string
  itemCount?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  bgColor: string
  textColor: string
  count: number
  description: string
  subcategories: Subcategory[]
}

export interface CategoryBrandItem {
  id: string
  name: string
  slug: string
  logo: string
  category: string
  categorySlug: string
  subcategory: string
  letter: string
  discount?: string
  reward?: string
  href: string
}

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    color: '#FF6B6B',
    bgColor: '#FFE3E3',
    textColor: '#D92626',
    count: 240,
    description: 'Explore top trending fashion, apparel, and clothing brands with verified discounts.',
    subcategories: [
      { id: 'mens-wear', name: "Men's Wear", slug: 'mens-wear', itemCount: 85 },
      { id: 'womens-wear', name: "Women's Wear", slug: 'womens-wear', itemCount: 95 },
      { id: 'footwear', name: 'Footwear', slug: 'footwear', itemCount: 40 },
      { id: 'accessories', name: 'Fashion Accessories', slug: 'accessories', itemCount: 20 },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    color: '#4DABF7',
    bgColor: '#E7F5FF',
    textColor: '#1971C2',
    count: 180,
    description: 'Laptops, mobile devices, audio gear, and smart home appliances on discount.',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones & Mobiles', slug: 'smartphones', itemCount: 60 },
      { id: 'laptops', name: 'Laptops & Computers', slug: 'laptops', itemCount: 45 },
      { id: 'audio', name: 'Headphones & Audio', slug: 'audio', itemCount: 35 },
      { id: 'home-appliances', name: 'Home Appliances', slug: 'home-appliances', itemCount: 40 },
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery & Essentials',
    slug: 'grocery',
    color: '#51CF66',
    bgColor: '#EBFBEE',
    textColor: '#2B8A3E',
    count: 120,
    description: 'Fresh daily groceries, supermarket items, and quick delivery staples.',
    subcategories: [
      { id: 'daily-essentials', name: 'Daily Essentials', slug: 'daily-essentials', itemCount: 50 },
      { id: 'packaged-foods', name: 'Packaged Foods', slug: 'packaged-foods', itemCount: 35 },
      { id: 'beverages', name: 'Beverages & Dairy', slug: 'beverages', itemCount: 35 },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    color: '#FCC419',
    bgColor: '#FFF9DB',
    textColor: '#E67700',
    count: 95,
    description: 'Cosmetics, skincare, hair products, and luxury perfumes from authentic brands.',
    subcategories: [
      { id: 'skincare', name: 'Skincare', slug: 'skincare', itemCount: 35 },
      { id: 'makeup', name: 'Makeup & Cosmetics', slug: 'makeup', itemCount: 30 },
      { id: 'haircare', name: 'Hair Care', slug: 'haircare', itemCount: 20 },
      { id: 'fragrances', name: 'Fragrances & Perfumes', slug: 'fragrances', itemCount: 10 },
    ],
  },
  {
    id: 'home',
    name: 'Home & Furniture',
    slug: 'home',
    color: '#FF922B',
    bgColor: '#FFF4E6',
    textColor: '#D9480F',
    count: 110,
    description: 'Furniture, kitchenware, interior decor, and bedding collections.',
    subcategories: [
      { id: 'furniture', name: 'Living Room Furniture', slug: 'furniture', itemCount: 45 },
      { id: 'kitchenware', name: 'Cookware & Kitchenware', slug: 'kitchenware', itemCount: 35 },
      { id: 'home-decor', name: 'Home Decor & Lighting', slug: 'home-decor', itemCount: 30 },
    ],
  },
  {
    id: 'food',
    name: 'Food & Dining',
    slug: 'food',
    color: '#FF8787',
    bgColor: '#FFF5F5',
    textColor: '#C92A2A',
    count: 85,
    description: 'Food delivery apps, gourmet snacks, dining out vouchers, and restaurant deals.',
    subcategories: [
      { id: 'food-delivery', name: 'Food Delivery Apps', slug: 'food-delivery', itemCount: 40 },
      { id: 'dining-offers', name: 'Restaurant Vouchers', slug: 'dining-offers', itemCount: 25 },
      { id: 'gourmet', name: 'Gourmet & Snacks', slug: 'gourmet', itemCount: 20 },
    ],
  },
  {
    id: 'b2b',
    name: 'B2B & Wholesale',
    slug: 'b2b',
    color: '#845EF7',
    bgColor: '#F3F0FF',
    textColor: '#5F3DC4',
    count: 50,
    description: 'Bulk ordering, enterprise supplies, and trade wholesale platforms.',
    subcategories: [
      { id: 'wholesale-trade', name: 'Wholesale Trade', slug: 'wholesale-trade', itemCount: 30 },
      { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies', itemCount: 20 },
    ],
  },
]

export const POPULAR_SIDEBAR_BRANDS = [
  { name: 'Amazon', logo: amazonLogo, slug: 'amazon' },
  { name: 'Ajio', logo: ajioLogo, slug: 'ajio' },
  { name: 'Flipkart', logo: flipkartLogo, slug: 'flipkart' },
  { name: 'Myntra', logo: myntraLogo, slug: 'myntra' },
  { name: 'Nykaa', logo: nykaaLogo, slug: 'nykaa' },
  { name: 'Big Basket', logo: bigbasketLogo, slug: 'bigbasket' },
  { name: 'Swiggy', logo: swiggyLogo, slug: 'swiggy' },
  { name: 'Zomato', logo: zomatoLogo, slug: 'zomato' },
  { name: 'Reliance Digital', logo: relianceDigitalLogo, slug: 'reliance-digital' },
]

export const ALPHABETICAL_DIRECTORY: CategoryBrandItem[] = [
  // A
  {
    id: 'dir-ajio',
    name: 'Ajio',
    slug: 'ajio',
    logo: ajioLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: "Women's Wear",
    letter: 'A',
    discount: 'Up to 70% Off',
    reward: 'Upto 5% rewards',
    href: '/stores#ajio',
  },
  {
    id: 'dir-amazon',
    name: 'Amazon',
    slug: 'amazon',
    logo: amazonLogo,
    category: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    subcategory: 'Smartphones & Mobiles',
    letter: 'A',
    discount: 'Up to 80% Off',
    reward: 'Upto 6.8% rewards',
    href: '/stores#amazon',
  },

  // B
  {
    id: 'dir-bigbasket',
    name: 'Big Basket',
    slug: 'bigbasket',
    logo: bigbasketLogo,
    category: 'Grocery & Essentials',
    categorySlug: 'grocery',
    subcategory: 'Daily Essentials',
    letter: 'B',
    discount: 'Up to 25% Off',
    reward: 'Upto 20% rewards',
    href: '/stores#bigbasket',
  },

  // F
  {
    id: 'dir-firstcry',
    name: 'Firstcry',
    slug: 'firstcry',
    logo: firstcryLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: 'Kids Wear',
    letter: 'F',
    discount: 'Up to 50% Off',
    reward: 'Upto 5% rewards',
    href: '/stores#firstcry',
  },
  {
    id: 'dir-flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    logo: flipkartLogo,
    category: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    subcategory: 'Home Appliances',
    letter: 'F',
    discount: 'Up to 60% Off',
    reward: 'Upto 10% rewards',
    href: '/stores#flipkart',
  },

  // J
  {
    id: 'dir-jiomart',
    name: 'Jio Mart',
    slug: 'jiomart',
    logo: jiomartLogo,
    category: 'Grocery & Essentials',
    categorySlug: 'grocery',
    subcategory: 'Daily Essentials',
    letter: 'J',
    discount: 'Up to 40% Off',
    reward: 'Upto 5% rewards',
    href: '/stores#jiomart',
  },

  // M
  {
    id: 'dir-meesho',
    name: 'Meesho',
    slug: 'meesho',
    logo: meeshoLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: "Women's Wear",
    letter: 'M',
    discount: 'Up to 70% Off',
    reward: 'Upto 20% off',
    href: '/stores#meesho',
  },
  {
    id: 'dir-myntra',
    name: 'Myntra',
    slug: 'myntra',
    logo: myntraLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: "Men's Wear",
    letter: 'M',
    discount: 'Up to 80% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#myntra',
  },

  // N
  {
    id: 'dir-nykaa',
    name: 'Nykaa',
    slug: 'nykaa',
    logo: nykaaLogo,
    category: 'Beauty & Personal Care',
    categorySlug: 'beauty',
    subcategory: 'Cosmetics',
    letter: 'N',
    discount: 'Up to 50% Off',
    reward: 'Upto 5% rewards',
    href: '/stores#nykaa',
  },

  // P
  {
    id: 'dir-pepperfry',
    name: 'Pepperfry',
    slug: 'pepperfry',
    logo: pepperfryLogo,
    category: 'Home & Furniture',
    categorySlug: 'home',
    subcategory: 'Furniture',
    letter: 'P',
    discount: 'Up to 60% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#pepperfry',
  },

  // Q
  {
    id: 'dir-quikrjobs',
    name: 'QuikrJobs',
    slug: 'quikrjobs',
    logo: quikrjobsLogo,
    category: 'B2B & Wholesale',
    categorySlug: 'b2b',
    subcategory: 'Services',
    letter: 'Q',
    discount: 'Verified Deals',
    reward: 'Upto 8% rewards',
    href: '/stores#quikrjobs',
  },

  // R
  {
    id: 'dir-reliance-digital',
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    logo: relianceDigitalLogo,
    category: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    subcategory: 'Smartphones & Mobiles',
    letter: 'R',
    discount: 'Up to 50% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#reliance-digital',
  },

  // S
  {
    id: 'dir-snapdeal',
    name: 'Snapdeal',
    slug: 'snapdeal',
    logo: snapdealLogo,
    category: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    subcategory: 'Accessories',
    letter: 'S',
    discount: 'Up to 70% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#snapdeal',
  },
  {
    id: 'dir-swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logo: swiggyLogo,
    category: 'Food & Dining',
    categorySlug: 'food',
    subcategory: 'Food Delivery Apps',
    letter: 'S',
    discount: 'Up to 60% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#swiggy',
  },

  // T
  {
    id: 'dir-tata-cliq',
    name: 'Tata Cliq',
    slug: 'tata-cliq',
    logo: tataCliqLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: 'Luxury Wear',
    letter: 'T',
    discount: 'Up to 60% Off',
    reward: 'Upto 8% rewards',
    href: '/stores#tata-cliq',
  },

  // U
  {
    id: 'dir-udaan',
    name: 'Udaan',
    slug: 'udaan',
    logo: udaanLogo,
    category: 'B2B & Wholesale',
    categorySlug: 'b2b',
    subcategory: 'Wholesale Trade',
    letter: 'U',
    discount: 'Bulk Discounts',
    reward: 'Upto 8% rewards',
    href: '/stores#udaan',
  },

  // V
  {
    id: 'dir-voonik',
    name: 'Voonik',
    slug: 'voonik',
    logo: voonikLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: "Women's Fashion",
    letter: 'V',
    discount: 'Up to 50% Off',
    reward: 'Upto 15% off',
    href: '/stores#voonik',
  },

  // Y
  {
    id: 'dir-yepme',
    name: 'Yep Me',
    slug: 'yepme',
    logo: yepmeLogo,
    category: 'Grocery & Essentials',
    categorySlug: 'grocery',
    subcategory: 'Daily Essentials',
    letter: 'Y',
    discount: 'Flat ₹50 Off',
    reward: 'Flat ₹50 off',
    href: '/stores#yepme',
  },

  // Z
  {
    id: 'dir-zepto',
    name: 'Zepto',
    slug: 'zepto',
    logo: zeptoLogo,
    category: 'Grocery & Essentials',
    categorySlug: 'grocery',
    subcategory: 'Quick Delivery',
    letter: 'Z',
    discount: 'Up to 40% Off',
    reward: 'Flat ₹50 off',
    href: '/stores#zepto',
  },
  {
    id: 'dir-zivame',
    name: 'Zivame',
    slug: 'zivame',
    logo: zivameLogo,
    category: 'Fashion & Apparel',
    categorySlug: 'fashion',
    subcategory: 'Innerwear',
    letter: 'Z',
    discount: 'Up to 60% Off',
    reward: 'Upto 15% rewards',
    href: '/stores#zivame',
  },
  {
    id: 'dir-zomato',
    name: 'Zomato',
    slug: 'zomato',
    logo: zomatoLogo,
    category: 'Food & Dining',
    categorySlug: 'food',
    subcategory: 'Food Delivery',
    letter: 'Z',
    discount: 'Flat 50 Off',
    reward: 'Flat 50 off',
    href: '/stores#zomato',
  },
]
