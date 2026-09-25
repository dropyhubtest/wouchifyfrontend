import React from 'react'
import rewardTicketIcon from '../../assets/brands/reward-ticket-w.png'
import type { BrandRewardItem } from '../../data/popularBrands'
import { getStoreLogo } from '../../data/dealsPage'
import { adminApi } from '../../services/adminApi'
import './BrandRewardCard.css'

interface BrandRewardCardProps {
  brand: BrandRewardItem
}

export const BrandRewardCard: React.FC<BrandRewardCardProps> = ({ brand }) => {
  const handleClick = () => {
    adminApi.trackStoreClick(brand.name).catch(() => {})
  }
  const logoStyle: React.CSSProperties = brand.logoFrame
    ? {
        position: 'absolute',
        left: `${brand.logoFrame.x - 21}px`,
        top: `${brand.logoFrame.y - 90}px`,
        width: `${brand.logoFrame.width}px`,
        height: `${brand.logoFrame.height}px`,
        objectFit: 'contain',
        display: 'block',
      }
    : {
        maxWidth: '82%',
        maxHeight: '70%',
        objectFit: 'contain',
        display: 'block',
      }

  const cardCustomStyle = {
    '--percentage-x': `${brand.percentageX ?? 138}px`,
    '--reward-label-x': `${brand.rewardLabelX ?? 227}px`,
  } as React.CSSProperties

  const logoPanelStyle: React.CSSProperties = brand.logoBgColor
    ? { backgroundColor: brand.logoBgColor }
    : {}

  // Cleanly parse dynamic cashback strings (e.g. "Upto 5% rewards", "8% cashback", "15%")
  const rawReward = (brand.rewardValue || '').trim()
  const rawLabel = (brand.rewardLabel || '').trim()

  let hasUpTo = true
  let cleanValue = rawReward
  let cleanLabel = rawLabel

  if (rawReward.toLowerCase().includes('upto') || rawReward.toLowerCase().includes('up to')) {
    hasUpTo = true
    cleanValue = rawReward.replace(/up\s*to/gi, '').trim()
  }

  // If cleanValue ends with words like 'rewards' or 'cashback', extract it as the label
  if (/rewards?$/i.test(cleanValue)) {
    cleanLabel = cleanLabel || 'REWARDS'
    cleanValue = cleanValue.replace(/rewards?$/i, '').trim()
  } else if (/cashbacks?$/i.test(cleanValue)) {
    cleanLabel = cleanLabel || 'CASHBACK'
    cleanValue = cleanValue.replace(/cashbacks?$/i, '').trim()
  }

  return (
    <a
      className="brand-reward-card"
      href={brand.href}
      onClick={handleClick}
      aria-label={`View ${brand.name} offers`}
      style={cardCustomStyle}
    >
      <div className="brand-reward-card__design">
        {/* 1. Upper Right Circular Discount Badge (left: 235px, top: 18px, 116 x 96) */}
        <div className="brand-card__discount-badge" aria-label={`${brand.discount}% off`}>
          <span className="brand-card__discount-number">{brand.discount}%</span>
          <span className="brand-card__discount-text">off</span>
        </div>

        {/* 2. White Logo Panel (left: 21px, top: 90px, 355 x 165, overflow: hidden) */}
        <div className="brand-card__logo-panel" style={logoPanelStyle}>
          <img
            src={brand.logoSrc || getStoreLogo(brand.name)}
            alt={`${brand.name} logo`}
            className="brand-card__logo-image"
            style={logoStyle}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget
              const fallback = getStoreLogo(brand.name)
              if (target.src !== fallback) {
                target.src = fallback
              }
            }}
          />
        </div>

        {/* 3. Navy Reward Strip (left: 0px, top: 276px, 355 x 122) */}
        <div className="brand-card__reward-strip" aria-hidden="true" />

        {/* 4. Exact Figma Reward Strip Decorative Lines */}
        <span className="brand-card__reward-line brand-card__reward-line--top" aria-hidden="true" />
        <span className="brand-card__reward-line brand-card__reward-line--bottom" aria-hidden="true" />

        {/* 5. White Reward Circle (left: 31px, top: 291px, 92 x 92) */}
        <div className="brand-card__reward-circle" aria-hidden="true">
          {/* Reward Ticket (left: 41px, top: 320px, 71 x 42) */}
          <img
            src={rewardTicketIcon}
            alt=""
            className="brand-card__reward-ticket"
            width="71"
            height="42"
          />
        </div>

        {/* 6. Clean Reward Copy Area */}
        <div className="brand-card__reward-content">
          {hasUpTo && <div className="brand-card__reward-upto">UP TO</div>}
          <div className="brand-card__reward-row">
            <span className="brand-card__reward-value">{cleanValue}</span>
            {cleanLabel && <span className="brand-card__reward-label">{cleanLabel}</span>}
          </div>
        </div>
      </div>
    </a>
  )
}

export default BrandRewardCard
