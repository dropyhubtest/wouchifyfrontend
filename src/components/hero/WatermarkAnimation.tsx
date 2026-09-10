import React from 'react'
import './WatermarkAnimation.css'

interface WatermarkAnimationProps {
  state1Src: string
  state2Src: string
  className?: string
  width?: number | string
  height?: number | string
}

export const WatermarkAnimation: React.FC<WatermarkAnimationProps> = ({
  state1Src,
  state2Src,
  className = '',
  width = 403,
  height = 266,
}) => {
  const styleWidth = typeof width === 'number' ? `${width}px` : width
  const styleHeight = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`watermark-animation-wrapper ${className}`}
      style={{ width: styleWidth, height: styleHeight }}
      aria-hidden="true"
    >
      <img
        src={state1Src}
        alt=""
        className="watermark-img watermark-img-state-1"
      />
      <img
        src={state2Src}
        alt=""
        className="watermark-img watermark-img-state-2"
      />
    </div>
  )
}

export default WatermarkAnimation
