import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { CategoryDirectoryCard } from '../components/categories/CategoryDirectoryCard'
import { DealCard } from '../components/deals/DealCard'
import { CATEGORIES_DATA } from '../data/categories'
import { CATEGORY_DIRECTORY_ITEMS } from '../data/categoriesDirectoryData'
import { adminApi } from '../services/adminApi'
import type { DealCardItem } from '../data/dealsPage'
import { SUBCATEGORIES_DATA } from '../data/subcategoriesData'
import defaultStoreLogo from '../assets/brand-logos/amazon-logo.png'
import './CategoryDetailPage.css'

interface CategoryDetailPageProps {
  categorySlug: string
}

type TabType = 'all' | 'deals' | 'coupons' | 'stores'

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ categorySlug }) => {
  const [dbCategories, setDbCategories] = useState<any[]>([])

  const category = useMemo(() => {
    const slugLower = (categorySlug || '').toLowerCase()
    
    // 1. Check live DB categories
    const fromDb = dbCategories.find(
      (c) => (c.slug && c.slug.toLowerCase() === slugLower) || (c.name && c.name.toLowerCase() === slugLower)
    )
    if (fromDb) return fromDb

    // 2. Check static CATEGORIES_DATA
    const fromStatic = CATEGORIES_DATA.find((c) => c.slug.toLowerCase() === slugLower)
    if (fromStatic) return fromStatic

    // 3. Check if it's a subcategory of CATEGORIES_DATA
    for (const parent of CATEGORIES_DATA) {
      const sub = parent.subcategories?.find((s) => s.slug.toLowerCase() === slugLower || s.name.toLowerCase() === slugLower)
      if (sub) {
        return {
          id: sub.id || sub.slug,
          name: sub.name,
          slug: sub.slug,
          color: parent.color,
          bgColor: parent.bgColor,
          textColor: parent.textColor,
          count: sub.itemCount || parent.count,
          description: `Explore trending ${sub.name} offers, verified promo codes, and real-time cashbacks.`,
          subcategories: [sub]
        }
      }
    }

    // 4. Check SUBCATEGORIES_DATA
    const fromSubcatData = SUBCATEGORIES_DATA.find(
      (s) => s.slug.toLowerCase() === slugLower || s.name.toLowerCase() === slugLower
    )
    if (fromSubcatData) {
      return {
        id: fromSubcatData.id,
        name: fromSubcatData.name,
        slug: fromSubcatData.slug,
        color: '#2F368C',
        bgColor: '#E5E7FF',
        textColor: '#2F368C',
        count: 0,
        description: `Verified deals, coupons, and top store savings for ${fromSubcatData.name}.`,
        subcategories: []
      }
    }

    // 5. Check CATEGORY_DIRECTORY_ITEMS
    const fromDir = CATEGORY_DIRECTORY_ITEMS.find(
      (d) => d.slug.toLowerCase() === slugLower || d.name.toLowerCase() === slugLower
    )
    if (fromDir) {
      return {
        id: fromDir.id,
        name: fromDir.name,
        slug: fromDir.slug,
        color: '#E31E25',
        bgColor: '#FFE3E3',
        textColor: '#E31E25',
        count: 0,
        description: `Latest offers, promo codes, and merchant cashbacks for ${fromDir.name}.`,
        subcategories: []
      }
    }

    // Fallback: title case the slug
    const formattedName = categorySlug
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    return {
      id: categorySlug,
      name: formattedName,
      slug: categorySlug,
      color: '#2F368C',
      bgColor: '#E5E7FF',
      textColor: '#2F368C',
      count: 0,
      description: `Browse verified discounts, store rewards, and exclusive coupons for ${formattedName}.`,
      subcategories: []
    }
  }, [categorySlug, dbCategories])

  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [liveDeals, setLiveDeals] = useState<DealCardItem[]>([])
  const [liveCoupons, setLiveCoupons] = useState<any[]>([])
  const [liveStores, setLiveStores] = useState<any[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadCategoryData = useCallback(async () => {
    try {
      setLoading(true)
      const catName = (category.name || '').toLowerCase()
      const catSlug = (category.slug || '').toLowerCase()

      const [dealsRes, lootsRes, couponsRes, storesRes, catsRes] = await Promise.all([
        adminApi.getDeals().catch(() => []),
        adminApi.getLootDeals().catch(() => []),
        adminApi.getCoupons().catch(() => []),
        adminApi.getStores().catch(() => []),
        adminApi.getCategories().catch(() => [])
      ])

      if (Array.isArray(catsRes) && catsRes.length > 0) {
        setDbCategories(catsRes)
      }

      const subNames = (category.subcategories || []).map((s: any) => s.name?.toLowerCase()).filter(Boolean)
      const subSlugs = (category.subcategories || []).map((s: any) => s.slug?.toLowerCase()).filter(Boolean)

      const isCatMatch = (itemCat?: string, itemSubCat?: string, itemTitle?: string) => {
        const catVal = (itemCat || '').toLowerCase()
        const subVal = (itemSubCat || '').toLowerCase()
        const titleVal = (itemTitle || '').toLowerCase()

        if (!catVal && !subVal && !titleVal) return false

        if (catVal.includes(catSlug) || (catSlug && catSlug.includes(catVal)) || catVal.includes(catName) || (catName && catName.includes(catVal))) return true
        if (subVal && (subVal.includes(catSlug) || catSlug.includes(subVal) || subVal.includes(catName) || catName.includes(subVal))) return true
        if (titleVal && (titleVal.includes(catSlug) || titleVal.includes(catName))) return true

        if (subNames.some((sub: string) => catVal.includes(sub) || sub.includes(catVal) || subVal.includes(sub) || titleVal.includes(sub))) return true
        if (subSlugs.some((sub: string) => catVal.includes(sub) || sub.includes(catVal) || subVal.includes(sub))) return true

        return false
      }

      const filteredDeals = (dealsRes || []).filter((d: any) => isCatMatch(d.category, d.subCategory, d.name || d.title))
      const filteredLoots = (lootsRes || []).filter((l: any) => isCatMatch(l.category, l.subCategory, l.title))
      const filteredCoupons = (couponsRes || []).filter((c: any) => isCatMatch(c.category, c.subCategory, c.code || c.description))
      const filteredStores = (storesRes || []).filter((s: any) => isCatMatch(s.category, undefined, s.name))

      const mappedDeals: DealCardItem[] = [
        ...filteredDeals.map((d: any) => ({
          id: d.id || d._id,
          title: d.name || d.title,
          category: d.category || category.name,
          store: d.store || 'Store',
          storeLogo: defaultStoreLogo,
          productImage: d.image || d.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          price: d.price ? `₹${d.price.toString().replace(/[^0-9]/g, '')}` : '₹999',
          originalPrice: d.originalPrice ? `₹${d.originalPrice.toString().replace(/[^0-9]/g, '')}` : undefined,
          discountPercentage: d.discount || '20% OFF',
          ctaText: 'GRAB DEAL',
          ctaHref: `/product?id=${d.id || d._id}`
        })),
        ...filteredLoots.map((l: any) => ({
          id: l.id || l._id,
          title: l.title,
          category: l.category || category.name,
          store: l.storeName || 'Store',
          storeLogo: defaultStoreLogo,
          productImage: l.image || l.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
          price: l.currentPrice ? `₹${l.currentPrice.toString().replace(/[^0-9]/g, '')}` : '₹499',
          originalPrice: l.originalPrice ? `₹${l.originalPrice.toString().replace(/[^0-9]/g, '')}` : undefined,
          discountPercentage: l.discount || '50% OFF',
          ctaText: 'GRAB LOOT',
          ctaHref: l.href || `/product?id=${l.id || l._id}`
        }))
      ]

      setLiveDeals(mappedDeals)
      setLiveCoupons(filteredCoupons)
      setLiveStores(filteredStores)
    } catch (err) {
      console.warn('Category detail fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [category.name, category.slug])

  useEffect(() => {
    loadCategoryData()
    window.addEventListener('wouchify_categories_updated', loadCategoryData)
    window.addEventListener('wouchify_deals_updated', loadCategoryData)
    window.addEventListener('wouchify_loot_deals_updated', loadCategoryData)
    window.addEventListener('wouchify_coupons_updated', loadCategoryData)
    window.addEventListener('wouchify_stores_updated', loadCategoryData)
    return () => {
      window.removeEventListener('wouchify_categories_updated', loadCategoryData)
      window.removeEventListener('wouchify_deals_updated', loadCategoryData)
      window.removeEventListener('wouchify_loot_deals_updated', loadCategoryData)
      window.removeEventListener('wouchify_coupons_updated', loadCategoryData)
      window.removeEventListener('wouchify_stores_updated', loadCategoryData)
    }
  }, [loadCategoryData])

  const categoryItems = useMemo(() => {
    const q = category.slug.toLowerCase()
    return CATEGORY_DIRECTORY_ITEMS.filter(
      (item) => item.slug.includes(q) || item.name.toLowerCase().includes(q)
    )
  }, [category.slug])

  const handleCopyCode = (code: string, id?: string | number) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedCode(code)
    if (id || code) {
      adminApi.trackCouponClick(id || code)
    }
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleStoreClick = (storeId: string | number) => {
    adminApi.trackStoreClick(storeId)
  }

  return (
    <div className="category-detail-page">
      {/* 1. Navbar */}
      <div className="category-detail-page__navbar-wrapper">
        <Navbar activeNav="categories" />
      </div>

      {/* 2. Category Detail Hero Banner */}
      <header
        className="category-detail-hero"
        style={{
          '--cat-bg': category.bgColor,
          '--cat-color': category.color,
          '--cat-text': category.textColor,
        } as React.CSSProperties}
      >
        <div className="category-detail-hero__container">
          <nav className="category-detail-hero__breadcrumbs" aria-label="Breadcrumbs">
            <a href="/categories">Categories</a>
            <span aria-hidden="true">&gt;</span>
            <span>{category.name}</span>
          </nav>

          <h1 className="category-detail-hero__title">{category.name}</h1>
          <p className="category-detail-hero__desc">{category.description}</p>

          {/* Subcategory Pills */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="category-detail-hero__subcategories">
              {category.subcategories.map((sub: any) => (
                <span key={sub.id || sub.slug || sub.name} className="category-detail-hero__sub-pill">
                  {sub.name}
                  {sub.itemCount ? <small>({sub.itemCount})</small> : null}
                </span>
              ))}
            </div>
          )}

          {/* Navigation Filter Tabs */}
          <div className="category-detail-hero__tabs" role="tablist">
            <button
              type="button"
              className={`category-tab-btn ${activeTab === 'all' ? 'category-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items ({liveDeals.length + liveCoupons.length + liveStores.length + categoryItems.length})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === 'deals' ? 'category-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('deals')}
            >
              🔥 Deals & Loot ({liveDeals.length})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === 'coupons' ? 'category-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              🏷️ Coupons ({liveCoupons.length})
            </button>
            <button
              type="button"
              className={`category-tab-btn ${activeTab === 'stores' ? 'category-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              🏬 Partner Stores ({liveStores.length})
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Category Items Directory */}
      <main className="category-detail-page__main">
        <div className="category-detail-page__container">
          <div className="category-detail-page__header">
            <h2 className="category-detail-page__section-title">
              {category.name} Catalog
            </h2>
            <a href="/categories" className="category-detail-page__back-link">
              &larr; Back to All Categories
            </a>
          </div>

          {/* Section: Live Deals */}
          {(activeTab === 'all' || activeTab === 'deals') && liveDeals.length > 0 && (
            <section className="category-section-block">
              <div className="category-section-block__head">
                <span className="category-section-pill">Live Deals & Loot Deals</span>
                <span className="category-section-count">{liveDeals.length} available</span>
              </div>
              <div className="category-deals-grid">
                {liveDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          )}

          {/* Section: Live Coupons */}
          {(activeTab === 'all' || activeTab === 'coupons') && liveCoupons.length > 0 && (
            <section className="category-section-block">
              <div className="category-section-block__head">
                <span className="category-section-pill category-section-pill--orange">Exclusive Coupons</span>
                <span className="category-section-count">{liveCoupons.length} codes</span>
              </div>
              <div className="category-coupons-grid">
                {liveCoupons.map((cpn: any) => {
                  const code = (cpn.code || '').toUpperCase()
                  const isCopied = copiedCode === code
                  return (
                    <div key={cpn.id || cpn._id} className="category-coupon-card">
                      <div className="category-coupon-card__header">
                        <span className="category-coupon-card__store">{cpn.store || 'Verified Store'}</span>
                        <span className="category-coupon-card__discount">{cpn.discount || 'Discount'}</span>
                      </div>
                      <p className="category-coupon-card__desc">
                        {cpn.description || `Valid on ${category.name} orders with instant discount applied.`}
                      </p>
                      <div className="category-coupon-card__actions">
                        <span className="category-coupon-card__code">{code}</span>
                        <button
                          type="button"
                          className="category-coupon-card__btn"
                          onClick={() => handleCopyCode(code, cpn.id || cpn._id)}
                        >
                          {isCopied ? 'Copied! ✓' : 'Copy Code'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Section: Live Partner Stores */}
          {(activeTab === 'all' || activeTab === 'stores') && liveStores.length > 0 && (
            <section className="category-section-block">
              <div className="category-section-block__head">
                <span className="category-section-pill category-section-pill--navy">Partner Stores</span>
                <span className="category-section-count">{liveStores.length} stores</span>
              </div>
              <div className="category-stores-grid">
                {liveStores.map((store: any) => (
                  <a
                    key={store.id || store._id}
                    href={store.slug ? `/brands/${store.slug}` : (store.href || '#')}
                    className="category-store-card"
                    onClick={() => handleStoreClick(store.id || store.name)}
                  >
                    <div className="category-store-card__logo-wrap">
                      {store.logo ? (
                        <img src={store.logo} alt={store.name} className="category-store-card__logo" />
                      ) : (
                        <span className="category-store-card__name-badge">{store.name}</span>
                      )}
                    </div>
                    <span className="category-store-card__name">{store.name}</span>
                    <span className="category-store-card__reward">{store.reward || 'Cashback Available'}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Section: Category Directory Items */}
          {(activeTab === 'all') && categoryItems.length > 0 && (
            <section className="category-section-block">
              <div className="category-section-block__head">
                <span className="category-section-pill category-section-pill--gray">Directory & Sub-Categories</span>
                <span className="category-section-count">{categoryItems.length} items</span>
              </div>
              <div className="category-detail-page__grid">
                {categoryItems.map((item) => (
                  <CategoryDirectoryCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {!loading && liveDeals.length === 0 && liveCoupons.length === 0 && liveStores.length === 0 && categoryItems.length === 0 && (
            <div className="category-detail-page__empty">
              <p>No items currently listed in this category. Add deals, coupons, or stores to see them here live!</p>
            </div>
          )}
        </div>
      </main>

      {/* 4. Global Footer */}
      <FooterSection />
    </div>
  )
}

export default CategoryDetailPage
