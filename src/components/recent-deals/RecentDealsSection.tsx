import React, { useState, useEffect } from 'react'
import { getPublicDeals } from '../../services/api'
import { RECENT_DEALS } from '../../data/recentDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import { filterRecentlyAddedDeals } from '../../utils/homepageSectionFilters'
import './RecentDealsSection.css'

export const RecentDealsSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(RECENT_DEALS)

  useEffect(() => { 
    getPublicDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = filterRecentlyAddedDeals(data)
        if (filtered.length > 0) {
          const list = [...filtered]
          if (list.length === 1) {
            list.push(RECENT_DEALS[1])
          }
          setDeals(list)
        }
      } 
    }).catch(console.warn)
  }, [])

  return (
    <section
      className="recent-deals-section"
      aria-label="Recently added Deals"
      style={
        {
          '--recent-scale': sectionScale,
          height: `${482 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 482 Reference Canvas */}
      <div className="recent-deals-canvas">
        {/* Section Header with Navy Accent Circle */}
        <div className="recent-deals__header">
          <div className="recent-deals__heading-accent" aria-hidden="true" />
          <h2 className="recent-deals__title">Recently added Deals</h2>
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals" className="recent-deals__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Deal Cards Scroll Viewport & Track */}
        <div className="recent-deals__viewport">
          <div className="recent-deals__track">
            {deals.map((deal, idx) => {
              const rawImg = deal.productImage || deal.image || deal.imageUrl || deal.thumbnail
              const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/')) && !rawImg.includes('banner_1') && !rawImg.includes('banner_2'))
                ? rawImg 
                : (idx === 0 
                    ? 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg' 
                    : 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg')

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
                <a
                  key={deal.id || `recent-deal-${idx}`}
                  onClick={() => adminApi.trackDealClick(deal.id)}
                  href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                  className="recent-deals__card"
                  aria-label={`View ${title}`}
                >
                  {/* Outer Grey Frame enclosing Inner Split Card */}
                  <div className="recent-deals__inner-card">
                    {/* Overlapping Discount Pill Badge centered across partition line */}
                    <div className="recent-deals__discount-pill" aria-label={discountPillText}>
                      {discountPillText}
                    </div>

                    {/* Left Column: Edge-to-edge filled product image */}
                    <div className="recent-deals__media">
                      <img
                        src={imageSrc}
                        alt={title}
                        className="recent-deals__product-img"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.src = 'https://m.media-amazon.com/images/I/51Q15648oYL._SL1000_.jpg'
                        }}
                      />
                    </div>

                    {/* Right Column: Silver/Light-Grey Background for Description & Info */}
                    <div className="recent-deals__details">
                      <div className="recent-deals__store-row">
                        <img
                          src={storeLogoSrc}
                          alt={storeName}
                          className="recent-deals__store-logo"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.src = getStoreLogo('Amazon')
                          }}
                        />
                      </div>
                      <h3 className="recent-deals__deal-title" title={title}>
                        {title}
                      </h3>
                      <div className="recent-deals__price-wrapper">
                        <span className="recent-deals__price">₹{formattedPrice}</span>
                      </div>
                      <div className="recent-deals__cta-wrapper">
                        <span className="recent-deals__view-btn">View&gt;&gt;</span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentDealsSection
