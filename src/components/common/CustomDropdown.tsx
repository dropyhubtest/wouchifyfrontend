import React, { useState, useRef, useEffect, useCallback } from 'react'
import './CustomDropdown.css'

export interface DropdownOption {
  value: string
  label: string
  badge?: string | number
  icon?: React.ReactNode
}

export interface CustomDropdownProps {
  options: (string | DropdownOption)[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  variant?: 'admin' | 'storefront' | 'pill'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  id?: string
  ariaLabel?: string
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  className = '',
  variant = 'admin',
  size = 'md',
  disabled = false,
  id,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)

  // Normalize options to DropdownOption objects
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return

      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          onChange(normalizedOptions[highlightedIndex].value)
          setIsOpen(false)
        } else {
          setIsOpen((prev) => !prev)
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(0)
        } else {
          setHighlightedIndex((prev) => (prev + 1) % normalizedOptions.length)
        }
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(normalizedOptions.length - 1)
        } else {
          setHighlightedIndex((prev) => (prev - 1 + normalizedOptions.length) % normalizedOptions.length)
        }
        return
      }
    },
    [disabled, isOpen, highlightedIndex, normalizedOptions, onChange]
  )

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown custom-dropdown--${variant} custom-dropdown--${size} ${
        isOpen ? 'custom-dropdown--open' : ''
      } ${disabled ? 'custom-dropdown--disabled' : ''} ${className}`}
      onKeyDown={handleKeyDown}
      id={id}
    >
      {label && <label className="custom-dropdown__label">{label}</label>}

      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        disabled={disabled}
      >
        <span className="custom-dropdown__selected-content">
          {selectedOption?.icon && (
            <span className="custom-dropdown__selected-icon">{selectedOption.icon}</span>
          )}
          <span className="custom-dropdown__selected-text">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="custom-dropdown__arrow" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="custom-dropdown__menu-wrapper">
          <ul
            ref={listboxRef}
            className="custom-dropdown__menu"
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={
              highlightedIndex >= 0 ? `option-${normalizedOptions[highlightedIndex]?.value}` : undefined
            }
          >
            {normalizedOptions.map((option, idx) => {
              const isSelected = option.value === value
              const isHighlighted = idx === highlightedIndex

              return (
                <li
                  key={option.value}
                  id={`option-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-dropdown__item ${
                    isSelected ? 'custom-dropdown__item--selected' : ''
                  } ${isHighlighted ? 'custom-dropdown__item--highlighted' : ''}`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <span className="custom-dropdown__item-content">
                    {option.icon && (
                      <span className="custom-dropdown__item-icon">{option.icon}</span>
                    )}
                    <span className="custom-dropdown__item-label">{option.label}</span>
                  </span>

                  <span className="custom-dropdown__item-right">
                    {option.badge !== undefined && (
                      <span className="custom-dropdown__item-badge">{option.badge}</span>
                    )}
                    {isSelected && (
                      <span className="custom-dropdown__checkmark" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
