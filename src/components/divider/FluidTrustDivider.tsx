import React, { useState, useEffect, useRef } from 'react'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './FluidTrustDivider.css'

interface TrustBenefit {
  id: string
  title: string
  subtitle: string
  titleStyle: {
    left: string
    top: string
    width: string
  }
  subtitleStyle: {
    left: string
    top: string
    width: string
  }
}

const TRUST_BENEFITS: TrustBenefit[] = [
  {
    id: 'verified',
    title: 'Verified & Secure',
    subtitle: 'Strict Security Protocols',
    titleStyle: { left: '97px', top: '73px', width: '396px' },
    subtitleStyle: { left: '137px', top: '141px', width: '234px' },
  },
  {
    id: 'live-hourly',
    title: 'Live Every Hour',
    subtitle: 'Strict Security Protocols',
    titleStyle: { left: '766px', top: '73px', width: '349px' },
    subtitleStyle: { left: '843px', top: '141px', width: '234px' },
  },
  {
    id: 'community',
    title: '50K+ Community',
    subtitle: 'Strict Security Protocols',
    titleStyle: { left: '1388px', top: '73px', width: '407px' },
    subtitleStyle: { left: '1475px', top: '141px', width: '234px' },
  },
]

export const FluidTrustDivider: React.FC = () => {
  const dividerScale = useDesktopScale()
  const [isActivated, setIsActivated] = useState<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentSection = sectionRef.current
    if (!currentSection) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setIsActivated(false)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            setIsActivated(true)
          } else if (!entry.isIntersecting) {
            setIsActivated(false)
          }
        })
      },
      {
        threshold: [0, 0.35],
      }
    )

    observer.observe(currentSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`fluid-trust-divider ${isActivated ? 'is-activated' : ''}`}
      aria-label="Wouchify trust benefits"
      style={
        {
          '--divider-scale': dividerScale,
          height: `${301 * dividerScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 301 Reference Canvas */}
      <div className="fluid-trust-divider__canvas">
        {/* Blue Fluid Wave Band (Inline SVG with Transform Morph, z-index: 1) */}
        <div className="fluid-trust-divider__band" aria-hidden="true">
          <svg
            className="fluid-trust-divider__wave-svg"
            viewBox="0 0 1920 208"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g className={isActivated ? 'fluid-wave-shape is-active' : 'fluid-wave-shape'}>
              <path
                d="M 0 133.25 L 0 390 L 1920 390 L 1920 0 C 1920 0 1506.79 156.49 1190.98 157.63 C 913.82 158.62 807.47 35.57 530.53 40.63 C 308.49 44.67 0 133.25 0 133.25"
                fill="#2A3189"
              />
            </g>
          </svg>
        </div>

        {/* Overlay Trust Content (White Text, z-index: 2, naturally revealed as navy wave rises) */}
        <div className="fluid-trust-divider__content">
          {TRUST_BENEFITS.map((benefit) => (
            <React.Fragment key={benefit.id}>
              <h2
                className="fluid-trust-title"
                style={{
                  left: benefit.titleStyle.left,
                  top: benefit.titleStyle.top,
                  width: benefit.titleStyle.width,
                }}
              >
                {benefit.title}
              </h2>
              <p
                className="fluid-trust-subtitle"
                style={{
                  left: benefit.subtitleStyle.left,
                  top: benefit.subtitleStyle.top,
                  width: benefit.subtitleStyle.width,
                }}
              >
                {benefit.subtitle}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FluidTrustDivider
