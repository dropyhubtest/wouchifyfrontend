import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { ReferHero } from '../components/refer/ReferHero'
import { useMediaQuery } from '../hooks/useMediaQuery'
import stepsIllustration from '../assets/refer/main.png'
import './ReferPage.css'

interface ReferralHistoryItem {
  id: number
  friend: string
  date: string
  status: 'Joined' | 'Pending'
  bonus: string
  variant: 'blue' | 'peach'
}

const REFERRAL_HISTORY: ReferralHistoryItem[] = [
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

const STEPS_DATA = [
  {
    id: 1,
    title: 'Share Your Code',
    description: 'Share your unique referral code with friends and family.',
  },
  {
    id: 2,
    title: 'Friend Signs Up',
    description: 'Your friend registers on Wouchify using your referral code.',
  },
  {
    id: 3,
    title: 'Both Earn Rewards',
    description: 'You get ₹100 bonus and your friend gets ₹50 on their first deal!',
  },
]

export const ReferPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <main className="refer-page">
      {/* Top Navbar */}
      <div className="refer-page__navbar">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      {/* Hero Section */}
      <ReferHero referralCode="WOUCHIFY-RAHUL25" />

      {/* Main Body: Sidebar + 3-Step Process */}
      <section className="refer-main" aria-label="Refer and Earn Program">
        <div className="refer-top-section">
          {/* Profile Sidebar (Active: Refer & Earn) */}
          <ProfileSidebar activeTab="refer" />

          {/* 3-Step Referral Process Illustration & Cards */}
          <div className="refer-steps-container">
            {/* Steps Illustration Banner */}
            <div className="refer-steps-banner-wrap">
              <img
                src={stepsIllustration}
                alt="3 Steps: Share Your Code, Friend Signs Up, Both Earn Rewards"
                className="refer-steps-banner-img"
              />
            </div>

            {/* 3 Step Cards Grid */}
            <div className="refer-steps-cards-grid">
              {STEPS_DATA.map((step) => (
                <article key={step.id} className="refer-step-card">
                  <h2 className="refer-step-card__title">{step.title}</h2>
                  <p className="refer-step-card__desc">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Your Referrals Section - Full Viewport Width */}
        <div className="refer-history-section">
          {/* Section Heading with Decorative Half-Pill */}
          <div className="refer-history-header">
            <div className="refer-history-indicator" aria-hidden="true" />
            <h2 className="refer-history-title">Your Referrals</h2>
          </div>

          {/* Referrals Table / Cards Stack */}
          <div className="refer-table-container">
            {/* Table Column Headers */}
            <div className="refer-table-header-row">
              <span className="refer-th">FRIEND</span>
              <span className="refer-th">DATE</span>
              <span className="refer-th">STATUS</span>
              <span className="refer-th">BONUS</span>
            </div>

            {/* Table Rows */}
            <div className="refer-table-rows">
              {REFERRAL_HISTORY.map((item) => {
                const isPeach = item.variant === 'peach'
                return (
                  <div
                    key={item.id}
                    className={`refer-table-card ${isPeach ? 'refer-table-card--peach' : 'refer-table-card--blue'}`}
                  >
                    <span className="refer-td refer-td--friend">{item.friend}</span>
                    <span className="refer-td refer-td--date">{item.date}</span>
                    <span className="refer-td refer-td--status">{item.status}</span>
                    <span className="refer-td refer-td--bonus">{item.bonus}</span>
                  </div>
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

export default ReferPage
