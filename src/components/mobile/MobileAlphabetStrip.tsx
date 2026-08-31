import React, { useState, useEffect, useRef, useMemo } from 'react'
import styles from './MobileAlphabetStrip.module.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface MobileAlphabetStripProps {
  activeLetter?: string | null
  onSelectLetter?: (letter: string) => void
  availableLetters?: Set<string> | string[]
}

export const MobileAlphabetStrip: React.FC<MobileAlphabetStripProps> = ({
  activeLetter: controlledActiveLetter,
  onSelectLetter,
  availableLetters,
}) => {
  const [internalActiveLetter, setInternalActiveLetter] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeLetter = controlledActiveLetter !== undefined ? controlledActiveLetter : internalActiveLetter

  const availableSet = useMemo(() => {
    if (!availableLetters) return null
    if (availableLetters instanceof Set) return availableLetters
    return new Set(availableLetters.map((l) => l.toUpperCase()))
  }, [availableLetters])

  // Exact entrance expansion animation identical to Stores page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const letter = entry.target.getAttribute('data-letter')
            if (letter) {
              setInternalActiveLetter(letter)
            }
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      }
    )

    ALPHABET.forEach((letter) => {
      const el = document.getElementById(`letter-group-${letter}`)
      if (el) {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  const handleLetterClick = (letter: string) => {
    if (availableSet && !availableSet.has(letter)) return

    const newActive = activeLetter === letter ? null : letter
    setInternalActiveLetter(newActive)
    onSelectLetter?.(newActive || '')

    if (newActive) {
      const target = document.getElementById(`letter-group-${letter}`)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className={styles.stripWrapper} role="region" aria-label="Alphabet navigation">
      <div
        ref={scrollRef}
        className={styles.stripScroll}
        aria-label="Alphabet letter strip"
      >
        <div className={styles.stripTrack}>
          {ALPHABET.map((letter, index) => {
            const isActive = activeLetter?.toUpperCase() === letter
            const isAvailable = availableSet ? availableSet.has(letter) : true

            return (
              <button
                key={letter}
                type="button"
                className={`${styles.alphabetBtn} ${isActive ? styles.alphabetBtnActive : ''} ${!isAvailable ? styles.alphabetBtnDisabled : ''}`}
                onClick={() => handleLetterClick(letter)}
                disabled={!isAvailable}
                aria-label={`Filter by ${letter}`}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  transform: isExpanded ? 'none' : `translateX(${index * -36}px)`,
                  transitionDelay: `${index * 20}ms`,
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

export default MobileAlphabetStrip
