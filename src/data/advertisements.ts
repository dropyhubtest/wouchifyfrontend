import advertisementImage from '../assets/advertisement/image-7.png'

export interface Advertisement {
  id: string
  title: string
  image: string
  alt: string
  href: string
}

export const ADVERTISEMENT_FALLBACK_IMAGE = advertisementImage
