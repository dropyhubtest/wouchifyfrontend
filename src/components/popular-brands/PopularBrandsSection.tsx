import React, { useEffect, useState } from 'react'
import { POPULAR_BRANDS_CAROUSEL } from '../../data/popularBrands'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { fetchPopularBrands } from '../../utils/api'
import { BrandRewardCard } from './BrandRewardCard'
import './PopularBrandsSection.css'

export const PopularBrandsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [liveBrands, setLiveBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const { data } = await fetchPopularBrands()
        // Map the backend data to match the frontend expected structure
        const formatted = data.map((b: any) => ({
          id: b._id,
          name: b.name,
          logo: b.logoUrl || '/images/default-logo.png', // Fallback image if missing
          cashbackText: b.cashbackText || 'Up to 10% Cashback',
          category: b.categories?.[0]?.name || 'Shopping',
          backgroundColor: '#FFFFFF', // Dummy values for UI layout
          textColor: '#000000',
        }))
        setLiveBrands(formatted)
      } catch (err) {
        console.error('Error fetching brands:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBrands()
  }, [])

  // Use live brands if available, otherwise fallback to the hardcoded dummy data so the UI doesn't break when DB is empty!
  const displayBrands = liveBrands.length > 0 ? liveBrands : POPULAR_BRANDS_CAROUSEL

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
            {loading ? (
              <p style={{ padding: '20px', fontSize: '18px' }}>Loading Brands...</p>
            ) : (
              displayBrands.map((brand: any) => (
                <BrandRewardCard key={brand.id} brand={brand} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularBrandsSection
