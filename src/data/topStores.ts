import storePromoAjio from '../assets/store-promos/store-promo-ajio.png'
import storePromoAmazon from '../assets/store-promos/store-promo-amazon.png'
import storePromoFirstcry from '../assets/store-promos/store-promo-firstcry.png'
import storePromoFlipkart from '../assets/store-promos/store-promo-flipkart.png'

export interface TopStoreItem {
  id: string
  name: string
  slug: string
  image: string
  href: string
  alt: string
}

export const TOP_STORES: TopStoreItem[] = [
  {
    id: 'store-ajio-1',
    name: 'AJIO',
    slug: 'ajio',
    image: storePromoAjio,
    href: '/stores/ajio',
    alt: 'AJIO Store Deals & Offers',
  },
  {
    id: 'store-amazon-1',
    name: 'Amazon',
    slug: 'amazon',
    image: storePromoAmazon,
    href: '/stores/amazon',
    alt: 'Amazon Store Deals & Offers',
  },
  {
    id: 'store-firstcry-1',
    name: 'FirstCry',
    slug: 'firstcry',
    image: storePromoFirstcry,
    href: '/stores/firstcry',
    alt: 'FirstCry Store Deals & Offers',
  },
  {
    id: 'store-flipkart-1',
    name: 'Flipkart',
    slug: 'flipkart',
    image: storePromoFlipkart,
    href: '/stores/flipkart',
    alt: 'Flipkart Store Deals & Offers',
  },
  // Repeated items to allow multi-step carousel browsing
  {
    id: 'store-ajio-2',
    name: 'AJIO',
    slug: 'ajio',
    image: storePromoAjio,
    href: '/stores/ajio',
    alt: 'AJIO Store Deals & Offers',
  },
  {
    id: 'store-amazon-2',
    name: 'Amazon',
    slug: 'amazon',
    image: storePromoAmazon,
    href: '/stores/amazon',
    alt: 'Amazon Store Deals & Offers',
  },
  {
    id: 'store-firstcry-2',
    name: 'FirstCry',
    slug: 'firstcry',
    image: storePromoFirstcry,
    href: '/stores/firstcry',
    alt: 'FirstCry Store Deals & Offers',
  },
  {
    id: 'store-flipkart-2',
    name: 'Flipkart',
    slug: 'flipkart',
    image: storePromoFlipkart,
    href: '/stores/flipkart',
    alt: 'Flipkart Store Deals & Offers',
  },
]
