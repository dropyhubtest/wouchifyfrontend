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
    productImage: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80',
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
    productImage: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80',
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



