import clothingImg from '../assets/mobile/categories/clothing.png'
import beautyMakeupImg from '../assets/mobile/categories/beauty-makeup.png'
import kitchenAppliancesImg from '../assets/mobile/categories/kitchen-appliances.png'
import electronicsImg from '../assets/mobile/categories/electronics.png'
import medicalImg from '../assets/mobile/categories/medical.png'
import educationImg from '../assets/mobile/categories/education.png'

export interface MobileCategoryItem {
  id: string
  name: string
  slug: string
  image: string
  href: string
  alt: string
}

export const MOBILE_CATEGORIES: MobileCategoryItem[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    image: clothingImg,
    href: '/categories/clothing',
    alt: 'Clothing category',
  },
  {
    id: 'beauty-makeup',
    name: 'Beauty & Makeup',
    slug: 'beauty-makeup',
    image: beautyMakeupImg,
    href: '/categories/beauty-makeup',
    alt: 'Beauty & Makeup category',
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    image: kitchenAppliancesImg,
    href: '/categories/kitchen-appliances',
    alt: 'Kitchen Appliances category',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: electronicsImg,
    href: '/categories/electronics',
    alt: 'Electronics category',
  },
  {
    id: 'medical',
    name: 'Medical',
    slug: 'medical',
    image: medicalImg,
    href: '/categories/medical',
    alt: 'Medical category',
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    image: educationImg,
    href: '/categories/education',
    alt: 'Education category',
  },
]
