/**
 * Stores Directory Data
 * Source of Truth: Stores (1).png (1920x8741px Native Figma Export)
 * Exactly 61 Store Cards across 21 Visible Letter Groups
 * 6 Dedicated Trending Stores
 */

export interface DirectoryStore {
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

export interface TrendingStore {
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

function getStoreLogo(filename: string): string {
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

// 6 Dedicated Trending Stores in exact Figma order
export const TRENDING_STORES: TrendingStore[] = [
  {
    id: 'trending-amazon',
    name: 'Amazon',
    slug: 'amazon',
    logo: getStoreLogo('amazon-logo.png') || getStoreLogo('amazon.png'),
    href: '/stores/amazon',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-flipkart',
    name: 'Flipkart',
    slug: 'flipkart',
    logo: getStoreLogo('flipkart-logo.png') || getStoreLogo('Flipkart.png'),
    href: '/stores/flipkart',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-myntra',
    name: 'Myntra',
    slug: 'myntra',
    logo: getStoreLogo('myntra-logo.png') || getStoreLogo('Myntra.png'),
    href: '/stores/myntra',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-ajio',
    name: 'Ajio',
    slug: 'ajio',
    logo: getStoreLogo('ajio-logo.png') || getStoreLogo('Ajio.png'),
    href: '/stores/ajio',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logo: getStoreLogo('swiggy-logo.png') || getStoreLogo('Swiggy.png'),
    href: '/stores/swiggy',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-zomato',
    name: 'Zomato',
    slug: 'zomato',
    logo: getStoreLogo('zomato-logo.png') || getStoreLogo('Zomato.png'),
    href: '/stores/zomato',
    active: true,
    sortOrder: 6,
  },
]

// Exact 61 Store Cards from Stores (1).png across 21 Visible Letter Groups
const RAW_STORES: Array<{ name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // A (5)
  { name: 'Amazon', letter: 'A', file: 'amazon.png', searchTerms: ['amazon', 'shopping', 'ecommerce'], destinationHref: '/stores/amazon' },
  { name: 'Ajio', letter: 'A', file: 'Ajio.png', searchTerms: ['ajio', 'fashion', 'clothes'], destinationHref: '/stores/ajio' },
  { name: 'Aha', letter: 'A', file: 'aha.png', searchTerms: ['aha', 'ott', 'movies', 'streaming'], destinationHref: '/stores/aha' },
  { name: 'Alt Balaji', letter: 'A', file: 'alt_balaji.png', searchTerms: ['alt balaji', 'entertainment', 'ott'], destinationHref: '/stores/alt-balaji' },
  { name: 'Amazon Prime Video', letter: 'A', file: 'Amazon_Prime.png', searchTerms: ['prime', 'amazon', 'streaming', 'video'], destinationHref: '/stores/amazon-prime' },

  // B (2)
  { name: 'Blinkit', letter: 'B', file: 'Blinkit.png', searchTerms: ['blinkit', 'grocery', 'quick commerce'], destinationHref: '/stores/blinkit' },
  { name: 'Big Basket', letter: 'B', file: 'bigbasket.png', searchTerms: ['bigbasket', 'grocery', 'fruits', 'veg'], destinationHref: '/stores/bigbasket' },

  // C (1)
  { name: 'Croma', letter: 'C', file: 'croma.png', searchTerms: ['croma', 'electronics', 'gadgets'], destinationHref: '/stores/croma' },

  // D (4)
  { name: 'Dunzo', letter: 'D', file: 'dunzo.png', searchTerms: ['dunzo', 'delivery', 'quick commerce'], destinationHref: '/stores/dunzo' },
  { name: 'DMart', letter: 'D', file: 'DMart.png', searchTerms: ['dmart', 'supermarket', 'grocery'], destinationHref: '/stores/dmart' },
  { name: 'Disney+Hotstar', letter: 'D', file: 'disney+hotstar.png', searchTerms: ['hotstar', 'disney', 'ott', 'movies'], destinationHref: '/stores/hotstar' },
  { name: "Domino's India", letter: 'D', file: 'Dominos.png', searchTerms: ['dominos', 'pizza', 'fast food'], destinationHref: '/stores/dominos' },

  // E (1)
  { name: 'Eatsure', letter: 'E', file: 'eatsure.png', searchTerms: ['eatsure', 'food', 'behrouz', 'faasos'], destinationHref: '/stores/eatsure' },

  // F (3)
  { name: 'Faasos', letter: 'F', file: 'faasos.png', searchTerms: ['faasos', 'wraps', 'rolls', 'food'], destinationHref: '/stores/faasos' },
  { name: 'Flipkart', letter: 'F', file: 'Flipkart.png', searchTerms: ['flipkart', 'shopping', 'mega sale'], destinationHref: '/stores/flipkart' },
  { name: 'Firstcry', letter: 'F', file: 'firstcry.png', searchTerms: ['firstcry', 'baby products', 'toys'], destinationHref: '/stores/firstcry' },

  // H (2)
  { name: 'H&M', letter: 'H', file: 'H&M.png', searchTerms: ['h&m', 'fashion', 'apparel'], destinationHref: '/stores/hm' },
  { name: 'Housejoy', letter: 'H', file: 'housejoy.png', searchTerms: ['housejoy', 'cleaning', 'home service'], destinationHref: '/stores/housejoy' },

  // J (2)
  { name: 'JioCinema', letter: 'J', file: 'jio_cinema.png', searchTerms: ['jiocinema', 'movies', 'live cricket'], destinationHref: '/stores/jiocinema' },
  { name: 'JioMart', letter: 'J', file: 'JioMart.png', searchTerms: ['jiomart', 'grocery', 'electronics'], destinationHref: '/stores/jiomart' },

  // L (2)
  { name: "Levi's", letter: 'L', file: 'levis.png', searchTerms: ['levis', 'jeans', 'denim', 'jackets'], destinationHref: '/stores/levis' },
  { name: 'Lifestyle', letter: 'L', file: 'Lifestyle.png', searchTerms: ['lifestyle', 'department store', 'clothes'], destinationHref: '/stores/lifestyle' },

  // M (3)
  { name: 'MX Player', letter: 'M', file: 'MX_Player.png', searchTerms: ['mx player', 'video', 'ott', 'movies'], destinationHref: '/stores/mx-player' },
  { name: 'Myntra', letter: 'M', file: 'Myntra.png', searchTerms: ['myntra', 'fashion', 'apparel', 'shoes'], destinationHref: '/stores/myntra' },
  { name: 'Meesho', letter: 'M', file: 'Meesho.png', searchTerms: ['meesho', 'online shopping', 'wholesale'], destinationHref: '/stores/meesho' },

  // N (5)
  { name: 'Naaptol', letter: 'N', file: 'naaptol.png', searchTerms: ['naaptol', 'tv shop', 'deals'], destinationHref: '/stores/naaptol' },
  { name: "Nature's Basket", letter: 'N', file: 'natures_basket.png', searchTerms: ['organic', 'grocery', 'gourmet food'], destinationHref: '/stores/natures-basket' },
  { name: "Namdhari's Fresh", letter: 'N', file: "Namdhari's_Fresh.png", searchTerms: ['namdharis', 'fresh fruits', 'vegetables'], destinationHref: '/stores/namdharis' },
  { name: 'Netflix', letter: 'N', file: 'Netflix.png', searchTerms: ['netflix', 'streaming', 'shows', 'movies'], destinationHref: '/stores/netflix' },
  { name: 'Nykaa', letter: 'N', file: 'nykaa.png', searchTerms: ['nykaa', 'makeup', 'cosmetics', 'beauty'], destinationHref: '/stores/nykaa' },

  // O (1)
  { name: 'Ola', letter: 'O', file: 'Ola-auto.png', searchTerms: ['ola', 'cabs', 'auto', 'rides', 'taxi'], destinationHref: '/stores/ola' },

  // P (5)
  { name: 'Pepperfry', letter: 'P', file: 'Pepperfry.png', searchTerms: ['pepperfry', 'furniture', 'home decor'], destinationHref: '/stores/pepperfry' },
  { name: 'Pantaloons', letter: 'P', file: 'pantaloons.png', searchTerms: ['pantaloons', 'fashion', 'apparel'], destinationHref: '/stores/pantaloons' },
  { name: 'Paytm Mall', letter: 'P', file: 'Paytm_mall.png', searchTerms: ['paytm', 'recharge', 'mall', 'shopping'], destinationHref: '/stores/paytm-mall' },
  { name: 'Poorvika Mobiles', letter: 'P', file: 'poorvika.png', searchTerms: ['poorvika', 'mobiles', 'tablets', 'gadgets'], destinationHref: '/stores/poorvika' },
  { name: 'Purplle', letter: 'P', file: 'purplle.png', searchTerms: ['purplle', 'cosmetics', 'skincare'], destinationHref: '/stores/purplle' },

  // Q (1)
  { name: 'Quikr', letter: 'Q', file: 'Quikr.png', searchTerms: ['quikr', 'classifieds', 'used cars', 'jobs'], destinationHref: '/stores/quikr' },

  // R (3)
  { name: 'Rapido', letter: 'R', file: 'Rapido-bike.png', searchTerms: ['rapido', 'bike taxi', 'auto', 'rides'], destinationHref: '/stores/rapido' },
  { name: 'Reliance Smart', letter: 'R', file: 'reliance_smart.png', searchTerms: ['smart bazaar', 'grocery', 'reliance'], destinationHref: '/stores/reliance-smart' },
  { name: 'Reliance Digital', letter: 'R', file: 'Reliance_Digital.png', searchTerms: ['reliance digital', 'electronics'], destinationHref: '/stores/reliance-digital' },

  // S (8)
  { name: 'SonyLIV', letter: 'S', file: 'SonyLIV.png', searchTerms: ['sonyliv', 'live sports', 'ucl', 'ott'], destinationHref: '/stores/sonyliv' },
  { name: 'ShopClues', letter: 'S', file: 'shopclues.png', searchTerms: ['shopclues', 'budget shopping', 'deals'], destinationHref: '/stores/shopclues' },
  { name: 'Shoppers Stop', letter: 'S', file: 'shoppers_stop.png', searchTerms: ['shoppers stop', 'beauty', 'perfume'], destinationHref: '/stores/shoppers-stop' },
  { name: 'Sun NXT', letter: 'S', file: 'Sun_NXT.png', searchTerms: ['sun nxt', 'south movies', 'sun tv'], destinationHref: '/stores/sun-nxt' },
  { name: "Spencer's Retail", letter: 'S', file: 'Spencers.png', searchTerms: ['spencers', 'hypermarket', 'grocery'], destinationHref: '/stores/spencers' },
  { name: 'Swiggy Instamart', letter: 'S', file: 'swiggy_instamart.png', searchTerms: ['instamart', 'quick grocery', 'swiggy'], destinationHref: '/stores/instamart' },
  { name: 'Snapdeal', letter: 'S', file: 'Snapdeal.png', searchTerms: ['snapdeal', 'shopping', 'discounts'], destinationHref: '/stores/snapdeal' },
  { name: 'Swiggy', letter: 'S', file: 'Swiggy.png', searchTerms: ['swiggy', 'food delivery', 'dining'], destinationHref: '/stores/swiggy' },

  // T (2)
  { name: 'TataNeu', letter: 'T', file: 'TATA_neu.png', searchTerms: ['tata neu', 'rewards', 'super app'], destinationHref: '/stores/tata-neu' },
  { name: 'Tata CLiQ', letter: 'T', file: 'Tata-CLiQ.png', searchTerms: ['tata cliq', 'luxury', 'electronics'], destinationHref: '/stores/tata-cliq' },

  // U (3)
  { name: 'Uber Eats India', letter: 'U', file: 'Uber-Eats.png', searchTerms: ['uber eats', 'food ordering'], destinationHref: '/stores/uber-eats' },
  { name: 'Uber India', letter: 'U', file: 'Uber-india.png', searchTerms: ['uber', 'rides', 'airport taxi', 'auto'], destinationHref: '/stores/uber' },
  { name: 'Udaan', letter: 'U', file: 'Udaanlogo.png', searchTerms: ['udaan', 'b2b trade', 'wholesale'], destinationHref: '/stores/udaan' },

  // V (2)
  { name: 'Vijay Sales', letter: 'V', file: 'vijay_sales.png', searchTerms: ['vijay sales', 'electronics', 'ac', 'tv'], destinationHref: '/stores/vijay-sales' },
  { name: 'Voonik', letter: 'V', file: 'voonik.png', searchTerms: ['voonik', 'women fashion', 'sarees'], destinationHref: '/stores/voonik' },

  // Y (1)
  { name: 'Yepme', letter: 'Y', file: 'yepme.png', searchTerms: ['yepme', 'online shopping', 'shoes'], destinationHref: '/stores/yepme' },

  // Z (5)
  { name: 'Zee5', letter: 'Z', file: 'Zee5.png', searchTerms: ['zee5', 'web series', 'live tv', 'ott'], destinationHref: '/stores/zee5' },
  { name: 'Zara', letter: 'Z', file: 'zara.png', searchTerms: ['zara', 'luxury fashion', 'clothing'], destinationHref: '/stores/zara' },
  { name: 'Zepto', letter: 'Z', file: 'Zepto.png', searchTerms: ['zepto', '10 min grocery delivery'], destinationHref: '/stores/zepto' },
  { name: 'Zivame', letter: 'Z', file: 'Zivame.png', searchTerms: ['zivame', 'lingerie', 'activewear', 'bras'], destinationHref: '/stores/zivame' },
  { name: 'Zomato', letter: 'Z', file: 'Zomato.png', searchTerms: ['zomato', 'food delivery', 'gold'], destinationHref: '/stores/zomato' },
]

export const STORES_DIRECTORY_DATA: DirectoryStore[] = RAW_STORES.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `store-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    logo: getStoreLogo(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
