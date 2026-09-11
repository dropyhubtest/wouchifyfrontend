import React from 'react'
import accountCircleIcon from '../../assets/profile/account_circle.png'
import ordersIcon from '../../assets/profile/orders.png'
import favoriteIcon from '../../assets/profile/favorite.png'
import walletIcon from '../../assets/profile/wallet.png'
import notificationsIcon from '../../assets/profile/notifications.png'
import referIcon from '../../assets/profile/refer.png'
import './ProfileSidebar.css'

export type ProfileTabId = 'profile' | 'orders' | 'wishlist' | 'wallet' | 'notifications' | 'refer'

interface ProfileSidebarProps {
  activeTab?: ProfileTabId
  showQuickAccess?: boolean
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab = 'profile',
  showQuickAccess = false,
}) => {
  const sidebarButtons = [
    {
      id: 'profile' as ProfileTabId,
      label: 'My Profile',
      href: '/profile',
      icon: accountCircleIcon,
    },
    {
      id: 'orders' as ProfileTabId,
      label: 'My Orders',
      href: '/orders',
      icon: ordersIcon,
    },
    {
      id: 'wishlist' as ProfileTabId,
      label: 'Wishlist',
      href: '/favorites',
      icon: favoriteIcon,
    },
    {
      id: 'wallet' as ProfileTabId,
      label: 'My Wallet',
      href: '/wallet',
      icon: walletIcon,
    },
    {
      id: 'notifications' as ProfileTabId,
      label: 'Notifications',
      href: '/notifications',
      icon: notificationsIcon,
    },
    {
      id: 'refer' as ProfileTabId,
      label: 'Refer & Earn',
      href: '/refer',
      icon: referIcon,
    },
  ]

  return (
    <aside className="profile-sidebar" aria-label="Account Sidebar Navigation">
      <div className="profile-sidebar__pills">
        {sidebarButtons.map((btn) => {
          const isActive = activeTab === btn.id
          return (
            <a
              key={btn.id}
              href={btn.href}
              className={`profile-sidebar__pill ${isActive ? 'profile-sidebar__pill--active' : 'profile-sidebar__pill--red'}`}
            >
              <img src={btn.icon} alt="" className="profile-sidebar__pill-img" />
              <span className="profile-sidebar__pill-text">{btn.label}</span>
            </a>
          )
        })}
      </div>

      {showQuickAccess && (
        <div className="profile-sidebar__quick-access">
          <div className="profile-sidebar__quick-indicator" aria-hidden="true" />
          <h2 className="profile-sidebar__quick-title">Quick Access</h2>
        </div>
      )}
    </aside>
  )
}

export default ProfileSidebar


