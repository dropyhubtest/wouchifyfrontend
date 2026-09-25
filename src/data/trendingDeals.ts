export interface TrendingDealItem {
  id: string
  rank: number
  title: string
  name?: string
  productImage: string
  image?: string
  store: string
  storeLogo?: string
  currentPrice: string | number
  originalPrice?: string | number
  discount: string
  href: string
  left: number
  top: number
  badgeLeft: number
  badgeTop: number
}

export const TRENDING_DEALS: TrendingDealItem[] = [
  {
    id: 'trending-kettle-604',
    rank: 1,
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable...',
    productImage: 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg',
    store: 'Amazon',
    currentPrice: '604',
    originalPrice: '1499',
    discount: '60%',
    href: '/deals/kettle-604',
    left: 115,
    top: 200,
    badgeLeft: 65,
    badgeTop: 163,
  },
  {
    id: 'trending-kettle-700',
    rank: 2,
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable...',
    productImage: 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg',
    store: 'Amazon',
    currentPrice: '700',
    originalPrice: '1499',
    discount: '60%',
    href: '/deals/kettle-700',
    left: 557,
    top: 200,
    badgeLeft: 507,
    badgeTop: 163,
  },
  {
    id: 'trending-tv-37998',
    rank: 3,
    title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV',
    productImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    store: 'Amazon',
    currentPrice: '37998',
    originalPrice: '62999',
    discount: '40%',
    href: '/deals/deal-1',
    left: 999,
    top: 200,
    badgeLeft: 949,
    badgeTop: 163,
  },
  {
    id: 'trending-phone-119900',
    rank: 4,
    title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
    productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    store: 'Amazon',
    currentPrice: '119900',
    originalPrice: '134900',
    discount: '11%',
    href: '/deals/deal-2',
    left: 1441,
    top: 200,
    badgeLeft: 1391,
    badgeTop: 163,
  },
]
