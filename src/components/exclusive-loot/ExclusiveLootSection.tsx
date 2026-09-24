import React, { useState, useEffect } from 'react'
import { getPublicLootDeals } from '../../services/api'
import { EXCLUSIVE_LOOT_DEALS } from '../../data/exclusiveLootDeals'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import { adminApi } from '../../services/adminApi'
import { getStoreLogo } from '../../data/dealsPage'
import './ExclusiveLootSection.css'

export const ExclusiveLootSection: React.FC = () => {
  const sectionScale = useDesktopScale()
  const [deals, setDeals] = useState<any[]>(EXCLUSIVE_LOOT_DEALS)

  useEffect(() => { 
    getPublicLootDeals().then(data => { 
      if (data && data.length > 0) {
        const filtered = data.filter((d: any) => 
          d.showOnHome !== false && 
          d.sectionPlacement !== 'none' && 
          (d.type === 'exclusive' || d.dealType === 'exclusive' || d.lootType === 'exclusive')
        )
        if (filtered.length > 0) {
          const merged = filtered.map((d: any, idx: number) => {
            const staticItem = EXCLUSIVE_LOOT_DEALS.find(ed => ed.slug === d.slug || ed.id === d.id || (d.title && ed.title.toLowerCase().includes(d.title.toLowerCase().slice(0, 15)))) || EXCLUSIVE_LOOT_DEALS[idx % EXCLUSIVE_LOOT_DEALS.length]
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

        {/* Exclusive Deals Track / Container */}
        <div className="exclusive-loot__track">
          {deals.map((deal, idx) => {
            const rawImg = deal.image || deal.imageUrl || deal.thumbnail
            const imageSrc = (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('data:') || rawImg.startsWith('/'))) 
              ? rawImg 
              : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
            
            const rawStoreLogo = deal.storeLogo || deal.logoUrl
            const storeLogoSrc = (rawStoreLogo && (rawStoreLogo.startsWith('http') || rawStoreLogo.startsWith('data:') || rawStoreLogo.startsWith('/')))
              ? rawStoreLogo
              : getStoreLogo(deal.store || deal.storeName || 'Amazon')

            const rawPrice = deal.currentPrice ?? deal.price ?? deal.dealPrice ?? '799'
            const formattedPrice = String(rawPrice).replace(/[^0-9.]/g, '') || '799'

            const rawOrigPrice = deal.originalPrice ?? deal.mrp
            const formattedOrig = rawOrigPrice ? (String(rawOrigPrice).startsWith('₹') ? String(rawOrigPrice) : `₹${rawOrigPrice}`) : ''

            const rawDiscount = deal.discount || deal.discountPercentage || '60%'
            const formattedDiscount = String(rawDiscount).includes('%') ? String(rawDiscount) : `${rawDiscount}%`

            return (
              <a 
                onClick={() => adminApi.trackLootClick(deal.id)}
                key={deal.id || `exclusive-loot-${idx}`}
                href={deal.ctaHref || deal.link || deal.href || `/deal/${deal.id || ''}`}
                className="exclusive-loot__card"
                aria-label={`View ${deal.title || deal.name} exclusive deal`}
              >
                {/* Left Image Area */}
                <div className="exclusive-loot__media">
                  <img
                    src={imageSrc}
                    alt={deal.title || deal.name || 'Exclusive Deal'}
                    className="exclusive-loot__product-img"
                    width="300"
                    height="296"
                    onError={(e) => {
                      const target = e.currentTarget
                      const fallback = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
                      if (target.src !== fallback) {
                        target.src = fallback
                      }
                    }}
                  />
                  <div className="exclusive-loot__discount-badge" aria-label={`${formattedDiscount} off`}>
                    <span className="exclusive-loot__discount-val">{formattedDiscount}</span>
                    <span className="exclusive-loot__discount-txt">off!</span>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="exclusive-loot__details">
                  <div className="exclusive-loot__store-row">
                    <img
                      src={storeLogoSrc}
                      alt={deal.store || deal.storeName || 'Store'}
                      className="exclusive-loot__store-logo"
                      onError={(e) => {
                        const target = e.currentTarget
                        const fallback = getStoreLogo('Amazon')
                        if (target.src !== fallback) {
                          target.src = fallback
                        }
                      }}
                    />
                  </div>
                  <h3 className="exclusive-loot__card-title">{deal.title || deal.name}</h3>
                  <div className="exclusive-loot__tag-row">
                    <span className="exclusive-loot__tag">{deal.category || 'Exclusive'}</span>
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
    </section>
  )
}

export default ExclusiveLootSection
