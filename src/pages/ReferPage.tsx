import React, { useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { FooterSection } from '../components/footer/FooterSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './ReferPage.css'

const REFERRAL_CODE = 'WOUCHIFY-RAHUL25'
const referralHistory = [
  { id: 1, friend: 'Priya S.', date: '2023-10-10', status: 'Joined', bonus: 100 },
  { id: 2, friend: 'Rahul K.', date: '2023-09-28', status: 'Joined', bonus: 100 },
  { id: 3, friend: 'Anjali M.', date: '2023-09-15', status: 'Pending', bonus: 0 },
]

const steps = [
  { icon: '📤', title: 'Share Your Code', desc: 'Share your unique referral code with friends and family.' },
  { icon: '🛍️', title: 'Friend Signs Up', desc: 'Your friend registers on Wouchify using your referral code.' },
  { icon: '💰', title: 'Both Earn Rewards', desc: 'You get ₹100 bonus and your friend gets ₹50 on their first deal!' },
]

export const ReferPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join Wouchify!', text: `Use my referral code ${REFERRAL_CODE} on Wouchify and get ₹50 bonus cashback!`, url: 'https://wouchify.com' })
    }
  }

  return (
    <main className="refer-page">
      <div className="refer-page__header-bg" />
      <div className="refer-page__navbar-wrapper">
        {isMobile ? <MobileHeader /> : <Navbar />}
      </div>

      <div className="refer-container">
        {/* Hero Banner */}
        <div className="refer-hero">
          <div className="refer-hero__content">
            <p className="refer-hero__eyebrow">🎁 Refer & Earn</p>
            <h1 className="refer-hero__title">Invite Friends,<br />Earn Together!</h1>
            <p className="refer-hero__subtitle">
              Get <strong>₹100</strong> for every friend who joins using your code.<br />
              Your friend gets <strong>₹50</strong> bonus on their first deal!
            </p>

            <div className="refer-code-box">
              <span className="refer-code-box__code">{REFERRAL_CODE}</span>
              <button className="refer-code-box__copy" onClick={handleCopy}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div className="refer-hero__btns">
              <button className="refer-share-btn" onClick={handleShare}>📤 Share with Friends</button>
              <a className="refer-whatsapp-btn" href={`https://wa.me/?text=Join%20Wouchify%20and%20earn%20cashback%20on%20every%20purchase!%20Use%20my%20code%20${REFERRAL_CODE}%20for%20a%20₹50%20bonus.`} target="_blank" rel="noopener noreferrer">
                💬 Share on WhatsApp
              </a>
            </div>
          </div>
          <div className="refer-hero__illustration">🎉</div>
        </div>

        {/* How it works */}
        <div className="refer-steps">
          <h2 className="refer-steps__title">How It Works</h2>
          <div className="refer-steps__grid">
            {steps.map((s, i) => (
              <div key={i} className="refer-step">
                <div className="refer-step__num">{i + 1}</div>
                <div className="refer-step__icon">{s.icon}</div>
                <p className="refer-step__title">{s.title}</p>
                <p className="refer-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral history */}
        <div className="refer-history">
          <h2 className="refer-history__title">Your Referrals</h2>
          {referralHistory.length === 0 ? (
            <p className="refer-history__empty">No referrals yet. Share your code to get started!</p>
          ) : (
            <div className="refer-history__table">
              <div className="refer-history__thead">
                <span>Friend</span><span>Date</span><span>Status</span><span>Bonus</span>
              </div>
              {referralHistory.map(r => (
                <div key={r.id} className="refer-history__row">
                  <span className="refer-history__friend">{r.friend}</span>
                  <span>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className={`refer-history__status refer-history__status--${r.status.toLowerCase()}`}>{r.status}</span>
                  <span className="refer-history__bonus">{r.bonus > 0 ? `+₹${r.bonus}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </main>
  )
}

export default ReferPage
