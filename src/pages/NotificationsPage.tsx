import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './NotificationsPage.css'

interface Notification {
  id: number; type: 'deal' | 'cashback' | 'alert'; title: string; body: string; time: string; read: boolean
}

const initNotifs: Notification[] = [
  { id: 1, type: 'cashback', title: '💰 Cashback Confirmed!', body: 'Your ₹800 cashback from Amazon has been confirmed.', time: '2 hrs ago', read: false },
  { id: 2, type: 'deal', title: '🔥 New Deal Alert', body: 'Myntra End of Season Sale is LIVE — up to 70% off!', time: '5 hrs ago', read: false },
  { id: 3, type: 'alert', title: '⚠️ Pending Cashback', body: 'Your ₹350 cashback from Flipkart is pending confirmation.', time: 'Yesterday', read: true },
  { id: 4, type: 'deal', title: '⚡ Flash Sale Starts Now', body: 'Wouchify Flash Loot deals are live for the next 4 hours only!', time: 'Yesterday', read: true },
  { id: 5, type: 'cashback', title: '🎉 Referral Bonus!', body: 'Your friend Priya joined Wouchify. You earned ₹100 bonus!', time: '3 days ago', read: true },
]

export const NotificationsPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [notifs, setNotifs] = useState<Notification[]>(initNotifs)

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const clearAll = () => setNotifs([])
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <main className="notifs-page">
      <div className="notifs-page__header-bg" />
      <div className="notifs-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="notifs-container">
        <div className="notifs-page-header">
          <div>
            <h1>🔔 Notifications</h1>
            <p>{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
          </div>
          <div className="notifs-actions">
            {unreadCount > 0 && <button className="notifs-btn" onClick={markAllRead}>Mark all read</button>}
            {notifs.length > 0 && <button className="notifs-btn notifs-btn--danger" onClick={clearAll}>Clear all</button>}
          </div>
        </div>

        {notifs.length === 0 ? (
          <div className="notifs-empty">
            <div className="notifs-empty__icon">🔔</div>
            <h2>No notifications</h2>
            <p>We'll notify you about deals, cashback updates and more!</p>
          </div>
        ) : (
          <div className="notifs-list">
            {notifs.map(n => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''}`}
                onClick={() => markRead(n.id)}
              >
                <div className={`notif-item__dot ${n.type}`} />
                <div className="notif-item__content">
                  <p className="notif-item__title">{n.title}</p>
                  <p className="notif-item__body">{n.body}</p>
                  <p className="notif-item__time">{n.time}</p>
                </div>
                {!n.read && <div className="notif-item__unread-badge" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  )
}

export default NotificationsPage
