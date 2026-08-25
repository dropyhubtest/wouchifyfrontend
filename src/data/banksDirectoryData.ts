/**
 * Banks Directory Data
 * Source of Truth: Banks.png (1920x4020px Native Figma Export)
 * Exactly 9 Bank Cards across 6 Visible Letter Groups
 * 6 Dedicated Trending Banks
 */

export interface DirectoryBank {
  id: string
  name: string
  slug: string
  letter: string
  logo: string
  active: boolean
  sortOrder: number
  searchTerms?: string[]
  destinationHref?: string
}

export interface TrendingBank {
  id: string
  name: string
  slug: string
  logo: string
  href: string
  active: boolean
  sortOrder: number
}

// Load all directory PNG assets
const directoryImages = import.meta.glob<{ default: string }>(
  '../assets/categories/directory/*.png',
  { eager: true }
)

const brandLogoImages = import.meta.glob<{ default: string }>(
  '../assets/brand-logos/*.png',
  { eager: true }
)

function getBankLogo(filename: string): string {
  // Check directory
  const dirPath = `../assets/categories/directory/${filename}`
  if (directoryImages[dirPath]) {
    return directoryImages[dirPath].default
  }
  // Check brand-logos
  const brandPath = `../assets/brand-logos/${filename}`
  if (brandLogoImages[brandPath]) {
    return brandLogoImages[brandPath].default
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

  for (const [path, mod] of Object.entries(brandLogoImages)) {
    const fn = path.split('/').pop() || ''
    const cleanFn = fn.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleanFn === cleanTarget || cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)) {
      return mod.default
    }
  }

  return ''
}

// 6 Dedicated Trending Banks in exact Figma order
// Card 3 intentionally uses American Express logo with HDFC Bank caption as visible in Figma
export const TRENDING_BANKS: TrendingBank[] = [
  {
    id: 'trending-sbi',
    name: 'SBI',
    slug: 'sbi',
    logo: getBankLogo('SBI.png'),
    href: '/banks/sbi',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-axis-bank',
    name: 'Axis Bank',
    slug: 'axis-bank',
    logo: getBankLogo('Axis_Bank.png'),
    href: '/banks/axis-bank',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-hdfc-bank',
    name: 'HDFC Bank',
    slug: 'hdfc-bank',
    logo: getBankLogo('American_Express.png'), // Exact Figma asset match
    href: '/banks/hdfc-bank',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-icici-bank',
    name: 'ICICI Bank',
    slug: 'icici-bank',
    logo: getBankLogo('ICICI_Bank.png'),
    href: '/banks/icici-bank',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-kotak',
    name: 'Kotak',
    slug: 'kotak',
    logo: getBankLogo('kotak_mahindra_bank.png'),
    href: '/banks/kotak',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-citi',
    name: 'Citi',
    slug: 'citi',
    logo: getBankLogo('Citibank.png'),
    href: '/banks/citi',
    active: true,
    sortOrder: 6,
  },
]

// Exact 9 Bank Cards from Banks.png across 6 Visible Letter Groups
const RAW_BANKS: Array<{ name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // A (2)
  { name: 'Axis Bank', letter: 'A', file: 'Axis_Bank.png', searchTerms: ['axis bank', 'credit card', 'debit card', 'banking'], destinationHref: '/banks/axis-bank' },
  { name: 'American express', letter: 'A', file: 'American_Express.png', searchTerms: ['american express', 'amex', 'credit card', 'rewards'], destinationHref: '/banks/american-express' },

  // C (1)
  { name: 'Citi Bank', letter: 'C', file: 'Citibank.png', searchTerms: ['citi bank', 'citibank', 'credit card', 'banking'], destinationHref: '/banks/citi-bank' },

  // H (1)
  { name: 'HDFC Bank', letter: 'H', file: 'HDFC_Bank.png', searchTerms: ['hdfc bank', 'credit card', 'loans', 'banking'], destinationHref: '/banks/hdfc-bank' },

  // I (2)
  { name: 'ICICI Bank', letter: 'I', file: 'ICICI_Bank.png', searchTerms: ['icici bank', 'credit card', 'netbanking', 'imobile'], destinationHref: '/banks/icici-bank' },
  { name: 'IndusInd Bank', letter: 'I', file: 'indusind_bank.png', searchTerms: ['indusind bank', 'credit card', 'banking', 'savings'], destinationHref: '/banks/indusind-bank' },

  // K (1)
  { name: 'Kotak Mahindra', letter: 'K', file: 'kotak_mahindra_bank.png', searchTerms: ['kotak mahindra', 'kotak 811', 'credit card', 'banking'], destinationHref: '/banks/kotak-mahindra' },

  // S (2)
  { name: 'SBI Card', letter: 'S', file: 'SBI.png', searchTerms: ['sbi card', 'state bank of india', 'credit card', 'simplyclick'], destinationHref: '/banks/sbi-card' },
  { name: 'Standard Chartered', letter: 'S', file: 'Standard.png', searchTerms: ['standard chartered', 'sc bank', 'credit card', 'ultimate'], destinationHref: '/banks/standard-chartered' },
]

export const BANKS_DIRECTORY_DATA: DirectoryBank[] = RAW_BANKS.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `bank-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    logo: getBankLogo(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
