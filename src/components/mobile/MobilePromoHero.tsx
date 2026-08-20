import { mobilePromos } from '../../data/mobilePromos'
import './MobilePromoHero.css'

export const MobilePromoHero: React.FC = () => {
  const primaryPromo = mobilePromos[0]

  if (!primaryPromo) return null

  return (
    <section className="mobile-promo-hero" aria-label="Featured Mobile Promotion">
      <a
        href={primaryPromo.href}
        className="mobile-promo-banner"
        aria-label={primaryPromo.alt}
      >
        <img
          src={primaryPromo.image}
          alt={primaryPromo.alt}
          className="mobile-promo-banner__img"
        />
      </a>

      <div className="mobile-promo-dots" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className={`mobile-promo-dot ${index === 0 ? 'mobile-promo-dot--active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}

export default MobilePromoHero
