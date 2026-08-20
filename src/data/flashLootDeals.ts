import flashLootWallLight from '../assets/flash-loot/flash-loot-wall-light.png'

export interface FlashLootDealItem {
  id: string
  slug: string
  title: string
  image: string
  alt: string
  href: string
}

export const FLASH_LOOT_DEALS: FlashLootDealItem[] = [
  {
    id: 'flash-wall-light',
    slug: 'flash-wall-light',
    title: 'Oval Up Down LED Wall Light',
    image: flashLootWallLight,
    alt: '91 percent off Oval Up Down LED Wall Light deal on Amazon',
    href: '/deals/flash-wall-light',
  },
]
