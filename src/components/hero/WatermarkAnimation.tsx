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
  return (
    <div className={`watermark-animation-wrapper ${className}`} aria-hidden="true">
      <img
        src={state1Src}
        alt=""
        className="watermark-img watermark-img-state-1"
        width={width}
        height={height}
      />
      <img
        src={state2Src}
        alt=""
        className="watermark-img watermark-img-state-2"
        width={width}
        height={height}
      />
    </div>
  )
}

export default WatermarkAnimation
