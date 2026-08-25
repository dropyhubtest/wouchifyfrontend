/**
 * Category Directory Data
 * Maps all authentic Figma category artwork assets to A-Z alphabetical directory
 */

// Dynamically load all authentic Figma category assets from src/assets/categories/directory/
const directoryImages = import.meta.glob<{ default: string }>(
  '../assets/categories/directory/*.png',
  { eager: true }
)

export interface CategoryDirectoryItem {
  id: string
  name: string
  slug: string
  image: string
  letter: string
}

// Convert raw filename to clean human-friendly title
function formatCategoryName(filename: string): string {
  let name = filename.replace(/\.png$/i, '')
  name = name.replace(/\.svg\s*\d*/gi, '')
  name = name.replace(/\blogo\b/gi, '')
  name = name.replace(/\s+\d+$/g, '') // remove trailing numbers like " 1" or " 4"
  name = name.replace(/[-_]/g, ' ')
  name = name.replace(/&/g, ' & ')
  name = name.replace(/\s+/g, ' ').trim()

  // Clean specific names
  if (name.toLowerCase() === 'crocs') return 'Crocs'
  if (name.toLowerCase() === 'bags') return 'Bags'
  if (name.toLowerCase() === 'laptops') return 'Laptops'
  if (name.toLowerCase() === 'mens lifestyle') return "Men's Lifestyle"
  if (name.toLowerCase() === 'mens flipflops') return "Men's Flip Flops"
  if (name.toLowerCase() === 'vivo') return 'Vivo'
  if (name.toLowerCase() === 'dominos') return "Domino's"

  // Capitalize words
  return name
    .split(' ')
    .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ')
}

// Build comprehensive directory catalog from assets
export function getAllDirectoryItems(): CategoryDirectoryItem[] {
  const items: CategoryDirectoryItem[] = []
  const seenSlugs = new Set<string>()

  for (const [path, mod] of Object.entries(directoryImages)) {
    const filename = path.split('/').pop() || ''
    if (!filename) continue

    // Skip old or duplicate Dominos variants if any
    if (/dominos-pizza-logo-2012/i.test(filename) || /dominos-india/i.test(filename)) {
      continue
    }

    const name = formatCategoryName(filename)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    if (seenSlugs.has(slug)) {
      continue
    }
    seenSlugs.add(slug)

    // Determine initial letter
    let firstChar = name.charAt(0).toUpperCase()
    if (!/[A-Z]/.test(firstChar)) {
      firstChar = '0-9'
    }

    items.push({
      id: `cat-${slug}`,
      name: name,
      slug: slug,
      image: mod.default,
      letter: firstChar,
    })
  }

  // Sort alphabetically by name
  items.sort((a, b) => a.name.localeCompare(b.name))

  return items
}

export const CATEGORY_DIRECTORY_ITEMS: CategoryDirectoryItem[] = getAllDirectoryItems()
