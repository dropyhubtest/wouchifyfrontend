import React from 'react'
import marqueeTicketW from '../../assets/marquee/marquee-ticket-w.png'
import { useDesktopScale } from '../../hooks/useDesktopScale'
import './AnnouncementMarquee.css'

interface MarqueeMessage {
  id: number
  text: string
  color: string
  iconGap: number
  trailingGap: number
}

const MARQUEE_MESSAGES: MarqueeMessage[] = [
  {
    id: 1,
    text: 'Indias Fastest Growing Deal Community',
    color: '#E31E25',
    iconGap: 27,
    trailingGap: 35,
  },
  {
    id: 2,
    text: 'No Signup Required- Grab and go!',
    color: '#2A3189',
    iconGap: 35,
    trailingGap: 27,
  },
  {
    id: 3,
    text: 'Save upto 90% on Top Brand Stores',
    color: '#E31E25',
    iconGap: 27,
    trailingGap: 27,
  },
  {
    id: 4,
    text: 'Daily Loot Deals and added Every hour',
    color: '#2A3189',
    iconGap: 27,
    trailingGap: 34,
  },
]

// Repeat the 4-message sequence 4 times for seamless overflow
const REPETITION_COUNT = 4

export const AnnouncementMarquee: React.FC = () => {
  const marqueeScale = useDesktopScale()

  return (
    <section
      className="announcement-marquee"
      aria-label="Announcements"
      style={
        {
          '--marquee-scale': marqueeScale,
          height: `${110 * marqueeScale}px`,
        } as React.CSSProperties
      }
    >
      {/* 1920 x 110 Reference Canvas */}
      <div className="announcement-marquee__canvas">
        {/* Navy Outline Strip */}
        <div className="announcement-marquee__outline" aria-hidden="true" />

        {/* Viewport & Moving Track */}
        <div className="announcement-marquee__viewport">
          <div
            className="announcement-marquee__track"
            role="region"
            aria-label="Announcement ticker"
          >
            {Array.from({ length: REPETITION_COUNT }).map((_, cycleIndex) => (
              <React.Fragment key={cycleIndex}>
                {MARQUEE_MESSAGES.map((msg) => (
                  <div
                    key={`${cycleIndex}-${msg.id}`}
                    className="announcement-marquee__item"
                    style={{ marginRight: `${msg.trailingGap}px` }}
                  >
                    <img
                      src={marqueeTicketW}
                      alt=""
                      aria-hidden="true"
                      className="announcement-marquee__ticket"
                    />
                    <span
                      className="announcement-marquee__message"
                      style={{
                        color: msg.color,
                        marginLeft: `${msg.iconGap}px`,
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnnouncementMarquee
