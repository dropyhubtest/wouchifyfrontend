import React, { useRef, useEffect, useState } from 'react'
import { DealCard } from './DealCard'
import { DealsEmptyState } from './DealsEmptyState'
import { BEST_SELLING_DEAL_ITEMS } from '../../data/dealsPage'
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
  }, [scale, showEmptyState])

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
            {BEST_SELLING_DEAL_ITEMS.map((deal) => (
              <DealCard key={deal.id} deal={deal} horizontal={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BestSellingDeals
