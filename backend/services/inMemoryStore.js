const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'dev_store.json');

// In-memory fallback store for development when MongoDB is not connected
let deals = [
  // No dummy data - only executive-uploaded deals appear here
];

let coupons = [
  // No dummy data - only executive-uploaded coupons appear here
];

let lootDeals = [
  // No dummy data - only executive-uploaded loot deals appear here
];

let stores = [
  { _id: '1', name: 'Ajio', category: 'Fashion', reward: 'Upto 5% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '2', name: 'Amazon', category: 'Electronics', reward: 'Upto 7.5% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '3', name: 'Big Basket', category: 'Grocery', reward: 'Upto 4% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '4', name: 'Flipkart', category: 'Electronics', reward: 'Upto 8% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '5', name: 'Myntra', category: 'Fashion', reward: 'Upto 6% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '6', name: 'Nykaa', category: 'Beauty', reward: 'Upto 7% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '7', name: 'Swiggy', category: 'Food', reward: 'Upto 10% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '8', name: 'Zepto', category: 'Grocery', reward: 'Upto 5% rewards', status: 'active', submissionStatus: 'approved' },
  { _id: '9', name: 'Zomato', category: 'Food', reward: 'Upto 8% rewards', status: 'active', submissionStatus: 'approved' }
];

let categories = [
  {
    _id: 'cat-fashion',
    id: 'fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    color: '#FF6B6B',
    bgColor: '#FFE3E3',
    textColor: '#D92626',
    count: 240,
    dealsCount: 240,
    description: 'Explore top trending fashion, apparel, and clothing brands with verified discounts.',
    status: 'active',
    subcategories: [
      { id: 'mens-wear', name: "Men's Wear", slug: 'mens-wear', itemCount: 85 },
      { id: 'womens-wear', name: "Women's Wear", slug: 'womens-wear', itemCount: 95 },
      { id: 'footwear', name: 'Footwear', slug: 'footwear', itemCount: 40 },
      { id: 'accessories', name: 'Fashion Accessories', slug: 'accessories', itemCount: 20 }
    ]
  },
  {
    _id: 'cat-electronics',
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    color: '#4DABF7',
    bgColor: '#E7F5FF',
    textColor: '#1971C2',
    count: 180,
    dealsCount: 180,
    description: 'Laptops, mobile devices, audio gear, and smart home appliances on discount.',
    status: 'active',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones & Mobiles', slug: 'smartphones', itemCount: 60 },
      { id: 'laptops', name: 'Laptops & Computers', slug: 'laptops', itemCount: 45 },
      { id: 'audio', name: 'Headphones & Audio', slug: 'audio', itemCount: 35 },
      { id: 'home-appliances', name: 'Home Appliances', slug: 'home-appliances', itemCount: 40 }
    ]
  },
  {
    _id: 'cat-grocery',
    id: 'grocery',
    name: 'Grocery & Essentials',
    slug: 'grocery',
    color: '#51CF66',
    bgColor: '#EBFBEE',
    textColor: '#2B8A3E',
    count: 120,
    dealsCount: 120,
    description: 'Fresh daily groceries, supermarket items, and quick delivery staples.',
    status: 'active',
    subcategories: [
      { id: 'daily-essentials', name: 'Daily Essentials', slug: 'daily-essentials', itemCount: 50 },
      { id: 'packaged-foods', name: 'Packaged Foods', slug: 'packaged-foods', itemCount: 35 },
      { id: 'beverages', name: 'Beverages & Dairy', slug: 'beverages', itemCount: 35 }
    ]
  },
  {
    _id: 'cat-beauty',
    id: 'beauty',
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    color: '#FCC419',
    bgColor: '#FFF9DB',
    textColor: '#E67700',
    count: 95,
    dealsCount: 95,
    description: 'Cosmetics, skincare, hair products, and luxury perfumes from authentic brands.',
    status: 'active',
    subcategories: [
      { id: 'skincare', name: 'Skincare', slug: 'skincare', itemCount: 35 },
      { id: 'makeup', name: 'Makeup & Cosmetics', slug: 'makeup', itemCount: 30 },
      { id: 'haircare', name: 'Hair Care', slug: 'haircare', itemCount: 20 },
      { id: 'fragrances', name: 'Fragrances & Perfumes', slug: 'fragrances', itemCount: 10 }
    ]
  },
  {
    _id: 'cat-home',
    id: 'home',
    name: 'Home & Furniture',
    slug: 'home',
    color: '#FF922B',
    bgColor: '#FFF4E6',
    textColor: '#D9480F',
    count: 110,
    dealsCount: 110,
    description: 'Furniture, kitchenware, interior decor, and bedding collections.',
    status: 'active',
    subcategories: [
      { id: 'furniture', name: 'Living Room Furniture', slug: 'furniture', itemCount: 45 },
      { id: 'kitchenware', name: 'Cookware & Kitchenware', slug: 'kitchenware', itemCount: 35 },
      { id: 'home-decor', name: 'Home Decor & Lighting', slug: 'home-decor', itemCount: 30 }
    ]
  },
  {
    _id: 'cat-food',
    id: 'food',
    name: 'Food & Dining',
    slug: 'food',
    color: '#FF8787',
    bgColor: '#FFF5F5',
    textColor: '#C92A2A',
    count: 85,
    dealsCount: 85,
    description: 'Food delivery apps, gourmet snacks, dining out vouchers, and restaurant deals.',
    status: 'active',
    subcategories: [
      { id: 'food-delivery', name: 'Food Delivery Apps', slug: 'food-delivery', itemCount: 40 },
      { id: 'dining-offers', name: 'Restaurant Vouchers', slug: 'dining-offers', itemCount: 25 },
      { id: 'gourmet', name: 'Gourmet & Snacks', slug: 'gourmet', itemCount: 20 }
    ]
  },
  {
    _id: 'cat-b2b',
    id: 'b2b',
    name: 'B2B & Wholesale',
    slug: 'b2b',
    color: '#845EF7',
    bgColor: '#F3F0FF',
    textColor: '#5F3DC4',
    count: 50,
    dealsCount: 50,
    description: 'Bulk ordering, enterprise supplies, and trade wholesale platforms.',
    status: 'active',
    subcategories: [
      { id: 'wholesale-trade', name: 'Wholesale Trade', slug: 'wholesale-trade', itemCount: 30 },
      { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies', itemCount: 20 }
    ]
  },
  {
    _id: 'cat-stores',
    id: 'stores',
    name: 'Stores',
    slug: 'stores',
    color: '#0EA5E9',
    bgColor: '#D4F7F2',
    textColor: '#0369A1',
    count: 20,
    dealsCount: 20,
    description: 'Popular brand stores and merchant retail outlets.',
    status: 'active',
    href: '/categories/stores',
    subcategories: [
      { id: 'fashion-stores', name: 'Fashion Stores', slug: 'fashion-stores', itemCount: 10 },
      { id: 'electronics-stores', name: 'Electronics Stores', slug: 'electronics-stores', itemCount: 8 }
    ]
  },
  {
    _id: 'cat-brands',
    id: 'brands',
    name: 'Brands',
    slug: 'brands',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    textColor: '#BE185D',
    count: 48,
    dealsCount: 48,
    description: 'Direct brand stores, flagship collections, and manufacturer discounts.',
    status: 'active',
    href: '/categories/brands',
    subcategories: [
      { id: 'top-brands', name: 'Top Brands', slug: 'top-brands', itemCount: 24 },
      { id: 'premium-brands', name: 'Premium Brands', slug: 'premium-brands', itemCount: 18 }
    ]
  },
  {
    _id: 'cat-banks',
    id: 'banks',
    name: 'Banks',
    slug: 'banks',
    color: '#EAB308',
    bgColor: '#FEF9C3',
    textColor: '#A16207',
    count: 16,
    dealsCount: 16,
    description: 'Leading Indian banks and card payment offers.',
    status: 'active',
    href: '/categories/banks',
    subcategories: [
      { id: 'credit-card-offers', name: 'Credit Card Offers', slug: 'credit-card-offers', itemCount: 10 },
      { id: 'net-banking', name: 'Net Banking Offers', slug: 'net-banking', itemCount: 6 }
    ]
  },
  {
    _id: 'cat-festivals',
    id: 'festivals',
    name: 'Festivals',
    slug: 'festivals',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
    count: 12,
    dealsCount: 12,
    description: 'Festive season mega promotions, Diwali, Holi, and Ramzan sales.',
    status: 'active',
    href: '/categories/festivals',
    subcategories: [
      { id: 'diwali-sales', name: 'Diwali Sales', slug: 'diwali-sales', itemCount: 6 },
      { id: 'seasonal-fests', name: 'Seasonal Festivals', slug: 'seasonal-fests', itemCount: 6 }
    ]
  },
  {
    _id: 'cat-travelling',
    id: 'travelling',
    name: 'Travelling',
    slug: 'travelling',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    textColor: '#0369A1',
    count: 28,
    dealsCount: 28,
    description: 'Airlines, railway bookings, hotels, and holiday packages.',
    status: 'active',
    href: '/categories/travelling',
    subcategories: [
      { id: 'flights', name: 'Flights', slug: 'flights', itemCount: 14 },
      { id: 'hotels', name: 'Hotels & Resorts', slug: 'hotels', itemCount: 14 }
    ]
  },
  {
    _id: 'cat-cities-deals',
    id: 'cities-deals',
    name: 'Cities Deals',
    slug: 'cities-deals',
    color: '#3B82F6',
    bgColor: '#EBF5FF',
    textColor: '#1D4ED8',
    count: 32,
    dealsCount: 32,
    description: 'Hyperlocal discounts and city-specific retail shopping deals.',
    status: 'active',
    href: '/categories/cities-deals',
    subcategories: [
      { id: 'metro-cities', name: 'Metro Cities', slug: 'metro-cities', itemCount: 18 },
      { id: 'tier2-cities', name: 'Tier 2 Cities', slug: 'tier2-cities', itemCount: 14 }
    ]
  }
];

let users = [
  { _id: '1', id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', walletBalance: '₹850', totalCashback: '₹4,250', joinedDate: 'Aug 12, 2026', status: 'verified' },
  { _id: '2', id: 2, name: 'Priya Patel', email: 'priya.patel@outlook.com', walletBalance: '₹1,240', totalCashback: '₹6,180', joinedDate: 'Jul 24, 2026', status: 'verified' },
  { _id: '3', id: 3, name: 'Amit Kumar', email: 'amit.k@gmail.com', walletBalance: '₹320', totalCashback: '₹1,900', joinedDate: 'Aug 29, 2026', status: 'active' },
  { _id: '4', id: 4, name: 'Sneha Verma', email: 'sneha.v@yahoo.com', walletBalance: '₹2,450', totalCashback: '₹12,400', joinedDate: 'Jun 10, 2026', status: 'verified' },
  { _id: '5', id: 5, name: 'Vikram Mehta', email: 'v.mehta@gmail.com', walletBalance: '₹150', totalCashback: '₹890', joinedDate: 'Sep 01, 2026', status: 'active' },
  { _id: '6', id: 6, name: 'Karan Malhotra', email: 'karan.m@gmail.com', walletBalance: '₹0', totalCashback: '₹0', joinedDate: 'Sep 06, 2026', status: 'suspended' }
];

let transactions = [
  { _id: 'TXN-9021', id: 'TXN-9021', transactionId: 'TXN-9021', user: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', type: 'Cashback', amount: '₹250', status: 'Completed', time: '5 mins ago' },
  { _id: 'TXN-9020', id: 'TXN-9020', transactionId: 'TXN-9020', user: 'Priya Patel', email: 'priya.patel@outlook.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '18 mins ago' },
  { _id: 'TXN-9019', id: 'TXN-9019', transactionId: 'TXN-9019', user: 'Amit Kumar', email: 'amit.k@gmail.com', type: 'Cashback', amount: '₹120', status: 'Completed', time: '1 hr ago' },
  { _id: 'TXN-9018', id: 'TXN-9018', transactionId: 'TXN-9018', user: 'Sneha Verma', email: 'sneha.v@yahoo.com', type: 'Redemption', amount: '₹1,200', status: 'Completed', time: '2 hrs ago' },
  { _id: 'TXN-9017', id: 'TXN-9017', transactionId: 'TXN-9017', user: 'Vikram Mehta', email: 'v.mehta@gmail.com', type: 'Referral', amount: '₹150', status: 'Completed', time: '4 hrs ago' },
  { _id: 'TXN-9016', id: 'TXN-9016', transactionId: 'TXN-9016', user: 'Ananya Roy', email: 'ananya.roy@gmail.com', type: 'Cashback', amount: '₹340', status: 'Completed', time: '6 hrs ago' },
  { _id: 'TXN-9015', id: 'TXN-9015', transactionId: 'TXN-9015', user: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', type: 'Redemption', amount: '₹750', status: 'Pending', time: '8 hrs ago' }
];

let creditCards = [
  {
    _id: 'indusind-bank',
    id: 'indusind-bank',
    cardName: 'IndusInd Bank Credit Card',
    bank: 'IndusInd Bank',
    network: 'Visa',
    tier: 'Premium',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/indusind_bank.png',
    welcomeOffer: 'Upto 5% Cashback',
    rewardRate: 'Exclusive Rewards',
    keyBenefits: [
      'Upto 5% Cashback',
      'Exclusive Rewards',
      'Zero liability on lost card'
    ],
    partnerBrands: ['Shopping', 'Travel', 'Dining'],
    affiliateLink: '#',
    annualFee: '₹0',
    joiningFee: '₹0',
    feeWaiver: 'Lifetime Free',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'featured',
    isFeatured: true,
    isVerified: true,
    applyCount: 2400,
    viewCount: 19800,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-09-01T14:30:00.000Z'
  },
  {
    _id: 'icici-bank',
    id: 'icici-bank',
    cardName: 'ICICI Credit Card',
    bank: 'ICICI Bank',
    network: 'Visa',
    tier: 'Classic',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/ICICI_bank.png',
    welcomeOffer: 'Upto 5% Cashback',
    rewardRate: 'Earn Reward Points',
    keyBenefits: [
      'Upto 5% Cashback',
      'Earn Reward Points',
      'Lifetime Free Card'
    ],
    partnerBrands: ['Amazon', 'Flipkart', 'Swiggy'],
    affiliateLink: '#',
    annualFee: 'Lifetime Free',
    joiningFee: '₹0',
    feeWaiver: 'Always Free (Lifetime Free Card)',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'featured',
    isFeatured: true,
    isVerified: true,
    applyCount: 2400,
    viewCount: 21100,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-09-01T11:20:00.000Z'
  },
  {
    _id: 'idfc-bank',
    id: 'idfc-bank',
    cardName: 'IDFC Credit Card',
    bank: 'IDFC First Bank',
    network: 'Visa',
    tier: 'Premium',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/IDFC_back.png',
    welcomeOffer: 'Never Expiring Rewards',
    rewardRate: 'Lifetime Free',
    keyBenefits: [
      'Never Expiring Rewards',
      'Lifetime Free',
      'Zero Annual Fee'
    ],
    partnerBrands: ['All Round Spends'],
    affiliateLink: '#',
    annualFee: 'Lifetime Free',
    joiningFee: '₹0',
    feeWaiver: 'Always Free (Lifetime Free Card)',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'active',
    isFeatured: true,
    isVerified: true,
    applyCount: 2400,
    viewCount: 16500,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T12:00:00.000Z',
    updatedAt: '2026-09-01T09:40:00.000Z'
  },
  {
    _id: 'tata-neu-1',
    id: 'tata-neu-1',
    cardName: 'Tata Neu Card',
    bank: 'TataNeu',
    network: 'Rupay',
    tier: 'Premium',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/Tata_neu.svg',
    welcomeOffer: 'Up to 10% NeuCoins',
    rewardRate: 'Lifetime Free Offers',
    keyBenefits: [
      'Up to 10% NeuCoins',
      'Lifetime Free Offers',
      'Domestic airport lounge access'
    ],
    partnerBrands: ['Shopping', 'Travel', 'Dining'],
    affiliateLink: '#',
    annualFee: '₹0',
    joiningFee: '₹0',
    feeWaiver: 'Lifetime Free',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'active',
    isFeatured: false,
    isVerified: true,
    applyCount: 2400,
    viewCount: 18000,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T14:00:00.000Z',
    updatedAt: '2026-09-01T16:00:00.000Z'
  },
  {
    _id: 'axis-bank',
    id: 'axis-bank',
    cardName: 'Axis Credit Card',
    bank: 'Axis Bank',
    network: 'Mastercard',
    tier: 'Classic',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/Axis_Bank.png',
    welcomeOffer: 'Up to 7.5% Cashback',
    rewardRate: 'Flat ₹1,400 Rewards',
    keyBenefits: [
      'Up to 7.5% Cashback',
      'Flat ₹1,400 Rewards',
      'Cashback on online spends'
    ],
    partnerBrands: ['Amazon', 'Flipkart', 'Swiggy'],
    affiliateLink: '#',
    annualFee: '₹0',
    joiningFee: '₹0',
    feeWaiver: 'Lifetime Free',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'active',
    isFeatured: false,
    isVerified: true,
    applyCount: 2400,
    viewCount: 19500,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-09-01T14:00:00.000Z'
  },
  {
    _id: 'tata-neu-2',
    id: 'tata-neu-2',
    cardName: 'Tata Neu Card',
    bank: 'TataNeu',
    network: 'Mastercard',
    tier: 'Super Premium',
    imageUrl: '',
    bankLogoUrl: '/src/assets/creditcardpage/Bajaj-Finsery.png',
    welcomeOffer: 'Up to 10% NeuCoins',
    rewardRate: 'Lifetime Free Offers',
    keyBenefits: [
      'Up to 10% NeuCoins',
      'Lifetime Free Offers',
      'Shopping, Travel, Dining rewards'
    ],
    partnerBrands: ['Shopping', 'Travel', 'Dining'],
    affiliateLink: '#',
    annualFee: '₹0',
    joiningFee: '₹0',
    feeWaiver: 'Lifetime Free',
    offerStartDate: '2026-01-01',
    offerExpiryDate: '2026-12-31',
    lastUpdated: '2026-09-01',
    status: 'active',
    isFeatured: false,
    isVerified: true,
    applyCount: 2400,
    viewCount: 17200,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-09-01T14:00:00.000Z'
  }
];

let banners = [
  {
    _id: 'banner-1',
    id: 'banner-1',
    title: 'Great Indian Festival & Big Billion Days Mega Sale',
    targetPage: 'home',
    badgeText: 'FESTIVE BONANZA 2026',
    headingLine1: 'UP TO 85% OFF +',
    headingLine2: 'EXTRA 10% BANK CASHBACK',
    headingLine3: 'ON TOP BRANDS & GADGETS',
    description: 'Stack exclusive Wouchify coupon codes with bank discounts on Amazon, Flipkart, Myntra & more.',
    ctaText: 'Shop Festive Deals',
    targetLink: '/deals?category=Electronics',
    primaryImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=80',
    backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop&q=80',
    dealChip1: '⚡ Instant ₹1,000 Off on SBI & HDFC Cards',
    dealChip2: '🔥 100% Verified Cashback Tracking',
    themeColor: '#4F46E5',
    priority: 1,
    status: 'active',
    expiryDate: '2026-10-31',
    views: 124500,
    clicks: 18920,
    submittedBy: 'marketing@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z'
  },
  {
    _id: 'banner-2',
    id: 'banner-2',
    title: 'Super Credit Card Offers & Welcome Vouchers',
    targetPage: 'credit-cards',
    badgeText: 'HOT FINTECH REWARDS',
    headingLine1: 'APPLY & GET ₹2,500',
    headingLine2: 'AMAZON VOUCHERS',
    headingLine3: 'ZERO JOINING FEE CARDS',
    description: 'Compare 50+ credit cards with high reward rates, lounge perks, and instant approval links.',
    ctaText: 'Compare Credit Cards',
    targetLink: '/credit-cards',
    primaryImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    secondaryImage: '',
    backgroundImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    dealChip1: '💳 Lifetime Free Cards Available',
    dealChip2: '✈️ Unlimited Airport Lounge Access',
    themeColor: '#059669',
    priority: 2,
    status: 'active',
    expiryDate: '2026-12-31',
    views: 64200,
    clicks: 8430,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z'
  },
  {
    _id: 'banner-3',
    id: 'banner-3',
    title: 'Foodie Weekend Carnival: Flat 60% OFF',
    targetPage: 'home',
    badgeText: 'WEEKEND SPECIAL',
    headingLine1: 'FLAT ₹150 OFF +',
    headingLine2: 'FREE DELIVERY',
    headingLine3: 'ON SWIGGY & ZOMATO',
    description: 'Order food, snacks, and midnight desserts with exclusive weekend promo codes.',
    ctaText: 'Grab Food Coupons',
    targetLink: '/coupons?category=Food',
    primaryImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    secondaryImage: '',
    backgroundImage: '',
    dealChip1: '🍔 Code: WOUCH50',
    dealChip2: '⏱️ 20 Min Flash Delivery',
    themeColor: '#EA580C',
    priority: 3,
    status: 'active',
    expiryDate: '2026-09-30',
    views: 45000,
    clicks: 6100,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-08T00:00:00.000Z',
    updatedAt: '2026-09-14T09:00:00.000Z'
  }
];

let advertisements = [
  {
    _id: 'ad-wouchify-mega-sale',
    id: 'ad-wouchify-mega-sale',
    title: 'Wouchify Mega Sale & Cashback Bonanza',
    advertiser: 'Wouchify',
    placement: 'homepage-banner-1713x685',
    imageUrl: '/src/assets/advertisement/image-7.png',
    targetLink: '/offers/sale',
    ctaText: 'Explore Deals',
    badgeText: 'FEATURED',
    pricingModel: 'Flat Monthly',
    budgetOrRate: '₹50,000 / month',
    status: 'active',
    expiryDate: '2026-12-31',
    impressions: 145000,
    clicks: 9240,
    submittedBy: 'marketing@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-15T07:00:00.000Z'
  },
  {
    _id: 'ad-amazon-great-indian',
    id: 'ad-amazon-great-indian',
    title: 'Amazon Great Indian Festival - Up to 80% Off + 7.5% Cashback',
    advertiser: 'Amazon India',
    placement: 'homepage-banner-1713x685',
    imageUrl: '/src/assets/store-promos/amazon_banner.png',
    targetLink: '/stores#amazon',
    ctaText: 'Shop Amazon Deals',
    badgeText: 'HOT SALE',
    pricingModel: 'CPC',
    budgetOrRate: '₹15 / click',
    status: 'active',
    expiryDate: '2026-11-30',
    impressions: 98400,
    clicks: 6120,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z'
  },
  {
    _id: 'ad-flipkart-bbd',
    id: 'ad-flipkart-bbd',
    title: 'Flipkart Big Billion Days - Extra ₹1,500 Bank Discount',
    advertiser: 'Flipkart',
    placement: 'homepage-banner-1713x685',
    imageUrl: '/src/assets/store-promos/filpkart_banner.png',
    targetLink: '/stores#flipkart',
    ctaText: 'Grab Flipkart Loot',
    badgeText: 'TOP DEALS',
    pricingModel: 'CPC',
    budgetOrRate: '₹18 / click',
    status: 'active',
    expiryDate: '2026-11-20',
    impressions: 87300,
    clicks: 5430,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-03T00:00:00.000Z',
    updatedAt: '2026-09-13T11:00:00.000Z'
  },
  {
    _id: 'ad-ajio-all-stars',
    id: 'ad-ajio-all-stars',
    title: 'Ajio All Stars Sale - Flat 50% to 90% Off Fashion',
    advertiser: 'Ajio',
    placement: 'leaderboard-728x90',
    imageUrl: '/src/assets/store-promos/ajio_banner.png',
    targetLink: '/stores#ajio',
    ctaText: 'Shop Trendy Fashion',
    badgeText: 'TRENDING',
    pricingModel: 'Affiliate',
    budgetOrRate: '12% Commission',
    status: 'active',
    expiryDate: '2026-12-15',
    impressions: 64500,
    clicks: 3890,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-04T00:00:00.000Z',
    updatedAt: '2026-09-14T09:00:00.000Z'
  },
  {
    _id: 'ad-firstcry-carnival',
    id: 'ad-firstcry-carnival',
    title: 'FirstCry Mega Baby Carnival - Up to 65% Off',
    advertiser: 'FirstCry',
    placement: 'store-card-360x180',
    imageUrl: '/src/assets/store-promos/firtcry_banner.png',
    targetLink: '/stores#firstcry',
    ctaText: 'Explore Baby Gear',
    badgeText: 'EXCLUSIVE',
    pricingModel: 'CPM',
    budgetOrRate: '₹75 / 1k imp',
    status: 'active',
    expiryDate: '2026-10-31',
    impressions: 41200,
    clicks: 2150,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-14T14:00:00.000Z'
  },
  {
    _id: 'ad-croma-clearance',
    id: 'ad-croma-clearance',
    title: 'Croma Electronics Super Clearance - Flat ₹5,000 Off',
    advertiser: 'Croma',
    placement: 'sidebar-300x250',
    imageUrl: '/src/assets/recent-deals/banner_1.png',
    targetLink: '/deals',
    ctaText: 'Claim Tech Offer',
    badgeText: 'FLASH DEAL',
    pricingModel: 'CPC',
    budgetOrRate: '₹10 / click',
    status: 'active',
    expiryDate: '2026-11-15',
    impressions: 32000,
    clicks: 1680,
    submittedBy: 'executive@wouchify.com',
    submissionStatus: 'approved',
    createdAt: '2026-09-06T00:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z'
  }
];

let submissions = [
  {
    _id: 'sub-101',
    id: 'sub-101',
    entityType: 'deal',
    entityId: '4',
    action: 'create',
    title: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders',
    store: 'Swiggy',
    category: 'Food & Dining',
    priority: 'High',
    submittedBy: 'executive@wouchify.com',
    submittedByName: 'Rohan Gupta (Deal Executive)',
    submittedAt: '2026-09-15T09:15:00.000Z',
    status: 'Pending Approval',
    rejectionReason: '',
    reviewedBy: '',
    reviewedAt: null,
    notes: 'Verified against Swiggy active merchant coupon code gourmet50. High CTR expected.',
    dataSnapshot: {
      name: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders',
      store: 'Swiggy',
      category: 'Food',
      price: '₹250',
      originalPrice: '₹500',
      discount: '50% OFF',
      expiry: 'Sep 30, 2026'
    },
    createdAt: '2026-09-15T09:15:00.000Z',
    updatedAt: '2026-09-15T09:15:00.000Z'
  },
  {
    _id: 'sub-102',
    id: 'sub-102',
    entityType: 'credit_card',
    entityId: 'card-4',
    action: 'create',
    title: 'Axis Bank Atlas Credit Card - Miles Program',
    store: 'Axis Bank',
    category: 'Finance',
    priority: 'Critical',
    submittedBy: 'executive@wouchify.com',
    submittedByName: 'Ananya Sharma (Fintech Ops)',
    submittedAt: '2026-09-14T14:20:00.000Z',
    status: 'Approved',
    rejectionReason: '',
    reviewedBy: 'manager@wouchify.com',
    reviewedAt: '2026-09-14T16:00:00.000Z',
    notes: 'All milestone terms and lounge access verified with Axis Bank official affiliate brochure.',
    dataSnapshot: {
      cardName: 'Axis Bank Atlas Credit Card',
      bank: 'Axis Bank',
      network: 'Visa',
      tier: 'Super Premium',
      annualFee: '₹5,000 + GST'
    },
    createdAt: '2026-09-14T14:20:00.000Z',
    updatedAt: '2026-09-14T16:00:00.000Z'
  },
  {
    _id: 'sub-103',
    id: 'sub-103',
    entityType: 'coupon',
    entityId: 'c-draft-9',
    action: 'create',
    title: 'FLIPKART500 - ₹500 Off on Fashion Sale',
    store: 'Flipkart',
    category: 'Fashion & Apparel',
    priority: 'Normal',
    submittedBy: 'executive2@wouchify.com',
    submittedByName: 'Vikram Sen (Content Executive)',
    submittedAt: '2026-09-13T11:00:00.000Z',
    status: 'Rejected',
    rejectionReason: 'Coupon code failed live verification test: Expired promo code on merchant cart page.',
    reviewedBy: 'manager@wouchify.com',
    reviewedAt: '2026-09-13T12:30:00.000Z',
    notes: 'Please re-verify with updated valid code for Flipkart Big Billion Days.',
    dataSnapshot: {
      code: 'FLIPKART500',
      store: 'Flipkart',
      discount: '₹500 OFF',
      category: 'Fashion'
    },
    createdAt: '2026-09-13T11:00:00.000Z',
    updatedAt: '2026-09-13T12:30:00.000Z'
  },
  {
    _id: 'sub-104',
    id: 'sub-104',
    entityType: 'banner',
    entityId: 'banner-1',
    action: 'update',
    title: 'Update Festive Hero Banner for Big Billion Days',
    store: 'Multi-Store',
    category: 'Marketing',
    priority: 'Critical',
    submittedBy: 'marketing@wouchify.com',
    submittedByName: 'Pooja Verma (Growth Lead)',
    submittedAt: '2026-09-15T08:00:00.000Z',
    status: 'Approved',
    rejectionReason: '',
    reviewedBy: 'manager@wouchify.com',
    reviewedAt: '2026-09-15T08:30:00.000Z',
    notes: 'Updated banner graphic assets and copy for festive season launch.',
    dataSnapshot: {
      title: 'Great Indian Festival & Big Billion Days Mega Sale',
      targetPage: 'home',
      priority: 1
    },
    createdAt: '2026-09-15T08:00:00.000Z',
    updatedAt: '2026-09-15T08:30:00.000Z'
  }
];

let supportTickets = [
  {
    _id: 'TICK-801',
    id: 'TICK-801',
    ticketId: 'TICK-801',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@gmail.com',
    category: 'Cashback Dispute',
    subject: 'Missing Cashback for Amazon Order #402-981273-19',
    priority: 'High',
    status: 'In Progress',
    orderId: 'AMZ-402-981273',
    disputeAmount: '₹350',
    assignedTo: 'Kavita Nair (Support Ops)',
    messages: [
      {
        sender: 'user',
        senderName: 'Rahul Sharma',
        time: '2026-09-14T10:30:00.000Z',
        text: 'I placed an order on Amazon for ₹7,000 using Wouchify affiliate link on 12th Sept, but cashback of ₹350 is not tracking in my wallet.'
      },
      {
        sender: 'support',
        senderName: 'Kavita Nair',
        time: '2026-09-14T11:45:00.000Z',
        text: 'Hello Rahul, we have escalated this transaction to Amazon affiliate network team with your click reference ID. Investigation turnaround is typically 48 hours.'
      }
    ],
    createdAt: '2026-09-14T10:30:00.000Z',
    updatedAt: '2026-09-14T11:45:00.000Z'
  },
  {
    _id: 'TICK-802',
    id: 'TICK-802',
    ticketId: 'TICK-802',
    userName: 'Priya Patel',
    userEmail: 'priya.patel@outlook.com',
    category: 'Withdrawal / Payout',
    subject: 'UPI Payout delayed for ₹500 redemption',
    priority: 'Urgent',
    status: 'Open',
    orderId: 'TXN-9020',
    disputeAmount: '₹500',
    assignedTo: 'Rohan Gupta',
    messages: [
      {
        sender: 'user',
        senderName: 'Priya Patel',
        time: '2026-09-15T09:00:00.000Z',
        text: 'I requested UPI payout of ₹500 to priya.patel@okhdfcbank earlier today. Status still shows Pending.'
      }
    ],
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-09-15T09:00:00.000Z'
  },
  {
    _id: 'TICK-803',
    id: 'TICK-803',
    ticketId: 'TICK-803',
    userName: 'Amit Kumar',
    userEmail: 'amit.k@gmail.com',
    category: 'Coupon Inquiry',
    subject: 'WOUCH50 coupon code error on Swiggy App',
    priority: 'Medium',
    status: 'Resolved',
    orderId: '',
    disputeAmount: '₹150',
    assignedTo: 'Kavita Nair',
    messages: [
      {
        sender: 'user',
        senderName: 'Amit Kumar',
        time: '2026-09-13T14:10:00.000Z',
        text: 'Swiggy said the coupon WOUCH50 is valid only on orders above ₹299.'
      },
      {
        sender: 'support',
        senderName: 'Kavita Nair',
        time: '2026-09-13T15:00:00.000Z',
        text: 'Hi Amit, that is correct. We have updated the terms and conditions badge on the coupon card to clarify the ₹299 min order limit.'
      }
    ],
    createdAt: '2026-09-13T14:10:00.000Z',
    updatedAt: '2026-09-13T15:00:00.000Z'
  }
];

let cashbackClaims = [
  {
    _id: 'CLM-501',
    id: 'CLM-501',
    claimId: 'CLM-501',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.sharma@gmail.com',
    store: 'Amazon',
    orderId: 'OD-892173-AMZ',
    orderAmount: '₹4,999',
    cashbackAmount: '₹375',
    claimedAt: '2026-09-14T10:00:00.000Z',
    status: 'Approved',
    payoutMethod: 'UPI',
    payoutDetails: 'rahul.sharma@okaxis',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'Invoice verified with merchant click timestamp.',
    reviewedBy: 'manager@wouchify.com',
    createdAt: '2026-09-14T10:00:00.000Z',
    updatedAt: '2026-09-14T15:30:00.000Z'
  },
  {
    _id: 'CLM-502',
    id: 'CLM-502',
    claimId: 'CLM-502',
    userName: 'Sneha Verma',
    userEmail: 'sneha.v@yahoo.com',
    store: 'Myntra',
    orderId: 'MYN-29182736',
    orderAmount: '₹2,499',
    cashbackAmount: '₹150',
    claimedAt: '2026-09-15T08:20:00.000Z',
    status: 'Pending',
    payoutMethod: 'Bank Transfer',
    payoutDetails: 'HDFC0001234 - AC 50100492817261',
    receiptUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    notes: 'Under review by ops team.',
    reviewedBy: '',
    createdAt: '2026-09-15T08:20:00.000Z',
    updatedAt: '2026-09-15T08:20:00.000Z'
  },
  {
    _id: 'CLM-503',
    id: 'CLM-503',
    claimId: 'CLM-503',
    userName: 'Vikram Mehta',
    userEmail: 'v.mehta@gmail.com',
    store: 'Swiggy',
    orderId: 'SWG-91028374',
    orderAmount: '₹650',
    cashbackAmount: '₹65',
    claimedAt: '2026-09-13T18:00:00.000Z',
    status: 'Processed',
    payoutMethod: 'UPI',
    payoutDetails: 'vmehta@paytm',
    receiptUrl: '',
    notes: 'Cashback paid via UPI reference UPI-78192019.',
    reviewedBy: 'manager@wouchify.com',
    createdAt: '2026-09-13T18:00:00.000Z',
    updatedAt: '2026-09-14T09:10:00.000Z'
  }
];

let staffMembers = [
  {
    _id: 'staff-balaji',
    id: 'staff-balaji',
    name: 'Balaji',
    email: 'balaji@wouchify.com',
    password: 'staff123',
    role: 'executive',
    domain: 'Deals & Loot Deals',
    status: 'Online',
    submissionsToday: 12,
    totalSubmissions: 145,
    approvalRate: '98%',
    rejectionsCount: 3,
    avgTurnaround: '10m',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-09-15T09:00:00.000Z'
  },
  {
    _id: 'staff-jayanth',
    id: 'staff-jayanth',
    name: 'Jayanth',
    email: 'jayanth@wouchify.com',
    password: 'staff123',
    role: 'executive',
    domain: 'Coupons & Credit Cards',
    status: 'Online',
    submissionsToday: 9,
    totalSubmissions: 120,
    approvalRate: '97%',
    rejectionsCount: 4,
    avgTurnaround: '12m',
    createdAt: '2026-06-15T00:00:00.000Z',
    updatedAt: '2026-09-15T09:30:00.000Z'
  },
  {
    _id: 'staff-ops-manager',
    id: 'staff-ops-manager',
    name: 'Operational Manager',
    email: 'ops.manager@wouchify.com',
    password: 'staff123',
    role: 'operational_manager',
    domain: 'Approvals & Quality Assurance',
    status: 'Online',
    submissionsToday: 21,
    totalSubmissions: 580,
    approvalRate: '99%',
    rejectionsCount: 7,
    avgTurnaround: '8m',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-09-15T08:45:00.000Z'
  },
  {
    _id: 'staff-manager',
    id: 'staff-manager',
    name: 'Manager',
    email: 'manager@wouchify.com',
    password: 'staff123',
    role: 'manager',
    domain: 'Platform Administration & Team Management',
    status: 'Online',
    submissionsToday: 0,
    totalSubmissions: 940,
    approvalRate: '100%',
    rejectionsCount: 0,
    avgTurnaround: '5m',
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-09-15T09:40:00.000Z'
  }
];

function saveToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const payload = { 
      deals, 
      coupons, 
      lootDeals, 
      stores, 
      categories, 
      users, 
      transactions,
      creditCards,
      banners,
      advertisements,
      submissions,
      supportTickets,
      cashbackClaims,
      staffMembers
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save inMemoryStore to disk:', err.message);
  }
}

function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.deals) && data.deals.length > 0) deals = data.deals;
      if (Array.isArray(data.coupons) && data.coupons.length > 0) coupons = data.coupons;
      if (Array.isArray(data.lootDeals) && data.lootDeals.length > 0) lootDeals = data.lootDeals;
      if (Array.isArray(data.stores) && data.stores.length > 0) stores = data.stores;
      if (Array.isArray(data.categories) && data.categories.length > 0) categories = data.categories;
      if (Array.isArray(data.users) && data.users.length > 0) users = data.users;
      if (Array.isArray(data.transactions) && data.transactions.length > 0) transactions = data.transactions;
      if (Array.isArray(data.creditCards) && data.creditCards.length > 0) creditCards = data.creditCards;
      if (Array.isArray(data.banners) && data.banners.length > 0) banners = data.banners;
      if (Array.isArray(data.advertisements) && data.advertisements.length > 0) advertisements = data.advertisements;
      if (Array.isArray(data.submissions) && data.submissions.length > 0) submissions = data.submissions;
      if (Array.isArray(data.supportTickets) && data.supportTickets.length > 0) supportTickets = data.supportTickets;
      if (Array.isArray(data.cashbackClaims) && data.cashbackClaims.length > 0) cashbackClaims = data.cashbackClaims;
      if (Array.isArray(data.staffMembers) && data.staffMembers.length > 0) staffMembers = data.staffMembers;
      console.log(`Loaded persisted store from ${DATA_FILE}`);
    }
  } catch (err) {
    console.error('Failed to load inMemoryStore from disk:', err.message);
  }
}

// Load initial persisted data
loadFromDisk();

module.exports = {
  // Deals
  getDeals: (filter = {}) => {
    let result = [...deals];
    if (filter.all !== 'true') {
      const now = Date.now();
      result = result.filter(d => {
        if ((d.submissionStatus !== undefined && d.submissionStatus !== 'approved')) return false;
        if ((d.status || 'active').toLowerCase() !== 'active' && (d.status || '').toLowerCase() !== 'scheduled') return false;
        // Scheduling: hide items whose publishAt is more than 60s in the future
        if (d.publishAt) {
          const pubTime = new Date(d.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        // Expiry: hide expired items
        if (d.expiresAt) {
          const expTime = new Date(d.expiresAt).getTime();
          if (!isNaN(expTime) && expTime < now) return false;
        }
        return true;
      });
    }
    if (filter.category && filter.category !== 'All') {
      result = result.filter(d => d.category && d.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(d => d.status && d.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  addDeal: (item) => {
    const id = item.id ? String(item.id) : (item._id ? String(item._id) : `deal-${Date.now()}`);
    const created = { 
      _id: id, 
      id, 
      status: item.status || 'pending',
      submissionStatus: item.submissionStatus || 'pending_approval',
      opsManagerApproval: item.opsManagerApproval || 'Pending',
      managerApproval: item.managerApproval || 'Pending',
      createdAt: item.createdAt || new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
      ...item 
    };
    const existingIdx = deals.findIndex(d => d._id === id || String(d.id) === String(id) || (item.name && d.name && d.name.toLowerCase().trim() === item.name.toLowerCase().trim()));
    if (existingIdx !== -1) {
      deals[existingIdx] = { ...deals[existingIdx], ...created, updatedAt: new Date().toISOString() };
      saveToDisk();
      return deals[existingIdx];
    }
    deals.unshift(created);
    saveToDisk();
    return created;
  },
  updateDeal: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = deals.findIndex(d => 
      String(d._id).toLowerCase() === target || 
      String(d.id).toLowerCase() === target || 
      (updates.name && d.name && d.name.toLowerCase().trim() === updates.name.toLowerCase().trim()) ||
      (updates.title && d.title && d.title.toLowerCase().trim() === updates.title.toLowerCase().trim())
    );
    if (idx === -1) return null;
    deals[idx] = { ...deals[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return deals[idx];
  },
  deleteDeal: (id) => {
    const idx = deals.findIndex(d => String(d._id).toLowerCase() === String(id).toLowerCase() || String(d.id).toLowerCase() === String(id).toLowerCase());
    if (idx === -1) return false;
    deals.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleDealStatus: (id) => {
    const deal = deals.find(d => String(d._id).toLowerCase() === String(id).toLowerCase() || String(d.id).toLowerCase() === String(id).toLowerCase());
    if (!deal) return null;
    deal.status = deal.status === 'active' ? 'pending' : 'active';
    deal.updatedAt = new Date().toISOString();
    saveToDisk();
    return deal;
  },
  incrementDealClicks: (id) => {
    const deal = deals.find(d => String(d._id).toLowerCase() === String(id).toLowerCase() || String(d.id).toLowerCase() === String(id).toLowerCase());
    if (!deal) return null;
    deal.clicks = (deal.clicks || 0) + 1;
    deal.updatedAt = new Date().toISOString();
    saveToDisk();
    return deal;
  },

  // Coupons
  getCoupons: (filter = {}) => {
    let result = [...coupons];
    if (filter.all !== 'true') {
      const now = Date.now();
      result = result.filter(c => {
        if ((c.submissionStatus !== undefined && c.submissionStatus !== 'approved')) return false;
        if (c.status === 'pending' || c.status === 'rejected' || c.status === 'inactive') return false;
        if (c.opsManagerApproval === 'Rejected') return false;
        // Scheduling: hide items whose publishAt is more than 60s in the future
        if (c.publishAt) {
          const pubTime = new Date(c.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        // Expiry: hide expired items
        if (c.expiresAt) {
          const expTime = new Date(c.expiresAt).getTime();
          if (!isNaN(expTime) && expTime < now) return false;
        }
        return true;
      });
    }
    if (filter.store && filter.store !== 'All') {
      result = result.filter(c => c.store && c.store.toLowerCase() === filter.store.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(c => c.status && c.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  addCoupon: (item) => {
    const id = item.id ? String(item.id) : (item.code ? `coupon-${item.code.toLowerCase()}` : `coupon-${Date.now()}`);
    const created = { 
      _id: id, 
      id: item.id || id, 
      code: (item.code || '').toUpperCase().trim(),
      usageCount: 0, 
      usageLimit: 1000, 
      status: 'active', 
      opsManagerApproval: 'Approved',
      managerApproval: 'Approved',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item 
    };
    coupons.unshift(created);
    saveToDisk();
    return created;
  },
  updateCoupon: (id, updates) => {
    const target = String(id).trim().toLowerCase();
    const idx = coupons.findIndex(c => 
      String(c._id).toLowerCase() === target || 
      String(c.id).toLowerCase() === target || 
      String(c.code).toLowerCase() === target
    );
    if (idx === -1) return null;
    coupons[idx] = { ...coupons[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return coupons[idx];
  },
  deleteCoupon: (id) => {
    const target = String(id).trim().toLowerCase();
    const initialLen = coupons.length;
    coupons = coupons.filter(c => 
      String(c._id).toLowerCase() !== target && 
      String(c.id).toLowerCase() !== target && 
      String(c.code).toLowerCase() !== target
    );
    if (coupons.length !== initialLen) {
      saveToDisk();
      return true;
    }
    return false;
  },
  approveCoupon: (id, role) => {
    const target = String(id).trim().toLowerCase();
    const coupon = coupons.find(c => 
      String(c._id).toLowerCase() === target || 
      String(c.id).toLowerCase() === target || 
      String(c.code).toLowerCase() === target
    );
    if (!coupon) return null;
    if (role === 'opsManager') coupon.opsManagerApproval = 'Approved';
    if (role === 'manager') coupon.managerApproval = 'Approved';
    if (coupon.opsManagerApproval === 'Approved' && coupon.managerApproval === 'Approved') {
      coupon.status = 'active';
      coupon.submissionStatus = 'approved';
    }
    saveToDisk();
    return coupon;
  },
  rejectCoupon: (id, role) => {
    const target = String(id).trim().toLowerCase();
    const coupon = coupons.find(c => 
      String(c._id).toLowerCase() === target || 
      String(c.id).toLowerCase() === target || 
      String(c.code).toLowerCase() === target
    );
    if (!coupon) return null;
    if (role === 'opsManager') coupon.opsManagerApproval = 'Rejected';
    if (role === 'manager') coupon.managerApproval = 'Rejected';
    coupon.status = 'rejected';
    coupon.submissionStatus = 'rejected';
    saveToDisk();
    return coupon;
  },

  // Loot Deals
  getLootDeals: (filter = {}) => {
    let result = [...lootDeals];
    if (filter.all !== 'true') {
      const now = Date.now();
      result = result.filter(l => {
        if ((l.submissionStatus !== undefined && l.submissionStatus !== 'approved')) return false;
        if (l.status === 'pending' || l.status === 'rejected' || l.status === 'inactive') return false;
        // Scheduling: hide items whose publishAt is more than 60s in the future
        if (l.publishAt) {
          const pubTime = new Date(l.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        // Expiry: hide expired items
        if (l.expiresAt) {
          const expTime = new Date(l.expiresAt).getTime();
          if (!isNaN(expTime) && expTime < now) return false;
        }
        return true;
      });
    }
    if (filter.dealType && filter.dealType !== 'All') {
      result = result.filter(l => l.dealType === filter.dealType);
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  addLootDeal: (item) => {
    const id = `loot-${Date.now()}`;
    const created = { _id: id, id, status: 'active', createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), ...item };
    lootDeals.unshift(created);
    saveToDisk();
    return created;
  },
  updateLootDeal: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = lootDeals.findIndex(l => String(l._id).toLowerCase() === target || String(l.id).toLowerCase() === target || (updates.title && l.title && l.title.toLowerCase().trim() === updates.title.toLowerCase().trim()));
    if (idx === -1) return null;
    lootDeals[idx] = { ...lootDeals[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return lootDeals[idx];
  },
  deleteLootDeal: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = lootDeals.findIndex(l => String(l._id).toLowerCase() === target || String(l.id).toLowerCase() === target);
    if (idx === -1) return false;
    lootDeals.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleLootDealStatus: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const loot = lootDeals.find(l => String(l._id).toLowerCase() === target || String(l.id).toLowerCase() === target);
    if (!loot) return null;
    loot.status = loot.status === 'active' ? 'inactive' : 'active';
    loot.updatedAt = new Date().toISOString();
    saveToDisk();
    return loot;
  },
  incrementLootClicks: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const loot = lootDeals.find(l => String(l._id).toLowerCase() === target || String(l.id).toLowerCase() === target);
    if (!loot) return null;
    loot.clicks = (loot.clicks || 0) + 1;
    loot.updatedAt = new Date().toISOString();
    saveToDisk();
    return loot;
  },

  // Stores
  getStores: (filter = {}) => {
    let result = [...stores];
    if (filter.all !== 'true') {
      const now = Date.now();
      result = result.filter(s => {
        if ((s.submissionStatus !== undefined && s.submissionStatus !== 'approved')) return false;
        if (s.status === 'pending' || s.status === 'rejected' || s.status === 'inactive') return false;
        if (s.opsManagerApproval === 'Rejected') return false;
        // Scheduling: hide stores whose publishAt is more than 60s in the future
        if (s.publishAt) {
          const pubTime = new Date(s.publishAt).getTime();
          if (!isNaN(pubTime) && pubTime > now + 60000) return false;
        }
        return true;
      });
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  addStore: (item) => {
    const id = Date.now().toString();
    const created = { 
      _id: id, 
      status: 'pending', 
      opsManagerApproval: 'Pending',
      managerApproval: 'Pending',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item 
    };
    stores.unshift(created);
    saveToDisk();
    return created;
  },
  updateStore: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = stores.findIndex(s => 
      String(s._id).toLowerCase() === target || 
      String(s.id).toLowerCase() === target || 
      (s.slug && s.slug.toLowerCase() === target) || 
      (s.name && s.name.toLowerCase().trim() === target) ||
      (updates.name && s.name && s.name.toLowerCase().trim() === updates.name.toLowerCase().trim())
    );
    if (idx === -1) {
      // If store is not yet in stores array (e.g. from static catalogue), add it with the updates
      const newStore = {
        _id: String(id),
        id: String(id),
        name: updates.name || id,
        slug: updates.slug || String(id).toLowerCase(),
        category: updates.category || 'Shopping',
        showOnHome: updates.showOnHome !== undefined ? updates.showOnHome : true,
        status: updates.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...updates
      };
      stores.unshift(newStore);
      saveToDisk();
      return newStore;
    }
    stores[idx] = { ...stores[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return stores[idx];
  },
  deleteStore: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = stores.findIndex(s => String(s._id).toLowerCase() === target || String(s.id).toLowerCase() === target || (s.name && s.name.toLowerCase().trim() === target));
    if (idx === -1) return false;
    stores.splice(idx, 1);
    saveToDisk();
    return true;
  },
  approveStore: (id, role) => {
    const target = String(id || '').trim().toLowerCase();
    const storeDoc = stores.find(s => String(s._id).toLowerCase() === target || String(s.id).toLowerCase() === target);
    if (!storeDoc) return null;
    if (role === 'opsManager') storeDoc.opsManagerApproval = 'Approved';
    if (role === 'manager') storeDoc.managerApproval = 'Approved';
    if (storeDoc.opsManagerApproval === 'Approved' && storeDoc.managerApproval === 'Approved') {
      storeDoc.status = 'active';
    }
    saveToDisk();
    return storeDoc;
  },
  rejectStore: (id, role) => {
    const target = String(id || '').trim().toLowerCase();
    const storeDoc = stores.find(s => String(s._id).toLowerCase() === target || String(s.id).toLowerCase() === target);
    if (!storeDoc) return null;
    if (role === 'opsManager') storeDoc.opsManagerApproval = 'Rejected';
    if (role === 'manager') storeDoc.managerApproval = 'Rejected';
    storeDoc.status = 'rejected';
    saveToDisk();
    return storeDoc;
  },

  // Categories
  getCategories: (filter = {}) => {
    let result = [...categories];
    if (filter.all !== 'true') {
      result = result.filter(c => (c.submissionStatus === undefined || c.submissionStatus === 'approved') && c.status !== 'pending' && c.status !== 'rejected' && c.opsManagerApproval !== 'Rejected');
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  getCategoryById: (id) => {
    const target = String(id || '').trim().toLowerCase();
    return categories.find(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target || (c.slug && c.slug.toLowerCase() === target)) || null;
  },
  addCategory: (item) => {
    const id = item.slug ? `cat-${item.slug}` : `cat-${Date.now()}`;
    const created = {
      _id: id,
      id: item.id || item.slug || id,
      count: item.count || item.dealsCount || 0,
      dealsCount: item.dealsCount || item.count || 0,
      status: 'active',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    categories.unshift(created);
    saveToDisk();
    return created;
  },
  updateCategory: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = categories.findIndex(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target || (c.slug && c.slug.toLowerCase() === target));
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return categories[idx];
  },
  deleteCategory: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = categories.findIndex(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target || (c.slug && c.slug.toLowerCase() === target));
    if (idx === -1) return false;
    categories.splice(idx, 1);
    saveToDisk();
    return true;
  },

  // Users
  getUsers: () => [...users].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()),
  addUser: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, id: Date.now(), walletBalance: '₹0', totalCashback: '₹0', joinedDate: 'Today', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...item };
    users.unshift(created);
    saveToDisk();
    return created;
  },
  updateUser: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = users.findIndex(u => String(u._id).toLowerCase() === target || String(u.id).toLowerCase() === target);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return users[idx];
  },
  deleteUser: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = users.findIndex(u => String(u._id).toLowerCase() === target || String(u.id).toLowerCase() === target);
    if (idx === -1) return false;
    users.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleUserStatus: (id, status) => {
    const target = String(id || '').trim().toLowerCase();
    const user = users.find(u => String(u._id).toLowerCase() === target || String(u.id).toLowerCase() === target);
    if (!user) return null;
    user.status = status || (user.status === 'active' ? 'suspended' : 'active');
    user.updatedAt = new Date().toISOString();
    saveToDisk();
    return user;
  },

  // Transactions
  getTransactions: () => [...transactions].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()),
  addTransaction: (item) => {
    const num = Math.floor(Math.random() * 9000 + 1000);
    const txnId = `TXN-${num}`;
    const created = { _id: txnId, id: txnId, transactionId: txnId, status: 'Pending', time: 'Just now', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...item };
    transactions.unshift(created);
    saveToDisk();
    return created;
  },
  approveTransaction: (id) => {
    const txn = transactions.find(t => t._id === id || t.id === id || t.transactionId === id);
    if (!txn) return null;
    txn.status = 'Completed';
    txn.updatedAt = new Date().toISOString();
    saveToDisk();
    return txn;
  },

  // ================= Credit Cards =================
  getCreditCards: (filter = {}) => {
    let result = [...creditCards];
    if (filter.all !== 'true') {
      result = result.filter(c => 
        c.submissionStatus !== 'pending_approval' && 
        c.submissionStatus !== 'rejected' && 
        c.submissionStatus !== 'draft' &&
        c.status !== 'pending' &&
        (c.status === 'active' || c.status === 'featured' || !c.status)
      );
    }
    if (filter.bank && filter.bank !== 'All' && filter.bank !== 'all') {
      result = result.filter(c => c.bank && c.bank.toLowerCase() === filter.bank.toLowerCase());
    }
    if (filter.network && filter.network !== 'All' && filter.network !== 'all') {
      result = result.filter(c => c.network && c.network.toLowerCase() === filter.network.toLowerCase());
    }
    if (filter.tier && filter.tier !== 'All' && filter.tier !== 'all') {
      result = result.filter(c => c.tier && c.tier.toLowerCase() === filter.tier.toLowerCase());
    }
    if (filter.status && filter.status !== 'All' && filter.status !== 'all') {
      result = result.filter(c => c.status && c.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.submissionStatus && filter.submissionStatus !== 'All' && filter.submissionStatus !== 'all') {
      result = result.filter(c => c.submissionStatus && c.submissionStatus.toLowerCase() === filter.submissionStatus.toLowerCase());
    }
    if (filter.isFeatured !== undefined) {
      const isFeat = String(filter.isFeatured) === 'true';
      result = result.filter(c => c.isFeatured === isFeat);
    }
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(c => 
        (c.cardName && c.cardName.toLowerCase().includes(q)) ||
        (c.bank && c.bank.toLowerCase().includes(q)) ||
        (c.welcomeOffer && c.welcomeOffer.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  getCreditCardById: (id) => {
    const target = String(id || '').trim().toLowerCase();
    return creditCards.find(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target) || null;
  },
  addCreditCard: (item) => {
    const id = item.id ? String(item.id) : `card-${Date.now()}`;
    const created = {
      _id: id,
      id,
      keyBenefits: [],
      partnerBrands: [],
      annualFee: '₹0',
      joiningFee: '₹0',
      status: 'active',
      submissionStatus: 'approved',
      isFeatured: false,
      isVerified: true,
      applyCount: 0,
      viewCount: 0,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    creditCards.unshift(created);
    saveToDisk();
    return created;
  },
  updateCreditCard: (id, updates) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = creditCards.findIndex(c => 
      String(c._id).toLowerCase() === target || 
      String(c.id).toLowerCase() === target || 
      (c.bank && c.bank.toLowerCase() === target) ||
      (c.cardName && c.cardName.toLowerCase().includes(target))
    );
    if (idx === -1) {
      // If card not in array (e.g. from static list), add it with updates
      const newCard = {
        _id: String(id),
        id: String(id),
        cardName: updates.cardName || id,
        bank: updates.bank || 'Bank',
        showOnHome: updates.showOnHome !== undefined ? updates.showOnHome : true,
        isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : true,
        status: updates.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...updates
      };
      creditCards.unshift(newCard);
      saveToDisk();
      return newCard;
    }
    creditCards[idx] = { ...creditCards[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return creditCards[idx];
  },
  deleteCreditCard: (id) => {
    const target = String(id || '').trim().toLowerCase();
    const idx = creditCards.findIndex(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target);
    if (idx === -1) return false;
    creditCards.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleCreditCardStatus: (id, newStatus) => {
    const target = String(id || '').trim().toLowerCase();
    const card = creditCards.find(c => String(c._id).toLowerCase() === target || String(c.id).toLowerCase() === target);
    if (!card) return null;
    if (newStatus) {
      card.status = newStatus;
    } else {
      card.status = card.status === 'active' ? 'inactive' : 'active';
    }
    card.updatedAt = new Date().toISOString();
    saveToDisk();
    return card;
  },

  // ================= Banners =================
  getBanners: (filter = {}) => {
    let result = [...banners];
    if (filter.targetPage && filter.targetPage !== 'All') {
      result = result.filter(b => b.targetPage && b.targetPage.toLowerCase() === filter.targetPage.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(b => b.status && b.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.submissionStatus && filter.submissionStatus !== 'All') {
      result = result.filter(b => b.submissionStatus && b.submissionStatus.toLowerCase() === filter.submissionStatus.toLowerCase());
    }
    return result.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },
  getBannerById: (id) => {
    return banners.find(b => b._id === id || String(b.id) === String(id)) || null;
  },
  addBanner: (item) => {
    const id = item.id ? String(item.id) : `banner-${Date.now()}`;
    const created = {
      _id: id,
      id,
      targetPage: 'home',
      status: 'active',
      submissionStatus: 'approved',
      views: 0,
      clicks: 0,
      priority: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    banners.push(created);
    banners.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    saveToDisk();
    return created;
  },
  updateBanner: (id, updates) => {
    const idx = banners.findIndex(b => b._id === id || String(b.id) === String(id));
    if (idx === -1) return null;
    banners[idx] = { ...banners[idx], ...updates, updatedAt: new Date().toISOString() };
    banners.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    saveToDisk();
    return banners[idx];
  },
  deleteBanner: (id) => {
    const idx = banners.findIndex(b => b._id === id || String(b.id) === String(id));
    if (idx === -1) return false;
    banners.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleBannerStatus: (id, newStatus) => {
    const banner = banners.find(b => b._id === id || String(b.id) === String(id));
    if (!banner) return null;
    if (newStatus) {
      banner.status = newStatus;
    } else {
      banner.status = banner.status === 'active' ? 'inactive' : 'active';
    }
    banner.updatedAt = new Date().toISOString();
    saveToDisk();
    return banner;
  },

  // ================= Advertisements =================
  getAdvertisements: (filter = {}) => {
    let result = [...advertisements];
    if (filter.placement && filter.placement !== 'All') {
      result = result.filter(a => a.placement && a.placement.toLowerCase() === filter.placement.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(a => a.status && a.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.pricingModel && filter.pricingModel !== 'All') {
      result = result.filter(a => a.pricingModel && a.pricingModel.toLowerCase() === filter.pricingModel.toLowerCase());
    }
    if (filter.submissionStatus && filter.submissionStatus !== 'All') {
      result = result.filter(a => a.submissionStatus && a.submissionStatus.toLowerCase() === filter.submissionStatus.toLowerCase());
    }
    return result.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime());
  },
  getAdvertisementById: (id) => {
    return advertisements.find(a => a._id === id || String(a.id) === String(id)) || null;
  },
  addAdvertisement: (item) => {
    const id = item.id ? String(item.id) : `ad-${Date.now()}`;
    const created = {
      _id: id,
      id,
      placement: item.placement || 'homepage-banner-1713x685',
      status: 'active',
      submissionStatus: 'approved',
      impressions: 0,
      clicks: 0,
      pricingModel: 'CPC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    advertisements.unshift(created);
    saveToDisk();
    return created;
  },
  updateAdvertisement: (id, updates) => {
    const idx = advertisements.findIndex(a => a._id === id || String(a.id) === String(id));
    if (idx === -1) return null;
    advertisements[idx] = { ...advertisements[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return advertisements[idx];
  },
  deleteAdvertisement: (id) => {
    const idx = advertisements.findIndex(a => a._id === id || String(a.id) === String(id));
    if (idx === -1) return false;
    advertisements.splice(idx, 1);
    saveToDisk();
    return true;
  },
  toggleAdvertisementStatus: (id, newStatus) => {
    const ad = advertisements.find(a => a._id === id || String(a.id) === String(id));
    if (!ad) return null;
    if (newStatus) {
      ad.status = newStatus;
    } else {
      ad.status = ad.status === 'active' ? 'inactive' : 'active';
    }
    ad.updatedAt = new Date().toISOString();
    saveToDisk();
    return ad;
  },

  // ================= Submissions (Queue & Workflow) =================
  getSubmissions: (filter = {}) => {
    let result = [...submissions];
    if (filter.status && filter.status !== 'All') {
      result = result.filter(s => s.status && s.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.entityType && filter.entityType !== 'All') {
      result = result.filter(s => s.entityType && s.entityType.toLowerCase() === filter.entityType.toLowerCase());
    }
    if (filter.submittedBy && filter.submittedBy !== 'All') {
      result = result.filter(s => s.submittedBy && s.submittedBy.toLowerCase() === filter.submittedBy.toLowerCase());
    }
    if (filter.priority && filter.priority !== 'All') {
      result = result.filter(s => s.priority && s.priority.toLowerCase() === filter.priority.toLowerCase());
    }
    result.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.approvedAt || a.reviewedAt || a.submittedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.approvedAt || b.reviewedAt || b.submittedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    return result;
  },
  getSubmissionById: (id) => {
    return submissions.find(s => s._id === id || String(s.id) === String(id)) || null;
  },
  addSubmission: (item) => {
    const id = item.id ? String(item.id) : `sub-${Date.now()}`;
    const created = {
      _id: id,
      id,
      status: 'Pending Approval',
      submittedAt: new Date().toISOString(),
      priority: 'Normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    submissions.unshift(created);

    // If there is an associated entity in inMemoryStore, set its submissionStatus to 'pending_approval'
    if (created.entityType && created.entityId) {
      const entType = created.entityType;
      const entId = created.entityId;
      if (entType === 'deal') module.exports.updateDeal(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'credit_card') module.exports.updateCreditCard(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'coupon') module.exports.updateCoupon(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'banner') module.exports.updateBanner(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'advertisement') module.exports.updateAdvertisement(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'loot_deal') module.exports.updateLootDeal(entId, { submissionStatus: 'pending_approval' });
      else if (entType === 'store') module.exports.updateStore(entId, { submissionStatus: 'pending_approval' });
    }

    saveToDisk();
    return created;
  },
  updateSubmission: (id, updates) => {
    const idx = submissions.findIndex(s => s._id === id || String(s.id) === String(id));
    if (idx === -1) return null;
    submissions[idx] = { ...submissions[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return submissions[idx];
  },
  deleteSubmission: (id) => {
    const idx = submissions.findIndex(s => s._id === id || String(s.id) === String(id));
    if (idx === -1) return false;
    submissions.splice(idx, 1);
    saveToDisk();
    return true;
  },
  approveSubmission: (id, reviewer = 'manager@wouchify.com') => {
    const sub = submissions.find(s => s._id === id || String(s.id) === String(id));
    if (!sub) return null;
    sub.status = 'Approved';
    sub.reviewedBy = reviewer;
    sub.reviewedAt = new Date().toISOString();
    sub.updatedAt = new Date().toISOString();

    // Propagate approval to associated entity
    if (sub.entityType && sub.entityId) {
      const entType = sub.entityType;
      const entId = sub.entityId;

      // Determine the correct live status: if publishAt is in the future, keep as 'active'
      // but publishAt filter will hide it from public until the time arrives
      const snapshot = sub.dataSnapshot || {};
      const publishAt = snapshot.publishAt;
      const isScheduledFuture = publishAt && new Date(publishAt).getTime() > Date.now() + 60000;

      const patch = { 
        ...snapshot,
        submissionStatus: 'approved', 
        status: isScheduledFuture ? 'scheduled' : 'active',
        opsManagerApproval: 'Approved',
        managerApproval: 'Approved'
      };
      delete patch._id;
      delete patch.id;
      if (sub.action === 'delete') {
        if (entType === 'deal') module.exports.deleteDeal(entId);
        else if (entType === 'credit_card') module.exports.deleteCreditCard(entId);
        else if (entType === 'coupon') module.exports.deleteCoupon(entId);
        else if (entType === 'banner') module.exports.deleteBanner(entId);
        else if (entType === 'advertisement') module.exports.deleteAdvertisement(entId);
        else if (entType === 'loot_deal') module.exports.deleteLootDeal(entId);
        else if (entType === 'store') module.exports.deleteStore(entId);
        else if (entType === 'category') module.exports.deleteCategory(entId);
      } else {
        if (entType === 'deal') module.exports.updateDeal(entId, patch);
        else if (entType === 'credit_card') module.exports.updateCreditCard(entId, patch);
        else if (entType === 'coupon') module.exports.updateCoupon(entId, patch);
        else if (entType === 'banner') module.exports.updateBanner(entId, patch);
        else if (entType === 'advertisement') module.exports.updateAdvertisement(entId, patch);
        else if (entType === 'loot_deal') module.exports.updateLootDeal(entId, patch);
        else if (entType === 'store') module.exports.updateStore(entId, patch);
        else if (entType === 'category') module.exports.updateCategory(entId, patch);
      }
    }
    saveToDisk();
    return sub;
  },
  rejectSubmission: (id, rejectionReason = '', reviewer = 'manager@wouchify.com') => {
    const sub = submissions.find(s => s._id === id || String(s.id) === String(id));
    if (!sub) return null;
    sub.status = 'Rejected';
    sub.rejectionReason = rejectionReason;
    sub.reviewedBy = reviewer;
    sub.reviewedAt = new Date().toISOString();
    sub.updatedAt = new Date().toISOString();

    // Propagate rejection to associated entity
    if (sub.entityType && sub.entityId) {
      const entType = sub.entityType;
      const entId = sub.entityId;
      const patch = { submissionStatus: 'rejected' };
      if (entType === 'deal') module.exports.updateDeal(entId, patch);
      else if (entType === 'credit_card') module.exports.updateCreditCard(entId, patch);
      else if (entType === 'coupon') module.exports.updateCoupon(entId, patch);
      else if (entType === 'banner') module.exports.updateBanner(entId, patch);
      else if (entType === 'advertisement') module.exports.updateAdvertisement(entId, patch);
      else if (entType === 'loot_deal') module.exports.updateLootDeal(entId, patch);
      else if (entType === 'store') module.exports.updateStore(entId, patch);
    }
    saveToDisk();
    return sub;
  },

  // ================= Support Tickets =================
  getSupportTickets: (filter = {}) => {
    let result = [...supportTickets];
    if (filter.status && filter.status !== 'All') {
      result = result.filter(t => t.status && t.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.priority && filter.priority !== 'All') {
      result = result.filter(t => t.priority && t.priority.toLowerCase() === filter.priority.toLowerCase());
    }
    if (filter.category && filter.category !== 'All') {
      result = result.filter(t => t.category && t.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.userEmail) {
      result = result.filter(t => t.userEmail && t.userEmail.toLowerCase() === filter.userEmail.toLowerCase());
    }
    if (filter.assignedTo && filter.assignedTo !== 'All') {
      result = result.filter(t => t.assignedTo && t.assignedTo.toLowerCase().includes(filter.assignedTo.toLowerCase()));
    }
    return result;
  },
  getSupportTicketById: (id) => {
    return supportTickets.find(t => t._id === id || String(t.id) === String(id) || t.ticketId === id) || null;
  },
  addSupportTicket: (item) => {
    const num = Math.floor(Math.random() * 900 + 100);
    const tid = item.ticketId || `TICK-${num}`;
    const created = {
      _id: tid,
      id: tid,
      ticketId: tid,
      status: 'Open',
      priority: 'Medium',
      messages: item.messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    supportTickets.unshift(created);
    saveToDisk();
    return created;
  },
  updateSupportTicket: (id, updates) => {
    const idx = supportTickets.findIndex(t => t._id === id || String(t.id) === String(id) || t.ticketId === id);
    if (idx === -1) return null;
    supportTickets[idx] = { ...supportTickets[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return supportTickets[idx];
  },
  deleteSupportTicket: (id) => {
    const idx = supportTickets.findIndex(t => t._id === id || String(t.id) === String(id) || t.ticketId === id);
    if (idx === -1) return false;
    supportTickets.splice(idx, 1);
    saveToDisk();
    return true;
  },
  replySupportTicket: (id, message) => {
    const ticket = supportTickets.find(t => t._id === id || String(t.id) === String(id) || t.ticketId === id);
    if (!ticket) return null;
    if (!ticket.messages) ticket.messages = [];
    ticket.messages.push({
      sender: message.sender || 'support',
      senderName: message.senderName || 'Support Agent',
      time: message.time || new Date().toISOString(),
      text: message.text || ''
    });
    if (message.sender === 'support' && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }
    ticket.updatedAt = new Date().toISOString();
    saveToDisk();
    return ticket;
  },
  updateSupportTicketStatus: (id, status) => {
    const ticket = supportTickets.find(t => t._id === id || String(t.id) === String(id) || t.ticketId === id);
    if (!ticket) return null;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    saveToDisk();
    return ticket;
  },

  // ================= Cashback Claims =================
  getCashbackClaims: (filter = {}) => {
    let result = [...cashbackClaims];
    if (filter.status && filter.status !== 'All') {
      result = result.filter(c => c.status && c.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.userEmail) {
      result = result.filter(c => c.userEmail && c.userEmail.toLowerCase() === filter.userEmail.toLowerCase());
    }
    if (filter.store && filter.store !== 'All') {
      result = result.filter(c => c.store && c.store.toLowerCase() === filter.store.toLowerCase());
    }
    if (filter.payoutMethod && filter.payoutMethod !== 'All') {
      result = result.filter(c => c.payoutMethod && c.payoutMethod.toLowerCase() === filter.payoutMethod.toLowerCase());
    }
    return result;
  },
  getCashbackClaimById: (id) => {
    return cashbackClaims.find(c => c._id === id || String(c.id) === String(id) || c.claimId === id) || null;
  },
  addCashbackClaim: (item) => {
    const num = Math.floor(Math.random() * 900 + 100);
    const cid = item.claimId || `CLM-${num}`;
    const created = {
      _id: cid,
      id: cid,
      claimId: cid,
      status: 'Pending',
      claimedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    cashbackClaims.unshift(created);
    saveToDisk();
    return created;
  },
  updateCashbackClaim: (id, updates) => {
    const idx = cashbackClaims.findIndex(c => c._id === id || String(c.id) === String(id) || c.claimId === id);
    if (idx === -1) return null;
    cashbackClaims[idx] = { ...cashbackClaims[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return cashbackClaims[idx];
  },
  deleteCashbackClaim: (id) => {
    const idx = cashbackClaims.findIndex(c => c._id === id || String(c.id) === String(id) || c.claimId === id);
    if (idx === -1) return false;
    cashbackClaims.splice(idx, 1);
    saveToDisk();
    return true;
  },
  updateCashbackClaimStatus: (id, status, details = {}) => {
    const claim = cashbackClaims.find(c => c._id === id || String(c.id) === String(id) || c.claimId === id);
    if (!claim) return null;
    claim.status = status;
    if (details.reviewedBy) claim.reviewedBy = details.reviewedBy;
    if (details.notes) claim.notes = details.notes;
    claim.updatedAt = new Date().toISOString();
    saveToDisk();
    return claim;
  },

  // ================= Staff Members =================
  getStaffMembers: (filter = {}) => {
    let result = [...staffMembers];
    if (filter.role && filter.role !== 'All') {
      result = result.filter(s => s.role && s.role.toLowerCase() === filter.role.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(s => s.status && s.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result;
  },
  getStaffMemberById: (id) => {
    return staffMembers.find(s => s._id === id || String(s.id) === String(id) || s.email === id) || null;
  },
  createStaffMember: (item) => {
    return inMemoryStore.addStaffMember(item);
  },
  addStaffMember: (item) => {
    const id = item.id ? String(item.id) : `staff-${Date.now()}`;
    const created = {
      _id: id,
      id,
      role: 'executive',
      domain: 'General',
      status: 'Online',
      submissionsToday: 0,
      totalSubmissions: 0,
      approvalRate: '100%',
      rejectionsCount: 0,
      avgTurnaround: '15m',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    staffMembers.push(created);
    saveToDisk();
    return created;
  },
  updateStaffMember: (id, updates) => {
    const idx = staffMembers.findIndex(s => s._id === id || String(s.id) === String(id) || s.email === id);
    if (idx === -1) return null;
    staffMembers[idx] = { ...staffMembers[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return staffMembers[idx];
  },
  deleteStaffMember: (id) => {
    const idx = staffMembers.findIndex(s => s._id === id || String(s.id) === String(id) || s.email === id);
    if (idx === -1) return false;
    staffMembers.splice(idx, 1);
    saveToDisk();
    return true;
  },

  // ================= Submissions Queue (Maker-Checker Approval Engine) =================
  getSubmissions: (filter = {}) => {
    let result = [...submissions];
    if (filter.status && filter.status !== 'All' && filter.status !== 'all') {
      const qStatus = filter.status.toLowerCase();
      result = result.filter(s => s.status && s.status.toLowerCase() === qStatus);
    }
    if (filter.entityType && filter.entityType !== 'All' && filter.entityType !== 'all') {
      const qType = filter.entityType.toLowerCase();
      result = result.filter(s => s.entityType && s.entityType.toLowerCase() === qType);
    }
    if (filter.submittedBy && filter.submittedBy !== 'All' && filter.submittedBy !== 'all') {
      const qUser = filter.submittedBy.toLowerCase();
      result = result.filter(s => s.submittedBy && s.submittedBy.toLowerCase() === qUser);
    }
    if (filter.priority && filter.priority !== 'All' && filter.priority !== 'all') {
      const qPri = filter.priority.toLowerCase();
      result = result.filter(s => s.priority && s.priority.toLowerCase() === qPri);
    }
    result.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.approvedAt || a.reviewedAt || a.submittedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.approvedAt || b.reviewedAt || b.submittedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    return result;
  },
  getSubmissionById: (id) => {
    const target = String(id).trim();
    return submissions.find(s => String(s._id) === target || String(s.id) === target) || null;
  },
  addSubmission: (item) => {
    const sid = item._id || item.id || `sub-${Date.now()}`;
    const created = {
      _id: sid,
      id: sid,
      status: item.status || 'Pending Approval',
      submittedAt: item.submittedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    submissions.unshift(created);
    saveToDisk();
    return created;
  },
  updateSubmission: (id, updates) => {
    const target = String(id).trim();
    const idx = submissions.findIndex(s => String(s._id) === target || String(s.id) === target);
    if (idx === -1) return null;
    submissions[idx] = { ...submissions[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return submissions[idx];
  },
  deleteSubmission: (id) => {
    const target = String(id).trim();
    const idx = submissions.findIndex(s => String(s._id) === target || String(s.id) === target);
    if (idx === -1) return false;
    submissions.splice(idx, 1);
    saveToDisk();
    return true;
  },
  approveSubmission: (id, reviewer = 'ops.manager@wouchify.com', reviewerName = 'Operational Manager', reviewerRole = 'Operational Manager') => {
    const target = String(id).trim();
    const sub = submissions.find(s => String(s._id) === target || String(s.id) === target);
    if (!sub) return null;

    const email = typeof reviewer === 'object' ? (reviewer.email || 'ops.manager@wouchify.com') : String(reviewer);
    const name = typeof reviewer === 'object' ? (reviewer.name || 'Operational Manager') : String(reviewerName || 'Operational Manager');
    const role = typeof reviewer === 'object' ? (reviewer.role || 'Operational Manager') : String(reviewerRole || ((email.includes('manager@') || email === 'manager') && !email.includes('ops') ? 'Manager' : 'Operational Manager'));
    const nowIso = new Date().toISOString();

    sub.status = 'Approved';
    sub.reviewedBy = email;
    sub.reviewedByName = name;
    sub.reviewedByRole = role;
    sub.approvedBy = email;
    sub.approvedByName = name;
    sub.approvedByRole = role;
    sub.reviewedAt = nowIso;
    sub.approvedAt = nowIso;
    sub.updatedAt = nowIso;

    const entityType = sub.entityType;
    const entityId = String(sub.entityId || '').trim();
    const snapshot = sub.dataSnapshot || {};
    const action = sub.action || 'create';

    // Helper to find and update/create in collection
    const updateTargetCollection = (coll, collName) => {
      const idx = coll.findIndex(item => 
        (entityId && (String(item._id) === entityId || String(item.id) === entityId)) ||
        (snapshot.id && (String(item._id) === String(snapshot.id) || String(item.id) === String(snapshot.id))) ||
        (snapshot.name && item.name && item.name.toLowerCase().trim() === snapshot.name.toLowerCase().trim()) ||
        (snapshot.title && item.title && item.title.toLowerCase().trim() === snapshot.title.toLowerCase().trim()) ||
        (snapshot.cardName && item.cardName && item.cardName.toLowerCase().trim() === snapshot.cardName.toLowerCase().trim()) ||
        (snapshot.code && item.code && item.code.toUpperCase().trim() === snapshot.code.toUpperCase().trim())
      );

      const approvalMeta = {
        approvedBy: email,
        approvedByName: name,
        approvedByRole: role,
        approvedAt: nowIso,
        opsManagerApproval: 'Approved',
        managerApproval: 'Approved',
        submissionStatus: 'approved',
        status: 'active',
        updatedAt: nowIso
      };

      if (action === 'delete') {
        if (idx !== -1) coll.splice(idx, 1);
      } else if (idx !== -1) {
        coll[idx] = {
          ...coll[idx],
          ...snapshot,
          ...approvalMeta
        };
      } else {
        // Add as active item
        const newId = entityId || snapshot._id || snapshot.id || `${collName}-${Date.now()}`;
        coll.unshift({
          _id: newId,
          id: newId,
          ...snapshot,
          ...approvalMeta,
          createdAt: nowIso
        });
      }
    };

    if (entityType === 'deal') updateTargetCollection(deals, 'deal');
    else if (entityType === 'loot_deal') updateTargetCollection(lootDeals, 'loot');
    else if (entityType === 'coupon') updateTargetCollection(coupons, 'coupon');
    else if (entityType === 'credit_card') updateTargetCollection(creditCards, 'card');
    else if (entityType === 'store') updateTargetCollection(stores, 'store');
    else if (entityType === 'banner') updateTargetCollection(banners, 'banner');
    else if (entityType === 'advertisement') updateTargetCollection(advertisements, 'ad');
    else if (entityType === 'category') updateTargetCollection(categories, 'cat');

    saveToDisk();
    return sub;
  },
  rejectSubmission: (id, reason = 'Rejected', reviewer = 'ops.manager@wouchify.com', reviewerName = 'Operational Manager', reviewerRole = 'Operational Manager') => {
    const target = String(id).trim();
    const sub = submissions.find(s => String(s._id) === target || String(s.id) === target);
    if (!sub) return null;

    const email = typeof reviewer === 'object' ? (reviewer.email || 'ops.manager@wouchify.com') : String(reviewer);
    const name = typeof reviewer === 'object' ? (reviewer.name || 'Operational Manager') : String(reviewerName || 'Operational Manager');
    const role = typeof reviewer === 'object' ? (reviewer.role || 'Operational Manager') : String(reviewerRole || ((email.includes('manager@') || email === 'manager') && !email.includes('ops') ? 'Manager' : 'Operational Manager'));
    const nowIso = new Date().toISOString();

    sub.status = 'Rejected';
    sub.rejectionReason = reason;
    sub.reviewedBy = email;
    sub.reviewedByName = name;
    sub.reviewedByRole = role;
    sub.reviewedAt = nowIso;
    sub.updatedAt = nowIso;

    const entityType = sub.entityType;
    const entityId = String(sub.entityId || '').trim();
    const snapshot = sub.dataSnapshot || {};

    const rejectTargetCollection = (coll) => {
      const item = coll.find(i => 
        (entityId && (String(i._id) === entityId || String(i.id) === entityId)) ||
        (snapshot.id && (String(i._id) === String(snapshot.id) || String(i.id) === String(snapshot.id))) ||
        (snapshot.name && i.name && i.name.toLowerCase().trim() === snapshot.name.toLowerCase().trim()) ||
        (snapshot.title && i.title && i.title.toLowerCase().trim() === snapshot.title.toLowerCase().trim()) ||
        (snapshot.cardName && i.cardName && i.cardName.toLowerCase().trim() === snapshot.cardName.toLowerCase().trim()) ||
        (snapshot.code && i.code && i.code.toUpperCase().trim() === snapshot.code.toUpperCase().trim())
      );
      if (item) {
        item.status = 'inactive';
        item.submissionStatus = 'rejected';
        item.opsManagerApproval = 'Rejected';
        item.managerApproval = 'Rejected';
        item.updatedAt = new Date().toISOString();
      }
    };

    if (entityType === 'deal') rejectTargetCollection(deals);
    else if (entityType === 'loot_deal') rejectTargetCollection(lootDeals);
    else if (entityType === 'coupon') rejectTargetCollection(coupons);
    else if (entityType === 'credit_card') rejectTargetCollection(creditCards);
    else if (entityType === 'store') rejectTargetCollection(stores);
    else if (entityType === 'banner') rejectTargetCollection(banners);
    else if (entityType === 'advertisement') rejectTargetCollection(advertisements);
    else if (entityType === 'category') rejectTargetCollection(categories);

    saveToDisk();
    return sub;
  },
  // Click & Engagement Tracking
  incrementDealClicks: (id) => {
    const target = String(id).trim().toLowerCase();
    const deal = deals.find(d => String(d._id) === target || String(d.id) === target || (d.name && d.name.toLowerCase() === target));
    if (deal) {
      deal.clicks = (deal.clicks || 0) + 1;
      saveToDisk();
      return deal;
    }
    return null;
  },
  incrementLootClicks: (id) => {
    const target = String(id).trim().toLowerCase();
    const loot = lootDeals.find(l => String(l._id) === target || String(l.id) === target || (l.title && l.title.toLowerCase() === target));
    if (loot) {
      loot.clicks = (loot.clicks || 0) + 1;
      saveToDisk();
      return loot;
    }
    return null;
  },
  incrementStoreClicks: (idOrSlugOrName) => {
    const target = String(idOrSlugOrName).trim().toLowerCase();
    const s = stores.find(item => 
      String(item._id) === target || 
      String(item.id) === target || 
      (item.slug && item.slug.toLowerCase() === target) ||
      (item.name && item.name.toLowerCase() === target)
    );
    if (s) {
      s.clicks = (s.clicks || 0) + 1;
      saveToDisk();
      return s;
    }
    return null;
  },
  incrementCouponClicks: (idOrCode) => {
    const target = String(idOrCode).trim().toLowerCase();
    const coupon = coupons.find(c => 
      String(c._id) === target || 
      String(c.id) === target || 
      (c.code && c.code.toLowerCase() === target)
    );
    if (coupon) {
      coupon.clicks = (coupon.clicks || 0) + 1;
      coupon.usageCount = (coupon.usageCount || 0) + 1;
      saveToDisk();
      return coupon;
    }
    return null;
  },
  incrementAdClicks: (id) => {
    const ad = advertisements.find(a => String(a._id) === String(id) || String(a.id) === String(id));
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      saveToDisk();
      return ad;
    }
    return null;
  },
  incrementBannerClicks: (id) => {
    const banner = banners.find(b => String(b._id) === String(id) || String(b.id) === String(id));
    if (banner) {
      banner.clicks = (banner.clicks || 0) + 1;
      saveToDisk();
      return banner;
    }
    return null;
  },
  incrementCreditCardClicks: (id) => {
    const card = creditCards.find(c => String(c._id) === String(id) || String(c.id) === String(id));
    if (card) {
      card.applyCount = (card.applyCount || 0) + 1;
      saveToDisk();
      return card;
    }
    return null;
  },

  // Seed / Reset
  seed: () => {
    saveToDisk();
    return {
      dealsCount: deals.length,
      couponsCount: coupons.length,
      lootDealsCount: lootDeals.length,
      storesCount: stores.length,
      categoriesCount: categories.length,
      usersCount: users.length,
      transactionsCount: transactions.length,
      creditCardsCount: creditCards.length,
      bannersCount: banners.length,
      advertisementsCount: advertisements.length,
      submissionsCount: submissions.length,
      supportTicketsCount: supportTickets.length,
      cashbackClaimsCount: cashbackClaims.length,
      staffMembersCount: staffMembers.length
    };
  }
};
