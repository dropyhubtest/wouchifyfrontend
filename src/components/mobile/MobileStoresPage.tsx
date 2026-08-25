import React, { useState, useMemo, useEffect, useRef } from 'react'
import { MobileHeader } from './MobileHeader'
import { MobileFooter } from './MobileFooter'
import { FAVOURITE_STORES } from '../../data/storesHero'
import type { StoreItem } from '../../data/storesHero'
import searchIcon from '../../assets/icons/search.svg'
import './MobileStoresPage.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface AlphabetAnimationProps {
  onSelectLetter?: (letter: string) => void;
  selectedLetter?: string;
}

const AlphabetAnimation: React.FC<AlphabetAnimationProps> = ({ onSelectLetter, selectedLetter }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mobile-stores__alphabet-wrapper">
      <div 
        ref={scrollRef}
        className="mobile-stores__alphabet-scroll" 
        aria-label="Filter stores by letter"
      >
        <div className={`mobile-stores__alphabet-track ${isExpanded ? 'mobile-stores__alphabet-track--expanded' : ''}`}>
          {ALPHABET.map((letter, index) => {
            const isSelected = selectedLetter === letter;
            return (
              <button 
                key={letter}
                type="button" 
                className={`mobile-stores__alphabet-btn ${isSelected ? 'mobile-stores__alphabet-btn--active' : ''}`}
                onClick={() => onSelectLetter?.(isSelected ? '' : letter)}
                aria-label={`Filter by ${letter}`}
                style={{
                  transform: isExpanded ? 'none' : `translateX(${index * -36}px)`,
                  transitionDelay: `${index * 20}ms`
                }}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const MobileStoresPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('')

  const filteredStores = useMemo(() => {
    return FAVOURITE_STORES.filter(store => {
      const matchesQuery = store.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLetter = selectedLetter ? store.name.toUpperCase().startsWith(selectedLetter) : true
      return matchesQuery && matchesLetter
    })
  }, [searchQuery, selectedLetter])

  return (
    <div className="mobile-stores-page">
      <MobileHeader />
      
      <div className="mobile-stores__search-container">
        <input 
          type="text" 
          className="mobile-stores__search-input"
          placeholder="Search your Favourite Stores"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mobile-stores__search-icon">
          <img src={searchIcon} alt="" className="mobile-stores__search-icon-img" />
        </div>
      </div>

      <div className="mobile-stores__heading-section">
        <div className="mobile-stores__heading-ellipse"></div>
        <h2 className="mobile-stores__heading">Most Popular Brands</h2>
      </div>

      <AlphabetAnimation 
        selectedLetter={selectedLetter} 
        onSelectLetter={setSelectedLetter} 
      />

      <div className="mobile-stores__grid">
        {filteredStores.length > 0 ? (
          filteredStores.map(store => (
            <StoreCard key={store.id} store={store} />
          ))
        ) : (
          <div className="mobile-stores__no-results">No stores found</div>
        )}
      </div>

      <MobileFooter />
    </div>
  )
}

const StoreCard: React.FC<{ store: StoreItem }> = ({ store }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mobile-stores__card-wrap--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const category = store.mobileCategory || store.category
  const reward = store.mobileReward || store.reward
  const description = store.mobileDescription || store.description
  const badgeBg = store.mobileBadgeBg || store.badgeBg

  const isLongName = store.name.length > 12

  return (
    <div className="mobile-stores__card-wrap" ref={cardRef}>
      <div 
        className="mobile-stores__card" 
        style={{ backgroundColor: store.cardBg }}
      >
        <div className="mobile-stores__card-logo-container">
          <img 
            src={store.logo} 
            alt={store.name} 
            className="mobile-stores__card-logo"
            style={
              store.mobileLogoWidth && store.mobileLogoHeight
                ? { width: `${store.mobileLogoWidth}px`, height: `${store.mobileLogoHeight}px`, objectFit: 'contain' }
                : undefined
            }
          />
        </div>
        
        <div className="mobile-stores__card-category">{category}</div>
        <div className={`mobile-stores__card-name ${isLongName ? 'mobile-stores__card-name--long' : ''}`}>
          {store.name}
        </div>
        
        <div 
          className="mobile-stores__card-badge"
          style={{ backgroundColor: badgeBg }}
        >
          {reward}
        </div>
        
        <div className="mobile-stores__card-desc">{description}</div>
        
        <button className="mobile-stores__card-btn">
          View Details &gt;&gt;
        </button>
      </div>
    </div>
  )
}
