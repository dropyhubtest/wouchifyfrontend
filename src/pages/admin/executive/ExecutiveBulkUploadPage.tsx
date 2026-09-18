import React, { useState, useRef, useMemo } from 'react'
import * as XLSX from 'xlsx'
import { ExecutiveLayout } from './ExecutiveLayout'
import { adminApi } from '../../../services/adminApi'
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Zap,
  Flame,
  Tag,
  Store,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react'
import './ExecutiveBulkUploadPage.css'

export type BulkModule = 'deals' | 'loot-deals' | 'coupons' | 'stores'

interface ParsedRow {
  _rowId: number
  _isValid: boolean
  _errors: string[]
  _isScheduled: boolean
  _publishDateStr: string
  [key: string]: any
}

export const ExecutiveBulkUploadPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<BulkModule>('deals')
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'invalid'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [importProgress, setImportProgress] = useState<{ total: number; done: number; success: number; failed: number } | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Module configuration with matched icons and theme accents
  const moduleConfig = {
    deals: {
      name: 'Promotional Deals',
      badge: '🔥 Deals',
      icon: <Flame size={22} color="#dc2626" />,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fee2e2',
      accentGlow: 'rgba(220, 38, 38, 0.18)',
      description: 'Bulk import e-commerce deals, discounts, MRPs, and affiliate links.',
      viewLink: '/executive/deals'
    },
    'loot-deals': {
      name: 'Loot & Flash Drops',
      badge: '⚡ Loot Drops',
      icon: <Zap size={22} color="#d97706" />,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fef3c7',
      accentGlow: 'rgba(217, 119, 6, 0.18)',
      description: 'Bulk import high-discount glitch offers, steals, and flash loot deals.',
      viewLink: '/executive/loot-deals'
    },
    coupons: {
      name: 'Verified Coupons',
      badge: '🎟️ Coupons',
      icon: <Tag size={22} color="#7c3aed" />,
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ede9fe',
      accentGlow: 'rgba(124, 58, 237, 0.18)',
      description: 'Bulk import verified discount coupon promo codes and voucher rules.',
      viewLink: '/executive/coupons'
    },
    stores: {
      name: 'Partner Stores',
      badge: '🏬 Stores',
      icon: <Store size={22} color="#059669" />,
      color: '#059669',
      bg: '#ecfdf5',
      border: '#d1fae5',
      accentGlow: 'rgba(5, 150, 105, 0.18)',
      description: 'Bulk import affiliate partner store directories, logos, and reward cashback.',
      viewLink: '/executive/stores'
    }
  }

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Sample data definitions with Scheduled Publishing
  // Sample data definitions with full form fields matching the manual creation forms
  const getSampleData = (mod: BulkModule) => {
    const futureDate = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ')
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    if (mod === 'deals') {
      return [
        {
          title: 'Sony WH-1000XM5 Wireless ANC Headphones',
          store: 'Amazon',
          brand: 'Sony',
          category: 'Electronics',
          subCategory: 'Audio & Headphones',
          asinOrSku: 'B09XS7JWHH',
          type: 'deal',
          price: '₹24,990',
          originalPrice: '₹34,990',
          discount: '29% OFF',
          effectivePrice: '₹22,490',
          bankOffer: '10% Instant Discount on HDFC Cards',
          cashback: '+ 5% Wouchify Cashback',
          code: 'SONYANC',
          link: 'https://amazon.in/dp/B09XS7JWHH',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e, https://images.unsplash.com/photo-1484704849700-f032a568e944',
          badge: 'Trending',
          stockStatus: 'In Stock',
          rating: '4.8 ★',
          deliveryInfo: 'Free Express Delivery',
          warranty: '1 Year Manufacturer Warranty',
          isBestSelling: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          priority: 'High',
          sectionPlacement: 'best_selling',
          highlights: '• 30-Hour Battery Life\\n• Industry-Leading Noise Cancellation\\n• Multi-Device Pairing',
          variantNote: 'Valid on Silver & Black variants only',
          howToClaim: '1. Click Grab Deal.\\n2. Apply ₹1,500 coupon on product page.\\n3. Complete payment with HDFC Card.',
          description: 'Industry-leading noise cancellation with 30-hour battery life and touch controls.',
          terms: 'Offer valid until stocks last. Standard return policy applies.',
          publishAt: '',
          expiresAt: expiryDate
        },
        {
          title: 'Nike Air Max 270 React Men Running Shoes',
          store: 'Myntra',
          brand: 'Nike',
          category: 'Footwear',
          subCategory: 'Running Shoes',
          asinOrSku: 'NK-AM270-01',
          type: 'flash',
          price: '₹7,995',
          originalPrice: '₹13,995',
          discount: '43% OFF',
          effectivePrice: '₹7,495',
          bankOffer: 'Flat ₹500 off on Axis Bank Credit Cards',
          cashback: '+ 6% Wouchify Cashback',
          code: 'NIKEFEST',
          link: 'https://myntra.com/shoes/nike-air-max-270',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff, https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
          badge: 'Editor Pick',
          stockStatus: 'Lightning Deal (85% Claimed)',
          rating: '4.7 ★',
          deliveryInfo: '2-Day Fast Shipping',
          warranty: '6 Months Brand Warranty',
          isBestSelling: 'false',
          isFeatured: 'true',
          isVerified: 'true',
          priority: 'Critical',
          sectionPlacement: 'favourite',
          highlights: '• Max Air 270 Unit\\n• Lightweight breathable knit mesh\\n• Foam midsole for all-day comfort',
          variantNote: 'Valid on UK sizes 8, 9, 10',
          howToClaim: '1. Click Grab Deal.\\n2. Apply code NIKEFEST at checkout.',
          description: 'Nike lightweight mesh foam cushioning for unmatched everyday comfort.',
          terms: 'Only 1 unit per customer at this promotional price.',
          publishAt: futureDate,
          expiresAt: expiryDate
        },
        {
          title: 'OnePlus 13 5G (16GB RAM, 512GB Storage) - Midnight Black',
          store: 'Amazon',
          brand: 'OnePlus',
          category: 'Mobiles',
          subCategory: 'Flagship Smartphones',
          asinOrSku: 'B0CQJ8XYZ1',
          type: 'daily',
          price: '₹64,999',
          originalPrice: '₹69,999',
          discount: '₹5,000 OFF',
          effectivePrice: '₹61,999',
          bankOffer: '₹3,000 Instant Cashback with ICICI Cards',
          cashback: '+ 2% Wouchify Cashback',
          code: '',
          link: 'https://amazon.in/dp/oneplus13',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
          images: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
          badge: 'Hot Deal',
          stockStatus: 'In Stock',
          rating: '4.9 ★',
          deliveryInfo: 'Free Next-Day Delivery',
          warranty: '1 Year Brand Warranty + 6 Months Screen Protection',
          isBestSelling: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          priority: 'High',
          sectionPlacement: 'both',
          highlights: '• Snapdragon 8 Elite SoC\\n• 50MP Hasselblad Triple Camera\\n• 100W SuperVOOC Fast Charging',
          variantNote: '16GB RAM + 512GB Storage, Midnight Black',
          howToClaim: '1. Click Grab Deal.\\n2. Choose ICICI Credit Card at payment step.',
          description: 'Snapdragon 8 Elite flagship with Hasselblad camera 50MP triple system.',
          terms: 'Standard Amazon terms apply.',
          publishAt: '',
          expiresAt: expiryDate
        }
      ]
    }

    if (mod === 'loot-deals') {
      return [
        {
          title: 'boAt Rockerz 450 Wireless Headphone Glitch Drop',
          store: 'Flipkart',
          brand: 'boAt',
          category: 'Electronics',
          lootType: 'steal',
          currentPrice: '₹149',
          originalPrice: '₹2,990',
          discount: '95% OFF',
          effectivePrice: '₹139',
          cashback: '+ 5% Wouchify Cashback',
          code: 'FLASHDROP',
          link: 'https://flipkart.com/boat-rockerz-450',
          asinOrSku: 'BOAT-RCK450',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e, https://images.unsplash.com/photo-1484704849700-f032a568e944',
          badge: '⚡ HOT DROP',
          stockClaimedPercent: 88,
          quantityAlert: 'Limited Flash Stock (High Speed Claim)',
          proofNote: 'Verified price drop screenshot checked on live crawler',
          trickSteps: '1. Click Grab Loot.\\n2. Apply coupon FLASHDROP.\\n3. Complete payment with UPI.',
          priority: 'Critical',
          rating: '4.8 ★',
          deliveryInfo: 'Fast Delivery',
          telegramAlert: 'true',
          pushNotification: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          isBestSelling: 'true',
          sectionPlacement: 'both',
          terms: 'Price glitch offer. Orders may be cancelled by merchant if stocks deplete.',
          publishAt: '',
          expiresAt: expiryDate
        },
        {
          title: 'Puma Men Graphic Casual T-Shirt Loot Under 99',
          store: 'Myntra',
          brand: 'Puma',
          category: 'Fashion',
          lootType: 'under99',
          currentPrice: '₹99',
          originalPrice: '₹1,299',
          discount: '92% OFF',
          effectivePrice: '₹95',
          cashback: '+ 4% Wouchify Cashback',
          code: '',
          link: 'https://myntra.com/puma-tshirt-loot',
          asinOrSku: 'PUMA-TSHIRT-01',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
          images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
          badge: '💣 UNDER ₹99',
          stockClaimedPercent: 92,
          quantityAlert: 'Price Glitch Alive',
          proofNote: 'Tested and verified working by Content Team',
          trickSteps: '1. Add size L or XL.\\n2. Cart value auto-discounts at final step.',
          priority: 'Critical',
          rating: '4.6 ★',
          deliveryInfo: 'Standard Delivery',
          telegramAlert: 'true',
          pushNotification: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          isBestSelling: 'false',
          sectionPlacement: 'favourite',
          terms: 'Limited to 2 items per account.',
          publishAt: futureDate,
          expiresAt: expiryDate
        }
      ]
    }

    if (mod === 'coupons') {
      return [
        {
          code: 'SWIGGYIT150',
          title: 'Flat ₹150 OFF on Gourmet Dining Orders Above ₹499',
          description: 'Valid across all participating top-rated restaurants on Swiggy Gourmet.',
          store: 'Swiggy',
          category: 'Food',
          couponType: 'flat',
          discount: 'Flat ₹150 OFF',
          discountValue: 150,
          minOrder: '₹499',
          maxDiscount: '₹150',
          affiliateLink: 'https://swiggy.com/?tag=wouchify',
          startDate: '2026-09-18',
          status: 'active',
          isExclusive: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          telegramAlert: 'true',
          totalUses: 5000,
          publishAt: '',
          expiresAt: expiryDate
        },
        {
          code: 'MYNTRA500',
          title: 'Extra ₹500 OFF on Fashion, Footwear & Accessories',
          description: 'Exclusive Wouchify coupon code valid on premium lifestyle collections.',
          store: 'Myntra',
          category: 'Fashion',
          couponType: 'flat',
          discount: '₹500 OFF',
          discountValue: 500,
          minOrder: '₹1,999',
          maxDiscount: '₹500',
          affiliateLink: 'https://myntra.com/?tag=wouchify',
          startDate: '2026-09-18',
          status: 'active',
          isExclusive: 'true',
          isFeatured: 'true',
          isVerified: 'true',
          telegramAlert: 'false',
          totalUses: 10000,
          publishAt: futureDate,
          expiresAt: expiryDate
        }
      ]
    }

    // stores
    return [
      {
        name: 'Samsung Official Store',
        slug: 'samsung',
        category: 'Electronics',
        reward: 'Upto 7.5% Cashback',
        description: 'Flagship Galaxy smartphones, OLED smart TVs, and premium home appliances.',
        affiliateLink: 'https://samsung.com/in/?tag=wouchify',
        logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
        cardBg: '#E8F5FF',
        badgeBg: '#B3DCFA',
        status: 'active',
        isFeatured: 'true',
        publishAt: '',
        expiresAt: expiryDate
      },
      {
        name: 'Ajio Luxury & Trends',
        slug: 'ajio',
        category: 'Fashion',
        reward: 'Flat 12% Rewards',
        description: 'Curated premium international apparel, streetwear, sneakers, and accessories.',
        affiliateLink: 'https://ajio.com/?tag=wouchify',
        logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        cardBg: '#FFE6D3',
        badgeBg: '#FFB67C',
        status: 'featured',
        isFeatured: 'true',
        publishAt: futureDate,
        expiresAt: expiryDate
      }
    ]
  }

  // Template Download
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const data = getSampleData(activeModule)
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${activeModule}_template`)

    if (format === 'xlsx') {
      XLSX.writeFile(wb, `wouchify_${activeModule}_bulk_template.xlsx`)
    } else {
      XLSX.writeFile(wb, `wouchify_${activeModule}_bulk_template.csv`, { bookType: 'csv' })
    }
  }

  // Flexible date parser
  const parseFlexibleDate = (raw: any): { iso: string | null; isFuture: boolean } => {
    if (!raw) return { iso: null, isFuture: false }
    
    if (typeof raw === 'number') {
      const parsedEpoch = (raw - (25567 + 2)) * 86400 * 1000
      const d = new Date(parsedEpoch)
      if (!isNaN(d.getTime())) {
        return { iso: d.toISOString(), isFuture: d.getTime() > Date.now() }
      }
    }

    const str = String(raw).trim()
    if (!str) return { iso: null, isFuture: false }

    const d = new Date(str)
    if (!isNaN(d.getTime())) {
      return { iso: d.toISOString(), isFuture: d.getTime() > Date.now() }
    }

    const parts = str.split(/[-/ :T]/)
    if (parts.length >= 3) {
      const year = parseInt(parts[0].length === 4 ? parts[0] : parts[2])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[0].length === 4 ? parts[2] : parts[0])
      const hour = parts[3] ? parseInt(parts[3]) : 0
      const min = parts[4] ? parseInt(parts[4]) : 0
      const customDate = new Date(Date.UTC(year, month, day, hour, min))
      if (!isNaN(customDate.getTime())) {
        return { iso: customDate.toISOString(), isFuture: customDate.getTime() > Date.now() }
      }
    }

    return { iso: null, isFuture: false }
  }

  // Row validator
  const validateRow = (row: any, mod: BulkModule): { isValid: boolean; errors: string[]; isScheduled: boolean; publishDateStr: string } => {
    const errors: string[] = []
    
    const { iso: publishIso, isFuture } = parseFlexibleDate(row.publishAt || row.publish_at || row.scheduledTime || row.publish_time)

    if (mod === 'deals') {
      if (!row.title && !row.name) errors.push('Title / Product Name is required')
      if (!row.price && !row.currentPrice) errors.push('Offer Price is required')
      if (!row.store && !row.storeName) errors.push('Store name is required')
    } else if (mod === 'loot-deals') {
      if (!row.title && !row.name) errors.push('Loot Title is required')
      if (!row.currentPrice && !row.price) errors.push('Current Loot Price is required')
      if (!row.store && !row.storeName) errors.push('Store name is required')
    } else if (mod === 'coupons') {
      if (!row.code) errors.push('Coupon Code is required')
      if (!row.discount && !row.title) errors.push('Discount or Title is required')
      if (!row.store) errors.push('Store name is required')
    } else if (mod === 'stores') {
      if (!row.name && !row.storeName) errors.push('Store Name is required')
    }

    return {
      isValid: errors.length === 0,
      errors,
      isScheduled: isFuture,
      publishDateStr: isFuture && publishIso ? new Date(publishIso).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Immediate'
    }
  }

  // Process File
  const handleFileProcess = async (file: File) => {
    setFileName(file.name)
    setImportSuccess(null)
    setImportError(null)
    setLoading(true)

    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array', cellDates: true })
      const firstSheet = wb.Sheets[wb.SheetNames[0]]
      const rawJson = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })

      if (!rawJson || rawJson.length === 0) {
        setImportError('The uploaded sheet contains no readable rows.')
        setParsedRows([])
        setLoading(false)
        return
      }

      const rows: ParsedRow[] = rawJson.map((row: any, idx: number) => {
        const val = validateRow(row, activeModule)
        return {
          _rowId: idx + 1,
          _isValid: val.isValid,
          _errors: val.errors,
          _isScheduled: val.isScheduled,
          _publishDateStr: val.publishDateStr,
          ...row
        }
      })

      setParsedRows(rows)
    } catch (err: any) {
      console.error('File parse error:', err)
      setImportError(`Failed to parse file: ${err?.message || 'Unsupported format'}`)
      setParsedRows([])
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0])
    }
  }

  // Filtered rows for preview table
  const filteredRows = useMemo(() => {
    return parsedRows.filter((r) => {
      if (statusFilter === 'valid' && !r._isValid) return false
      if (statusFilter === 'invalid' && r._isValid) return false
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchTitle = (r.title || r.name || r.code || '').toLowerCase().includes(query)
        const matchStore = (r.store || r.storeName || '').toLowerCase().includes(query)
        const matchCat = (r.category || '').toLowerCase().includes(query)
        return matchTitle || matchStore || matchCat
      }
      return true
    })
  }, [parsedRows, statusFilter, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    const total = parsedRows.length
    const valid = parsedRows.filter((r) => r._isValid).length
    const invalid = total - valid
    const scheduled = parsedRows.filter((r) => r._isScheduled).length
    return { total, valid, invalid, scheduled }
  }, [parsedRows])

  // Execute Bulk Upload
  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter((r) => r._isValid)
    if (validRows.length === 0) {
      setImportError('No valid rows available to import.')
      return
    }

    setLoading(true)
    setImportError(null)
    setImportSuccess(null)
    setImportProgress({ total: validRows.length, done: 0, success: 0, failed: 0 })

    const batchSize = 100
    let totalSuccess = 0
    let totalFailed = 0

    try {
      for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize).map((r) => {
          const { _rowId, _isValid, _errors, _isScheduled, _publishDateStr, ...cleanData } = r
          
          const { iso: publishIso } = parseFlexibleDate(cleanData.publishAt || cleanData.publish_at)
          const { iso: expiryIso } = parseFlexibleDate(cleanData.expiresAt || cleanData.expires_at || cleanData.expiry)

          if (activeModule === 'deals') {
            const rawImages = cleanData.images ? String(cleanData.images).split(',').map((s: string) => s.trim()).filter(Boolean) : []
            const primaryImg = cleanData.image || cleanData.productImage || ''
            const finalImages = rawImages.length > 0 ? (rawImages.includes(primaryImg) ? rawImages : [primaryImg, ...rawImages].filter(Boolean)) : (primaryImg ? [primaryImg] : [])

            const rawHighlights = cleanData.highlights ? (Array.isArray(cleanData.highlights) ? cleanData.highlights : String(cleanData.highlights).split(/\\n|\n/).map((s: string) => s.trim()).filter(Boolean)) : []

            return {
              name: cleanData.title || cleanData.name || 'Untitled Deal',
              title: cleanData.title || cleanData.name || 'Untitled Deal',
              store: cleanData.store || cleanData.storeName || 'Amazon',
              brand: cleanData.brand || '',
              category: cleanData.category || 'Electronics',
              subCategory: cleanData.subCategory || cleanData.sub_category || '',
              asinOrSku: cleanData.asinOrSku || cleanData.asin || cleanData.sku || '',
              type: cleanData.type || 'deal',
              price: cleanData.price ? (String(cleanData.price).startsWith('₹') ? String(cleanData.price) : `₹${cleanData.price}`) : '₹0',
              originalPrice: cleanData.originalPrice ? (String(cleanData.originalPrice).startsWith('₹') ? String(cleanData.originalPrice) : `₹${cleanData.originalPrice}`) : '',
              discount: cleanData.discount || cleanData.discountLabel || '',
              discountLabel: cleanData.discountLabel || cleanData.discount || '',
              effectivePrice: cleanData.effectivePrice ? (String(cleanData.effectivePrice).startsWith('₹') ? String(cleanData.effectivePrice) : `₹${cleanData.effectivePrice}`) : '',
              bankOffer: cleanData.bankOffer || '',
              cashback: cleanData.cashback || '',
              code: cleanData.code || '',
              ctaHref: cleanData.link || cleanData.ctaHref || '',
              ctaText: cleanData.ctaText || 'Grab Deal',
              productImage: primaryImg,
              image: primaryImg,
              images: finalImages,
              badge: cleanData.badge || cleanData.dealTag || 'Trending',
              dealTag: cleanData.dealTag || cleanData.badge || 'Trending',
              stockStatus: cleanData.stockStatus || 'In Stock',
              rating: cleanData.rating || '4.8',
              deliveryInfo: cleanData.deliveryInfo || 'Free Express Delivery',
              warranty: cleanData.warranty || '1 Year Brand Warranty',
              isBestSelling: String(cleanData.isBestSelling).toLowerCase() === 'true',
              isFeatured: String(cleanData.isFeatured).toLowerCase() === 'true',
              isVerified: cleanData.isVerified === undefined || String(cleanData.isVerified).toLowerCase() === 'true',
              priority: cleanData.priority || 'Normal',
              sectionPlacement: cleanData.sectionPlacement || (String(cleanData.isBestSelling).toLowerCase() === 'true' ? 'best_selling' : 'favourite'),
              highlights: rawHighlights,
              variantNote: cleanData.variantNote || '',
              howToClaim: cleanData.howToClaim || '',
              description: cleanData.description || 'Verified e-commerce deal.',
              terms: cleanData.terms || '',
              status: cleanData.status || 'active',
              publishAt: publishIso || new Date().toISOString(),
              expiresAt: expiryIso || null
            }
          }

          if (activeModule === 'loot-deals') {
            return {
              title: cleanData.title || cleanData.name || 'Loot Deal',
              storeName: cleanData.store || cleanData.storeName || 'Amazon',
              store: cleanData.store || cleanData.storeName || 'Amazon',
              brand: cleanData.brand || cleanData.store || 'Generic',
              category: cleanData.category || 'Electronics',
              lootType: cleanData.lootType || 'steal',
              dealType: cleanData.lootType === 'flash' ? 'flash' : 'exclusive',
              currentPrice: cleanData.currentPrice ? (String(cleanData.currentPrice).startsWith('₹') ? String(cleanData.currentPrice) : `₹${cleanData.currentPrice}`) : (cleanData.price ? (String(cleanData.price).startsWith('₹') ? String(cleanData.price) : `₹${cleanData.price}`) : '₹99'),
              price: cleanData.currentPrice ? (String(cleanData.currentPrice).startsWith('₹') ? String(cleanData.currentPrice) : `₹${cleanData.currentPrice}`) : (cleanData.price ? (String(cleanData.price).startsWith('₹') ? String(cleanData.price) : `₹${cleanData.price}`) : '₹99'),
              originalPrice: cleanData.originalPrice ? (String(cleanData.originalPrice).startsWith('₹') ? String(cleanData.originalPrice) : `₹${cleanData.originalPrice}`) : '₹999',
              discount: cleanData.discount || cleanData.discountLabel || '90% OFF',
              discountLabel: cleanData.discountLabel || cleanData.discount || '90% OFF',
              effectivePrice: cleanData.effectivePrice ? (String(cleanData.effectivePrice).startsWith('₹') ? String(cleanData.effectivePrice) : `₹${cleanData.effectivePrice}`) : '',
              cashback: cleanData.cashback || '+ 5% Wouchify Cashback',
              stockClaimedPercent: parseInt(cleanData.stockClaimedPercent) || 85,
              quantityAlert: cleanData.quantityAlert || 'Limited Flash Stock',
              proofNote: cleanData.proofNote || 'Verified via live automated checker',
              trickSteps: cleanData.trickSteps || '1. Click Grab Loot. 2. Apply code. 3. Checkout quickly.',
              code: cleanData.code || '',
              href: cleanData.link || cleanData.href || '/deals',
              link: cleanData.link || cleanData.href || '/deals',
              image: cleanData.image || cleanData.productImage || '',
              images: cleanData.image ? [cleanData.image] : [],
              badge: cleanData.badge || '⚡ HOT DROP',
              priority: cleanData.priority || 'High',
              rating: cleanData.rating || '4.8 ★',
              deliveryInfo: cleanData.deliveryInfo || 'Fast Delivery',
              telegramAlert: String(cleanData.telegramAlert).toLowerCase() === 'true',
              pushNotification: String(cleanData.pushNotification).toLowerCase() === 'true',
              isFeatured: String(cleanData.isFeatured).toLowerCase() === 'true',
              isVerified: cleanData.isVerified === undefined || String(cleanData.isVerified).toLowerCase() === 'true',
              isBestSelling: String(cleanData.isBestSelling).toLowerCase() === 'true',
              sectionPlacement: cleanData.sectionPlacement || (String(cleanData.isBestSelling).toLowerCase() === 'true' ? 'best_selling' : 'both'),
              terms: cleanData.terms || 'Valid until stocks last.',
              status: cleanData.status || 'active',
              publishAt: publishIso || new Date().toISOString(),
              expiresAt: expiryIso || null
            }
          }

          if (activeModule === 'coupons') {
            return {
              code: (cleanData.code || 'COUPON10').toUpperCase(),
              title: cleanData.title || 'Verified Coupon Offer',
              description: cleanData.description || 'Verified promo discount code.',
              store: cleanData.store || 'Amazon',
              category: cleanData.category || 'General',
              couponType: cleanData.couponType || 'flat',
              discount: cleanData.discount || '10% OFF',
              minOrder: cleanData.minOrder || 'Min Order ₹499',
              maxDiscount: cleanData.maxDiscount || 'Max ₹200',
              affiliateLink: cleanData.affiliateLink || cleanData.link || 'https://wouchify.com',
              isExclusive: String(cleanData.isExclusive).toLowerCase() === 'true',
              isFeatured: String(cleanData.isFeatured).toLowerCase() === 'true',
              isVerified: cleanData.isVerified === undefined || String(cleanData.isVerified).toLowerCase() === 'true',
              telegramAlert: String(cleanData.telegramAlert).toLowerCase() === 'true',
              usageLimit: parseInt(cleanData.totalUses || cleanData.usageLimit) || 5000,
              status: cleanData.status || 'active',
              publishAt: publishIso || new Date().toISOString(),
              expiry: expiryIso || null,
              expiresAt: expiryIso || null
            }
          }

          // stores
          return {
            name: cleanData.name || cleanData.storeName || 'Partner Store',
            slug: cleanData.slug || (cleanData.name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: cleanData.category || 'Fashion',
            reward: cleanData.reward || 'Upto 5% Rewards',
            description: cleanData.description || 'Partner store online deals and rewards.',
            affiliateLink: cleanData.affiliateLink || cleanData.link || 'https://wouchify.com',
            logoUrl: cleanData.logoUrl || cleanData.logo || '',
            cardBg: cleanData.cardBg || '#E8F5FF',
            badgeBg: cleanData.badgeBg || '#B3DCFA',
            status: cleanData.status || 'active',
            isFeatured: String(cleanData.isFeatured).toLowerCase() === 'true',
            publishAt: publishIso || new Date().toISOString(),
            expiresAt: expiryIso || null
          }
        })

        if (activeModule === 'deals') {
          const res = await adminApi.bulkImportDeals(batch)
          totalSuccess += res.insertedCount || batch.length
        } else if (activeModule === 'loot-deals') {
          const res = await adminApi.bulkImportLootDeals(batch)
          totalSuccess += res.insertedCount || batch.length
        } else if (activeModule === 'coupons') {
          const res = await adminApi.bulkImportCoupons(batch)
          totalSuccess += res.insertedCount || batch.length
        } else if (activeModule === 'stores') {
          const res = await adminApi.bulkImportStores(batch)
          totalSuccess += res.insertedCount || batch.length
        }

        setImportProgress({
          total: validRows.length,
          done: Math.min(i + batchSize, validRows.length),
          success: totalSuccess,
          failed: totalFailed
        })
      }

      setImportSuccess(`Successfully imported ${totalSuccess} ${moduleConfig[activeModule].name} into MongoDB Atlas!`)
      setParsedRows([])
      setFileName(null)
    } catch (err: any) {
      console.error('Bulk upload execution error:', err)
      setImportError(`Bulk upload error: ${err?.message || 'Server error during batch insertion'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ExecutiveLayout activeMenu="bulk-upload">
      <div className="executive-bulk-page">

        {/* ── Page Header ── */}
        <div className="bulk-page-header">
          <div>
            <div className="bulk-page-title-badge">High Capacity Ingestion Engine</div>
            <h2 className="bulk-page-title">Bulk Data Import & Scheduled Publishing</h2>
            <p className="bulk-page-subtitle">
              Import 200–500+ products, loot deals, coupons, or stores at once from Excel/CSV with time-scheduled release triggers.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              ⚡ MongoDB Atlas Batch Powered
            </span>
          </div>
        </div>

        {/* ── MODULE SELECTOR CARDS ── */}
        <div className="bulk-module-grid">
          {(['deals', 'loot-deals', 'coupons', 'stores'] as BulkModule[]).map((mod) => {
            const conf = moduleConfig[mod]
            const isSelected = activeModule === mod
            return (
              <div
                key={mod}
                className={`bulk-module-card mod-${mod} ${isSelected ? 'active' : ''}`}
                style={{
                  borderColor: isSelected ? conf.color : undefined,
                  background: isSelected ? `linear-gradient(145deg, #ffffff 0%, ${conf.bg} 100%)` : undefined,
                  boxShadow: isSelected ? `0 10px 24px -4px ${conf.accentGlow}` : undefined
                }}
                onClick={() => {
                  setActiveModule(mod)
                  setParsedRows([])
                  setFileName(null)
                  setImportSuccess(null)
                  setImportError(null)
                }}
              >
                {isSelected && (
                  <div className="bulk-module-check" style={{ background: conf.color }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
                <div 
                  className="bulk-module-icon" 
                  style={{ 
                    background: conf.bg, 
                    border: `1px solid ${conf.border}` 
                  }}
                >
                  {conf.icon}
                </div>
                <div className="bulk-module-info">
                  <h4>{conf.badge}</h4>
                  <p>{conf.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── TEMPLATE DOWNLOAD BAR ── */}
        <div className="bulk-template-box">
          <div className="bulk-template-text">
            <h4>
              <FileSpreadsheet size={18} color="#059669" />
              Download Standard Template for {moduleConfig[activeModule].badge}
            </h4>
            <p>
              Pre-populated with required columns, validation samples, and <code>publishAt</code> / <code>expiresAt</code> scheduled time fields.
            </p>
          </div>
          <div className="bulk-template-actions">
            <button className="btn-template-download excel" onClick={() => handleDownloadTemplate('xlsx')}>
              <Download size={15} /> Download .XLSX
            </button>
            <button className="btn-template-download csv" onClick={() => handleDownloadTemplate('csv')}>
              <Download size={15} /> Download .CSV
            </button>
          </div>
        </div>

        {/* ── SUCCESS NOTIFICATION ── */}
        {importSuccess && (
          <div style={{
            background: '#ecfdf5',
            border: '1.5px solid #10b981',
            borderRadius: '14px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: '#065f46' }}>Upload Complete</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>{importSuccess}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(moduleConfig[activeModule].viewLink)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              View {moduleConfig[activeModule].name} <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ── ERROR NOTIFICATION ── */}
        {importError && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #ef4444',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={22} color="#ef4444" />
            <span style={{ fontSize: '13.5px', color: '#991b1b', fontWeight: 600 }}>{importError}</span>
          </div>
        )}

        {/* ── DRAG & DROP UPLOAD DROPZONE ── */}
        {parsedRows.length === 0 && (
          <div
            className={`bulk-upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
            <div className="bulk-upload-icon-wrap">
              <Upload size={32} />
            </div>
            <h3>Drag & Drop your {moduleConfig[activeModule].badge} Excel or CSV file here</h3>
            <p>Supports .xlsx, .xls, and .csv files up to 500+ items per batch</p>
            <div className="bulk-upload-specs">
              <span><CheckCircle2 size={14} color="#10b981" /> Automatic Pre-validation</span>
              <span><Clock size={14} color="#3b82f6" /> Scheduled Time Triggers</span>
              <span><ShieldCheck size={14} color="#8b5cf6" /> Duplicate Protection</span>
            </div>
          </div>
        )}

        {/* ── PREVIEW AND VALIDATION SECTION ── */}
        {parsedRows.length > 0 && (
          <>
            {/* Stats Ribbon */}
            <div className="bulk-stats-ribbon">
              <div className="bulk-stat-card">
                <div>
                  <div className="bulk-stat-num" style={{ color: '#0f172a' }}>{stats.total}</div>
                  <div className="bulk-stat-lbl">Total Parsed Rows</div>
                </div>
                <Layers size={24} color="#94a3b8" />
              </div>

              <div className="bulk-stat-card">
                <div>
                  <div className="bulk-stat-num" style={{ color: '#059669' }}>{stats.valid}</div>
                  <div className="bulk-stat-lbl">Ready to Import</div>
                </div>
                <CheckCircle2 size={24} color="#10b981" />
              </div>

              <div className="bulk-stat-card">
                <div>
                  <div className="bulk-stat-num" style={{ color: stats.invalid > 0 ? '#ef4444' : '#64748b' }}>{stats.invalid}</div>
                  <div className="bulk-stat-lbl">Issues / Incomplete</div>
                </div>
                <XCircle size={24} color={stats.invalid > 0 ? '#ef4444' : '#94a3b8'} />
              </div>

              <div className="bulk-stat-card">
                <div>
                  <div className="bulk-stat-num" style={{ color: '#d97706' }}>{stats.scheduled}</div>
                  <div className="bulk-stat-lbl">Scheduled for Future</div>
                </div>
                <Clock size={24} color="#f59e0b" />
              </div>
            </div>

            {/* Progress bar during upload */}
            {importProgress && (
              <div className="bulk-progress-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>Uploading to MongoDB Atlas ({importProgress.done} of {importProgress.total})...</span>
                  <span>{Math.round((importProgress.done / importProgress.total) * 100)}%</span>
                </div>
                <div className="bulk-progress-bar-bg">
                  <div
                    className="bulk-progress-bar-fill"
                    style={{ width: `${(importProgress.done / importProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Interactive Preview Table */}
            <div className="bulk-preview-card">
              <div className="bulk-preview-header">
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                    Data Preview & Validation Table ({fileName})
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    Review items and scheduling triggers before finalizing database import.
                  </p>
                </div>

                <div className="bulk-preview-toolbar">
                  {/* Search */}
                  <div className="bulk-search-box">
                    <Search size={15} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Search preview rows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="bulk-filter-pills">
                    <button
                      className={`bulk-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All ({stats.total})
                    </button>
                    <button
                      className={`bulk-pill-btn ${statusFilter === 'valid' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('valid')}
                      style={{ color: statusFilter === 'valid' ? '#059669' : undefined }}
                    >
                      Valid ({stats.valid})
                    </button>
                    <button
                      className={`bulk-pill-btn ${statusFilter === 'invalid' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('invalid')}
                      style={{ color: statusFilter === 'invalid' ? '#dc2626' : undefined }}
                    >
                      Issues ({stats.invalid})
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bulk-table-wrap">
                <table className="bulk-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th style={{ width: '120px' }}>Status</th>
                      <th style={{ width: '150px' }}>Schedule</th>
                      {activeModule === 'deals' && (
                        <>
                          <th>Title / Item</th>
                          <th>Store</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Original</th>
                          <th>Discount</th>
                        </>
                      )}
                      {activeModule === 'loot-deals' && (
                        <>
                          <th>Loot Title</th>
                          <th>Store</th>
                          <th>Loot Price</th>
                          <th>MRP</th>
                          <th>Discount</th>
                          <th>Type</th>
                        </>
                      )}
                      {activeModule === 'coupons' && (
                        <>
                          <th>Coupon Code</th>
                          <th>Title / Offer</th>
                          <th>Store</th>
                          <th>Discount</th>
                          <th>Type</th>
                        </>
                      )}
                      {activeModule === 'stores' && (
                        <>
                          <th>Store Name</th>
                          <th>Category</th>
                          <th>Reward / Cashback</th>
                          <th>Affiliate Link</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row._rowId} className={!row._isValid ? 'row-invalid' : ''}>
                        <td>{row._rowId}</td>
                        <td>
                          {row._isValid ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          ) : (
                            <span
                              title={row._errors.join(', ')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'help' }}
                            >
                              <XCircle size={13} /> Error
                            </span>
                          )}
                        </td>
                        <td>
                          {row._isScheduled ? (
                            <span className="badge-scheduled-pill scheduled" title={`Scheduled for ${row._publishDateStr}`}>
                              <Clock size={11} /> {row._publishDateStr}
                            </span>
                          ) : (
                            <span className="badge-scheduled-pill live">
                              <Check size={11} /> Immediate
                            </span>
                          )}
                        </td>

                        {activeModule === 'deals' && (
                          <>
                            <td style={{ fontWeight: 600 }}>{row.title || row.name || '—'}</td>
                            <td>{row.store || row.storeName || '—'}</td>
                            <td>{row.category || '—'}</td>
                            <td style={{ color: '#059669', fontWeight: 700 }}>{row.price || row.currentPrice || '—'}</td>
                            <td style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{row.originalPrice || '—'}</td>
                            <td>{row.discount || '—'}</td>
                          </>
                        )}

                        {activeModule === 'loot-deals' && (
                          <>
                            <td style={{ fontWeight: 600 }}>{row.title || row.name || '—'}</td>
                            <td>{row.store || row.storeName || '—'}</td>
                            <td style={{ color: '#ef4444', fontWeight: 700 }}>{row.currentPrice || row.price || '—'}</td>
                            <td style={{ color: '#94a3b8', textDecoration: 'line-through' }}>{row.originalPrice || '—'}</td>
                            <td>{row.discount || '—'}</td>
                            <td><span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8b5cf6' }}>{row.lootType || 'steal'}</span></td>
                          </>
                        )}

                        {activeModule === 'coupons' && (
                          <>
                            <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: '#3b82f6' }}>{row.code || '—'}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.title || row.description || '—'}</td>
                            <td>{row.store || '—'}</td>
                            <td style={{ color: '#059669', fontWeight: 700 }}>{row.discount || '—'}</td>
                            <td>{row.couponType || 'flat'}</td>
                          </>
                        )}

                        {activeModule === 'stores' && (
                          <>
                            <td style={{ fontWeight: 600 }}>{row.name || row.storeName || '—'}</td>
                            <td>{row.category || '—'}</td>
                            <td style={{ color: '#059669', fontWeight: 700 }}>{row.reward || '—'}</td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.affiliateLink || '—'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="bulk-action-footer">
                <button
                  className="btn-template-download csv"
                  onClick={() => {
                    setParsedRows([])
                    setFileName(null)
                  }}
                >
                  <RotateCcw size={14} /> Clear & Upload Another File
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    <strong>{stats.valid}</strong> of {stats.total} items will be imported
                  </span>
                  <button
                    className="btn-import-primary"
                    onClick={handleExecuteImport}
                    disabled={loading || stats.valid === 0}
                  >
                    <Sparkles size={16} /> {loading ? 'Importing...' : `Import ${stats.valid} Valid Items`}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </ExecutiveLayout>
  )
}

export default ExecutiveBulkUploadPage
