import React, { useState, useEffect } from 'react'
import { getPublicDeals } from '../../services/api'
import { TRENDING_DEALS } from '../../data/trendingDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import { filterTrendingDeals } from '../../utils/homepageSectionFilters'
import './TrendingDealsSection.css'

export const TrendingDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(TRENDING_DEALS)

  useEffect(() => { 
    getPublicDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = filterTrendingDeals(data)
        if (filtered.length > 0) {
          const list = [...filtered]
          while (list.length < 4 && list.length < TRENDING_DEALS.length) {
            list.push(TRENDING_DEALS[list.length])
          }
          setDeals(list)
        }
      } 
    }).catch(console.warn)
  }, [])

  return (
    <section
      className="trending-deals-section"
      aria-label="Trending Best Sellers"
      style={
        {
          '--trending-scale': sectionScale,
          height: `${507 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 507 Reference Canvas */}
      <div className="trending-deals-canvas">
        {/* Section Header with Navy Accent Circle */}
        <div className="trending-deals__header">
          <div className="trending-deals__heading-accent" aria-hidden="true" />
          <h2 className="trending-deals__title">Trending Best Sellers</h2>
        </div>

        {/* Trending Subtitle Pill */}
        <div className="trending-deals__label-pill" aria-hidden="true" />
        <span className="trending-deals__label-text">
          People Are Grabbing - Trending Deals
        </span>

        {/* Ranked Deal Cards Scroll Viewport & Track */}
        <div className="trending-deals__viewport">
          <div className="trending-deals__track">
            {deals.map((deal, idx) => {
              const rank = deal.rank || (idx + 1)

              const rawImg = deal.productImage || deal.image || deal.imageUrl || deal.thumbnail
              const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/')) && !rawImg.includes('banner_1') && !rawImg.includes('banner_2'))
                ? rawImg
                : (TRENDING_DEALS[idx]?.productImage || 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg')

              const storeName = deal.store || deal.storeName || deal.merchant || 'Amazon'
              const rawStoreLogo = deal.storeLogo || deal.logoUrl
              const storeLogoSrc = (rawStoreLogo && (rawStoreLogo.startsWith('http') || rawStoreLogo.startsWith('data:') || rawStoreLogo.startsWith('/')))
                ? rawStoreLogo
                : getStoreLogo(storeName)

              const rawPrice = deal.currentPrice ?? deal.price ?? deal.dealPrice ?? (idx === 0 ? '604' : '700')
              const formattedPrice = String(rawPrice).replace(/[^0-9.]/g, '') || (idx === 0 ? '604' : '700')

              const rawDiscount = deal.discount || deal.discountPercentage || '60'
              const numDiscount = String(rawDiscount).replace(/[^0-9]/g, '') || '60'
              const discountPillText = `Save ${numDiscount}%off`

              const title = deal.title || deal.name || 'Milton Rapid Electric Kettle 1.8L | 1500 Watts | Stainless Steel Hot Water portable...'

              return (
                <div key={deal.id || `trending-deal-${idx}`} className="trending-deals__item-wrapper">
                  {/* Product Card */}
                  <a
                    onClick={() => adminApi.trackDealClick(deal.id)}
                    href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                    className="trending-deals__card"
                    aria-label={`View #${rank} ${title}`}
                  >
                    {/* Outer Grey Frame enclosing Inner Split Card */}
                    <div className="trending-deals__inner-card">
                      {/* Overlapping Discount Pill Badge centered across partition line */}
                      <div className="trending-deals__discount-pill" aria-label={discountPillText}>
                        {discountPillText}
                      </div>

                      {/* Left Column: Edge-to-edge filled product image */}
                      <div className="trending-deals__media">
                        <img
                          src={imageSrc}
                          alt={title}
                          className="trending-deals__product-img"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.src = 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg'
                          }}
                        />
                      </div>

                      {/* Right Column: Silver/Light-Grey Background for Description & Info */}
                      <div className="trending-deals__details">
                        <div className="trending-deals__store-row">
                          <img
                            src={storeLogoSrc}
                            alt={storeName}
                            className="trending-deals__store-logo"
                            onError={(e) => {
                              const target = e.currentTarget
                              target.src = getStoreLogo('Amazon')
                            }}
                          />
                        </div>
                        <h3 className="trending-deals__deal-title" title={title}>
                          {title}
                        </h3>
                        <div className="trending-deals__price-wrapper">
                          <span className="trending-deals__price">₹{formattedPrice}</span>
                        </div>
                        <div className="trending-deals__cta-wrapper">
                          <span className="trending-deals__view-btn">View&gt;&gt;</span>
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Rank Badge */}
                  <div
                    className="trending-deals__rank-badge"
                    aria-hidden="true"
                  >
                    #{rank}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrendingDealsSection

