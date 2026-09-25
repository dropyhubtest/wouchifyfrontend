import React, { useState, useEffect } from 'react'
import { getPublicLootDeals } from '../../services/api'
import { EXCLUSIVE_LOOT_DEALS } from '../../data/exclusiveLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import { filterExclusiveLootDeals } from '../../utils/homepageSectionFilters'
import './ExclusiveLootSection.css'

export const ExclusiveLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(EXCLUSIVE_LOOT_DEALS)

  useEffect(() => { 
    getPublicLootDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = filterExclusiveLootDeals(data)
        if (filtered.length > 0) {
          const list = [...filtered]
          while (list.length < 3 && list.length < EXCLUSIVE_LOOT_DEALS.length) {
            list.push(EXCLUSIVE_LOOT_DEALS[list.length])
          }
          setDeals(list)
        }
      } 
    }).catch(console.warn)
  }, [])

  return (
    <section
      className="exclusive-loot-section"
      aria-label="Exclusive Loot Deals"
      style={
        {
          '--exclusive-scale': sectionScale,
          height: `${508 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 508 Reference Canvas */}
      <div className="exclusive-loot-canvas">
        {/* Section Header with Red Accent */}
        <div className="exclusive-loot__header">
          <div className="exclusive-loot__heading-accent" aria-hidden="true" />
          <h2 className="exclusive-loot__title">Exclusive Loot Deals</h2>
        </div>

        {/* Members Only Label Pill */}
        <div className="exclusive-loot__members-pill" aria-label="Members Only!!">
          Members Only!!
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals?type=exclusive" className="exclusive-loot__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Exclusive Deals Viewport & Track */}
        <div className="exclusive-loot__viewport">
          <div className="exclusive-loot__track">
            {deals.map((deal, idx) => {
              const rawImg = deal.productImage || deal.image || deal.imageUrl || deal.thumbnail
              const fallbackStatic = EXCLUSIVE_LOOT_DEALS[idx % EXCLUSIVE_LOOT_DEALS.length]
              const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/'))) 
                ? rawImg 
                : (fallbackStatic?.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80')
              
              const storeName = deal.store || deal.storeName || deal.merchant || 'Amazon'
              const rawStoreLogo = deal.storeLogo || deal.logoUrl
              const storeLogoSrc = (rawStoreLogo && (rawStoreLogo.startsWith('http') || rawStoreLogo.startsWith('data:') || rawStoreLogo.startsWith('/')))
                ? rawStoreLogo
                : getStoreLogo(storeName)

              const rawPrice = deal.currentPrice ?? deal.price ?? deal.dealPrice ?? '799'
              const formattedPrice = String(rawPrice).replace(/[^0-9.]/g, '') || '799'

              const rawOrigPrice = deal.originalPrice ?? deal.mrp
              const formattedOrig = rawOrigPrice ? (String(rawOrigPrice).startsWith('₹') ? String(rawOrigPrice) : `₹${String(rawOrigPrice).replace(/[^0-9.]/g, '')}`) : ''

              const rawDiscount = deal.discount || deal.discountPercentage || '60'
              const numDiscount = String(rawDiscount).replace(/[^0-9]/g, '') || '60'

              const title = deal.title || deal.name || 'Noise Pulse 2 Max 1.85" Display Bluetooth Calling Smart Watch'
              const categoryName = deal.category || deal.subCategory || 'Exclusive'

              return (
                <a 
                  key={deal.id || deal._id || `exclusive-loot-${idx}`}
                  onClick={() => adminApi.trackLootClick(deal.id || deal._id)}
                  href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || deal._id || ''}`}
                  className="exclusive-loot__card"
                  aria-label={`View ${title} exclusive deal`}
                >
                  {/* Left Image Area */}
                  <div className="exclusive-loot__media">
                    <img
                      src={imageSrc}
                      alt={title}
                      className="exclusive-loot__product-img"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget
                        const fallback = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                    <div className="exclusive-loot__discount-badge" aria-label={`${numDiscount}% off`}>
                      <span className="exclusive-loot__discount-val">{numDiscount}%</span>
                      <span className="exclusive-loot__discount-txt">off!</span>
                    </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="exclusive-loot__details">
                    <div className="exclusive-loot__store-row">
                      <img
                        src={storeLogoSrc}
                        alt={storeName}
                        className="exclusive-loot__store-logo"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.src = getStoreLogo('Amazon')
                        }}
                      />
                    </div>
                    <h3 className="exclusive-loot__card-title" title={title}>{title}</h3>
                    <div className="exclusive-loot__tag-row">
                      <span className="exclusive-loot__tag">{categoryName}</span>
                    </div>
                    <div className="exclusive-loot__bottom-row">
                      <div className="exclusive-loot__price-group">
                        <span className="exclusive-loot__price">₹{formattedPrice}</span>
                        {formattedOrig && <span className="exclusive-loot__original-price">{formattedOrig}</span>}
                      </div>
                      <span className="exclusive-loot__grab-btn">Grab deal!!</span>
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

export default ExclusiveLootSection
