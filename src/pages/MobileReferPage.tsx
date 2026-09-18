import React, { useState, useMemo } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import accountCircleIcon from '../assets/profile/account_circle.png'
import ordersIcon from '../assets/profile/orders.png'
import favoriteIcon from '../assets/profile/favorite.png'
import walletIcon from '../assets/profile/wallet.png'
import notificationsIcon from '../assets/profile/notifications.png'
import referIcon from '../assets/profile/refer.png'
import stepsIllustration from '../assets/refer/main.png'
import styles from './MobileReferPage.module.css'

interface ReferralHistoryItem {
  id: number
  friend: string
  date: string
  status: 'Joined' | 'Pending'
  bonus: string
  variant: 'blue' | 'peach'
}

const DEFAULT_REFERRALS: ReferralHistoryItem[] = [
  {
    id: 1,
    friend: 'Priya S.',
    date: '10 Oct 2023',
    status: 'Joined',
    bonus: '+₹100',
    variant: 'blue',
  },
  {
    id: 2,
    friend: 'Rahul K.',
    date: '28 Sept 2023',
    status: 'Joined',
    bonus: '+₹100',
    variant: 'peach',
  },
  {
    id: 3,
    friend: 'Anjali M.',
    date: '15 Sept 2023',
    status: 'Pending',
    bonus: '—',
    variant: 'blue',
  },
]

const NAV_PILLS = [
  { id: 'profile', label: 'My Profile', href: '/profile', icon: accountCircleIcon, active: false },
  { id: 'orders', label: 'My Orders', href: '/orders', icon: ordersIcon, active: false },
  { id: 'wishlist', label: 'Wishlist', href: '/favorites', icon: favoriteIcon, active: false },
  { id: 'wallet', label: 'My Wallet', href: '/wallet', icon: walletIcon, active: false },
  { id: 'notifications', label: 'Notifications', href: '/notifications', icon: notificationsIcon, active: false },
  { id: 'refer', label: 'Refer & Earn', href: '/refer', icon: referIcon, active: true },
]

const STEPS_DATA = [
  {
    id: 1,
    title: 'Share Your Code',
    description: 'Share your unique referral code with friends and family.',
    position: '0% 50%',
  },
  {
    id: 2,
    title: 'Friend Signs Up',
    description: 'Your friend registers on Wouchify using your referral code.',
    position: '50% 50%',
  },
  {
    id: 3,
    title: 'Both Earn Rewards',
    description: 'You get ₹100 bonus and your friend gets ₹50 on their first deal!',
    position: '100% 50%',
  },
]

export const MobileReferPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const referralCode = 'WOUCHIFY - RAHUL25'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode.replace(/\s+/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Wouchify',
        text: `Use my referral code ${referralCode.replace(/\s+/g, '')} to get ₹50 bonus on Wouchify!`,
        url: window.location.origin,
      }).catch(() => {})
    } else {
      const text = encodeURIComponent(
        `Join Wouchify with my referral code ${referralCode.replace(/\s+/g, '')} and get ₹50 bonus! ${window.location.origin}`
      )
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
    }
  }

  const filteredReferrals = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_REFERRALS
    const q = searchQuery.toLowerCase().trim()
    return DEFAULT_REFERRALS.filter(
      (item) =>
        item.friend.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.bonus.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className={styles.mobileReferPage}>
      {/* 1. Mobile Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Top Breadcrumb link */}
      <div className={styles.topNavWrap}>
        <a href="/" className={styles.breadcrumbLink} aria-label="Back to Home">
          <span className={styles.chevron}>&lt;&lt;</span>{' '}
          <span className={styles.breadcrumbTitle}>Home</span>
        </a>
      </div>

      {/* 3. Search Bar */}
      <div className={styles.searchBarWrap}>
        <input
          type="text"
          placeholder="Search coupons.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search coupons"
        />
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1F2937"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* 4. 2x3 Navigation Pills Grid */}
      <nav className={styles.pillsGrid} aria-label="Account Navigation">
        {NAV_PILLS.map((pill) => (
          <a
            key={pill.id}
            href={pill.href}
            className={`${styles.pillLink} ${pill.active ? styles.pillActive : styles.pillRed}`}
          >
            <img src={pill.icon} alt="" className={styles.pillIcon} />
            <span className={styles.pillText}>{pill.label}</span>
          </a>
        ))}
      </nav>

      {/* 5. Refer & Earn Hero Card */}
      <section className={styles.heroCardSection} aria-label="Refer and Earn Promotion">
        <div className={styles.heroCard}>
          <div className={styles.tagBadge}>Refer &amp; Earn</div>
          <h1 className={styles.heroTitle}>Invite Friends, Earn Together!</h1>
          <p className={styles.heroSubtitle}>
            Get ₹100 for every friend who joins using your code. Your friend gets ₹50 bonus on your first deal!
          </p>

          <div className={styles.heroActionsRow}>
            {/* Referral Code Copy Button */}
            <button
              type="button"
              className={styles.codeCopyBtn}
              onClick={handleCopy}
              aria-label="Copy Referral Code"
            >
              <span className={styles.codeText}>{copied ? 'COPIED!' : referralCode}</span>
              <svg
                className={styles.copySvg}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>

            {/* Share with Friends Button */}
            <button
              type="button"
              className={styles.shareBtn}
              onClick={handleShareFriends}
              aria-label="Share with Friends"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span>Share with friends</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. How it Works / Steps Section */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIndicator} aria-hidden="true" />
        <h2 className={styles.sectionTitle}>Your Cashback</h2>
      </div>

      <section className={styles.stepsSection} aria-label="How Referral Program Works">
        <div className={styles.stepsWrapper}>
          {/* Single continuous steps illustration image */}
          <div className={styles.singleBannerWrap}>
            <img
              src={stepsIllustration}
              alt="How it works: Share Your Code, Friend Signs Up, Both Earn Rewards"
              className={styles.singleBannerImg}
            />
          </div>

          {/* 3 Step Cards positioned directly beneath the respective parts of the image */}
          <div className={styles.stepCardsRow}>
            {STEPS_DATA.map((step) => (
              <div key={step.id} className={styles.stepInfoCard}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Referral History Section */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIndicator} aria-hidden="true" />
        <h2 className={styles.sectionTitle}>Your Cashback</h2>
      </div>

      <section className={styles.referralsHistorySection} aria-label="Referral History">
        <div className={styles.tableContainer}>
          {/* Table Header Row */}
          <div className={styles.tableHeaderRow} role="row">
            <div className={`${styles.th} ${styles.thFriend}`}>FRIEND</div>
            <div className={`${styles.th} ${styles.thDate}`}>DATE</div>
            <div className={`${styles.th} ${styles.thStatus}`}>STATUS</div>
            <div className={`${styles.th} ${styles.thBonus}`}>BONUS</div>
          </div>

          {/* Table Body */}
          <div className={styles.tableBody}>
            {filteredReferrals.map((item) => {
              const isPeach = item.variant === 'peach'
              return (
                <div
                  key={item.id}
                  className={`${styles.tableRow} ${isPeach ? styles.rowPeach : styles.rowBlue}`}
                  role="row"
                >
                  <div className={`${styles.td} ${styles.tdFriend}`}>{item.friend}</div>
                  <div className={`${styles.td} ${styles.tdDate}`}>{item.date}</div>
                  <div className={`${styles.td} ${styles.tdStatus}`}>{item.status}</div>
                  <div className={`${styles.td} ${styles.tdBonus}`}>{item.bonus}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileReferPage
