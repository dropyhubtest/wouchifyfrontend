import React, { useState } from 'react'
import type { FAQItem } from '../../data/faqData'
import './FAQCard.css'

interface FAQCardProps {
  item: FAQItem
}

export const FAQCard: React.FC<FAQCardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleToggle = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div
      className={`faq-card-wrapper ${isFlipped ? 'is-flipped' : ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Question: ${item.question}. Click or hover to view answer.`}
    >
      <div className="faq-card-inner">
        {/* Front Face: Question */}
        <div className={`faq-card-face faq-card-front theme-${item.theme}`}>
          <h2 className="faq-card-question-text">{item.question}</h2>
        </div>

        {/* Back Face: Answer */}
        <div className="faq-card-face faq-card-back">
          <p className="faq-card-answer-text">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default FAQCard
