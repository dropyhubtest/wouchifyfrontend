export interface NavLinkItem {
  id: string
  name: string
  href: string
  active?: boolean
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', name: 'HOME', href: '/' },
  { id: 'categories', name: 'CATEGORIES', href: '/categories' },
  { id: 'stores', name: 'STORES', href: '/stores' },
  { id: 'deals', name: 'DEALS', href: '/deals' },
  { id: 'loot-deals', name: 'LOOT DEALS', href: '/loot-deals' },
  { id: 'coupons', name: 'COUPONS', href: '/coupons' },
]

export function resolveActiveNav(activeNavProp?: string): string {
  if (activeNavProp) return activeNavProp.toLowerCase()
  if (typeof window === 'undefined') return 'home'

  const pathname = window.location.pathname
  if (pathname === '/' || pathname === '') return 'home'
  if (pathname.startsWith('/categories')) return 'categories'
  if (pathname.startsWith('/stores')) return 'stores'
  if (pathname.startsWith('/loot-deals')) return 'loot-deals'
  if (pathname.startsWith('/deals')) return 'deals'
  if (pathname.startsWith('/coupons')) return 'coupons'
  return ''
}
