import React, { useRef, useEffect, useState } from 'react'
import { DealCard } from './DealCard'
import { BEST_SELLING_DEAL_ITEMS } from '../../data/dealsPage'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './BestSellingDeals.css'

export const BestSellingDeals: React.FC = () => {
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
  }, [scale])

  return (
    <section
      className="best-selling-deals-section"
      aria-label="Best Selling Deal Picks"
      style={{ height: `${canvasHeight * scale}px` }}
    >
      <div className="best-selling-deals-canvas" ref={canvasRef}>
        {/* Section Header with Red Accent */}
        <div className="best-selling-deals__header">
          <div className="best-selling-deals__heading-accent" aria-hidden="true" />
          <h2 className="best-selling-deals__title">Best Selling Deal Picks</h2>
        </div>

        {/* Top Deals subtitle pill */}
        <div className="best-selling-deals__top-deals-pill">
          Top Deals
        </div>

        {/* Featured Horizontal Cards Container */}
        <div className="best-selling-deals__cards-container">
          {BEST_SELLING_DEAL_ITEMS.map((deal) => (
            <DealCard key={deal.id} deal={deal} horizontal={true} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellingDeals

