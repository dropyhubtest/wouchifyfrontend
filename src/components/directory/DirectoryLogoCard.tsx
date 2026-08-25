import React from 'react'
import './DirectoryLogoCard.css'

export interface GenericDirectoryItem {
  id: string
  name: string
  slug: string
  logo?: string
  image?: string
  destinationHref?: string
}

interface DirectoryLogoCardProps {
  item?: GenericDirectoryItem
  store?: GenericDirectoryItem
  brand?: GenericDirectoryItem
  festival?: GenericDirectoryItem
  city?: GenericDirectoryItem
  onClick?: (item: GenericDirectoryItem) => void
}

export const DirectoryLogoCard: React.FC<DirectoryLogoCardProps> = ({
  item,
  store,
  brand,
  festival,
  city,
  onClick,
}) => {
  const data = item || store || brand || festival || city

  if (!data) return null

  const imgSrc = data.logo || data.image

  return (
    <a
      href={data.destinationHref || `/directory/${data.slug}`}
      className="directory-logo-card"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick(data)
        }
      }}
      title={data.name}
    >
      <div className="directory-logo-card__logo-area">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={data.name}
            className="directory-logo-card__logo"
            loading="lazy"
          />
        ) : null}
      </div>

      <h4 className="directory-logo-card__title">{data.name}</h4>
    </a>
  )
}

export default DirectoryLogoCard
