/**
 * Travelling Directory Data
 * Source of Truth: Travel.png (1920x7669px Native Figma Export)
 * Exactly 43 Travel Directory Cards across 17 Visible Letter Groups
 * 6 Dedicated Trending Travel Categories
 */

export interface DirectoryTravelItem {
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

export interface TrendingTravelCategory {
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

function getTravelAsset(filename: string): string {
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

// 6 Dedicated Trending Travel Categories in exact Figma order
export const TRENDING_TRAVELLING: TrendingTravelCategory[] = [
  {
    id: 'trending-planes',
    name: 'Planes',
    slug: 'planes',
    image: getTravelAsset('flight.png'),
    href: '/travel/planes',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-trains',
    name: 'Trains',
    slug: 'trains',
    image: getTravelAsset('train_tickets.png'),
    href: '/travel/trains',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-buses',
    name: 'Buses',
    slug: 'buses',
    image: getTravelAsset('makemytrip_buses.png'),
    href: '/travel/buses',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-cabs',
    name: 'Cabs',
    slug: 'cabs',
    image: getTravelAsset('uber_cab.png'),
    href: '/travel/cabs',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-bikes',
    name: 'Bikes',
    slug: 'bikes',
    image: getTravelAsset('Rapido-bike.png'),
    href: '/travel/bikes',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-autos',
    name: 'Autos',
    slug: 'autos',
    image: getTravelAsset('Ola-auto.png'),
    href: '/travel/autos',
    active: true,
    sortOrder: 6,
  },
]

// Exact 43 Travel Directory Cards from Travel.png across 17 Visible Letter Groups
const RAW_TRAVEL: Array<{ id: string; name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // A (6)
  { id: 'travel-air-india', name: 'Air India', letter: 'A', file: 'air_india.png', searchTerms: ['air india', 'flight', 'airline', 'tickets'], destinationHref: '/travel/air-india' },
  { id: 'travel-air-india-express', name: 'Air India Express', letter: 'A', file: 'Air_India_express.png', searchTerms: ['air india express', 'flight', 'domestic', 'international'], destinationHref: '/travel/air-india-express' },
  { id: 'travel-akasa-air', name: 'Akasa Air', letter: 'A', file: 'Akasa_Air.png', searchTerms: ['akasa air', 'budget airline', 'flight'], destinationHref: '/travel/akasa-air' },
  { id: 'travel-alliance-air', name: 'Alliance Air', letter: 'A', file: 'alliance_air.png', searchTerms: ['alliance air', 'regional flight', 'airline'], destinationHref: '/travel/alliance-air' },
  { id: 'travel-apsrtc', name: 'APSRTC', letter: 'A', file: 'apsrtc.png', searchTerms: ['apsrtc', 'andhra bus', 'rtc bus', 'tickets'], destinationHref: '/travel/apsrtc' },
  { id: 'travel-abhibus', name: 'Abhibus', letter: 'A', file: 'abhibus.png', searchTerms: ['abhibus', 'bus booking', 'travel', 'tickets'], destinationHref: '/travel/abhibus' },

  // C (3)
  { id: 'travel-cleartrip', name: 'Cleartrip', letter: 'C', file: 'cleartrip.png', searchTerms: ['cleartrip', 'flights', 'hotels', 'travel'], destinationHref: '/travel/cleartrip' },
  { id: 'travel-confirmtkt', name: 'ConfirmTkt', letter: 'C', file: 'confirmtkt.png', searchTerms: ['confirmtkt', 'train ticket', 'irctc', 'waitlist'], destinationHref: '/travel/confirmtkt' },
  { id: 'travel-citi-bank', name: 'Citi bank', letter: 'C', file: 'Citibank.png', searchTerms: ['citi bank', 'citibank', 'travel card', 'credit card'], destinationHref: '/travel/citi-bank' },

  // E (4)
  { id: 'travel-easemytrip', name: 'EaseMyTrip', letter: 'E', file: 'EaseMyTrip.png', searchTerms: ['easemytrip', 'flights', 'no convenience fee'], destinationHref: '/travel/easemytrip' },
  { id: 'travel-emirates', name: 'Emirates', letter: 'E', file: 'Emirates.png', searchTerms: ['emirates', 'international flight', 'dubai', 'airline'], destinationHref: '/travel/emirates' },
  { id: 'travel-etihad-airways', name: 'Etihad Airways', letter: 'E', file: 'Etihad.png', searchTerms: ['etihad', 'airways', 'abu dhabi', 'flight'], destinationHref: '/travel/etihad' },
  { id: 'travel-expedia', name: 'Expedia', letter: 'E', file: 'Expedia.png', searchTerms: ['expedia', 'hotels', 'holidays', 'flight booking'], destinationHref: '/travel/expedia' },

  // G (1)
  { id: 'travel-goibibo', name: 'Goibibo', letter: 'G', file: 'Goibibo.png', searchTerms: ['goibibo', 'flights', 'hotels', 'bus tickets'], destinationHref: '/travel/goibibo' },

  // I (4)
  { id: 'travel-indigo', name: 'IndiGo', letter: 'I', file: 'IndiGo.png', searchTerms: ['indigo', 'flight', '6e', 'domestic airline'], destinationHref: '/travel/indigo' },
  { id: 'ixigo-blue', name: 'ixigo', letter: 'I', file: 'ixigo.png', searchTerms: ['ixigo', 'trains', 'train status', 'pnr'], destinationHref: '/travel/ixigo-trains' },
  { id: 'travel-irctc', name: 'IRCTC', letter: 'I', file: 'IRCTC.png', searchTerms: ['irctc', 'railway', 'train tickets', 'tourism'], destinationHref: '/travel/irctc' },
  { id: 'ixigo-orange', name: 'ixigo', letter: 'I', file: 'ixigo_flights.png', searchTerms: ['ixigo', 'flights', 'flight booking', 'offers'], destinationHref: '/travel/ixigo-flights' },

  // K (1)
  { id: 'travel-kayak', name: 'Kayak', letter: 'K', file: 'Kayak.png', searchTerms: ['kayak', 'flight compare', 'hotels', 'car rental'], destinationHref: '/travel/kayak' },

  // L (1)
  { id: 'travel-lufthansa', name: 'Lufthansa', letter: 'L', file: 'Lufthansa.png', searchTerms: ['lufthansa', 'german airline', 'europe flight'], destinationHref: '/travel/lufthansa' },

  // M (4)
  { id: 'travel-msrtc', name: 'MSRTC', letter: 'M', file: 'Maharashtra_State_Road_Transport_Corporation.png', searchTerms: ['msrtc', 'maharashtra bus', 'st bus'], destinationHref: '/travel/msrtc' },
  { id: 'travel-makemytrip', name: 'MakeMyTrip', letter: 'M', file: 'makemytrip_flights.png', searchTerms: ['makemytrip', 'mmt', 'flights', 'hotels'], destinationHref: '/travel/makemytrip' },
  { id: 'travel-mega-cabs', name: 'Mega Cabs', letter: 'M', file: 'Mega_Cap_High_Brand.png', searchTerms: ['mega cabs', 'taxi', 'airport cab'], destinationHref: '/travel/mega-cabs' },
  { id: 'travel-meru', name: 'Meru', letter: 'M', file: 'Meru_Cabs.png', searchTerms: ['meru', 'cabs', 'taxi', 'rides'], destinationHref: '/travel/meru' },

  // O (1)
  { id: 'travel-ola', name: 'Ola', letter: 'O', file: 'Ola-auto.png', searchTerms: ['ola', 'cabs', 'auto', 'bike taxi', 'rides'], destinationHref: '/travel/ola' },

  // P (2)
  { id: 'travel-paytm-flights', name: 'Paytm Flights', letter: 'P', file: 'paytm_flights.png', searchTerms: ['paytm', 'flights', 'ticket booking', 'cashback'], destinationHref: '/travel/paytm-flights' },
  { id: 'travel-paytm-buses', name: 'Paytm Buses', letter: 'P', file: 'paytm_bus.png', searchTerms: ['paytm', 'bus tickets', 'volvo', 'sleeper'], destinationHref: '/travel/paytm-buses' },

  // Q (1)
  { id: 'travel-qatar-airways', name: 'Qatar Airways', letter: 'Q', file: 'Qatar_Airways.png', searchTerms: ['qatar airways', 'doha', 'world best airline'], destinationHref: '/travel/qatar-airways' },

  // R (4)
  { id: 'travel-redbus', name: 'RedBus', letter: 'R', file: 'RedBus.png', searchTerms: ['redbus', 'bus booking', 'rpool', 'primo'], destinationHref: '/travel/redbus' },
  { id: 'travel-rail-yatri', name: 'Rail Yatri', letter: 'R', file: 'railyatri.png', searchTerms: ['rail yatri', 'train food', 'smartbus', 'live status'], destinationHref: '/travel/railyatri' },
  { id: 'travel-revv', name: 'Revv', letter: 'R', file: 'Revv_Cars.png', searchTerms: ['revv', 'self drive car', 'car rental'], destinationHref: '/travel/revv' },
  { id: 'travel-rapido', name: 'Rapido', letter: 'R', file: 'Rapido-bike.png', searchTerms: ['rapido', 'bike taxi', 'auto', 'captain'], destinationHref: '/travel/rapido' },

  // S (5)
  { id: 'travel-singapore-airlines', name: 'Singapore Airlines', letter: 'S', file: 'Singapore_Airlines.png', searchTerms: ['singapore airlines', 'sia', 'krisflyer'], destinationHref: '/travel/singapore-airlines' },
  { id: 'travel-skyscanner', name: 'Skyscanner', letter: 'S', file: 'Skyscanner.png', searchTerms: ['skyscanner', 'flight search', 'cheap flights'], destinationHref: '/travel/skyscanner' },
  { id: 'travel-spicejet', name: 'SpiceJet', letter: 'S', file: 'SpiceJet.png', searchTerms: ['spicejet', 'red hot spicy', 'domestic flight'], destinationHref: '/travel/spicejet' },
  { id: 'travel-star-air', name: 'Star Air', letter: 'S', file: 'Star_Air.png', searchTerms: ['star air', 'connecting real india', 'flights'], destinationHref: '/travel/star-air' },
  { id: 'travel-savaari', name: 'Savaari', letter: 'S', file: 'Savaari.png', searchTerms: ['savaari', 'outstation cabs', 'car rental'], destinationHref: '/travel/savaari' },

  // T (3)
  { id: 'travel-tnstc', name: 'TNSTC', letter: 'T', file: 'tnstc.png', searchTerms: ['tnstc', 'tamil nadu bus', 'setc bus'], destinationHref: '/travel/tnstc' },
  { id: 'travel-tsrtc', name: 'TSRTC', letter: 'T', file: 'tgrtc.png', searchTerms: ['tsrtc', 'tgrtc', 'telangana bus', 'garuda'], destinationHref: '/travel/tsrtc' },
  { id: 'travel-trainman', name: 'Trainman', letter: 'T', file: 'trainman.png', searchTerms: ['trainman', 'pnr prediction', 'train ticket'], destinationHref: '/travel/trainman' },

  // U (1)
  { id: 'travel-uber', name: 'Uber', letter: 'U', file: 'Uber-india.png', searchTerms: ['uber', 'uber cab', 'auto', 'moto', 'rides'], destinationHref: '/travel/uber' },

  // Y (1)
  { id: 'travel-yatra', name: 'Yatra', letter: 'Y', file: 'Yatra.png', searchTerms: ['yatra', 'ehsan yatra', 'flights', 'holidays'], destinationHref: '/travel/yatra' },

  // Z (1)
  { id: 'travel-zoomcar', name: 'Zoomcar', letter: 'Z', file: 'zoomcar.png', searchTerms: ['zoomcar', 'self drive', 'car sharing'], destinationHref: '/travel/zoomcar' },
]

export const TRAVELLING_DIRECTORY_DATA: DirectoryTravelItem[] = RAW_TRAVEL.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: item.id,
    name: item.name,
    slug: slug,
    letter: item.letter,
    logo: getTravelAsset(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
