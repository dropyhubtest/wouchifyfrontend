import advertisementImage from '../assets/advertisement/image-7.png'

export interface Advertisement {
  id: string
  title: string
  image: string
  alt: string
  href: string
}

export const ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'wouchify-sale',
    title: 'Wouchify Sale',
    image: advertisementImage,
    alt: 'Wouchify sale advertisement banner',
    href: '/offers/sale',
  },
]
