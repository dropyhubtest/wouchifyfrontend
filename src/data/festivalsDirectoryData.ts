/**
 * Festivals Directory Data
 * Source of Truth: Festivals.png (1920x7420px Native Figma Export)
 * Exactly 29 Festival Cards across 17 Visible Letter Groups
 * 6 Dedicated Trending Festivals
 */

export interface DirectoryFestival {
  id: string
  name: string
  slug: string
  letter: string
  image: string
  active: boolean
  sortOrder: number
  searchTerms?: string[]
  destinationHref?: string
}

export interface TrendingFestival {
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

function getFestivalImage(filename: string): string {
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

// 6 Dedicated Trending Festivals in exact Figma order
// Spelling: "Dussehra" in Trending Festivals matching Figma
export const TRENDING_FESTIVALS: TrendingFestival[] = [
  {
    id: 'trending-dussehra',
    name: 'Dussehra',
    slug: 'dussehra',
    image: getFestivalImage('dassara.png'),
    href: '/festivals/dussehra',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-diwali',
    name: 'Diwali',
    slug: 'diwali',
    image: getFestivalImage('diwali.png'),
    href: '/festivals/diwali',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-holi',
    name: 'Holi',
    slug: 'holi',
    image: getFestivalImage('holi.png'),
    href: '/festivals/holi',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-christmas',
    name: 'Christmas',
    slug: 'christmas',
    image: getFestivalImage('christmas.png'),
    href: '/festivals/christmas',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-bakrid',
    name: 'Bakrid',
    slug: 'bakrid',
    image: getFestivalImage('bakrid.png'),
    href: '/festivals/bakrid',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-navratri',
    name: 'Navratri',
    slug: 'navratri',
    image: getFestivalImage('dassara.png'),
    href: '/festivals/navratri',
    active: true,
    sortOrder: 6,
  },
]

// Exact 29 Festival Cards from Festivals.png across 17 Visible Letter Groups
// Note: "Dasara" in D directory group matching Figma
const RAW_FESTIVALS: Array<{ name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // A (1)
  { name: 'Amazon Great Indian Festival', letter: 'A', file: 'amazon_great_indian.png', searchTerms: ['amazon', 'great indian festival', 'sale', 'offers'], destinationHref: '/festivals/amazon-great-indian' },

  // B (3)
  { name: 'Bakrid', letter: 'B', file: 'bakrid.png', searchTerms: ['bakrid', 'eid', 'islamic festival'], destinationHref: '/festivals/bakrid' },
  { name: 'Bathukamma', letter: 'B', file: 'bathukamma.png', searchTerms: ['bathukamma', 'flowers', 'telangana festival'], destinationHref: '/festivals/bathukamma' },
  { name: 'Bonalu', letter: 'B', file: 'bonalu.png', searchTerms: ['bonalu', 'hyderabad', 'mahankali', 'festival'], destinationHref: '/festivals/bonalu' },

  // C (1)
  { name: 'Christmas', letter: 'C', file: 'christmas.png', searchTerms: ['christmas', 'xmas', 'santa', 'holiday', 'gifts'], destinationHref: '/festivals/christmas' },

  // D (2)
  { name: 'Dasara', letter: 'D', file: 'dassara.png', searchTerms: ['dasara', 'dussehra', 'vijayadashami', 'durga'], destinationHref: '/festivals/dasara' },
  { name: 'Diwali', letter: 'D', file: 'diwali.png', searchTerms: ['diwali', 'deepavali', 'lights', 'diyas', 'crackers'], destinationHref: '/festivals/diwali' },

  // E (2)
  { name: 'Eid al-Adha (Bakrid)', letter: 'E', file: 'eid_al_aida.png', searchTerms: ['eid al adha', 'bakrid', 'qurbani', 'muslim festival'], destinationHref: '/festivals/eid-al-adha' },
  { name: 'Eid al-Fitr (Ramzan)', letter: 'E', file: 'eid_al_fitr.png', searchTerms: ['eid al fitr', 'ramzan', 'ramadan', 'meethi eid'], destinationHref: '/festivals/eid-al-fitr' },

  // F (2)
  { name: 'Flipkart Big Billion Days', letter: 'F', file: 'flipkart_bigbilliondays.png', searchTerms: ['flipkart', 'big billion days', 'bbd', 'mega sale'], destinationHref: '/festivals/flipkart-bbd' },
  { name: "Father's Day", letter: 'F', file: 'fathers_day.png', searchTerms: ['fathers day', 'dad', 'gifts', 'celebration'], destinationHref: '/festivals/fathers-day' },

  // G (2)
  { name: 'Ganesh Chaturthi', letter: 'G', file: 'ganesh_chathurthi.png', searchTerms: ['ganesh chaturthi', 'vinayaka chavithi', 'ganpati', 'modak'], destinationHref: '/festivals/ganesh-chaturthi' },
  { name: 'Gandhi Jayanthi', letter: 'G', file: 'gandhi_jayanthi.png', searchTerms: ['gandhi jayanthi', '2nd october', 'mahatma gandhi'], destinationHref: '/festivals/gandhi-jayanthi' },

  // H (1)
  { name: 'Holi', letter: 'H', file: 'holi.png', searchTerms: ['holi', 'festival of colors', 'gulal', 'spring'], destinationHref: '/festivals/holi' },

  // I (1)
  { name: 'Independence Day', letter: 'I', file: 'independence_day.png', searchTerms: ['independence day', '15th august', 'national holiday', 'india'], destinationHref: '/festivals/independence-day' },

  // K (2)
  { name: 'Kanuma', letter: 'K', file: 'kanuma.png', searchTerms: ['kanuma', 'sankranti', 'cattle festival', 'telugu'], destinationHref: '/festivals/kanuma' },
  { name: 'Karthika Masam', letter: 'K', file: 'karthika_masam.png', searchTerms: ['karthika masam', 'holy month', 'deepam', 'shiva'], destinationHref: '/festivals/karthika-masam' },

  // M (3)
  { name: 'Maha Shivaratri', letter: 'M', file: 'maha_shiraratri.png', searchTerms: ['maha shivaratri', 'lord shiva', 'om namah shivaya'], destinationHref: '/festivals/maha-shivaratri' },
  { name: 'Makar Sankranthi', letter: 'M', file: 'makara_sankranthi.png', searchTerms: ['makar sankranthi', 'sankranti', 'kites', 'pongal', 'harvest'], destinationHref: '/festivals/makar-sankranthi' },
  { name: "Mother's Day", letter: 'M', file: 'mothers_day.png', searchTerms: ['mothers day', 'mom', 'gifts', 'celebration'], destinationHref: '/festivals/mothers-day' },

  // N (2)
  { name: 'New year', letter: 'N', file: 'newyear.png', searchTerms: ['new year', 'happy new year', '1st january', 'party'], destinationHref: '/festivals/new-year' },
  { name: 'Navratri', letter: 'N', file: 'dassara.png', searchTerms: ['navratri', 'garba', 'dandiya', 'durga puja', '9 days'], destinationHref: '/festivals/navratri' },

  // O (1)
  { name: 'Onam', letter: 'O', file: 'onam.png', searchTerms: ['onam', 'kerala festival', 'pookalam', 'harvest', 'onasadya'], destinationHref: '/festivals/onam' },

  // R (3)
  { name: 'Ram Navami', letter: 'R', file: 'ramnavami.png', searchTerms: ['ram navami', 'sri rama', 'ayodhya', 'kalyanam'], destinationHref: '/festivals/ram-navami' },
  { name: 'Republic Day', letter: 'R', file: 'republic_day.png', searchTerms: ['republic day', '26th january', 'constitution', 'parade'], destinationHref: '/festivals/republic-day' },
  { name: 'Rakhi', letter: 'R', file: 'rakhi.png', searchTerms: ['rakhi', 'raksha bandhan', 'brother sister', 'gifts'], destinationHref: '/festivals/rakhi' },

  // T (1)
  { name: "Teacher's Day", letter: 'T', file: 'teachers_day.png', searchTerms: ['teachers day', '5th september', 'dr radhakrishnan'], destinationHref: '/festivals/teachers-day' },

  // U (1)
  { name: 'Ugadi', letter: 'U', file: 'ugadi.png', searchTerms: ['ugadi', 'telugu new year', 'kannada new year', 'pachadi'], destinationHref: '/festivals/ugadi' },

  // V (1)
  { name: "Valentine's Day", letter: 'V', file: 'valentines_day.png', searchTerms: ['valentines day', '14th february', 'love', 'roses', 'gifts'], destinationHref: '/festivals/valentines-day' },
]

export const FESTIVALS_DIRECTORY_DATA: DirectoryFestival[] = RAW_FESTIVALS.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `festival-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    image: getFestivalImage(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
