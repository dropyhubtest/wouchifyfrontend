import React, { useState, useRef } from 'react'
import { MobileHeader } from '../components/mobile/MobileHeader'
import { MobileFooter } from '../components/mobile/MobileFooter'
import { WatermarkAnimation } from '../components/hero'
import watermarkMain from '../assets/hero/hero-watermark-main.png'
import watermarkMainState2 from '../assets/hero/hero-watermark-main-state-2.png'
import styles from './MobileContactUsPage.module.css'

export const MobileContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: '',
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

    if (file.size > 1024 * 1024) {
      setFileError('File size exceeds 1MB.')
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
    <div className={styles.mobileContactPage}>
      {/* 1. Mobile Header */}
      <div className={styles.headerWrapper}>
        <MobileHeader />
      </div>

      {/* 2. Main Content */}
      <main className={styles.mainContent}>
        {/* Animated W Watermark in top right */}
        <WatermarkAnimation
          state1Src={watermarkMain}
          state2Src={watermarkMainState2}
          className={styles.watermarkWrap}
          width={140}
          height={90}
        />

        {/* Breadcrumb Heading: Back to Home */}
        <div className={styles.breadcrumb}>
          <a href="/" className={styles.backLink} aria-label="Back to home">
            &lt;&lt; Home
          </a>
        </div>

        {/* Intro Copy */}
        <div className={styles.introSection}>
          <p className={styles.salutation}>Hello!</p>
          <p className={styles.introParagraph}>
            Need help with your Coupon? Just visit the &ldquo;Customer Care&rdquo; section on the website or on the WOUCHIFY App. You could also visit the &ldquo;My Account&rdquo; section to track and manage your order.
          </p>
          <p className={styles.introParagraph}>
            Please elaborate your concern in the below, Our support team will endeavour to get back to you within 48 hours
          </p>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div className={styles.successBanner}>
            <h3 className={styles.successTitle}>Thank you, {formData.name || 'User'}!</h3>
            <p className={styles.successText}>
              Your query has been submitted successfully. We will get back to you within 48 hours.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* NAME Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="mobile-name" className={styles.label}>
                NAME
              </label>
              <input
                id="mobile-name"
                type="text"
                name="name"
                className={styles.input}
                placeholder="FULL NAME"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* EMAIL ID Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="mobile-email" className={styles.label}>
                EMAIL ID
              </label>
              <input
                id="mobile-email"
                type="email"
                name="email"
                className={styles.input}
                placeholder="ENTER EMAIL ID"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* COMMENTS Field */}
            <div className={styles.fieldGroup}>
              <label htmlFor="mobile-comments" className={styles.label}>
                COMMENTS
              </label>
              <textarea
                id="mobile-comments"
                name="comments"
                className={styles.textarea}
                placeholder="WRITE YOUR FEEDBACK"
                value={formData.comments}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Choose File */}
            <div className={styles.fileWrapper}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={styles.fileBtn}
                onClick={handleChooseFileClick}
              >
                <span>Choose File</span>
                <span>&gt;&gt;</span>
              </button>

              {selectedFile && (
                <div className={styles.fileSelected}>
                  <span>📎 {selectedFile.name}</span>
                  <button
                    type="button"
                    className={styles.fileClear}
                    onClick={handleClearFile}
                  >
                    (Remove)
                  </button>
                </div>
              )}

              {fileError && (
                <span style={{ color: '#E31E25', fontSize: '10px', marginTop: '3px' }}>
                  {fileError}
                </span>
              )}

              <div className={styles.fileSubtext}>
                <div>File type: .jpg, .pdf, .png, .jpeg</div>
                <div>
                  <strong>Allowed</strong> size: 1MB
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.submitBtn}>
              <span>Submit</span>
              <span>&gt;&gt;</span>
            </button>
          </form>
        )}
      </main>

      {/* 3. Mobile Footer */}
      <MobileFooter />
    </div>
  )
}

export default MobileContactUsPage
