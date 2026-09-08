import React from 'react'
import './RegistrationSuccessModal.css'

interface Props {
  userName: string
  onClose: () => void
}

export const RegistrationSuccessModal: React.FC<Props> = ({ userName, onClose }) => {
  return (
    <div className="reg-modal__overlay" onClick={onClose}>
      <div className="reg-modal__box" onClick={(e) => e.stopPropagation()}>
        <div className="reg-modal__icon">🎉</div>
        <h2 className="reg-modal__title">Successfully Registered!</h2>
        <p className="reg-modal__subtitle">Welcome to Wouchify</p>
        <p className="reg-modal__name">{userName}</p>
        <p className="reg-modal__desc">Your account has been created. Please login with your Google account to continue.</p>
        <button className="reg-modal__btn" onClick={onClose}>
          Proceed to Login →
        </button>
      </div>
    </div>
  )
}
