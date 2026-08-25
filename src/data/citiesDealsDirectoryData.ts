/**
 * Cities Deals Directory Data
 * Source of Truth: Cities.png (1920x4407px Native Figma Export)
 * Exactly 7 City Directory Cards across 7 Visible Letter Groups
 * 6 Dedicated Trending Cities
 */

export interface DirectoryCity {
  id: string
  name: string
  slug: string
  letter: string
  image: string
  active: boolean
  sortOrder: number
  searchTerms?: string[];
  destinationHref?: string
}

export interface TrendingCity {
  id: string
  name: string
  slug: string
  image: string
  href: string
  active: boolean
  sortOrder: number
}

// Load all directory PNG assets
const directoryImages = import.meta.glob<{ default: string }>(
  '../assets/categories/directory/*.png',
  { eager: true }
)

function getCityAsset(filename: string): string {
  const dirPath = `../assets/categories/directory/${filename}`
  if (directoryImages[dirPath]) {
    return directoryImages[dirPath].default
  }

  // Case-insensitive fallback
  const cleanTarget = filename.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const [path, mod] of Object.entries(directoryImages)) {
    const fn = path.split('/').pop() || ''
    const cleanFn = fn.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleanFn === cleanTarget || cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)) {
      return mod.default
    }
  }

  return ''
}

// 6 Dedicated Trending Cities in exact Figma order
export const TRENDING_CITIES: TrendingCity[] = [
  {
    id: 'trending-hyderabad',
    name: 'Hyderabad',
    slug: 'hyderabad',
    image: getCityAsset('hyderabad.png'),
    href: '/cities/hyderabad',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-delhi',
    name: 'Delhi',
    slug: 'delhi',
    image: getCityAsset('delhi.png'),
    href: '/cities/delhi',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-bangalore',
    name: 'Bangalore',
    slug: 'bangalore',
    image: getCityAsset('bengaluru.png'),
    href: '/cities/bangalore',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-mumbai',
    name: 'Mumbai',
    slug: 'mumbai',
    image: getCityAsset('mumbai.png'),
    href: '/cities/mumbai',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-pune',
    name: 'Pune',
    slug: 'pune',
    image: getCityAsset('pune.png'),
    href: '/cities/pune',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-chennai',
    name: 'Chennai',
    slug: 'chennai',
    image: getCityAsset('chennai.png'),
    href: '/cities/chennai',
    active: true,
    sortOrder: 6,
  },
]

// Exact 7 City Directory Cards from Cities.png across 7 Visible Letter Groups
const RAW_CITIES: Array<{ name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // B (1)
  { name: 'Bangalore', letter: 'B', file: 'bengaluru.png', searchTerms: ['bangalore', 'bengaluru', 'karnataka', 'city deals', 'restaurants'], destinationHref: '/cities/bangalore' },

  // C (1)
  { name: 'Chennai', letter: 'C', file: 'chennai.png', searchTerms: ['chennai', 'madras', 'tamil nadu', 'city deals', 'food'], destinationHref: '/cities/chennai' },

  // D (1)
  { name: 'Delhi', letter: 'D', file: 'delhi.png', searchTerms: ['delhi', 'ncr', 'capital', 'city deals', 'shopping'], destinationHref: '/cities/delhi' },

  // H (1)
  { name: 'Hyderabad', letter: 'H', file: 'hyderabad.png', searchTerms: ['hyderabad', 'charminar', 'telangana', 'biryani', 'city deals'], destinationHref: '/cities/hyderabad' },

  // K (1)
  { name: 'Kolkata', letter: 'K', file: 'kolkata.png', searchTerms: ['kolkata', 'calcutta', 'west bengal', 'howrah', 'city deals'], destinationHref: '/cities/kolkata' },

  // M (1)
  { name: 'Mumbai', letter: 'M', file: 'mumbai.png', searchTerms: ['mumbai', 'bombay', 'maharashtra', 'gateway of india', 'city deals'], destinationHref: '/cities/mumbai' },

  // P (1)
  { name: 'Pune', letter: 'P', file: 'pune.png', searchTerms: ['pune', 'maharashtra', 'city deals', 'restaurants', 'cafes'], destinationHref: '/cities/pune' },
]

export const CITIES_DEALS_DIRECTORY_DATA: DirectoryCity[] = RAW_CITIES.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `city-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    image: getCityAsset(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
