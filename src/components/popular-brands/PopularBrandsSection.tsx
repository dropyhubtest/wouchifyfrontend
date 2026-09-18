import React, { useEffect, useState } from 'react'
import { POPULAR_BRANDS_CAROUSEL, type BrandRewardItem } from '../../data/popularBrands'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { fetchPopularBrands } from '../../utils/api'
import { getStoreLogo } from '../../data/dealsPage'
import { BrandRewardCard } from './BrandRewardCard'
import './PopularBrandsSection.css'

export const PopularBrandsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [displayBrands, setDisplayBrands] = useState<BrandRewardItem[]>(POPULAR_BRANDS_CAROUSEL)

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const { data } = await fetchPopularBrands()
        if (Array.isArray(data) && data.length > 0) {
          // Merge live brands with the curated layout and high-res logos
          const merged: BrandRewardItem[] = POPULAR_BRANDS_CAROUSEL.map((defaultItem) => {
            const liveMatch = data.find((d: any) => 
              d.name?.toLowerCase() === defaultItem.name?.toLowerCase() ||
              d.slug === defaultItem.slug
            )
            if (liveMatch) {
              return {
                ...defaultItem,
                name: liveMatch.name || defaultItem.name,
                logoSrc: liveMatch.logoUrl && !liveMatch.logoUrl.includes('default-logo') 
                  ? liveMatch.logoUrl 
                  : defaultItem.logoSrc || getStoreLogo(liveMatch.name),
                rewardValue: liveMatch.cashbackText || defaultItem.rewardValue,
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
    loadBrands()
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
