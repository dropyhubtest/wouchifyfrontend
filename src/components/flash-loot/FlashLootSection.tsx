import React, { useState, useEffect } from 'react'
import { getPublicLootDeals } from '../../services/api'
import { FLASH_LOOT_DEALS } from '../../data/flashLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import { filterFlashLootDeals } from '../../utils/homepageSectionFilters'
import './FlashLootSection.css'

export const FlashLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(FLASH_LOOT_DEALS)

  useEffect(() => { 
    getPublicLootDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = filterFlashLootDeals(data)
        if (filtered.length > 0) {
          const list = [...filtered]
          while (list.length < 3 && list.length < FLASH_LOOT_DEALS.length) {
            list.push(FLASH_LOOT_DEALS[list.length])
          }
          setDeals(list)
        }
      } 
    }).catch(console.warn)
  }, [])

  return (
    <section
      className="flash-loot-section"
      aria-label="Flash Loot Deals"
      style={
        {
          '--flash-scale': sectionScale,
          height: `${574 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 574 Reference Canvas */}
      <div className="flash-loot-canvas">
        {/* Section Header with Red Accent */}
        <div className="flash-loot__header">
          <div className="flash-loot__heading-accent" aria-hidden="true" />
          <h2 className="flash-loot__title">Flash Loot Deals</h2>
        </div>

        {/* Urgent Deal Label Pill */}
        <div className="flash-loot__urgent-pill" aria-label="Grab Before Gone!!">
          Grab Before Gone!!
        </div>

        {/* Latest Deals CTA */}
        <a href="/deals?type=flash" className="flash-loot__cta">
          Latest Deals&gt;&gt;
        </a>

        {/* Flash Deals Viewport & Track */}
        <div className="flash-loot__viewport">
          <div className="flash-loot__track">
            {deals.map((deal, idx) => {
              const rawImg = deal.productImage || deal.image || deal.imageUrl || deal.thumbnail
              const fallbackStatic = FLASH_LOOT_DEALS[idx % FLASH_LOOT_DEALS.length]
              const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/'))) 
                ? rawImg 
                : (fallbackStatic?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80')
              
              const storeName = deal.store || deal.storeName || deal.merchant || 'Amazon'
              const rawStoreLogo = deal.storeLogo || deal.logoUrl
              const storeLogoSrc = (rawStoreLogo && (rawStoreLogo.startsWith('http') || rawStoreLogo.startsWith('data:') || rawStoreLogo.startsWith('/')))
                ? rawStoreLogo
                : getStoreLogo(storeName)

              const rawPrice = deal.currentPrice ?? deal.price ?? deal.dealPrice ?? '179'
              const formattedPrice = String(rawPrice).replace(/[^0-9.]/g, '') || '179'

              const rawOrigPrice = deal.originalPrice ?? deal.mrp
              const formattedOrig = rawOrigPrice ? (String(rawOrigPrice).startsWith('₹') ? String(rawOrigPrice) : `₹${String(rawOrigPrice).replace(/[^0-9.]/g, '')}`) : ''

              const rawDiscount = deal.discount || deal.discountPercentage || '91'
              const numDiscount = String(rawDiscount).replace(/[^0-9]/g, '') || '91'

              const title = deal.title || deal.name || 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture'
              const categoryName = deal.category || deal.subCategory || 'Electronics'

              return (
                <a
                  key={deal.id || deal._id || `flash-loot-${idx}`}
                  onClick={() => adminApi.trackLootClick(deal.id || deal._id)}
                  href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || deal._id || ''}`}
                  className="flash-loot__card"
                  aria-label={`View ${title} flash deal`}
                >
                  {/* Left Image Area */}
                  <div className="flash-loot__media">
                    <img
                      src={imageSrc}
                      alt={title}
                      className="flash-loot__product-img"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.onerror = null
                        const fallback = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                    <div className="flash-loot__discount-badge" aria-label={`${numDiscount}% off`}>
                      <span className="flash-loot__discount-val">{numDiscount}%</span>
                      <span className="flash-loot__discount-txt">off!</span>
                    </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="flash-loot__details">
                    <div className="flash-loot__store-row">
                      <img
                        src={storeLogoSrc}
                        alt={storeName}
                        className="flash-loot__store-logo"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.onerror = null
                          target.src = getStoreLogo('Amazon')
                        }}
                      />
                    </div>
                    <h3 className="flash-loot__card-title" title={title}>{title}</h3>
                    <div className="flash-loot__tag-row">
                      <span className="flash-loot__tag">{categoryName}</span>
                    </div>
                    <div className="flash-loot__bottom-row">
                      <div className="flash-loot__price-group">
                        <span className="flash-loot__price">₹{formattedPrice}</span>
                        {formattedOrig && <span className="flash-loot__original-price">{formattedOrig}</span>}
                      </div>
                      <span className="flash-loot__grab-btn">Grab deal!!</span>
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

export default FlashLootSection
