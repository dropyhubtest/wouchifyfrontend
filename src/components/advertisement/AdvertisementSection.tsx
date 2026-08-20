import React from 'react'
import { ADVERTISEMENTS } from '../../data/advertisements'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import wouchifyWordmark from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import './AdvertisementSection.css'

export const AdvertisementSection: React.FC = () => {
  const sectionScale = useDesktopScale()

  return (
    <section
      className="advertisement-section"
      aria-label="Advertisement"
      style={
        {
          '--advertisement-scale': sectionScale,
          height: `${865 * sectionScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 865 Reference Canvas */}
      <div className="advertisement-canvas">
        {/* Section Header with Navy Accent */}
        <div className="advertisement__header">
          <div className="advertisement__heading-accent" aria-hidden="true" />
          <h2 className="advertisement__title">Advertisement</h2>
        </div>

        {/* Advertisement Banner Container */}
        <div className="advertisement__container">
          {ADVERTISEMENTS.map((ad) => (
            <a
              key={ad.id}
              href={ad.href}
              aria-label={ad.title}
              className="advertisement__banner-link"
            >
              <img
                className="advertisement__brand-logo"
                src={wouchifyWordmark}
                alt="Wouchify"
              />
              <img
                src={ad.image}
                alt={ad.alt}
                className="advertisement__banner-image"
                width="1713"
                height="685"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdvertisementSection
