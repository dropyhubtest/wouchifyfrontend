import React, { useState, useEffect } from 'react'
import { getPublicLootDeals } from '../../services/api'
import { FLASH_LOOT_DEALS } from '../../data/flashLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import './FlashLootSection.css'

export const FlashLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(FLASH_LOOT_DEALS)

  useEffect(() => { 
    getPublicLootDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.type === 'flash' || d.dealType === 'flash' || d.lootType === 'flash' || d.isFlash)
        )
        if (filtered.length > 0) {
          const merged = filtered.map((d: any, idx: number) => {
            const staticItem = FLASH_LOOT_DEALS.find(fd => fd.slug === d.slug || fd.id === d.id || (d.title && fd.title.toLowerCase().includes(d.title.toLowerCase().slice(0, 15)))) || FLASH_LOOT_DEALS[idx % FLASH_LOOT_DEALS.length]
            return {
              ...staticItem,
              ...d,
              image: (d.image && (d.image.startsWith('http') || d.image.startsWith('data:') || d.image.startsWith('/'))) ? d.image : staticItem.image,
              storeLogo: (d.storeLogo && (d.storeLogo.startsWith('http') || d.storeLogo.startsWith('data:') || d.storeLogo.startsWith('/'))) ? d.storeLogo : staticItem.storeLogo,
              title: d.title || d.name || staticItem.title,
              category: d.category || staticItem.category,
              currentPrice: d.currentPrice ?? d.price ?? d.dealPrice ?? staticItem.currentPrice,
              originalPrice: d.originalPrice ?? d.mrp ?? staticItem.originalPrice,
              discount: d.discount ?? d.discountPercentage ?? staticItem.discount
            }
          })
          setDeals(merged.slice(0, 4))
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

        {/* Flash Deals Track / Container */}
        <div className="flash-loot__track">
          {deals.map((deal, idx) => {
            const rawImg = deal.image || deal.imageUrl || deal.thumbnail
            const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/'))) 
              ? rawImg 
              : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
            
            const rawStoreLogo = deal.storeLogo || deal.logoUrl
            const storeLogoSrc = (rawStoreLogo && (rawStoreLogo.startsWith('http') || rawStoreLogo.startsWith('data:') || rawStoreLogo.startsWith('/')))
              ? rawStoreLogo
              : getStoreLogo(deal.store || deal.storeName || 'Amazon')

            const rawPrice = deal.currentPrice ?? deal.price ?? deal.dealPrice ?? '499'
            const formattedPrice = String(rawPrice).replace(/[^0-9.]/g, '') || '499'

            const rawOrigPrice = deal.originalPrice ?? deal.mrp
            const formattedOrig = rawOrigPrice ? (String(rawOrigPrice).startsWith('₹') ? String(rawOrigPrice) : `₹${rawOrigPrice}`) : ''

            const rawDiscount = deal.discount || deal.discountPercentage || '50%'
            const formattedDiscount = String(rawDiscount).includes('%') ? String(rawDiscount) : `${rawDiscount}%`

            return (
              <a
                key={deal.id || `flash-loot-${idx}`}
                onClick={() => adminApi.trackLootClick(deal.id)}
                href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                className="flash-loot__card"
                aria-label={`View ${deal.title || deal.name} flash deal`}
              >
                {/* Left Image Area */}
                <div className="flash-loot__media">
                  <img
                    src={imageSrc}
                    alt={deal.title || deal.name || 'Flash Deal'}
                    className="flash-loot__product-img"
                    width="300"
                    height="297"
                    onError={(e) => {
                      const target = e.currentTarget
                      const fallback = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
                      if (target.src !== fallback) {
                        target.src = fallback
                      }
                    }}
                  />
                  <div className="flash-loot__discount-badge" aria-label={`${formattedDiscount} off`}>
                    <span className="flash-loot__discount-val">{formattedDiscount}</span>
                    <span className="flash-loot__discount-txt">off!</span>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="flash-loot__details">
                  <div className="flash-loot__store-row">
                    <img
                      src={storeLogoSrc}
                      alt={deal.store || deal.storeName || 'Store'}
                      className="flash-loot__store-logo"
                      onError={(e) => {
                        const target = e.currentTarget
                        const fallback = getStoreLogo('Amazon')
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                  </div>
                  <h3 className="flash-loot__card-title">{deal.title || deal.name}</h3>
                  <div className="flash-loot__tag-row">
                    <span className="flash-loot__tag">{deal.category || 'Deals'}</span>
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
    </section>
  )
}

export default FlashLootSection
