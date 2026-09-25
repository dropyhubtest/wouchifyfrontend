import React, { useEffect, useState } from 'react'
import { POPULAR_BRANDS_CAROUSEL, type BrandRewardItem } from '../../data/popularBrands'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { getStoreLogo } from '../../data/dealsPage'
import { BrandRewardCard } from './BrandRewardCard'
import './PopularBrandsSection.css'

import { adminApi } from '../../services/adminApi'

export const PopularBrandsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [displayBrands, setDisplayBrands] = useState<BrandRewardItem[]>(POPULAR_BRANDS_CAROUSEL)

  const loadBrands = async () => {
    try {
      const stores = await adminApi.getStores({ all: true })
      if (Array.isArray(stores) && stores.length > 0) {
        // Collect names and slugs of stores/brands that are explicitly hidden from homepage
        const hiddenSet = new Set(
          stores
            .filter((s: any) => s.showOnHome === false || s.sectionPlacement === 'none' || s.status === 'inactive')
            .map((s: any) => (s.name || s.slug || '').toLowerCase().trim())
        )

        // Filter default static list
        const visibleDefaults = POPULAR_BRANDS_CAROUSEL.filter(
          (item) => !hiddenSet.has(item.name.toLowerCase().trim()) && !hiddenSet.has((item.slug || '').toLowerCase().trim())
        )

        // Merge live store info
        const merged: BrandRewardItem[] = visibleDefaults.map((defaultItem) => {
          const liveMatch = stores.find((d: any) => 
            d.name?.toLowerCase().trim() === defaultItem.name?.toLowerCase().trim() ||
            d.slug === defaultItem.slug
          )
          if (liveMatch) {
            return {
              ...defaultItem,
              name: liveMatch.name || defaultItem.name,
              logoSrc: liveMatch.logo && !liveMatch.logo.includes('default-logo') 
                ? liveMatch.logo 
                : defaultItem.logoSrc || getStoreLogo(liveMatch.name),
              rewardValue: liveMatch.reward || defaultItem.rewardValue,
            }
          }
          return defaultItem
        })
        setDisplayBrands(merged)
      }
    } catch (err) {
      console.warn('Could not sync live brands, using curated list:', err)
    }
  }

  useEffect(() => {
    loadBrands()
    const handleUpdate = () => loadBrands()
    window.addEventListener('wouchify_stores_updated', handleUpdate)
    return () => window.removeEventListener('wouchify_stores_updated', handleUpdate)
  }, [])

  return (
    <section
      id="popular-brands"
      className="popular-brands-section"
      aria-label="Most Popular Brands"
      style={
        {
          '--popular-scale': sectionScale,
          height: `${902 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 1022 Reference Canvas */}
      <div className="popular-brands-canvas">
        {/* Heading Container */}
        <div className="popular-brands__header">
          <div className="popular-brands__heading-accent" aria-hidden="true" />
          <h2 className="popular-brands__title">Most Popular Brands</h2>
        </div>

        {/* Carousel Viewport (Now Scrollable) */}
        <div className="popular-brands__viewport">
          {/* 2-Row x N-Column Track */}
          <div className="popular-brands__track">
            {displayBrands.map((brand: any) => (
              <BrandRewardCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularBrandsSection
