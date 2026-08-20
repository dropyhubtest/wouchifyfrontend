import React, { useState, useEffect } from 'react'
import heroWomanTransparent from '../../assets/hero/hero-woman-transparent.png'
import heroManTransparent from '../../assets/hero/hero-man-transparent.png'
import './HeroVisual.css'

export const HeroVisual: React.FC = () => {
  // isManState: false (woman visible) | true (man visible)
  const [isManState, setIsManState] = useState<boolean>(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let isMounted = true
    let intervalId: ReturnType<typeof setInterval> | null = null

    // Initial 2000ms delay before first slide to man
    const initialTimer = setTimeout(() => {
      if (!isMounted) return
      setIsManState(true)

      // Continuous loop toggling every 2500ms (2000ms hold + 500ms transition)
      intervalId = setInterval(() => {
        if (!isMounted) return
        setIsManState((prev) => !prev)
      }, 2500)
    }, 2000)

    return () => {
      isMounted = false
      clearTimeout(initialTimer)
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="hero-visual" aria-hidden="true">
      {/* Exactly One Fixed Shared Red Circle */}
      <div className="hero-red-circle" />

      {/* Moving Horizontal Image Track */}
      <div className={`hero-person-track ${isManState ? 'is-man' : ''}`}>
        {/* Woman Transparent Image: left: 0 */}
        <img
          src={heroWomanTransparent}
          alt=""
          className="hero-person-image woman-image"
          width="778"
          height="969"
        />

        {/* Man Transparent Image: left: 814px */}
        <img
          src={heroManTransparent}
          alt=""
          className="hero-person-image man-image"
          width="850"
          height="969"
        />
      </div>
    </div>
  )
}

export default HeroVisual
