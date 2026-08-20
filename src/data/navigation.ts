export interface NavLinkItem {
  id: string
  name: string
  href: string
  active?: boolean
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', name: 'HOME', href: '/', active: true },
  { id: 'categories', name: 'CATEGORIES', href: '/categories' },
  { id: 'stores', name: 'STORES', href: '/stores' },
  { id: 'deals', name: 'DEALS', href: '/deals' },
  { id: 'loot-deals', name: 'LOOT DEALS', href: '/loot-deals' },
  { id: 'coupons', name: 'COUPONS', href: '/coupons' },
]
