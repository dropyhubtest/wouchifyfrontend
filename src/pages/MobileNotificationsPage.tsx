import React, { useState, useMemo } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import accountCircleIcon from '../assets/profile/account_circle.png'
import ordersIcon from '../assets/profile/orders.png'
import favoriteIcon from '../assets/profile/favorite.png'
import walletIcon from '../assets/profile/wallet.png'
import notificationsIcon from '../assets/profile/notifications.png'
import referIcon from '../assets/profile/refer.png'
import amazonLogo from '../assets/notifications/amazon.png'
import myntraLogo from '../assets/notifications/myntra.png'
import ajioLogo from '../assets/notifications/ajio.png'
import flipkartLogo from '../assets/notifications/flipkart.png'
import styles from './MobileNotificationsPage.module.css'

interface NotificationItem {
  id: number
  logo: string
  logoAlt: string
  title: string
  description: string
  time: string
  isActive?: boolean
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    logo: amazonLogo,
    logoAlt: 'Amazon',
    title: 'Cashback Confirmed!',
    description: 'Your ₹800 cashback from Amazon has been confirmed.',
    time: '2hrs ago',
    isActive: false,
  },
  {
    id: 2,
    logo: myntraLogo,
    logoAlt: 'Myntra',
    title: 'New Deal Alert!',
    description: 'Myntra End of Season Sale is LIVE — up to 70% off!',
    time: '5hr ago',
    isActive: true,
  },
  {
    id: 3,
    logo: ajioLogo,
    logoAlt: 'Ajio',
    title: 'Flash Sale Starts Now',
    description: 'Your ₹350 cashback from Ajio is pending confirmation.',
    time: 'Yesterday',
    isActive: false,
  },
  {
    id: 4,
    logo: flipkartLogo,
    logoAlt: 'Flipkart',
    title: 'Pending Cashback',
    description: 'Wouchify Flash Loot deals are live for the next 4 hours only!',
    time: 'Yesterday',
    isActive: false,
  },
]

const NAV_PILLS = [
  { id: 'profile', label: 'My Profile', href: '/profile', icon: accountCircleIcon, active: false },
  { id: 'orders', label: 'My Orders', href: '/orders', icon: ordersIcon, active: false },
  { id: 'wishlist', label: 'Wishlist', href: '/favorites', icon: favoriteIcon, active: false },
  { id: 'wallet', label: 'My Wallet', href: '/wallet', icon: walletIcon, active: false },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: notificationsIcon, active: true },
  { id: 'refer', label: 'Refer & Earn', href: '/refer', icon: referIcon, active: false },
]

export const MobileNotificationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filteredNotifications = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_NOTIFICATIONS
    const q = searchQuery.toLowerCase().trim()
    return DEFAULT_NOTIFICATIONS.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.logoAlt.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className={styles.mobileNotificationsPage}>
      {/* Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* Top Breadcrumb Navigation Link */}
      <div className={styles.topNavWrap}>
        <a href="/" className={styles.breadcrumbLink}>
          <span className={styles.chevron}>&lt;&lt;</span>
          <span className={styles.breadcrumbTitle}>Home</span>
        </a>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBarWrap}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search notifications, stores, deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* 2x3 Navigation Pills Grid */}
      <nav className={styles.pillsGrid} aria-label="Account navigation">
        {NAV_PILLS.map((pill) => (
          <a
            key={pill.id}
            href={pill.href}
            className={`${styles.pillLink} ${pill.active ? styles.pillActive : styles.pillRed}`}
          >
            <img src={pill.icon} alt="" className={styles.pillIcon} aria-hidden="true" />
            <span className={styles.pillText}>{pill.label}</span>
          </a>
        ))}
      </nav>

      {/* Section Header: Semi-circle indicator + Your Notifications */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIndicator} aria-hidden="true" />
        <h1 className={styles.sectionTitle}>Your Notifications</h1>
      </div>

      {/* Notifications List */}
      <section className={styles.notificationsListSection} aria-label="Notifications List">
        <div className={styles.notificationsList}>
          {filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isSelected = selectedId === item.id
              return (
                <article
                  key={item.id}
                  className={`${styles.notificationCard} ${isSelected ? styles.notificationCardActive : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedId(item.id)
                    }
                  }}
                >
                  <div className={styles.logoContainer}>
                    <img src={item.logo} alt={item.logoAlt} className={styles.brandLogo} />
                  </div>
                  <div className={styles.contentWrap}>
                    <div className={styles.cardHeaderRow}>
                      <h2 className={styles.notificationTitle}>{item.title}</h2>
                      <span className={styles.timeTag}>{item.time}</span>
                    </div>
                    <p className={styles.notificationDescription}>{item.description}</p>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileNotificationsPage
