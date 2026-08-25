/**
 * Brands Directory Data
 * Source of Truth: Brands.png (1920x10199px Native Figma Export)
 * Exactly 88 Brand Cards across 23 Visible Letter Groups
 * 6 Dedicated Trending Brands
 */

export interface DirectoryBrand {
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

export interface TrendingBrand {
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

function getBrandLogo(filename: string): string {
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

// 6 Dedicated Trending Brands in exact Figma order
export const TRENDING_BRANDS: TrendingBrand[] = [
  {
    id: 'trending-apple',
    name: 'Apple',
    slug: 'apple',
    logo: getBrandLogo('Apple.png'),
    href: '/brands/apple',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-boat',
    name: 'Boat',
    slug: 'boat',
    logo: getBrandLogo('boat.png'),
    href: '/brands/boat',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-adidas',
    name: 'Adidas',
    slug: 'adidas',
    logo: getBrandLogo('adidas.png'),
    href: '/brands/adidas',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-dell',
    name: 'Dell',
    slug: 'dell',
    logo: getBrandLogo('dell.png'),
    href: '/brands/dell',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-nike',
    name: 'Nike',
    slug: 'nike',
    logo: getBrandLogo('Nike-Logo.png'),
    href: '/brands/nike',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-samsung',
    name: 'Samsung',
    slug: 'samsung',
    logo: getBrandLogo('Samsung.png'),
    href: '/brands/samsung',
    active: true,
    sortOrder: 6,
  },
]

// Exact 88 Brand Cards from Brands.png across 23 Visible Letter Groups
const RAW_BRANDS: Array<{ name: string; letter: string; file: string; searchTerms: string[]; destinationHref: string }> = [
  // A (6)
  { name: 'Aashirvaad', letter: 'A', file: 'aashirvaad.png', searchTerms: ['aashirvaad', 'atta', 'flour', 'spices'], destinationHref: '/brands/aashirvaad' },
  { name: 'Adidas', letter: 'A', file: 'adidas.png', searchTerms: ['adidas', 'shoes', 'sportswear', 'sneakers'], destinationHref: '/brands/adidas' },
  { name: 'Allen Solly', letter: 'A', file: 'allensolly.png', searchTerms: ['allen solly', 'formal', 'shirts', 'clothing'], destinationHref: '/brands/allen-solly' },
  { name: 'American Eagle', letter: 'A', file: 'american-eagle.png', searchTerms: ['american eagle', 'jeans', 'denim'], destinationHref: '/brands/american-eagle' },
  { name: 'Amul', letter: 'A', file: 'Amul.png', searchTerms: ['amul', 'milk', 'butter', 'dairy', 'ice cream'], destinationHref: '/brands/amul' },
  { name: 'Apple', letter: 'A', file: 'Apple.png', searchTerms: ['apple', 'iphone', 'macbook', 'ipad', 'airpods'], destinationHref: '/brands/apple' },

  // B (6)
  { name: 'Bajaj', letter: 'B', file: 'Bajaj.png', searchTerms: ['bajaj', 'appliances', 'fans', 'electronics'], destinationHref: '/brands/bajaj' },
  { name: 'Bata', letter: 'B', file: 'bata.png', searchTerms: ['bata', 'shoes', 'footwear', 'sandals'], destinationHref: '/brands/bata' },
  { name: 'Being Human', letter: 'B', file: 'Being_Human.png', searchTerms: ['being human', 'clothing', 'fashion', 'salman'], destinationHref: '/brands/being-human' },
  { name: 'Blackberrys', letter: 'B', file: 'blackberry.png', searchTerms: ['blackberrys', 'suits', 'blazers', 'formal'], destinationHref: '/brands/blackberrys' },
  { name: 'Boat', letter: 'B', file: 'boat.png', searchTerms: ['boat', 'headphones', 'earphones', 'smartwatch'], destinationHref: '/brands/boat' },
  { name: 'Britannia', letter: 'B', file: 'Britannia.png', searchTerms: ['britannia', 'biscuits', 'cookies', 'bread'], destinationHref: '/brands/britannia' },

  // C (6)
  { name: 'Cadbury', letter: 'C', file: 'cadbury.png', searchTerms: ['cadbury', 'chocolate', 'dairy milk', 'oreo'], destinationHref: '/brands/cadbury' },
  { name: 'Calvin Klein', letter: 'C', file: 'calvin-klein.png', searchTerms: ['calvin klein', 'ck', 'perfume', 'underwear'], destinationHref: '/brands/calvin-klein' },
  { name: 'Campus', letter: 'C', file: 'Campus.png', searchTerms: ['campus', 'shoes', 'sneakers', 'running'], destinationHref: '/brands/campus' },
  { name: 'Coca-Cola', letter: 'C', file: 'Coca-Cola.png', searchTerms: ['coca cola', 'coke', 'beverages', 'drinks'], destinationHref: '/brands/coca-cola' },
  { name: 'Colgate', letter: 'C', file: 'colgate.png', searchTerms: ['colgate', 'toothpaste', 'toothbrush', 'oral care'], destinationHref: '/brands/colgate' },
  { name: 'Crocs', letter: 'C', file: 'crocs.png', searchTerms: ['crocs', 'clogs', 'sandals', 'footwear'], destinationHref: '/brands/crocs' },

  // D (5)
  { name: 'Dabur', letter: 'D', file: 'Dabur.png', searchTerms: ['dabur', 'honey', 'ayurveda', 'chyawanprash'], destinationHref: '/brands/dabur' },
  { name: 'Decathlon', letter: 'D', file: 'Decathlon.png', searchTerms: ['decathlon', 'sports', 'fitness', 'gear'], destinationHref: '/brands/decathlon' },
  { name: 'Dell', letter: 'D', file: 'dell.png', searchTerms: ['dell', 'laptops', 'computers', 'monitors'], destinationHref: '/brands/dell' },
  { name: 'Dettol', letter: 'D', file: 'Dettol.png', searchTerms: ['dettol', 'antiseptic', 'soap', 'handwash'], destinationHref: '/brands/dettol' },
  { name: "Domino's", letter: 'D', file: 'Dominos.png', searchTerms: ['dominos', 'pizza', 'fast food'], destinationHref: '/brands/dominos' },

  // F (2)
  { name: 'Fastrack', letter: 'F', file: 'Fastrack.png', searchTerms: ['fastrack', 'watches', 'sunglasses', 'bags'], destinationHref: '/brands/fastrack' },
  { name: 'Fortune', letter: 'F', file: 'fortune.png', searchTerms: ['fortune', 'oil', 'edible oil', 'besan'], destinationHref: '/brands/fortune' },

  // G (3)
  { name: 'Garnier', letter: 'G', file: 'Garnier.png', searchTerms: ['garnier', 'hair color', 'face wash', 'micellar'], destinationHref: '/brands/garnier' },
  { name: 'Godrej', letter: 'G', file: 'Godrej.png', searchTerms: ['godrej', 'locks', 'appliances', 'aer'], destinationHref: '/brands/godrej' },
  { name: 'Good Day', letter: 'G', file: 'goodday.png', searchTerms: ['good day', 'biscuits', 'britannia', 'cookies'], destinationHref: '/brands/good-day' },

  // H (4)
  { name: 'H&M', letter: 'H', file: 'H&M.png', searchTerms: ['h&m', 'fashion', 'clothing', 'apparel'], destinationHref: '/brands/hm' },
  { name: 'Havells', letter: 'H', file: 'Havells.png', searchTerms: ['havells', 'fans', 'lights', 'appliances'], destinationHref: '/brands/havells' },
  { name: 'Head & Shoulders', letter: 'H', file: 'Head_Shoulders.png', searchTerms: ['head and shoulders', 'shampoo', 'anti dandruff'], destinationHref: '/brands/head-and-shoulders' },
  { name: 'Himalaya', letter: 'H', file: 'himalaya.png', searchTerms: ['himalaya', 'face wash', 'neem', 'ayurveda'], destinationHref: '/brands/himalaya' },

  // I (3)
  { name: 'IKEA', letter: 'I', file: 'Ikea.png', searchTerms: ['ikea', 'furniture', 'home decor', 'kitchenware'], destinationHref: '/brands/ikea' },
  { name: 'iQOO', letter: 'I', file: 'iqoo.png', searchTerms: ['iqoo', 'mobiles', 'smartphones', 'gaming phone'], destinationHref: '/brands/iqoo' },
  { name: 'ITC Limited', letter: 'I', file: 'ITC_Limited.png', searchTerms: ['itc', 'fmcg', 'sunfeast', 'yippee'], destinationHref: '/brands/itc' },

  // J (3)
  { name: 'Jio', letter: 'J', file: 'Reliance_Jio.png', searchTerms: ['jio', 'reliance', 'telecom', '5g', 'fiber'], destinationHref: '/brands/jio' },
  { name: 'JBL', letter: 'J', file: 'jbl.png', searchTerms: ['jbl', 'speakers', 'soundbar', 'bluetooth', 'audio'], destinationHref: '/brands/jbl' },
  { name: "Johnson's", letter: 'J', file: 'Johnsons.png', searchTerms: ['johnsons', 'baby shampoo', 'baby oil', 'soap'], destinationHref: '/brands/johnsons' },

  // K (1)
  { name: "Kellogg's", letter: 'K', file: "Kellogg's.png", searchTerms: ['kelloggs', 'corn flakes', 'cereal', 'muesli'], destinationHref: '/brands/kelloggs' },

  // L (4)
  { name: 'Lenskart', letter: 'L', file: 'Lenskart.png', searchTerms: ['lenskart', 'glasses', 'eyewear', 'sunglasses'], destinationHref: '/brands/lenskart' },
  { name: 'Lifebuoy', letter: 'L', file: 'Lifebuoy.png', searchTerms: ['lifebuoy', 'soap', 'handwash', 'sanitizer'], destinationHref: '/brands/lifebuoy' },
  { name: 'Louis Philippe', letter: 'L', file: 'louis-philippe.png', searchTerms: ['louis philippe', 'formal shirts', 'suits'], destinationHref: '/brands/louis-philippe' },
  { name: 'Lufthansa', letter: 'L', file: 'Lufthansa.png', searchTerms: ['lufthansa', 'airline', 'flights', 'international'], destinationHref: '/brands/lufthansa' },

  // M (5)
  { name: 'Maggi', letter: 'M', file: 'Maggi.png', searchTerms: ['maggi', 'noodles', 'nestle', 'sauce', 'masala'], destinationHref: '/brands/maggi' },
  { name: 'Mamaearth', letter: 'M', file: 'mamaearth.png', searchTerms: ['mamaearth', 'skincare', 'shampoo', 'toxin free'], destinationHref: '/brands/mamaearth' },
  { name: "McDonald's", letter: 'M', file: 'mcdonalds.png', searchTerms: ['mcdonalds', 'burger', 'fries', 'mccafe'], destinationHref: '/brands/mcdonalds' },
  { name: 'Motorola', letter: 'M', file: 'Motorola.png', searchTerms: ['motorola', 'moto', 'smartphones', 'edge'], destinationHref: '/brands/motorola' },
  { name: 'Max', letter: 'M', file: 'max-fashion.png', searchTerms: ['max', 'clothing', 'fashion', 'kids'], destinationHref: '/brands/max' },

  // N (5)
  { name: 'Nestlé', letter: 'N', file: 'Nestle.png', searchTerms: ['nestle', 'kitkat', 'everyday', 'milkmaid', 'maggi'], destinationHref: '/brands/nestle' },
  { name: 'Nike', letter: 'N', file: 'Nike-Logo.png', searchTerms: ['nike', 'shoes', 'running', 'sportswear', 'jordan'], destinationHref: '/brands/nike' },
  { name: 'Nivea', letter: 'N', file: 'Nivea.png', searchTerms: ['nivea', 'body lotion', 'cream', 'deodorant'], destinationHref: '/brands/nivea' },
  { name: 'Nothing', letter: 'N', file: 'nothing.png', searchTerms: ['nothing', 'phone', 'ear', 'cmf'], destinationHref: '/brands/nothing' },
  { name: 'Nykaa', letter: 'N', file: 'nykaa.png', searchTerms: ['nykaa', 'makeup', 'beauty', 'cosmetics'], destinationHref: '/brands/nykaa' },

  // O (2)
  { name: 'Oppo', letter: 'O', file: 'Oppo.png', searchTerms: ['oppo', 'smartphones', 'reno', 'camera phone'], destinationHref: '/brands/oppo' },
  { name: 'Oral-B', letter: 'O', file: 'Oral-B.png', searchTerms: ['oral b', 'toothbrush', 'electric brush', 'toothpaste'], destinationHref: '/brands/oral-b' },

  // P (7)
  { name: 'Pepperfry', letter: 'P', file: 'Pepperfry.png', searchTerms: ['pepperfry', 'furniture', 'sofas', 'beds'], destinationHref: '/brands/pepperfry' },
  { name: 'Parle', letter: 'P', file: 'Parle.png', searchTerms: ['parle', 'parle g', 'hide and seek', 'biscuits'], destinationHref: '/brands/parle' },
  { name: 'Patanjali', letter: 'P', file: 'Patanjali.png', searchTerms: ['patanjali', 'ayurveda', 'dant kanti', 'ghee'], destinationHref: '/brands/patanjali' },
  { name: 'Pears', letter: 'P', file: 'pears.png', searchTerms: ['pears', 'soap', 'glycerin soap', 'bath'], destinationHref: '/brands/pears' },
  { name: 'Peter England', letter: 'P', file: 'Peter_England.png', searchTerms: ['peter england', 'shirts', 'trousers', 'formal'], destinationHref: '/brands/peter-england' },
  { name: 'Philips', letter: 'P', file: 'Phillips.png', searchTerms: ['philips', 'trimmers', 'airfryer', 'lighting'], destinationHref: '/brands/philips' },
  { name: 'Puma', letter: 'P', file: 'puma.png', searchTerms: ['puma', 'shoes', 'running', 'sportswear'], destinationHref: '/brands/puma' },

  // R (4)
  { name: 'Raymond', letter: 'R', file: 'Raymond.png', searchTerms: ['raymond', 'suits', 'fabric', 'tailoring'], destinationHref: '/brands/raymond' },
  { name: 'Realme', letter: 'R', file: 'Realme.png', searchTerms: ['realme', 'smartphones', 'narzo', 'earbuds'], destinationHref: '/brands/realme' },
  { name: 'Redmi', letter: 'R', file: 'Redmi.png', searchTerms: ['redmi', 'xiaomi', 'smartphones', 'note series'], destinationHref: '/brands/redmi' },
  { name: 'Reebok', letter: 'R', file: 'Reebok.png', searchTerms: ['reebok', 'shoes', 'gym', 'sneakers'], destinationHref: '/brands/reebok' },

  // S (6)
  { name: 'Samsung', letter: 'S', file: 'Samsung.png', searchTerms: ['samsung', 'galaxy', 'tv', 'smartphones', 'refrigerator'], destinationHref: '/brands/samsung' },
  { name: 'Skechers', letter: 'S', file: 'SKECHERS.png', searchTerms: ['skechers', 'gowalk', 'shoes', 'comfortable sneakers'], destinationHref: '/brands/skechers' },
  { name: 'Sony', letter: 'S', file: 'Sony.png', searchTerms: ['sony', 'playstation', 'bravia tv', 'headphones'], destinationHref: '/brands/sony' },
  { name: 'Sugar Cosmetics', letter: 'S', file: 'SUGAR-Cosmetics.png', searchTerms: ['sugar', 'lipstick', 'cosmetics', 'makeup'], destinationHref: '/brands/sugar-cosmetics' },
  { name: 'Sunfeast', letter: 'S', file: 'sunfeast.png', searchTerms: ['sunfeast', 'dark fantasy', 'biscuits', 'cookies'], destinationHref: '/brands/sunfeast' },
  { name: 'Surf Excel', letter: 'S', file: 'surf-excel.png', searchTerms: ['surf excel', 'detergent', 'matic', 'washing powder'], destinationHref: '/brands/surf-excel' },

  // T (4)
  { name: 'Tanishq', letter: 'T', file: 'Tanishq.png', searchTerms: ['tanishq', 'gold', 'diamond', 'jewellery'], destinationHref: '/brands/tanishq' },
  { name: 'Tata Salt', letter: 'T', file: 'tata_salt.png', searchTerms: ['tata salt', 'iodized salt', 'groceries'], destinationHref: '/brands/tata-salt' },
  { name: 'Titan', letter: 'T', file: 'titan.png', searchTerms: ['titan', 'watches', 'edge', 'raga'], destinationHref: '/brands/titan' },
  { name: 'Tommy Hilfiger', letter: 'T', file: 'tommy_hilfiger.png', searchTerms: ['tommy hilfiger', 'polos', 'clothing', 'bags'], destinationHref: '/brands/tommy-hilfiger' },

  // U (2)
  { name: 'Urban Ladder', letter: 'U', file: 'urban-ladder.png', searchTerms: ['urban ladder', 'furniture', 'tables', 'beds'], destinationHref: '/brands/urban-ladder' },
  { name: 'U.S. Polo Assn', letter: 'U', file: 'US-Polo-Assn.png', searchTerms: ['us polo', 'tshirts', 'casual wear', 'apparel'], destinationHref: '/brands/us-polo' },

  // V (2)
  { name: 'Vim', letter: 'V', file: 'vim.png', searchTerms: ['vim', 'dishwash', 'bar', 'gel', 'cleaning'], destinationHref: '/brands/vim' },
  { name: 'Vivo', letter: 'V', file: 'vivo.png', searchTerms: ['vivo', 'smartphones', 'v series', 'camera phone'], destinationHref: '/brands/vivo' },

  // W (4)
  { name: 'Wheel', letter: 'W', file: 'wheel.png', searchTerms: ['wheel', 'active wheel', 'detergent powder'], destinationHref: '/brands/wheel' },
  { name: 'Whirlpool', letter: 'W', file: 'whirlpool.png', searchTerms: ['whirlpool', 'refrigerator', 'washing machine', 'ac'], destinationHref: '/brands/whirlpool' },
  { name: 'Woodland', letter: 'W', file: 'woodland.png', searchTerms: ['woodland', 'boots', 'leather shoes', 'jackets'], destinationHref: '/brands/woodland' },
  { name: 'Wrangler', letter: 'W', file: 'Wrangler-logo.png', searchTerms: ['wrangler', 'jeans', 'denim', 'jackets'], destinationHref: '/brands/wrangler' },

  // X (1)
  { name: 'Xiaomi', letter: 'X', file: 'Xiaomi.png', searchTerms: ['xiaomi', 'mi', 'redmi', 'smart tv', 'mobiles'], destinationHref: '/brands/xiaomi' },

  // Z (3)
  { name: 'Zara', letter: 'Z', file: 'zara.png', searchTerms: ['zara', 'fashion', 'clothing', 'dresses', 'luxury'], destinationHref: '/brands/zara' },
  { name: 'Zomato', letter: 'Z', file: 'Zomato.png', searchTerms: ['zomato', 'food delivery', 'dining', 'gold'], destinationHref: '/brands/zomato' },
  { name: 'Zudio', letter: 'Z', file: 'Zudio.png', searchTerms: ['zudio', 'tata fashion', 'budget clothing', 'shoes'], destinationHref: '/brands/zudio' },
]

export const BRANDS_DIRECTORY_DATA: DirectoryBrand[] = RAW_BRANDS.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `brand-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    logo: getBrandLogo(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: item.searchTerms,
    destinationHref: item.destinationHref,
  }
})
