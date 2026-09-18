import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import './BulkDataImportModal.css'
import { adminApi } from '../../../../services/adminApi'

export type BulkImportModule = 'deals' | 'loot' | 'coupons' | 'stores'

interface BulkDataImportModalProps {
  isOpen: boolean
  onClose: () => void
  initialModule?: BulkImportModule
  onImportSuccess?: (module: BulkImportModule, count: number) => void
}

interface ParsedItem {
  id: string
  raw: Record<string, any>
  isValid: boolean
  errors: string[]
  isScheduled: boolean
  scheduledTimeStr: string
  publishDateObj: Date | null
}

export const BulkDataImportModal: React.FC<BulkDataImportModalProps> = ({
  isOpen,
  onClose,
  initialModule = 'deals',
  onImportSuccess
}) => {
  const [activeModule, setActiveModule] = useState<BulkImportModule>(initialModule)
  const [fileName, setFileName] = useState<string>('')
  const [parsedRows, setParsedRows] = useState<ParsedItem[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [autoApprove, setAutoApprove] = useState<boolean>(true)
  const [filterMode, setFilterMode] = useState<'all' | 'valid' | 'scheduled' | 'error'>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!isOpen) return null

  // Helper to parse date string or Excel numeric date
  const parseFlexibleDate = (dateVal: any): Date | null => {
    if (!dateVal) return null
    if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal

    if (typeof dateVal === 'number') {
      // Excel serial date to JS Date
      const utcDays = Math.floor(dateVal - 25569)
      const utcValue = utcDays * 86400
      const dateInfo = new Date(utcValue * 1000)
      const fractionalDay = dateVal - Math.floor(dateVal) + 0.0000001
      let totalSeconds = Math.floor(86400 * fractionalDay)
      const seconds = totalSeconds % 60
      totalSeconds -= seconds
      const hours = Math.floor(totalSeconds / (60 * 60))
      const minutes = Math.floor(totalSeconds / 60) % 60
      return new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate(), hours, minutes, seconds)
    }

    const str = String(dateVal).trim()
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) return parsed

    // Try parsing formats like DD-MM-YYYY HH:mm or DD/MM/YYYY
    const ddmmyyyyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?/)
    if (ddmmyyyyMatch) {
      const [, day, month, year, hours, minutes] = ddmmyyyyMatch
      return new Date(Number(year), Number(month) - 1, Number(day), Number(hours || 0), Number(minutes || 0))
    }

    return null
  }

  // Generate Sample Template
  const handleDownloadTemplate = (format: 'csv' | 'xlsx') => {
    let headers: string[] = []
    let sampleData: Record<string, any>[] = []
    const now = new Date()
    const scheduledTime = new Date(now.getTime() + 4 * 60 * 60 * 1000) // 4 hours in future
    const expiryTime = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days in future

    const fmtDate = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 16)

    if (activeModule === 'deals') {
      headers = [
        'title',
        'store',
        'brand',
        'category',
        'subCategory',
        'asinOrSku',
        'type',
        'price',
        'originalPrice',
        'discount',
        'effectivePrice',
        'bankOffer',
        'cashback',
        'code',
        'link',
        'image',
        'images',
        'badge',
        'stockStatus',
        'rating',
        'deliveryInfo',
        'warranty',
        'isBestSelling',
        'isFeatured',
        'isVerified',
        'priority',
        'sectionPlacement',
        'highlights',
        'variantNote',
        'howToClaim',
        'description',
        'terms',
        'publishAt',
        'expiresAt'
      ]
      sampleData = [
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
          expiresAt: fmtDate(expiryTime)
        },
        {
          title: 'Nike Air Max 270 Men Sneakers - Triple Black',
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
          publishAt: fmtDate(scheduledTime),
          expiresAt: fmtDate(expiryTime)
        }
      ]
    } else if (activeModule === 'loot') {
      headers = [
        'title',
        'store',
        'brand',
        'category',
        'lootType',
        'currentPrice',
        'originalPrice',
        'discount',
        'effectivePrice',
        'cashback',
        'code',
        'link',
        'asinOrSku',
        'image',
        'images',
        'badge',
        'stockClaimedPercent',
        'quantityAlert',
        'proofNote',
        'trickSteps',
        'priority',
        'rating',
        'deliveryInfo',
        'telegramAlert',
        'pushNotification',
        'isFeatured',
        'isVerified',
        'isBestSelling',
        'sectionPlacement',
        'terms',
        'publishAt',
        'expiresAt'
      ]
      sampleData = [
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
          stockClaimedPercent: '88',
          quantityAlert: 'Limited Flash Stock (High Speed Claim)',
          proofNote: 'Verified price drop screenshot checked on live crawler',
          trickSteps: '1. Click Grab Loot. 2. Apply coupon FLASHDROP. 3. Complete payment with UPI.',
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
          expiresAt: fmtDate(expiryTime)
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
          stockClaimedPercent: '92',
          quantityAlert: 'Price Glitch Alive',
          proofNote: 'Tested and verified working by Content Team',
          trickSteps: '1. Add size L or XL. 2. Cart value auto-discounts at final step.',
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
          publishAt: fmtDate(scheduledTime),
          expiresAt: fmtDate(expiryTime)
        }
      ]
    } else if (activeModule === 'coupons') {
      headers = [
        'code',
        'title',
        'description',
        'store',
        'category',
        'couponType',
        'discount',
        'discountValue',
        'minOrder',
        'maxDiscount',
        'affiliateLink',
        'startDate',
        'status',
        'isExclusive',
        'isFeatured',
        'isVerified',
        'telegramAlert',
        'totalUses',
        'publishAt',
        'expiresAt'
      ]
      sampleData = [
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
          totalUses: '5000',
          publishAt: '',
          expiresAt: fmtDate(expiryTime)
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
          totalUses: '10000',
          publishAt: fmtDate(scheduledTime),
          expiresAt: fmtDate(expiryTime)
        }
      ]
    } else if (activeModule === 'stores') {
      headers = [
        'name',
        'slug',
        'category',
        'reward',
        'description',
        'affiliateLink',
        'logoUrl',
        'cardBg',
        'badgeBg',
        'status',
        'isFeatured',
        'publishAt',
        'expiresAt'
      ]
      sampleData = [
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
          expiresAt: fmtDate(expiryTime)
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
          publishAt: fmtDate(scheduledTime),
          expiresAt: fmtDate(expiryTime)
        }
      ]
    }

    const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${activeModule.toUpperCase()}_Template`)

    if (format === 'csv') {
      XLSX.writeFile(wb, `Wouchify_${activeModule.toUpperCase()}_Bulk_Template.csv`, { bookType: 'csv' })
    } else {
      XLSX.writeFile(wb, `Wouchify_${activeModule.toUpperCase()}_Bulk_Template.xlsx`, { bookType: 'xlsx' })
    }
  }

  // Parse Uploaded File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true })
        const firstSheetName = wb.SheetNames[0]
        const worksheet = wb.Sheets[firstSheetName]
        const rawJson: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        const now = new Date()
        const validatedList: ParsedItem[] = rawJson.map((row, index) => {
          const errors: string[] = []

          // Common checks
          const nameOrTitle = row.name || row.title || row.code
          if (!nameOrTitle || !String(nameOrTitle).trim()) {
            errors.push('Name / Title / Code is missing')
          }

          if (activeModule !== 'stores') {
            if (!row.store && !row.storeName) {
              errors.push('Store name is missing')
            }
          }

          if (activeModule === 'deals' || activeModule === 'loot') {
            if (!row.price && !row.currentPrice) {
              errors.push('Price is missing')
            }
          }

          // Scheduled Date Evaluation
          const publishDate = parseFlexibleDate(row.publishAt || row.scheduledAt || row.publishDate)
          const isScheduled = !!(publishDate && publishDate.getTime() > now.getTime())

          let scheduledTimeStr = 'Live Immediately'
          if (isScheduled && publishDate) {
            scheduledTimeStr = publishDate.toLocaleString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          }

          return {
            id: `row-${index + 1}`,
            raw: row,
            isValid: errors.length === 0,
            errors,
            isScheduled,
            scheduledTimeStr,
            publishDateObj: publishDate
          }
        })

        setParsedRows(validatedList)
      } catch (err) {
        console.error('File parsing error:', err)
        alert('Failed to parse Excel/CSV file. Please ensure valid format.')
      } finally {
        setIsProcessing(false)
      }
    }

    reader.readAsBinaryString(file)
  }

  // Remove individual row from preview table
  const handleRemoveRow = (id: string) => {
    setParsedRows((prev) => prev.filter((r) => r.id !== id))
  }

  // Submit Bulk Records to MongoDB Atlas
  const handleConfirmImport = async () => {
    const validItems = parsedRows.filter((r) => r.isValid)
    if (validItems.length === 0) {
      alert('No valid items found to import.')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(10)

    try {
      const payloadItems = validItems.map((item) => {
        const raw = item.raw
        return {
          ...raw,
          publishAt: item.publishDateObj ? item.publishDateObj.toISOString() : new Date().toISOString(),
          expiresAt: raw.expiresAt ? parseFlexibleDate(raw.expiresAt)?.toISOString() || '' : ''
        }
      })

      setUploadProgress(40)

      if (activeModule === 'deals') {
        await adminApi.bulkImportDeals(payloadItems, autoApprove)
      } else if (activeModule === 'loot') {
        await adminApi.bulkImportLootDeals(payloadItems, autoApprove)
      } else if (activeModule === 'coupons') {
        await adminApi.bulkImportCoupons(payloadItems, autoApprove)
      } else if (activeModule === 'stores') {
        await adminApi.bulkImportStores(payloadItems, autoApprove)
      }

      setUploadProgress(100)
      setTimeout(() => {
        setIsSubmitting(false)
        if (onImportSuccess) {
          onImportSuccess(activeModule, validItems.length)
        }
        onClose()
      }, 500)
    } catch (err: any) {
      console.error('Bulk import error:', err)
      alert(`Bulk import failed: ${err.message || 'Please check network and server logs.'}`)
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  // Filtered rows for preview
  const filteredList = parsedRows.filter((row) => {
    if (filterMode === 'valid' && !row.isValid) return false
    if (filterMode === 'error' && row.isValid) return false
    if (filterMode === 'scheduled' && (!row.isScheduled || !row.isValid)) return false

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const title = String(row.raw.name || row.raw.title || row.raw.code || '').toLowerCase()
      const store = String(row.raw.store || row.raw.storeName || '').toLowerCase()
      const cat = String(row.raw.category || '').toLowerCase()
      return title.includes(q) || store.includes(q) || cat.includes(q)
    }
    return true
  })

  const totalCount = parsedRows.length
  const validCount = parsedRows.filter((r) => r.isValid).length
  const scheduledCount = parsedRows.filter((r) => r.isValid && r.isScheduled).length
  const errorCount = parsedRows.filter((r) => !r.isValid).length

  return (
    <div className="bulk-modal-overlay" onClick={onClose}>
      <div className="bulk-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bulk-modal-header">
          <div>
            <div className="bulk-modal-badge">⚡ HIGH-THROUGHPUT BULK INGESTION</div>
            <h2 className="bulk-modal-title">Bulk Import (Excel / CSV) & Scheduled Publishing</h2>
            <p className="bulk-modal-subtitle">
              Upload 200–500 products at a time with automatic time-based scheduled visibility on the live website.
            </p>
          </div>
          <button className="bulk-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Module Selector Strip */}
        <div className="bulk-module-tabs">
          <button
            className={`bulk-module-tab ${activeModule === 'deals' ? 'active' : ''}`}
            onClick={() => {
              setActiveModule('deals')
              setParsedRows([])
              setFileName('')
            }}
          >
            🛍️ Promotional Deals
          </button>
          <button
            className={`bulk-module-tab ${activeModule === 'loot' ? 'active' : ''}`}
            onClick={() => {
              setActiveModule('loot')
              setParsedRows([])
              setFileName('')
            }}
          >
            ⚡ Loot Drops & Glitches
          </button>
          <button
            className={`bulk-module-tab ${activeModule === 'coupons' ? 'active' : ''}`}
            onClick={() => {
              setActiveModule('coupons')
              setParsedRows([])
              setFileName('')
            }}
          >
            🎟️ Store Coupons & Codes
          </button>
          <button
            className={`bulk-module-tab ${activeModule === 'stores' ? 'active' : ''}`}
            onClick={() => {
              setActiveModule('stores')
              setParsedRows([])
              setFileName('')
            }}
          >
            🏪 Partner Stores & Cashback
          </button>
        </div>

        {/* Upload Zone & Template Downloader */}
        {parsedRows.length === 0 ? (
          <div className="bulk-upload-section">
            <div className="bulk-template-card">
              <div className="bulk-template-info">
                <h3>📥 Step 1: Download Standard Sample Template</h3>
                <p>
                  Use our pre-formatted spreadsheet template with verified columns and realistic scheduled time formatting.
                </p>
              </div>
              <div className="bulk-template-actions">
                <button className="btn-template-csv" onClick={() => handleDownloadTemplate('csv')}>
                  Download .CSV Template
                </button>
                <button className="btn-template-xlsx" onClick={() => handleDownloadTemplate('xlsx')}>
                  Download .XLSX Template
                </button>
              </div>
            </div>

            <div
              className="bulk-dropzone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files?.[0]) {
                  const fakeEvent = {
                    target: { files: e.dataTransfer.files }
                  } as any
                  handleFileUpload(fakeEvent)
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div className="bulk-dropzone-icon">📊</div>
              <h4>Drag & drop your Excel (.xlsx / .xls) or CSV (.csv) file here</h4>
              <p>Supports 200 to 500+ records in a single batch upload</p>
              <button className="btn-browse-file" type="button">
                Browse Files
              </button>
            </div>

            {isProcessing && (
              <div className="bulk-parsing-indicator">
                <div className="spinner"></div>
                <span>Parsing spreadsheet and verifying schedule timestamps...</span>
              </div>
            )}
          </div>
        ) : (
          /* Preview & Validation Table View */
          <div className="bulk-preview-section">
            {/* KPI Summary Strip */}
            <div className="bulk-kpi-strip">
              <div
                className={`bulk-kpi-card ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                <span className="kpi-num">{totalCount}</span>
                <span className="kpi-label">Total Rows Parsed</span>
              </div>
              <div
                className={`bulk-kpi-card valid ${filterMode === 'valid' ? 'active' : ''}`}
                onClick={() => setFilterMode('valid')}
              >
                <span className="kpi-num">{validCount}</span>
                <span className="kpi-label">✅ Ready to Import</span>
              </div>
              <div
                className={`bulk-kpi-card scheduled ${filterMode === 'scheduled' ? 'active' : ''}`}
                onClick={() => setFilterMode('scheduled')}
              >
                <span className="kpi-num">{scheduledCount}</span>
                <span className="kpi-label">⏳ Scheduled (Future)</span>
              </div>
              <div
                className={`bulk-kpi-card error ${filterMode === 'error' ? 'active' : ''}`}
                onClick={() => setFilterMode('error')}
              >
                <span className="kpi-num">{errorCount}</span>
                <span className="kpi-label">⚠️ Needs Review</span>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bulk-table-toolbar">
              <div className="bulk-search-box">
                <input
                  type="text"
                  placeholder="Filter by product name, store, code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bulk-file-badge">
                <span>📁 {fileName}</span>
                <button
                  className="btn-replace-file"
                  onClick={() => {
                    setParsedRows([])
                    setFileName('')
                  }}
                >
                  Upload Different File
                </button>
              </div>
            </div>

            {/* Scrollable Preview Table */}
            <div className="bulk-table-wrapper">
              <table className="bulk-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status / Schedule</th>
                    <th>{activeModule === 'coupons' ? 'Coupon Code' : 'Title / Product'}</th>
                    <th>Store</th>
                    <th>Category</th>
                    {activeModule !== 'coupons' && activeModule !== 'stores' && <th>Price / Discount</th>}
                    {activeModule === 'coupons' && <th>Discount Value</th>}
                    {activeModule === 'stores' && <th>Cashback Reward</th>}
                    <th>Publish Time (`publishAt`)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item, idx) => {
                    const r = item.raw
                    return (
                      <tr key={item.id} className={!item.isValid ? 'row-error' : item.isScheduled ? 'row-scheduled' : ''}>
                        <td className="col-idx">{idx + 1}</td>
                        <td>
                          {!item.isValid ? (
                            <span className="badge-err" title={item.errors.join(', ')}>
                              ⚠️ Error ({item.errors[0]})
                            </span>
                          ) : item.isScheduled ? (
                            <span className="badge-scheduled">
                              ⏳ Goes live: {item.scheduledTimeStr}
                            </span>
                          ) : (
                            <span className="badge-live">🟢 Live Immediately</span>
                          )}
                        </td>
                        <td className="col-title">
                          <strong>{r.name || r.title || r.code || 'Untitled'}</strong>
                          {r.description && <small className="col-sub">{String(r.description).slice(0, 40)}...</small>}
                        </td>
                        <td>{r.store || r.storeName || '-'}</td>
                        <td>
                          <span className="badge-cat">{r.category || 'General'}</span>
                        </td>
                        {activeModule !== 'coupons' && activeModule !== 'stores' && (
                          <td>
                            <strong>{r.price ? (String(r.price).startsWith('₹') ? r.price : `₹${r.price}`) : '-'}</strong>
                            {r.discount && <span className="col-discount">({r.discount})</span>}
                          </td>
                        )}
                        {activeModule === 'coupons' && (
                          <td>
                            <strong>{r.discount || 'Special Discount'}</strong>
                          </td>
                        )}
                        {activeModule === 'stores' && (
                          <td>
                            <strong style={{ color: '#16a34a' }}>{r.reward || r.cashbackRate || '5% Cashback'}</strong>
                          </td>
                        )}
                        <td className="col-time">
                          {r.publishAt ? String(r.publishAt).replace('T', ' ') : 'Immediate (Now)'}
                        </td>
                        <td>
                          <button
                            className="btn-row-del"
                            title="Remove row from import"
                            onClick={() => handleRemoveRow(item.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bulk-footer">
              <div className="bulk-auto-approve-opt">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={autoApprove}
                    onChange={(e) => setAutoApprove(e.target.checked)}
                  />
                  <span>
                    Auto-Approve for Live Publishing (Bypasses submission queue directly to live scheduled pipeline)
                  </span>
                </label>
              </div>

              <div className="bulk-footer-btns">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-commit"
                  onClick={handleConfirmImport}
                  disabled={isSubmitting || validCount === 0}
                >
                  {isSubmitting ? (
                    `Saving ${validCount} Items (${uploadProgress}%)...`
                  ) : (
                    `🚀 Import & Schedule ${validCount} ${activeModule.toUpperCase()} to MongoDB`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
