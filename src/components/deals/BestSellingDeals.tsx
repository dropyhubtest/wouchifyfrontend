import React, { useRef, useEffect, useState } from 'react'
import { DealCard } from './DealCard'
import { DealsEmptyState } from './DealsEmptyState'
import { normalizeDealToCard, normalizeLootToCard, type DealCardItem } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { DealCardSkeleton } from '../common/Skeletons'
import './BestSellingDeals.css'

export interface BestSellingDealsProps {
  title?: string
  topPillText?: string
  showEmptyState?: boolean
  emptyStateTitle?: string
  emptyStateSubtitle?: string
  dataSource?: 'deals' | 'loot'
}

export const BestSellingDeals: React.FC<BestSellingDealsProps> = ({
  title = 'Best Selling Deal Picks',
  topPillText = 'Top Deals',
  showEmptyState = false,
  emptyStateTitle = 'No loot deals found',
  emptyStateSubtitle = 'Try adjusting your filters',
  dataSource = 'deals'
}) => {
  const scale = useDesktopScale()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(520)

  const [bestDeals, setBestDeals] = useState<DealCardItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch from adminApi & subscribe to live updates
  useEffect(() => {
    let isMounted = true

    const fetchBestSellingDeals = async () => {
      try {
        if (dataSource === 'loot') {
          const res = await adminApi.getLootDeals()
          if (!isMounted) return
          if (Array.isArray(res)) {
            const normalized = res.map((l: any, idx: number) => normalizeLootToCard(l, idx))
            const activeDeals = normalized.filter(
              (d: DealCardItem) => (!d.status || d.status.toLowerCase() === 'active' || d.status.toLowerCase() === 'approved')
            )
            const featured = activeDeals.filter(d => Boolean(d.isBestSelling))
            setBestDeals(featured.length > 0 ? featured : activeDeals.slice(0, 4))
          }
        } else {
          const res = await adminApi.getDeals()
          if (!isMounted) return
          if (Array.isArray(res)) {
            const normalized = res.map((d: any, idx: number) => normalizeDealToCard(d, idx))
            const activeDeals = normalized.filter(
              (d: DealCardItem) => (!d.status || d.status.toLowerCase() === 'active' || d.status.toLowerCase() === 'approved')
            )
            const featured = activeDeals.filter(d => Boolean(d.isBestSelling))
            setBestDeals(featured.length > 0 ? featured : activeDeals.slice(0, 4))
          }
        }
      } catch (err) {
        console.error('Failed to load best selling deals:', err)
        if (isMounted) setBestDeals([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBestSellingDeals()

    const handleUpdate = () => {
      fetchBestSellingDeals()
    }

    window.addEventListener('wouchify_deals_updated', handleUpdate)
    window.addEventListener('wouchify_loot_deals_updated', handleUpdate)
    window.addEventListener('wouchify_deal_clicked', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      isMounted = false
      window.removeEventListener('wouchify_deals_updated', handleUpdate)
      window.removeEventListener('wouchify_loot_deals_updated', handleUpdate)
      window.removeEventListener('wouchify_deal_clicked', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [dataSource])

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

        {/* Content: Loading Skeletons, Cards or Empty State */}
        {loading ? (
          <div className="best-selling-deals__cards-container">
            <DealCardSkeleton count={4} />
          </div>
        ) : showEmptyState || bestDeals.length === 0 ? (
          <DealsEmptyState
            title={showEmptyState ? emptyStateTitle : (dataSource === 'loot' ? "No best selling loot deals selected" : "No best selling deals selected")}
            subtitle={showEmptyState ? emptyStateSubtitle : "Mark deals with ⭐ Best Seller in Executive Panel to feature them here"}
          />
        ) : (
          <div className="best-selling-deals__cards-container">
            {bestDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} horizontal={true} isLoot={dataSource === 'loot'} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BestSellingDeals
