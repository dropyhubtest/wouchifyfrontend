/**
 * Subcategories Data
 * Exact Subcategories across 18 Letter Groups + 6 Dedicated Trending Categories
 * Source of Truth: Sub Catagories.png (1920x9956px Figma Export)
 */

export interface SubcategoryItem {
  id: string
  name: string
  slug: string
  letter: string
  image: string
  categoryId?: string
  active: boolean
  sortOrder: number
  searchTerms?: string[]
}

export interface TrendingCategoryItem {
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

function getDirectoryImage(filename: string): string {
  const target = `../assets/categories/directory/${filename}`
  if (directoryImages[target]) {
    return directoryImages[target].default
  }
  // Try case-insensitive lookup
  const cleanTarget = filename.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const [path, mod] of Object.entries(directoryImages)) {
    const fn = path.split('/').pop() || ''
    const cleanFn = fn.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)) {
      return mod.default
    }
  }
  return ''
}

// 6 Dedicated Trending Categories
export const TRENDING_CATEGORIES: TrendingCategoryItem[] = [
  {
    id: 'trending-flights',
    name: 'Flights',
    slug: 'flights',
    image: getDirectoryImage('flight.png'),
    href: '/categories/subcategories/flights',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'trending-electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: getDirectoryImage('electronics.png'),
    href: '/categories/subcategories/electronics',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'trending-fashion',
    name: 'Fashion',
    slug: 'fashion',
    image: getDirectoryImage('fashion.png'),
    href: '/categories/subcategories/fashion',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'trending-beauty',
    name: 'Beauty',
    slug: 'beauty',
    image: getDirectoryImage('beauty.png'),
    href: '/categories/subcategories/beauty',
    active: true,
    sortOrder: 4,
  },
  {
    id: 'trending-mobiles',
    name: 'Mobiles',
    slug: 'mobiles',
    image: getDirectoryImage('mobile.png'),
    href: '/categories/subcategories/mobiles',
    active: true,
    sortOrder: 5,
  },
  {
    id: 'trending-watches',
    name: 'Watches',
    slug: 'watches',
    image: getDirectoryImage('watches.png'),
    href: '/categories/subcategories/watches',
    active: true,
    sortOrder: 6,
  },
]

const RAW_SUBCATEGORIES: Array<{ name: string; letter: string; file: string }> = [
  // Section A (7)
  { name: 'Accessories', letter: 'A', file: 'accessories.png' },
  { name: 'Adult 18+', letter: 'A', file: 'adult_18+.png' },
  { name: 'Automobiles', letter: 'A', file: 'automobile.png' },
  { name: 'Air Conditioners', letter: 'A', file: 'air_conditioners.png' },
  { name: 'Anniversary Gifts', letter: 'A', file: 'anniversary_gifts.png' },
  { name: 'Art & Craft Supplies', letter: 'A', file: 'art&crafts.png' },
  { name: 'Active Wear', letter: 'A', file: 'active_wear.png' },

  // Section B (12)
  { name: 'Beauty', letter: 'B', file: 'beauty.png' },
  { name: 'Books & Media', letter: 'B', file: 'books&media.png' },
  { name: 'Bean Bags', letter: 'B', file: 'beanbags.png' },
  { name: 'Baby Toys', letter: 'B', file: 'babytoys.png' },
  { name: 'Boys Footwear', letter: 'B', file: 'boys_footwear.png' },
  { name: 'Baby Diapers & Wipes', letter: 'B', file: 'baby_diapers&wipes.png' },
  { name: 'Bike Accessories', letter: 'B', file: 'bike_acessories.png' },
  { name: 'Books', letter: 'B', file: 'books.png' },
  { name: 'Backpacks', letter: 'B', file: 'backpacks.png' },
  { name: 'Bags', letter: 'B', file: 'bags.png' },
  { name: 'Belts', letter: 'B', file: 'belts.png' },
  { name: 'Beauty Services', letter: 'B', file: 'beauty_services.png' },

  // Section C (12)
  { name: 'Cameras', letter: 'C', file: 'cameras.png' },
  { name: 'Clothing', letter: 'C', file: 'clothing.png' },
  { name: 'Camera Accessories', letter: 'C', file: 'camera_accessories.png' },
  { name: 'Camera lens', letter: 'C', file: 'camera_lens.png' },
  { name: 'Computers', letter: 'C', file: 'computers.png' },
  { name: 'Computer Accessories', letter: 'C', file: 'computer_accessories.png' },
  { name: 'Cake', letter: 'C', file: 'cake.png' },
  { name: 'Chocolate', letter: 'C', file: 'chocolate.png' },
  { name: 'Chocolate Cakes', letter: 'C', file: 'chocolate_cakes.png' },
  { name: 'Contact Lens', letter: 'C', file: 'contact_lens.png' },
  { name: 'Cycles', letter: 'C', file: 'cycles.png' },
  { name: 'Credit Cards', letter: 'C', file: 'credit_card.png' },

  // Section D (3)
  { name: 'Drone Drones', letter: 'D', file: 'camera_accessories.png' },
  { name: 'Dishwashers', letter: 'D', file: 'washing_machine.png' },
  { name: 'Dry Fruits', letter: 'D', file: 'dry_fruits.png' },

  // Section E (3)
  { name: 'Electronics', letter: 'E', file: 'electronics.png' },
  { name: 'Electric Vehicles', letter: 'E', file: 'automobile.png' },
  { name: 'Eyewear', letter: 'E', file: 'eyewear.png' },

  // Section F (5)
  { name: 'Flights', letter: 'F', file: 'flight.png' },
  { name: 'Fashion', letter: 'F', file: 'fashion.png' },
  { name: 'Food', letter: 'F', file: 'food.png' },
  { name: 'Footwear', letter: 'F', file: 'footwear.png' },
  { name: 'Furniture & Home Decor', letter: 'F', file: 'home_kitchen.png' },

  // Section G (3)
  { name: 'Gifts & Flowers', letter: 'G', file: 'gifts_flowers.png' },
  { name: 'Groceries', letter: 'G', file: 'groceries.png' },
  { name: 'Gift Cards', letter: 'G', file: 'giftcards.png' },

  // Section H (8)
  { name: 'Health, Sports & Fitness', letter: 'H', file: 'health&sports_fitness.png' },
  { name: 'Home Appliances', letter: 'H', file: 'home_appliances.png' },
  { name: 'Headphones', letter: 'H', file: 'headphones.png' },
  { name: 'Home & Kitchen', letter: 'H', file: 'home_kitchen.png' },
  { name: 'Home Decor', letter: 'H', file: 'home_kitchen.png' },
  { name: 'Hair Dryers', letter: 'H', file: 'hairdryers.png' },
  { name: 'Handbags', letter: 'H', file: 'handbags.png' },
  { name: 'Home Cleaning Services', letter: 'H', file: 'home_cleaning_services.png' },

  // Section I (1)
  { name: 'International Flights', letter: 'I', file: 'international_flights.png' },

  // Section J (1)
  { name: 'Jewellery', letter: 'J', file: 'jewelery.png' },

  // Section K (3)
  { name: 'Kids Toys', letter: 'K', file: 'babytoys.png' },
  { name: 'Keyboard & Mouse', letter: 'K', file: 'keyboard_mouse.png' },
  { name: 'Kitchen Appliances', letter: 'K', file: 'kitchen_appliances.png' },

  // Section L (6)
  { name: 'Laptop Accessories', letter: 'L', file: 'laptop_acessories.png' },
  { name: 'Laptop Chargers', letter: 'L', file: 'laptop_batteries.png' },
  { name: 'Laptops', letter: 'L', file: 'laptops.png' },
  { name: 'Luggage & Travel', letter: 'L', file: 'luggagae_bags.png' },
  { name: 'Luggage Bags', letter: 'L', file: 'luggagae_bags.png' },
  { name: 'Lipsticks', letter: 'L', file: 'beauty.png' },

  // Section M (16)
  { name: 'Mobiles', letter: 'M', file: 'mobile.png' },
  { name: 'Mobile Accessories', letter: 'M', file: 'mobile_accessories.png' },
  { name: "Men's Winter Wear", letter: 'M', file: 'mens_lifestyle.png' },
  { name: "Men's Sweatshirts", letter: 'M', file: 'mens_tshirt.png' },
  { name: "Men's Innerwear", letter: 'M', file: 'mens_underwear.png' },
  { name: "Men's Grooming", letter: 'M', file: 'trimmers.png' },
  { name: "Men's Watches", letter: 'M', file: 'mens_watches.png' },
  { name: "Men's Footwear", letter: 'M', file: 'mens_shoes.png' },
  { name: "Men's Sports Shoes", letter: 'M', file: 'mens_shoes.png' },
  { name: "Men's Sandals", letter: 'M', file: 'mens_sandals.png' },
  { name: 'Musical Instruments', letter: 'M', file: 'music_instruments.png' },
  { name: 'Meals & Combos', letter: 'M', file: 'food.png' },
  { name: "Men's Casual Shoes", letter: 'M', file: 'mens_flipflops.png' },
  { name: "Men's Smart Watches", letter: 'M', file: 'smartwatch.png' },
  { name: 'Meat & Dairy', letter: 'M', file: 'meat&dairy.png' },
  { name: 'Mattresses', letter: 'M', file: 'mattress.png' },

  // Section P (6)
  { name: 'Pet Food', letter: 'P', file: 'petfood.png' },
  { name: 'Printers & Scanners', letter: 'P', file: 'printers_scanners.png' },
  { name: 'Power Tools', letter: 'P', file: 'power_tools.png' },
  { name: 'Pet Care', letter: 'P', file: 'petfood.png' },
  { name: 'Protein Powders & Gym', letter: 'P', file: 'protein_supplements.png' },
  { name: 'Perfumes', letter: 'P', file: 'perfumes.png' },

  // Section R (1)
  { name: 'Refrigerators', letter: 'R', file: 'refrigerator.png' },

  // Section S (9)
  { name: 'Speakers', letter: 'S', file: 'speakers.png' },
  { name: 'Storage & Organizers', letter: 'S', file: 'shoe_racks.png' },
  { name: 'Stationery', letter: 'S', file: 'art&crafts.png' },
  { name: 'Study Tables', letter: 'S', file: 'study_tables.png' },
  { name: 'Sweets', letter: 'S', file: 'sweets.png' },
  { name: 'Snacks', letter: 'S', file: 'snacks.png' },
  { name: 'Safety Equipment', letter: 'S', file: 'safety_products.png' },
  { name: 'Smart Fitness', letter: 'S', file: 'health&sports_fitness.png' },
  { name: 'Smart Wearables', letter: 'S', file: 'smartwatch.png' },

  // Section T (5)
  { name: 'Tablets', letter: 'T', file: 'tablets.png' },
  { name: 'Televisions', letter: 'T', file: 'television.png' },
  { name: 'Toys & Games', letter: 'T', file: 'babytoys.png' },
  { name: 'Tea & Coffee', letter: 'T', file: 'teacups.png' },
  { name: 'Trimmers', letter: 'T', file: 'trimmers.png' },

  // Section W (8)
  { name: "Women's Ethnic Wear", letter: 'W', file: 'women_sarees.png' },
  { name: "Women's Dresses", letter: 'W', file: 'womens_kurtis.png' },
  { name: "Women's Footwear", letter: 'W', file: 'women_footwear.png' },
  { name: "Women's Winter Wear", letter: 'W', file: 'women_lifestyle.png' },
  { name: "Women's Handbags", letter: 'W', file: 'handbags.png' },
  { name: "Women's Western Wear", letter: 'W', file: 'womens_lehangas.png' },
  { name: "Women's Smart Watches", letter: 'W', file: 'smartwatch.png' },
  { name: 'Watches', letter: 'W', file: 'watches.png' },
]

export const SUBCATEGORIES_DATA: SubcategoryItem[] = RAW_SUBCATEGORIES.map((item, idx) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id: `subcat-${slug}`,
    name: item.name,
    slug: slug,
    letter: item.letter,
    image: getDirectoryImage(item.file),
    active: true,
    sortOrder: idx + 1,
    searchTerms: [item.name.toLowerCase(), item.letter.toLowerCase()],
  }
})
