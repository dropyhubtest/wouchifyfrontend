import React, { useState, useRef } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { NotificationsHero } from '../components/notifications/NotificationsHero'
import { useMediaQuery } from '../hooks/useMediaQuery'
import amazonLogo from '../assets/notifications/amazon.png'
import flipkartLogo from '../assets/notifications/flipkart.png'
import ajioLogo from '../assets/notifications/ajio.png'
import myntraLogo from '../assets/notifications/myntra.png'
import './NotificationsPage.css'

interface NotificationItem {
  id: number
  title: string
  description: string
  time: string
  logo: string
  logoAlt: string
}

const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 1,
    logo: amazonLogo,
    logoAlt: 'Amazon',
    title: 'Cashback Confirmed!',
    description: 'Your ₹800 cashback from Amazon has been confirmed.',
    time: '2hrs ago',
  },
  {
    id: 2,
    logo: flipkartLogo,
    logoAlt: 'Flipkart',
    title: 'New Deal Alert!',
    description: 'Myntra End of Season Sale is LIVE — up to 70% off!',
    time: '5hrs ago',
  },
  {
    id: 3,
    logo: ajioLogo,
    logoAlt: 'Ajio',
    title: 'Pending Cashback',
    description: 'Your ₹350 cashback from Flipkart is pending confirmation.',
    time: 'Yesterday',
  },
  {
    id: 4,
    logo: myntraLogo,
    logoAlt: 'Myntra',
    title: 'Flash Sale Starts Now',
    description: 'Wouchify Flash Loot deals are live for the next 4 hours only!',
    time: 'Yesterday',
  },
]

export const NotificationsPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [selectedId, setSelectedId] = useState<number | null>(null) // No default blue background, only on hover/click
  const contentSectionRef = useRef<HTMLDivElement | null>(null)

  const handleScrollToContent = () => {
    if (contentSectionRef.current) {
      contentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="notifications-page">
      {/* Top Navbar */}
      <div className="notifications-page__navbar">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      {/* Hero Section */}
      <NotificationsHero onCheckNowClick={handleScrollToContent} />

      {/* Main Content Area: Sidebar + Notification Cards */}
      <section
        ref={contentSectionRef}
        className="notifications-main"
        aria-label="User Notifications"
      >
        <div className="notifications-layout">
          {/* Account Profile Sidebar (Active tab: notifications) */}
          <ProfileSidebar activeTab="notifications" />

          {/* Notification Cards Column */}
          <div className="notifications-content">
            <div className="notifications-list">
              {NOTIFICATION_ITEMS.map((item) => {
                const isSelected = selectedId === item.id
                return (
                  <article
                    key={item.id}
                    className={`notification-card ${isSelected ? 'notification-card--active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedId(item.id)
                      }
                    }}
                  >
                    {/* Store Logo Container */}
                    <div className="notification-card__logo-wrap">
                      <img
                        src={item.logo}
                        alt={item.logoAlt}
                        className="notification-card__logo-img"
                      />
                    </div>

                    {/* Middle Copy Block */}
                    <div className="notification-card__body">
                      <h2 className="notification-card__title">{item.title}</h2>
                      <p className="notification-card__desc">{item.description}</p>
                    </div>

                    {/* Right Timestamp */}
                    <div className="notification-card__meta">
                      <span className="notification-card__time">{item.time}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <FooterSection />
    </main>
  )
}

export default NotificationsPage
