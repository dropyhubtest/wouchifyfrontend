export interface RecentDealItem {
  id: string
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
  width: number
  height: number
}

export const RECENT_DEALS: RecentDealItem[] = [
  {
    id: 'kettle-604',
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable...',
    productImage: 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg',
    store: 'Amazon',
    currentPrice: '604',
    originalPrice: '1499',
    discount: '60%',
    href: '/deals/kettle-604',
    left: 115,
    top: 122,
    width: 422,
    height: 261,
  },
  {
    id: 'kettle-700',
    title: 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable...',
    productImage: 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg',
    store: 'Amazon',
    currentPrice: '700',
    originalPrice: '1499',
    discount: '60%',
    href: '/deals/kettle-700',
    left: 609,
    top: 122,
    width: 422,
    height: 261,
  },
]



