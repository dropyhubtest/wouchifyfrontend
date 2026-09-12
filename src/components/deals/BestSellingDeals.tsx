import React, { useRef, useEffect, useState } from 'react'
import { DealCard } from './DealCard'
import { DealsEmptyState } from './DealsEmptyState'
import { BEST_SELLING_DEAL_ITEMS, normalizeDealToCard, type DealCardItem } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './BestSellingDeals.css'

export interface BestSellingDealsProps {
  title?: string
  topPillText?: string
  showEmptyState?: boolean
  emptyStateTitle?: string
  emptyStateSubtitle?: string
}

export const BestSellingDeals: React.FC<BestSellingDealsProps> = ({
  title = 'Best Selling Deal Picks',
  topPillText = 'Top Deals',
  showEmptyState = false,
  emptyStateTitle = 'No loot deals found',
  emptyStateSubtitle = 'Try adjusting your filters',
}) => {
  const scale = useDesktopScale()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(520)

  // Live Best Selling Deals list initialized from cached storage or defaults
  const [bestDeals, setBestDeals] = useState<DealCardItem[]>(() => {
    try {
      const cached = localStorage.getItem('wouchify_public_deals')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const featured = parsed
            .map((d: any, idx: number) => normalizeDealToCard(d, idx))
            .filter((d: DealCardItem) => d.status === 'active' && d.isBestSelling)
          if (featured.length > 0) return featured
        }
      }
    } catch {}
    return BEST_SELLING_DEAL_ITEMS
  })

  // Fetch from adminApi & subscribe to live updates
  useEffect(() => {
    let isMounted = true

    const fetchBestSellingDeals = async () => {
      try {
        const res = await adminApi.getPublicDeals()
        if (!isMounted) return
        if (Array.isArray(res) && res.length > 0) {
          const normalized = res.map((d: any, idx: number) => normalizeDealToCard(d, idx))
          const featured = normalized.filter(
            (d: DealCardItem) => d.status === 'active' && d.isBestSelling
          )
          if (featured.length > 0) {
            setBestDeals(featured)
          } else {
            setBestDeals(BEST_SELLING_DEAL_ITEMS)
          }
        }
      } catch {
        // Fallback to cached/defaults
      }
    }

    fetchBestSellingDeals()
    const intervalId = setInterval(fetchBestSellingDeals, 10000)

    const handleUpdate = () => {
      fetchBestSellingDeals()
    }

    window.addEventListener('wouchify_deals_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      isMounted = false
      clearInterval(intervalId)
      window.removeEventListener('wouchify_deals_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    const updateHeight = () => {
      if (canvasRef.current) {
        const measured = Math.max(
          canvasRef.current.scrollHeight,
          canvasRef.current.offsetHeight,
          canvasRef.current.getBoundingClientRect().height / (scale || 1)
        )
        setCanvasHeight(Math.ceil(measured) + 20)
      }
    }
    updateHeight()
    const timer = setTimeout(updateHeight, 100)

    const observer = new ResizeObserver(updateHeight)
    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }
    window.addEventListener('resize', updateHeight)
    window.addEventListener('load', updateHeight)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('load', updateHeight)
    }
  }, [scale, showEmptyState, bestDeals])

  return (
    <section
      className="best-selling-deals-section"
      aria-label={title}
      style={{ height: `${canvasHeight * scale}px` }}
    >
      <div className="best-selling-deals-canvas" ref={canvasRef}>
        {/* Section Header with Red Accent */}
        <div className="best-selling-deals__header">
          <div className="best-selling-deals__heading-accent" aria-hidden="true" />
          <h2 className="best-selling-deals__title">{title}</h2>
        </div>

        {/* Top Deals subtitle pill */}
        <div className="best-selling-deals__top-deals-pill">
          {topPillText}
        </div>

        {/* Content: Cards or Empty State */}
        {showEmptyState ? (
          <DealsEmptyState
            title={emptyStateTitle}
            subtitle={emptyStateSubtitle}
          />
        ) : (
          <div className="best-selling-deals__cards-container">
            {bestDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} horizontal={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BestSellingDeals
