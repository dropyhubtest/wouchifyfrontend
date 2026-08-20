import exclusiveLootWallLight from '../assets/exclusive-loot/exclusive-loot-wall-light.png'

export interface ExclusiveLootDealItem {
  id: string
  slug: string
  title: string
  image: string
  alt: string
  href: string
}

export const EXCLUSIVE_LOOT_DEALS: ExclusiveLootDealItem[] = [
  {
    id: 'exclusive-wall-light',
    slug: 'exclusive-wall-light',
    title: 'Exclusive Oval Up Down LED Wall Light',
    image: exclusiveLootWallLight,
    alt: 'Exclusive 91 percent off Oval Up Down LED Wall Light deal on Amazon',
    href: '/deals/exclusive-wall-light',
  },
]
