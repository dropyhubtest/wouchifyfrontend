import ajioBanner from '../assets/store-promos/ajio_banner.png'
import amazonBanner from '../assets/store-promos/amazon_banner.png'
import firstcryBanner from '../assets/store-promos/firtcry_banner.png'
import flipkartBanner from '../assets/store-promos/filpkart_banner.png'

import amazonLogo from '../assets/brand-logos/amazon-logo.png'
import firstcryLogo from '../assets/brand-logos/firstcry-logo.png'
import flipkartLogo from '../assets/brand-logos/flipkart-logo.png'

export interface TopStoreItem {
  id: string
  name: string
  slug: string
  bgImage: string
  logo?: string
  rewardBadge: string
  showWouchifyMiniLogo?: boolean
  badgePosition: 'top-right' | 'top-left'
  ctaPosition: 'bottom-right' | 'bottom-left'
  href: string
  alt: string
}

export const TOP_STORES: TopStoreItem[] = [
  {
    id: 'store-ajio-1',
    name: 'AJIO',
    slug: 'ajio',
    bgImage: ajioBanner,
    rewardBadge: 'Upto 5% Rewards',
    showWouchifyMiniLogo: true,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/ajio',
    alt: 'AJIO Store Deals & Offers',
  },
  {
    id: 'store-amazon-1',
    name: 'Amazon',
    slug: 'amazon',
    bgImage: amazonBanner,
    logo: amazonLogo,
    rewardBadge: 'Upto 6.2% Rewards',
    showWouchifyMiniLogo: true,
    badgePosition: 'top-left',
    ctaPosition: 'bottom-left',
    href: '/stores/amazon',
    alt: 'Amazon Store Deals & Offers',
  },
  {
    id: 'store-firstcry-1',
    name: 'FirstCry',
    slug: 'firstcry',
    bgImage: firstcryBanner,
    logo: firstcryLogo,
    rewardBadge: 'Flat 40% off',
    showWouchifyMiniLogo: false,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/firstcry',
    alt: 'FirstCry Store Deals & Offers',
  },
  {
    id: 'store-flipkart-1',
    name: 'Flipkart',
    slug: 'flipkart',
    bgImage: flipkartBanner,
    logo: flipkartLogo,
    rewardBadge: 'Upto 10% Rewards',
    showWouchifyMiniLogo: false,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/flipkart',
    alt: 'Flipkart Store Deals & Offers',
  },
  // Repeated items for continuous carousel step navigation
  {
    id: 'store-ajio-2',
    name: 'AJIO',
    slug: 'ajio',
    bgImage: ajioBanner,
    rewardBadge: 'Upto 5% Rewards',
    showWouchifyMiniLogo: true,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/ajio',
    alt: 'AJIO Store Deals & Offers',
  },
  {
    id: 'store-amazon-2',
    name: 'Amazon',
    slug: 'amazon',
    bgImage: amazonBanner,
    logo: amazonLogo,
    rewardBadge: 'Upto 6.2% Rewards',
    showWouchifyMiniLogo: true,
    badgePosition: 'top-left',
    ctaPosition: 'bottom-left',
    href: '/stores/amazon',
    alt: 'Amazon Store Deals & Offers',
  },
  {
    id: 'store-firstcry-2',
    name: 'FirstCry',
    slug: 'firstcry',
    bgImage: firstcryBanner,
    logo: firstcryLogo,
    rewardBadge: 'Flat 40% off',
    showWouchifyMiniLogo: false,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/firstcry',
    alt: 'FirstCry Store Deals & Offers',
  },
  {
    id: 'store-flipkart-2',
    name: 'Flipkart',
    slug: 'flipkart',
    bgImage: flipkartBanner,
    logo: flipkartLogo,
    rewardBadge: 'Upto 10% Rewards',
    showWouchifyMiniLogo: false,
    badgePosition: 'top-right',
    ctaPosition: 'bottom-right',
    href: '/stores/flipkart',
    alt: 'Flipkart Store Deals & Offers',
  },
]
