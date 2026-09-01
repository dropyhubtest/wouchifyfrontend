import React from 'react'
import './HangingPromoCard.css'

export const HangingPromoTags: React.FC = () => {
  return (
    <div className="deals-hanging-container" aria-hidden="true">
      {/* Tag 1 (Left - 70% Off): left: 24%, string: 140px */}
      <div className="hanging-item item-70">
        <div className="sway-left">
          <div className="string" style={{ height: '140px' }} />
          <div className="tag-70">
            <span className="tag-70__val">70%</span>
            <span className="tag-70__sub">off</span>
          </div>
        </div>
      </div>

      {/* Tag 2 (Center-Left - ₹300 Off): left: 43.5%, string: 155px, z-index: 20 */}
      <div className="hanging-item item-300">
        <div className="sway-clockwise">
          <div className="string" style={{ height: '155px' }} />
          <div className="tag-300">
            <span className="tag-300__val">₹300</span>
            <span className="tag-300__sub">off</span>
          </div>
        </div>
      </div>

      {/* Tag 3 (Center-Right - 25% Rewards): left: 47.5%, string: 235px, z-index: 10 */}
      <div className="hanging-item item-25">
        <div className="sway-counter">
          <div className="string" style={{ height: '235px' }} />
          <div className="tag-25">
            <span className="tag-25__val">25%</span>
            <span className="tag-25__sub">rewards!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HangingPromoTags
