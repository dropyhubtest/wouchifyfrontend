import React from 'react'
import { TRENDING_BANKS } from '../../data/banksDirectoryData'
import type { TrendingBank } from '../../data/banksDirectoryData'
import './TrendingBanksRow.css'

interface TrendingBanksRowProps {
  onBankClick?: (bank: TrendingBank) => void
}

export const TrendingBanksRow: React.FC<TrendingBanksRowProps> = ({ onBankClick }) => {
  return (
    <section className="trending-banks-section" aria-label="Trending Banks">
      <div className="trending-banks-row">
        {TRENDING_BANKS.map((bank) => (
          <a
            key={bank.id}
            href={bank.href}
            className="trending-bank-card"
            onClick={(e) => {
              if (onBankClick) {
                e.preventDefault()
                onBankClick(bank)
              }
            }}
            title={bank.name}
          >
            <div className="trending-bank-card__logo-wrap">
              {bank.logo ? (
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="trending-bank-card__logo"
                  loading="lazy"
                />
              ) : null}
            </div>

            <span className="trending-bank-card__title">{bank.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default TrendingBanksRow
