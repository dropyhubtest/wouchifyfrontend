import React from 'react'
import './StoreSearch.css'

interface StoreSearchProps {
  value: string
  onChange: (value: string) => void
}

export const StoreSearch: React.FC<StoreSearchProps> = ({ value, onChange }) => {
  return (
    <div className="store-search">
      <input
        type="text"
        className="store-search__input"
        placeholder="Search your store"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search your store"
      />
      {/* Black search icon positioned on the right */}
      <svg
        className="store-search__icon"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default StoreSearch
