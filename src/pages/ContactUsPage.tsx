import React, { useState, useRef } from 'react'
import { Navbar } from '../components/layout'
import { FooterSection } from '../components/footer'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import './ContactUsPage.css'

export const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1MB limit check (1 * 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setFileError('File size exceeds 1MB. Please choose a smaller file.')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setFileError('')
    setSelectedFile(file)
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChooseFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      {/* 1. Desktop Navbar */}
      <Navbar />

      {/* 2. Main Container */}
      <main className="contact-page__container">
        {/* Animated W Watermark in top right */}
        <div className="contact-page__watermark-wrap">
          <WatermarkAnimation
            state1Src={watermarkMain}
            state2Src={watermarkMainState2}
            width={220}
            height={140}
          />
        </div>

        {/* Header Content */}
        <div className="contact-page__header">
          <h1 className="contact-page__title">Contact Us</h1>
          <p className="contact-page__salutation">Hello!</p>
          <p className="contact-page__desc">
            Need help with your Coupon? Just visit the &ldquo;Customer Care&rdquo; section on the website or on the WOUCHIFY App. You could also visit the &ldquo;My Account&rdquo; section to track and manage your order.
          </p>
          <p className="contact-page__desc">
            Please elaborate your concern in the <strong>below</strong>, Our support team will endeavour to get back to you within 48 hours
          </p>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div className="contact-page__success-banner">
            <h3 className="contact-page__success-title">Thank you, {formData.name || 'User'}!</h3>
            <p className="contact-page__success-text">
              Your query has been submitted successfully. Our support team will review your message and get back to you within 48 hours.
            </p>
          </div>
        ) : (
          <form className="contact-page__form" onSubmit={handleSubmit}>
            {/* Row 1: Name and Email Id */}
            <div className="contact-page__grid-row">
              <div className="contact-page__field-group">
                <label htmlFor="contact-name" className="contact-page__label">
                  Name:
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="contact-page__input"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="contact-page__field-group">
                <label htmlFor="contact-email" className="contact-page__label">
                  Email Id:
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="contact-page__input"
                  placeholder="Full name"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Query */}
            <div className="contact-page__field-group">
              <label htmlFor="contact-query" className="contact-page__label">
                Query:
              </label>
              <textarea
                id="contact-query"
                name="query"
                className="contact-page__textarea"
                placeholder="Write your query in detail"
                value={formData.query}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Row 3: Choose File & Submit Button */}
            <div className="contact-page__actions-row">
              <div className="contact-page__file-wrapper">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="contact-page__file-input"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="contact-page__file-btn"
                  onClick={handleChooseFileClick}
                >
                  <span>Choose File</span>
                  <span>&gt;&gt;</span>
                </button>

                {selectedFile && (
                  <div className="contact-page__file-selected">
                    <span>📎 {selectedFile.name}</span>
                    <button
                      type="button"
                      className="contact-page__file-clear"
                      onClick={handleClearFile}
                    >
                      (Remove)
                    </button>
                  </div>
                )}

                {fileError && (
                  <span style={{ color: '#E31E25', fontSize: '12px', marginTop: '4px' }}>
                    {fileError}
                  </span>
                )}

                <div className="contact-page__file-subtext">
                  <div>file type: .jpg, .pdf, .png, .jpeg</div>
                  <div>
                    <strong>Allowed</strong> size: 1MB
                  </div>
                </div>
              </div>

              <button type="submit" className="contact-page__submit-btn">
                <span>Submit</span>
                <span>&gt;&gt;</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* 3. Desktop Footer */}
      <FooterSection />
    </div>
  )
}

export default ContactUsPage

