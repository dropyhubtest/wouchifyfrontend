import React from 'react'
import {
  MOBILE_ADVERTISEMENTS,
  type MobileAdvertisementItem,
} from '../../data/mobileAdvertisements'
import wouchifyWordmark from '../../assets/mobile/wouchify-mobile-cropped-v2.png'
import './MobileAdvertisement.css'

interface MobileAdvertisementCardProps {
  advertisement: MobileAdvertisementItem
}

const MobileAdvertisementCard: React.FC<MobileAdvertisementCardProps> = ({
  advertisement,
}) => {
  return (
    <a
      href={advertisement.href}
      className="mobile-advertisement__link"
      aria-label={advertisement.title}
    >
      <img
        className="mobile-advertisement__brand-logo"
        src={wouchifyWordmark}
        alt="Wouchify"
      />
      <img
        src={advertisement.image}
        alt={advertisement.alt}
        className="mobile-advertisement__image"
        loading="lazy"
      />
    </a>
  )
}

export const MobileAdvertisement: React.FC = () => {
  return (
    <section className="mobile-advertisement" aria-label="Advertisement">
      {MOBILE_ADVERTISEMENTS.map((ad) => (
        <MobileAdvertisementCard key={ad.id} advertisement={ad} />
      ))}
    </section>
  )
}

export default MobileAdvertisement
