import React, { useEffect, useState } from 'react'
import './WelcomeToast.css'

export const WelcomeToast: React.FC = () => {
  const [show, setShow] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const justLoggedIn = localStorage.getItem('just_logged_in')
    const userInfo = localStorage.getItem('userInfo')

    if (justLoggedIn === 'true' && userInfo) {
      const parsed = JSON.parse(userInfo)
      setUserName(parsed.fullName || parsed.email || 'User')
      setShow(true)
      localStorage.removeItem('just_logged_in')

      // Auto-hide after 4 seconds
      const timer = setTimeout(() => setShow(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="welcome-toast">
      <div className="welcome-toast__icon">👋</div>
      <div className="welcome-toast__content">
        <p className="welcome-toast__title">Welcome back!</p>
        <p className="welcome-toast__name">{userName}</p>
      </div>
      <button className="welcome-toast__close" onClick={() => setShow(false)}>✕</button>
    </div>
  )
}
